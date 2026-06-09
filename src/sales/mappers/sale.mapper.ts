import { plainToInstance } from 'class-transformer';
import { Sale } from '@prisma/client';
import { FrontReadSale } from '../dto/create-sales.dto';

export class SaleMapper {
  static toFront(sale: Sale): FrontReadSale {
    return plainToInstance(FrontReadSale, sale, {
      excludeExtraneousValues: true,
    });
  }

  static toFrontList(sales: Sale[]): FrontReadSale[] {
    return sales.map((sale) => SaleMapper.toFront(sale));
  }
}
