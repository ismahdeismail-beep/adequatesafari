import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UsersService } from '../users/users.service';
export declare class AgentsService {
    private prisma;
    private usersService;
    private readonly logger;
    constructor(prisma: PrismaService, usersService: UsersService);
    applyForAgent(userId: string, data: {
        companyName: string;
        licenseNumber: string;
    }): Promise<any>;
    getMyProfile(userId: string): Promise<any>;
    updateMyProfile(userId: string, data: Partial<Prisma.AgentProfileUpdateInput>): Promise<any>;
    findAll(params: {
        skip?: number;
        take?: number;
        where?: Prisma.AgentProfileWhereInput;
        orderBy?: Prisma.AgentProfileOrderByWithRelationInput;
    }): Promise<{
        data: any;
        total: any;
    }>;
    findById(id: string): Promise<any>;
    approveAgent(id: string, commissionRate?: number): Promise<any>;
    rejectAgent(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateCommissionRate(id: string, commissionRate: number): Promise<any>;
    getAgentStats(agentId: string): Promise<{
        totalBookings: any;
        confirmedBookings: any;
        totalRevenue: any;
        totalCommission: any;
        paidCommission: any;
        pendingCommission: number;
        commissionRate: any;
    }>;
    getAgentBookings(agentId: string, params: {
        skip?: number;
        take?: number;
        status?: string;
    }): Promise<{
        data: any;
        total: any;
    }>;
    markCommissionPaid(bookingId: string): Promise<any>;
}
