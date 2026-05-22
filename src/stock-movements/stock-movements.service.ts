import { Injectable } from '@nestjs/common';
import { CreateStockMovementDto } from './dto/create-stock-movements.dto';
import { UpdateStockMovementDto } from './dto/update-stock-movements.dto';

@Injectable()
export class StockMovementsService {

  create(createStockMovementDto: CreateStockMovementDto) {
    return 'This action adds a new stock-movements';
  }

  findAll() {
    return `This action returns all stock-movements`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stock-movements`;
  }

  update(id: number, updateStockMovementDto: UpdateStockMovementDto) {
    return `This action updates a #${id} stock-movements`;
  }

  remove(id: number) {
    return `This action removes a #${id} stock-movements`;
  }
}
