import { Response } from 'express';
import { GlobalAppResult } from './global-app.result';
import { UNKNOWN_SERVICE } from '../constants/result.constant';
import { ApiResponse } from './api.response';

export class ServiceResult<T> extends GlobalAppResult<T> {
  public readonly serviceName: string;
  public readonly statusCode: number;

  constructor(
    data: T | null = null,
    error: string | null = null,
    statusCode: number = 200,
    serviceName: string = UNKNOWN_SERVICE,
  ) {
    super(data, error);
    this.serviceName = serviceName;
    this.statusCode = statusCode;
  }

  /**
   * Fidèle à ta logique Python : convertit le résultat du service
   * en une réponse API standardisée.
   */
  to_HTTP_api_base_response(res: Response): ApiResponse<T> {
    if (this.isError) {
      return ApiResponse.error_response(this.error, res, this.statusCode);
    }
    return ApiResponse.success_response(this.data, res, this.statusCode);
  }

  // --- Helpers (Méthodes Statiques) ---

  static success_service<T>(
    data: T,
    statusCode: number = 200,
    serviceName: string = UNKNOWN_SERVICE,
  ): ServiceResult<T> {
    return new ServiceResult<T>(data, null, statusCode, serviceName);
  }

  static error_service<T>(
    error_message: string,
    statusCode: number = 400,
    serviceName: string = UNKNOWN_SERVICE,
  ): ServiceResult<T> {
    return new ServiceResult<T>(null, error_message, statusCode, serviceName);
  }
}
