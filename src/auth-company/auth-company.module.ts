import { Module } from '@nestjs/common'
import { AuthCompanyService } from './auth-company.service'
import { AuthCompanyController } from './auth-company.controller'
import { CompaniesModule } from 'src/companies/companies.module'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { RefreshToken, RefreshTokenSchema } from './model/refreshToken.model'
import { CONNECTION_MASTER, CONNECTION_SLAVE } from 'src/constant/connection.config'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    CompaniesModule,
    ConfigModule,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }], CONNECTION_MASTER),
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }], CONNECTION_SLAVE)
  ],
  controllers: [AuthCompanyController],
  providers: [AuthCompanyService]
})
export class AuthCompanyModule {}
