/* eslint-disable prettier/prettier */
import { plainToInstance } from 'class-transformer';
import { FrontReadCategory } from '../dto/create-categories.dto';
import { CategoryWithRelations } from '../global-category/category.message';

// Classe responsable de la transformation des données de la BD vers le modèle front
export class CategoryMapper {

  // Convertit une seule catégorie vers le modèle front
  static toFront(category: CategoryWithRelations): FrontReadCategory {
    return plainToInstance(FrontReadCategory, category, {
      excludeExtraneousValues: true,
    });
  }

  // Convertit une liste de catégories vers le modèle front
  static toFrontList(categories: CategoryWithRelations[]): FrontReadCategory[] {
    return categories.map((category) => CategoryMapper.toFront(category));
  }
}
