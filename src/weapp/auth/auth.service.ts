import { StrategyName } from '@/common/enums/strategy-name.enum'
import { PrismaService } from '@/prisma/prisma.service'
import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { WeappUser } from '@prisma/client'
import { LoginDto } from './dtos/login.dto'
import axios from 'axios'
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

  async login(dto: LoginDto) {
    const result = await axios({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      params: {
        appid: this.configService.get('weapp.appId'),
        secret: this.configService.get('weapp.appSecret'),
        js_code: dto.code,
        grant_type: 'authorization_code',
      },
    })

    if (result.data.errcode) {
      throw new ApiException({ code: 'LOGIN_FAIL', message: result.data.errmsg }, HttpStatus.UNAUTHORIZED)
    }

    const openid = result.data.openid

    let user = await this.prisma.weappUser.findFirst({ where: { openid } })

    if (!user) {
      user = await this.register(openid)
    }

    return this.generateAccessToken(user)
  }

  private async register(openid: string) {
    return await this.prisma.weappUser.create({
      data: {
        openid,
      },
    })
  }

  private generateAccessToken(user: WeappUser) {
    const payload: Payload = { sub: user.id, strategyName: StrategyName.WeappAuth }

    return {
      token_type: 'Bearer',
      access_token: this.jwtService.sign(payload),
      expires_in: this.configService.get('auth.tokenExpiresIn'),
    }
  }
}
