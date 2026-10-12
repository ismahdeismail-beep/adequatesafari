import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Booking, BookingStatus, PaymentStatus, SafariDate } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

interface CreateBookingDto {
  userId: string;
  safariId: string;
  safariDateId: string;
  adults: number;
  children: number;
  specialRequests?: string;
  agentId?: string;
  passengers: Array<{
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    passportNumber?: string;
    nationality?: string;
    specialNeeds?: string;
    isLead?: boolean;
  }>;
}

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookingDto) {
    // Validate safari date availability
    const safariDate = await this.prisma.safariDate.findUnique({
      where: { id: dto.safariDateId },
      include: { safari: true },
    });

    if (!safariDate) {
      throw new NotFoundException('Safari date not found');
    }

    if (safariDate.status !== 'OPEN' && safariDate.status !== 'GUARANTEED') {
      throw new BadRequestException('Safari date is not available for booking');
    }

    const totalPassengers = dto.adults + dto.children;
    const available = safariDate.availability - safariDate.booked;
    if (totalPassengers > available) {
      throw new BadRequestException(`Only ${available} spots available`);
    }

    if (dto.passengers.length !== totalPassengers) {
      throw new BadRequestException('Passenger count must match adults + children');
    }

    // Calculate total amount
    const totalAmount = Number(safariDate.price) * totalPassengers;

    // Generate booking reference
    const bookingRef = this.generateBookingRef();

    // Create booking with passengers in transaction
    const booking = await this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          bookingRef,
          userId: dto.userId,
          safariId: dto.safariId,
          safariDateId: dto.safariDateId,
          agentId: dto.agentId,
          adults: dto.adults,
          children: dto.children,
          specialRequests: dto.specialRequests,
          totalAmount,
          currency: safariDate.currency,
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          passengers: {
            create: dto.passengers.map((p, i) => ({
              ...p,
              isLead: i === 0 || p.isLead,
            })),
          },
        },
        include: { passengers: true },
      });

      // Update safari date booked count
      await tx.safariDate.update({
        where: { id: dto.safariDateId },
        data: { booked: { increment: totalPassengers } },
      });

      return booking;
    });

    this.logger.log(`Booking created: ${bookingRef} for user ${dto.userId}`);
    return booking;
  }

  async findById(id: string, includeRelations = false) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: includeRelations
        ? {
            user: true,
            safari: true,
            safariDate: true,
            agent: { include: { user: true } },
            payments: true,
            passengers: true,
          }
        : { passengers: true },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async findByRef(bookingRef: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { bookingRef },
      include: { user: true, safari: true, safariDate: true, payments: true, passengers: true },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.BookingWhereInput;
    orderBy?: Prisma.BookingOrderByWithRelationInput;
    userId?: string;
    agentId?: string;
  }) {
    const { skip, take, where, orderBy, userId, agentId } = params;

    const builtWhere: Prisma.BookingWhereInput = { ...where };
    if (userId) builtWhere.userId = userId;
    if (agentId) builtWhere.agentId = agentId;

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        skip,
        take,
        where: builtWhere,
        orderBy: orderBy || { createdAt: 'desc' },
        include: { safari: true, safariDate: true, payments: true },
      }),
      this.prisma.booking.count({ where: builtWhere }),
    ]);

    return { data, total };
  }

  async updateStatus(id: string, status: BookingStatus, notes?: string) {
    const booking = await this.findById(id);
    const data: Prisma.BookingUpdateInput = { status };
    if (notes) data.internalNotes = notes;
    if (status === 'CONFIRMED') data.confirmedAt = new Date();
    if (status === 'CANCELLED') {
      data.cancelledAt = new Date();
      data.cancelledReason = notes;
      // Release spots back to safari date
      await this.prisma.safariDate.update({
        where: { id: booking.safariDateId },
        data: { booked: { decrement: booking.adults + booking.children } },
      });
    }
    return this.prisma.booking.update({ where: { id }, data });
  }

  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus, paidAmount?: number) {
    const booking = await this.findById(id);
    const data: Prisma.BookingUpdateInput = { paymentStatus };
    if (paidAmount !== undefined) {
      // Could track partial payments here
    }
    if (paymentStatus === 'PAID' && booking.status === 'PENDING') {
      data.status = 'CONFIRMED';
      data.confirmedAt = new Date();
    }
    return this.prisma.booking.update({ where: { id }, data });
  }

  async calculateCommission(bookingId: string) {
    const booking = await this.findById(bookingId, true);
    if (!booking.agentId) return null;

    const agent = await this.prisma.agentProfile.findUnique({
      where: { id: booking.agentId },
    });
    if (!agent) return null;

    const commissionAmount = Number(booking.totalAmount) * (agent.commissionRate / 100);
    return {
      agentId: agent.id,
      commissionRate: agent.commissionRate,
      commissionAmount,
      currency: booking.currency,
    };
  }

  async markCommissionPaid(bookingId: string) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { commissionPaid: true },
    });
  }

  async getUserBookings(userId: string, status?: BookingStatus) {
    return this.findAll({ userId, where: status ? { status } : undefined });
  }

  async getAgentBookings(agentId: string, status?: BookingStatus) {
    return this.findAll({ agentId, where: status ? { status } : undefined });
  }

  async getBookingStats(userId?: string, agentId?: string) {
    const where: Prisma.BookingWhereInput = {};
    if (userId) where.userId = userId;
    if (agentId) where.agentId = agentId;

    const [total, pending, confirmed, cancelled, paid] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.count({ where: { ...where, status: 'PENDING' } }),
      this.prisma.booking.count({ where: { ...where, status: 'CONFIRMED' } }),
      this.prisma.booking.count({ where: { ...where, status: 'CANCELLED' } }),
      this.prisma.booking.count({ where: { ...where, paymentStatus: 'PAID' } }),
    ]);

    const revenue = await this.prisma.booking.aggregate({
      where: { ...where, paymentStatus: 'PAID' },
      _sum: { totalAmount: true },
    });

    return { total, pending, confirmed, cancelled, paid, totalRevenue: revenue._sum.totalAmount || 0 };
  }

  private generateBookingRef(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `AAS-${date}-${random}`;
  }
}