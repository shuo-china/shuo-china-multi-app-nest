import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { appName } from './auth.service'
import { TokenInvalidException } from '@/common/exceptions/token-invalid.exception'
import { StrategyName } from '@/common/enums/strategy-name.enum'
export const AuthStrategyName = 'Admin-Jwt'

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, StrategyName.AdminJWT) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.tokenSecret'),
    })
  }

  validate(payload: any) {
    if (payload.appName !== appName) {
      throw new TokenInvalidException()
    }
    return { sub: payload.sub }
  }
}
