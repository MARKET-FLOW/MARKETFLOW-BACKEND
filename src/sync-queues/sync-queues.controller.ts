import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SyncQueuesService } from './sync-queues.service';
import { CreateSyncQueueDto } from './dto/create-sync-queues.dto';
import { UpdateSyncQueueDto } from './dto/update-sync-queues.dto';

@Controller('sync-queues')
export class SyncQueuesController {
  constructor(private readonly syncQueuesService: SyncQueuesService) {}

  @Post()
  create(@Body() createSyncQueueDto: CreateSyncQueueDto) {
    return this.syncQueuesService.create(createSyncQueueDto);
  }

  @Get()
  findAll() {
    return this.syncQueuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.syncQueuesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSyncQueueDto: UpdateSyncQueueDto,
  ) {
    return this.syncQueuesService.update(+id, updateSyncQueueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.syncQueuesService.remove(+id);
  }
}
