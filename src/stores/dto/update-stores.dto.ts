import { PartialType, OmitType } from '@nestjs/swagger';
import { StoreBaseDto } from './base/store.base.dto';

export class UpdateStoreDto extends OmitType(PartialType(StoreBaseDto), [
  'id',
  'createdAt',
]) {}
