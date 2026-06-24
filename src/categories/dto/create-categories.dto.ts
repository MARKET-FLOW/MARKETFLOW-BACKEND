import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCategoriesDto {
  @ApiProperty({
    description: 'ID de la boutique à laquelle appartient la catégorie',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  storeId!: string;

  @ApiProperty({
    description: 'Nom de la catégorie',
    maxLength: 100,
    example: 'Électronique',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'ID de la catégorie parente si c’est une sous-catégorie',
    example: '123e4567-e89b-12d3-a456-426614174111',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}