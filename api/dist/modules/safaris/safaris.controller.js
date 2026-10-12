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
exports.SafarisController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const safaris_service_1 = require("./safaris.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const client_2 = require("@prisma/client");
let SafarisController = class SafarisController {
    constructor(safarisService) {
        this.safarisService = safarisService;
    }
    async list(skip, take, country, safariStyle, accommodationType, minPrice, maxPrice, durationDays, isFeatured, search, availableFrom, availableTo) {
        return this.safarisService.findAll({
            skip: skip ? Number(skip) : 0,
            take: take ? Number(take) : 20,
            filters: {
                country,
                safariStyle,
                accommodationType,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                durationDays: durationDays ? Number(durationDays) : undefined,
                isFeatured,
                search,
                availableFrom: availableFrom ? new Date(availableFrom) : undefined,
                availableTo: availableTo ? new Date(availableTo) : undefined,
            },
        });
    }
    async featured(limit) {
        return this.safarisService.findFeatured(limit ? Number(limit) : 6);
    }
    async byCountry(country, limit) {
        return this.safarisService.findByCountry(country, limit ? Number(limit) : 20);
    }
    async getBySlug(slug) {
        return this.safarisService.findBySlug(slug);
    }
    async availability(id, startDate, endDate) {
        return this.safarisService.getAvailability(id, new Date(startDate), new Date(endDate));
    }
    async create(data) {
        return this.safarisService.create(data);
    }
    async update(id, data) {
        return this.safarisService.update(id, data);
    }
    async delete(id) {
        await this.safarisService.delete(id);
        return { success: true };
    }
    async toggleFeatured(id, data) {
        return this.safarisService.toggleFeatured(id, data.isFeatured);
    }
    async toggleActive(id, data) {
        return this.safarisService.toggleActive(id, data.isActive);
    }
    async addDate(id, data) {
        return this.safarisService.addDate(id, data);
    }
    async updateDate(dateId, data) {
        return this.safarisService.updateDate(dateId, data);
    }
    async deleteDate(dateId) {
        await this.safarisService.deleteDate(dateId);
        return { success: true };
    }
};
exports.SafarisController = SafarisController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List safaris with filters' }),
    (0, swagger_1.ApiQuery)({ name: 'skip', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'country', required: false, enum: client_1.Country }),
    (0, swagger_1.ApiQuery)({ name: 'safariStyle', required: false, enum: client_1.SafariStyle }),
    (0, swagger_1.ApiQuery)({ name: 'accommodationType', required: false, enum: client_1.AccommodationType }),
    (0, swagger_1.ApiQuery)({ name: 'minPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxPrice', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'durationDays', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'isFeatured', required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'availableFrom', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'availableTo', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated safari list' }),
    __param(0, (0, common_1.Query)('skip')),
    __param(1, (0, common_1.Query)('take')),
    __param(2, (0, common_1.Query)('country')),
    __param(3, (0, common_1.Query)('safariStyle')),
    __param(4, (0, common_1.Query)('accommodationType')),
    __param(5, (0, common_1.Query)('minPrice')),
    __param(6, (0, common_1.Query)('maxPrice')),
    __param(7, (0, common_1.Query)('durationDays')),
    __param(8, (0, common_1.Query)('isFeatured')),
    __param(9, (0, common_1.Query)('search')),
    __param(10, (0, common_1.Query)('availableFrom')),
    __param(11, (0, common_1.Query)('availableTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String, String, String, Number, Number, Number, Boolean, String, String, String]),
    __metadata("design:returntype", Promise)
], SafarisController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Get featured safaris' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SafarisController.prototype, "featured", null);
__decorate([
    (0, common_1.Get)('country/:country'),
    (0, swagger_1.ApiOperation)({ summary: 'Get safaris by country' }),
    (0, swagger_1.ApiParam)({ name: 'country', enum: client_1.Country }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Param)('country')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], SafarisController.prototype, "byCountry", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get safari by slug (public)' }),
    (0, swagger_1.ApiParam)({ name: 'slug', type: String }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SafarisController.prototype, "getBySlug", null);
__decorate([
    (0, common_1.Get)(':id/availability'),
    (0, swagger_1.ApiOperation)({ summary: 'Get availability for a safari' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: String }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: String }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('startDate')),
    __param(2, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SafarisController.prototype, "availability", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create safari (admin)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SafarisController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update safari (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SafarisController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete safari (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SafarisController.prototype, "delete", null);
__decorate([
    (0, common_1.Put)(':id/featured'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle featured status (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SafarisController.prototype, "toggleFeatured", null);
__decorate([
    (0, common_1.Put)(':id/active'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle active status (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SafarisController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Post)(':id/dates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add safari date (admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SafarisController.prototype, "addDate", null);
__decorate([
    (0, common_1.Put)('dates/:dateId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update safari date (admin)' }),
    __param(0, (0, common_1.Param)('dateId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SafarisController.prototype, "updateDate", null);
__decorate([
    (0, common_1.Delete)('dates/:dateId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN, client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete safari date (admin)' }),
    __param(0, (0, common_1.Param)('dateId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SafarisController.prototype, "deleteDate", null);
exports.SafarisController = SafarisController = __decorate([
    (0, swagger_1.ApiTags)('Safaris'),
    (0, common_1.Controller)('safaris'),
    __metadata("design:paramtypes", [safaris_service_1.SafarisService])
], SafarisController);
//# sourceMappingURL=safaris.controller.js.map