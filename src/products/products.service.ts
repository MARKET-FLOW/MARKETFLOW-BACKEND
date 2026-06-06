import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';

@Injectable()
export class ProductsService {
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new products';
  }

  findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} products`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} products`;
  }

  remove(id: number) {
    return `This action removes a #${id} products`;
  }
}
