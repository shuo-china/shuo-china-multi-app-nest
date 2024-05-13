import { PrismaClient } from '@prisma/client'
import { hash } from 'argon2'
import { create } from './helper'

export default async () => {
  create(async (prisma: PrismaClient) => {
    await prisma.adminUser.create({
      data: {
        username: 'admin',
        password: await hash('123456'),
        roles: {
          create: [
            {
              role: {
                create: {
                  code: 'super',
                  name: '超级管理员',
                },
              },
            },
          ],
        },
      },
    })
  })
}
