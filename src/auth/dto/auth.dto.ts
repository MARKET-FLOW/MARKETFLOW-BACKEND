// src/auth/dto/auth.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';
import { UUID } from 'crypto';
import { ApiResponse } from 'src/common/types/api.response';
import { FrontReadStore } from 'src/stores/dto/front-read-store.dto';

export class LoginDto {
  @ApiProperty({ example: 'jean@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'motdepasse123' })
  @IsString()
  @MinLength(6)
  password!: string;
}

export class RegisterDto {
  @ApiProperty({
    description: 'Id du store du user',
  })
  @IsNotEmpty({ message: 'Le Id du store du user est requis' })
  @IsUUID()
  storeId!: UUID;

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


// DTO retourné au front après login/register
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

export class FrontUserInfos extends ApiResponse<FrontReadUser> {
  @ApiProperty({
    type: () => FrontReadUser,
    description: 'On retourne les données a la création du user',
  })
  declare result: FrontReadUser;
}


export class AuthLoginResponse extends ApiResponse<FrontReadUser> {
  @ApiProperty({ type: () => FrontReadUser })
  declare result: FrontReadUser;
}

export class AuthRegisterResponse extends ApiResponse<FrontReadUser> {
  @ApiProperty({ type: () => FrontReadUser })
  declare result: FrontReadUser;
}

export class AuthRefreshResponse extends ApiResponse<{ refreshed: boolean }> {
  @ApiProperty({ type: () => Object })
  declare result: { refreshed: boolean };
}
