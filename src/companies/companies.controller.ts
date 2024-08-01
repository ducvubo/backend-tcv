import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { CreateCompanyDto } from './dto/create_company.dto'
import { ResponseMessage, User } from 'src/decorator/customize'
import { AuthGuardWithSSO } from 'src/guard/authSSO.guard'
import { IUser } from 'src/user/user.interface'

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ResponseMessage('Thêm công ty thành công')
  @UseGuards(AuthGuardWithSSO)
  async createCompany(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return await this.companiesService.createCompany(createCompanyDto, user)
  }
}
