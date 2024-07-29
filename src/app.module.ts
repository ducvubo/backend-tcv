import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { MongooseModule } from '@nestjs/mongoose'
import { CheckSignMiddleware } from './middleware/checkSign.middleware'
import { CacheModule } from '@nestjs/cache-manager'
import * as redisStore from 'cache-manager-ioredis'
import { CONNECTION_MASTER, CONNECTION_SLAVE } from './constant/connection.config'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      connectionName: CONNECTION_MASTER,
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL_MASTER')
      })
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      connectionName: CONNECTION_SLAVE,
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL_SLAVE')
      })
    }),
    CacheModule.register({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      store: redisStore,
      host: 'localhost',
      port: 6379
      // ttl: 1000
    }),

    UserModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckSignMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
