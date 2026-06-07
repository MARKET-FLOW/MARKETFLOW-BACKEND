/* eslint-disable prettier/prettier */
import { plainToInstance } from 'class-transformer';
import { User } from '@prisma/client';
import { FrontReadUser } from '../dto/read.user.';

export class UserMapper {
  static toFront(user: User): FrontReadUser {
    return plainToInstance(FrontReadUser, user, {
      excludeExtraneousValues: true, // J'elimine le passwordHash et tout ce qui n'est pas @Expose()
    });
  }
}