import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

import { ValidationErrorResponseDto } from '../dto/validation-error-response.dto';
/**
 * Décorateur global pour les contrôleurs d'API, appliquant des décorateurs communs à tous les endpoints.
 * Inclut des réponses d'erreur standard pour les erreurs de validation et les erreurs internes du serveur.
 * Utilisez ce décorateur sur tous les contrôleurs d'API pour assurer une documentation cohérente et complète.
 * @returns Un ensemble de décorateurs à appliquer à un contrôleur d'API.
 */
export function ApiCommonDocs() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Erreur de validation des inputs',
      type: ValidationErrorResponseDto,
    }),
    ApiInternalServerErrorResponse({
      description: 'Erreur interne du serveur.',
    }),
  );
}
