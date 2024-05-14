import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from './prisma/prisma.module'
import { AdminModule } from './admin/admin.module'
import { WeappModule } from './weapp/weapp.module'
import * as configs from '@/configs'
import { isDev } from '@/common/utils/env'
import { MulterModule as _MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import dayjs from 'dayjs'
import { mkdirsSync } from './common/utils/file'
import { v4 as uuidv4 } from 'uuid'

const MulterModule = _MulterModule.registerAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    storage: diskStorage({
      destination: function (req, file, cb) {
        const dirName = configService.get('upload.destination') + '/' + dayjs().format('YYYYMMDD')
        mkdirsSync(dirName)
        cb(null, dirName)
      },
      filename: function (req, file, cb) {
        const path = uuidv4() + Date.now() + extname(file.originalname)
        cb(null, path)
      },
    }),
  }),
})
MulterModule.global = true

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
    MulterModule,
    PrismaModule,
    AdminModule,
    WeappModule,
  ],
})
export class AppModule {}
