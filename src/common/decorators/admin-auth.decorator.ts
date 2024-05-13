import { UseGuards } from '@nestjs/common'
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard'
import { AdminRolesGuard } from '../guards/admin-roles.guad'

export function AdminAuth() {
  return UseGuards(AdminAuthGuard, AdminRolesGuard)
}
