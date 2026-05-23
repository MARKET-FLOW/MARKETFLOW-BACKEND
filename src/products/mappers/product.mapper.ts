/* eslint-disable prettier/prettier */
import { plainToInstance } from "class-transformer";
import { FrontReadProduct } from "../dto/create-products.dto";
import { Product } from 'prisma/src/generated/prisma';

export class ProductMapper {
    static toFront(product: Product): FrontReadProduct {
        return plainToInstance( FrontReadProduct, product, {
            excludeExtraneousValues: true,
        })
    }
}