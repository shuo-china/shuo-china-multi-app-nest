import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from './prisma/prisma.module'
import { AdminModule } from './admin/admin.module'
import { WeappModule } from './weapp/weapp.module'
import * as configs from '@/configs'
import { isDev } from '@/common/utils/env'
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter'
import { APP_FILTER, APP_PIPE } from '@nestjs/core'
import ValidatePipe from '@/common/pipes/Validate.pipe'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: Object.values(configs),
      envFilePath: isDev() ? '.env.development' : '.env.production',
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('auth.tokenSecret'),
        signOptions: { expiresIn: configService.get('auth.tokenExpiresIn') },
      }),
    }),
    PrismaModule,
    AdminModule,
    WeappModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidatePipe,
    },
  ],
})
export class AppModule {}
