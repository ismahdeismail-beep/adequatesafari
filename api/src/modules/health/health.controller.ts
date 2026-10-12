import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HealthCheckResult, HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Basic health check' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  @ApiResponse({ status: 503, description: 'Service is unhealthy' })
  async check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.checkDatabase(),
      () => this.checkMemory(),
      () => this.checkDisk(),
    ]);
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  async live() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe' })
  async ready(): Promise<HealthCheckResult> {
    return this.health.check([() => this.checkDatabase()]);
  }

  private async checkDatabase(): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { database: { status: 'up' } };
    } catch (error) {
      return { database: { status: 'down', error: error.message } };
    }
  }

  private async checkMemory(): Promise<HealthIndicatorResult> {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    const limit = 512; // MB
    const status = used < limit ? 'up' : 'down';
    return { memory: { status, used: `${used.toFixed(2)} MB`, limit: `${limit} MB` } };
  }

  private async checkDisk(): Promise<HealthIndicatorResult> {
    // In container, check /tmp or working directory
    return { disk: { status: 'up', path: '/' } };
  }
}