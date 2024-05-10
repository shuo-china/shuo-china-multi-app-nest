import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

export const AuthStrategyName = 'Admin-Jwt'

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy, AuthStrategyName) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.tokenSecret'),
    })
  }

  validate(payload: any) {
    return { sub: payload.sub, username: payload.username }
  }
}
