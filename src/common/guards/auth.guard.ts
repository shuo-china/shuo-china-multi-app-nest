import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator'
import { TokenInvalidException } from '@/common/exceptions/token-invalid.exception'
import { StrategyName } from '@/common/enums/strategy-name.enum'

function createAuthGuard(strategyName: StrategyName) {
  @Injectable()
  class BaseAuthGuard extends AuthGuard(strategyName) {
    constructor(public reflector: Reflector) {
      super()
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ])

      if (isPublic) {
        return true
      }

      return super.canActivate(context)
    }

    handleRequest(err, user) {
      if (err) {
        throw err
      }

      if (!user) {
        throw new TokenInvalidException()
      }

      return user
    }
  }

  return BaseAuthGuard
}

export const AdminAuthGuard = createAuthGuard(StrategyName.AdminJWT)
