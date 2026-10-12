import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { SafarisService } from '../safaris/safaris.service';
import { UsersService } from '../users/users.service';
import { Prisma, Country, SafariStyle, AccommodationType } from '@prisma/client';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private safarisService: SafarisService,
    private usersService: UsersService,
  ) {}

  // Sync from Joomla to API database
  async syncFromJoomla() {
    this.logger.log('Starting Joomla sync...');
    const joomlaApiUrl = this.config.get<string>('joomla.apiUrl');
    const joomlaToken = this.config.get<string>('joomla.apiToken');

    if (!joomlaApiUrl || !joomlaToken) {
      throw new Error('Joomla API not configured');
    }

    // Fetch articles from Joomla
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
        } else {
          await this.safarisService.create({ ...safariData, joomlaArticleId: article.id });
          created++;
        }
      } catch (error) {
        errors++;
        this.logger.error(`Failed to sync article ${article.id}: ${error.message}`);
      }
    }

    this.logger.log(`Joomla sync complete: ${created} created, ${updated} updated, ${errors} errors`);
    return { created, updated, errors };
  }

  private async fetchJoomlaArticles(baseUrl: string, token: string) {
    // This would call Joomla's REST API (com_api)
    // Example endpoint: GET /api/articles?filter[category]=safaris
    const response = await fetch(`${baseUrl}/api/articles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }

  private mapArticleToSafari(article: any) {
    // Map Joomla custom fields to Safari model
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

  // Sync users from Joomla
  async syncUsersFromJoomla() {
    const joomlaApiUrl = this.config.get<string>('joomla.apiUrl');
    const joomlaToken = this.config.get<string>('joomla.apiToken');

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
      } else {
        await this.usersService.create({
          email: user.email,
          passwordHash: '', // Will need password reset
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

  // Push booking to Joomla (for admin viewing)
  async pushBookingToJoomla(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true, safari: true, safariDate: true },
    });

    if (!booking) throw new Error('Booking not found');

    const joomlaApiUrl = this.config.get<string>('joomla.apiUrl');
    const joomlaToken = this.config.get<string>('joomla.apiToken');

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

  private mapCountry(value: string): Country {
    const v = value?.toLowerCase() || '';
    if (v.includes('kenya')) return 'KENYA';
    if (v.includes('tanzania')) return 'TANZANIA';
    if (v.includes('uganda')) return 'UGANDA';
    if (v.includes('rwanda')) return 'RWANDA';
    if (v.includes('burundi')) return 'BURUNDI';
    return 'KENYA';
  }

  private mapAccommodation(value: string): AccommodationType {
    const v = value?.toLowerCase() || '';
    if (v.includes('lodge')) return 'LODGE';
    if (v.includes('tented') || v.includes('camp')) return 'TENTED_CAMP';
    if (v.includes('camping')) return 'CAMPING';
    if (v.includes('hotel')) return 'HOTEL';
    return 'GUEST_HOUSE';
  }

  private mapSafariStyle(value: string): SafariStyle {
    const v = value?.toLowerCase() || '';
    if (v.includes('flying')) return 'FLYING_SAFARI';
    if (v.includes('walking') || v.includes('trekking')) return 'WALKING_TREKKING';
    if (v.includes('climb') || v.includes('mountain')) return 'MOUNTAIN_CLIMB';
    if (v.includes('excursion')) return 'SHORT_EXCURSION';
    if (v.includes('cultural')) return 'CULTURAL';
    if (v.includes('camping')) return 'CAMPING_SAFARI';
    return 'LODGE_SAFARI';
  }

  private mapJoomlaRole(groups: string[]): 'CUSTOMER' | 'AGENT' | 'ADMIN' | 'SUPER_ADMIN' {
    if (groups.includes('Super Users')) return 'SUPER_ADMIN';
    if (groups.includes('Administrator')) return 'ADMIN';
    if (groups.includes('Agents')) return 'AGENT';
    return 'CUSTOMER';
  }
}