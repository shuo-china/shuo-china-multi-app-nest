import { Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { AdminAuth } from '@/common/decorators/auth.decorator'

@Controller('admin/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login() {
    return this.authService.generateAccessToken({ id: 1, username: 'admin' })
  }

  @Get('profile')
  @AdminAuth()
  getProfile(@CurrentUser() user) {
    return user
  }
}
