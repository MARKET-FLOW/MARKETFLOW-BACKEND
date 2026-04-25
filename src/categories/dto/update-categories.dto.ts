import { PartialType } from '@nestjs/swagger';
import { CreateCategorieDto } from './create-categories.dto';

export class UpdateCategorieDto extends PartialType(CreateCategorieDto) {}
