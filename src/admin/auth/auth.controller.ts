import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { AdminAuth } from '@/common/decorators/auth.decorator'
import { LoginDto } from './dtos/login.dto'
import { AdminRoles } from '@/common/decorators/roles.decorator'
import { AdminRole } from '@/common/enums/roles-name.enum'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileLoggerInterceptor } from '@/common/interceptors/file-logger.interceptor'

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
  @UseInterceptors(
    FileInterceptor('files', {
      fileFilter(req, file, cb) {},
    }),
    FileLoggerInterceptor,
  )
  upload(
    @UploadedFile('file')
    file: Express.Multer.File,
  ) {
    return file
  }
}
