import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UUID } from 'node:crypto';
import { IsUUID } from 'class-validator';

export class FrontReadStore {
  @ApiProperty({ description: 'ID unique du store' })
  @IsUUID('all', { message: "L'id doit etre un UUID valide" })
  @Expose()
  id!: UUID;

  @ApiProperty({ description: 'Nom du store' })
  @Expose()
  name!: string;

  @ApiProperty({ description: 'Adresse du store', nullable: true })
  @Expose()
  address!: string;

  @ApiProperty({ description: 'Téléphone du store', nullable: true })
  @Expose()
  phone!: string;

  @ApiProperty({ description: 'Date de création du store', nullable: true })
  @Expose()
  createdAt!: Date;
}
