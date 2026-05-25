import { ApiProperty } from '@nestjs/swagger';
import { ErrorType } from './error-type.enum';
import { IsEnum } from 'class-validator';

export class ErrorMessage {
  @ApiProperty({
    description: "Le type d'erreur qu'on retourne",
    example: ErrorType.INTERNAL_SERVER_ERROR,
  })
  @IsEnum(ErrorType)
  private readonly type: ErrorType;
  @ApiProperty()
  private readonly message: string;

  constructor(type: ErrorType, message: string) {
    this.type = type;
    this.message = message;
  }

  getMessage(): string {
    return this.message;
  }

  getType(): ErrorType {
    return this.type;
  }
}
