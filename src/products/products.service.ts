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
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedData } from 'src/common/types/paginated.data';
import { ADMIN_SCOPE } from 'src/common/constants/global.constants';
import { UUID } from 'crypto';
import { UpdateProductDto } from './dto/update-products.dto';
import { SERVICE_NAMES_MAPPING } from 'src/common/constants/services-names.constants';

const PRODUCT_LIST_CACHE_ID: string = 'products:list';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductsRepository,
    private readonly redis: RedisCacheService,
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

    if (repo_product.isError) {
      return ServiceResult.error_service(
        repo_product.error,
        repo_product.statusCode,
        SERVICE_NAMES_MAPPING.PRODUCT_SERVICE,
      );
    }

    // Si pas d'erreur je retourne alors les données bien mappées ensuite je met les donnée
    //dans le cache pour eviter beaucoup de request vers le BD pour la même chose et optimise
    // le temps d'accès
    try {
      const productToFront = ProductMapper.toFront(repo_product.data);
      const cache_key: string = CacheKeyFactory.create(
        CacheDomain.PRODUCT,
        repo_product.data.id,
      );
      await this.redis.set(
        cache_key,
        productToFront,
        CacheDuration.ONE_HOUR.valueOf(),
      ); //Le produit restera en cache pendant 1h

      //Invalidation
      await this.redis.delete(
        CacheKeyFactory.create(CacheDomain.PRODUCT, PRODUCT_LIST_CACHE_ID),
      );
      await this.redis.delete(
        CacheKeyFactory.create(
          CacheDomain.PRODUCT,
          `${PRODUCT_LIST_CACHE_ID}:admin`,
        ),
      );
      return ServiceResult.success_service(
        productToFront,
        repo_product.statusCode,
      );
    } catch (error) {
      console.error('Erreur lors de la mise en cache du produit', error);
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          'Erreur lors de la mise en cache du produit',
        ),
        500,
        SERVICE_NAMES_MAPPING.PRODUCT_SERVICE,
      );
    }
  }

  async servicegetAllProducts(
    pagination?: PaginationDto,
    admin?: string,
  ): Promise<ServiceResult<PaginatedData<FrontReadProduct>>> {
    const cache_id =
      admin === ADMIN_SCOPE
        ? `${PRODUCT_LIST_CACHE_ID}:admin`
        : PRODUCT_LIST_CACHE_ID;
    const list_cache_key = CacheKeyFactory.create(
      CacheDomain.PRODUCT,
      cache_id,
    );

    const cache_data =
      await this.redis.get<PaginatedData<FrontReadProduct>>(list_cache_key);

    if (cache_data !== null) {
      return ServiceResult.success_service(cache_data, 200);
    }

    const products = await this.productRepository.getAllProducts(
      pagination,
      admin,
    );

    if (products.isError) {
      console.error(
        'Erreur dans SERVICE PRODUCT: fn servicegetAllProducts',
        products.error,
      );
      return ServiceResult.error_service(
        products.error,
        products.statusCode,
        SERVICE_NAMES_MAPPING.PRODUCT_SERVICE,
      );
    }

    try {
      const frontProducts = products.data.data.map((product) =>
        ProductMapper.toFront(product),
      );
      const paginatedDataToFront: PaginatedData<FrontReadProduct> = {
        data: frontProducts,
        meta: products.data.meta,
      };
      await this.redis.set(
        list_cache_key,
        paginatedDataToFront,
        CacheDuration.ONE_HOUR.valueOf(),
      );
      //Invalidation
      await this.redis.delete(
        CacheKeyFactory.create(CacheDomain.PRODUCT, PRODUCT_LIST_CACHE_ID),
      );
      await this.redis.delete(
        CacheKeyFactory.create(
          CacheDomain.PRODUCT,
          `${PRODUCT_LIST_CACHE_ID}:admin`,
        ),
      );
      return ServiceResult.success_service(
        paginatedDataToFront,
        products.statusCode,
      );
    } catch (error) {
      console.error('Erreur lors de la transformation des produits', error);
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          'Erreur interne ou erreur de conversion des données',
        ),
        500,
        SERVICE_NAMES_MAPPING.PRODUCT_SERVICE,
      );
    }
  }

  //fonction service get product by id
  async serviceGetProductById(
    id: UUID,
  ): Promise<ServiceResult<FrontReadProduct>> {
    const cache_key = CacheKeyFactory.create(CacheDomain.PRODUCT, id);

    const cache_product = await this.redis.get<FrontReadProduct>(cache_key);

    if (cache_product !== null) {
      return ServiceResult.success_service(cache_product, 200);
    }

    const repo_product = await this.productRepository.getProductById(id);

    if (repo_product.isError) {
      console.error(
        'Erreur dans SERVICE PRODUCT: fn serviceGetProductById',
        repo_product.error,
      );
      return ServiceResult.error_service(
        repo_product.error,
        repo_product.statusCode,
        SERVICE_NAMES_MAPPING.PRODUCT_SERVICE,
      );
    }

    try {
      const productToFront = ProductMapper.toFront(repo_product.data);
      await this.redis.set(
        cache_key,
        productToFront,
        CacheDuration.ONE_HOUR.valueOf(),
      );
      //Invalidation
      await this.redis.delete(
        CacheKeyFactory.create(CacheDomain.PRODUCT, PRODUCT_LIST_CACHE_ID),
      );
      await this.redis.delete(
        CacheKeyFactory.create(
          CacheDomain.PRODUCT,
          `${PRODUCT_LIST_CACHE_ID}:admin`,
        ),
      );

      return ServiceResult.success_service(
        productToFront,
        repo_product.statusCode,
      );
    } catch (error) {
      console.error('Erreur lors de la mise en cache du produit', error);
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          'Erreur lors de la mise en cache du produit',
        ),
        500,
        SERVICE_NAMES_MAPPING.PRODUCT_SERVICE,
      );
    }
  }

  // fonction service update product
  async serviceUpdateProduct(
    id: UUID,
    updateProductDto: UpdateProductDto,
  ): Promise<ServiceResult<FrontReadProduct>> {
    const repo_product = await this.productRepository.updateProduct(
      id,
      updateProductDto,
    );

    if (repo_product.isError) {
      console.error(
        'Erreur dans SERVICE PRODUCT: fn serviceUpdateProduct',
        repo_product.error,
      );
      return ServiceResult.error_service(
        repo_product.error,
        repo_product.statusCode,
        SERVICE_NAMES_MAPPING.PRODUCT_SERVICE,
      );
    }

    try {
      const productToFront = ProductMapper.toFront(repo_product.data);
      const cache_key = CacheKeyFactory.create(CacheDomain.PRODUCT, id);

      await this.redis.set(
        cache_key,
        productToFront,
        CacheDuration.ONE_HOUR.valueOf(),
      );
      //Invalidation
      await this.redis.delete(
        CacheKeyFactory.create(CacheDomain.PRODUCT, PRODUCT_LIST_CACHE_ID),
      );
      await this.redis.delete(
        CacheKeyFactory.create(
          CacheDomain.PRODUCT,
          `${PRODUCT_LIST_CACHE_ID}:admin`,
        ),
      );
      return ServiceResult.success_service(
        productToFront,
        repo_product.statusCode,
      );
    } catch (error) {
      console.error('Erreur lors de la mise en cache du produit', error);
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          'Erreur lors de la mise en cache du produit',
        ),
        500,
        SERVICE_NAMES_MAPPING.PRODUCT_SERVICE,
      );
    }
  }

  async serviceDeleteProduct(id: UUID): Promise<ServiceResult<string>> {
    try {
      const repo_result = await this.productRepository.deleteProduct(id);
      if (repo_result.isError) {
        return ServiceResult.error_service(
          repo_result.error,
          repo_result.statusCode,
          SERVICE_NAMES_MAPPING.PRODUCT_SERVICE,
        );
      }

      //invalidation du cache
      const product_cache_key = CacheKeyFactory.create(CacheDomain.PRODUCT, id);
      await this.redis.delete(product_cache_key);
      await this.redis.delete(
        CacheKeyFactory.create(CacheDomain.PRODUCT, PRODUCT_LIST_CACHE_ID),
      );
      await this.redis.delete(
        CacheKeyFactory.create(
          CacheDomain.PRODUCT,
          `${PRODUCT_LIST_CACHE_ID}:admin`,
        ),
      );

      return ServiceResult.success_service(
        repo_result.data,
        repo_result.statusCode,
      );
    } catch (error) {
      console.error('Erreur lors de la suppression du produit', error);
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          'Erreur lors de la suppression du produit',
        ),
        500,
        SERVICE_NAMES_MAPPING.PRODUCT_SERVICE,
      );
    }
  }
}
