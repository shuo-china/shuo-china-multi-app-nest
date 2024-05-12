import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService, Payload, StrategyName } from './auth.service'
import { createAuthStrategy } from '@/common/auth'
import { ConfigService } from '@nestjs/config'

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: 's',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const test = createAuthStrategy(StrategyName, (payload: Payload) => {
          return { sub: payload.sub }
        })
        new test(configService)
      },
    },

    AuthService,
  ],
})
export class AuthModule {}
