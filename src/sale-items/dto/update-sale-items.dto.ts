import { PartialType } from '@nestjs/swagger';
import { CreateSaleItemDto } from './create-sale-items.dto';

export class UpdateSaleItemDto extends PartialType(CreateSaleItemDto) {}
