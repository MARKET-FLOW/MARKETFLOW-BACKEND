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
import { FrontReadStore } from './dto/front-read-store.dto';

@ApiTags(STORE_TAG)
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau magasin' })
  @SwaggerApiResponse({
    status: 201,
    description: 'Store créer avec succes.',
    type: FrontReadStore,
  })
  async create(
    @Body() createStoreDto: CreateStoreDto,
    @Res() _response: Response,
  ) {
    const res = await this.storesService.serviceCreateStore(createStoreDto);

    return res.to_HTTP_api_base_response(_response);
  }

  @Get()
  findAll() {
    return this.storesService.findAll();
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
