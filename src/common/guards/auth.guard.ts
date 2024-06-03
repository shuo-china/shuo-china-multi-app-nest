import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { TokenInvalidException } from '@/common/exceptions/token-invalid.exception'
import { StrategyName } from '@/common/enums/strategy-name.enum'
import { IS_PUBLIC_KEY } from '@/common/constants'

function createAuthGuard(strategyName: StrategyName) {
  @Injectable()
  class Guard extends AuthGuard(strategyName) {
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

  return Guard
}

export const AdminAuthGuard = createAuthGuard(StrategyName.AdminAuth)

export const WeappAuthGuard = createAuthGuard(StrategyName.WeappAuth)
