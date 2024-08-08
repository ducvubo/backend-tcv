import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateCompanyDto } from './dto/create_company.dto'
import { IUser } from 'src/user/user.interface'
import { CompanyReadRepository } from './model/company.read.repo'
import { CompanyWriteRepository } from './model/company.write.repo'
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import aqp from 'api-query-params'
import mongoose from 'mongoose'
import { getCacheIO, setCacheIOExpiration } from 'src/utils/cache'
import { KEY_COMPANIES_UPDATE } from 'src/constant/key.redis'
import { UpdateCompanyDto } from './dto/update_company.dto'
import { AuthCompanyService } from 'src/auth-company/auth-company.service'

@Injectable()
export class CompaniesService {
  constructor(
    private configService: ConfigService,
    private readonly companyReadRepository: CompanyReadRepository,
    private readonly companyWriteRepository: CompanyWriteRepository,
    @Inject(forwardRef(() => AuthCompanyService))
    private readonly authCompanyService: AuthCompanyService
  ) {}

  getHassPassword = (password: string) => {
    const salt = genSaltSync(10)
    const hash = hashSync(password, salt)
    return hash
  }
  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash)
  }

  async createCompany(createCompanyDto: CreateCompanyDto, user: IUser) {
    const { company_email, company_password } = createCompanyDto

    const companyExist = await this.companyReadRepository.getCompanyByEmail({ company_email })
    if (companyExist) throw new HttpException('Đã có công ty được đăng ký với email này', HttpStatus.CONFLICT)

    const hashPassword = this.getHassPassword(company_password)
    const newCompany = await this.companyWriteRepository.createCompany(
      { ...createCompanyDto, company_password: hashPassword },
      user
    )

    return {
      _id: newCompany._id,
      createdAt: newCompany.createdAt
    }
  }

  async getAllCompanies(currentPage: number, limit: number, qs: string) {
    if (currentPage <= 0 || limit <= 0) {
      throw new HttpException('Trang hiện tại và số record phải lớn hơn 0', HttpStatus.BAD_REQUEST)
    }

    const { filter, sort, population } = aqp(qs)

    delete filter.current
    delete filter.pageSize

    const offset = (+currentPage - 1) * +limit
    const defaultLimit = +limit ? +limit : 10

    const totalItems = (await this.companyReadRepository.getCompanyFilter({ filter })).length
    const totalPages = Math.ceil(totalItems / defaultLimit)

    const result = await this.companyReadRepository.getAllCompany({ filter, offset, defaultLimit, sort, population })

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

  async getCompanyById({ id }: { id: any }) {
    // if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('Id không hợp lệ', HttpStatus.BAD_REQUEST)

    const companyRedis = await getCacheIO({ key: `${KEY_COMPANIES_UPDATE}${id}` })
    if (companyRedis) return companyRedis

    const companyMongo = await this.companyReadRepository.getCompanyById({ _id: id })
    if (!companyMongo) throw new HttpException('Công ty không tồn tại', HttpStatus.BAD_REQUEST)
    const valueCache = companyMongo ? companyMongo : null
    await setCacheIOExpiration({ key: `${KEY_COMPANIES_UPDATE}${id}`, value: valueCache, expirationInSeconds: 30 })

    return companyMongo
  }

  async updateCompany(_id: string, updateCompany: UpdateCompanyDto, user: IUser) {
    if (!_id) throw new HttpException('Id không h��p lệ', HttpStatus.BAD_REQUEST)
    if (!mongoose.Types.ObjectId.isValid(_id)) throw new HttpException('Id không hợp lệ', HttpStatus.BAD_REQUEST)

    const updated = await this.companyWriteRepository.updateCompany(_id, updateCompany, user)
    if (!updated) {
      throw new HttpException('Cập nhật công ty không thành công', HttpStatus.BAD_REQUEST)
    }
    await setCacheIOExpiration({ key: `${KEY_COMPANIES_UPDATE}${_id}`, value: updated, expirationInSeconds: 30 })
    return updated
  }

  async deleteCompany({ id, user }: { id: string; user: IUser }) {
    try {
      if (!id) throw new HttpException('Không tìm thấy id ở url', HttpStatus.BAD_REQUEST)
      if (!mongoose.Types.ObjectId.isValid(id)) throw new HttpException('Id không h��p lệ', HttpStatus.BAD_REQUEST)
      const deleted = await this.companyWriteRepository.deleteCompany({ id, user })
      if (!deleted) throw new HttpException('Xóa công ty không thành công', HttpStatus.BAD_REQUEST)
      this.authCompanyService.deleteToken({ _id: id })
      await setCacheIOExpiration({ key: `${KEY_COMPANIES_UPDATE}${id}`, value: '', expirationInSeconds: 1 })
      return null
    } catch (error) {
      throw new HttpException('Xóa công ty thất bại', HttpStatus.BAD_REQUEST)
    }
  }

  async getCompanyByEmail(email: string) {
    return await this.companyReadRepository.getCompanyByEmail({ company_email: email })
  }
}
