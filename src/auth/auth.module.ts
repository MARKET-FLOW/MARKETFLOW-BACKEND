import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { RedisCacheService } from 'src/common/cache/redis-cache.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, RedisCacheService],
})
export class AuthModule {}
