import { isDev } from '@/common/utils/env'
import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super(isDev() ? { log: ['query', 'info', 'warn', 'error'] } : undefined)
  }
}
