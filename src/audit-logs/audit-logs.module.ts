import { Module } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { AuditLogsRepository } from './audit-logs.repository';

@Module({
  controllers: [AuditLogsController],
  providers: [AuditLogsService, AuditLogsRepository],
})
export class AuditLogsModule {}
