import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CRUDResult } from 'src/common/types/crud.result';
import { SaleItem } from '@prisma/client';
import { handleProjectErrors } from 'src/common/errors-handlers/generic-error.handler';

@Injectable()
export class SaleItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Récupérer les articles (tous ou filtrés par saleId)
  async findAll(saleId?: string): Promise<CRUDResult<SaleItem[]>> {
    try {
      const items = await this.prisma.saleItem.findMany({
        where: {
          ...(saleId && { saleId }),
          deletedAt: null,
        },
      });
      return CRUDResult.crud_success(items, 200);
    } catch (error) {
      return handleProjectErrors<SaleItem[]>(error);
    }
  }

  // Récupérer un article précis
  async findById(id: string): Promise<CRUDResult<SaleItem>> {
    try {
      const item = await this.prisma.saleItem.findFirst({
        where: {
          id: id,
          deletedAt: null,
        },
      });

      if (!item) {
        throw new NotFoundException(`Article de vente introuvable (ID: ${id})`);
      }

      return CRUDResult.crud_success(item, 200);
    } catch (error) {
      return handleProjectErrors<SaleItem>(error);
    }
  }
}
