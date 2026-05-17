/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from 'prisma/src/generated/prisma';
import { CRUDResult } from 'src/common/types/crud.result';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { handleProjectErrors } from 'src/common/errors-handlers/generic-error.handler';
import { ErrorMessage } from 'src/common/types/error.message';
import { ErrorType } from 'src/common/types/error-type.enum';


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
  async getAllUsers(): Promise<CRUDResult<User[]>> {

    try {
      const users = await this.prismaService.user.findMany();
      
      if (users === null) {
        return CRUDResult.crud_error(
          new ErrorMessage(
            ErrorType.EMPTY_LIST,
            "Aucun utilisiteur trouvé. Veuillez en créer un",
          ),
          404
        )
      }
      
      return CRUDResult.crud_success(
        users,
        200
      )
    } catch (error) {
      return handleProjectErrors(error);
    }
  }
}
