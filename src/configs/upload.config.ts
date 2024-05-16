import { registerAs } from '@nestjs/config'

export default registerAs('upload', () => ({
  imageLimitSize: 1024,
  imageAllowMimes: ['image/jpeg'],
  imageDestination: 'public/uploads',
}))
