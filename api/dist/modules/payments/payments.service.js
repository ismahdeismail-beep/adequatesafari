"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const stripe_1 = __importDefault(require("stripe"));
const crypto = __importStar(require("crypto"));
const bookings_service_1 = require("../bookings/bookings.service");
let PaymentsService = PaymentsService_1 = class PaymentsService {
    constructor(config, prisma, bookingsService) {
        this.config = config;
        this.prisma = prisma;
        this.bookingsService = bookingsService;
        this.logger = new common_1.Logger(PaymentsService_1.name);
        const stripeKey = this.config.get('stripe.secretKey');
        if (stripeKey) {
            this.stripe = new stripe_1.default(stripeKey, {
                apiVersion: this.config.get('stripe.apiVersion'),
            });
        }
    }
    async createStripePaymentIntent(bookingId, userId) {
        const booking = await this.bookingsService.findById(bookingId, true);
        if (booking.userId !== userId) {
            throw new common_1.BadRequestException('Not authorized');
        }
        if (booking.paymentStatus === 'PAID') {
            throw new common_1.BadRequestException('Booking already paid');
        }
        const amount = Math.round(Number(booking.totalAmount) * 100);
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
    async handleStripeWebhook(payload, signature) {
        const webhookSecret = this.config.get('stripe.webhookSecret');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook signature verification failed: ${err.message}`);
        }
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.handleStripePaymentSuccess(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await this.handleStripePaymentFailed(event.data.object);
                break;
            case 'charge.refunded':
                await this.handleStripeRefund(event.data.object);
                break;
        }
        return { received: true };
    }
    async handleStripePaymentSuccess(paymentIntent) {
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
                    metadata: { ...payment.metadata, stripeResponse: paymentIntent },
                },
            });
            await this.bookingsService.updatePaymentStatus(bookingId, 'PAID');
        }
    }
    async handleStripePaymentFailed(paymentIntent) {
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
    async handleStripeRefund(charge) {
        const payment = await this.prisma.payment.findFirst({
            where: { providerRef: charge.payment_intent },
        });
        if (payment) {
            const refundAmount = new client_1.Prisma.Decimal(charge.amount_refunded / 100);
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
    async initiateMpesaSTKPush(bookingId, userId, phoneNumber) {
        const booking = await this.bookingsService.findById(bookingId, true);
        if (booking.userId !== userId) {
            throw new common_1.BadRequestException('Not authorized');
        }
        const amount = Math.round(Number(booking.totalAmount));
        const shortcode = this.config.get('mpesa.shortcode');
        const passkey = this.config.get('mpesa.passkey');
        const callbackUrl = this.config.get('mpesa.callbackUrl');
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 14);
        const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
        const accessToken = await this.getMpesaAccessToken();
        const response = await fetch(`${this.getMpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
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
                TransactionDesc: `Payment for ${booking.safari.title}`,
            }),
        });
        const data = await response.json();
        if (data.ResponseCode !== '0') {
            throw new common_1.BadRequestException(`M-Pesa STK Push failed: ${data.ResponseDescription}`);
        }
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
    async handleMpesaCallback(body) {
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
            const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
            const mpesaReceiptNumber = callbackMetadata.find((i) => i.Name === 'MpesaReceiptNumber')?.Value;
            const transactionDate = callbackMetadata.find((i) => i.Name === 'TransactionDate')?.Value;
            await this.prisma.payment.update({
                where: { id: payment.id },
                data: {
                    status: 'PAID',
                    paidAt: transactionDate ? new Date(transactionDate.toString()) : new Date(),
                    metadata: { ...payment.metadata, mpesaReceiptNumber, callbackMetadata },
                },
            });
            await this.bookingsService.updatePaymentStatus(payment.bookingId, 'PAID');
        }
        else {
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
    async handleMpesaTimeout(checkoutRequestId) {
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
    async getPaymentById(id) {
        const payment = await this.prisma.payment.findUnique({ where: { id } });
        if (!payment)
            throw new common_1.NotFoundException('Payment not found');
        return payment;
    }
    async getPaymentsByBooking(bookingId) {
        return this.prisma.payment.findMany({
            where: { bookingId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async refundPayment(paymentId, amount) {
        const payment = await this.getPaymentById(paymentId);
        if (payment.status !== 'PAID') {
            throw new common_1.BadRequestException('Can only refund paid payments');
        }
        const refundAmount = amount || Number(payment.amount);
        if (payment.provider === 'STRIPE' && this.stripe) {
            const refund = await this.stripe.refunds.create({
                payment_intent: payment.providerRef,
                amount: Math.round(refundAmount * 100),
            });
            await this.prisma.payment.update({
                where: { id: paymentId },
                data: {
                    status: 'REFUNDED',
                    refundedAt: new Date(),
                    refundAmount: new client_1.Prisma.Decimal(refundAmount),
                    metadata: { ...payment.metadata, stripeRefundId: refund.id },
                },
            });
        }
        else if (payment.provider === 'MPESA') {
            await this.prisma.payment.update({
                where: { id: paymentId },
                data: {
                    status: 'REFUNDED',
                    refundedAt: new Date(),
                    refundAmount: new client_1.Prisma.Decimal(refundAmount),
                },
            });
        }
        await this.bookingsService.updatePaymentStatus(payment.bookingId, 'REFUNDED');
        return { success: true };
    }
    async getMpesaAccessToken() {
        const consumerKey = this.config.get('mpesa.consumerKey');
        const consumerSecret = this.config.get('mpesa.consumerSecret');
        const url = `${this.getMpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`;
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const response = await fetch(url, {
            headers: { Authorization: `Basic ${auth}` },
        });
        const data = await response.json();
        return data.access_token;
    }
    getMpesaBaseUrl() {
        const env = this.config.get('mpesa.environment') || 'sandbox';
        return env === 'production'
            ? 'https://api.safaricom.co.ke'
            : 'https://sandbox.safaricom.co.ke';
    }
    generatePaymentRef(provider) {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = crypto.randomBytes(4).toString('hex').toUpperCase();
        return `${provider}-${date}-${random}`;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        bookings_service_1.BookingsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map