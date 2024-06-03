import { UseGuards } from '@nestjs/common'
import { AdminAuthGuard, WeappAuthGuard } from '@/common/guards/auth.guard'
import { AdminRolesGuard } from '@/common/guards/roles.guad'

export function AdminAuth() {
  return UseGuards(AdminAuthGuard, AdminRolesGuard)
}

export function WeappAuth() {
  return UseGuards(WeappAuthGuard)
}
