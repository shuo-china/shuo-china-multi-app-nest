import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  public generateAccessToken(user: any) {
    const payload = { sub: user.id, username: user.username }

    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign(payload),
      expires_in: this.configService.get('auth.tokenExpiresIn'),
    }
  }
}
