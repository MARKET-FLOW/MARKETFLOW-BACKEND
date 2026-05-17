/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'node:crypto';
import { Role } from 'prisma/src/generated/prisma';
import { ApiResponse } from 'src/common/types/api.response';

export class CreateUserDto {
  @ApiProperty({
    description: 'Id du store du user',
  })
  @IsNotEmpty({ message: 'Le Id du store du user est requis' })
  @IsString()
  storeId!: string;

  @ApiProperty({
    description: "Nom d'utilisateur",
    example: 'john_doe',
  })
  @IsNotEmpty({ message: "Le nom d'utilisateur est requis" })
  @IsString()
  username!: string;

  @ApiProperty({
    description: 'Email',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty({ message: "L'email est requis" })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Mot de passe',
    example: 'password123',
  })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @IsString()
  password!: string;

  @ApiProperty({
    description: 'Rôle de l’utilisateur',
    enum: Role,
    example: 'Ex: CASHIER, MANAGER, OWNER',
  })
  @IsEnum(Role, {
    message:
      "Le rôle spécifié n'est pas valide. Rôles possibles : CASHIER, MANAGER, OWNER",
  })
  role!: Role;
}


export class FrontReadUser {
  @ApiProperty({
    description: 'ID unique de l’utilisateur',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  @IsUUID()
  id!: UUID;

  @ApiProperty({ description: 'ID du store associé' })
  @Expose()
  @IsString()
  storeId!: string;

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


export class FrontUserInfos extends ApiResponse<FrontReadUser> {
  @ApiProperty({
    type: () => FrontReadUser,
    description: 'On retourne les données a la création du user',
  })
  declare result: FrontReadUser;
}


export class ListFrontUserInfos extends ApiResponse<FrontReadUser[]> {
  @ApiProperty({
    type: () => [FrontReadUser],
    // isArray: true,
    description: 'On retourne une liste de users de type FrontReadUser',
  })
  declare result: FrontReadUser[];
}
