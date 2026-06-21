import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AuthReadDto {
  @Expose()
  @ApiProperty({
    description: 'message de succès de connexion',
  })
  @IsString()
  message!: string;

  @Expose()
  @ApiProperty({
    description: 'message de succès de connexion',
  })
  @IsString()
  accessToken!: string;

  @Expose()
  @ApiProperty({
    description: 'message de succès de connexion',
  })
  @IsString()
  refreshToken!: string;
}



export class RefreshTokenReadDto {
  @Expose()
  @ApiProperty({
    description: 'ID de la session de token',
  })
  @IsString()
  accessToken!: string;
}
