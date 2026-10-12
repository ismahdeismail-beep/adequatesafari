import { BookingsService } from './bookings.service';
import { BookingStatus, PaymentStatus } from '@prisma/client';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: any, data: {
        safariId: string;
        safariDateId: string;
        adults: number;
        children: number;
        specialRequests?: string;
        passengers: Array<{
            firstName: string;
            lastName: string;
            dateOfBirth?: string;
            passportNumber?: string;
            nationality?: string;
            specialNeeds?: string;
            isLead?: boolean;
        }>;
    }): Promise<any>;
    list(req: any, skip?: number, take?: number, status?: BookingStatus): Promise<{
        data: any;
        total: any;
    }>;
    stats(req: any): Promise<{
        total: any;
        pending: any;
        confirmed: any;
        cancelled: any;
        paid: any;
        totalRevenue: any;
    }>;
    get(req: any, id: string): Promise<any>;
    getByRef(bookingRef: string): Promise<any>;
    cancel(req: any, id: string, data: {
        reason?: string;
    }): Promise<any>;
    adminList(skip?: number, take?: number, status?: BookingStatus, paymentStatus?: PaymentStatus, userId?: string, agentId?: string): Promise<{
        data: any;
        total: any;
    }>;
    adminStats(): Promise<{
        total: any;
        pending: any;
        confirmed: any;
        cancelled: any;
        paid: any;
        totalRevenue: any;
    }>;
    updateStatus(id: string, data: {
        status: BookingStatus;
        notes?: string;
    }): Promise<any>;
    updatePaymentStatus(id: string, data: {
        paymentStatus: PaymentStatus;
    }): Promise<any>;
    agentBookings(req: any, status?: BookingStatus): Promise<{
        data: any;
        total: any;
    }>;
    agentStats(req: any): Promise<{
        total: any;
        pending: any;
        confirmed: any;
        cancelled: any;
        paid: any;
        totalRevenue: any;
    }>;
}
