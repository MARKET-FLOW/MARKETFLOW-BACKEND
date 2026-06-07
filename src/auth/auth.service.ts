import { Injectable } from '@nestjs/common';
import { JwtSignOptions } from '@nestjs/jwt';
import { UUID } from 'node:crypto';
import { ErrorType } from 'src/common/types/error-type.enum';
import { ErrorMessage } from 'src/common/types/error.message';
import { ServiceResult } from 'src/common/types/service.result';
import { hashData, verifyHashData } from 'src/common/utils/password.hash';
import { CreateRefreshTokenDto } from 'src/refresh-tokens/dto/create-refresh-tokens.dto';
import { RefreshTokensRepository } from 'src/refresh-tokens/refresh-tokens.repository';
import { AuthRepository } from './auth.repository';
import { JwtManager } from './auth_dependencies/jwt.manager';
import { AuthReadDto } from './dto/auth.read';
import { UserAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly refreshTokenSession: RefreshTokensRepository,
    private readonly jswtService: JwtManager,
  ) {}

  /**
   * Ici je gère le processus de connexion d'un utilisateur.
   * - Vérifier l'existence de l'utilisateur.
   * - Valider le mot de passe.
   * - Créer une session de refresh token en base de données.
   * - Génèrer les tokens (Access & Refresh).
   */
  async serviceLogin(
    authData: UserAuthDto,
  ): Promise<ServiceResult<AuthReadDto>> {
    const authRepoResponse = await this.authRepo.findUserByFields(
      'username',
      authData.username,
    );
    if (authRepoResponse.isError) {
      return ServiceResult.error_service(
        authRepoResponse.error,
        authRepoResponse.statusCode,
      );
    }

    if (
      !(await verifyHashData(
        authRepoResponse.data.passwordHash,
        authData.password,
      ))
    ) {
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.NOT_FOUND,
          `Utilisateur avec username ${authData.username} non trouvé`,
        ),
      );
    }

    const tokenData: CreateRefreshTokenDto = {
      storeId: authRepoResponse.data.storeId,
      userId: authRepoResponse.data.id,
      tokenHash: await hashData(authRepoResponse.data.id),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    const refreshRepoResponse =
      await this.refreshTokenSession.createTokenSession(tokenData);

    if (refreshRepoResponse.isError) {
      return ServiceResult.error_service(
        refreshRepoResponse.error,
        refreshRepoResponse.statusCode,
      );
    }

    // on cré les access
    const accessToken = this.jswtService.generateAccessToken(
      refreshRepoResponse.data.id as UUID,
      refreshRepoResponse.data.userId as UUID,
      authRepoResponse.data.role,
      process.env.JWT_SECRET ?? '',
      (process.env.JWT_EXPIRES_IN as JwtSignOptions['expiresIn']) ?? '30m',
    );

    const refreshToken = this.jswtService.generateRefreshToken(
      tokenData.tokenHash,
      process.env.JWT_REFRESH ?? '',
      (process.env.JWT_EXPIRES_IN as JwtSignOptions['expiresIn']) ?? '1d',
    );

    // on cré les cookies si c'est web
    // pour le moment on ne va pas use les cookies

    return ServiceResult.success_service(
      {
        message: `Utilisateur ${authRepoResponse.data.username} connecté avec succès!`,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      200,
    );
  }

  /**
   * Je génère un nouvel Access Token à partir d'un Refresh Token valide. La fonction:
   * - Vérifie la validité du JWT Refresh Token.
   * - Vérifie que la session existe et n'est pas révoquée en base de données.
   * - Récupère les données à jour de l'utilisateur pour le nouveau token.
   */
  async serviceRefreshToken(
    refreshToken: string,
  ): Promise<ServiceResult<{ accessToken: string }>> {
    const payload = this.jswtService.verifyRefreshToken(
      refreshToken,
      process.env.JWT_REFRESH ?? '',
    );

    if (!payload) {
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.UNAUTHORIZED,
          'Refresh token invalide ou expiré',
        ),
        401,
      );
    }

    const sessionResponse = await this.refreshTokenSession.findTokenByHash(
      payload.sessHash,
    );

    if (sessionResponse.isError) {
      return ServiceResult.error_service(
        sessionResponse.error,
        sessionResponse.statusCode,
      );
    }

    const userRepoResponse = await this.authRepo.findUserByFields(
      'id',
      sessionResponse.data.userId,
    );

    if (userRepoResponse.isError) {
      return ServiceResult.error_service(
        userRepoResponse.error,
        userRepoResponse.statusCode,
      );
    }

    const accessToken = this.jswtService.generateAccessToken(
      sessionResponse.data.id as UUID,
      userRepoResponse.data.id as UUID,
      userRepoResponse.data.role,
      process.env.JWT_SECRET ?? '',
      (process.env.JWT_EXPIRES_IN as JwtSignOptions['expiresIn']) ?? '30m',
    );

    return ServiceResult.success_service({ accessToken }, 200);
  }
}
