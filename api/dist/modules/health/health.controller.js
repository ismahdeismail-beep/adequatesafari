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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const terminus_1 = require("@nestjs/terminus");
const prisma_service_1 = require("../../prisma/prisma.service");
let HealthController = class HealthController {
    constructor(health, prisma) {
        this.health = health;
        this.prisma = prisma;
    }
    async check() {
        return this.health.check([
            () => this.checkDatabase(),
            () => this.checkMemory(),
            () => this.checkDisk(),
        ]);
    }
    async live() {
        return { status: 'ok', timestamp: new Date().toISOString() };
    }
    async ready() {
        return this.health.check([() => this.checkDatabase()]);
    }
    async checkDatabase() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            return { database: { status: 'up' } };
        }
        catch (error) {
            return { database: { status: 'down', error: error.message } };
        }
    }
    async checkMemory() {
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        const limit = 512;
        const status = used < limit ? 'up' : 'down';
        return { memory: { status, used: `${used.toFixed(2)} MB`, limit: `${limit} MB` } };
    }
    async checkDisk() {
        return { disk: { status: 'up', path: '/' } };
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Basic health check' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service is healthy' }),
    (0, swagger_1.ApiResponse)({ status: 503, description: 'Service is unhealthy' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({ summary: 'Liveness probe' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "live", null);
__decorate([
    (0, common_1.Get)('ready'),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Readiness probe' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "ready", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [typeof (_a = typeof terminus_1.HealthCheckService !== "undefined" && terminus_1.HealthCheckService) === "function" ? _a : Object, prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map