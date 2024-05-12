import { Reflector } from '@nestjs/core'
import { AuthGuard as BaseAuthGuard, PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Observable } from 'rxjs'
import { IS_PUBLIC_KEY } from '@/common/decorators/public.decorator'
import { TokenInvalidException } from '@/common/exceptions/token-invalid.exception'

interface Payload {
  strategyName: string
  [key: string]: any
}

export function createAuthGuard(strategyName: string) {
  @Injectable()
  class AuthGuard extends BaseAuthGuard(strategyName) {
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

  return AuthGuard
}

export function createAuthStrategy(strategyName: string, validate?: (payload: Payload) => any) {
  @Injectable()
  class AuthStrategy extends PassportStrategy(Strategy, strategyName) {
    constructor(public configService: ConfigService) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: configService.get('auth.tokenSecret'),
      })
    }

    validate(payload: Payload) {
      if (payload.strategyName !== strategyName) {
        throw new TokenInvalidException()
      }
      if (typeof validate === 'function') {
        return validate(payload)
      }
      return payload
    }
  }

  return AuthStrategy
}
