import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AUTH_TAG } from 'src/common/constants/api-tags.constant';
import { AuthService } from './auth.service';
import { FrontAuthResponseInfos, FrontRefreshTokenResponseInfos } from './dto/auth.front';
import { RefreshTokenDTO, UserAuthDto } from './dto/create-auth.dto';
import { CurrentUser } from './auth_dependencies/decorators/current-user.decorator';
import { UserWithStore } from 'src/users/global-user/user.message';
import { FrontUserInfos } from 'src/users/dto/front-read.user';
import { JwtAuthGuard } from './auth_dependencies/decorators/jwt-auth.guard';
import { UserMapper } from 'src/users/mappers/user.mapper';

@ApiTags(AUTH_TAG)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Se connecter' })
  @SwaggerApiResponse({
    description: 'Utilsateur connecté avec succès',
    status: 200,
    type: FrontAuthResponseInfos,
  })
  @SwaggerApiResponse({
    description: 'Utilsateur non trouvé',
    status: 404,
  })
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
  async refreshToken(
    @Res() _response: Response,
    @Body() refreshToken: RefreshTokenDTO,
  ) {
    const serviceResult =
      await this.authService.serviceRefreshToken(refreshToken);
    return serviceResult.to_HTTP_api_base_response(_response);
  }

  @Get('/me')
  @SwaggerApiResponse({
    description: "les infos de l'utilisateur actuellement connecté",
    status: 200,
    type: FrontUserInfos,
  })
  @SwaggerApiResponse({
    description: 'Token de rafraîchissement invalide ou expiré',
    status: 401,
  })
  @UseGuards(JwtAuthGuard)
  @ApiOperation({summary: 'Obtenir les infos du user actuellement connecter'})
  async getMe(@Res() _response: Response, @CurrentUser() user: UserWithStore){
    const userToFront = UserMapper.toFront(user);
    return FrontUserInfos.success_response(userToFront, _response, 200)
  }
}
