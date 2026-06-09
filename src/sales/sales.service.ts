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
