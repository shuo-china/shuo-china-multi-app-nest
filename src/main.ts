import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const adapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost))
  app.useStaticAssets(join(__dirname, '..', 'public'))

  await app.listen(process.env.PORT)
}

bootstrap()
