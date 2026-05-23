/* eslint-disable prettier/prettier */
import { plainToInstance } from 'class-transformer';
import { FrontReadUser } from '../dto/create-user.dto';
import { User } from '@prisma/client';

export class UserMapper {
  static toFront(user: User): FrontReadUser {
    return plainToInstance(FrontReadUser, user, {
      excludeExtraneousValues: true, // J'elimine le passwordHash et tout ce qui n'est pas @Expose()
    });
  }
}