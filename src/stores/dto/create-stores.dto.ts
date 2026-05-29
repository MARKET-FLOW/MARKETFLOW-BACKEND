import { OmitType } from '@nestjs/swagger';
import { StoreBaseDto } from './base/store.base.dto';

export class CreateStoreDto extends OmitType(StoreBaseDto, [
  'id',
  'createdAt',
]) {}
