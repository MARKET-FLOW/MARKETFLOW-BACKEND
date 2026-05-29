import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../common/cache/redis-cache.service';
import { FrontReadStore } from './dto/front-read-store.dto';
import { CacheKeyFactory } from '../common/cache/cache-key.factory';
import { CacheDomain } from '../common/cache/enum.cache.domain';
import { CacheDuration } from '../common/cache/cache.duration.enum';

@Injectable()
export default class StoresCache {
  constructor(private readonly redis: RedisCacheService) {}

  private getStoreKey(storeId: string): string {
    return CacheKeyFactory.create(CacheDomain.STORE, storeId);
  }

  private getStoreListKey(): string {
    return CacheKeyFactory.createList(CacheDomain.STORE, 'ALL');
  }

  /**
   * Ajoute un magasin au cache.
   * @param storeData Les données du magasin à ajouter au cache, de type FrontReadStore.
   * @return void. Cette méthode ne retourne rien, mais elle gère les erreurs en les enregistrant dans la console.
   * @throws Cette méthode ne lance pas d'erreurs, mais elle capture et enregistre toute erreur qui pourrait survenir lors de l'ajout du magasin au cache.
   */
  async setStoreToCache(storeData: FrontReadStore): Promise<void> {
    try {
      const key = this.getStoreKey(storeData.id);
      await this.redis.set(key, storeData, CacheDuration.ONE_HOUR);
      await this.invalidateStoreListCache();
    } catch (error) {
      console.error(
        "[StoresCache.setStoreToCache] ERREUR lors de l'ajout du magasin au cache: ",
        error,
      );
    }
  }

  /**
   * Récupère la liste des magasins depuis le cache.
   * @return Un tableau d'objets de type FrontReadStore si la liste est trouvée dans le cache, ou null si la liste n'est pas présente dans le cache ou en cas d'erreur lors de la récupération.
   * @throws Cette méthode ne lance pas d'erreurs, mais elle capture et enregistre toute erreur qui pourrait survenir lors de la récupération de la liste des magasins depuis le cache.
   */
  async getStoreListFromCache(): Promise<FrontReadStore[] | null> {
    try {
      const key = this.getStoreListKey();
      const cachedData = await this.redis.get<FrontReadStore[]>(key);
      return cachedData;
    } catch (error) {
      console.error(
        '[StoresCache.getStoreListFromCache] ERREUR lors de la récupération de la liste des magasins depuis le cache: ',
        error,
      );
      return null;
    }
  }

  /**
   * Ajoute une liste de magasins au cache.
   * @param storeList La liste des magasins à ajouter au cache, de type FrontReadStore[].
   * @return void. Cette méthode ne retourne rien, mais elle gère les erreurs en les enregistrant dans la console.
   * @throws Cette méthode ne lance pas d'erreurs, mais elle capture et enregistre toute erreur qui pourrait survenir lors de l'ajout de la liste des magasins au cache.
   */
  async setStoreListToCache(storeList: FrontReadStore[]): Promise<void> {
    try {
      const key = this.getStoreListKey();
      await this.redis.set(key, storeList, CacheDuration.ONE_HOUR);
    } catch (error) {
      console.error(
        "[StoresCache.setStoreListToCache] ERREUR lors de l'ajout de la liste des magasins au cache: ",
        error,
      );
    }
  }

  /**
   * Récupère un magasin du cache en utilisant son ID. Cette méthode est appelée lors de la récupération d'un magasin pour vérifier si les données sont déjà présentes dans le cache avant de faire une requête à la base de données. Si le magasin est trouvé dans le cache, il est retourné directement, sinon la méthode retourne null pour indiquer que les données doivent être récupérées depuis la base de données.
   * @param storeId L'ID du magasin à récupérer du cache, de type string.
   * @return Un objet de type FrontReadStore si le magasin est trouvé dans le cache, ou null si le magasin n'est pas présent dans le cache ou en cas d'erreur lors de la récupération.
   * @throws Cette méthode ne lance pas d'erreurs, mais elle capture et enregistre toute erreur qui pourrait survenir lors de la récupération du magasin du cache.
   */
  async getStoreFromCache(storeId: string): Promise<FrontReadStore | null> {
    try {
      const key = this.getStoreKey(storeId);
      const cachedData = await this.redis.get<FrontReadStore>(key);
      return cachedData;
    } catch (error) {
      console.error(
        '[StoresCache.getStoreFromCache] ERREUR lors de la récupération du magasin depuis le cache: ',
        error,
      );
      return null;
    }
  }

  /**
   * Supprime un magasin du cache en utilisant son ID. Cette méthode est appelée après la suppression d'un magasin pour garantir que les données obsolètes ne sont pas servies à partir du cache. Elle supprime également la liste des magasins pour forcer une actualisation lors de la prochaine requête de liste.
   * @param storeId L'ID du magasin à supprimer du cache, de type string.
   * @return void. Cette méthode ne retourne rien, mais elle gère les erreurs en les enregistrant dans la console.
   * @throws Cette méthode ne lance pas d'erreurs, mais elle capture et enregistre toute erreur qui pourrait survenir lors de la suppression du magasin du cache.
   */
  async deleteStoreFromCache(storeId: string): Promise<void> {
    try {
      const key = this.getStoreKey(storeId);
      await this.redis.delete(key);
      await this.invalidateStoreListCache();
    } catch (error) {
      console.error(
        '[StoresCache.deleteStoreFromCache] ERREUR lors de la suppression du magasin du cache: ',
        error,
      );
    }
  }

  async invalidateStoreListCache(): Promise<void> {
    await this.redis.delete(this.getStoreListKey());
  }
}
