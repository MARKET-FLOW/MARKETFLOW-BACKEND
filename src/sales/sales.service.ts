import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sales.dto';
import { UpdateSaleDto } from './dto/update-sales.dto';

@Injectable()
export class SalesService {

  create(createSaleDto: CreateSaleDto) {
    return 'This action adds a new sales';
  }

  findAll() {
    return `This action returns all sales`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sales`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} sales`;
  }

  remove(id: number) {
    return `This action removes a #${id} sales`;
  }
}
