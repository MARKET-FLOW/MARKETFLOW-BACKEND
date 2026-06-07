import { Prisma } from '@prisma/client';
import { CRUDResult } from '../types/crud.result';
import { ErrorMessage } from '../types/error.message';
import { ErrorType } from '../types/error-type.enum';
import { handleGenericError } from './generic-error.handler';

export function handlePrismaError<T>(error: unknown): CRUDResult<T> {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error('A known Prisma error occurred:', error);
    return CRUDResult.crud_error({
      error_message: new ErrorMessage(
        ErrorType.PRISMA_ERROR,
        'Une erreur prisma est apparue. Mauvaise requette',
      ),
      statusCode: 409,
    });
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    console.error('Prima validation error occured:', error);
    return CRUDResult.crud_error({
      error_message: new ErrorMessage(
        ErrorType.PRISMA_ERROR,
        'Erreur de validation des données entrées',
      ),
      statusCode: 400,
    });
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    console.error('An unknown Prisma error occurred:', error);
    return CRUDResult.crud_error({
      error_message: new ErrorMessage(
        ErrorType.PRISMA_ERROR,
        'Une erreur prisma est apparue. Erreur inconnue',
      ),
      statusCode: 500,
    });
  }

  return handleGenericError(error);
}
