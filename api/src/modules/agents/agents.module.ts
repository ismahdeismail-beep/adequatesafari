import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { UsersModule } from '../users/users.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [UsersModule, BookingsModule],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService],
})
export class AgentsModule {}