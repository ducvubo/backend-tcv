import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common'
import { AuthCompanyService } from './auth-company.service'
import { ResponseMessage } from 'src/decorator/customize'
import { loginCompanyDto } from './dto/loginCompany.dto'

@Controller('auth/company')
export class AuthCompanyController {
  constructor(private readonly authCompanyService: AuthCompanyService) {}

  @Post('/login')
  @ResponseMessage('Đăng nhập công ty')
  async login(@Body() body: loginCompanyDto) {
    return await this.authCompanyService.loginCompany(body)
  }
}
