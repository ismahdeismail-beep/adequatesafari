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
var BookingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BookingsService = BookingsService_1 = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(BookingsService_1.name);
    }
    async create(dto) {
        const safariDate = await this.prisma.safariDate.findUnique({
            where: { id: dto.safariDateId },
            include: { safari: true },
        });
        if (!safariDate) {
            throw new common_1.NotFoundException('Safari date not found');
        }
        if (safariDate.status !== 'OPEN' && safariDate.status !== 'GUARANTEED') {
            throw new common_1.BadRequestException('Safari date is not available for booking');
        }
        const totalPassengers = dto.adults + dto.children;
        const available = safariDate.availability - safariDate.booked;
        if (totalPassengers > available) {
            throw new common_1.BadRequestException(`Only ${available} spots available`);
        }
        if (dto.passengers.length !== totalPassengers) {
            throw new common_1.BadRequestException('Passenger count must match adults + children');
        }
        const totalAmount = Number(safariDate.price) * totalPassengers;
        const bookingRef = this.generateBookingRef();
        const booking = await this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.create({
                data: {
                    bookingRef,
                    userId: dto.userId,
                    safariId: dto.safariId,
                    safariDateId: dto.safariDateId,
                    agentId: dto.agentId,
                    adults: dto.adults,
                    children: dto.children,
                    specialRequests: dto.specialRequests,
                    totalAmount,
                    currency: safariDate.currency,
                    status: 'PENDING',
                    paymentStatus: 'UNPAID',
                    passengers: {
                        create: dto.passengers.map((p, i) => ({
                            ...p,
                            isLead: i === 0 || p.isLead,
                        })),
                    },
                },
                include: { passengers: true },
            });
            await tx.safariDate.update({
                where: { id: dto.safariDateId },
                data: { booked: { increment: totalPassengers } },
            });
            return booking;
        });
        this.logger.log(`Booking created: ${bookingRef} for user ${dto.userId}`);
        return booking;
    }
    async findById(id, includeRelations = false) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: includeRelations
                ? {
                    user: true,
                    safari: true,
                    safariDate: true,
                    agent: { include: { user: true } },
                    payments: true,
                    passengers: true,
                }
                : { passengers: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async findByRef(bookingRef) {
        const booking = await this.prisma.booking.findUnique({
            where: { bookingRef },
            include: { user: true, safari: true, safariDate: true, payments: true, passengers: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async findAll(params) {
        const { skip, take, where, orderBy, userId, agentId } = params;
        const builtWhere = { ...where };
        if (userId)
            builtWhere.userId = userId;
        if (agentId)
            builtWhere.agentId = agentId;
        const [data, total] = await Promise.all([
            this.prisma.booking.findMany({
                skip,
                take,
                where: builtWhere,
                orderBy: orderBy || { createdAt: 'desc' },
                include: { safari: true, safariDate: true, payments: true },
            }),
            this.prisma.booking.count({ where: builtWhere }),
        ]);
        return { data, total };
    }
    async updateStatus(id, status, notes) {
        const booking = await this.findById(id);
        const data = { status };
        if (notes)
            data.internalNotes = notes;
        if (status === 'CONFIRMED')
            data.confirmedAt = new Date();
        if (status === 'CANCELLED') {
            data.cancelledAt = new Date();
            data.cancelledReason = notes;
            await this.prisma.safariDate.update({
                where: { id: booking.safariDateId },
                data: { booked: { decrement: booking.adults + booking.children } },
            });
        }
        return this.prisma.booking.update({ where: { id }, data });
    }
    async updatePaymentStatus(id, paymentStatus, paidAmount) {
        const booking = await this.findById(id);
        const data = { paymentStatus };
        if (paidAmount !== undefined) {
        }
        if (paymentStatus === 'PAID' && booking.status === 'PENDING') {
            data.status = 'CONFIRMED';
            data.confirmedAt = new Date();
        }
        return this.prisma.booking.update({ where: { id }, data });
    }
    async calculateCommission(bookingId) {
        const booking = await this.findById(bookingId, true);
        if (!booking.agentId)
            return null;
        const agent = await this.prisma.agentProfile.findUnique({
            where: { id: booking.agentId },
        });
        if (!agent)
            return null;
        const commissionAmount = Number(booking.totalAmount) * (agent.commissionRate / 100);
        return {
            agentId: agent.id,
            commissionRate: agent.commissionRate,
            commissionAmount,
            currency: booking.currency,
        };
    }
    async markCommissionPaid(bookingId) {
        return this.prisma.booking.update({
            where: { id: bookingId },
            data: { commissionPaid: true },
        });
    }
    async getUserBookings(userId, status) {
        return this.findAll({ userId, where: status ? { status } : undefined });
    }
    async getAgentBookings(agentId, status) {
        return this.findAll({ agentId, where: status ? { status } : undefined });
    }
    async getBookingStats(userId, agentId) {
        const where = {};
        if (userId)
            where.userId = userId;
        if (agentId)
            where.agentId = agentId;
        const [total, pending, confirmed, cancelled, paid] = await Promise.all([
            this.prisma.booking.count({ where }),
            this.prisma.booking.count({ where: { ...where, status: 'PENDING' } }),
            this.prisma.booking.count({ where: { ...where, status: 'CONFIRMED' } }),
            this.prisma.booking.count({ where: { ...where, status: 'CANCELLED' } }),
            this.prisma.booking.count({ where: { ...where, paymentStatus: 'PAID' } }),
        ]);
        const revenue = await this.prisma.booking.aggregate({
            where: { ...where, paymentStatus: 'PAID' },
            _sum: { totalAmount: true },
        });
        return { total, pending, confirmed, cancelled, paid, totalRevenue: revenue._sum.totalAmount || 0 };
    }
    generateBookingRef() {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `AAS-${date}-${random}`;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = BookingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map