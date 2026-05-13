import { CRUDResult } from '../types/crud.result';
import { ErrorType } from '../types/error-type.enum';
import { ErrorMessage } from '../types/error.message';

export function handleValidationError<T>(error: unknown): CRUDResult<T> {
  console.error('A validation error occurred:', error);

  return CRUDResult.crud_error({
    error_message: new ErrorMessage(
      ErrorType.VALIDATION_ERROR,
      'Erreur de validation des données',
    ),
    statusCode: 400,
  });
}
