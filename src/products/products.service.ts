/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateProductDto, FrontReadProduct } from './dto/create-products.dto';
//import { UpdateProductDto } from './dto/update-products.dto';
import { ProductsRepository } from './products.repository';
import { ServiceResult } from 'src/common/types/service.result';
import { ProductMapper } from './mappers/product.mapper';
import { CacheKeyFactory } from 'src/common/cache/cache-key.factory';
import { CacheDomain } from 'src/common/cache/enum.cache.domain';
import { RedisCacheService } from 'src/common/cache/redis-cache.service';
import { CacheDuration } from 'src/common/cache/cache.duration.enum';
import { ErrorMessage } from 'src/common/types/error.message';
import { ErrorType } from 'src/common/types/error-type.enum';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductsRepository,
    private readonly redis: RedisCacheService
  ) {}

  async serviceCreate(
    createProductDto: CreateProductDto,
  ): Promise<ServiceResult<FrontReadProduct>> {
    const { storeId, categoryId, createdBy, ...rest } = createProductDto;
    const repo_product = await this.productRepository.createProduct({
      ...rest,
      store: {
        connect: { id: storeId },
      },
      creator: {
        connect: { id: createdBy },
      },
      ...(categoryId && {
        category: { connect: { id: categoryId } },
      }),
    });

    if(repo_product.isError) {
      return ServiceResult.error_service(
        repo_product.error,
        repo_product.statusCode,
        "SERVICE PRODUCT"
      )
    }

    // Si pas d'erreur je retourne alors les données bien mappées ensuite je met les donnée
    //dans le cache pour eviter beaucoup de request vers le BD pour la même chose et optimise
    // le temps d'accès
    try{
        const productToFront = ProductMapper.toFront(repo_product.data);
        const cache_key: string = CacheKeyFactory.create(CacheDomain.PRODUCT, repo_product.data.id);
        await this.redis.set(cache_key, productToFront, CacheDuration.USER_DURATION.valueOf()); //Le produit restera en cache pendant 1h
        return ServiceResult.success_service(
          productToFront,
          repo_product.statusCode
        )
    }catch(error){
      console.error("Erreur lors de la mise en cache du produit", error)
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          "Erreur lors de la mise en cache du produit"
        ),
        500,
        "SERVICE PRODUCT"
      )
    }
  }

  /*findAll() {
    return this.productRepository.getAllProducts();
  }

  findOne(id: string) {
    return this.productRepository.findOne(id);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  remove(id: string) {
    return this.productRepository.remove(id);
  }*/
}
