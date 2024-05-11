import { UseGuards, applyDecorators } from '@nestjs/common'
import { AdminAuthGuard } from '@/common/guards/auth.guard'

export function AdminAuth() {
  return applyDecorators(UseGuards(AdminAuthGuard))
}
