import { Controller, Get, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Prisma } from '@prisma/client';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    const { passwordHash, ...rest } = user;
    return rest;
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(@Request() req, @Body() data: Prisma.UserUpdateInput) {
    const user = await this.usersService.update(req.user.id, data);
    const { passwordHash, ...rest } = user;
    return rest;
  }

  @Put('me/password')
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password changed' })
  async changePassword(@Request() req, @Body() data: { currentPassword: string; newPassword: string }) {
    await this.usersService.changePassword(req.user.id, data.currentPassword, data.newPassword);
    return { success: true, message: 'Password changed successfully' };
  }

  // Admin/Agent routes
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'List all users (admin only)' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, enum: Role })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async listUsers(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('role') role?: Role,
    @Query('isActive') isActive?: boolean,
  ) {
    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;

    return this.usersService.findAll({
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 20,
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get user by ID (admin only)' })
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    const { passwordHash, ...rest } = user;
    return rest;
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update user (admin only)' })
  async updateUser(@Param('id') id: string, @Body() data: Prisma.UserUpdateInput) {
    const user = await this.usersService.update(id, data);
    const { passwordHash, ...rest } = user;
    return rest;
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete user (super admin only)' })
  async deleteUser(@Param('id') id: string) {
    await this.usersService.delete(id);
    return { success: true, message: 'User deleted' };
  }
}