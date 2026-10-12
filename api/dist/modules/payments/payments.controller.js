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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let PaymentsController = class PaymentsController {
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createStripeIntent(req, data) {
        return this.paymentsService.createStripePaymentIntent(data.bookingId, req.user.id);
    }
    async stripeWebhook(req, signature) {
        return this.paymentsService.handleStripeWebhook(req.rawBody, signature);
    }
    async mpesaStkPush(req, data) {
        return this.paymentsService.initiateMpesaSTKPush(data.bookingId, req.user.id, data.phoneNumber);
    }
    async mpesaCallback(body) {
        return this.paymentsService.handleMpesaCallback(body);
    }
    async mpesaTimeout(body) {
        return this.paymentsService.handleMpesaTimeout(body.checkoutRequestId);
    }
    async getBookingPayments(bookingId) {
        return this.paymentsService.getPaymentsByBooking(bookingId);
    }
    async getPayment(id) {
        return this.paymentsService.getPaymentById(id);
    }
    async refund(id, data) {
        return this.paymentsService.refundPayment(id, data.amount);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('stripe/intent'),
    UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create Stripe Payment Intent' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createStripeIntent", null);
__decorate([
    (0, common_1.Post)('stripe/webhook'),
    (0, swagger_1.ApiOperation)({ summary: 'Stripe Webhook' }),
    (0, swagger_1.ApiHeader)({ name: 'stripe-signature', required: true }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "stripeWebhook", null);
__decorate([
    (0, common_1.Post)('mpesa/stk-push'),
    UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Initiate M-Pesa STK Push' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "mpesaStkPush", null);
__decorate([
    (0, common_1.Post)('mpesa/callback'),
    (0, swagger_1.ApiOperation)({ summary: 'M-Pesa Callback' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "mpesaCallback", null);
__decorate([
    (0, common_1.Post)('mpesa/timeout'),
    (0, swagger_1.ApiOperation)({ summary: 'M-Pesa Timeout' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "mpesaTimeout", null);
__decorate([
    (0, common_1.Get)('booking/:bookingId'),
    UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get payments for a booking' }),
    __param(0, (0, common_1.Param)('bookingId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getBookingPayments", null);
__decorate([
    (0, common_1.Get)(':id'),
    UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get payment by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getPayment", null);
__decorate([
    (0, common_1.Post)(':id/refund'),
    UseGuards(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Refund payment (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "refund", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map