import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ParseUUIDPipe,
} from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-stores.dto';
import { UpdateStoreDto } from './dto/update-stores.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { STORE_TAG } from '../common/constants/api-tags.constant';
import { ApiResponse as SwaggerApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import {
  FrontListStoreInfo,
  FrontStoreInfo,
  FrontStoreNotFoundResponse,
} from './dto/store.front-responses.dto';
import { ApiCommonDocs } from '../common/decorators/api.global.decorator';
import { UUID } from 'node:crypto';

@ApiTags(STORE_TAG)
@Controller('stores')
@ApiCommonDocs()
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau magasin' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Store créer avec succes.',
    type: FrontStoreInfo,
  })
  async create(
    @Body() createStoreDto: CreateStoreDto,
    @Res() _response: Response,
  ) {
    const res = await this.storesService.serviceCreateStore(createStoreDto);

    return res.to_HTTP_api_base_response(_response);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les magasins' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Liste de tous les magasins récupérée avec succès.',
    type: FrontListStoreInfo,
  })
  async findAll(@Res() _response: Response) {
    const res = await this.storesService.serviceFindAllStores();
    return res.to_HTTP_api_base_response(_response);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un magasin par son ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Magasin récupéré avec succès.',
    type: FrontStoreInfo,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Store introuvable',
    type: FrontStoreNotFoundResponse,
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Res() _response: Response,
  ) {
    const res = await this.storesService.serviceFindStoreById(id);
    return res.to_HTTP_api_base_response(_response);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un magasin par son ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Magasin mis à jour avec succès.',
    type: FrontStoreInfo,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Store introuvable',
    type: FrontStoreNotFoundResponse,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateStoreDto: UpdateStoreDto,
    @Res() _response: Response,
  ) {
    const res = await this.storesService.serviceUpdateStore(id, updateStoreDto);
    return res.to_HTTP_api_base_response(_response);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un magasin par son ID' })
  @SwaggerApiResponse({
    status: 200,
    description: 'Magasin supprimé avec succès.',
    type: FrontStoreInfo,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Store introuvable',
    type: FrontStoreNotFoundResponse,
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Res() _response: Response,
  ) {
    const res = await this.storesService.serviceDeleteStore(id);
    return res.to_HTTP_api_base_response(_response);
  }
}
