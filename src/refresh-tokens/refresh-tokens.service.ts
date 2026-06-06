import { Injectable } from '@nestjs/common';
import { CreateRefreshTokenDto } from './dto/create-refresh-tokens.dto';
import { UpdateRefreshTokenDto } from './dto/update-refresh-tokens.dto';

@Injectable()
export class RefreshTokensService {
  create(createRefreshTokenDto: CreateRefreshTokenDto) {
    return 'This action adds a new refresh-tokens';
  }

  findAll() {
    return `This action returns all refresh-tokens`;
  }

  findOne(id: number) {
    return `This action returns a #${id} refresh-tokens`;
  }

  update(id: number, updateRefreshTokenDto: UpdateRefreshTokenDto) {
    return `This action updates a #${id} refresh-tokens`;
  }

  remove(id: number) {
    return `This action removes a #${id} refresh-tokens`;
  }
}
