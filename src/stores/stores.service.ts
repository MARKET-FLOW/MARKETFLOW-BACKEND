import { Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-stores.dto';
import { UpdateStoreDto } from './dto/update-stores.dto';
import { RedisCacheService } from '../common/cache/redis-cache.service';
import { StoresRepository } from './stores.repository';
import { ServiceResult } from '../common/types/service.result';
import { FrontReadStore } from './dto/front-read-store.dto';
import { SERVICE_NAMES_MAPPING } from '../common/constants/services-names.constants';
import { StoreMapper } from './mappers/store.mapper';

@Injectable()
export class StoresService {
  constructor(
    private readonly storeRepo: StoresRepository,
    private readonly redis: RedisCacheService,
  ) {}

  async serviceCreateStore(
    createStoreDto: CreateStoreDto,
  ): Promise<ServiceResult<FrontReadStore>> {
    const createResult = await this.storeRepo.createStore(createStoreDto);

    if (createResult.isError) {
      return createResult.toServiceError(SERVICE_NAMES_MAPPING.STORE_SERVICE);
    }
    const formattedData = StoreMapper.toFrontReadStore(createResult.data);

    return ServiceResult.success_service(
      formattedData,
      201,
      SERVICE_NAMES_MAPPING.STORE_SERVICE,
    );
  }

  findAll() {
    return `This action returns all stores`;
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
