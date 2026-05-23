import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsInt,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiResponse } from 'src/common/types/api.response';
//import type { Store, User } from '@prisma/client';

export class CreateProductDto {
  @ApiProperty({
    description: 'Id du store du produit',
  })
  @IsString({ message: `L'store_id est une chaîne de caractère` })
  @IsNotEmpty({ message: `store_id est requis` })
  storeId!: string;

  @ApiProperty({
    description: 'Id du categorie du produit',
  })
  @IsString({ message: `category_id est une chaîne de caractère` })
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: `L'utilisateur qui a crée le produit`,
    example: `John`,
  })
  @IsString({ message: `created_by est une chaîne de caractère` })
  @IsNotEmpty({ message: `created_by est requis` })
  createdBy!: string;

  @ApiProperty({
    description: 'Le nom du produit',
    example: `Ordinateur`,
  })
  @IsString({ message: `name est une chaîne de caractère` })
  @IsNotEmpty({ message: `Le nom est requis` })
  name!: string;

  @ApiProperty({
    description: 'Barcode',
  })
  @IsString({ message: `barcode est une chaîne de caractère` })
  @IsNotEmpty({ message: `Barcode est requis` })
  barcode!: string;

  @ApiProperty({
    description: `Le prix d'achat du produit`,
    example: 500000.0,
  })
  @IsNumber({}, { message: 'purchasePrice doit être un nombre' })
  @IsNotEmpty({ message: `purchasePrice est requis` })
  @Type(() => Number)
  purchasePrice!: number;

  @ApiProperty({
    description: `Le prix de vente du produit`,
    example: 700000.0,
  })
  @IsNumber({}, { message: 'sellingPrice doit être un nombre' })
  @IsNotEmpty({ message: `sellingPrice est requis` })
  @Type(() => Number)
  sellingPrice!: number;

  @ApiProperty({
    description: 'Le taux de taxe  du produit',
    example: 5,
  })
  @IsNumber({}, { message: ' taxRate doit être un nombre' })
  @IsNotEmpty({ message: `taxRate est requis` })
  @Type(() => Number)
  taxRate!: number;

  @ApiProperty({
    description: 'La quantité en stock du produit',
    example: 10,
  })
  @IsInt({ message: ' stockQuantity doit être un nombre' })
  @IsNotEmpty({ message: `stockQuantity est requis` })
  @Type(() => Number)
  stockQuantity!: number;

  @ApiProperty({
    description: `Seuil d'alerte de réaprovisionement`,
    example: 2,
  })
  @IsInt({ message: ' stockMinAlert doit être un nombre' })
  @IsNotEmpty({ message: `stockMinAlert est requis` })
  @Type(() => Number)
  stockMinAlert!: number;

  @ApiProperty({
    description: 'Le produit est active ou non',
    example: true,
  })
  @IsBoolean({ message: '  isActive doit être boolean' })
  @IsNotEmpty({ message: `isActive est requis` })
  @Type(() => Boolean)
  isActive!: boolean;
}

//Fonction personelle créer pour éviter la repetition de @Transform()
export const TransformDate = () =>
  Transform(({ value }: { value: Date | null | undefined }) => {
    return value instanceof Date ? value.toISOString() : null;
  });

export class FrontReadProduct {
  @Expose()
  storeId!: string;

  @Expose()
  categoryId?: string;

  @Expose()
  createdBy!: string;

  @Expose()
  name!: string;

  @Expose()
  barcode!: string;

  @Expose()
  purchasePrice!: number;

  @Expose()
  sellingPrice!: number;

  @Expose()
  taxRate!: number;

  @Expose()
  stockQuantity!: number;

  @Expose()
  stockMinAlert!: number;

  @Expose()
  isActive!: boolean;

  @Expose()
  @TransformDate()
  deletedAt?: string;

  @Expose()
  @TransformDate()
  createdAt!: string;

  @Expose()
  @TransformDate()
  updateAt?: string;
}

export class FrontProductInfos extends ApiResponse<FrontReadProduct> {
  @ApiProperty({
    type: () => FrontReadProduct,
    description: 'Les données sont retournées à la création du produit',
  })
  declare result: FrontReadProduct;
}
