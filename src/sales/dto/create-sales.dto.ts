import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsNumber, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { PaymentMethod, SaleOrigin, SaleStatus } from 'prisma/src/generated/prisma';

export class CreateSaleDto {
  @ApiProperty({ example: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d' })
  @IsNotEmpty()
  @IsUUID()
  storeId!: string;

  @ApiProperty({ example: 'SAL-12345' })
  @IsNotEmpty()
  @IsString()
  saleNumber!: string;

  @ApiProperty({ example: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e' })
  @IsNotEmpty()
  @IsUUID()
  cashierId!: string;

  @ApiProperty({ example: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f' })
  @IsNotEmpty()
  @IsUUID()
  cashSessionId!: string;

  @ApiProperty({ example: 100.0 })
  @IsNotEmpty()
  @IsNumber()
  totalAmount!: number;

  @ApiProperty({ example: 20.0 })
  @IsNotEmpty()
  @IsNumber()
  taxAmount!: number;

  @ApiProperty({ example: 0.0 })
  @IsOptional()
  @IsNumber()
  discountAmount?: number;

  @ApiProperty({ enum: PaymentMethod, example: 'CASH' })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod!: PaymentMethod;

  @ApiProperty({ example: 100.0 })
  @IsNotEmpty()
  @IsNumber()
  amountPaid!: number;

  @ApiProperty({ example: 0.0 })
  @IsNotEmpty()
  @IsNumber()
  changeAmount!: number;

  @ApiProperty({ enum: SaleStatus, example: 'COMPLETED' })
  @IsNotEmpty()
  @IsEnum(SaleStatus)
  status!: SaleStatus;

  @ApiProperty({ enum: SaleOrigin, example: 'POS', required: false })
  @IsOptional()
  @IsEnum(SaleOrigin)
  origin?: SaleOrigin;

  @ApiProperty({ example: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a', required: false })
  @IsOptional()
  @IsUUID()
  mobileDeviceId?: string;
}


