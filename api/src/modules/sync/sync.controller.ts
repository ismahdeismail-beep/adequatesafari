import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Sync')
@Controller('sync')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@ApiBearerAuth()
export class SyncController {
  constructor(private syncService: SyncService) {}

  @Post('joomla')
  @ApiOperation({ summary: 'Trigger sync from Joomla' })
  async syncJoomla() {
    return this.syncService.syncFromJoomla();
  }

  @Post('joomla/users')
  @ApiOperation({ summary: 'Sync users from Joomla' })
  async syncUsers() {
    return this.syncService.syncUsersFromJoomla();
  }

  @Post('booking/:id/push')
  @ApiOperation({ summary: 'Push booking to Joomla' })
  async pushBooking(@Body('id') id: string) {
    return this.syncService.pushBookingToJoomla(id);
  }
}