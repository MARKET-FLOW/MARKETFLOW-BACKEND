import { Injectable } from '@nestjs/common';
import { CreateCashSessionDto } from './dto/create-cash-sessions.dto';
import { UpdateCashSessionDto } from './dto/update-cash-sessions.dto';

@Injectable()
export class CashSessionsService {

  create(createCashSessionDto: CreateCashSessionDto) {
    return 'This action adds a new cash-sessions';
  }

  findAll() {
    return `This action returns all cash-sessions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cash-sessions`;
  }

  update(id: number, updateCashSessionDto: UpdateCashSessionDto) {
    return `This action updates a #${id} cash-sessions`;
  }

  remove(id: number) {
    return `This action removes a #${id} cash-sessions`;
  }
}
