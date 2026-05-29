import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsDate,
  IsMobilePhone,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'node:crypto';

export class StoreBaseDto {
  @ApiPropertyOptional({
    description: "L'adresse du store",
  })
  @IsOptional()
  @IsString()
  @Expose()
  address?: string;

  @ApiProperty({
    description: 'Nom du store',
    example: 'Un store',
  })
  @IsNotEmpty({ message: 'Le nom du store est requis' })
  @IsString()
  @Expose()
  name!: string;

  @ApiPropertyOptional({
    description: 'Téléphone du store',
    example: '+228 91979771',
  })
  @IsOptional()
  @IsMobilePhone(
    'fr-FR',
    { strictMode: true },
    { message: 'Le numéro de téléphone doit etre valide' },
  )
  @Expose()
  phone?: string;

  @ApiPropertyOptional({
    description:
      'Les paramètres du store, **POUR LE MOMENT PAS PRIS EN CHARGE**',
    deprecated: true,
  })
  @IsOptional()
  @IsObject()
  @Expose()
  settings?: Record<string, any>;

  @ApiPropertyOptional({ description: 'La date de création du store' })
  @IsOptional()
  @IsDate()
  @Expose()
  createdAt?: Date;

  @ApiProperty({ description: "L'id du store" })
  @IsNotEmpty()
  @IsUUID()
  @Expose()
  id!: UUID;
}
