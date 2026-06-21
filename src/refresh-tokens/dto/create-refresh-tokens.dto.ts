import { IsDate, IsString, IsUUID } from "class-validator"

export class CreateRefreshTokenDto {

  @IsUUID()
  storeId!: string 

  @IsUUID()
  userId!: string

  @IsString()
  tokenHash!: string

  @IsDate()
  expiresAt!: Date

}
