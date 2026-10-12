"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AgentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const users_service_1 = require("../users/users.service");
let AgentsService = AgentsService_1 = class AgentsService {
    constructor(prisma, usersService) {
        this.prisma = prisma;
        this.usersService = usersService;
        this.logger = new common_1.Logger(AgentsService_1.name);
    }
    async applyForAgent(userId, data) {
        const user = await this.usersService.findById(userId);
        if (user.role !== 'CUSTOMER') {
            throw new common_1.BadRequestException('Only customers can apply to become agents');
        }
        const existing = await this.prisma.agentProfile.findUnique({ where: { userId } });
        if (existing) {
            throw new common_1.ConflictException('Agent profile already exists');
        }
        await this.usersService.update(userId, { role: 'AGENT' });
        const profile = await this.prisma.agentProfile.create({
            data: {
                userId,
                companyName: data.companyName,
                licenseNumber: data.licenseNumber,
                commissionRate: 10.0,
                isApproved: false,
            },
        });
        this.logger.log(`Agent application submitted: ${userId}`);
        return profile;
    }
    async getMyProfile(userId) {
        const profile = await this.prisma.agentProfile.findUnique({
            where: { userId },
            include: { user: true },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Agent profile not found');
        }
        return profile;
    }
    async updateMyProfile(userId, data) {
        const profile = await this.prisma.agentProfile.findUnique({ where: { userId } });
        if (!profile) {
            throw new common_1.NotFoundException('Agent profile not found');
        }
        return this.prisma.agentProfile.update({
            where: { userId },
            data,
        });
    }
    async findAll(params) {
        const { skip, take, where, orderBy } = params;
        const [data, total] = await Promise.all([
            this.prisma.agentProfile.findMany({
                skip,
                take,
                where,
                orderBy: orderBy || { createdAt: 'desc' },
                include: { user: true },
            }),
            this.prisma.agentProfile.count({ where }),
        ]);
        return { data, total };
    }
    async findById(id) {
        const profile = await this.prisma.agentProfile.findUnique({
            where: { id },
            include: { user: true, bookings: { take: 10, orderBy: { createdAt: 'desc' } } },
        });
        if (!profile)
            throw new common_1.NotFoundException('Agent not found');
        return profile;
    }
    async approveAgent(id, commissionRate) {
        const profile = await this.findById(id);
        if (profile.isApproved) {
            throw new common_1.BadRequestException('Agent already approved');
        }
        return this.prisma.agentProfile.update({
            where: { id },
            data: {
                isApproved: true,
                approvedAt: new Date(),
                ...(commissionRate && { commissionRate }),
            },
        });
    }
    async rejectAgent(id) {
        const profile = await this.findById(id);
        await this.usersService.update(profile.userId, { role: 'CUSTOMER' });
        await this.prisma.agentProfile.delete({ where: { id } });
        return { success: true, message: 'Agent application rejected' };
    }
    async updateCommissionRate(id, commissionRate) {
        if (commissionRate < 0 || commissionRate > 50) {
            throw new common_1.BadRequestException('Commission rate must be between 0 and 50%');
        }
        return this.prisma.agentProfile.update({
            where: { id },
            data: { commissionRate },
        });
    }
    async getAgentStats(agentId) {
        const profile = await this.findById(agentId);
        const bookings = await this.prisma.booking.findMany({
            where: { agentId },
            include: { payments: true },
        });
        const totalBookings = bookings.length;
        const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
        const paidBookings = bookings.filter(b => b.paymentStatus === 'PAID');
        const totalRevenue = paidBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
        const totalCommission = paidBookings.reduce((sum, b) => {
            const commission = Number(b.totalAmount) * (profile.commissionRate / 100);
            return sum + commission;
        }, 0);
        const paidCommission = bookings
            .filter(b => b.commissionPaid)
            .reduce((sum, b) => sum + (Number(b.commissionAmount) || 0), 0);
        return {
            totalBookings,
            confirmedBookings,
            totalRevenue,
            totalCommission,
            paidCommission,
            pendingCommission: totalCommission - paidCommission,
            commissionRate: profile.commissionRate,
        };
    }
    async getAgentBookings(agentId, params) {
        const where = { agentId };
        if (params.status)
            where.status = params.status;
        const [data, total] = await Promise.all([
            this.prisma.booking.findMany({
                skip: params.skip,
                take: params.take,
                where,
                orderBy: { createdAt: 'desc' },
                include: { safari: true, safariDate: true, user: true, payments: true },
            }),
            this.prisma.booking.count({ where }),
        ]);
        return { data, total };
    }
    async markCommissionPaid(bookingId) {
        return this.prisma.booking.update({
            where: { id: bookingId },
            data: { commissionPaid: true },
        });
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = AgentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        users_service_1.UsersService])
], AgentsService);
//# sourceMappingURL=agents.service.js.map