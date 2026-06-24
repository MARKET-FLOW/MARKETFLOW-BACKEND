import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { RedisCacheService } from 'src/common/cache/redis-cache.service';
import { CategoriesCache } from './global-category/categories.cache';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService, 
    CategoriesRepository,
    RedisCacheService,
    CategoriesCache
  ],
  exports: [CategoriesRepository], 
})
export class CategoriesModule {}