import { AgentsService } from './agents.service';
export declare class AgentsController {
    private agentsService;
    constructor(agentsService: AgentsService);
    apply(req: any, data: {
        companyName: string;
        licenseNumber: string;
    }): Promise<any>;
    myProfile(req: any): Promise<any>;
    updateProfile(req: any, data: {
        companyName?: string;
        licenseNumber?: string;
    }): Promise<any>;
    myStats(req: any): Promise<{
        totalBookings: any;
        confirmedBookings: any;
        totalRevenue: any;
        totalCommission: any;
        paidCommission: any;
        pendingCommission: number;
        commissionRate: any;
    }>;
    myBookings(req: any, skip?: number, take?: number, status?: string): Promise<{
        data: any;
        total: any;
    }>;
    list(skip?: number, take?: number, isApproved?: boolean): Promise<{
        data: any;
        total: any;
    }>;
    get(id: string): Promise<any>;
    approve(id: string, data: {
        commissionRate?: number;
    }): Promise<any>;
    reject(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateCommission(id: string, data: {
        commissionRate: number;
    }): Promise<any>;
    stats(id: string): Promise<{
        totalBookings: any;
        confirmedBookings: any;
        totalRevenue: any;
        totalCommission: any;
        paidCommission: any;
        pendingCommission: number;
        commissionRate: any;
    }>;
}
