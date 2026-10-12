import { Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { SafarisModule } from '../safaris/safaris.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SafarisModule, UsersModule],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}