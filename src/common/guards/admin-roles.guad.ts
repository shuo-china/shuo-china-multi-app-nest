import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AdminRole } from '@/common/enums/role-name.enum'
import { ADMIN_ROLES_KEY } from '@/common/decorators/admin-roles.decorator'
import { NoPermissionException } from '@/common/exceptions/no-permission.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { TokenInvalidException } from '@/common/exceptions/token-invalid.exception'

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user } = context.switchToHttp().getRequest()
    if (!user || !user.sub) {
      return true
    }

    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(ADMIN_ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles) {
      return true
    }

    const dbUser = await this.prisma.adminUser.findUnique({
      where: { id: user.sub },
      select: {
        id: true,
        username: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    })

    if (!dbUser) {
      throw new TokenInvalidException()
    }

    const dbRoles = dbUser.roles.map((r) => r.role.code)

    if (!requiredRoles.some((role) => dbRoles?.includes(role))) {
      throw new NoPermissionException()
    }

    return true
  }
}
