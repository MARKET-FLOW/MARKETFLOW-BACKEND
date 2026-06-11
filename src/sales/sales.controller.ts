import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sales.dto';
import { UpdateSaleDto } from './dto/update-sales.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiCommonDocs } from 'src/common/decorators/api.global.decorator';
import { ApiCustomResponse } from 'src/common/decorators/api-response.decorator';
import { FrontReadSale } from './dto/create-sales.dto';

@ApiTags('sales')
@ApiCommonDocs()
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  /**
   * Enregistre une nouvelle vente dans le système.
   * Valide les données, crée la vente et génère les mouvements de stock associés.
   */
  @Post()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Enregistrer une nouvelle vente' })
  @ApiCustomResponse(FrontReadSale)
  async create(
    @Res() _response: Response,
    @Body() createSaleDto: CreateSaleDto,
  ) {
    const service_result = await this.salesService.create(createSaleDto);
    return service_result.to_HTTP_api_base_response(_response);
  }

  /**
   * Récupère la liste de toutes les ventes actives.
   * Peut être filtrée par identifiant de magasin.
   */
  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Récupérer toutes les ventes' })
  @ApiQuery({ name: 'storeId', required: false })
  @ApiCustomResponse(FrontReadSale, true)
  async findAll(
    @Res() _response: Response,
    @Query('storeId') storeId?: string,
  ) {
    const service_result = await this.salesService.findAll(storeId);
    return service_result.to_HTTP_api_base_response(_response);
  }

  /**
   * Récupère les détails complets d'une vente spécifique
   */
  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Récupérer une vente par ID' })
  @ApiCustomResponse(FrontReadSale)
  async findOne(
    @Res() _response: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const service_result = await this.salesService.findOne(id);
    return service_result.to_HTTP_api_base_response(_response);
  }

  /**
   * Met à jour les informations d'une vente (ex: statut)
   */
  @Patch(':id')
  @Roles('OWNER', 'MANAGER') // Restreint aux managers/owners
  @ApiOperation({ summary: 'Modifier une vente' })
  @ApiCustomResponse(FrontReadSale)
  async update(
    @Res() _response: Response,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSaleDto: UpdateSaleDto,
  ) {
    const service_result = await this.salesService.update(id, updateSaleDto);
    return service_result.to_HTTP_api_base_response(_response);
  }

  /**
   * Supprime logiquement une vente
   */
  @Delete(':id')
  @Roles('OWNER', 'MANAGER') // Restreint aux managers/owners
  @ApiOperation({ summary: 'Supprimer une vente' })
  @ApiCustomResponse(FrontReadSale)
  async remove(
    @Res() _response: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const service_result = await this.salesService.remove(id);
    return service_result.to_HTTP_api_base_response(_response);
  }
}
