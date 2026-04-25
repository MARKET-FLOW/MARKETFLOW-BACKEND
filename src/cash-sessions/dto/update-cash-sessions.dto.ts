import { PartialType } from '@nestjs/swagger';
import { CreateCashSessionDto } from './create-cash-sessions.dto';

export class UpdateCashSessionDto extends PartialType(CreateCashSessionDto) {}
