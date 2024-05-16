import { PayloadTooLargeException, UnsupportedMediaTypeException, UseInterceptors } from '@nestjs/common'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { createFileInterceptor } from '../interceptors/file.interceptor'
import { FileLoggerInterceptor } from '../interceptors/file-logger.interceptor'

function filterFilter(mimetypes: string[], limitSize: number): MulterOptions['fileFilter'] {
  return (req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    if (!mimetypes.some((t) => file.mimetype.startsWith(t))) {
      callback(new UnsupportedMediaTypeException('不支持的文件类型'), false)
      return
    }

    if (file.size > limitSize) {
      callback(new PayloadTooLargeException(`文件过大，不能超过(1000)}`), false)
      return
    }

    callback(null, true)
  }
}

// export function Upload(fieldName = 'file', options?: MulterOptions) {
//   return UseInterceptors(
//     FileInterceptor(fieldName, {
//       fileFilter: filterFilter(['image'], 1),
//     }),
//     FileLoggerInterceptor,
//   )
// }

export function Upload(fieldName = 'file', options?: MulterOptions) {
  return UseInterceptors(createFileInterceptor(fieldName, options))
}
