import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Product } from 'prisma/src/generated/prisma';
import { CRUDResult } from 'src/common/types/crud.result';
import { handleProjectErrors } from 'src/common/errors-handlers/generic-error.handler';
import { ADMIN_SCOPE } from 'src/common/constants/global.constants';
import { ErrorMessage } from 'src/common/types/error.message';
import { ErrorType } from 'src/common/types/error-type.enum';
import { PaginationDto } from 'src/products/dto/pagination.dto';
import { PaginatedData } from 'src/common/types/paginated.data';
import { UUID } from 'node:crypto';
@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}
  
//fonction pour créer un produit
  async createProduct(
    createDto: Prisma.ProductCreateInput,
  ): Promise<CRUDResult<Product>> {
    try {
      const createProduct = await this.prisma.product.create({
        data: createDto,
      });

      return CRUDResult.crud_success(createProduct, 201);
    } catch (error) {
      return handleProjectErrors<Product>(error);
    }
  }
  //fonction pour récuperer tout les produits
  async getAllProducts(
    pagination: PaginationDto,
    admin?: string,
  ): Promise<CRUDResult<PaginatedData<Product>>> {
    try {
      const page = pagination.page ?? 1;
      const limit = pagination.limit ?? 10;
      const skip = (page - 1) * limit;
      const where = admin === ADMIN_SCOPE ? {include : {store : true}} : { deletedAt: null };

      const products = await this.prisma.product.findMany({
        skip,
        take: limit,
      });

      const total = await this.prisma.product.count({ where });

      if (products.length === 0) {
        return CRUDResult.crud_error(
          new ErrorMessage(
            ErrorType.EMPTY_LIST,
            'Aucun produit trouvé. Veuillez en créer un',
          ),
          404,
        );
      }
      return CRUDResult.crud_success<PaginatedData<Product>>(
        {
          data: products,
          meta: {
            total,
            page,
            limit,
            totalPage: Math.ceil(total / limit),
          },
        },
        200,
      );
    } catch (error) {
      return handleProjectErrors<PaginatedData<Product>>(error);
    }
  }

  //fonction pour récuperer un produit avec son id
  async getProductById(id: UUID, admin?: string): Promise<CRUDResult<Product>> {
    try {
      let product;
      if(admin === ADMIN_SCOPE){
          product = await this.prisma.product.findUnique({
            where: {
              id: id,
              isActive: true,
              
            },
          });
      }
      else{
        product = await this.prisma.product.findUnique({
          where: {
            id: id,
            isActive: true,
            deletedAt: null,
          }
        });

      }
      if(product === null){
        console.log('[producRepository.getProductById] ==> Produit non trouvé');
        return CRUDResult.crud_error(
          new ErrorMessage(
            ErrorType.NOT_FOUND,
            'Produit non trouvé'
          ),
          404
        );
      }
      return CRUDResult.crud_success(product, 200)
    } catch (error) {
      return handleProjectErrors<Product>(error);
   }
  }


  async update(id: UUID, updateProduct: Prisma.ProductUpdateInput): Promise<CRUDResult<Product>>{
      
    try{
      const existProduct = await this.prisma.product.findUnique({
        where: {
          id: id,
          isActive: true,
          deletedAt: null
        }
      });

      if(existProduct === null){
        console.log('[productRepository.update] ==> Ce produit n\'existe pas');
        return CRUDResult.crud_error(
          new ErrorMessage(
            ErrorType.NOT_FOUND,
            `Ce produit n'existe pas `
          ),
          404
        );
      }
      const updatedProduct =  await this.prisma.product.update({
        where: { id },
        data: updateProduct
      })
      return CRUDResult.crud_success(updatedProduct, 200)


    }catch(error){
      return handleProjectErrors<Product>(error);
    }
  }

  async deleteProduct(id: UUID): Promise<CRUDResult<string>>  {
    /*return this.prisma.product.delete({
      where: { id },
    });*/
    try {
      //soft delete pour simuler la suppression
      await this.prisma.product.update({
        where: { id },
        data: {
          isActive: false,
          deletedAt: new Date(),
        },
      });

      return CRUDResult.crud_success('Produit supprimé avec succès', 200);
    }catch(error){
      return handleProjectErrors<string>(error);
    }
  }
}
