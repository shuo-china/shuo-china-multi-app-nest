import { SetMetadata } from '@nestjs/common'
import { AdminRole } from '@/common/enums/roles-name.enum'
import { ADMIN_ROLES_KEY } from '@/common/constants'

export const AdminRoles = (...roles: AdminRole[]) => SetMetadata(ADMIN_ROLES_KEY, roles)
