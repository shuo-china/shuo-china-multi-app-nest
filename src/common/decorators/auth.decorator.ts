import { UseGuards } from '@nestjs/common'
import { AdminAuthGuard } from '@/common/guards/auth.guard'
import { AdminRolesGuard } from '@/common/guards/roles.guad'

export function AdminAuth() {
  return UseGuards(AdminAuthGuard, AdminRolesGuard)
}
