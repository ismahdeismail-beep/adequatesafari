import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Payment, PaymentStatus, PaymentProvider, PaymentMethod, BookingStatus } from '@prisma/client';
import Stripe from 'stripe';
import * as crypto from 'crypto';
import { BookingsService } from '../bookings/bookings.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private stripe: Stripe;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private bookingsService: BookingsService,
  ) {
    const stripeKey = this.config.get<string>('stripe.secretKey');
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, {
        apiVersion: this.config.get<string>('stripe.apiVersion') as Stripe.LatestApiVersion,
      });
    }
  }

  // ===== Stripe =====
  async createStripePaymentIntent(bookingId: string, userId: string) {
    const booking = await this.bookingsService.findById(bookingId, true);
    if (booking.userId !== userId) {
      throw new BadRequestException('Not authorized');
    }
    if (booking.paymentStatus === 'PAID') {
      throw new BadRequestException('Booking already paid');
    }

    const amount = Math.round(Number(booking.totalAmount) * 100); // Stripe uses cents

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: booking.currency.toLowerCase(),
      metadata: {
        bookingId,
        bookingRef: booking.bookingRef,
        userId,
      },
      automatic_payment_methods: { enabled: true },
    });

    // Create payment record
    await this.prisma.payment.create({
      data: {
        paymentRef: this.generatePaymentRef('STRIPE'),
        bookingId,
        userId,
        amount: booking.totalAmount,
        currency: booking.currency,
        provider: 'STRIPE',
        providerRef: paymentIntent.id,
        status: 'PENDING',
        method: 'CARD',
        metadata: { paymentIntentId: paymentIntent.id },
      },
    });

    return { clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id };
  }

  async handleStripeWebhook(payload: Buffer, signature: string) {
    const webhookSecret = this.config.get<string>('stripe.webhookSecret');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret!);
    } catch (err) {
      throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handleStripePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handleStripePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case 'charge.refunded':
        await this.handleStripeRefund(event.data.object as Stripe.Charge);
        break;
    }

    return { received: true };
  }

  private async handleStripePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;
    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: paymentIntent.id },
    });

    if (payment) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          metadata: { ...(payment.metadata as object), stripeResponse: JSON.parse(JSON.stringify(paymentIntent)) },
        },
      });
      await this.bookingsService.updatePaymentStatus(bookingId, 'PAID');
    }
  }

  private async handleStripePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: paymentIntent.id },
    });

    if (payment) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
        },
      });
    }
  }

  private async handleStripeRefund(charge: Stripe.Charge) {
    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: charge.payment_intent as string },
    });

    if (payment) {
      const refundAmount = new Prisma.Decimal(charge.amount_refunded / 100);
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'REFUNDED',
          refundedAt: new Date(),
          refundAmount,
        },
      });
      await this.bookingsService.updatePaymentStatus(payment.bookingId, 'REFUNDED');
    }
  }

  // ===== M-Pesa STK Push =====
  async initiateMpesaSTKPush(bookingId: string, userId: string, phoneNumber: string) {
    const booking = await this.bookingsService.findById(bookingId, true);
    if (booking.userId !== userId) {
      throw new BadRequestException('Not authorized');
    }

    const safari = await this.prisma.safari.findUnique({
      where: { id: booking.safariId },
      select: { title: true },
    });

    const amount = Math.round(Number(booking.totalAmount));
    const shortcode = this.config.get<string>('mpesa.shortcode');
    const passkey = this.config.get<string>('mpesa.passkey');
    const callbackUrl = this.config.get<string>('mpesa.callbackUrl');

    const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const accessToken = await this.getMpesaAccessToken();

    const response = await fetch(
      `${this.getMpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: shortcode,
          PhoneNumber: phoneNumber,
          CallBackURL: callbackUrl,
          AccountReference: booking.bookingRef,
          TransactionDesc: `Payment for ${safari?.title ?? booking.bookingRef}`,
        }),
      },
    );

    const data = await response.json();

    if (data.ResponseCode !== '0') {
      throw new BadRequestException(`M-Pesa STK Push failed: ${data.ResponseDescription}`);
    }

    // Create payment record
    await this.prisma.payment.create({
      data: {
        paymentRef: this.generatePaymentRef('MPESA'),
        bookingId,
        userId,
        amount: booking.totalAmount,
        currency: booking.currency,
        provider: 'MPESA',
        providerRef: data.CheckoutRequestID,
        status: 'PENDING',
        method: 'MPESA_STK_PUSH',
        metadata: { merchantRequestId: data.MerchantRequestID, phoneNumber },
      },
    });

    return { checkoutRequestId: data.CheckoutRequestID, merchantRequestId: data.MerchantRequestID };
  }

  async handleMpesaCallback(body: any) {
    const { Body } = body;
    const { stkCallback } = Body;

    const checkoutRequestId = stkCallback.CheckoutRequestID;
    const resultCode = stkCallback.ResultCode;
    const resultDesc = stkCallback.ResultDesc;

    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: checkoutRequestId },
    });

    if (!payment) {
      this.logger.warn(`M-Pesa callback for unknown checkoutRequestId: ${checkoutRequestId}`);
      return { ResultCode: 0, ResultDesc: 'OK' };
    }

    if (resultCode === 0) {
      // Success - extract details from callback metadata
      const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
      const mpesaReceiptNumber = callbackMetadata.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value;
      const transactionDate = callbackMetadata.find((i: any) => i.Name === 'TransactionDate')?.Value;

      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
          paidAt: transactionDate ? new Date(transactionDate.toString()) : new Date(),
          metadata: { ...payment.metadata as object, mpesaReceiptNumber, callbackMetadata },
        },
      });
      await this.bookingsService.updatePaymentStatus(payment.bookingId, 'PAID');
    } else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          failureReason: resultDesc,
        },
      });
    }

    return { ResultCode: 0, ResultDesc: 'OK' };
  }

  async handleMpesaTimeout(checkoutRequestId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { providerRef: checkoutRequestId },
    });

    if (payment && payment.status === 'PENDING') {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'FAILED',
          failedAt: new Date(),
          failureReason: 'M-Pesa timeout - user did not complete payment',
        },
      });
    }
  }

  // ===== Common =====
  async getPaymentById(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async getPaymentsByBooking(bookingId: string) {
    return this.prisma.payment.findMany({
      where: { bookingId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async refundPayment(paymentId: string, amount?: number) {
    const payment = await this.getPaymentById(paymentId);
    if (payment.status !== 'PAID') {
      throw new BadRequestException('Can only refund paid payments');
    }

    const refundAmount = amount || Number(payment.amount);

    if (payment.provider === 'STRIPE' && this.stripe) {
      const refund = await this.stripe.refunds.create({
        payment_intent: payment.providerRef!,
        amount: Math.round(refundAmount * 100),
      });
      await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'REFUNDED',
          refundedAt: new Date(),
          refundAmount: new Prisma.Decimal(refundAmount),
          metadata: { ...payment.metadata as object, stripeRefundId: refund.id },
        },
      });
    } else if (payment.provider === 'MPESA') {
      // M-Pesa refunds require manual processing or B2C API
      await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'REFUNDED',
          refundedAt: new Date(),
          refundAmount: new Prisma.Decimal(refundAmount),
        },
      });
    }

    await this.bookingsService.updatePaymentStatus(payment.bookingId, 'REFUNDED');
    return { success: true };
  }

  private async getMpesaAccessToken(): Promise<string> {
    const consumerKey = this.config.get<string>('mpesa.consumerKey');
    const consumerSecret = this.config.get<string>('mpesa.consumerSecret');
    const url = `${this.getMpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`;

    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const response = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const data = await response.json();
    return data.access_token;
  }

  private getMpesaBaseUrl(): string {
    const env = this.config.get<string>('mpesa.environment') || 'sandbox';
    return env === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
  }

  private generatePaymentRef(provider: string): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();
    return `${provider}-${date}-${random}`;
  }
}