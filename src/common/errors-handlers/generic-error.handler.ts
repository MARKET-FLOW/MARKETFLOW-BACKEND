/* eslint-disable prettier/prettier */
import { CRUDResult } from '../types/crud.result';
import { ErrorType } from '../types/error-type.enum';
import { ErrorMessage } from '../types/error.message';

export function handleGenericError<T>(
  error: unknown,
): CRUDResult<T> {
  // logging de l'erreur pour le debug
  console.error('An unexpected error occurred:', error);

  // On précise <T> pour que le retour soit compatible avec CRUDResult<User>, etc.
  return CRUDResult.crud_error<T>({
    error_message: new ErrorMessage(
      ErrorType.INTERNAL_SERVER_ERROR,
      'An unexpected error occurred.',
    ),
    statusCode: 500,
  });
}