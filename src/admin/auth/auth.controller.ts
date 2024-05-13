import { Body, Controller, Get, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { AdminAuth } from '@/common/decorators/admin-auth.decorator'
import { LoginDto } from './dtos/login.dto'
import { AdminRoles } from '@/common/decorators/admin-roles.decorator'
import { AdminRole } from '@/common/enums/role-name.enum'

@Controller('admin/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }

  @Get('profile')
  @AdminRoles(AdminRole.Super)
  @AdminAuth()
  getProfile(@CurrentUser() user) {
    return user
  }
}
