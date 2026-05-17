/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiResponse as SwaggerApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UUID } from 'node:crypto';
import { USER_TAG } from 'src/common/constants/api-tags.constant';
import { GlobalStringMessage } from 'src/common/types/global.string-message';
import {
  CreateUserDto,
  FrontUserInfos,
  ListFrontUserInfos,
} from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags(USER_TAG)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // constroller pour créer un utilisateur
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
    @Body() createUserDto: CreateUserDto,
  ) {
    const service_result = await this.usersService.serviceCreate(createUserDto);
    return service_result.to_HTTP_api_base_response(_response);
  }

  // Controller pour obtenir tous les utilisateurs
  @Get('get-all')
  @ApiQuery({
    name: 'admin',
    required: false,
    description: "Si la valeur est '1234', inclut les utilisateurs supprimés.",
  })
  @ApiOperation({ summary: 'Récupération de tous les utilisateurs' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Liste de tous les utilisateurs.',
    type: ListFrontUserInfos,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Liste vide trouvée.',
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Erreur interne du serveur.',
  })
  async getAll(@Res() _response: Response, @Query('admin') admin?: string) {
    const service_result = await this.usersService.serviceGetAllUsers(admin);
    return service_result.to_HTTP_api_base_response(_response);
  }

  // controller pour supprimer un utilisateur
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un utilisateur ' })
  @SwaggerApiResponse({
    description: 'Supprimer un utilisateur',
    status: 200,
    type: GlobalStringMessage,
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Erreur interne du serveur.',
  })
  async deleteUser(@Res() _response: Response, @Param('id') id: UUID) {
    const service_result = await this.usersService.serviceDeleteUser(id);
    return service_result.to_HTTP_api_base_response(_response);
  }
}
