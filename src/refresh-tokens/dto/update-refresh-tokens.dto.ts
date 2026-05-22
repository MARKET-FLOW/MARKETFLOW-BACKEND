import { PartialType } from '@nestjs/swagger';
import { CreateRefreshTokenDto } from './create-refresh-tokens.dto';

export class UpdateRefreshTokenDto extends PartialType(CreateRefreshTokenDto) {}
