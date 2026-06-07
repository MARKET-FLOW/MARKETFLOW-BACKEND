/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { UUID } from 'node:crypto';
import { ApiResponse } from 'src/common/types/api.response';

// Validation de l'objet store associé à la catégorie
export class FrontReadStore {
  @ApiProperty({ description: 'ID unique du store' })
  @Expose()
  id!: UUID;

  @ApiProperty({ description: 'Nom du store' })
  @Expose()
  name!: string;
}

// Validation des données entrantes pour la création d'une catégorie
export class CreateCategorieDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;
}

// Modèle de données retourné au front pour une catégorie
export class FrontReadCategory {
  @ApiProperty({ description: 'ID unique de la catégorie' })
  @Expose()
  @IsUUID()
  id!: UUID;

  @ApiProperty({ description: 'Nom de la catégorie' })
  @Expose()
  @IsString()
  name!: string;

  @ApiProperty({ description: 'ID de la catégorie parente', nullable: true })
  @Expose()
  parentId!: string | null;

  @ApiProperty({ description: 'Store associé à la catégorie', type: () => FrontReadStore })
  @Expose()
  @Type(() => FrontReadStore)
  store!: FrontReadStore;

  @ApiProperty({ description: 'Date de création de la catégorie' })
  @Expose()
  @Transform(({ value }: { value: Date }) => value?.toISOString())
  createdAt!: string;

  @ApiProperty({ description: 'Date de suppression (soft delete)', nullable: true })
  @Expose()
  @Transform(({ value }: { value: Date | null }) => value?.toISOString() ?? null)
  deletedAt!: string | null;
}

// Réponse Swagger pour une seule catégorie
export class FrontCategoryInfos extends ApiResponse<FrontReadCategory> {
  @ApiProperty({ type: () => FrontReadCategory, description: 'Données de la catégorie retournée' })
  declare result: FrontReadCategory;
}

// Réponse Swagger pour une liste de catégories
export class ListFrontCategoryInfos extends ApiResponse<FrontReadCategory[]> {
  @ApiProperty({ type: () => [FrontReadCategory], description: 'Liste des catégories retournées' })
  declare result: FrontReadCategory[];
}