import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, BookingStatus, PaymentStatus } from '@prisma/client';
import { Prisma } from '@prisma/client';

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  async create(@Request() req, @Body() data: {
    safariId: string;
    safariDateId: string;
    adults: number;
    children: number;
    specialRequests?: string;
    passengers: Array<{
      firstName: string;
      lastName: string;
      dateOfBirth?: string;
      passportNumber?: string;
      nationality?: string;
      specialNeeds?: string;
      isLead?: boolean;
    }>;
  }) {
    return this.bookingsService.create({
      userId: req.user.id,
      ...data,
      passengers: data.passengers.map(p => ({
        ...p,
        dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : undefined,
      })),
    });
  }

  @Get()
  @ApiOperation({ summary: 'List user bookings' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  async list(
    @Request() req,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('status') status?: BookingStatus,
  ) {
    return this.bookingsService.getUserBookings(req.user.id, status);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get booking statistics' })
  async stats(@Request() req) {
    return this.bookingsService.getBookingStats(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiParam({ name: 'id', type: String })
  async get(@Request() req, @Param('id') id: string) {
    const booking = await this.bookingsService.findById(id, true);
    // Ensure user owns this booking or is admin
    if (booking.userId !== req.user.id && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      return { success: false, message: 'Not authorized' };
    }
    return booking;
  }

  @Get('ref/:bookingRef')
  @ApiOperation({ summary: 'Get booking by reference (public lookup)' })
  @ApiParam({ name: 'bookingRef', type: String })
  async getByRef(@Param('bookingRef') bookingRef: string) {
    return this.bookingsService.findByRef(bookingRef);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiParam({ name: 'id', type: String })
  async cancel(@Request() req, @Param('id') id: string, @Body() data: { reason?: string }) {
    const booking = await this.bookingsService.findById(id);
    if (booking.userId !== req.user.id && !['ADMIN', 'SUPER_ADMIN'].includes(req.user.role)) {
      return { success: false, message: 'Not authorized' };
    }
    if (['CANCELLED', 'COMPLETED'].includes(booking.status)) {
      return { success: false, message: 'Cannot cancel this booking' };
    }
    return this.bookingsService.updateStatus(id, 'CANCELLED', data.reason);
  }

  // Admin/Agent routes
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all bookings (admin)' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  @ApiQuery({ name: 'paymentStatus', required: false, enum: PaymentStatus })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'agentId', required: false, type: String })
  async adminList(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('status') status?: BookingStatus,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
    @Query('userId') userId?: string,
    @Query('agentId') agentId?: string,
  ) {
    return this.bookingsService.findAll({
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 50,
      where: { status, paymentStatus, userId, agentId },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all booking stats (admin)' })
  async adminStats() {
    return this.bookingsService.getBookingStats();
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update booking status (admin)' })
  async updateStatus(@Param('id') id: string, @Body() data: { status: BookingStatus; notes?: string }) {
    return this.bookingsService.updateStatus(id, data.status, data.notes);
  }

  @Put(':id/payment-status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update payment status (admin)' })
  async updatePaymentStatus(@Param('id') id: string, @Body() data: { paymentStatus: PaymentStatus }) {
    return this.bookingsService.updatePaymentStatus(id, data.paymentStatus);
  }

  @Get('agent/me')
  @UseGuards(RolesGuard)
  @Roles(Role.AGENT, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get agent bookings' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus })
  async agentBookings(@Request() req, @Query('status') status?: BookingStatus) {
    // Get agent profile ID from user
    // This would need the agent profile lookup
    return this.bookingsService.getAgentBookings(req.user.id, status);
  }

  @Get('agent/stats')
  @UseGuards(RolesGuard)
  @Roles(Role.AGENT, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get agent booking stats' })
  async agentStats(@Request() req) {
    return this.bookingsService.getBookingStats(undefined, req.user.id);
  }
}