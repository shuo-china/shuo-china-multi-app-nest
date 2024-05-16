import { Body, Controller, Get, Post, UploadedFile } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { AdminAuth } from '@/common/decorators/auth.decorator'
import { LoginDto } from './dtos/login.dto'
import { AdminRoles } from '@/common/decorators/roles.decorator'
import { AdminRole } from '@/common/enums/roles-name.enum'
import { Upload } from '@/common/decorators/upload.decorator'

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

  @Post('upload')
  @Upload()
  upload(
    @UploadedFile('file')
    file: Express.Multer.File,
  ) {
    return file
  }
}
