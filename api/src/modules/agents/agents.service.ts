import { Injectable, NotFoundException, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, AgentProfile, Role } from '@prisma/client';
import { UsersService } from '../users/users.service';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);

  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async applyForAgent(userId: string, data: {
    companyName: string;
    licenseNumber: string;
  }) {
    const user = await this.usersService.findById(userId);
    if (user.role !== 'CUSTOMER') {
      throw new BadRequestException('Only customers can apply to become agents');
    }

    const existing = await this.prisma.agentProfile.findUnique({ where: { userId } });
    if (existing) {
      throw new ConflictException('Agent profile already exists');
    }

    // Update user role to AGENT
    await this.usersService.update(userId, { role: 'AGENT' });

    const profile = await this.prisma.agentProfile.create({
      data: {
        userId,
        companyName: data.companyName,
        licenseNumber: data.licenseNumber,
        commissionRate: 10.0,
        isApproved: false,
      },
    });

    this.logger.log(`Agent application submitted: ${userId}`);
    return profile;
  }

  async getMyProfile(userId: string) {
    const profile = await this.prisma.agentProfile.findUnique({
      where: { userId },
      include: { user: true },
    });
    if (!profile) {
      throw new NotFoundException('Agent profile not found');
    }
    return profile;
  }

  async updateMyProfile(userId: string, data: Partial<Prisma.AgentProfileUpdateInput>) {
    const profile = await this.prisma.agentProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('Agent profile not found');
    }
    return this.prisma.agentProfile.update({
      where: { userId },
      data,
    });
  }

  // Admin routes
  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.AgentProfileWhereInput;
    orderBy?: Prisma.AgentProfileOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    const [data, total] = await Promise.all([
      this.prisma.agentProfile.findMany({
        skip,
        take,
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        include: { user: true },
      }),
      this.prisma.agentProfile.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id: string) {
    const profile = await this.prisma.agentProfile.findUnique({
      where: { id },
      include: { user: true, bookings: { take: 10, orderBy: { createdAt: 'desc' } } },
    });
    if (!profile) throw new NotFoundException('Agent not found');
    return profile;
  }

  async approveAgent(id: string, commissionRate?: number) {
    const profile = await this.findById(id);
    if (profile.isApproved) {
      throw new BadRequestException('Agent already approved');
    }
    return this.prisma.agentProfile.update({
      where: { id },
      data: {
        isApproved: true,
        approvedAt: new Date(),
        ...(commissionRate && { commissionRate }),
      },
    });
  }

  async rejectAgent(id: string) {
    const profile = await this.findById(id);
    // Revert user to CUSTOMER
    await this.usersService.update(profile.userId, { role: 'CUSTOMER' });
    await this.prisma.agentProfile.delete({ where: { id } });
    return { success: true, message: 'Agent application rejected' };
  }

  async updateCommissionRate(id: string, commissionRate: number) {
    if (commissionRate < 0 || commissionRate > 50) {
      throw new BadRequestException('Commission rate must be between 0 and 50%');
    }
    return this.prisma.agentProfile.update({
      where: { id },
      data: { commissionRate },
    });
  }

  async getAgentStats(agentId: string) {
    const profile = await this.findById(agentId);
    const bookings = await this.prisma.booking.findMany({
      where: { agentId },
      include: { payments: true },
    });

    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
    const paidBookings = bookings.filter(b => b.paymentStatus === 'PAID');
    const totalRevenue = paidBookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
    const totalCommission = paidBookings.reduce((sum, b) => {
      const commission = Number(b.totalAmount) * (profile.commissionRate / 100);
      return sum + commission;
    }, 0);
    const paidCommission = bookings
      .filter(b => b.commissionPaid)
      .reduce((sum, b) => sum + (Number(b.commissionAmount) || 0), 0);

    return {
      totalBookings,
      confirmedBookings,
      totalRevenue,
      totalCommission,
      paidCommission,
      pendingCommission: totalCommission - paidCommission,
      commissionRate: profile.commissionRate,
    };
  }

  async getAgentBookings(agentId: string, params: { skip?: number; take?: number; status?: string }) {
    const where: Prisma.BookingWhereInput = { agentId };
    if (params.status) where.status = params.status as any;

    const [data, total] = await Promise.all([
      this.prisma.booking.findMany({
        skip: params.skip,
        take: params.take,
        where,
        orderBy: { createdAt: 'desc' },
        include: { safari: true, safariDate: true, user: true, payments: true },
      }),
      this.prisma.booking.count({ where }),
    ]);
    return { data, total };
  }

  async markCommissionPaid(bookingId: string) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { commissionPaid: true },
    });
  }
}