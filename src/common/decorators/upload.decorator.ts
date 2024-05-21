import { UseInterceptors } from '@nestjs/common'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { UploadInterceptor, fileFilter, limits } from '@/common/interceptors/file.interceptor'
import { ConfigService } from '@nestjs/config'
import { FileLoggerInterceptor } from '@/common/interceptors/file-logger.interceptor'

export function Upload(fieldName = 'file', options?: (configService: ConfigService) => MulterOptions) {
  return UseInterceptors(UploadInterceptor(fieldName, options), FileLoggerInterceptor)
}

export function UploadImage(fieldName = 'file', options?: (configService: ConfigService) => MulterOptions) {
  return Upload(fieldName, (configService) => ({
    fileFilter: fileFilter(configService.get('upload.imageAllowMimes')),
    limits: limits(configService.get('upload.imageLimitSize')),
    ...options?.(configService),
  }))
}
