import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
      errorFormat: 'pretty',
    });

    // Query logging in development
    if (process.env.NODE_ENV !== 'production') {
      // Prisma 5 types `$on`'s event union as `never` when PrismaClient is
      // subclassed, so narrow the event signature explicitly.
      const on = this.$on as unknown as (
        event: 'query',
        cb: (e: Prisma.QueryEvent) => void,
      ) => void;
      on('query', (e) => {
        this.logger.debug(`Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`);
      });
    }

    // Soft delete middleware
    this.$use(async (params, next) => {
      // Add soft delete filter for models with deletedAt
      if (params.action === 'findUnique' || params.action === 'findFirst') {
        params.action = 'findFirst';
        params.args.where = {
          ...params.args.where,
          deletedAt: null,
        };
      }
      if (params.action === 'findMany') {
        if (params.args.where) {
          if (Array.isArray(params.args.where)) {
            params.args.where = params.args.where.map(w => ({ ...w, deletedAt: null }));
          } else {
            params.args.where = { ...params.args.where, deletedAt: null };
          }
        } else {
          params.args.where = { deletedAt: null };
        }
      }
      return next(params);
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('🔌 Database disconnected');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }
    const models = Reflect.ownKeys(this).filter(
      key => typeof key === 'string' && !key.startsWith('_') && !key.startsWith('$'),
    );
    for (const model of models) {
      if (typeof this[model as string]?.deleteMany === 'function') {
        await this[model as string].deleteMany();
      }
    }
  }
}