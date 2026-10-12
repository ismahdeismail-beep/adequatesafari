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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafarisService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SafarisService = class SafarisService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const slug = this.generateSlug(data.title);
        return this.prisma.safari.create({
            data: { ...data, slug },
        });
    }
    async findAll(params) {
        const { skip, take, where, orderBy, filters } = params;
        const builtWhere = this.buildWhere(filters, where);
        const [data, total] = await Promise.all([
            this.prisma.safari.findMany({
                skip,
                take,
                where: builtWhere,
                orderBy: orderBy || { sortOrder: 'asc' },
                include: {
                    safariDates: {
                        where: { status: 'OPEN', startDate: { gte: new Date() } },
                        orderBy: { startDate: 'asc' },
                        take: 5,
                    },
                },
            }),
            this.prisma.safari.count({ where: builtWhere }),
        ]);
        return { data, total };
    }
    async findBySlug(slug) {
        const safari = await this.prisma.safari.findUnique({
            where: { slug },
            include: {
                safariDates: {
                    where: { status: { in: ['OPEN', 'GUARANTEED'] }, startDate: { gte: new Date() } },
                    orderBy: { startDate: 'asc' },
                },
                reviews: {
                    where: { isPublished: true },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: { user: { select: { firstName: true, lastName: true } } },
                },
            },
        });
        if (!safari) {
            throw new common_1.NotFoundException('Safari not found');
        }
        return safari;
    }
    async findById(id) {
        const safari = await this.prisma.safari.findUnique({
            where: { id },
            include: {
                safariDates: {
                    orderBy: { startDate: 'asc' },
                },
            },
        });
        if (!safari) {
            throw new common_1.NotFoundException('Safari not found');
        }
        return safari;
    }
    async findFeatured(limit = 6) {
        return this.prisma.safari.findMany({
            where: { isFeatured: true, isActive: true },
            orderBy: { sortOrder: 'asc' },
            take: limit,
            include: {
                safariDates: {
                    where: { status: 'OPEN', startDate: { gte: new Date() } },
                    orderBy: { startDate: 'asc' },
                    take: 3,
                },
            },
        });
    }
    async findByCountry(country, limit = 20) {
        return this.prisma.safari.findMany({
            where: { country, isActive: true },
            orderBy: { sortOrder: 'asc' },
            take: limit,
        });
    }
    async update(id, data) {
        await this.findById(id);
        if (data.title) {
            data.slug = this.generateSlug(data.title);
        }
        return this.prisma.safari.update({ where: { id }, data });
    }
    async delete(id) {
        await this.findById(id);
        return this.prisma.safari.delete({ where: { id } });
    }
    async toggleFeatured(id, isFeatured) {
        return this.prisma.safari.update({
            where: { id },
            data: { isFeatured },
        });
    }
    async toggleActive(id, isActive) {
        return this.prisma.safari.update({
            where: { id },
            data: { isActive },
        });
    }
    async addDate(safariId, data) {
        await this.findById(safariId);
        return this.prisma.safariDate.create({
            data: { ...data, safariId },
        });
    }
    async updateDate(dateId, data) {
        return this.prisma.safariDate.update({ where: { id: dateId }, data });
    }
    async deleteDate(dateId) {
        return this.prisma.safariDate.delete({ where: { id: dateId } });
    }
    async getAvailability(safariId, startDate, endDate) {
        const dates = await this.prisma.safariDate.findMany({
            where: {
                safariId,
                startDate: { gte: startDate, lte: endDate },
                status: { in: ['OPEN', 'GUARANTEED'] },
            },
            orderBy: { startDate: 'asc' },
        });
        return dates.map(d => ({
            ...d,
            available: d.availability - d.booked,
        }));
    }
    buildWhere(filters, additionalWhere) {
        const where = {
            isActive: true,
            ...additionalWhere,
        };
        if (filters) {
            if (filters.country)
                where.country = filters.country;
            if (filters.safariStyle)
                where.safariStyle = filters.safariStyle;
            if (filters.accommodationType)
                where.accommodationType = filters.accommodationType;
            if (filters.isFeatured !== undefined)
                where.isFeatured = filters.isFeatured;
            if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
                where.minPrice = {};
                if (filters.minPrice !== undefined)
                    where.minPrice.gte = filters.minPrice;
                if (filters.maxPrice !== undefined)
                    where.minPrice.lte = filters.maxPrice;
            }
            if (filters.durationDays) {
                where.durationDays = filters.durationDays;
            }
            if (filters.search) {
                where.OR = [
                    { title: { contains: filters.search, mode: 'insensitive' } },
                    { description: { contains: filters.search, mode: 'insensitive' } },
                    { shortDescription: { contains: filters.search, mode: 'insensitive' } },
                    { region: { contains: filters.search, mode: 'insensitive' } },
                ];
            }
            if (filters.availableFrom || filters.availableTo) {
                where.safariDates = {
                    some: {
                        status: { in: ['OPEN', 'GUARANTEED'] },
                        startDate: {
                            ...(filters.availableFrom && { gte: filters.availableFrom }),
                            ...(filters.availableTo && { lte: filters.availableTo }),
                        },
                    },
                };
            }
        }
        return where;
    }
    generateSlug(title) {
        let slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        slug += '-' + Math.random().toString(36).substring(2, 8);
        return slug;
    }
};
exports.SafarisService = SafarisService;
exports.SafarisService = SafarisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SafarisService);
//# sourceMappingURL=safaris.service.js.map