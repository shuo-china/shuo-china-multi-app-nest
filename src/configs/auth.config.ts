import { registerAs } from '@nestjs/config'

export default registerAs('auth', () => ({
  tokenSecret: 'yLXKsxpCYVsi',
  tokenExpiresIn: '2h',
}))
