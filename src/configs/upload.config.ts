import { registerAs } from '@nestjs/config'

export default registerAs('upload', () => ({
  maxSize: 1024,
  allowMime: ['image/jpeg'],
  allowExt: ['jpg'],
  destination: 'public/uploads',
}))
