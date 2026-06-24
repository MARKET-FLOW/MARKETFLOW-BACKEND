import { Category } from '@prisma/client';
import { FrontReadCategory } from '../dto/read-categories.dto';

export class CategoriesMapper {
  static toFront(category: Category & { parent?: Category | null }): FrontReadCategory {
    return {
      id: category.id,
      storeId: category.storeId,
      name: category.name,
      parentId: category.parentId,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      parent: category.parent ? CategoriesMapper.toFront(category.parent) : null,
    };
  }
}