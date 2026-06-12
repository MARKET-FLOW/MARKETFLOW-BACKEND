import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UUID } from 'node:crypto';
import { USER_TAG } from 'src/common/constants/api-tags.constant';
import { ApiDoc } from 'src/common/decorators/api-response.decorator';
import { GlobalStringMessage } from 'src/common/types/global.string-message';
import { CreateUserDto } from './dto/create-user.dto';
import { FrontReadUser } from './dto/read.user.'; 
import { UsersService } from './users.service';

@ApiTags(USER_TAG)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // constroller pour créer un utilisateur
  @Post('create')
  @ApiDoc({
    summary: "Création d'un nouvel utilisateur",
    description:
      "utilisateur créé avec succès, retourne les infos de l'utilisateur créé",
    model: FrontReadUser, // Utilisation du DTO de données pur
    status: HttpStatus.CREATED,
    errors: [
      HttpStatus.CONFLICT,
      HttpStatus.BAD_REQUEST,
      HttpStatus.INTERNAL_SERVER_ERROR,
    ],
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
  @ApiDoc({
    summary: 'Récupération de tous les utilisateurs',
    description: 'Récupère la liste de tous les utilisateurs actifs.',
    model: FrontReadUser, // Utilisation du DTO de données pur
    isList: true,
    status: HttpStatus.OK,
    errors: [HttpStatus.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR],
  })
  async getAll(@Res() _response: Response, @Query('admin') admin?: string) {
    const service_result = await this.usersService.serviceGetAllUsers(admin);
    return service_result.to_HTTP_api_base_response(_response);
  }

  // controller pour récupérer un utilisateur par Id
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'UUID',
  })
  @ApiDoc({
    summary: 'Récupérer un utilisateur par Id',
    description: 'Utilisateur récupéré avec succès.',
    model: FrontReadUser, // Utilisation du DTO de données pur
    status: HttpStatus.OK,
    errors: [HttpStatus.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR],
  })
  async getUserById(@Res() _response: Response, @Param('id') id: UUID) {
    const serviceResult = await this.usersService.serviceGetUserById(id);
    return serviceResult.to_HTTP_api_base_response(_response);
  }

  // controller pour supprimer un utilisateur
  @Delete(':id')
  @ApiDoc({
    summary: 'Supprimer un utilisateur',
    description: 'Utilisateur supprimé avec succès',
    model: GlobalStringMessage,
    status: HttpStatus.OK,
    errors: [HttpStatus.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR],
  })
  async deleteUser(@Res() _response: Response, @Param('id') id: UUID) {
    const service_result = await this.usersService.serviceDeleteUser(id);
    return service_result.to_HTTP_api_base_response(_response);
  }
}
