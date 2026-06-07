import { Body, Controller, Post, Res } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AUTH_TAG } from 'src/common/constants/api-tags.constant';
import { ApiCommonDocs } from 'src/common/decorators/api.global.decorator';
import { GlobalStringMessage } from 'src/common/types/global.string-message';
import { AuthService } from './auth.service';
import { FrontRefreshTokenResponseInfos } from './dto/auth.front';
import { UserAuthDto } from './dto/create-auth.dto';

@ApiTags(AUTH_TAG)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Se connecter' })
  @SwaggerApiResponse({
    description: 'Utilsateur connecté avec succès',
    status: 200,
    type: GlobalStringMessage,
  })
  @SwaggerApiResponse({
    description: 'Utilsateur non trouvé',
    status: 404,
  })
  @ApiCommonDocs()
  async login(@Res() _response: Response, @Body() authData: UserAuthDto) {
    const serviceResult = await this.authService.serviceLogin(authData);
    return serviceResult.to_HTTP_api_base_response(_response);
  }

  @Post('/refresh-token')
  @ApiOperation({ summary: "Obtenir un nouveau token d'accès" })
  @SwaggerApiResponse({
    description: "Nouveau token d'accès généré avec succès",
    status: 200,
    type: FrontRefreshTokenResponseInfos,
  })
  @SwaggerApiResponse({
    description: 'Token de rafraîchissement invalide ou expiré',
    status: 401,
  })
  @ApiCommonDocs()
  async refreshToken(
    @Res() _response: Response,
    @Body('refreshToken') refreshToken: string,
  ) {
    const serviceResult =
      await this.authService.serviceRefreshToken(refreshToken);
    return serviceResult.to_HTTP_api_base_response(_response);
  }
}
