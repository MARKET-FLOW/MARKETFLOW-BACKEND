import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sales.dto';
import { UpdateSaleDto } from './dto/update-sales.dto';
import { SalesRepository } from './sales.repository';
import { CRUDResult } from 'src/common/types/crud.result';
import { Sale } from '@prisma/client';

@Injectable()
export class SalesService {
  constructor(private readonly salesRepository: SalesRepository) {}

  // Appelle le repository pour créer une vente
  async create(createSaleDto: CreateSaleDto): Promise<CRUDResult<Sale>> {
    return this.salesRepository.createSale(createSaleDto);
  }

  // Appelle le repository pour récupérer toutes les ventes
  async findAll(storeId?: string): Promise<CRUDResult<Sale[]>> {
    return this.salesRepository.findAllSales(storeId);
  }

  // Appelle le repository pour récupérer une seule vente par son ID
  async findOne(id: string): Promise<CRUDResult<Sale>> {
    return this.salesRepository.findSaleById(id);
  }

  // Appelle le repository pour mettre à jour une vente
  async update(
    id: string,
    updateSaleDto: UpdateSaleDto,
  ): Promise<CRUDResult<Sale>> {
    return this.salesRepository.updateSale(id, updateSaleDto);
  }

  // Appelle le repository pour supprimer une vente
  async remove(id: string): Promise<CRUDResult<Sale>> {
    return this.salesRepository.deleteSale(id);
  }
}
