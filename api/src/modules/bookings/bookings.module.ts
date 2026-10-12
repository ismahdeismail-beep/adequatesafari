import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { SafarisModule } from '../safaris/safaris.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [SafarisModule, PaymentsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}