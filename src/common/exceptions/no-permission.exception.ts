import { HttpStatus } from '@nestjs/common'
import { ApiException } from './api.exception'

export class NoPermissionException extends ApiException {
  constructor() {
    super({ code: 'NO_PERMISSION', message: '没有权限' }, HttpStatus.FORBIDDEN)
  }
}
