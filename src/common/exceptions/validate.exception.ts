import { HttpStatus } from '@nestjs/common'
import { ApiException } from './api.exception'

export class ValidateException extends ApiException {
  constructor(message: string, field: string) {
    super({ code: 'PARAM_ERROR', message, field }, HttpStatus.UNPROCESSABLE_ENTITY)
  }
}
