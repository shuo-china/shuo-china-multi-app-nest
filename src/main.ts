import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter'
import ValidatePipe from '@/common/pipes/Validate.pipe'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const adapterHost = app.get(HttpAdapterHost)

  app.useGlobalFilters(new AllExceptionsFilter(adapterHost))
  app.useGlobalPipes(new ValidatePipe())
  app.useStaticAssets('public', { prefix: '/public' })
  app.enableCors()

  await app.listen(process.env.PORT)
}

bootstrap()
