import { Injectable } from '@nestjs/common';
import { CreateSaleDto, FrontReadSale } from './dto/create-sales.dto';
import { UpdateSaleDto } from './dto/update-sales.dto';
import { SalesRepository } from './sales.repository';
import { ServiceResult } from 'src/common/types/service.result';
import { SERVICE_NAMES_MAPPING } from 'src/common/constants/services-names.constants';
import { SaleMapper } from './mappers/sale.mapper';

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  /**
   * Crée une nouvelle vente de manière transactionnelle.
   * Valide les stocks, crée le snapshot légal des prix et génère les mouvements de stock.
   * @param createSaleDto Données de la vente à créer
   * @returns Le résultat de service contenant la vente formatée pour le front
   */
  async create(
    createSaleDto: CreateSaleDto,
  ): Promise<ServiceResult<FrontReadSale>> {
    const crud_result = await this.salesRepository.createSale(createSaleDto);
    if (crud_result.isError) {
      return crud_result.toServiceError(SERVICE_NAMES_MAPPING.SALES_SERVICE);
    }
    const saleToFront = SaleMapper.toFront(crud_result.data as any);
    return ServiceResult.success_service(
      saleToFront,
      crud_result.statusCode,
      SERVICE_NAMES_MAPPING.SALES_SERVICE,
    );
  }

  /**
   * Récupère la liste de toutes les ventes, avec filtrage optionnel par magasin.
   * @param storeId ID optionnel du magasin pour filtrer les ventes
   * @returns Le résultat de service contenant la liste des ventes
   */
  async findAll(storeId?: string): Promise<ServiceResult<FrontReadSale[]>> {
    const crud_result = await this.salesRepository.findAllSales(storeId);
    if (crud_result.isError) {
      return crud_result.toServiceError(SERVICE_NAMES_MAPPING.SALES_SERVICE);
    }
    const salesToFront = SaleMapper.toFrontList(crud_result.data as any[]);
    return ServiceResult.success_service(
      salesToFront,
      crud_result.statusCode,
      SERVICE_NAMES_MAPPING.SALES_SERVICE,
    );
  }

  /**
   * Récupère les détails d'une vente spécifique par son identifiant unique.
   * @param id Identifiant UUID de la vente
   * @returns Le résultat de service contenant les informations de la vente
   */
  async findOne(id: string): Promise<ServiceResult<FrontReadSale>> {
    const crud_result = await this.salesRepository.findSaleById(id);
    if (crud_result.isError) {
      return crud_result.toServiceError(SERVICE_NAMES_MAPPING.SALES_SERVICE);
    }
    const saleToFront = SaleMapper.toFront(crud_result.data as any);
    return ServiceResult.success_service(
      saleToFront,
      crud_result.statusCode,
      SERVICE_NAMES_MAPPING.SALES_SERVICE,
    );
  }

  /**
   * Met à jour partiellement les informations d'une vente existante (ex: statut).
   * @param id Identifiant de la vente à modifier
   * @param updateSaleDto Données partielles de mise à jour
   * @returns Le résultat de service contenant la vente mise à jour
   */
  async update(
    id: string,
    updateSaleDto: UpdateSaleDto,
  ): Promise<ServiceResult<FrontReadSale>> {
    const crud_result = await this.salesRepository.updateSale(
      id,
      updateSaleDto,
    );
    if (crud_result.isError) {
      return crud_result.toServiceError(SERVICE_NAMES_MAPPING.SALES_SERVICE);
    }
    const saleToFront = SaleMapper.toFront(crud_result.data as any);
    return ServiceResult.success_service(
      saleToFront,
      crud_result.statusCode,
      SERVICE_NAMES_MAPPING.SALES_SERVICE,
    );
  }

  /**
   * Supprime logiquement une vente du système.
   * @param id Identifiant de la vente à supprimer
   * @returns Le résultat de service contenant la vente supprimée
   */
  async remove(id: string): Promise<ServiceResult<FrontReadSale>> {
    const crud_result = await this.salesRepository.deleteSale(id);
    if (crud_result.isError) {
      return crud_result.toServiceError(SERVICE_NAMES_MAPPING.SALES_SERVICE);
    }
    const saleToFront = SaleMapper.toFront(crud_result.data as any);
    return ServiceResult.success_service(
      saleToFront,
      crud_result.statusCode,
      SERVICE_NAMES_MAPPING.SALES_SERVICE,
    );
  }
}
