import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from './prisma/prisma.module'
import { AdminModule } from './admin/admin.module'
import { WeappModule } from './weapp/weapp.module'
import * as configs from '@/configs'
import { isDev } from '@/common/utils/env'

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
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('auth.tokenSecret'),
          signOptions: { expiresIn: configService.get('auth.tokenExpiresIn') },
        }
      },
    }),
    PrismaModule,
    AdminModule,
    WeappModule,
  ],
})
export class AppModule {}
