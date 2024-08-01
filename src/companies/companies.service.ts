import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CreateCompanyDto } from './dto/create_company.dto'
import { IUser } from 'src/user/user.interface'
import { CompanyReadRepository } from './model/company.read.repo'
import { CompanyWriteRepository } from './model/company.write.repo'
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'

@Injectable()
export class CompaniesService {
  constructor(
    private configService: ConfigService,
    private readonly companyReadRepository: CompanyReadRepository,
    private readonly companyWriteRepository: CompanyWriteRepository
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
}
