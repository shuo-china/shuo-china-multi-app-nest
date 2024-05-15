import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { NoPermissionException } from '@/common/exceptions/no-permission.exception'
import { PrismaService } from '@/prisma/prisma.service'
import { TokenInvalidException } from '@/common/exceptions/token-invalid.exception'
import { ADMIN_ROLES_KEY } from '@/common/constants'

function createRolesGuard(
  rolesKey: string,
  validate: (prisma: PrismaService, user: any, roles: string[]) => boolean | Promise<boolean>,
) {
  @Injectable()
  class RolesGuard implements CanActivate {
    constructor(
      public reflector: Reflector,
      public prisma: PrismaService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const { user } = context.switchToHttp().getRequest()
      if (!user || !user.sub) {
        return true
      }

      const requiredRoles = this.reflector.getAllAndOverride(rolesKey, [context.getHandler(), context.getClass()])
      if (!requiredRoles) {
        return true
      }

      if (await validate(this.prisma, user, requiredRoles)) {
        return true
      }

      throw new NoPermissionException()
    }
  }

  return RolesGuard
}

export const AdminRolesGuard = createRolesGuard(ADMIN_ROLES_KEY, async (prisma, user, roles) => {
  const dbUser = await prisma.adminUser.findUnique({
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

  return roles.some((role) => dbRoles?.includes(role))
})
