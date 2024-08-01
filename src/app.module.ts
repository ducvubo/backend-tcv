import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { MongooseModule } from '@nestjs/mongoose'
import { CheckSignMiddleware } from './middleware/checkSign.middleware'
import { CONNECTION_MASTER, CONNECTION_SLAVE } from './constant/connection.config'
import { CompaniesModule } from './companies/companies.module'
import { UploadModule } from './upload/upload.module'

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
    UserModule,
    CompaniesModule,
    UploadModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CheckSignMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}
// export class AppModule {}
