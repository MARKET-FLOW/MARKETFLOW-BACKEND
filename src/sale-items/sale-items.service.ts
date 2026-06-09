import { Injectable } from '@nestjs/common';
import { SaleItemsRepository } from './sale-items.repository';
import { ServiceResult } from 'src/common/types/service.result';
import { SERVICE_NAMES_MAPPING } from 'src/common/constants/services-names.constants';
import { SaleItemMapper } from './mappers/sale-item.mapper';
import { FrontReadSaleItem } from './dto/create-sale-items.dto';

@Injectable()
export class SaleItemsService {
  constructor(private readonly saleItemsRepository: SaleItemsRepository) {}

  async findAll(saleId?: string): Promise<ServiceResult<FrontReadSaleItem[]>> {
    const crud_result = await this.saleItemsRepository.findAll(saleId);
    if (crud_result.isError) {
      return crud_result.toServiceError(
        SERVICE_NAMES_MAPPING.SALE_ITEMS_SERVICE,
      );
    }
    const itemsToFront = SaleItemMapper.toFrontList(crud_result.data as any[]);
    return ServiceResult.success_service(
      itemsToFront,
      crud_result.statusCode,
      SERVICE_NAMES_MAPPING.SALE_ITEMS_SERVICE,
    );
  }

  async findOne(id: string): Promise<ServiceResult<FrontReadSaleItem>> {
    const crud_result = await this.saleItemsRepository.findById(id);
    if (crud_result.isError) {
      return crud_result.toServiceError(
        SERVICE_NAMES_MAPPING.SALE_ITEMS_SERVICE,
      );
    }
    const itemToFront = SaleItemMapper.toFront(crud_result.data as any);
    return ServiceResult.success_service(
      itemToFront,
      crud_result.statusCode,
      SERVICE_NAMES_MAPPING.SALE_ITEMS_SERVICE,
    );
  }
}
