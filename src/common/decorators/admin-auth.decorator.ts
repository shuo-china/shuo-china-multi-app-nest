import { UseGuards, applyDecorators } from '@nestjs/common'
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard'
import { AdminRolesGuard } from '../guards/admin-roles.guad'

export function AdminAuth() {
  return applyDecorators(UseGuards(AdminAuthGuard, AdminRolesGuard))
}
