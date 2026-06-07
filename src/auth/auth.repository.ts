import { Injectable } from '@nestjs/common';
import { UUID } from 'node:crypto';
import { handleProjectErrors } from 'src/common/errors-handlers/generic-error.handler';
import { CRUDResult } from 'src/common/types/crud.result';
import { ErrorType } from 'src/common/types/error-type.enum';
import { ErrorMessage } from 'src/common/types/error.message';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserWithStore } from 'src/users/global-user/user.message';

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) { }


  // fonction pour trouver un utilisateur par email ou username : de toute façon via un attribut donné
  async findUserByFields(field: string, value: string): Promise<CRUDResult<UserWithStore>> {
    try {
      const fieldName: string = field.toLowerCase();

      const user = await this.prismaService.user.findFirst({
        where: {
          [fieldName]: value,
          isActive: true,
          deletedAt: null,
        },
        include: {
          store: true,
        },
      });

      if (!user) {
        return CRUDResult.crud_error(
          new ErrorMessage(
            ErrorType.NOT_FOUND,
            `L'utilisateur avec ${field} ${value} non trouvé`,
          ),
          404,
        );
      }

      return CRUDResult.crud_success(user, 200);
    } catch (error) {
      return handleProjectErrors<UserWithStore>(error);
    }
  }

  /**
   * Met à jour la date de dernière connexion de l'utilisateur.
   */
  async updateLastLogin(userId: UUID): Promise<CRUDResult<string>> {
    try {
      await this.prismaService.user.update({
        where: { id: userId },
        data: { lastLoginAt: new Date() },
      });
      return CRUDResult.crud_success("succès", 200);
    } catch (error) {
      console.error(`[AuthRepository.updateLastLogin] Erreur lors de la mise à jour : ${error}`);
      return handleProjectErrors<string>(error);
    }
  }
}
