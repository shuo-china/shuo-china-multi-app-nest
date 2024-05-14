import { StrategyName } from '@/common/enums/strategy-name.enum'
import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { AdminUser } from '@prisma/client'
import { LoginDto } from './dtos/login.dto'
import { PrismaService } from '@/prisma/prisma.service'
import { verify } from 'argon2'
import { ApiException } from '@/common/exceptions/api.exception'

export interface Payload {
  sub: number
  strategyName: StrategyName
}

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  public async login(dto: LoginDto) {
    const user = await this.prisma.adminUser.findUnique({
      where: {
        username: dto.username,
      },
    })

    if (!user || !(await verify(user.password, dto.password))) {
      throw new ApiException({ code: 'LOGIN_FAIL', message: '用户名或密码不正确' }, HttpStatus.UNAUTHORIZED)
    }

    return this.generateAccessToken(user)
  }

  private generateAccessToken(user: AdminUser) {
    const payload: Payload = { sub: user.id, strategyName: StrategyName.AdminAuth }

    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign(payload),
      expires_in: this.configService.get('auth.tokenExpiresIn'),
    }
  }
}
