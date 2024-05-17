import { Inject, Injectable, PayloadTooLargeException, UnsupportedMediaTypeException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FileInterceptor } from '@nestjs/platform-express'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { diskStorage } from 'multer'
import { extname } from 'path'
import dayjs from 'dayjs'
import { mkdirsSync } from '@/common/utils/file'
import { v4 as uuidv4 } from 'uuid'
import bytes from 'bytes'

export function fileFilter(mimetypes?: string[] | string, limitSize?: number): MulterOptions['fileFilter'] {
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

    if (limitSize && file.size > bytes(limitSize)) {
      callback(new PayloadTooLargeException(`文件过大，不能超过${limitSize}`), false)
      return
    }

    callback(null, true)
  }
}

export function UploadInterceptor(fieldName: string, options?: (configService: ConfigService) => MulterOptions) {
  @Injectable()
  class Interceptor extends FileInterceptor(fieldName) {
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
  }

  return Interceptor
}
