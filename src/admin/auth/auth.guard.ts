import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthStrategyName } from './auth.strategy'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator'
import { ApiException } from '@/common/exceptions/api.exception'

@Injectable()
export class AdminAuthGuard extends AuthGuard(AuthStrategyName) {
  constructor(private reflector: Reflector) {
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
      throw new ApiException({ code: 'TOKEN_INVALID', message: '令牌无效' }, HttpStatus.UNAUTHORIZED)
    }
    return user
  }
}
