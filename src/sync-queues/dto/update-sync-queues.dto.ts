import { PartialType } from '@nestjs/swagger';
import { CreateSyncQueueDto } from './create-sync-queues.dto';

export class UpdateSyncQueueDto extends PartialType(CreateSyncQueueDto) {}
