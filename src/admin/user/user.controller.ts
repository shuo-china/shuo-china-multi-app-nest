import { AdminAuth } from '@/common/decorators/auth.decorator'
import { CurrentUser } from '@/common/decorators/current-user.decorator'
import { Controller, Get } from '@nestjs/common'
import { UserService } from './user.service'
import UserInfo from './entities/user.entity'

@AdminAuth()
@Controller('admin/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async profile(@CurrentUser() user) {
    const dbUser = await this.userService.getProfile(user.id)
    return new UserInfo(dbUser)
  }
}
