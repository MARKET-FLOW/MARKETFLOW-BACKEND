import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorMessage } from '../types/error.message';
import { ErrorType } from '../types/error-type.enum';

/**
 * Intercepte toutes les exceptions non catchées dans les controllers.
 * Garantit que même les erreurs inattendues retournent le format standard
 * { success, result, error } au lieu d'une réponse HTML/texte brute de NestJS.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorType = ErrorType.INTERNAL_SERVER_ERROR;
    let message = 'Une erreur inattendue est survenue';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;

      // Mappage du status HTTP vers ErrorType interne
      const httpToErrorType: Record<number, ErrorType> = {
        [HttpStatus.BAD_REQUEST]: ErrorType.BAD_REQUEST,
        [HttpStatus.UNAUTHORIZED]: ErrorType.UNAUTHORIZED,
        [HttpStatus.FORBIDDEN]: ErrorType.FORBIDDEN,
        [HttpStatus.NOT_FOUND]: ErrorType.NOT_FOUND,
        [HttpStatus.CONFLICT]: ErrorType.CONFLICT,
        [HttpStatus.UNPROCESSABLE_ENTITY]: ErrorType.UNPROCESSABLE,
        [HttpStatus.INTERNAL_SERVER_ERROR]: ErrorType.INTERNAL_SERVER_ERROR,
      };
      errorType =
        httpToErrorType[statusCode] ?? ErrorType.INTERNAL_SERVER_ERROR;
    }

    this.logger.error(
      `[${request.method}] ${request.url} → ${statusCode}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(statusCode).json({
      success: false,
      result: null,
      error: new ErrorMessage(errorType, message),
    });
  }
}
