/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUserDto, FrontUserInfos } from './dto/create-user.dto';
import { ApiOperation, ApiResponse as SwaggerApiResponse, ApiTags} from '@nestjs/swagger';
import { USER_TAG } from 'src/common/constants/api-tags.constant';

@ApiTags(USER_TAG)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @ApiOperation({ summary: "Création d'un nouvel utilisateur" }) // Titre dans Swagger
  @SwaggerApiResponse({
    status: 201,
    description: 'L’utilisateur a été créé avec succès.',
    type: FrontUserInfos, // On dit à Swagger d'utiliser ta classe de schéma de sortie
  })
  @SwaggerApiResponse({
    status: 409,
    description: 'Conflit : L’utilisateur (email ou username) existe déjà.',
  })
  async create(
    @Res() _response: Response,
    @Body() createUserDto: CreateUserDto
  ) {
    const service_result = await this.usersService.serviceCreate(createUserDto);
    return service_result.to_HTTP_api_base_response(_response);
  }

  
}


