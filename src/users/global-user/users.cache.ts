import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import { FrontReadUser } from '../dto/create-user.dto';
import { CacheKeyFactory } from '../../common/cache/cache-key.factory';
import { CacheDomain } from '../../common/cache/enum.cache.domain';
import { CacheDuration } from '../../common/cache/cache.duration.enum';
import { ADMIN_SCOPE } from '../../common/constants/global.constants';

@Injectable()
export class UsersCache {
  private readonly USERS_LIST_CACHE_ID = 'users:list';

  constructor(private readonly redis: RedisCacheService) {}

  private getUserKey(userId: string): string {
    return CacheKeyFactory.create(CacheDomain.USER, userId);
  }

  private getUserListKey(adminScope?: string): string {
    const cache_id =
      adminScope === ADMIN_SCOPE
        ? `${this.USERS_LIST_CACHE_ID}:admin`
        : this.USERS_LIST_CACHE_ID;
    return CacheKeyFactory.create(CacheDomain.USER, cache_id);
  }

  /**
   * Ajoute un utilisateur au cache.
   */
  async setUserToCache(userData: FrontReadUser): Promise<void> {
    try {
      const key = this.getUserKey(userData.id);
      await this.redis.set(key, userData, CacheDuration.ONE_HOUR);
    } catch (error) {
      console.error('[UsersCache.setUserToCache] ERREUR: ', error);
    }
  }

  /**
   * Récupérer un utilisateur du cache.
   */
  async getUserFromCache(userId: string): Promise<FrontReadUser | null> {
    try {
      const key = this.getUserKey(userId);
      return await this.redis.get<FrontReadUser>(key);
    } catch (error) {
      console.error('[UsersCache.getUserFromCache] ERREUR: ', error);
      return null;
    }
  }

  /**
   * Récupérer la liste des utilisateurs du cache (admin ou standard).
   */
  async getUserListFromCache(
    adminScope?: string,
  ): Promise<FrontReadUser[] | null> {
    try {
      const key = this.getUserListKey(adminScope);
      return await this.redis.get<FrontReadUser[]>(key);
    } catch (error) {
      console.error('[UsersCache.getUserListFromCache] ERREUR: ', error);
      return null;
    }
  }

  /**
   * Ajouter une liste d'utilisateurs au cache.
   */
  async setUserListToCache( userList: FrontReadUser[], adminScope?: string, ): Promise<void> {
    try {
      const key = this.getUserListKey(adminScope);
      await this.redis.set(key, userList, CacheDuration.ONE_HOUR);
    } catch (error) {
      console.error('[UsersCache.setUserListToCache] ERREUR: ', error);
    }
  }

  /**
   * Supprimer un utilisateur du cache.
   */
  async deleteUserFromCache(userId: string): Promise<void> {
    try {
      const key = this.getUserKey(userId);
      await this.redis.delete(key);
    } catch (error) {
      console.error('[UsersCache.deleteUserFromCache] ERREUR: ', error);
    }
  }

  /**
   * Invalider les caches de listes d'utilisateurs (standard et admin).
   */
  async invalidateUserListCache(): Promise<void> {
    try {
      const listKey = CacheKeyFactory.create(
        CacheDomain.USER,
        this.USERS_LIST_CACHE_ID,
      );
      const adminListKey = CacheKeyFactory.create(
        CacheDomain.USER,
        `${this.USERS_LIST_CACHE_ID}:admin`,
      );
      await this.redis.delete(listKey);
      await this.redis.delete(adminListKey);
    } catch (error) {
      console.error('[UsersCache.invalidateUserListCache] ERREUR: ', error);
    }
  }
}
