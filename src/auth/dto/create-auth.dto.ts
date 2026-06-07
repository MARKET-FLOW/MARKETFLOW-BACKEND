import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class UserAuthDto {
  @ApiProperty({
    description: 'Le nom d\'utilisateur pour se connecter'
  })
  @IsNotEmpty({message: "Le nom d'utilisateur est obligatoire"})
  @IsString({
    message: 'Erreur de validation du username'
  })
  username!: string

  @ApiProperty({
    description: 'Le mot de passe du user pour se connecter'
  })
  @IsNotEmpty({message: "Le password du user est obligatoire"})
  @IsString({
    message: 'Erreur de validation du password'
  })
  password!: string


  @ApiProperty({
    description: 'Le Role de l\'utilisateur'
  })
  @IsNotEmpty({message: "Le role est obligatoire"})
  @IsEnum(Role)
  role!: string

}


export class RefreshTokenDTO{
  @ApiProperty({description: "Envoyer le refreshToken valide"})
  @IsString()
  refreshToken!: string
}
