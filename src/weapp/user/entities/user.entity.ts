import { AdminUser } from '@prisma/client'
import { Exclude } from 'class-transformer'

export default class UserInfo {
  @Exclude()
  password: string

  constructor(partial: Partial<AdminUser> = {}) {
    Object.assign(this, partial)
  }
}
