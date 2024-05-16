import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  Optional,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileInterceptor, MulterModuleOptions } from '@nestjs/platform-express'
import { MULTER_MODULE_OPTIONS } from '@nestjs/platform-express/multer/files.constants'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { diskStorage } from 'multer'
import { extname } from 'path'
import dayjs from 'dayjs'
import { mkdirsSync } from '@/common/utils/file'
import { v4 as uuidv4 } from 'uuid'
import { PrismaService } from '@/prisma/prisma.service'

function validate(mimetypes: string[], limitSize: number): MulterOptions['fileFilter'] {
  return (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (!mimetypes.some((t) => file.mimetype.startsWith(t))) {
      callback(new UnsupportedMediaTypeException('不支持的文件类型'), false)
      return
    }

    if (file.size > limitSize) {
      callback(new PayloadTooLargeException(`文件过大，不能超过1B`), false)
      return
    }

    callback(null, true)
  }
}

export function createFileInterceptor(fieldName: string, options?: (configService: ConfigService) => MulterOptions) {
  @Injectable()
  class Interceptor extends FileInterceptor(fieldName) {
    constructor(@Inject(ConfigService) public configService: ConfigService) {
      super(options(configService))
    }
  }

  return Interceptor
}

// const options: MulterOptions = {
//     fileFilter: validate(['image'], 1),
//     storage: diskStorage({
//       destination: function (req, file, cb) {
//         const dirName = configService.get('upload.imageDestination') + '/' + dayjs().format('YYYYMMDD')
//         mkdirsSync(dirName)
//         cb(null, dirName)
//       },
//       filename: function (req, file, cb) {
//         const path = uuidv4() + Date.now() + extname(file.originalname)
//         cb(null, path)
//       },
//     }),
//   }
