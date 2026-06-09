import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sales.dto';
import { UpdateSaleDto } from './dto/update-sales.dto';
import { CRUDResult } from 'src/common/types/crud.result';
import { Sale } from '@prisma/client';
import { handleProjectErrors } from 'src/common/errors-handlers/generic-error.handler';

@Injectable()
export class SalesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Enregistrer une nouvelle vente avec transaction atomique complète
  async createSale(dto: CreateSaleDto): Promise<CRUDResult<Sale>> {
    try {
      const sale = await this.prisma.$transaction(async (tx) => {
        // 1. Vérifier l'existence d'une session de caisse active
        const activeSession = await tx.cashSession.findFirst({
          where: {
            id: dto.cashSessionId,
            cashierId: dto.cashierId,
            storeId: dto.storeId,
            status: 'OPEN',
            deletedAt: null,
          },
        });
        if (!activeSession) {
          throw new BadRequestException(
            'Aucune session de caisse ouverte pour ce caissier sur ce magasin.',
          );
        }

        // 2. Valider les stocks et préparer le snapshot (sans écriture)
        const saleItemsData: {
          storeId: string;
          productId: string;
          productName: string;
          quantity: number;
          unitPrice: number;
          taxRate: number;
          subtotal: number;
        }[] = [];

        const stockUpdates: {
          productId: string;
          quantity: number;
          quantityBefore: number;
          quantityAfter: number;
        }[] = [];

        for (const item of dto.items) {
          const product = await tx.product.findFirst({
            where: {
              id: item.productId,
              storeId: dto.storeId,
              deletedAt: null,
            },
          });

          if (!product) {
            throw new NotFoundException(
              `Produit introuvable dans ce magasin (ID: ${item.productId})`,
            );
          }

          if (product.stockQuantity < item.quantity) {
            throw new BadRequestException(
              `Stock insuffisant pour "${product.name}" (Disponible: ${product.stockQuantity})`,
            );
          }

          // Décrémentation atomique du stock
          await tx.product.update({
            where: { id: product.id },
            data: { stockQuantity: { decrement: item.quantity } },
          });

          // Préparer le snapshot figé
          saleItemsData.push({
            storeId: dto.storeId,
            productId: product.id,
            productName: product.name,
            quantity: item.quantity,
            unitPrice: Number(product.sellingPrice),
            taxRate: Number(product.taxRate),
            subtotal: Number(product.sellingPrice) * item.quantity,
          });

          // Mémoriser les données pour les mouvements de stock
          stockUpdates.push({
            productId: product.id,
            quantity: item.quantity,
            quantityBefore: product.stockQuantity,
            quantityAfter: product.stockQuantity - item.quantity,
          });
        }

        // 3. Créer la vente avec ses lignes imbriquées
        const createdSale = await tx.sale.create({
          data: {
            storeId: dto.storeId,
            saleNumber: dto.saleNumber,
            cashierId: dto.cashierId,
            cashSessionId: activeSession.id,
            totalAmount: dto.totalAmount,
            taxAmount: dto.taxAmount,
            discountAmount: dto.discountAmount ?? 0,
            paymentMethod: dto.paymentMethod,
            amountPaid: dto.amountPaid,
            changeAmount: dto.changeAmount,
            status: dto.status,
            origin: dto.origin ?? 'POS',
            mobileDeviceId: dto.mobileDeviceId ?? null,
            saleItems: {
              createMany: { data: saleItemsData },
            },
          },
        });

        // 4. Tracer les mouvements de stock avec (saleId)
        for (const movement of stockUpdates) {
          await tx.stockMovement.create({
            data: {
              storeId: dto.storeId,
              productId: movement.productId,
              userId: dto.cashierId,
              referenceId: createdSale.id,
              movementType: 'OUT',
              quantity: movement.quantity,
              quantityBefore: movement.quantityBefore,
              quantityAfter: movement.quantityAfter,
              reason: `Vente ${dto.saleNumber}`,
            },
          });
        }

        return createdSale;
      });

      return CRUDResult.crud_success(sale, 201);
    } catch (error) {
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
        throw new NotFoundException(
          `La vente spécifiée avec l'ID "${id}" est introuvable`,
        );
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
