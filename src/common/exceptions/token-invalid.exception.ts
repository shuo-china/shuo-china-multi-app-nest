import { HttpStatus } from '@nestjs/common'
import { ApiException } from './api.exception'

export class TokenInvalidException extends ApiException {
  constructor() {
    super({ code: 'TOKEN_INVALID', message: '令牌无效' }, HttpStatus.UNAUTHORIZED)
  }
}
