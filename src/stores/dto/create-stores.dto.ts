import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateStoreDto {
  @ApiProperty({
    description: "L'adresse du store",
  })
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Nom du store',
    example: 'Un store',
  })
  @IsNotEmpty({ message: 'Le nom du store est requis' })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Téléphone du store',
    example: '+228 91979771',
  })
  @IsMobilePhone(
    'fr-FR',
    { strictMode: true },
    { message: 'Le numéro de téléphone doit etre valide' },
  )
  phone?: string;

  @ApiProperty({
    description:
      'Les paramètres du store, **POUR LE MOMENT PAS PRIS EN CHARGE**',
    deprecated: true,
  })
  @IsObject()
  settings?: Record<string, any>;
}
