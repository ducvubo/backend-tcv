import { InjectModel } from '@nestjs/mongoose'
import { CONNECTION_SLAVE } from 'src/constant/connection.config'
import mongoose, { Model } from 'mongoose'
import { Job, JobDocument } from './job.model'
import { HttpException, HttpStatus } from '@nestjs/common'
import { ICompany } from 'src/companies/company.interface'

export class JobReadRepository {
  constructor(@InjectModel(Job.name, CONNECTION_SLAVE) private jobSlaveModel: Model<JobDocument>) {}

  async getJobWithCompanyFilter({ filter, company }) {
    if (filter._id && !mongoose.Types.ObjectId.isValid(filter._id)) {
      throw new HttpException('Id không đúng định dạng', HttpStatus.BAD_REQUEST)
    }
    return this.jobSlaveModel.find({ ...filter, isDeleted: false, job_company_id: company._id }).exec()
  }

  async getJobWithCompany({ filter, offset, defaultLimit, sort, population, company }) {
    if (filter._id && !mongoose.Types.ObjectId.isValid(filter._id)) {
      throw new HttpException('Id không đúng định dạng', HttpStatus.BAD_REQUEST)
    }
    return this.jobSlaveModel
      .find({
        isDeleted: false,
        job_company_id: company._id,
        ...filter
      })
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any) //ep kieu du lieu
      .populate(population)
      .exec()
  }

  async getJobWithCompanyById({ _id: id, company }: { _id: string; company: ICompany }) {
    return this.jobSlaveModel
      .findOne({ _id: id, job_company_id: company._id, isDeleted: false })

      .select('-createdAt -createdBy -updatedAt -__v -isDeleted')
      .exec()
  }
}
