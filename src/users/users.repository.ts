/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UUID } from 'node:crypto';
import { User } from 'prisma/src/generated/prisma';
import { ADMIN_SCOPE } from 'src/common/constants/global.constants';
import { handleProjectErrors } from 'src/common/errors-handlers/generic-error.handler';
import { CRUDResult } from 'src/common/types/crud.result';
import { ErrorType } from 'src/common/types/error-type.enum';
import { ErrorMessage } from 'src/common/types/error.message';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // fonction pour créer un tilisateur
  async createUser(userDto: CreateUserDto): Promise<CRUDResult<User>> {
    const { storeId, username, email, password, role } = userDto;

    try {
      const hashedPassword: string = await argon2.hash(password);

      const createdUser = await this.prismaService.user.create({
        data: {
          storeId,
          username,
          email,
          passwordHash: hashedPassword,
          role,
        },
      });

      return CRUDResult.crud_success(createdUser, 201);
    } catch (error) {
      return handleProjectErrors<User>(error);
    }
  }

  // fonction pour récupérer touts les users de la db
  async getAllUsers(admin?: string): Promise<CRUDResult<User[]>> {
    try {
      let users: User[] = [];

      // on fait la requette en fonction de admin ou utilisateur simple
      if (admin === ADMIN_SCOPE) {
        users = await this.prismaService.user.findMany();
      } else {
        users = await this.prismaService.user.findMany({
          where: {
            deletedAt: null,
          },
        });
      }

      if (users === null) {
        return CRUDResult.crud_error(
          new ErrorMessage(
            ErrorType.EMPTY_LIST,
            'Aucun utilisiteur trouvé. Veuillez en créer un',
          ),
          404,
        );
      }

      return CRUDResult.crud_success(users, 200);
    } catch (error) {
      return handleProjectErrors(error);
    }
  }

  // fonction pour supprimer un utilisateur
  async deleteUser(id: UUID): Promise<CRUDResult<string>> {
    try {
      // utiliser le soft delete pour marquer l'utilisateur comme supprimé
      await this.prismaService.user.update({
        where: {
          id: id,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return CRUDResult.crud_success('Utilisateur supprimé avec succès', 200);
    } catch (error) {
      return handleProjectErrors(error);
    }
  }
}
