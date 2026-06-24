import { ApiProperty } from '@nestjs/swagger';

export class FrontReadCategory {
  @ApiProperty({
    description: 'ID unique de la catégorie (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID de la boutique associée',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  storeId!: string;

  @ApiProperty({
    description: 'Nom de la catégorie',
    example: 'Électronique',
  })
  name!: string;

  @ApiProperty({
    description: 'ID de la catégorie parente (si applicable)',
    example: '123e4567-e89b-12d3-a456-426614174111',
    nullable: true,
  })
  parentId!: string | null;

  @ApiProperty({
    description: 'Date de création de la catégorie',
    example: '2026-06-24T12:00:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Date de la dernière mise à jour',
    example: '2026-06-24T14:30:00.000Z',
    nullable: true,
  })
  updatedAt!: Date | null;

  @ApiProperty({
    description: 'Objet complet de la catégorie parente imbriquée',
    type: () => FrontReadCategory,
    nullable: true,
    required: false,
  })
  parent?: FrontReadCategory | null;
}