import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AUTH_TAG } from 'src/common/constants/api-tags.constant';
import { ApiDoc } from 'src/common/decorators/api-response.decorator';
import { FrontUserInfos } from 'src/users/dto/front-read.user';
import { UserWithStore } from 'src/users/global-user/user.message';
import { UserMapper } from 'src/users/mappers/user.mapper';
import { AuthService } from './auth.service';
import { CurrentUser } from './auth_dependencies/decorators/current-user.decorator';
import { JwtAuthGuard } from './auth_dependencies/decorators/jwt-auth.guard';
import {
  FrontAuthResponseInfos,
  FrontRefreshTokenResponseInfos,
} from './dto/auth.front';
import { RefreshTokenDTO, UserAuthDto } from './dto/create-auth.dto';


@ApiTags(AUTH_TAG)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiDoc({
    summary: 'Récupérer un utilisateur par Id',
    model: FrontAuthResponseInfos,
    status: HttpStatus.OK,
    errors: [HttpStatus.NOT_FOUND],
  })
  async login(@Res() _response: Response, @Body() authData: UserAuthDto) {
    const serviceResult = await this.authService.serviceLogin(authData);
    return serviceResult.to_HTTP_api_base_response(_response);
  }

  @Post('/refresh-token')
  @ApiDoc({
    summary: 'Refresh Token du user',
    description: 'Retourne le nouveau access token',
    model: FrontRefreshTokenResponseInfos,
    status: HttpStatus.OK,
    errors: [HttpStatus.UNAUTHORIZED]
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
  @ApiDoc({
    summary: 'Les infos de l\'utilisateur connecté',
    model: FrontUserInfos,
    status: HttpStatus.OK,
    errors: [HttpStatus.UNAUTHORIZED],
  })
  @UseGuards(JwtAuthGuard)
  async getMe(@Res() _response: Response, @CurrentUser() user: UserWithStore) {
    const userToFront = UserMapper.toFront(user);
    return FrontUserInfos.success_response(userToFront, _response, 200);
  }
}
