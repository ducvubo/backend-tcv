import { InjectModel } from '@nestjs/mongoose'
import { Company, CompanyDocument } from './company.schema'
import { CONNECTION_SLAVE } from 'src/constant/connection.config'
import mongoose, { Model } from 'mongoose'
import { HttpException, HttpStatus } from '@nestjs/common'

export class CompanyReadRepository {
  constructor(@InjectModel(Company.name, CONNECTION_SLAVE) private companySlaveModel: Model<CompanyDocument>) {}

  async getCompanyByEmail({ company_email }: { company_email: string }) {
    return this.companySlaveModel.findOne({ company_email: company_email }).exec()
  }

  async getCompanyFilter({ filter }) {
    if (filter._id && !mongoose.Types.ObjectId.isValid(filter._id)) {
      throw new HttpException('Id không đúng định dạng', HttpStatus.BAD_REQUEST)
    }
    return this.companySlaveModel
      .find({ ...filter, isDeleted: false })
      .select('-company_password')
      .exec()
  }

  async getAllCompany({ filter, offset, defaultLimit, sort, population }) {
    if (filter._id && !mongoose.Types.ObjectId.isValid(filter._id)) {
      throw new HttpException('Id không đúng định dạng', HttpStatus.BAD_REQUEST)
    }
    return this.companySlaveModel
      .find({
        isDeleted: false,
        ...filter
      })
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any) //ep kieu du lieu
      .populate(population)
      .exec()
  }

  async getCompanyById({ _id }: { _id: string }) {
    return this.companySlaveModel
      .findById(_id)
      .select('-company_password -createdAt -createdBy -updatedAt -__v -isDeleted')
      .exec()
  }
}
