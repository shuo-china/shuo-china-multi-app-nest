import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AdminRole } from '@/common/enums/role-name.enum'
import { ADMIN_ROLES_KEY } from '@/common/decorators/admin-roles.decorator'
import { NoPermissionException } from '../exceptions/no-permission.exception'

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest()
    if (!user) {
      return true
    }

    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(ADMIN_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles || requiredRoles.some((role) => user.roles?.includes(role))) {
      return true
    }

    throw new NoPermissionException()
  }
}
