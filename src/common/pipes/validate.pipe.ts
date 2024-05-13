import { ValidationError, ValidationPipe } from '@nestjs/common'
import { ValidateException } from '../exceptions/validate.exception'

export default class ValidatePipe extends ValidationPipe {
  protected flattenValidationErrors(validationErrors: ValidationError[]): string[] {
    const firstError = validationErrors[0]

    const message = Object.values(firstError.constraints)[0]
    const field = firstError.property

    throw new ValidateException(message, field)
  }
}
