import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { StrategyName } from '@/common/enums/strategy-name.enum'
import { TokenInvalidException } from '@/common/exceptions/token-invalid.exception'
import { Payload } from '@/admin/auth/auth.service'

@Injectable()
export class AdminAuthStrategy extends PassportStrategy(Strategy, StrategyName.AdminAuth) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.tokenSecret'),
    })
  }

  async validate(payload: Payload) {
    if (payload.strategyName !== StrategyName.AdminAuth) {
      throw new TokenInvalidException()
    }

    return payload
  }
}
