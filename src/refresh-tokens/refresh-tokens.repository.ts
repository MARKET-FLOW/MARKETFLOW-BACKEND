import { Injectable } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';
import { UUID } from 'node:crypto';
import { handleProjectErrors } from 'src/common/errors-handlers/generic-error.handler';
import { CRUDResult } from 'src/common/types/crud.result';
import { ErrorType } from 'src/common/types/error-type.enum';
import { ErrorMessage } from 'src/common/types/error.message';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRefreshTokenDto } from './dto/create-refresh-tokens.dto';

@Injectable()
export class RefreshTokensRepository {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Enregistre une nouvelle session de rafraîchissement en base de données.
   * Utilisé lors de la connexion initiale.
   */
  async createTokenSession(
    tokenData: CreateRefreshTokenDto,
  ): Promise<CRUDResult<RefreshToken>> {
    try {
      const tokenSession = await this.prismaService.refreshToken.create({
        data: tokenData,
      });

      return CRUDResult.crud_success(tokenSession, 201);
    } catch (error) {
      return handleProjectErrors<RefreshToken>(error);
    }
  }

  /**
   * Récupère une session par son identifiant unique.
   * Vérifie que la session n'est ni révoquée ni supprimée.
   */
  async getTokenSession(id: UUID): Promise<CRUDResult<RefreshToken>> {
    try {
      const dbRefTokSess = await this.prismaService.refreshToken.findFirst({
        where: {
          id: id,
          isRevoked: false,
          deletedAt: null,
        },
      });

      if (!dbRefTokSess) {
        return CRUDResult.crud_error(
          new ErrorMessage(
            ErrorType.NOT_FOUND,
            'Refresh Token ou Session non trouvé',
          ),
          404,
        );
      }

      return CRUDResult.crud_success(dbRefTokSess, 200);
    } catch (error) {
      return handleProjectErrors<RefreshToken>(error);
    }
  }

  /**
   * Recherche une session active à partir du hash contenu dans le payload du Refresh Token.
   * C'est le mécanisme principal de validation de la session persistante.
   */
  async findTokenByHash(hash: string): Promise<CRUDResult<RefreshToken>> {
    try {
      const dbRefTokSess = await this.prismaService.refreshToken.findFirst({
        where: {
          tokenHash: hash,
          isRevoked: false,
          deletedAt: null,
        },
      });

      if (!dbRefTokSess) {
        return CRUDResult.crud_error(
          new ErrorMessage(
            ErrorType.NOT_FOUND,
            'Refresh Token ou Session non trouvé ou révoqué',
          ),
          404,
        );
      }

      return CRUDResult.crud_success(dbRefTokSess, 200);
    } catch (error) {
      return handleProjectErrors<RefreshToken>(error);
    }
  }
}
