/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { ErrorMessage } from './error.message';
import { GlobalAppResult } from './global-app.result';
import { ServiceResult } from './service.result';
import { ServiceName } from '../constants/services-names.constants';

export class CRUDResult<T> extends GlobalAppResult<T> {
  public readonly statusCode: number;

  constructor(
    data: T | null = null,
    error: ErrorMessage | null = null,
    statusCode: number = 200,
  ) {
    super(data, error);
    this.statusCode = statusCode;
  }

  static crud_success<T>(
    argsOrData: { data: T; statusCode?: number } | T,
    statusCode?: number,
  ): CRUDResult<T> {
    if (
      typeof argsOrData === 'object' &&
      argsOrData !== null &&
      'data' in argsOrData
    ) {
      const obj = argsOrData as { data: T; statusCode?: number };
      return new CRUDResult<T>(obj.data, null, obj.statusCode ?? 200);
    }
    return new CRUDResult<T>(argsOrData as T, null, statusCode ?? 200);
  }

  /**
   * Helper pour créer une réponse d'erreur.
   * NOTE : On retire <ErrorMessage> ici car on utilise la VRAIE classe ErrorMessage importée
   */
  static crud_error<T>(
    argsOrError:
      | { error_message: ErrorMessage; statusCode?: number }
      | ErrorMessage,
    statusCode?: number,
  ): CRUDResult<T> {
    if (
      typeof argsOrError === 'object' &&
      argsOrError !== null &&
      'error_message' in (argsOrError as any)
    ) {
      const obj = argsOrError as {
        error_message: ErrorMessage;
        statusCode?: number;
      };
      return new CRUDResult<T>(null, obj.error_message, obj.statusCode ?? 500);
    }
    return new CRUDResult<T>(
      null,
      argsOrError as ErrorMessage,
      statusCode ?? 500,
    );
  }

  /**
   * Helper pour retourner obtenir rapidement une ServiceResult d'erreur à partir d'un CRUDResult d'erreur.
   * @param serviceName Le nom du service pour lequel on veut créer le ServiceResult d'erreur
   * @returns Un ServiceResult d'erreur avec les mêmes informations d'erreur et de statusCode que ce CRUDResult
   */
  toServiceError<T>(serviceName: ServiceName): ServiceResult<T> {
    if (this.isSuccess) {
      throw new Error(
        'Impossible de convertir un CrudResult de success en ServiceError',
      );
    }

    return ServiceResult.error_service(
      this.error,
      this.statusCode,
      serviceName,
    );
  }

  toString(): string {
    if (this.isSuccess) {
      return `[CRUDResult Success] Status: ${this.statusCode}, Data: ${JSON.stringify(this.data)}`;
    }
    // On utilise une petite vérification pour le message d'erreur
    const msg =
      this.error instanceof ErrorMessage
        ? this.error.getMessage()
        : 'Unknown error';
    return `[CRUDResult Error] Status: ${this.statusCode}, Error: ${msg}`;
  }
}
