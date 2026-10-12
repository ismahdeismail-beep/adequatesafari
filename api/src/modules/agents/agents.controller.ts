import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Agents')
@Controller('agents')
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Apply to become an agent' })
  async apply(@Request() req, @Body() data: { companyName: string; licenseNumber: string }) {
    return this.agentsService.applyForAgent(req.user.id, data);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my agent profile' })
  async myProfile(@Request() req) {
    return this.agentsService.getMyProfile(req.user.id);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my agent profile' })
  async updateProfile(@Request() req, @Body() data: { companyName?: string; licenseNumber?: string }) {
    return this.agentsService.updateMyProfile(req.user.id, data);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my agent statistics' })
  async myStats(@Request() req) {
    return this.agentsService.getAgentStats(req.user.id);
  }

  @Get('me/bookings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my agent bookings' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  async myBookings(
    @Request() req,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('status') status?: string,
  ) {
    return this.agentsService.getAgentBookings(req.user.id, { skip, take, status });
  }

  // Admin routes
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all agents (admin)' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'isApproved', required: false, type: Boolean })
  async list(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('isApproved') isApproved?: boolean,
  ) {
    return this.agentsService.findAll({
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 20,
      where: isApproved !== undefined ? { isApproved } : undefined,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get agent by ID (admin)' })
  async get(@Param('id') id: string) {
    return this.agentsService.findById(id);
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve agent (admin)' })
  async approve(@Param('id') id: string, @Body() data: { commissionRate?: number }) {
    return this.agentsService.approveAgent(id, data.commissionRate);
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject agent (admin)' })
  async reject(@Param('id') id: string) {
    return this.agentsService.rejectAgent(id);
  }

  @Put(':id/commission')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update commission rate (admin)' })
  async updateCommission(@Param('id') id: string, @Body() data: { commissionRate: number }) {
    return this.agentsService.updateCommissionRate(id, data.commissionRate);
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get agent statistics (admin)' })
  async stats(@Param('id') id: string) {
    return this.agentsService.getAgentStats(id);
  }
}