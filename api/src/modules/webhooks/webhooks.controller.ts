import { Controller, Post, Get, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, SyncStatus } from '@prisma/client';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post('joomla')
  @ApiOperation({ summary: 'Receive webhook from Joomla' })
  async joomlaWebhook(@Body() body: any) {
    return this.webhooksService.processEvent({
      event: body.event,
      timestamp: new Date().toISOString(),
      data: body.data,
      source: 'joomla',
    });
  }

  @Post('internal')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send internal webhook (admin)' })
  async internalWebhook(@Body() body: { event: string; data: any }) {
    return this.webhooksService.processEvent({
      event: body.event,
      timestamp: new Date().toISOString(),
      data: body.data,
      source: 'internal',
    });
  }

  // Admin: Sync logs
  @Get('sync-logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get sync logs (admin)' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'entityType', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: SyncStatus })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  async getSyncLogs(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('entityType') entityType?: string,
    @Query('status') status?: SyncStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.webhooksService.getSyncLogs({
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 50,
      entityType,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Post('sync-logs/retry')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retry failed syncs (admin)' })
  async retryFailed(@Body() body: { entityType?: string }) {
    return this.webhooksService.retryFailedSyncs(body.entityType);
  }
}