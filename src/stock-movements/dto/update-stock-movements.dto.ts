import { PartialType } from '@nestjs/swagger';
import { CreateStockMovementDto } from './create-stock-movements.dto';

export class UpdateStockMovementDto extends PartialType(CreateStockMovementDto) {}
