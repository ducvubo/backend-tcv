import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateJobDto } from './dto/create-job.dto'
import { ICompany } from 'src/companies/company.interface'
import { JobWriteRepository } from './model/job-write.repo'
import { JobReadRepository } from './model/job-read.repo'
import aqp from 'api-query-params'
import { getCacheIO, setCacheIOExpiration } from 'src/utils/cache'
import { KEY_JOBS_UPDATE } from 'src/constant/key.redis'
import { UpdateJobDto } from './dto/update-job.dto'
import mongoose from 'mongoose'
import { JobQueue } from './jobs.rabitmq'

@Injectable()
export class JobsService {
  constructor(
    private readonly jobWriteRepository: JobWriteRepository,
    private readonly jobReadRepository: JobReadRepository,
  ) {}
  async createJob(createJobDto: CreateJobDto, company: ICompany) {
    return await this.jobWriteRepository.createJob(createJobDto, company)
  }

  async getAllJobWithCompany(currentPage: number, limit: number, qs: string, company: ICompany) {
    if (currentPage <= 0 || limit <= 0) {
      throw new HttpException('Trang hiện tại và số record phải lớn hơn 0', HttpStatus.BAD_REQUEST)
    }

    const { filter, sort, population } = aqp(qs)

    delete filter.current
    delete filter.pageSize

    const offset = (+currentPage - 1) * +limit
    const defaultLimit = +limit ? +limit : 10

    const totalItems = (await this.jobReadRepository.getJobWithCompanyFilter({ filter, company })).length
    const totalPages = Math.ceil(totalItems / defaultLimit)

    const result = await this.jobReadRepository.getJobWithCompany({
      filter,
      offset,
      defaultLimit,
      sort,
      population,
      company
    })

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        totalItems: totalItems
      },
      result
    }
  }

  async getJobWithCompanyById({ id, company }: { id: any; company: ICompany }) {
    // if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('Id không hợp lệ', HttpStatus.BAD_REQUEST)

    const companyRedis = await getCacheIO({ key: `${KEY_JOBS_UPDATE}${id}` })
    if (companyRedis) return companyRedis

    const companyMongo = await this.jobReadRepository.getJobWithCompanyById({ _id: id, company })
    if (!companyMongo) throw new HttpException('Công ty không tồn tại', HttpStatus.BAD_REQUEST)
    const valueCache = companyMongo ? companyMongo : null
    await setCacheIOExpiration({ key: `${KEY_JOBS_UPDATE}${id}`, value: valueCache, expirationInSeconds: 30 })

    return companyMongo
  }

  async updateJob(id: string, updateJobDto: UpdateJobDto, company: ICompany) {
    if (!id) throw new HttpException('Vui lòng truyền lên id', HttpStatus.BAD_REQUEST)
    if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('Id không hợp lệ', HttpStatus.BAD_REQUEST)
    const updated = await this.jobWriteRepository.updateJob(id, updateJobDto, company)
    if (!updated) {
      throw new HttpException('Cập nhật job không thành công', HttpStatus.BAD_REQUEST)
    }
    await setCacheIOExpiration({ key: `${KEY_JOBS_UPDATE}${id}`, value: updated, expirationInSeconds: 30 })
    return updated
  }

  async deleteJob({ id, company }: { id: string; company: ICompany }) {
    try {
      if (!id) throw new HttpException('Không tìm thấy id ở url', HttpStatus.BAD_REQUEST)
      if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('Id không h��p lệ', HttpStatus.BAD_REQUEST)
      const deleted = await this.jobWriteRepository.deleteJob({ id, company })
      if (!deleted) throw new HttpException('Xóa công ty không thành công', HttpStatus.BAD_REQUEST)
      await setCacheIOExpiration({ key: `${KEY_JOBS_UPDATE}${id}`, value: '', expirationInSeconds: 1 })
      return null
    } catch (error) {
      throw new HttpException('Xóa công ty thất bại', HttpStatus.BAD_REQUEST)
    }
  }
}
