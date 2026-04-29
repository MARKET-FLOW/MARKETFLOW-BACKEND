import { ErrorMessage } from './error.message';
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

  /**
   * Helper pour créer une réponse de succès.
   */
  static crud_success<T>(data: T, statusCode: number = 200): CRUDResult<T> {
    return new CRUDResult<T>(data, null, statusCode);
  }

  /**
   * Helper pour créer une réponse d'erreur.
   */
  static crud_error<T>(
    message: ErrorMessage,
    statusCode: number = 500,
  ): CRUDResult<T> {
    return new CRUDResult<T>(null, message, statusCode);
  }

  // Équivalent du __repr__ pour le debug
  toString(): string {
    if (this.isSuccess) {
      return `[CRUDResult Success] Status: ${this.statusCode}, Data: ${JSON.stringify(this.data)}`;
    }
    return `[CRUDResult Error] Status: ${this.statusCode}, Error: ${this.error.getMessage()}`;
  }
}
