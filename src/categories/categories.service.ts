import { Injectable } from '@nestjs/common';
import { CreateCategorieDto } from './dto/create-categories.dto';
import { UpdateCategorieDto } from './dto/update-categories.dto';

@Injectable()
export class CategoriesService {

  create(createCategorieDto: CreateCategorieDto) {
    return 'This action adds a new categories';
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categories`;
  }

  update(id: number, updateCategorieDto: UpdateCategorieDto) {
    return `This action updates a #${id} categories`;
  }

  remove(id: number) {
    return `This action removes a #${id} categories`;
  }
}
