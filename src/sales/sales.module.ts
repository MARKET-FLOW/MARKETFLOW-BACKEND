import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { SalesRepository } from './sales.repository';

@Module({
  controllers: [SalesController],
  providers: [SalesService, SalesRepository],
})
export class SalesModule {}
