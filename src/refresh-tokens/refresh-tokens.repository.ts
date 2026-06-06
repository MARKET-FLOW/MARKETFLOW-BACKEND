import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateRefreshTokenDto } from "./dto/create-refresh-tokens.dto";
import { CRUDResult } from "src/common/types/crud.result";
import { RefreshToken } from "@prisma/client";
import { handleProjectErrors } from "src/common/errors-handlers/generic-error.handler";
import { UUID } from "node:crypto";
import { ErrorMessage } from "src/common/types/error.message";
import { ErrorType } from "src/common/types/error-type.enum";


@Injectable()
export class RefreshTokensRepository {

  constructor(private readonly prismaService: PrismaService){}

  async createTokenSession(tokenData: CreateRefreshTokenDto): Promise<CRUDResult<RefreshToken>>{
    try{
      const tokenSession = await this.prismaService.refreshToken.create(
        {
          data: tokenData
        }
      ) 

      return CRUDResult.crud_success(tokenSession, 201)
    } catch(error){
      return handleProjectErrors<RefreshToken>(error)
    }
  }


  async getTokenSession(id: UUID): Promise<CRUDResult<RefreshToken>>{

    try{

      const dbRefTokSess = await this.prismaService.refreshToken.findFirst(
        {
          where: {
            id: id,
            isRevoked: false,
            deletedAt: null,
          }
        }
      ) 

      if (!dbRefTokSess){
        return CRUDResult.crud_error(
          new ErrorMessage(
            ErrorType.NOT_FOUND,
            "Refresh Token ou Session non trouvé",
          ),
          404
        )
      }

      return CRUDResult.crud_success(dbRefTokSess, 200)

    } catch(error){
      return handleProjectErrors<RefreshToken>(error)
    }
  }
}
