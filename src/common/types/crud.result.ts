/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { ErrorMessage } from '../types/error.message';
import { GlobalAppResult } from './global-app.result';

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
   * NOTE: On retire <ErrorMessage> ici car on utilise la VRAIE classe ErrorMessage importée
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
