import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import { CacheKeyFactory } from '../../common/cache/cache-key.factory';
import { CacheDomain } from '../../common/cache/enum.cache.domain';
import { CacheDuration } from '../../common/cache/cache.duration.enum';
import { ADMIN_SCOPE } from '../../common/constants/global.constants';
import { FrontReadCategory } from '../dto/read-categories.dto';

@Injectable()
export class CategoriesCache {
  private readonly CATEGORIES_LIST_CACHE_ID = 'categories:list';

  constructor(private readonly redis: RedisCacheService) {}

  private getCategoryKey(categoryId: string): string {
    // Assure-toi que CacheDomain.CATEGORY existe dans ton enum, sinon utilise son équivalent string ou ajoute-le
    return CacheKeyFactory.create(CacheDomain.CATEGORY, categoryId);
  }

  private getCategoryListKey(adminScope?: string): string {
    const cache_id =
      adminScope === ADMIN_SCOPE
        ? `${this.CATEGORIES_LIST_CACHE_ID}:admin`
        : this.CATEGORIES_LIST_CACHE_ID;
    return CacheKeyFactory.create(CacheDomain.CATEGORY, cache_id);
  }

  /**
   * Ajoute une catégorie au cache.
   */
  async setCategoryToCache(categoryData: FrontReadCategory): Promise<void> {
    try {
      const key = this.getCategoryKey(categoryData.id);
      await this.redis.set(key, categoryData, CacheDuration.ONE_HOUR);
    } catch (error) {
      console.error('[CategoriesCache.setCategoryToCache] ERREUR: ', error);
    }
  }

  /**
   * Récupérer une catégorie du cache.
   */
  async getCategoryFromCache(categoryId: string): Promise<FrontReadCategory | null> {
    try {
      const key = this.getCategoryKey(categoryId);
      return await this.redis.get<FrontReadCategory>(key);
    } catch (error) {
      console.error('[CategoriesCache.getCategoryFromCache] ERREUR: ', error);
      return null;
    }
  }

  /**
   * Récupérer la liste des catégories du cache (admin ou standard).
   */
  async getCategoryListFromCache(
    adminScope?: string,
  ): Promise<FrontReadCategory[] | null> {
    try {
      const key = this.getCategoryListKey(adminScope);
      return await this.redis.get<FrontReadCategory[]>(key);
    } catch (error) {
      console.error('[CategoriesCache.getCategoryListFromCache] ERREUR: ', error);
      return null;
    }
  }

  /**
   * Ajouter une liste de catégories au cache.
   */
  async setCategoryListToCache(
    categoryList: FrontReadCategory[],
    adminScope?: string,
  ): Promise<void> {
    try {
      const key = this.getCategoryListKey(adminScope);
      await this.redis.set(key, categoryList, CacheDuration.ONE_HOUR);
    } catch (error) {
      console.error('[CategoriesCache.setCategoryListToCache] ERREUR: ', error);
    }
  }

  /**
   * Supprimer une catégorie du cache.
   */
  async deleteCategoryFromCache(categoryId: string): Promise<void> {
    try {
      const key = this.getCategoryKey(categoryId);
      await this.redis.delete(key);
    } catch (error) {
      console.error('[CategoriesCache.deleteCategoryFromCache] ERREUR: ', error);
    }
  }

  /**
   * Invalider les caches de listes de catégories (standard et admin).
   */
  async invalidateCategoryListCache(): Promise<void> {
    try {
      const listKey = CacheKeyFactory.create(
        CacheDomain.CATEGORY,
        this.CATEGORIES_LIST_CACHE_ID,
      );
      const adminListKey = CacheKeyFactory.create(
        CacheDomain.CATEGORY,
        `${this.CATEGORIES_LIST_CACHE_ID}:admin`,
      );
      await this.redis.delete(listKey);
      await this.redis.delete(adminListKey);
    } catch (error) {
      console.error('[CategoriesCache.invalidateCategoryListCache] ERREUR: ', error);
    }
  }
}