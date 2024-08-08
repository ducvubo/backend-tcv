import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { join } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express'
import { TransformIntercaptor } from './core/transform.interceptor'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe, VersioningType } from '@nestjs/common'
import { initRedis } from './dbs/init.redis'
import * as bodyParser from 'body-parser'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
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

  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2']
  })

  app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
      status: 'error',
      code: statusCode,
      stack: error.stack,
      message: error.message || 'Internal Server Error'
    })
  })

  await app.listen(configService.get<string>('PORT'))
}
bootstrap()
