/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UUID } from 'node:crypto';
import { CacheKeyFactory } from 'src/common/cache/cache-key.factory';
import { CacheDuration } from 'src/common/cache/cache.duration.enum';
import { CacheDomain } from 'src/common/cache/enum.cache.domain';
import { RedisCacheService } from 'src/common/cache/redis-cache.service';
import { ADMIN_SCOPE } from 'src/common/constants/global.constants';
import { ErrorType } from 'src/common/types/error-type.enum';
import { ErrorMessage } from 'src/common/types/error.message';
import { ServiceResult } from 'src/common/types/service.result';
import { CreateUserDto, FrontReadUser } from './dto/create-user.dto';
import { UserMapper } from './mappers/user.mapper';
import { UsersRepository } from './users.repository';

// Définition de quelques constantes du fichier
const USERS_LIST_CACHE_ID: string = 'users:list';


@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly redis: RedisCacheService,
  ) {}

  // fonction du service pour le création d'un utilisateur
  async serviceCreate(
    createUserDto: CreateUserDto,
  ): Promise<ServiceResult<FrontReadUser>> {
    // on appelle la fonction du rpository pour faire la requette bd
    const repo_user = await this.userRepository.createUser(createUserDto);

    // on vérifie si une erreur s'est passé
    if (repo_user.isError) {
      return ServiceResult.error_service(
        repo_user.error,
        repo_user.statusCode,
        'SERVICE USER',
      );
    }

    // si aucune erreur ne s'est passé, on convertit le model User de la bd vers le model de donné
    // que je veux retourner. Et pour cela j'ai créer une classe UserMapper pour me permettre de gérer çà.
    // Ensuite on ajoute la donnée au cahe si nécessaire
    try {
      const userToFront = UserMapper.toFront(repo_user.data);
      const cache_key: string = CacheKeyFactory.create(
        CacheDomain.USER,
        repo_user.data.id,
      );
      await this.redis.set(
        cache_key,
        userToFront,
        CacheDuration.USER_DURATION.valueOf(),
      ); // Cache pour 1 heure.

      // Invalider les listes de cache (admin et défaut)
      await this.redis.delete(
        CacheKeyFactory.create(CacheDomain.USER, USERS_LIST_CACHE_ID),
      );
      await this.redis.delete(
        CacheKeyFactory.create(
          CacheDomain.USER,
          `${USERS_LIST_CACHE_ID}:admin`,
        ),
      );

      return ServiceResult.success_service(userToFront, repo_user.statusCode);
    } catch (error) {
      console.error(
        "Erreur lors de la mise en cache de l'utilisateur: ",
        error,
      );
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          "Erreur lors de la mise en cache de l'utilisateur",
        ),
        500,
        'SERVICE USER',
      );
    }
  }

  // fonction service pour lire tous les utilisateurs
  async serviceGetAllUsers(
    admin?: string,
  ): Promise<ServiceResult<FrontReadUser[]>> {
    // Différentié les clés de cache pour les listes d'utilisateurs en fonction du rôle (admin ou non)
    const cache_id = admin === ADMIN_SCOPE ? `${USERS_LIST_CACHE_ID}:admin` : USERS_LIST_CACHE_ID;
    const list_cache_key = CacheKeyFactory.create(CacheDomain.USER, cache_id);

    // On checke d'abord dans le cache avec la clé complète
    const cache_data = await this.redis.get<FrontReadUser[]>(list_cache_key);

    if (cache_data !== null) {
      return ServiceResult.success_service(cache_data, 200);
    }

    // Si pas de données dans le cache, on va les chercher dans la base de données
    const users = await this.userRepository.getAllUsers(admin);
    
    if (users.isError) {
      console.error("Erreur dans SERVICE USER: fn serviceGetAllUsers")
      return ServiceResult.error_service(
        users.error,
        users.statusCode,
        'SERVICE USER',
      );
    }

    try {
      const frontUsers = users.data.map((user) => UserMapper.toFront(user));
      await this.redis.set(
        list_cache_key,
        frontUsers,
        CacheDuration.LISTE_USERS_DURATION.valueOf(),
      );

      return ServiceResult.success_service(frontUsers, users.statusCode);
    } catch (error) {
      console.error(
        'Erreur de conversion des données ou de mise en cache: ',
        error,
      );
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          'Erreur Interne ou erreur de conversion des données',
        ),
        500,
        'SERVICE USER',
      );
    }
  }

  // fonction service get users by id
  async serviceGetUserById(id: UUID): Promise<ServiceResult<FrontReadUser>>{

    const cache_key = CacheKeyFactory.create(
      CacheDomain.USER,
      id
    ) 

    const cacheUser = await this.redis.get<FrontReadUser>(
      cache_key
    )

    if (cacheUser !== null) { 
      return ServiceResult.success_service(
        cacheUser,
        200
      )
    }

    const user_repo = await this.userRepository.getUserByID(id);
    
    if (user_repo.isError){
      return ServiceResult.error_service(
        user_repo.error,
        user_repo.statusCode,
        'USER SERVICE'
      )
    }

    // mise en cache
    try {
      const frontUser = UserMapper.toFront(user_repo.data);
      await this.redis.set(
        cache_key,
        frontUser,
        CacheDuration.USER_DURATION.valueOf()
      ) 
      
      return ServiceResult.success_service(
        frontUser,
        user_repo.statusCode
      )
      
    } catch (error) {
      console.error(`[userService.serviceGetUserById] ==> ERREUR: ${error}`)
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          'Erreur de validation ou de mise en cache'
        ),
        500,
      )
    }
  }

  // fonction pour supprimer un utilisateur
  async serviceDeleteUser(id: UUID): Promise<ServiceResult<string>> {
    try {
      const repo_result = await this.userRepository.deleteUser(id);

      if (repo_result.isError) {
        return ServiceResult.error_service(
          repo_result.error,
          repo_result.statusCode,
        );
      }

      // Invalider le cache de l'utilisateur et les listes
      const user_cache_key = CacheKeyFactory.create(CacheDomain.USER, id);
      await this.redis.delete(user_cache_key);

      await this.redis.delete(
        CacheKeyFactory.create(CacheDomain.USER, USERS_LIST_CACHE_ID),
      );
      await this.redis.delete(
        CacheKeyFactory.create(
          CacheDomain.USER,
          `${USERS_LIST_CACHE_ID}:admin`,
        ),
      );

      return ServiceResult.success_service(
        repo_result.data,
        repo_result.statusCode,
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur: ", error);
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          "Erreur lors de la suppression de l'utilisateur",
        ),
        500,
      );
    }
  }
}
