/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UUID } from 'node:crypto';
import { ErrorType } from '../common/types/error-type.enum';
import { ErrorMessage } from '../common/types/error.message';
import { ServiceResult } from '../common/types/service.result';
import { CreateUserDto, } from './dto/create-user.dto';
import { UsersCache } from './global-user/users.cache';
import { UserMapper } from './mappers/user.mapper';
import { UsersRepository } from './users.repository';
import { FrontReadUser } from './dto/read.user.';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly usersCache: UsersCache,
  ) {}

  // fonction du service pour le création d'un utilisateur
  async serviceCreate(
    createUserDto: CreateUserDto,
  ): Promise<ServiceResult<FrontReadUser>> {

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

      await this.usersCache.setUserToCache(userToFront);
      await this.usersCache.invalidateUserListCache();

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
    // On checke d'abord dans le cache
    const cache_data = await this.usersCache.getUserListFromCache(admin);

    if (cache_data !== null) {
      return ServiceResult.success_service(cache_data, 200);
    }

    // Si pas de données dans le cache, on va les chercher dans la base de données
    const users = await this.userRepository.getAllUsers(admin);

    if (users.isError) {
      console.error('Erreur dans SERVICE USER: fn serviceGetAllUsers');
      return ServiceResult.error_service(
        users.error,
        users.statusCode,
        'SERVICE USER',
      );
    }

    try {
      const frontUsers = users.data.map((user) => UserMapper.toFront(user));
      await this.usersCache.setUserListToCache(frontUsers, admin);

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
  async serviceGetUserById(id: UUID): Promise<ServiceResult<FrontReadUser>> {
    
    const cacheUser = await this.usersCache.getUserFromCache(id);

    if (cacheUser !== null) {
      return ServiceResult.success_service(cacheUser, 200);
    }

    const user_repo = await this.userRepository.getUserByID(id);

    if (user_repo.isError) {
      return ServiceResult.error_service(
        user_repo.error,
        user_repo.statusCode,
        'USER SERVICE',
      );
    }

    // mise en cache
    try {
      const frontUser = UserMapper.toFront(user_repo.data);
      await this.usersCache.setUserToCache(frontUser);

      return ServiceResult.success_service(frontUser, user_repo.statusCode);
    } catch (error) {
      console.error(`[userService.serviceGetUserById] ==> ERREUR: ${error}`);
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.INTERNAL_SERVER_ERROR,
          'Erreur de validation ou de mise en cache',
        ),
        500,
      );
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
      await this.usersCache.deleteUserFromCache(id);
      await this.usersCache.invalidateUserListCache();

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
