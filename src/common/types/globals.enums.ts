/**
 * Enums applicatifs partagés entre tous les modules.
 * Distinct des enums Prisma (@prisma/client) qui reflètent la base de données.
 */

/** Directions de tri pour les requêtes GET liste */
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

/** Clés de tri communes aux entités */
export enum SortBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  NAME = 'name',
}
