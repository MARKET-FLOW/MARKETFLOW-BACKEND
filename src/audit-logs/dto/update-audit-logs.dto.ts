import { PartialType } from '@nestjs/swagger';
import { CreateAuditLogDto } from './create-audit-logs.dto';

export class UpdateAuditLogDto extends PartialType(CreateAuditLogDto) {}
