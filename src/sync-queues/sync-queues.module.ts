import { Module } from '@nestjs/common';
import { SyncQueuesService } from './sync-queues.service';
import { SyncQueuesController } from './sync-queues.controller';
import { SyncQueuesRepository } from './sync-queues.repository';

@Module({
  controllers: [SyncQueuesController],
  providers: [SyncQueuesService, SyncQueuesRepository],
})
export class SyncQueuesModule {}
