import { plainToInstance } from 'class-transformer';
import { Product } from '@prisma/client';
import { FrontReadProduct } from '../dto/create-products.dto';

export class ProductMapper {
  static toFront(product: Product): FrontReadProduct {
    return plainToInstance(FrontReadProduct, product, {
      excludeExtraneousValues: true,
    });
  }
}
