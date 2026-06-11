import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SaleItemsService } from './sale-items.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiCommonDocs } from 'src/common/decorators/api.global.decorator';
import { ApiCustomResponse } from 'src/common/decorators/api-response.decorator';
import { FrontReadSaleItem } from './dto/create-sale-items.dto';

@ApiTags('sale-items')
@ApiCommonDocs()
@Controller('sale-items')
export class SaleItemsController {
  constructor(private readonly saleItemsService: SaleItemsService) {}

  /**
   * Récupère toutes les lignes de vente.
   * Permet de filtrer par l'identifiant de la facture parente (saleId)
   */
  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Récupérer les articles de vente' })
  @ApiQuery({
    name: 'saleId',
    required: false,
    description: 'Filtrer par facture',
  })
  @ApiCustomResponse(FrontReadSaleItem, true)
  async findAll(@Res() _response: Response, @Query('saleId') saleId?: string) {
    const service_result = await this.saleItemsService.findAll(saleId);
    return service_result.to_HTTP_api_base_response(_response);
  }

  /**
   * Récupère les détails d'un article spécifique vendu
   */
  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Récupérer un article par ID' })
  @ApiCustomResponse(FrontReadSaleItem)
  async findOne(
    @Res() _response: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const service_result = await this.saleItemsService.findOne(id);
    return service_result.to_HTTP_api_base_response(_response);
  }
}
