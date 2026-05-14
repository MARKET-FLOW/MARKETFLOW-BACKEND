/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from 'prisma/src/generated/prisma';
import { ApiResponse } from 'src/common/types/api.response';

export class CreateUserDto {
  @ApiProperty({
    description: "Id du store du user"
  })
  @IsNotEmpty({ message: "Le Id du store du user est requis" })
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
    message: "Le rôle spécifié n'est pas valide. Rôles possibles : CASHIER, MANAGER, OWNER",
  })
  role!: Role;
}


export class FrontReadUser {

  @Expose()
  @IsString()
  id!: string;

  @Expose()
  @IsString()
  storeId!: string;

  @Expose()
  @IsString()
  username!: string;

  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @IsString()
  role!: Role;       

  @Expose()
  @IsBoolean()
  isActive!: boolean;   

  @Expose()
  @Transform(({ value }: { value: Date | null | undefined }) => {
    return value instanceof Date ? value.toISOString() : null;
  })
  lastLoginAt!: string;
}

export class FrontUserInfos extends ApiResponse<FrontReadUser> {
  @ApiProperty({
    type: () => FrontReadUser,
    description: 'On retourne les données a la création du user',
  })
  declare result: FrontReadUser;
}
