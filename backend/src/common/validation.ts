import { BadRequestException, ValidationError } from '@nestjs/common';
import { ApiErrorCode } from './api-error-code';

export function validationExceptionFactory(errors: ValidationError[]) {
  const messages = errors.flatMap((error) =>
    Object.values(error.constraints ?? {}),
  );

  return new BadRequestException({
    code: ApiErrorCode.validation,
    message: messages.length > 0 ? messages : ['请求参数无效'],
  });
}
