import { Injectable } from '@nestjs/common';
import { CreateSyncQueueDto } from './dto/create-sync-queues.dto';
import { UpdateSyncQueueDto } from './dto/update-sync-queues.dto';

@Injectable()
export class SyncQueuesService {

  create(createSyncQueueDto: CreateSyncQueueDto) {
    return 'This action adds a new sync-queues';
  }

  findAll() {
    return `This action returns all sync-queues`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sync-queues`;
  }

  update(id: number, updateSyncQueueDto: UpdateSyncQueueDto) {
    return `This action updates a #${id} sync-queues`;
  }

  remove(id: number) {
    return `This action removes a #${id} sync-queues`;
  }
}
