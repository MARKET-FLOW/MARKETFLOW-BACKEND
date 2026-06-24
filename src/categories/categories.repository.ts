import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; 
import { CRUDResult } from 'src/common/types/crud.result'; 
import { ErrorMessage } from 'src/common/types/error.message';
import { ErrorType } from 'src/common/types/error-type.enum';
import { ADMIN_SCOPE } from 'src/common/constants/global.constants';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { Category } from '@prisma/client';
import { UUID } from 'node:crypto';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(dto: CreateCategoriesDto): Promise<CRUDResult<Category>> {
    try {
      const category = await this.prisma.category.create({
        data: {
          name: dto.name,
          storeId: dto.storeId,
          parentId: dto.parentId || null,
        },
      });
      return CRUDResult.crud_success(category, 201);
    } catch (error) {
      return CRUDResult.crud_error(
        new ErrorMessage(ErrorType.INTERNAL_SERVER_ERROR, 'Impossible de créer la catégorie'),
        500,
      );
    }
  }

  async getAllCategories(admin?: string): Promise<CRUDResult<Category[]>> {
    try {
      const whereCondition = admin === ADMIN_SCOPE ? {} : { deletedAt: null };
      const categories = await this.prisma.category.findMany({
        where: whereCondition,
        include: { parent: true },
        orderBy: { createdAt: 'desc' },
      });

      if (!categories || categories.length === 0) {
        return CRUDResult.crud_error(
          new ErrorMessage(ErrorType.EMPTY_LIST, 'Aucune catégorie trouvée'),
          404,
        );
      }
      return CRUDResult.crud_success(categories, 200);
    } catch (error) {
      return CRUDResult.crud_error(
        new ErrorMessage(ErrorType.INTERNAL_SERVER_ERROR, 'Erreur lors de la récupération'),
        500,
      );
    }
  }

  async getCategoryByID(id: UUID): Promise<CRUDResult<Category>> {
    try {
      const category = await this.prisma.category.findFirst({
        where: { id, deletedAt: null },
        include: { parent: true },
      });

      if (!category) {
        return CRUDResult.crud_error(
          new ErrorMessage(ErrorType.NOT_FOUND, 'Catégorie non trouvée'),
          404,
        );
      }
      return CRUDResult.crud_success(category, 200);
    } catch (error) {
      return CRUDResult.crud_error(
        new ErrorMessage(ErrorType.INTERNAL_SERVER_ERROR, 'Erreur lors de la recherche'),
        500,
      );
    }
  }

  async updateCategory(id: UUID, dto: UpdateCategoriesDto): Promise<CRUDResult<Category>> {
    try {
      const updated = await this.prisma.category.update({
        where: { id },
        data: {
          name: dto.name,
          storeId: dto.storeId,
          parentId: dto.parentId || null,
          updatedAt: new Date(),
        },
      });
      return CRUDResult.crud_success(updated, 200);
    } catch (error) {
      return CRUDResult.crud_error(
        new ErrorMessage(ErrorType.INTERNAL_SERVER_ERROR, 'Modification impossible'),
        500,
      );
    }
  }

  async deleteCategory(id: UUID): Promise<CRUDResult<string>> {
    try {
      await this.prisma.category.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return CRUDResult.crud_success('Catégorie supprimée avec succès', 200);
    } catch (error) {
      return CRUDResult.crud_error(
        new ErrorMessage(ErrorType.INTERNAL_SERVER_ERROR, 'Suppression impossible'),
        500,
      );
    }
  }
}