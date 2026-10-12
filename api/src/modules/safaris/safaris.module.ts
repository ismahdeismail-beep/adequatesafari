import { Module } from '@nestjs/common';
import { SafarisService } from './safaris.service';
import { SafarisController } from './safaris.controller';

@Module({
  controllers: [SafarisController],
  providers: [SafarisService],
  exports: [SafarisService],
})
export class SafarisModule {}