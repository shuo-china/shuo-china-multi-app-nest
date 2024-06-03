import { registerAs } from '@nestjs/config'

export default registerAs('weapp', () => ({
  appId: 'wx31ccfafb7c027857',
  appSecret: 'ff60c1fce68c1ddbf5beb8d0f1107ed1',
}))
