import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  public getProfile(id: number) {
    return this.prisma.adminUser.findFirst({ where: { id } })
  }
}
