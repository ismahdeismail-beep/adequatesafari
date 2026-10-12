import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, BookingStatus, PaymentStatus } from '@prisma/client';
interface CreateBookingDto {
    userId: string;
    safariId: string;
    safariDateId: string;
    adults: number;
    children: number;
    specialRequests?: string;
    agentId?: string;
    passengers: Array<{
        firstName: string;
        lastName: string;
        dateOfBirth?: Date;
        passportNumber?: string;
        nationality?: string;
        specialNeeds?: string;
        isLead?: boolean;
    }>;
}
export declare class BookingsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(dto: CreateBookingDto): Promise<any>;
    findById(id: string, includeRelations?: boolean): Promise<any>;
    findByRef(bookingRef: string): Promise<any>;
    findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.BookingWhereInput;
        orderBy?: Prisma.BookingOrderByWithRelationInput;
        userId?: string;
        agentId?: string;
    }): Promise<{
        data: any;
        total: any;
    }>;
    updateStatus(id: string, status: BookingStatus, notes?: string): Promise<any>;
    updatePaymentStatus(id: string, paymentStatus: PaymentStatus, paidAmount?: number): Promise<any>;
    calculateCommission(bookingId: string): Promise<{
        agentId: any;
        commissionRate: any;
        commissionAmount: number;
        currency: any;
    }>;
    markCommissionPaid(bookingId: string): Promise<any>;
    getUserBookings(userId: string, status?: BookingStatus): Promise<{
        data: any;
        total: any;
    }>;
    getAgentBookings(agentId: string, status?: BookingStatus): Promise<{
        data: any;
        total: any;
    }>;
    getBookingStats(userId?: string, agentId?: string): Promise<{
        total: any;
        pending: any;
        confirmed: any;
        cancelled: any;
        paid: any;
        totalRevenue: any;
    }>;
    private generateBookingRef;
}
export {};
