import { PrismaService } from '@/prisma/prisma.service'
import { NestInterceptor, ExecutionContext, CallHandler, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { extname } from 'path'
import sizeOf from 'image-size'
import { Prisma } from '@prisma/client'

@Injectable()
export class FileLoggerInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest()
    const file = req.file as Express.Multer.File

    const data: Prisma.FileCreateInput = {
      originalName: file.originalname,
      fileName: file.filename,
      path: file.path,
      extension: extname(file.originalname),
      mime: file.mimetype,
      size: file.size,
      isImage: file.mimetype.startsWith('image/'),
    }

    if (data.isImage) {
      const { width, height } = sizeOf(file.path)
      data.width = width
      data.height = height
    }

    req.file = await this.prisma.file.create({
      data,
    })

    return next.handle()
  }
}
