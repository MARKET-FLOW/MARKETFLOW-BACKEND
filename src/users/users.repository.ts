/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'prisma/src/generated/prisma';
import { CRUDResult } from 'src/common/types/crud.result';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { handlePrismaError } from 'src/common/errors-handlers/prisma-error.handler';
import { handleGenericError } from 'src/common/errors-handlers/generic-error.handler';


@Injectable()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

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
      if (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientValidationError ||
        error instanceof Prisma.PrismaClientUnknownRequestError
      ) {
        return handlePrismaError<User>(error);
      }

      return handleGenericError<User>(error);
    }
  }
}
