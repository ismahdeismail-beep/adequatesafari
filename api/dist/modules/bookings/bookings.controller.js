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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bookings_service_1 = require("./bookings.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let BookingsController = class BookingsController {
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async create(req, data) {
        return this.bookingsService.create({
            userId: req.user.id,
            ...data,
            passengers: data.passengers.map(p => ({
                ...p,
                dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : undefined,
            })),
        });
    }
    async list(req, skip, take, status) {
        return this.bookingsService.getUserBookings(req.user.id, status);
    }
    async stats(req) {
        return this.bookingsService.getBookingStats(req.user.id);
    }
    async get(req, id) {
        const booking = await this.bookingsService.findById(id, true);
        if (booking.userId !== req.user.id && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
            return { success: false, message: 'Not authorized' };
        }
        return booking;
    }
    async getByRef(bookingRef) {
        return this.bookingsService.findByRef(bookingRef);
    }
    async cancel(req, id, data) {
        const booking = await this.bookingsService.findById(id);
        if (booking.userId !== req.user.id && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
            return { success: false, message: 'Not authorized' };
        }
        if (['CANCELLED', 'COMPLETED'].includes(booking.status)) {
            return { success: false, message: 'Cannot cancel this booking' };
        }
        return this.bookingsService.updateStatus(id, 'CANCELLED', data.reason);
    }
    async adminList(skip, take, status, paymentStatus, userId, agentId) {
        return this.bookingsService.findAll({
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 50,
            where: { status, paymentStatus, userId, agentId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async adminStats() {
        return this.bookingsService.getBookingStats();
    }
    async updateStatus(id, data) {
        return this.bookingsService.updateStatus(id, data.status, data.notes);
    }
    async updatePaymentStatus(id, data) {
        return this.bookingsService.updatePaymentStatus(id, data.paymentStatus);
    }
    async agentBookings(req, status) {
        return this.bookingsService.getAgentBookings(req.user.id, status);
    }
    async agentStats(req) {
        return this.bookingsService.getBookingStats(undefined, req.user.id);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new booking' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Booking created' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List user bookings' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.BookingStatus }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('skip')),
    __param(2, (0, common_1.Query)('take')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, typeof (_a = typeof client_1.BookingStatus !== "undefined" && client_1.BookingStatus) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking statistics' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "get", null);
__decorate([
    (0, common_1.Get)('ref/:bookingRef'),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking by reference (public lookup)' }),
    (0, swagger_1.ApiParam)({ name: 'bookingRef', type: String }),
    __param(0, (0, common_1.Param)('bookingRef')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getByRef", null);
__decorate([
    (0, common_1.Put)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel booking' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)('admin/all'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'List all bookings (admin)' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.BookingStatus }),
    (0, swagger_1.ApiQuery)({ name: 'paymentStatus', required: false, enum: client_1.PaymentStatus }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'agentId', required: false, type: String }),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('paymentStatus')),
    __param(4, (0, common_1.Query)('userId')),
    __param(5, (0, common_1.Query)('agentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, typeof (_b = typeof client_1.BookingStatus !== "undefined" && client_1.BookingStatus) === "function" ? _b : Object, typeof (_c = typeof client_1.PaymentStatus !== "undefined" && client_1.PaymentStatus) === "function" ? _c : Object, String, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "adminList", null);
__decorate([
    (0, common_1.Get)('admin/stats'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all booking stats (admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "adminStats", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update booking status (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Put)(':id/payment-status'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update payment status (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "updatePaymentStatus", null);
__decorate([
    (0, common_1.Get)('agent/me'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get agent bookings' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.BookingStatus }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof client_1.BookingStatus !== "undefined" && client_1.BookingStatus) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "agentBookings", null);
__decorate([
    (0, common_1.Get)('agent/stats'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.AGENT, client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get agent booking stats' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "agentStats", null);
exports.BookingsController = BookingsController = __decorate([
    (0, swagger_1.ApiTags)('Bookings'),
    (0, common_1.Controller)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map