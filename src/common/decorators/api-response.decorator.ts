import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponse } from '../types/api.response';
import { ValidationErrorResponseDto } from '../dto/validation-error-response.dto';


export interface ApiDocOptions {
  summary: string;
  model: Type<any>;
  isList?: boolean;
  status?: number;
  errors?: number[];
  description?: string;
}


export const ApiDoc = (options: ApiDocOptions) => {
  const {
    summary,
    model,
    isList = false,
    status = HttpStatus.OK,
    errors = [],
    description,
  } = options;

  return applyDecorators(
    ApiOperation({ summary }),
    ApiExtraModels(ApiResponse, model),
    status === HttpStatus.CREATED
      ? ApiCreatedResponse({
          description: description || 'Ressource créée avec succès',
          schema: {
            allOf: [
              { $ref: getSchemaPath(ApiResponse) },
              {
                properties: {
                  data: isList
                    ? { type: 'array', items: { $ref: getSchemaPath(model) } }
                    : { $ref: getSchemaPath(model) },
                },
              },
            ],
          },
        })
      : ApiOkResponse({
          description: description || 'Opération réussie',
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponse) },
          {
            properties: {
              data: isList
                ? {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  }
                : { $ref: getSchemaPath(model) },
            },
          },
        ],
      },
        }),

    // Erreurs standard incluses par défaut
    ApiBadRequestResponse({
      description: 'Erreur de validation des entrées',
      type: ValidationErrorResponseDto,
    }),

    ApiInternalServerErrorResponse({ description: 'Erreur interne du serveur' }),
    ...errors.map((errorCode) => {
      switch (errorCode) {
        case HttpStatus.NOT_FOUND:
          return ApiNotFoundResponse({ description: 'Ressource non trouvée' });
        case HttpStatus.CONFLICT:
          return ApiConflictResponse({ description: 'Conflit : La ressource existe déjà' });
        case HttpStatus.UNAUTHORIZED:
          return ApiUnauthorizedResponse({ description: 'Authentification requise' });
        case HttpStatus.FORBIDDEN:
          return ApiForbiddenResponse({ description: 'Accès interdit / Permissions insuffisantes' });
        default:
          return () => {}; 
      }
    }),
  );
};
