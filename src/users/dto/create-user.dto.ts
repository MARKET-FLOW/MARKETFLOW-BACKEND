/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
  @IsString()
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
    example: 'user',
  })
  @IsNotEmpty({ message: 'Le rôle est requis' })
  @IsString()
  role!: string;
}
