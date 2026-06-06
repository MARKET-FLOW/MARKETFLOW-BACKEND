import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { RedisCacheService } from 'src/common/cache/redis-cache.service';
import { UsersCache } from './global-user/users.cache';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, RedisCacheService, UsersCache],
})
export class UsersModule {}
