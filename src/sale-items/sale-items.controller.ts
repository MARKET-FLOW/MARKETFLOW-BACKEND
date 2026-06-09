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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('sale-items')
@Controller('sale-items')
export class SaleItemsController {
  constructor(private readonly saleItemsService: SaleItemsService) {}

  // GET /sale-items : Récupérer les articles (filtrer par saleId)
  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Récupérer les articles de vente' })
  @ApiQuery({
    name: 'saleId',
    required: false,
    description: 'Filtrer par facture',
  })
  @ApiResponse({ status: 200, description: 'Liste des articles' })
  async findAll(@Res() _response: Response, @Query('saleId') saleId?: string) {
    const service_result = await this.saleItemsService.findAll(saleId);
    return service_result.to_HTTP_api_base_response(_response);
  }

  // GET /sale-items/:id : Récupérer un article spécifique
  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Récupérer un article par ID' })
  @ApiResponse({ status: 200, description: "Détails de l'article" })
  @ApiResponse({ status: 404, description: 'Article introuvable' })
  async findOne(
    @Res() _response: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const service_result = await this.saleItemsService.findOne(id);
    return service_result.to_HTTP_api_base_response(_response);
  }
}
