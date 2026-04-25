import { Module } from '@nestjs/common';
import { SaleItemsService } from './sale-items.service';
import { SaleItemsController } from './sale-items.controller';
import { SaleItemsRepository } from './sale-items.repository';

@Module({
  controllers: [SaleItemsController],
  providers: [SaleItemsService, SaleItemsRepository],
})
export class SaleItemsModule {}
