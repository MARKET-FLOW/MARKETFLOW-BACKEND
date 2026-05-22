// app/common/cache/redis-cache.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as cacheManager from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: cacheManager.Cache,
  ) {}

  /**
   * Stocke n'importe quel type de donnée.
   * @param key La clé générée par CacheKeyFactory
   * @param value La donnée (string, number, object, array)
   * @param ttl Temps de vie en secondes (optionnel)
   */
  async set(key: string, value: any, ttl?: number): Promise<void> {
    // cache-manager gère la sérialisation automatiquement avec le store Redis
    await this.cacheManager.set(key, value, ttl);
  }

  /**
   * Récupère une donnée et le type automatiquement.
   */
  async get<T>(key: string): Promise<T | null> {
    const data = await this.cacheManager.get<T>(key);
    return data ?? null;
  }

  /**
   * Supprime une clé spécifique.
   */
  async delete(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  /**
   * Supprime plusieurs clés (utile pour invalider une liste)
   */
  async deleteMany(keys: string[]): Promise<void> {
    const promises = keys.map((key) => this.cacheManager.del(key));
    await Promise.all(promises);
  }

  /**
   * Vérifie si une clé existe
   */
  async exists(key: string): Promise<boolean> {
    const data = await this.cacheManager.get(key);
    return data !== undefined && data !== null;
  }
}
