import { Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse as SwaggerApiResponse, ApiTags } from '@nestjs/swagger';
import { AUTH_TAG } from 'src/common/constants/api-tags.constant';
import { Response } from 'express';
import { UserAuthDto } from './dto/create-auth.dto';
import { GlobalStringMessage } from 'src/common/types/global.string-message';
import { ApiCommonDocs } from 'src/common/decorators/api.global.decorator';


@ApiTags(AUTH_TAG)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('/login')
  @ApiOperation({summary: 'Se connecter'})
  @SwaggerApiResponse({
    description: 'Utilsateur connecté avec succès',
    status: 200,
    type: GlobalStringMessage
  })
  @SwaggerApiResponse({
    description: 'Utilsateur non trouvé',
    status: 404,
  })
  @ApiCommonDocs()
  async login(@Res() _response: Response, authData: UserAuthDto){
    const serviceResult =  await this.authService.serviceLogin(authData);
    return serviceResult.to_HTTP_api_base_response(_response)
  }
}
