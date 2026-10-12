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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const webhooks_service_1 = require("./webhooks.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let WebhooksController = class WebhooksController {
    constructor(webhooksService) {
        this.webhooksService = webhooksService;
    }
    async joomlaWebhook(body) {
        return this.webhooksService.processEvent({
            event: body.event,
            timestamp: new Date().toISOString(),
            data: body.data,
            source: 'joomla',
        });
    }
    async internalWebhook(body) {
        return this.webhooksService.processEvent({
            event: body.event,
            timestamp: new Date().toISOString(),
            data: body.data,
            source: 'internal',
        });
    }
    async getSyncLogs(skip, take, entityType, status, startDate, endDate) {
        return this.webhooksService.getSyncLogs({
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 50,
            entityType,
            status,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
    }
    async retryFailed(body) {
        return this.webhooksService.retryFailedSyncs(body.entityType);
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, common_1.Post)('joomla'),
    (0, swagger_1.ApiOperation)({ summary: 'Receive webhook from Joomla' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "joomlaWebhook", null);
__decorate([
    (0, common_1.Post)('internal'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send internal webhook (admin)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "internalWebhook", null);
__decorate([
    (0, common_1.Get)('sync-logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get sync logs (admin)' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'entityType', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.SyncStatus }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false, type: String }),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __param(2, (0, common_1.Query)('entityType')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('startDate')),
    __param(5, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, typeof (_a = typeof client_1.SyncStatus !== "undefined" && client_1.SyncStatus) === "function" ? _a : Object, String, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "getSyncLogs", null);
__decorate([
    (0, common_1.Post)('sync-logs/retry'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Retry failed syncs (admin)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "retryFailed", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, swagger_1.ApiTags)('Webhooks'),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [webhooks_service_1.WebhooksService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map