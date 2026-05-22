import { PartialType } from '@nestjs/mapped-types';
import { CreateCategorieDto } from './create-categories.dto';

export class UpdateCategorieDto extends PartialType(CreateCategorieDto) {}