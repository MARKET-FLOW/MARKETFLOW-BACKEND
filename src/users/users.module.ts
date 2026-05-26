/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { RedisCacheService } from 'src/common/cache/redis-cache.service';


@Module({
  controllers: [UsersController],
  providers: [
    UsersService, 
    UsersRepository,
    RedisCacheService
  ],
})
export class UsersModule {}
