/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
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
    example: 'Ex: CASHIER, MANAGER,OWNER',
  })
  @IsString({
    message: 'Entrer le role de l\'utiliseur.',
  })
  role!: Role;
}


export class FrontReadUser {
  @IsString()
  id!: string;

  @IsString()
  storeId!: string;

  @IsString()
  username!: string;

  @IsEmail()
  email!: string;

  @IsString()
  role!: Role;       

  @IsString()
  isActive!: string;   

  @IsString()
  lastLoginAt!: string;  
}

export class UserRepository extends ApiResponse<CreateUserDto> {
  @ApiProperty({
    description: 'On retourne les donées a la création du user',
  })
  storeId!: string;
}
