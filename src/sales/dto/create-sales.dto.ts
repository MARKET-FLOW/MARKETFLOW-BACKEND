import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { PaginatedData } from 'src/common/types/paginated-data';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod, SaleOrigin, SaleStatus } from '@prisma/client';
import { ApiResponse } from 'src/common/types/api.response';
import { CreateSaleItemDto } from '../../sale-items/dto/create-sale-items.dto';

// DTO de création

export class CreateSaleDto {
  @ApiProperty({ description: 'ID du magasin', example: '1a2b3c4d-...' })
  @IsNotEmpty({ message: 'Le storeId est requis' })
  @IsUUID()
  storeId!: string;

  @ApiProperty({
    description: 'Numéro unique de la vente',
    example: 'VTE-20250115-001',
  })
  @IsNotEmpty({ message: 'Le numéro de vente est requis' })
  @IsString()
  saleNumber!: string;

  @ApiProperty({ description: 'ID du caissier', example: '2b3c4d5e-...' })
  @IsNotEmpty({ message: 'Le cashierId est requis' })
  @IsUUID()
  cashierId!: string;

  @ApiProperty({
    description: 'ID de la session de caisse',
    example: '3c4d5e6f-...',
  })
  @IsNotEmpty({ message: 'Le cashSessionId est requis' })
  @IsUUID()
  cashSessionId!: string;

  @ApiProperty({ description: 'Montant total TTC', example: 15000 })
  @IsNotEmpty({ message: 'Le montant total est requis' })
  @IsNumber({}, { message: 'totalAmount doit être un nombre' })
  @Min(0)
  totalAmount!: number;

  @ApiProperty({ description: 'Montant TVA', example: 2700 })
  @IsNotEmpty({ message: 'Le montant TVA est requis' })
  @IsNumber({}, { message: 'taxAmount doit être un nombre' })
  @Min(0)
  taxAmount!: number;

  @ApiProperty({
    description: 'Montant de remise',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'discountAmount doit être un nombre' })
  @Min(0)
  discountAmount?: number;

  @ApiProperty({
    enum: PaymentMethod,
    description: 'Moyen de paiement',
    example: 'CASH',
  })
  @IsNotEmpty({ message: 'Le moyen de paiement est requis' })
  @IsEnum(PaymentMethod, { message: 'paymentMethod invalide' })
  paymentMethod!: PaymentMethod;

  @ApiProperty({ description: 'Montant remis par le client', example: 20000 })
  @IsNotEmpty({ message: 'Le montant payé est requis' })
  @IsNumber({}, { message: 'amountPaid doit être un nombre' })
  @Min(0)
  amountPaid!: number;

  @ApiProperty({ description: 'Monnaie rendue', example: 5000 })
  @IsNotEmpty({ message: 'La monnaie rendue est requise' })
  @IsNumber({}, { message: 'changeAmount doit être un nombre' })
  @Min(0)
  changeAmount!: number;

  @ApiProperty({
    enum: SaleStatus,
    description: 'Statut de la vente',
    example: 'COMPLETED',
  })
  @IsNotEmpty({ message: 'Le statut est requis' })
  @IsEnum(SaleStatus, { message: 'status invalide' })
  status!: SaleStatus;

  @ApiProperty({
    enum: SaleOrigin,
    description: 'Origine de la vente',
    example: 'POS',
    required: false,
  })
  @IsOptional()
  @IsEnum(SaleOrigin, { message: 'origin invalide' })
  origin?: SaleOrigin;

  @ApiProperty({
    description: 'ID du terminal mobile (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  mobileDeviceId?: string;

  @ApiProperty({ type: [CreateSaleItemDto], description: 'Lignes de la vente' })
  @IsNotEmpty({ message: 'Les articles vendus sont requis' })
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items!: CreateSaleItemDto[];
}

// Helper Transform date

const TransformDate = () =>
  Transform(({ value }: { value: Date | null | undefined }) => {
    return value instanceof Date ? value.toISOString() : null;
  });

// DTO de réponse

export class FrontReadSale {
  @ApiProperty({ description: 'ID unique de la vente' })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'ID du magasin' })
  @Expose()
  storeId!: string;

  @ApiProperty({ description: 'Numéro de la vente' })
  @Expose()
  saleNumber!: string;

  @ApiProperty({ description: 'ID du caissier' })
  @Expose()
  cashierId!: string;

  @ApiProperty({ description: 'ID de la session de caisse' })
  @Expose()
  cashSessionId!: string;

  @ApiProperty({ description: 'Montant total TTC' })
  @Expose()
  totalAmount!: number;

  @ApiProperty({ description: 'Montant TVA' })
  @Expose()
  taxAmount!: number;

  @ApiProperty({ description: 'Montant de remise' })
  @Expose()
  discountAmount!: number;

  @ApiProperty({ enum: PaymentMethod, description: 'Moyen de paiement' })
  @Expose()
  paymentMethod!: PaymentMethod;

  @ApiProperty({ description: 'Montant payé' })
  @Expose()
  amountPaid!: number;

  @ApiProperty({ description: 'Monnaie rendue' })
  @Expose()
  changeAmount!: number;

  @ApiProperty({ enum: SaleStatus, description: 'Statut' })
  @Expose()
  status!: SaleStatus;

  @ApiProperty({ enum: SaleOrigin, description: 'Origine' })
  @Expose()
  origin!: SaleOrigin;

  @ApiProperty({ description: 'ID terminal mobile', nullable: true })
  @Expose()
  mobileDeviceId!: string | null;

  @ApiProperty({ description: 'Synchronisé avec le cloud' })
  @Expose()
  synced!: boolean;

  @ApiProperty({ description: 'Date de création' })
  @Expose()
  @TransformDate()
  createdAt!: string;

  @ApiProperty({ description: 'Date de suppression', nullable: true })
  @Expose()
  @TransformDate()
  deletedAt!: string | null;
}

// Wrappers Swagger

export class FrontSaleInfos extends ApiResponse<FrontReadSale> {
  @ApiProperty({
    type: () => FrontReadSale,
    description: 'Données de la vente',
  })
  declare result: FrontReadSale;
}

export class ListFrontSaleInfos extends ApiResponse<FrontReadSale[]> {
  @ApiProperty({ type: () => [FrontReadSale], description: 'Liste des ventes' })
  declare result: FrontReadSale[];
}

export class FrontPaginatedSales extends PaginatedData<FrontReadSale> {
  @ApiProperty({
    type: () => [FrontReadSale],
    description: 'Liste des ventes paginées',
  })
  declare items: FrontReadSale[];
}
