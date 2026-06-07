import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RedisCacheService } from 'src/common/cache/redis-cache.service';
import { RefreshTokensModule } from 'src/refresh-tokens/refresh-tokens.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth_dependencies/decorators/jwt-auth.guard';
import { JwtManager } from './auth_dependencies/jwt.manager';

@Module({
  imports: [JwtModule.register({}), RefreshTokensModule, UsersModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRepository,
    RedisCacheService,
    JwtManager,
    JwtAuthGuard,
  ],
})
export class AuthModule {}
