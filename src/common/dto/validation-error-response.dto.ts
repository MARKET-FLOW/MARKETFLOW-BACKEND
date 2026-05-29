import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorResponseDto {
  @ApiProperty({
    example: 400,
  })
  statusCode!: number;

  @ApiProperty({
    example: 'Bad Request',
  })
  error!: string;

  @ApiProperty({
    type: [String],
    example: [
      "Une rerreur parmi tant d'autres",
      "Une autre erreur parmi tant d'autres",
    ],
  })
  message!: string[];
}
