import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { StrategyName } from '@/common/enums/strategy-name.enum'
import { TokenInvalidException } from '@/common/exceptions/token-invalid.exception'

function createAuthStrategy(strategyName: StrategyName) {
  @Injectable()
  class AuthStrategy extends PassportStrategy(Strategy, strategyName) {
    constructor(public configService: ConfigService) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: configService.get('auth.tokenSecret'),
      })
    }

    async validate(payload: any) {
      if (payload.strategyName !== strategyName) {
        throw new TokenInvalidException()
      }

      return payload
    }
  }

  return AuthStrategy
}

export const AdminAuthStrategy = createAuthStrategy(StrategyName.AdminAuth)
export const WeappAuthStrategy = createAuthStrategy(StrategyName.WeappAuth)
