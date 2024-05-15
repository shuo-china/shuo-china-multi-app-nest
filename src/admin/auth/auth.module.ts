import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AdminAuthStrategy } from '@/common/strategies/auth.strategy'

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AdminAuthStrategy, AuthService],
})
export class AuthModule {}
