import { UseGuards, applyDecorators } from '@nestjs/common'
import { AdminAuthGuard } from '../guards/auth.guard'

export function AdminAuth() {
  return applyDecorators(UseGuards(AdminAuthGuard))
}
