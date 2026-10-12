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
exports.SyncController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sync_service_1 = require("./sync.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let SyncController = class SyncController {
    constructor(syncService) {
        this.syncService = syncService;
    }
    async syncJoomla() {
        return this.syncService.syncFromJoomla();
    }
    async syncUsers() {
        return this.syncService.syncUsersFromJoomla();
    }
    async pushBooking(id) {
        return this.syncService.pushBookingToJoomla(id);
    }
};
exports.SyncController = SyncController;
__decorate([
    (0, common_1.Post)('joomla'),
    (0, swagger_1.ApiOperation)({ summary: 'Trigger sync from Joomla' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncJoomla", null);
__decorate([
    (0, common_1.Post)('joomla/users'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync users from Joomla' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncUsers", null);
__decorate([
    (0, common_1.Post)('booking/:id/push'),
    (0, swagger_1.ApiOperation)({ summary: 'Push booking to Joomla' }),
    __param(0, (0, common_1.Body)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "pushBooking", null);
exports.SyncController = SyncController = __decorate([
    (0, swagger_1.ApiTags)('Sync'),
    (0, common_1.Controller)('sync'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [sync_service_1.SyncService])
], SyncController);
//# sourceMappingURL=sync.controller.js.map