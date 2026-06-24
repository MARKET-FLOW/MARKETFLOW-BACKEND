import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UUID } from 'node:crypto';
import { CATEGORY_TAG } from 'src/common/constants/api-tags.constant'; 
import { ApiDoc } from 'src/common/decorators/api-response.decorator';
import { GlobalStringMessage } from 'src/common/types/global.string-message';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { FrontReadCategory } from './dto/read-categories.dto';
import { CategoriesService } from './categories.service';

@ApiTags(CATEGORY_TAG)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  @ApiDoc({
    summary: "Création d'une nouvelle catégorie",
    description: "Catégorie créée avec succès, retourne les informations associées.",
    model: FrontReadCategory,
    status: HttpStatus.CREATED,
    errors: [
      HttpStatus.CONFLICT,
      HttpStatus.BAD_REQUEST,
      HttpStatus.INTERNAL_SERVER_ERROR,
    ],
  })
  async create(
    @Res() _response: Response,
    @Body() createCategoriesDto: CreateCategoriesDto,
  ) {
    const service_result = await this.categoriesService.serviceCreate(createCategoriesDto);
    return service_result.to_HTTP_api_base_response(_response);
  }

  @Get('get-all')
  @ApiQuery({
    name: 'admin',
    required: false,
    description: "Si le scope admin est fourni, inclut les catégories désactivées / archivées.",
  })
  @ApiDoc({
    summary: 'Récupération de toutes les catégories',
    description: 'Récupère la liste complète des catégories actives.',
    model: FrontReadCategory,
    isList: true,
    status: HttpStatus.OK,
    errors: [HttpStatus.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR],
  })
  async getAll(@Res() _response: Response, @Query('admin') admin?: string) {
    const service_result = await this.categoriesService.serviceGetAllCategories(admin);
    return service_result.to_HTTP_api_base_response(_response);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'UUID',
  })
  @ApiDoc({
    summary: 'Récupérer une catégorie par son Id',
    description: 'Catégorie renvoyée avec succès.',
    model: FrontReadCategory,
    status: HttpStatus.OK,
    errors: [HttpStatus.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR],
  })
  async getCategoryById(@Res() _response: Response, @Param('id') id: UUID) {
    const serviceResult = await this.categoriesService.serviceGetCategoryById(id);
    return serviceResult.to_HTTP_api_base_response(_response);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'UUID',
  })
  @ApiDoc({
    summary: 'Modifier une catégorie',
    description: 'Catégorie mise à jour avec succès.',
    model: FrontReadCategory,
    status: HttpStatus.OK,
    errors: [HttpStatus.NOT_FOUND, HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR],
  })
  async updateCategory(
    @Res() _response: Response,
    @Param('id') id: UUID,
    @Body() updateCategoriesDto: UpdateCategoriesDto,
  ) {
    const service_result = await this.categoriesService.serviceUpdateCategory(id, updateCategoriesDto);
    return service_result.to_HTTP_api_base_response(_response);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'UUID',
  })
  @ApiDoc({
    summary: 'Supprimer une catégorie',
    description: 'Catégorie archivée (Soft Delete) avec succès.',
    model: GlobalStringMessage,
    status: HttpStatus.OK,
    errors: [HttpStatus.NOT_FOUND, HttpStatus.INTERNAL_SERVER_ERROR],
  })
  async deleteCategory(@Res() _response: Response, @Param('id') id: UUID) {
    const service_result = await this.categoriesService.serviceDeleteCategory(id);
    return service_result.to_HTTP_api_base_response(_response);
  }
}