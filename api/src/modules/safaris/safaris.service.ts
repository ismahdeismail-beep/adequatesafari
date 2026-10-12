import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Safari, Country, SafariStyle, AccommodationType } from '@prisma/client';

interface SafariFilters {
  country?: Country;
  safariStyle?: SafariStyle;
  accommodationType?: AccommodationType;
  minPrice?: number;
  maxPrice?: number;
  durationDays?: number;
  isFeatured?: boolean;
  search?: string;
  availableFrom?: Date;
  availableTo?: Date;
}

@Injectable()
export class SafarisService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.SafariCreateInput) {
    // Generate slug from title
    const slug = this.generateSlug(data.title as string);
    return this.prisma.safari.create({
      data: { ...data, slug },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.SafariWhereInput;
    orderBy?: Prisma.SafariOrderByWithRelationInput;
    filters?: SafariFilters;
  }) {
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

  async findBySlug(slug: string) {
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
      throw new NotFoundException('Safari not found');
    }
    return safari;
  }

  async findById(id: string) {
    const safari = await this.prisma.safari.findUnique({
      where: { id },
      include: {
        safariDates: {
          orderBy: { startDate: 'asc' },
        },
      },
    });
    if (!safari) {
      throw new NotFoundException('Safari not found');
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

  async findByCountry(country: Country, limit = 20) {
    return this.prisma.safari.findMany({
      where: { country, isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: limit,
    });
  }

  async update(id: string, data: Prisma.SafariUpdateInput) {
    await this.findById(id);
    if (data.title) {
      data.slug = this.generateSlug(data.title as string);
    }
    return this.prisma.safari.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);
    return this.prisma.safari.delete({ where: { id } });
  }

  async toggleFeatured(id: string, isFeatured: boolean) {
    return this.prisma.safari.update({
      where: { id },
      data: { isFeatured },
    });
  }

  async toggleActive(id: string, isActive: boolean) {
    return this.prisma.safari.update({
      where: { id },
      data: { isActive },
    });
  }

  // Safari Dates
  async addDate(safariId: string, data: Prisma.SafariDateCreateInput) {
    await this.findById(safariId);
    return this.prisma.safariDate.create({
      data: { ...data, safariId },
    });
  }

  async updateDate(dateId: string, data: Prisma.SafariDateUpdateInput) {
    return this.prisma.safariDate.update({ where: { id: dateId }, data });
  }

  async deleteDate(dateId: string) {
    return this.prisma.safariDate.delete({ where: { id: dateId } });
  }

  async getAvailability(safariId: string, startDate: Date, endDate: Date) {
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

  private buildWhere(filters?: SafariFilters, additionalWhere?: Prisma.SafariWhereInput): Prisma.SafariWhereInput {
    const where: Prisma.SafariWhereInput = {
      isActive: true,
      ...additionalWhere,
    };

    if (filters) {
      if (filters.country) where.country = filters.country;
      if (filters.safariStyle) where.safariStyle = filters.safariStyle;
      if (filters.accommodationType) where.accommodationType = filters.accommodationType;
      if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        where.minPrice = {};
        if (filters.minPrice !== undefined) where.minPrice.gte = filters.minPrice;
        if (filters.maxPrice !== undefined) where.minPrice.lte = filters.maxPrice;
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

  private generateSlug(title: string): string {
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    // Add random suffix to ensure uniqueness
    slug += '-' + Math.random().toString(36).substring(2, 8);
    return slug;
  }
}