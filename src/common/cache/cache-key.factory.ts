import { CacheDomain } from './enum.cache.domain';

export class CacheKeyFactory {
  private static readonly PREFIX = 'MARKETFLOW';

  /**
   * Génère une clé uniforme.
   * Exemple: MARKETFLOW:STORE:123
   */
  static create(domain: CacheDomain, id: string | number): string {
    return `${this.PREFIX}:${domain}:${id}`;
  }

  /**
   * Pour les listes ou les recherches complexes.
   * Exemple: MARKETFLOW:PRODUCT:LIST:STORE_45
   */
  static createList(domain: CacheDomain, suffix: string): string {
    return `${this.PREFIX}:${domain}:LIST:${suffix}`;
  }
}
