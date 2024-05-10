import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthStrategy } from './auth.strategy'

@Module({
  controllers: [AuthController],
  providers: [AuthStrategy, AuthService],
})
export class AuthModule {}
