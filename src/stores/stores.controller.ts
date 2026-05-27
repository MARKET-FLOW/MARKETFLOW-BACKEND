import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
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
} from './dto/store.front-responses.dto';
import { ApiValidationError } from '../common/decorators/api-validation-error.decorator';

@ApiTags(STORE_TAG)
@Controller('stores')
@ApiValidationError()
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
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(+id);
  }
}
