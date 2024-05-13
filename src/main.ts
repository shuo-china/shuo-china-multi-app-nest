import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter'
import ValidatePipe from '@/common/pipes/Validate.pipe'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors()
  const adapterHost = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost))
  app.useGlobalPipes(new ValidatePipe())
  app.useStaticAssets(join(__dirname, '..', 'public'))

  await app.listen(process.env.PORT)
}

bootstrap()
