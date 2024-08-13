import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateJobDto } from './dto/create-job.dto'
import { ICompany } from 'src/companies/company.interface'
import { JobWriteRepository } from './model/job-write.repo'
import { JobReadRepository } from './model/job-read.repo'
import aqp from 'api-query-params'
import { deleteCacheIO, getCacheIO, setCacheIO, setCacheIOExpiration } from 'src/utils/cache'
import { UpdateJobDto } from './dto/update-job.dto'
import mongoose from 'mongoose'
import { JobQueue } from './jobs.rabitmq'
import { KEY_JOBS, KEY_JOBS_DELETE, KEY_JOBS_NULL } from 'src/constant/key.redis'

@Injectable()
export class JobsService {
  constructor(
    private readonly jobWriteRepository: JobWriteRepository,
    private readonly jobReadRepository: JobReadRepository,
    private readonly jobQueue: JobQueue
  ) {}
  async createJob(createJobDto: CreateJobDto, company: ICompany) {
    const newJob = await this.jobWriteRepository.createJob(createJobDto, company)
    if (!newJob) {
      throw new HttpException('Tạo job không thành công', HttpStatus.BAD_REQUEST)
    } else {
      this.jobQueue.sendToQueueJob({ action: 'createJob', data: newJob })
      await setCacheIO({ key: `${KEY_JOBS}${newJob._id}`, value: newJob })
    }
    return newJob
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
    if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('Id không hợp lệ', HttpStatus.BAD_REQUEST)

    const jobRedis = await getCacheIO({ key: `${KEY_JOBS}${id}` })
    if (jobRedis) return jobRedis

    const jobMongo = await this.jobReadRepository.getJobWithCompanyById({ _id: id, company })
    if (!jobMongo) {
      await setCacheIOExpiration({ key: `${KEY_JOBS_NULL}${id}`, value: null, expirationInSeconds: 30 })
      throw new HttpException('Công ty không tồn tại', HttpStatus.BAD_REQUEST)
    }
    await setCacheIO({ key: `${KEY_JOBS}${id}`, value: jobMongo })

    return jobMongo
  }

  async updateJob(id: string, updateJobDto: UpdateJobDto, company: ICompany) {
    if (!id) throw new HttpException('Vui lòng truyền lên id', HttpStatus.BAD_REQUEST)
    if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('Id không hợp lệ', HttpStatus.BAD_REQUEST)
    const updated = await this.jobWriteRepository.updateJob(id, updateJobDto, company)
    if (!updated) {
      throw new HttpException('Cập nhật job không thành công', HttpStatus.BAD_REQUEST)
    }
    this.jobQueue.sendToQueueJob({ action: 'updateJob', data: updated })
    await setCacheIO({ key: `${KEY_JOBS}${id}`, value: updated })
    return updated
  }

  async deleteJob({ id, company }: { id: string; company: ICompany }) {
    try {
      if (!id) throw new HttpException('Không tìm thấy id ở url', HttpStatus.BAD_REQUEST)
      if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('Id không h��p lệ', HttpStatus.BAD_REQUEST)
      const deleted = await this.jobWriteRepository.deleteJob({ id, company })
      if (!deleted) throw new HttpException('Xóa công ty không thành công', HttpStatus.BAD_REQUEST)
      this.jobQueue.sendToQueueJob({ action: 'updateJob', data: deleted })
      await deleteCacheIO({ key: `${KEY_JOBS}${id}` })
      await setCacheIO({ key: `${KEY_JOBS_DELETE}${id}`, value: deleted })
      return null
    } catch (error) {
      throw new HttpException('Xóa công ty thất bại', HttpStatus.BAD_REQUEST)
    }
  }
}
