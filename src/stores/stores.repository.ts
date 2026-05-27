import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CRUDResult } from '../common/types/crud.result';
import { Store } from '@prisma/client';
import { CreateStoreDto } from './dto/create-stores.dto';
import { handleProjectErrors } from '../common/errors-handlers/generic-error.handler';

@Injectable()
export class StoresRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createStore(storeDto: CreateStoreDto): Promise<CRUDResult<Store>> {
    try {
      const createdStore = await this.prismaService.store.create({
        data: {
          name: storeDto.name,
          address: storeDto.address,
          phone: storeDto.phone,
          settings: {
            ...storeDto.settings,
          },
        },
      });

      return CRUDResult.crud_success(createdStore, 201);
    } catch (error) {
      return handleProjectErrors<Store>(error);
    }
  }

  async findAllStores(): Promise<CRUDResult<Store[]>> {
    try {
      const stores = await this.prismaService.store.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return CRUDResult.crud_success(stores, 200);
    } catch (error) {
      return handleProjectErrors<Store[]>(error);
    }
  }
}
