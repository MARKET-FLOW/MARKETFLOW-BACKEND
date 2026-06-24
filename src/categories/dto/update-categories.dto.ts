import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCategoriesDto } from './create-categories.dto';

export class UpdateCategoriesDto extends PartialType(CreateCategoriesDto) {}