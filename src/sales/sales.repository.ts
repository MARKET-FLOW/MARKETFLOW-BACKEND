import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sales.dto';
import { UpdateSaleDto } from './dto/update-sales.dto';
import { CRUDResult } from 'src/common/types/crud.result';
import { Sale } from 'prisma/src/generated/prisma';
import { handleProjectErrors } from 'src/common/errors-handlers/generic-error.handler';

@Injectable()
export class SalesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Enregistrer une nouvelle vente en base de données
  async createSale(dto: CreateSaleDto): Promise<CRUDResult<Sale>> {
    try {
      const sale = await this.prisma.sale.create({
        data: {
          storeId: dto.storeId,
          saleNumber: dto.saleNumber,
          cashierId: dto.cashierId,
          cashSessionId: dto.cashSessionId,
          totalAmount: dto.totalAmount,
          taxAmount: dto.taxAmount,
          discountAmount: dto.discountAmount ?? 0,
          paymentMethod: dto.paymentMethod,
          amountPaid: dto.amountPaid,
          changeAmount: dto.changeAmount,
          status: dto.status,
          origin: dto.origin ?? 'POS',
          mobileDeviceId: dto.mobileDeviceId ?? null,
        },
      });
      // Retourne un résultat de succès standard avec un code HTTP 201 
      return CRUDResult.crud_success(sale, 201);
    } catch (error) {
      // Capture et centralise la gestion des erreurs Prisma
      return handleProjectErrors<Sale>(error);
    }
  }

  // Récupérer toutes les ventes actives triées par date
  async findAllSales(storeId?: string): Promise<CRUDResult<Sale[]>> {
    try {
      const sales = await this.prisma.sale.findMany({
        where: {
          storeId: storeId ? storeId : undefined,
          deletedAt: null, // Filtre pour ignorer les ventes en Soft Delete
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return CRUDResult.crud_success(sales, 200);
    } catch (error) {
      return handleProjectErrors<Sale[]>(error);
    }
  }

  // Récupérer une seule vente active par son ID unique
  async findSaleById(id: string): Promise<CRUDResult<Sale>> {
    try {
      const sale = await this.prisma.sale.findFirst({
        where: {
          id: id,
          deletedAt: null, // Vérifie également que la vente n'est pas supprimée logiquement
        },
      });
      // Si la vente n'existe pas ou a été supprimée, on lève une exception 404
      if (!sale) {
        throw new NotFoundException(`La vente spécifiée avec l'ID "${id}" est introuvable`);
      }
      return CRUDResult.crud_success(sale, 200);
    } catch (error) {
      return handleProjectErrors<Sale>(error);
    }
  }

  // Mettre à jour les informations d'une vente existante
  async updateSale(id: string, dto: UpdateSaleDto): Promise<CRUDResult<Sale>> {
    try {
      const sale = await this.prisma.sale.update({
        where: { id: id },
        data: {
          storeId: dto.storeId,
          saleNumber: dto.saleNumber,
          cashierId: dto.cashierId,
          cashSessionId: dto.cashSessionId,
          totalAmount: dto.totalAmount,
          taxAmount: dto.taxAmount,
          discountAmount: dto.discountAmount,
          paymentMethod: dto.paymentMethod,
          amountPaid: dto.amountPaid,
          changeAmount: dto.changeAmount,
          status: dto.status,
          origin: dto.origin,
          mobileDeviceId: dto.mobileDeviceId,
        },
      });
      return CRUDResult.crud_success(sale, 200);
    } catch (error) {
      return handleProjectErrors<Sale>(error);
    }
  }

  // Supprimer logiquement une vente 
  async deleteSale(id: string): Promise<CRUDResult<Sale>> {
    try {
      const sale = await this.prisma.sale.update({
        where: { id: id },
        data: {
          deletedAt: new Date(), // Enregistre la date du jour pour marquer la vente archivée
        },
      });
      return CRUDResult.crud_success(sale, 200);
    } catch (error) {
      return handleProjectErrors<Sale>(error);
    }
  }
}


