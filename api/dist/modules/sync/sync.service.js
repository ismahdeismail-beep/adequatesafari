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
var SyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const safaris_service_1 = require("../safaris/safaris.service");
const users_service_1 = require("../users/users.service");
let SyncService = SyncService_1 = class SyncService {
    constructor(config, prisma, safarisService, usersService) {
        this.config = config;
        this.prisma = prisma;
        this.safarisService = safarisService;
        this.usersService = usersService;
        this.logger = new common_1.Logger(SyncService_1.name);
    }
    async syncFromJoomla() {
        this.logger.log('Starting Joomla sync...');
        const joomlaApiUrl = this.config.get('joomla.apiUrl');
        const joomlaToken = this.config.get('joomla.apiToken');
        if (!joomlaApiUrl || !joomlaToken) {
            throw new Error('Joomla API not configured');
        }
        const articles = await this.fetchJoomlaArticles(joomlaApiUrl, joomlaToken);
        let created = 0, updated = 0, errors = 0;
        for (const article of articles) {
            try {
                const existing = await this.prisma.safari.findUnique({
                    where: { joomlaArticleId: article.id },
                });
                const safariData = this.mapArticleToSafari(article);
                if (existing) {
                    await this.safarisService.update(existing.id, safariData);
                    updated++;
                }
                else {
                    await this.safarisService.create({ ...safariData, joomlaArticleId: article.id });
                    created++;
                }
            }
            catch (error) {
                errors++;
                this.logger.error(`Failed to sync article ${article.id}: ${error.message}`);
            }
        }
        this.logger.log(`Joomla sync complete: ${created} created, ${updated} updated, ${errors} errors`);
        return { created, updated, errors };
    }
    async fetchJoomlaArticles(baseUrl, token) {
        const response = await fetch(`${baseUrl}/api/articles`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.json();
    }
    mapArticleToSafari(article) {
        const fields = article.customFields || {};
        return {
            title: article.title,
            slug: article.alias,
            shortDescription: article.introtext,
            description: article.fulltext,
            country: this.mapCountry(fields.country || article.category),
            region: fields.region,
            durationDays: parseInt(fields.duration_days) || 1,
            durationNights: parseInt(fields.duration_nights) || 0,
            minPrice: parseFloat(fields.price) || 0,
            maxPrice: parseFloat(fields.max_price) || parseFloat(fields.price) || 0,
            currency: fields.currency || 'USD',
            accommodationType: this.mapAccommodation(fields.accommodation_type),
            safariStyle: this.mapSafariStyle(fields.safari_style),
            difficulty: fields.difficulty || 'MODERATE',
            groupSizeMin: parseInt(fields.min_group) || 1,
            groupSizeMax: parseInt(fields.max_group) || 12,
            highlights: fields.highlights ? JSON.parse(fields.highlights) : [],
            inclusions: fields.inclusions ? JSON.parse(fields.inclusions) : [],
            exclusions: fields.exclusions ? JSON.parse(fields.exclusions) : [],
            itinerary: fields.itinerary ? JSON.parse(fields.itinerary) : [],
            images: fields.images ? JSON.parse(fields.images) : [],
            thumbnail: fields.thumbnail,
            isActive: article.state === 1,
            isFeatured: article.featured === 1,
            sortOrder: article.ordering || 0,
        };
    }
    async syncUsersFromJoomla() {
        const joomlaApiUrl = this.config.get('joomla.apiUrl');
        const joomlaToken = this.config.get('joomla.apiToken');
        const response = await fetch(`${baseUrl}/api/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const users = await response.json();
        let created = 0, updated = 0;
        for (const user of users) {
            const existing = await this.usersService.findByEmail(user.email).catch(() => null);
            if (existing) {
                await this.usersService.update(existing.id, {
                    firstName: user.name?.split(' ')[0] || '',
                    lastName: user.name?.split(' ').slice(1).join(' ') || '',
                    phone: user.phone,
                });
                updated++;
            }
            else {
                await this.usersService.create({
                    email: user.email,
                    passwordHash: '',
                    firstName: user.name?.split(' ')[0] || '',
                    lastName: user.name?.split(' ').slice(1).join(' ') || '',
                    phone: user.phone,
                    role: this.mapJoomlaRole(user.groups),
                });
                created++;
            }
        }
        return { created, updated };
    }
    async pushBookingToJoomla(bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { user: true, safari: true, safariDate: true },
        });
        if (!booking)
            throw new Error('Booking not found');
        const joomlaApiUrl = this.config.get('joomla.apiUrl');
        const joomlaToken = this.config.get('joomla.apiToken');
        await fetch(`${joomlaApiUrl}/api/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${joomlaToken}`,
            },
            body: JSON.stringify({
                bookingRef: booking.bookingRef,
                userEmail: booking.user.email,
                safariTitle: booking.safari.title,
                date: booking.safariDate.startDate,
                adults: booking.adults,
                children: booking.children,
                totalAmount: booking.totalAmount,
                status: booking.status,
                paymentStatus: booking.paymentStatus,
            }),
        });
    }
    mapCountry(value) {
        const v = value?.toLowerCase() || '';
        if (v.includes('kenya'))
            return 'KENYA';
        if (v.includes('tanzania'))
            return 'TANZANIA';
        if (v.includes('uganda'))
            return 'UGANDA';
        if (v.includes('rwanda'))
            return 'RWANDA';
        if (v.includes('burundi'))
            return 'BURUNDI';
        return 'KENYA';
    }
    mapAccommodation(value) {
        const v = value?.toLowerCase() || '';
        if (v.includes('lodge'))
            return 'LODGE';
        if (v.includes('tented') || v.includes('camp'))
            return 'TENTED_CAMP';
        if (v.includes('camping'))
            return 'CAMPING';
        if (v.includes('hotel'))
            return 'HOTEL';
        return 'GUEST_HOUSE';
    }
    mapSafariStyle(value) {
        const v = value?.toLowerCase() || '';
        if (v.includes('flying'))
            return 'FLYING_SAFARI';
        if (v.includes('walking') || v.includes('trekking'))
            return 'WALKING_TREKKING';
        if (v.includes('climb') || v.includes('mountain'))
            return 'MOUNTAIN_CLIMB';
        if (v.includes('excursion'))
            return 'SHORT_EXCURSION';
        if (v.includes('cultural'))
            return 'CULTURAL';
        if (v.includes('camping'))
            return 'CAMPING_SAFARI';
        return 'LODGE_SAFARI';
    }
    mapJoomlaRole(groups) {
        if (groups.includes('Super Users'))
            return 'SUPER_ADMIN';
        if (groups.includes('Administrator'))
            return 'ADMIN';
        if (groups.includes('Agents'))
            return 'AGENT';
        return 'CUSTOMER';
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        safaris_service_1.SafarisService,
        users_service_1.UsersService])
], SyncService);
//# sourceMappingURL=sync.service.js.map