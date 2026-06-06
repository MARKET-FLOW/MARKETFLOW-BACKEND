import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { Expose, Transform, Type } from "class-transformer";
import { IsBoolean, IsEmail, IsString, IsUUID } from "class-validator";
import { UUID } from "node:crypto";
import { FrontReadStore } from "src/stores/dto/front-read-store.dto";

export class FrontReadUser {
  @ApiProperty({
    description: 'ID unique de l’utilisateur',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  @IsUUID()
  id!: UUID;

  @Expose()
  @ApiProperty({
    description: "Le store associé a l'utilisateur",
    type: () => FrontReadStore,
  })
  @Type(() => FrontReadStore)
  store!: FrontReadStore;

  @ApiProperty({ description: 'Nom d’utilisateur' })
  @Expose()
  @IsString()
  username!: string;

  @ApiProperty({ description: 'Adresse email' })
  @Expose()
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Rôle de l’utilisateur', enum: Role })
  @Expose()
  @IsString()
  role!: Role;

  @ApiProperty({ description: 'Statut du compte' })
  @Expose()
  @IsBoolean()
  isActive!: boolean;

  @ApiProperty({ description: 'Date de dernière connexion', nullable: true })
  @Expose()
  @Transform(({ value }: { value: Date | null | undefined }) => {
    return value instanceof Date ? value.toISOString() : null;
  })
  lastLoginAt!: string;

  @ApiProperty({
    description: 'Date de suppression (soft delete)',
    nullable: true,
  })
  @Expose()
  @Transform(({ value }: { value: Date | null | undefined }) => {
    return value instanceof Date ? value.toISOString() : null;
  })
  deletedAt!: string;
}