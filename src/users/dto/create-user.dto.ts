import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'node:crypto';
import { Role } from '@prisma/client';


// validation des données front
export class CreateUserDto {
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
