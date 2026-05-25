import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';
import { StoresRepository } from './stores.repository';
import { RedisCacheService } from '../common/cache/redis-cache.service';

@Module({
  controllers: [StoresController],
  providers: [StoresService, StoresRepository, RedisCacheService],
})
export class StoresModule {}
