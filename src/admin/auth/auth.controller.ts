import { Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { Public } from '@/common/decorators/public.decorator'
import { AdminAuthGuard } from './auth.guard'

@UseGuards(AdminAuthGuard)
@Controller('admin/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  login() {
    return this.authService.generateAccessToken({ id: 1, username: 'admin' })
  }

  @Get('profile')
  getProfile(@CurrentUser() user) {
    return user
  }
}
