import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { BookingsService } from '../bookings/bookings.service';
export declare class PaymentsService {
    private config;
    private prisma;
    private bookingsService;
    private readonly logger;
    private stripe;
    constructor(config: ConfigService, prisma: PrismaService, bookingsService: BookingsService);
    createStripePaymentIntent(bookingId: string, userId: string): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }>;
    handleStripeWebhook(payload: Buffer, signature: string): Promise<{
        received: boolean;
    }>;
    private handleStripePaymentSuccess;
    private handleStripePaymentFailed;
    private handleStripeRefund;
    initiateMpesaSTKPush(bookingId: string, userId: string, phoneNumber: string): Promise<{
        checkoutRequestId: any;
        merchantRequestId: any;
    }>;
    handleMpesaCallback(body: any): Promise<{
        ResultCode: number;
        ResultDesc: string;
    }>;
    handleMpesaTimeout(checkoutRequestId: string): Promise<void>;
    getPaymentById(id: string): Promise<any>;
    getPaymentsByBooking(bookingId: string): Promise<any>;
    refundPayment(paymentId: string, amount?: number): Promise<{
        success: boolean;
    }>;
    private getMpesaAccessToken;
    private getMpesaBaseUrl;
    private generatePaymentRef;
}
