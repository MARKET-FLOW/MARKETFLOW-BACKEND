/* eslint-disable prettier/prettier */
import { Prisma } from "@prisma/client";

export enum CategoryMessages {
  CATEGORY_NOT_FOUND = "Catégorie non trouvée",
  CATEGORY_DELETED = "Catégorie supprimée avec succès",
  EMPTY_LIST = "Aucune catégorie trouvée",
}

export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: { 
    store: true;
    parent: true;
    children: true;
  };
}>;