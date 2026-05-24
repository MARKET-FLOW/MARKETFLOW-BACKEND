/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, FrontProductInfos } from './dto/create-products.dto';
import { UpdateProductDto } from './dto/update-products.dto';
import { PRODUCT_TAG } from 'src/common/constants/api-tags.constant';
import { ApiOperation,ApiResponse as SwaggerApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { PaginationDto } from './dto/pagination.dto';
import { UUID } from 'crypto';

@ApiTags(PRODUCT_TAG)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

// controller pour créer un produit
  @Post()
  @ApiOperation({ summary: "Création d'un nouveau produit" })
  @SwaggerApiResponse({
    status: 201,
    description: 'Le produit a été créé avec succès',
    type: FrontProductInfos,
  })
  @SwaggerApiResponse({
    status: 409,
    description: 'Conflit: Le produit (name) existe déjà'
  })

   async create(
    @Res() _response: Response,
    @Body() createProductDto: CreateProductDto) {
      const service_result = await this.productsService.serviceCreate(createProductDto);
    return service_result.to_HTTP_api_base_response(_response);
  }
  //controller pour obtenir tout les produits
  @Get('get-all')
  @ApiQuery({
    name: 'admin',
    required: false,
    description: `Si la valeur est '12345' alors vous allez obtenir tous les produits, y compris les produits supprimés`,
  })
  @ApiOperation({ summary: "Récupération de tous les produits" })
  @SwaggerApiResponse({
    status: 200,
    description: 'Liste de tous les produits',
    type: FrontProductInfos,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Liste vide trouvée.',
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Erreur interne du serveur.',
  })
  async getAll(
  @Res() _response: Response,
  @Query('admin') admin?: string,
  @Query() pagination?: PaginationDto,
) {
  const service_result = await this.productsService.servicegetAllProducts(pagination, admin);
  return service_result.to_HTTP_api_base_response(_response);
}

//controller pour obtenir un produit par son id
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'UUID'
  })
  @ApiOperation({ summary: "Récupération d'un produit par son id" })
  @SwaggerApiResponse({
    status: 200,
    description: 'Route pour récupérer un produit en utilisant son identifiant unique',
    type: FrontProductInfos,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Produit non trouvé pour l\'identifiant fourni.',
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Erreur interne du serveur.',
  })
  async getProductById(@Res() _response: Response, @Param('id') id: UUID) {
    const service_result = await this.productsService.serviceGetProductById(id);
    return service_result.to_HTTP_api_base_response(_response);
  }

  // controller pour update un produit
  @Patch(':id')
  @ApiOperation({ summary: "Mise à jour d'un produit" })
  @SwaggerApiResponse({
    status: 200,
    description: 'Mettre a jour un produit en utilisant son identifiant unique',
    type: FrontProductInfos,
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Produit non trouvé pour l\'identifiant fourni.',
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Erreur interne du serveur.',
  })
  async updateProduct(@Res() _response: Response, @Param('id') id: UUID, @Body() updateProductDto: UpdateProductDto) {
    const service_result = await this.productsService.serviceUpdateProduct(id, updateProductDto);
    return service_result.to_HTTP_api_base_response(_response);
  }

  @Delete(':id')
  @ApiOperation({ summary: "Suppression d'un produit" })
  @SwaggerApiResponse({
    status: 200,
    description: 'Supprimer un produit en utilisant son identifiant unique',
  })
  @SwaggerApiResponse({
    status: 404,
    description: 'Produit non trouvé pour l\'identifiant fourni.',
  })
  @SwaggerApiResponse({
    status: 500,
    description: 'Erreur interne du serveur.',
  })
  async deleteProduct(@Res() _response: Response, @Param('id') id: UUID) {
    const service_result = await this.productsService.serviceDeleteProduct(id);
    return service_result.to_HTTP_api_base_response(_response);
  }
}
