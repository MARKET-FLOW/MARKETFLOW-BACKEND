import { Response } from 'express';
import { GlobalAppResult } from './global-app.result';
import { ApiResponseData } from './api.response.data';
import { ErrorMessage } from './error.message';
import {
  SERVICE_NAMES_MAPPING,
  ServiceName,
} from '../constants/services-names.constants';

export class ServiceResult<T> extends GlobalAppResult<T> {
  public readonly serviceName: ServiceName;
  public readonly statusCode: number;

  constructor(
    data: T | null = null,
    error: ErrorMessage | null = null,
    statusCode: number = 200,
    serviceName: ServiceName = SERVICE_NAMES_MAPPING.UNKNOWN_SERVICE,
  ) {
    super(data, error);
    this.serviceName = serviceName;
    this.statusCode = statusCode;
  }

  to_HTTP_api_base_response(res: Response): ApiResponseData<T> {
    if (this.isError) {
      return ApiResponseData.error_response(this.error, res, this.statusCode);
    }
    return ApiResponseData.success_response(this.data, res, this.statusCode);
  }

  static success_service<T>(
    data: T,
    statusCode: number = 200,
    serviceName: ServiceName = SERVICE_NAMES_MAPPING.UNKNOWN_SERVICE,
  ): ServiceResult<T> {
    return new ServiceResult<T>(data, null, statusCode, serviceName);
  }

  static error_service<T>(
    error_message: ErrorMessage,
    statusCode: number = 400,
    serviceName: ServiceName = SERVICE_NAMES_MAPPING.UNKNOWN_SERVICE,
  ): ServiceResult<T> {
    return new ServiceResult<T>(null, error_message, statusCode, serviceName);
  }
}
