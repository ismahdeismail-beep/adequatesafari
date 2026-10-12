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
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let WebhooksService = WebhooksService_1 = class WebhooksService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(WebhooksService_1.name);
    }
    async processEvent(event) {
        this.logger.log(`Processing webhook: ${event.event} from ${event.source}`);
        await this.logEvent(event);
        switch (event.event) {
            case 'safari.created':
            case 'safari.updated':
                await this.handleSafariSync(event);
                break;
            case 'safari.deleted':
                await this.handleSafariDelete(event);
                break;
            case 'booking.created':
            case 'booking.updated':
                await this.handleBookingSync(event);
                break;
            case 'user.created':
            case 'user.updated':
                await this.handleUserSync(event);
                break;
            case 'payment.completed':
                await this.handlePaymentSync(event);
                break;
            default:
                this.logger.warn(`Unknown webhook event: ${event.event}`);
        }
    }
    async logEvent(event) {
        await this.prisma.syncLog.create({
            data: {
                entityType: event.event.split('.')[0],
                entityId: event.data.id || 'unknown',
                action: event.event.split('.')[1].toUpperCase(),
                status: 'PROCESSING',
                payload: event.data,
            },
        });
    }
    async handleSafariSync(event) {
        const { id, ...data } = event.data;
        const action = event.event.endsWith('.created') ? 'CREATE' : 'UPDATE';
        try {
            if (action === 'CREATE') {
                await this.prisma.safari.create({
                    data: {
                        ...this.mapJoomlaSafari(data),
                        joomlaArticleId: id,
                    },
                });
            }
            else {
                await this.prisma.safari.update({
                    where: { joomlaArticleId: id },
                    data: this.mapJoomlaSafari(data),
                });
            }
            await this.updateSyncLog(event.data.id, 'COMPLETED');
        }
        catch (error) {
            await this.updateSyncLog(event.data.id, 'FAILED', error.message);
        }
    }
    async handleSafariDelete(event) {
        try {
            await this.prisma.safari.delete({
                where: { joomlaArticleId: event.data.id },
            });
            await this.updateSyncLog(event.data.id, 'COMPLETED');
        }
        catch (error) {
            await this.updateSyncLog(event.data.id, 'FAILED', error.message);
        }
    }
    async handleBookingSync(event) {
        this.logger.log(`Booking sync: ${event.event}`, event.data);
    }
    async handleUserSync(event) {
        this.logger.log(`User sync: ${event.event}`, event.data);
    }
    async handlePaymentSync(event) {
        this.logger.log(`Payment sync: ${event.event}`, event.data);
    }
    async updateSyncLog(entityId, status, error) {
        await this.prisma.syncLog.updateMany({
            where: { entityId, status: 'PROCESSING' },
            data: { status, error, completedAt: new Date() },
        });
    }
    mapJoomlaSafari(data) {
        return {
            title: data.title,
            slug: data.alias || data.title.toLowerCase().replace(/\s+/g, '-'),
            shortDescription: data.introtext,
            description: data.fulltext,
            country: this.mapCountry(data.category),
            region: data.region,
            durationDays: parseInt(data.duration_days) || 1,
            durationNights: parseInt(data.duration_nights) || 0,
            minPrice: data.price || 0,
            maxPrice: data.max_price || data.price || 0,
            currency: data.currency || 'USD',
            accommodationType: this.mapAccommodation(data.accommodation_type),
            safariStyle: this.mapSafariStyle(data.safari_style),
            difficulty: data.difficulty || 'MODERATE',
            groupSizeMin: parseInt(data.min_group) || 1,
            groupSizeMax: parseInt(data.max_group) || 12,
            highlights: data.highlights ? JSON.parse(data.highlights) : [],
            inclusions: data.inclusions ? JSON.parse(data.inclusions) : [],
            exclusions: data.exclusions ? JSON.parse(data.exclusions) : [],
            itinerary: data.itinerary ? JSON.parse(data.itinerary) : [],
            images: data.images ? JSON.parse(data.images) : [],
            thumbnail: data.thumbnail,
            isActive: data.state === 1,
            isFeatured: data.featured === 1,
        };
    }
    mapCountry(category) {
        const cat = category.toLowerCase();
        if (cat.includes('kenya'))
            return 'KENYA';
        if (cat.includes('tanzania'))
            return 'TANZANIA';
        if (cat.includes('uganda'))
            return 'UGANDA';
        if (cat.includes('rwanda'))
            return 'RWANDA';
        if (cat.includes('burundi'))
            return 'BURUNDI';
        return 'KENYA';
    }
    mapAccommodation(type) {
        const t = type?.toLowerCase() || '';
        if (t.includes('lodge'))
            return 'LODGE';
        if (t.includes('tented') || t.includes('camp'))
            return 'TENTED_CAMP';
        if (t.includes('camping'))
            return 'CAMPING';
        if (t.includes('hotel'))
            return 'HOTEL';
        return 'GUEST_HOUSE';
    }
    mapSafariStyle(style) {
        const s = style?.toLowerCase() || '';
        if (s.includes('flying'))
            return 'FLYING_SAFARI';
        if (s.includes('walking') || s.includes('trekking'))
            return 'WALKING_TREKKING';
        if (s.includes('climb') || s.includes('mountain'))
            return 'MOUNTAIN_CLIMB';
        if (s.includes('excursion'))
            return 'SHORT_EXCURSION';
        if (s.includes('cultural'))
            return 'CULTURAL';
        if (s.includes('camping'))
            return 'CAMPING_SAFARI';
        return 'LODGE_SAFARI';
    }
    async getSyncLogs(params) {
        const { skip, take, entityType, status, startDate, endDate } = params;
        const where = {};
        if (entityType)
            where.entityType = entityType;
        if (status)
            where.status = status;
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate)
                where.createdAt.gte = startDate;
            if (endDate)
                where.createdAt.lte = endDate;
        }
        const [data, total] = await Promise.all([
            this.prisma.syncLog.findMany({
                skip,
                take,
                where,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.syncLog.count({ where }),
        ]);
        return { data, total };
    }
    async retryFailedSyncs(entityType) {
        const logs = await this.prisma.syncLog.findMany({
            where: {
                status: 'FAILED',
                ...(entityType && { entityType }),
                retries: { lt: 3 },
            },
        });
        for (const log of logs) {
            await this.prisma.syncLog.update({
                where: { id: log.id },
                data: { status: 'PENDING', retries: { increment: 1 } },
            });
        }
        return { retried: logs.length };
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map