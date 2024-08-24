import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { JobsService } from './jobs.service'
import { Company, ResponseMessage } from 'src/decorator/customize'
import { AuthGuardCompany } from 'src/guard/authCompany.guard'
import { CreateJobDto } from './dto/create-job.dto'
import { ICompany } from 'src/companies/company.interface'
import { UpdateJobDto } from './dto/update-job.dto'
import { ElasticsearchService } from '@nestjs/elasticsearch'

@Controller('jobs')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  @Post()
  @ResponseMessage('Tạo tin tuyển dụng mới')
  @UseGuards(AuthGuardCompany)
  async createJob(@Body() createJobDto: CreateJobDto, @Company() company: ICompany) {
    // console.log(createJobDto)
    return await this.jobsService.createJob(createJobDto, company)
  }

  @Get()
  @ResponseMessage('Lấy danh sách job của công ty')
  @UseGuards(AuthGuardCompany)
  async getAllJobWithCompany(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
    @Company() company: ICompany
  ) {
    return await this.jobsService.getAllJobWithCompany(+currentPage, +limit, qs, company)
  }

  @Get(':id')
  @ResponseMessage('Lấy thông tin job theo công ty và ID')
  @UseGuards(AuthGuardCompany)
  async getCompanyById(@Param('id') id: string, @Company() company: ICompany) {
    return await this.jobsService.getJobWithCompanyById({ id, company })
  }

  @Patch(':id')
  @ResponseMessage('Cập nhật thông tin job')
  @UseGuards(AuthGuardCompany)
  async updateCompany(@Param('id') id: string, @Body() upDateJobDto: UpdateJobDto, @Company() company: ICompany) {
    return await this.jobsService.updateJob(id, upDateJobDto, company)
  }

  @Delete(':id')
  @ResponseMessage('Xóa job theo ID')
  @UseGuards(AuthGuardCompany)
  async deleteCompany(@Param('id') id: string, @Company() company: ICompany) {
    return await this.jobsService.deleteJob({ id, company })
  }

  @Get('test')
  @ResponseMessage('Test rabitmq')
  async test() {
    return {
      message: 'Test rabitmq'
    }
  }

  // @Post('test1')
  // @ResponseMessage('Test elastic search')
  // async search(q: string) {
  //   try {
  //     const result = await this.elasticsearchService.search({
  //       index: 'els_jobsearchcompanies'
  //     })
  //     // const result = await this.elasticsearchService.indices.delete({
  //     //   index:
  //     // })
  //     return result
  //   } catch (error) {
  //     console.log('error', error)
  //   }
  // }
}
