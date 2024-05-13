import { SetMetadata } from '@nestjs/common'
import { AdminRole } from '@/common/enums/role-name.enum'

export const ADMIN_ROLES_KEY = 'Admin_Roles'
export const AdminRoles = (...roles: AdminRole[]) => SetMetadata(ADMIN_ROLES_KEY, roles)
