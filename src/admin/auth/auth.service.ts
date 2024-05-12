import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { user } from '@prisma/client'

export interface Payload {
  sub: number
  strategyName: string
}

export const StrategyName = 'Admin-JWT'

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  public generateAccessToken(user: Pick<user, 'id' | 'username'>) {
    const payload: Payload = { sub: user.id, strategyName: StrategyName }

    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign(payload),
      expires_in: this.configService.get('auth.tokenExpiresIn'),
    }
  }
}
