import { Injectable } from '@nestjs/common';
import { CreateAuditLogDto } from './dto/create-audit-logs.dto';
import { UpdateAuditLogDto } from './dto/update-audit-logs.dto';

@Injectable()
export class AuditLogsService {

  create(createAuditLogDto: CreateAuditLogDto) {
    return 'This action adds a new audit-logs';
  }

  findAll() {
    return `This action returns all audit-logs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} audit-logs`;
  }

  update(id: number, updateAuditLogDto: UpdateAuditLogDto) {
    return `This action updates a #${id} audit-logs`;
  }

  remove(id: number) {
    return `This action removes a #${id} audit-logs`;
  }
}
