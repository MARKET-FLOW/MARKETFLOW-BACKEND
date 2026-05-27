/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { RedisCacheService } from 'src/common/cache/redis-cache.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    CategoriesRepository,
    RedisCacheService,
  ],
})
export class CategoriesModule {}
