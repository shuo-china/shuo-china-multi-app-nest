import { registerAs } from '@nestjs/config'

export default registerAs('upload', () => ({
  imageLimitSize: '2M',
  imageAllowMimes: 'image/*',
  destination: 'public/uploads',
}))
