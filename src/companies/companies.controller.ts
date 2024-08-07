import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { CreateCompanyDto } from './dto/create_company.dto'
import { ResponseMessage, User } from 'src/decorator/customize'
import { AuthGuardWithSSO } from 'src/guard/authSSO.guard'
import { IUser } from 'src/user/user.interface'
import { UpdateCompanyDto } from './dto/update_company.dto'

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ResponseMessage('Thêm công ty thành công')
  @UseGuards(AuthGuardWithSSO)
  async createCompany(@Body() createCompanyDto: CreateCompanyDto, @User() user: IUser) {
    return await this.companiesService.createCompany(createCompanyDto, user)
  }

  @Get()
  @ResponseMessage('Lấy danh sách công ty')
  @UseGuards(AuthGuardWithSSO)
  async getAllCompanies(@Query('current') currentPage: string, @Query('pageSize') limit: string, @Query() qs: string) {
    return await this.companiesService.getAllCompanies(+currentPage, +limit, qs)
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin công ty theo ID')
  @UseGuards(AuthGuardWithSSO)
  async getCompanyById(@Param('id') id: string) {
    return await this.companiesService.getCompanyById({ id })
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thông tin công ty')
  @UseGuards(AuthGuardWithSSO)
  async updateCompany(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @User() user: IUser) {
    return await this.companiesService.updateCompany(id, updateCompanyDto, user)
  }

  @Delete(':id')
  @ResponseMessage('Xóa công ty theo ID')
  @UseGuards(AuthGuardWithSSO)
  async deleteCompany(@Param('id') id: string, @User() user: IUser) {
    return await this.companiesService.deleteCompany({ id, user })
  }
}
