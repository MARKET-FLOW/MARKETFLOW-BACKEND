import { Injectable } from '@nestjs/common';
import { UUID } from 'node:crypto';
import { SERVICE_NAMES_MAPPING } from '../common/constants/services-names.constants';
import { ErrorType } from '../common/types/error-type.enum';
import { ErrorMessage } from '../common/types/error.message';
import { ServiceResult } from '../common/types/service.result';
import { CreateCategoriesDto } from './dto/create-categories.dto';
import { UpdateCategoriesDto } from './dto/update-categories.dto';
import { FrontReadCategory } from './dto/read-categories.dto';
import { CategoriesCache } from './global-categories/categories.cache';
import { CategoriesMapper } from './mappers/categories.mapper';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly categoriesCache: CategoriesCache,
  ) {}

  async serviceCreate(
    createCategoriesDto: CreateCategoriesDto,
  ): Promise<ServiceResult<FrontReadCategory>> {
    const repo_category = await this.categoriesRepository.createCategory(createCategoriesDto);

    if (repo_category.isError) {
      return ServiceResult.error_service(
        repo_category.error,
        repo_category.statusCode,
        SERVICE_NAMES_MAPPING.CATEGORY_SERVICE,
      );
    }

    try {
      const categoryToFront = CategoriesMapper.toFront(repo_category.data);

      await this.categoriesCache.setCategoryToCache(categoryToFront);
      await this.categoriesCache.invalidateCategoryListCache();

      return ServiceResult.success_service(categoryToFront, repo_category.statusCode);
    } catch (error) {
      console.error("Erreur lors de la mise en cache de la catégorie: ", error);
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          "Erreur lors de la mise en cache de la catégorie",
        ),
        500,
        SERVICE_NAMES_MAPPING.CATEGORY_SERVICE,
      );
    }
  }

  async serviceGetAllCategories(
    admin?: string,
  ): Promise<ServiceResult<FrontReadCategory[]>> {
    const cache_data = await this.categoriesCache.getCategoryListFromCache(admin);

    if (cache_data !== null) {
      return ServiceResult.success_service(cache_data, 200);
    }

    const categories = await this.categoriesRepository.getAllCategories(admin);

    if (categories.isError) {
      console.error('Erreur dans SERVICE CATEGORY: fn serviceGetAllCategories');
      return ServiceResult.error_service(
        categories.error,
        categories.statusCode,
        SERVICE_NAMES_MAPPING.CATEGORY_SERVICE,
      );
    }

    try {
      const frontCategories = categories.data.map((category) => CategoriesMapper.toFront(category));
      await this.categoriesCache.setCategoryListToCache(frontCategories, admin);

      return ServiceResult.success_service(frontCategories, categories.statusCode);
    } catch (error) {
      console.error('Erreur de conversion des données ou de mise en cache: ', error);
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          'Erreur Interne ou erreur de conversion des données',
        ),
        500,
        SERVICE_NAMES_MAPPING.CATEGORY_SERVICE,
      );
    }
  }

  async serviceGetCategoryById(id: UUID): Promise<ServiceResult<FrontReadCategory>> {
    const cacheCategory = await this.categoriesCache.getCategoryFromCache(id);

    if (cacheCategory !== null) {
      return ServiceResult.success_service(cacheCategory, 200);
    }

    const category_repo = await this.categoriesRepository.getCategoryByID(id);

    if (category_repo.isError) {
      return ServiceResult.error_service(
        category_repo.error,
        category_repo.statusCode,
        SERVICE_NAMES_MAPPING.CATEGORY_SERVICE,
      );
    }

    try {
      const frontCategory = CategoriesMapper.toFront(category_repo.data);
      await this.categoriesCache.setCategoryToCache(frontCategory);

      return ServiceResult.success_service(frontCategory, category_repo.statusCode);
    } catch (error) {
      console.error('[categoriesService.serviceGetCategoryById] ==> ERREUR: ', error);
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          'Erreur de validation ou de mise en cache',
        ),
        500,
        SERVICE_NAMES_MAPPING.CATEGORY_SERVICE,
      );
    }
  }

  async serviceUpdateCategory(
    id: UUID,
    updateCategoriesDto: UpdateCategoriesDto,
  ): Promise<ServiceResult<FrontReadCategory>> {
    const category_repo = await this.categoriesRepository.updateCategory(id, updateCategoriesDto);

    if (category_repo.isError) {
      return ServiceResult.error_service(
        category_repo.error,
        category_repo.statusCode,
        SERVICE_NAMES_MAPPING.CATEGORY_SERVICE,
      );
    }

    try {
      const frontCategory = CategoriesMapper.toFront(category_repo.data);
      
      await this.categoriesCache.deleteCategoryFromCache(id);
      await this.categoriesCache.invalidateCategoryListCache();

      return ServiceResult.success_service(frontCategory, category_repo.statusCode);
    } catch (error) {
      console.error('[categoriesService.serviceUpdateCategory] ==> ERREUR: ', error);
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          'Erreur de mise en cache lors de la modification',
        ),
        500,
        SERVICE_NAMES_MAPPING.CATEGORY_SERVICE,
      );
    }
  }

  async serviceDeleteCategory(id: UUID): Promise<ServiceResult<string>> {
    try {
      const repo_result = await this.categoriesRepository.deleteCategory(id);

      if (repo_result.isError) {
        return ServiceResult.error_service(
          repo_result.error,
          repo_result.statusCode,
          SERVICE_NAMES_MAPPING.CATEGORY_SERVICE,
        );
      }

      await this.categoriesCache.deleteCategoryFromCache(id);
      await this.categoriesCache.invalidateCategoryListCache();

      return ServiceResult.success_service(repo_result.data, repo_result.statusCode);
    } catch (error) {
      console.error("Erreur lors de la suppression de la catégorie: ", error);
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          "Erreur lors de la suppression de la catégorie",
        ),
        500,
        SERVICE_NAMES_MAPPING.CATEGORY_SERVICE,
      );
    }
  }
}