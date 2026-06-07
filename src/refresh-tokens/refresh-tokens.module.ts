import { Module } from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';
import { RefreshTokensController } from './refresh-tokens.controller';
import { RefreshTokensRepository } from './refresh-tokens.repository';

@Module({
  controllers: [RefreshTokensController],
  providers: [RefreshTokensService, RefreshTokensRepository],
  exports: [RefreshTokensRepository],
})
export class RefreshTokensModule {}
