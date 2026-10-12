import { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Request as ExpressRequest } from 'express';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    createStripeIntent(req: any, data: {
        bookingId: string;
    }): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }>;
    stripeWebhook(req: RawBodyRequest<ExpressRequest>, signature: string): Promise<{
        received: boolean;
    }>;
    mpesaStkPush(req: any, data: {
        bookingId: string;
        phoneNumber: string;
    }): Promise<{
        checkoutRequestId: any;
        merchantRequestId: any;
    }>;
    mpesaCallback(body: any): Promise<{
        ResultCode: number;
        ResultDesc: string;
    }>;
    mpesaTimeout(body: {
        checkoutRequestId: string;
    }): Promise<void>;
    getBookingPayments(bookingId: string): Promise<any>;
    getPayment(id: string): Promise<any>;
    refund(id: string, data: {
        amount?: number;
    }): Promise<{
        success: boolean;
    }>;
}
