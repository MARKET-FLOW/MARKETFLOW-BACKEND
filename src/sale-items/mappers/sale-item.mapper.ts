import { plainToInstance } from 'class-transformer';
import { SaleItem } from '@prisma/client';
import { FrontReadSaleItem } from '../dto/create-sale-items.dto';

export class SaleItemMapper {
  static toFront(item: SaleItem): FrontReadSaleItem {
    return plainToInstance(FrontReadSaleItem, item, {
      excludeExtraneousValues: true,
    });
  }

  static toFrontList(items: SaleItem[]): FrontReadSaleItem[] {
    return items.map((item) => SaleItemMapper.toFront(item));
  }
}
