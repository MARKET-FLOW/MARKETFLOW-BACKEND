// app/common/results/api-base.response.ts
import { Response } from 'express';
import { ErrorMessage } from './error.message';
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponse<T> {
  @ApiProperty()
  readonly success: boolean;

  @ApiProperty()
  readonly error: ErrorMessage | null;

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
  ): ApiResponse<T> {
    res.status(statusCode);
    return new ApiResponse(true, data, null);
  }

  static error_response<T>(
    error_message: ErrorMessage,
    res: Response,
    statusCode: number,
  ): ApiResponse<T> {
    res.status(statusCode);
    return new ApiResponse(false, null as T, error_message);
  }
}
