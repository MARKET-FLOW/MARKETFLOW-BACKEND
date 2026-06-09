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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // POST /sales : Enregistrer une nouvelle vente
  @Post()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Enregistrer une nouvelle vente' })
  @ApiResponse({ status: 201, description: 'La vente a été enregistrée' })
  async create(
    @Res() _response: Response,
    @Body() createSaleDto: CreateSaleDto,
  ) {
    const service_result = await this.salesService.create(createSaleDto);
    return service_result.to_HTTP_api_base_response(_response);
  }

  // GET /sales : Récupérer toutes les ventes actives
  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Récupérer toutes les ventes' })
  @ApiQuery({ name: 'storeId', required: false })
  @ApiResponse({ status: 200, description: 'Liste des ventes' })
  async findAll(
    @Res() _response: Response,
    @Query('storeId') storeId?: string,
  ) {
    const service_result = await this.salesService.findAll(storeId);
    return service_result.to_HTTP_api_base_response(_response);
  }

  // GET /sales/:id : Récupérer les détails d'une vente spécifique
  @Get(':id')
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  @ApiOperation({ summary: 'Récupérer une vente par ID' })
  @ApiResponse({ status: 200, description: 'Détails de la vente' })
  async findOne(
    @Res() _response: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const service_result = await this.salesService.findOne(id);
    return service_result.to_HTTP_api_base_response(_response);
  }

  // PATCH /sales/:id : Modifier les informations d'une vente existante
  @Patch(':id')
  @Roles('OWNER', 'MANAGER') // Restreint aux managers/owners
  @ApiOperation({ summary: 'Modifier une vente' })
  @ApiResponse({ status: 200, description: 'Vente mise à jour' })
  async update(
    @Res() _response: Response,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSaleDto: UpdateSaleDto,
  ) {
    const service_result = await this.salesService.update(id, updateSaleDto);
    return service_result.to_HTTP_api_base_response(_response);
  }

  // DELETE /sales/:id : Supprimer logiquement une vente
  @Delete(':id')
  @Roles('OWNER', 'MANAGER') // Restreint aux managers/owners
  @ApiOperation({ summary: 'Supprimer une vente' })
  @ApiResponse({ status: 200, description: 'Vente supprimée' })
  async remove(
    @Res() _response: Response,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const service_result = await this.salesService.remove(id);
    return service_result.to_HTTP_api_base_response(_response);
  }
}
