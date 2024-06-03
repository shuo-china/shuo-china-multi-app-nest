import { AdminAuth } from '@/common/decorators/auth.decorator'
import { Upload, UploadImage } from '@/common/decorators/upload.decorator'
import { ValidateException } from '@/common/exceptions/validate.exception'
import { Controller, Post, UploadedFile } from '@nestjs/common'

@AdminAuth()
@Controller('admin/upload')
export class UploadController {
  @Post('file')
  @Upload()
  upload(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new ValidateException('上传字段不能为空', 'file')
    }
    return file
  }

  @Post('image')
  @UploadImage()
  uploadImage(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new ValidateException('上传字段不能为空', 'file')
    }
    return file
  }
}
