import { Module } from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { CompaniesController } from './companies.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { Company, CompanySchema } from './model/company.schema'
import { CONNECTION_MASTER, CONNECTION_SLAVE } from 'src/constant/connection.config'
import { UserModule } from 'src/user/user.module'
import { CompanyReadRepository } from './model/company.read.repo'
import { CompanyWriteRepository } from './model/company.write.repo'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }], CONNECTION_MASTER),
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }], CONNECTION_SLAVE),
    ConfigModule,
    UserModule
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, CompanyReadRepository, CompanyWriteRepository]
})
export class CompaniesModule {}
