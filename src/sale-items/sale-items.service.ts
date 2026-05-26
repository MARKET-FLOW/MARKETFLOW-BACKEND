import { Injectable } from '@nestjs/common';
import { CreateSaleItemDto } from './dto/create-sale-items.dto';
import { UpdateSaleItemDto } from './dto/update-sale-items.dto';

@Injectable()
export class SaleItemsService {

  create(createSaleItemDto: CreateSaleItemDto) {
    return 'This action adds a new sale-items';
  }

  findAll() {
    return `This action returns all sale-items`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sale-items`;
  }

  update(id: number, updateSaleItemDto: UpdateSaleItemDto) {
    return `This action updates a #${id} sale-items`;
  }

  remove(id: number) {
    return `This action removes a #${id} sale-items`;
  }
}
