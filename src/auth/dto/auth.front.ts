import { ApiResponse } from "src/common/types/api.response";
import { AuthReadDto, RefreshTokenReadDto } from "./auth.read";
import { ApiProperty } from "@nestjs/swagger";

export class FrontAuthResponseInfos extends ApiResponse<AuthReadDto> {
  @ApiProperty({
    description: 'Retour des informations de connexion',
    type: () => AuthReadDto
  })
  declare result: AuthReadDto
}


export class FrontRefreshTokenResponseInfos extends ApiResponse<RefreshTokenReadDto> {
  @ApiProperty({
    description: 'Nouveau token d\'accès',
    type: RefreshTokenReadDto
  })
  declare result: RefreshTokenReadDto
}