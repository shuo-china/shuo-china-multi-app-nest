import { AdminAuth } from '@/common/decorators/auth.decorator'
import { Upload, UploadImage } from '@/common/decorators/upload.decorator'
import { Controller, Post, UploadedFile } from '@nestjs/common'

@AdminAuth()
@Controller('admin/upload')
export class UploadController {
  @Post('upload')
  @Upload()
  upload(
    @UploadedFile('file')
    file: Express.Multer.File,
  ) {
    return file
  }

  @Post('upload_image')
  @UploadImage()
  uploadImage(
    @UploadedFile('file')
    file: Express.Multer.File,
  ) {
    return file
  }
}
