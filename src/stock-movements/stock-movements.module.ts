import { Module } from '@nestjs/common';
import { StockMovementsService } from './stock-movements.service';
import { StockMovementsController } from './stock-movements.controller';
import { StockMovementsRepository } from './stock-movements.repository';

@Module({
  controllers: [StockMovementsController],
  providers: [StockMovementsService, StockMovementsRepository],
})
export class StockMovementsModule {}
