import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

import { ValidationErrorResponseDto } from '../dto/validation-error-response.dto';

export function ApiValidationError() {
  return applyDecorators(
    ApiBadRequestResponse({
      description: 'Erreur de validation des inputs',
      type: ValidationErrorResponseDto,
    }),
  );
}
