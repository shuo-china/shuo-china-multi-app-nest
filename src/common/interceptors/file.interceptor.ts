import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileInterceptor } from '@nestjs/platform-express'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { diskStorage } from 'multer'
import { extname } from 'path'
import dayjs from 'dayjs'
import { mkdirsSync } from '@/common/utils/file'
import { v4 as uuidv4 } from 'uuid'
import bytes from 'bytes'
import { Observable } from 'rxjs'

export function fileFilter(mimetypes?: string[] | string): MulterOptions['fileFilter'] {
  return (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (mimetypes) {
      if (typeof mimetypes === 'string') {
        mimetypes = [mimetypes]
      }
      const result = mimetypes.some((t) => {
        if (t.slice(-1) === '*') {
          return file.mimetype.startsWith(t.slice(0, -1))
        } else {
          return file.mimetype === t
        }
      })

      if (!result) {
        callback(new UnsupportedMediaTypeException(`不支持的文件类型,当前支持${mimetypes.join(',')}`), false)
        return
      }
    }

    callback(null, true)
  }
}

export function limits(fileSize: string): MulterOptions['limits'] {
  return {
    fileSize: bytes(fileSize),
  }
}

export function UploadInterceptor(fieldName: string, options?: (configService: ConfigService) => MulterOptions) {
  @Injectable()
  class Interceptor extends FileInterceptor(fieldName) {
    public multer: any

    constructor(@Inject(ConfigService) public configService: ConfigService) {
      const defaultOptions: MulterOptions = {
        storage: diskStorage({
          destination: function (req, file, cb) {
            const dirName = configService.get('upload.destination') + '/' + dayjs().format('YYYYMMDD')
            mkdirsSync(dirName)
            cb(null, dirName)
          },
          filename: function (req, file, cb) {
            const path = uuidv4() + Date.now() + extname(file.originalname)
            cb(null, path)
          },
        }),
      }

      super({ ...defaultOptions, ...options?.(configService) })
    }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      try {
        return await super.intercept(context, next)
      } catch (error) {
        if (error instanceof PayloadTooLargeException) {
          throw new PayloadTooLargeException(`文件过大,不能超过${bytes(this.multer.limits.fileSize)}`)
        }
        throw error
      }
    }
  }

  return Interceptor
}
