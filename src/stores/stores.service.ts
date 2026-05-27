import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-stores.dto';
import { UpdateStoreDto } from './dto/update-stores.dto';
import { RedisCacheService } from '../common/cache/redis-cache.service';
import { StoresRepository } from './stores.repository';
import { ServiceResult } from '../common/types/service.result';
import { FrontReadStore } from './dto/front-read-store.dto';
import { SERVICE_NAMES_MAPPING } from '../common/constants/services-names.constants';
import { StoreMapper } from './mappers/store.mapper';
import { CRUDResult } from '../common/types/crud.result';
import { UUID } from 'crypto';

@Injectable()
export class StoresService {
  constructor(
    private readonly storeRepo: StoresRepository,
    private readonly redis: RedisCacheService,
  ) {}

  /**
   * Helper privé interne pour convertir les erreurs de la couche repository en erreurs de la couche
   * service, en utilisant le mapping des noms de services pour une meilleure traçabilité.
   * @param repoResult Le résultat de type CRUDResult retourné par les méthodes du repository, qui peut contenir une erreur.
   * @returns Un ServiceResult formaté avec l'erreur et le nom du service approprié.
   * @private
   */
  private repoErrorToServiceError(
    repoResult: CRUDResult<any>,
  ): ServiceResult<any> {
    return repoResult.toServiceError(SERVICE_NAMES_MAPPING.STORE_SERVICE);
  }

  /**
   * Service pour créer un nouveau magasin. Il appelle la méthode createStore du repository, gère les erreurs
   * potentielles et formate la réponse avec le mapper approprié.
   * @param createStoreDto Les données nécessaires pour créer un magasin, encapsulées dans un DTO.
   * @returns Un ServiceResult contenant les données du magasin créé formatées pour le front-end, ou
   * une erreur si la création a échoué.
   */
  async serviceCreateStore(
    createStoreDto: CreateStoreDto,
  ): Promise<ServiceResult<FrontReadStore>> {
    const createResult = await this.storeRepo.createStore(createStoreDto);

    if (createResult.isError) {
      return this.repoErrorToServiceError(createResult);
    }

    const formattedData = StoreMapper.toFrontReadStore(createResult.data);

    return ServiceResult.success_service(
      formattedData,
      201,
      SERVICE_NAMES_MAPPING.STORE_SERVICE,
    );
  }

  /**
   * Service pour récupérer tous les magasins. Il appelle la méthode findAllStores du repository, gère les erreurs
   * potentielles et formate la réponse avec le mapper approprié.
   * @returns Un ServiceResult contenant une liste de magasins formatée pour le front-end, ou
   * une erreur si la récupération a échoué.
   */
  async serviceFindAllStores(): Promise<ServiceResult<FrontReadStore[]>> {
    const storesResult = await this.storeRepo.findAllStores();

    if (storesResult.isError) {
      return this.repoErrorToServiceError(storesResult);
    }

    const formattedData = storesResult.data.map((store) =>
      StoreMapper.toFrontReadStore(store),
    );

    return ServiceResult.success_service(
      formattedData,
      200,
      SERVICE_NAMES_MAPPING.STORE_SERVICE,
    );
  }

  /**
   * Service pour récupérer un magasin par son ID. Il appelle la méthode findStoreById du repository, gère les erreurs
   * potentielles et formate la réponse avec le mapper approprié.
   * @param id L'ID du magasin à récupérer, de type UUID.
   * @returns Un ServiceResult contenant les données du magasin formatées pour le front-end, ou
   * une erreur si la récupération a échoué ou si le magasin n'a pas été trouvé.
   */
  async serviceFindStoreById(id: UUID): Promise<ServiceResult<FrontReadStore>> {
    const searchResult = await this.storeRepo.findStoreById(id);

    if (searchResult.isError) {
      return this.repoErrorToServiceError(searchResult);
    }

    const formattedStore = StoreMapper.toFrontReadStore(searchResult.data);

    return ServiceResult.success_service(
      formattedStore,
      200,
      SERVICE_NAMES_MAPPING.STORE_SERVICE,
    );
  }

  /**
   * Service pour mettre à jour un magasin. Il appelle la méthode updateStore du repository, gère les erreurs
   * potentielles et formate la réponse avec le mapper approprié.
   * @param id L'ID du magasin à mettre à jour, de type UUID.
   * @param updateStoreDto Les données de mise à jour du magasin, encapsulées dans un DTO.
   * @returns Un ServiceResult contenant les données du magasin mis à jour formatées pour le front-end, ou
   * une erreur si la mise à jour a échoué.
   */
  async serviceUpdateStore(
    id: UUID,
    updateStoreDto: UpdateStoreDto,
  ): Promise<ServiceResult<FrontReadStore>> {
    const updateResult = await this.storeRepo.updateStore(id, updateStoreDto);

    if (updateResult.isError) {
      return this.repoErrorToServiceError(updateResult);
    }

    const formattedStore = StoreMapper.toFrontReadStore(updateResult.data);

    return ServiceResult.success_service(
      formattedStore,
      200,
      SERVICE_NAMES_MAPPING.STORE_SERVICE,
    );
  }

  /**
   * Service pour supprimer un magasin. Il appelle la méthode deleteStore du repository, gère les erreurs
   * potentielles et formate la réponse avec le mapper approprié.
   * @param id L'ID du magasin à supprimer, de type UUID.
   * @returns Un ServiceResult contenant un message de succès ou une erreur si la suppression a échoué.
   */
  async serviceDeleteStore(id: UUID): Promise<ServiceResult<FrontReadStore>> {
    const deleteResult = await this.storeRepo.deleteStore(id);

    if (deleteResult.isError) {
      return this.repoErrorToServiceError(deleteResult);
    }

    const formattedStore = StoreMapper.toFrontReadStore(deleteResult.data);

    return ServiceResult.success_service(
      formattedStore,
      200,
      SERVICE_NAMES_MAPPING.STORE_SERVICE,
    );
  }
}
