import { Module } from '@nestjs/common';
import { CashSessionsService } from './cash-sessions.service';
import { CashSessionsController } from './cash-sessions.controller';
import { CashSessionsRepository } from './cash-sessions.repository';

@Module({
  controllers: [CashSessionsController],
  providers: [CashSessionsService, CashSessionsRepository],
})
export class CashSessionsModule {}
