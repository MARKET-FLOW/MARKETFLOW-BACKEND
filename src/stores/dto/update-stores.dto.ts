import { PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './create-stores.dto';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}
