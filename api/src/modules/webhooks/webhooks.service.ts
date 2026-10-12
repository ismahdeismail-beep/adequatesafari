import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, SyncAction, SyncStatus } from '@prisma/client';

export interface WebhookEvent {
  event: string;
  timestamp: string;
  data: any;
  source: 'joomla' | 'stripe' | 'mpesa' | 'internal';
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private prisma: PrismaService) {}

  async processEvent(event: WebhookEvent) {
    this.logger.log(`Processing webhook: ${event.event} from ${event.source}`);

    // Log the event
    await this.logEvent(event);

    // Route to appropriate handler
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

  private async logEvent(event: WebhookEvent) {
    await this.prisma.syncLog.create({
      data: {
        entityType: event.event.split('.')[0],
        entityId: event.data.id || 'unknown',
        action: event.event.split('.')[1].toUpperCase() as SyncAction,
        status: 'PROCESSING',
        payload: event.data,
      },
    });
  }

  private async handleSafariSync(event: WebhookEvent) {
    const { id, ...data } = event.data;
    const action = event.event.endsWith('.created') ? 'CREATE' : 'UPDATE';

    try {
      if (action === 'CREATE') {
        // Create new safari from Joomla data
        await this.prisma.safari.create({
          data: {
            ...this.mapJoomlaSafari(data),
            joomlaArticleId: id,
          },
        });
      } else {
        // Update existing safari
        await this.prisma.safari.update({
          where: { joomlaArticleId: id },
          data: this.mapJoomlaSafari(data),
        });
      }
      await this.updateSyncLog(event.data.id, 'COMPLETED');
    } catch (error) {
      await this.updateSyncLog(event.data.id, 'FAILED', error.message);
    }
  }

  private async handleSafariDelete(event: WebhookEvent) {
    try {
      await this.prisma.safari.delete({
        where: { joomlaArticleId: event.data.id },
      });
      await this.updateSyncLog(event.data.id, 'COMPLETED');
    } catch (error) {
      await this.updateSyncLog(event.data.id, 'FAILED', error.message);
    }
  }

  private async handleBookingSync(event: WebhookEvent) {
    // Handle booking sync from external systems
    this.logger.log(`Booking sync: ${event.event}`, event.data);
  }

  private async handleUserSync(event: WebhookEvent) {
    // Handle user sync from Joomla
    this.logger.log(`User sync: ${event.event}`, event.data);
  }

  private async handlePaymentSync(event: WebhookEvent) {
    // Handle payment confirmation
    this.logger.log(`Payment sync: ${event.event}`, event.data);
  }

  private async updateSyncLog(entityId: string, status: SyncStatus, error?: string) {
    await this.prisma.syncLog.updateMany({
      where: { entityId, status: 'PROCESSING' },
      data: { status, error, completedAt: new Date() },
    });
  }

  private mapJoomlaSafari(data: any) {
    // Map Joomla article data to Safari model
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

  private mapCountry(category: string): 'KENYA' | 'TANZANIA' | 'UGANDA' | 'RWANDA' | 'BURUNDI' {
    const cat = category.toLowerCase();
    if (cat.includes('kenya')) return 'KENYA';
    if (cat.includes('tanzania')) return 'TANZANIA';
    if (cat.includes('uganda')) return 'UGANDA';
    if (cat.includes('rwanda')) return 'RWANDA';
    if (cat.includes('burundi')) return 'BURUNDI';
    return 'KENYA';
  }

  private mapAccommodation(type: string): 'LODGE' | 'TENTED_CAMP' | 'CAMPING' | 'HOTEL' | 'GUEST_HOUSE' {
    const t = type?.toLowerCase() || '';
    if (t.includes('lodge')) return 'LODGE';
    if (t.includes('tented') || t.includes('camp')) return 'TENTED_CAMP';
    if (t.includes('camping')) return 'CAMPING';
    if (t.includes('hotel')) return 'HOTEL';
    return 'GUEST_HOUSE';
  }

  private mapSafariStyle(style: string): 'LODGE_SAFARI' | 'CAMPING_SAFARI' | 'FLYING_SAFARI' | 'WALKING_TREKKING' | 'MOUNTAIN_CLIMB' | 'SHORT_EXCURSION' | 'CULTURAL' {
    const s = style?.toLowerCase() || '';
    if (s.includes('flying')) return 'FLYING_SAFARI';
    if (s.includes('walking') || s.includes('trekking')) return 'WALKING_TREKKING';
    if (s.includes('climb') || s.includes('mountain')) return 'MOUNTAIN_CLIMB';
    if (s.includes('excursion')) return 'SHORT_EXCURSION';
    if (s.includes('cultural')) return 'CULTURAL';
    if (s.includes('camping')) return 'CAMPING_SAFARI';
    return 'LODGE_SAFARI';
  }

  // Admin: Get sync logs
  async getSyncLogs(params: {
    skip?: number;
    take?: number;
    entityType?: string;
    status?: SyncStatus;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { skip, take, entityType, status, startDate, endDate } = params;
    const where: Prisma.SyncLogWhereInput = {};
    if (entityType) where.entityType = entityType;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
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

  // Retry failed syncs
  async retryFailedSyncs(entityType?: string) {
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
      // Re-process would happen via queue/worker
    }

    return { retried: logs.length };
  }
}