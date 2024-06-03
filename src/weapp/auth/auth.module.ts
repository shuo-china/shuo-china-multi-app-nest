import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { WeappAuthStrategy } from '@/common/strategies/auth.strategy'

@Module({
  controllers: [AuthController],
  providers: [WeappAuthStrategy, AuthService],
})
export class AuthModule {}
