import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TransformIntercaptor } from './core/transform.interceptor'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { initRedis } from './dbs/init.redis'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const reflector = app.get(Reflector)

  const configService = app.get(ConfigService)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  app.useGlobalInterceptors(new TransformIntercaptor(reflector))
  app.useStaticAssets(join(__dirname, '..', 'public'))
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.setViewEngine('ejs')
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    credentials: true
  })
  app.enableCors()
  initRedis()
  await app.listen(configService.get<string>('PORT'))
}
bootstrap()
