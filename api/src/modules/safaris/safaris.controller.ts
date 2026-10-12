import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SafarisService } from './safaris.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role, Country, SafariStyle, AccommodationType } from '@prisma/client';
import { Prisma } from '@prisma/client';

@ApiTags('Safaris')
@Controller('safaris')
export class SafarisController {
  constructor(private safarisService: SafarisService) {}

  @Get()
  @ApiOperation({ summary: 'List safaris with filters' })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'country', required: false, enum: Country })
  @ApiQuery({ name: 'safariStyle', required: false, enum: SafariStyle })
  @ApiQuery({ name: 'accommodationType', required: false, enum: AccommodationType })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'durationDays', required: false, type: Number })
  @ApiQuery({ name: 'isFeatured', required: false, type: Boolean })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'availableFrom', required: false, type: String })
  @ApiQuery({ name: 'availableTo', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Paginated safari list' })
  async list(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('country') country?: Country,
    @Query('safariStyle') safariStyle?: SafariStyle,
    @Query('accommodationType') accommodationType?: AccommodationType,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('durationDays') durationDays?: number,
    @Query('isFeatured') isFeatured?: boolean,
    @Query('search') search?: string,
    @Query('availableFrom') availableFrom?: string,
    @Query('availableTo') availableTo?: string,
  ) {
    return this.safarisService.findAll({
      skip: skip ? Number(skip) : 0,
      take: take ? Number(take) : 20,
      filters: {
        country,
        safariStyle,
        accommodationType,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        durationDays: durationDays ? Number(durationDays) : undefined,
        isFeatured,
        search,
        availableFrom: availableFrom ? new Date(availableFrom) : undefined,
        availableTo: availableTo ? new Date(availableTo) : undefined,
      },
    });
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured safaris' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async featured(@Query('limit') limit?: number) {
    return this.safarisService.findFeatured(limit ? Number(limit) : 6);
  }

  @Get('country/:country')
  @ApiOperation({ summary: 'Get safaris by country' })
  @ApiParam({ name: 'country', enum: Country })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async byCountry(@Param('country') country: Country, @Query('limit') limit?: number) {
    return this.safarisService.findByCountry(country, limit ? Number(limit) : 20);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get safari by slug (public)' })
  @ApiParam({ name: 'slug', type: String })
  async getBySlug(@Param('slug') slug: string) {
    return this.safarisService.findBySlug(slug);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Get availability for a safari' })
  @ApiParam({ name: 'id', type: String })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  async availability(
    @Param('id') id: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.safarisService.getAvailability(id, new Date(startDate), new Date(endDate));
  }

  // Admin routes
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create safari (admin)' })
  async create(@Body() data: Prisma.SafariCreateInput) {
    return this.safarisService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update safari (admin)' })
  async update(@Param('id') id: string, @Body() data: Prisma.SafariUpdateInput) {
    return this.safarisService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete safari (admin)' })
  async delete(@Param('id') id: string) {
    await this.safarisService.delete(id);
    return { success: true };
  }

  @Put(':id/featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle featured status (admin)' })
  async toggleFeatured(@Param('id') id: string, @Body() data: { isFeatured: boolean }) {
    return this.safarisService.toggleFeatured(id, data.isFeatured);
  }

  @Put(':id/active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle active status (admin)' })
  async toggleActive(@Param('id') id: string, @Body() data: { isActive: boolean }) {
    return this.safarisService.toggleActive(id, data.isActive);
  }

  // Safari Dates
  @Post(':id/dates')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add safari date (admin)' })
  async addDate(@Param('id') id: string, @Body() data: Prisma.SafariDateCreateInput) {
    return this.safarisService.addDate(id, data);
  }

  @Put('dates/:dateId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update safari date (admin)' })
  async updateDate(@Param('dateId') dateId: string, @Body() data: Prisma.SafariDateUpdateInput) {
    return this.safarisService.updateDate(dateId, data);
  }

  @Delete('dates/:dateId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete safari date (admin)' })
  async deleteDate(@Param('dateId') dateId: string) {
    await this.safarisService.deleteDate(dateId);
    return { success: true };
  }
}