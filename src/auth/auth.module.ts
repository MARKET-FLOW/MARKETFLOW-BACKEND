import { Module } from '@nestjs/common';
import { RedisCacheService } from 'src/common/cache/redis-cache.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtManager } from './auth_dependencies/jwt.manager';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService, 
    AuthRepository, 
    RedisCacheService, 
    JwtManager
  ],
})
export class AuthModule {}
