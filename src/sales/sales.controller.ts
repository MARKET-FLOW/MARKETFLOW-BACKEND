import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sales.dto';
import { UpdateSaleDto } from './dto/update-sales.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CRUDResult } from 'src/common/types/crud.result';
import { Sale } from '@prisma/client';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  // POST /sales : Enregistrer une nouvelle vente
  @Post()
  @ApiOperation({ summary: 'Enregistrer une nouvelle vente' })
  @ApiResponse({ status: 201, description: 'La vente a été enregistrée' })
  async create(@Body() createSaleDto: CreateSaleDto): Promise<CRUDResult<Sale>> {
    return this.salesService.create(createSaleDto);
  }

  // GET /sales : Récupérer toutes les ventes actives 
  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les ventes' })
  @ApiQuery({ name: 'storeId', required: false })
  @ApiResponse({ status: 200, description: 'Liste des ventes' })
  async findAll(@Query('storeId') storeId?: string): Promise<CRUDResult<Sale[]>> {
    return this.salesService.findAll(storeId);
  }

  // GET /sales/:id : Récupérer les détails d'une vente spécifique
  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une vente par ID' })
  @ApiResponse({ status: 200, description: 'Détails de la vente' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CRUDResult<Sale>> {
    return this.salesService.findOne(id);
  }

  // PATCH /sales/:id : Modifier les informations d'une vente existante
  @Patch(':id')
  @ApiOperation({ summary: 'Modifier une vente' })
  @ApiResponse({ status: 200, description: 'Vente mise à jour' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSaleDto: UpdateSaleDto,
  ): Promise<CRUDResult<Sale>> {
    return this.salesService.update(id, updateSaleDto);
  }

  // DELETE /sales/:id : Supprimer logiquement une vente
  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une vente' })
  @ApiResponse({ status: 200, description: 'Vente supprimée' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<CRUDResult<Sale>> {
    return this.salesService.remove(id);
  }
}

