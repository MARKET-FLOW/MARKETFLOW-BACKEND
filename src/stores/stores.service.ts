import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-stores.dto';
import { UpdateStoreDto } from './dto/update-stores.dto';

@Injectable()
export class StoresService {

  create(createStoreDto: CreateStoreDto) {
    return 'This action adds a new stores';
  }

  findAll() {
    return `This action returns all stores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stores`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} stores`;
  }

  remove(id: number) {
    return `This action removes a #${id} stores`;
  }
}
