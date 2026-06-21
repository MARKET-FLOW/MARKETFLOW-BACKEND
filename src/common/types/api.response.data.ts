import { Response } from 'express';
import { ErrorMessage } from './error.message';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseData<T> {
  @ApiProperty()
  readonly success: boolean;

  @ApiPropertyOptional({
    description: "Le message d'erreur, présent uniquement si success est false",
    type: ErrorMessage,
  })
  readonly error: ErrorMessage | null;

  @ApiPropertyOptional({
    description:
      'Le résultat de la requête, présent uniquement si success est true',
  })
  readonly result: T | null;

  constructor(
    success: boolean,
    result: T | null = null,
    error: ErrorMessage | null = null,
  ) {
    if (success && error !== null) throw new Error('Erreur sur success: True');
    if (!success && result !== null)
      throw new Error('Erreur sur success: False');

    this.success = success;
    this.result = result;
    this.error = error;
  }

  static success_response<T>(
    data: T,
    res: Response,
    statusCode: number = 200,
  ): ApiResponseData<T> {
    const responseBody = new ApiResponseData(true, data, null);

    res.status(statusCode).json(responseBody);

    return responseBody;
  }

  static error_response<T>(
    error_message: ErrorMessage,
    res: Response,
    statusCode: number,
  ): ApiResponseData<T> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const responseBody = new ApiResponseData(false, null as T, error_message);

    res.status(statusCode).json(responseBody);

    return responseBody;
  }
}
