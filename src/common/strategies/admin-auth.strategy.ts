import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { StrategyName } from '@/common/enums/strategy-name.enum'
import { TokenInvalidException } from '@/common/exceptions/token-invalid.exception'
import { Payload } from '@/admin/auth/auth.service'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class AdminAuthStrategy extends PassportStrategy(Strategy, StrategyName.AdminJWT) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('auth.tokenSecret'),
    })
  }

  async validate(payload: Payload) {
    if (payload.strategyName !== StrategyName.AdminJWT) {
      throw new TokenInvalidException()
    }

    const dbUser = await this.prisma.adminUser.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        username: true,
        roles: {
          include: {
            role: true,
          },
        },
      },
    })

    if (!dbUser) {
      throw new TokenInvalidException()
    }

    const user = {
      sub: dbUser.id,
      roles: dbUser.roles.map((r) => r.role.code),
    }

    return user
  }
}
