import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CookieService } from 'src/common/cookies/cookie.service';
import { ErrorType } from 'src/common/types/error-type.enum';
import { ErrorMessage } from 'src/common/types/error.message';
import { ServiceResult } from 'src/common/types/service.result';
import { hashData, verifyHashData } from 'src/common/utils/password.hash';
import { CreateRefreshTokenDto } from 'src/refresh-tokens/dto/create-refresh-tokens.dto';
import { RefreshTokensRepository } from 'src/refresh-tokens/refresh-tokens.repository';
import { AuthRepository } from './auth.repository';
import { UserAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepo: AuthRepository,
    private readonly cookieService: CookieService,
    private readonly refreshTokenSession: RefreshTokensRepository,
  ) {}

  async serviceLogin(
    res: Response,
    authData: UserAuthDto,
  ): Promise<ServiceResult<string>> {
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

    // on génère les tokens ici et on retourne un message de succès
    const tokenData: CreateRefreshTokenDto = {
      storeId: authRepoResponse.data.storeId,
      userId: authRepoResponse.data.id,
      tokenHash: await hashData(authRepoResponse.data.id),
      expiresAt: new Date(Date.now() + 24 * 60 * 60),
    };
    const refreshRepoResponse =
      await this.refreshTokenSession.createTokenSession(tokenData);

    if (refreshRepoResponse.isError) {
      return ServiceResult.error_service(
        refreshRepoResponse.error,
        refreshRepoResponse.statusCode,
      );
    }

    // on cré les cookies
    this.cookieService.setCookie(res, {
      cookie_id: '_ACCESS_ID',
      value: await hashData(refreshRepoResponse.data.id),
      ttl: 60 * 60 * 1000,
    });

    return ServiceResult.success_service(
      `Utilisateur ${authData.username} connecté avec succès !`,
    );
  }
}
