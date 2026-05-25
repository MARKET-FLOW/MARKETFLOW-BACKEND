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

  findOne(id: number) {
    return `This action returns a #${id} stores`;
  }

  update(id: number, updateStoreDto: UpdateStoreDto) {
    return `This action updates a #${id} stores`;
  }

  remove(id: number) {
    return `This action removes a #${id} stores`;
  }
}
