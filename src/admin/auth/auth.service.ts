import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { user } from '@prisma/client'

interface Payload {
  sub: number
  appName: string
}

export const appName = 'admin'

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  public generateAccessToken(user: Pick<user, 'id' | 'username'>) {
    const payload: Payload = { sub: user.id, appName: 'admin' }

    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign(payload),
      expires_in: this.configService.get('auth.tokenExpiresIn'),
    }
  }
}
