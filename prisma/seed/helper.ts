import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const create = async (callback: (prisma: PrismaClient) => Promise<any>, count = 1) => {
  for (let i = 0; i < count; i++) {
    await callback(prisma)
  }
}
