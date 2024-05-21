import { registerAs } from '@nestjs/config'

export default registerAs('upload', () => ({
  imageLimitSize: '2MB',
  imageAllowMimes: 'image/*',
  destination: 'public/uploads',
}))
