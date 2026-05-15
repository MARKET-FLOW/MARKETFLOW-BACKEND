/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateUserDto, FrontReadUser } from './dto/create-user.dto';
import { ServiceResult } from 'src/common/types/service.result';
import { UsersRepository } from './users.repository';
import { UserMapper } from './mappers/user.mapper';
import { RedisCacheService } from 'src/common/cache/redis-cache.service';
import { CacheKeyFactory } from 'src/common/cache/cache-key.factory';
import { CacheDomain } from 'src/common/cache/enum.cache.domain';
import { CacheDuration } from 'src/common/cache/cache.duration.enum';
import { ErrorMessage } from 'src/common/types/error.message';
import { ErrorType } from 'src/common/types/error-type.enum';

@Injectable()
export class UsersService {

  constructor(
    private readonly userRepository: UsersRepository, 
    private readonly redis: RedisCacheService
  ) {}


  // fonction du service pour le création d'un utilisateur
  async serviceCreate(createUserDto: CreateUserDto): Promise<ServiceResult<FrontReadUser>> {
    
    // on appelle la fonction du rpository pour faire la requette bd
    const repo_user = await this.userRepository.createUser(createUserDto);

    // on vérifie si une erreur s'est passé
    if (repo_user.isError){
      return ServiceResult.error_service(
        repo_user.error,
        repo_user.statusCode,
        "SERVICE USER"
      )
    }

    // si aucune erreur ne s'est passé, on convertit le model User de la bd vers le model de donné 
    // que je veux retourner. Et pour cela j'ai créer une classe UserMapper pour me permettre de gérer çà.
    // Ensuite on ajoute la donnée au cahe si nécessaire
    try {
      const userToFront = UserMapper.toFront(repo_user.data);
      const cache_key: string = CacheKeyFactory.create(CacheDomain.USER, repo_user.data.id);
      await this.redis.set(cache_key, userToFront, CacheDuration.USER_DURATION.valueOf()); // Cache pour 1 heure
      return ServiceResult.success_service(
        userToFront,
        repo_user.statusCode
      )
    } catch (error) {
      console.error("Erreur lors de la mise en cache de l'utilisateur: ", error)
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          "Erreur lors de la mise en cache de l'utilisateur"
        ),
        500,
        "SERVICE USER"
      );
    }

  }

 
}
