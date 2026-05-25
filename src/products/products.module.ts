import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { RedisCacheService } from 'src/common/cache/redis-cache.service';

@Module({
  
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, RedisCacheService],
})
export class ProductsModule {}
