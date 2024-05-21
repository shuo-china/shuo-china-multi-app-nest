import { NestExpressApplication } from '@nestjs/platform-express'
import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ClassSerializerInterceptor } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.useStaticAssets('public', { prefix: '/public' })
  app.enableCors()

  await app.listen(process.env.PORT)
}

bootstrap()
