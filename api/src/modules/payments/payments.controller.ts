import { Controller, Post, Get, Put, Body, Param, Query, Request, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Request as ExpressRequest } from 'express';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('stripe/intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe Payment Intent' })
  async createStripeIntent(@Request() req, @Body() data: { bookingId: string }) {
    return this.paymentsService.createStripePaymentIntent(data.bookingId, req.user.id);
  }

  @Post('stripe/webhook')
  @ApiOperation({ summary: 'Stripe Webhook' })
  @ApiHeader({ name: 'stripe-signature', required: true })
  async stripeWebhook(
    @Req() req: RawBodyRequest<ExpressRequest>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleStripeWebhook(req.rawBody!, signature);
  }

  @Post('mpesa/stk-push')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate M-Pesa STK Push' })
  async mpesaStkPush(@Request() req, @Body() data: { bookingId: string; phoneNumber: string }) {
    return this.paymentsService.initiateMpesaSTKPush(data.bookingId, req.user.id, data.phoneNumber);
  }

  @Post('mpesa/callback')
  @ApiOperation({ summary: 'M-Pesa Callback' })
  async mpesaCallback(@Body() body: any) {
    return this.paymentsService.handleMpesaCallback(body);
  }

  @Post('mpesa/timeout')
  @ApiOperation({ summary: 'M-Pesa Timeout' })
  async mpesaTimeout(@Body() body: { checkoutRequestId: string }) {
    return this.paymentsService.handleMpesaTimeout(body.checkoutRequestId);
  }

  @Get('booking/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payments for a booking' })
  async getBookingPayments(@Param('bookingId') bookingId: string) {
    return this.paymentsService.getPaymentsByBooking(bookingId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  async getPayment(@Param('id') id: string) {
    return this.paymentsService.getPaymentById(id);
  }

  @Post(':id/refund')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refund payment (admin)' })
  async refund(@Param('id') id: string, @Body() data: { amount?: number }) {
    return this.paymentsService.refundPayment(id, data.amount);
  }
}