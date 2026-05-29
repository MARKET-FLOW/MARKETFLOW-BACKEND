import { Store } from '@prisma/client';
import { FrontReadStore } from '../dto/front-read-store.dto';
import { plainToInstance } from 'class-transformer';

export class StoreMapper {
  /**
   * Mapper qui transforme un objet Store (de la base de données) en un objet FrontReadStore (DTO pour le front-end).
   * @param initialStoreObject - L'objet Store à transformer.
   * @returns Un objet FrontReadStore avec uniquement les propriétés exposées (@Expose()).
   */
  static toFrontReadStore(initialStoreObject: Store): FrontReadStore {
    return plainToInstance(FrontReadStore, initialStoreObject, {
      excludeExtraneousValues: true, // On retire out ce qui n'est pas @Expose()
    });
  }
}
