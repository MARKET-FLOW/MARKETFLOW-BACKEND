import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CRUDResult } from '../common/types/crud.result';
import { Store } from '@prisma/client';
import { CreateStoreDto } from './dto/create-stores.dto';
import { handleProjectErrors } from '../common/errors-handlers/generic-error.handler';
import { UUID } from 'crypto';
import { ErrorMessage } from '../common/types/error.message';
import { ErrorType } from '../common/types/error-type.enum';
import { UpdateStoreDto } from './dto/update-stores.dto';

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

  async findStoreById(storeId: UUID): Promise<CRUDResult<Store>> {
    try {
      const store = await this.prismaService.store.findUnique({
        where: {
          id: storeId,
          deletedAt: null,
        },
      });

      if (store === null) {
        return CRUDResult.crud_error(
          new ErrorMessage(ErrorType.NOT_FOUND, 'Store inexistant'),
        );
      }
      return CRUDResult.crud_success(store);
    } catch (error) {
      return handleProjectErrors<Store>(error);
    }
  }

  async updateStore(
    storeId: UUID,
    updateData: UpdateStoreDto,
  ): Promise<CRUDResult<Store>> {
    try {
      const storeExists = await this.findStoreById(storeId);

      // 404 ici si le magasin n'existe pas ou est delet
      if (storeExists.isError) return storeExists;

      const updatedStore = await this.prismaService.store.update({
        where: {
          id: storeId,
        },
        data: {
          name: updateData.name,
          address: updateData.address,
          phone: updateData.phone,
          settings: {
            ...updateData.settings,
          },
        },
      });

      return CRUDResult.crud_success(updatedStore, 200);
    } catch (error) {
      return handleProjectErrors<Store>(error);
    }
  }

  async deleteStore(storeId: UUID): Promise<CRUDResult<Store>> {
    try {
      const storeExists = await this.findStoreById(storeId);

      // 404 ici si le magasin n'existe pas ou est delet
      if (storeExists.isError) return CRUDResult.crud_error(storeExists.error);

      await this.prismaService.store.update({
        where: {
          id: storeId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return CRUDResult.crud_success(storeExists.data, 200);
    } catch (error) {
      return handleProjectErrors<Store>(error);
    }
  }
}
