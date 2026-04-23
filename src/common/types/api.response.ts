// app/common/results/api-base.response.ts
import { Response } from 'express';

export class ApiResponse<T> {
  readonly success: boolean;
  readonly result: T | null;
  readonly error: string | null;

  constructor(
    success: boolean,
    result: T | null = null,
    error: string | null = null,
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
    error_message: string,
    res: Response,
    statusCode: number,
  ): ApiResponse<T> {
    res.status(statusCode);
    return new ApiResponse(false, null as T, error_message);
  }
}
