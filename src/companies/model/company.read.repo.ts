import { InjectModel } from '@nestjs/mongoose'
import { Company, CompanyDocument } from './company.schema'
import { CONNECTION_SLAVE } from 'src/constant/connection.config'
import { Model } from 'mongoose'

export class CompanyReadRepository {
  constructor(@InjectModel(Company.name, CONNECTION_SLAVE) private companySlaveModel: Model<CompanyDocument>) {}

  async getCompanyByEmail({ company_email }: { company_email: string }) {
    return this.companySlaveModel.findOne({ company_email: company_email }).exec()
  }
}
