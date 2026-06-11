import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateSaleItemDto {
  @ApiProperty({ description: 'ID du produit', example: '1a2b3c4d-...' })
  @IsNotEmpty({ message: 'Le productId est requis' })
  @IsUUID()
  productId!: string;

  @ApiProperty({ description: 'Quantité vendue', example: 2 })
  @IsNotEmpty({ message: 'La quantité est requise' })
  @IsNumber({}, { message: 'La quantité doit être un nombre' })
  @Min(1)
  quantity!: number;
}

// Helper Transform date

const TransformDate = () =>
  Transform(({ value }: { value: Date | null | undefined }) => {
    return value instanceof Date ? value.toISOString() : null;
  });

// DTO de réponse

export class FrontReadSaleItem {
  @ApiProperty({ description: "ID unique de l'article" })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'ID du magasin' })
  @Expose()
  storeId!: string;

  @ApiProperty({ description: 'ID de la vente parente' })
  @Expose()
  saleId!: string;

  @ApiProperty({ description: 'ID du produit' })
  @Expose()
  productId!: string;

  @ApiProperty({ description: 'Nom du produit au moment de la vente' })
  @Expose()
  productName!: string;

  @ApiProperty({ description: 'Quantité vendue' })
  @Expose()
  quantity!: number;

  @ApiProperty({ description: 'Prix unitaire' })
  @Expose()
  unitPrice!: number;

  @ApiProperty({ description: 'Taux de taxe' })
  @Expose()
  taxRate!: number;

  @ApiProperty({ description: 'Sous-total' })
  @Expose()
  subtotal!: number;

  @ApiProperty({ description: 'Date de suppression', nullable: true })
  @Expose()
  @TransformDate()
  deletedAt!: string | null;
}
