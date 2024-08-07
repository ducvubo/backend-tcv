import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { CompaniesService } from 'src/companies/companies.service'
import * as crypto from 'crypto'
import { loginCompanyDto } from './dto/loginCompany.dto'
import { CONNECTION_MASTER, CONNECTION_SLAVE } from 'src/constant/connection.config'
import { InjectModel } from '@nestjs/mongoose'
import { RefreshToken, RefreshTokenDocument } from './model/refreshToken.model'
import { Model } from 'mongoose'

@Injectable()
export class AuthCompanyService {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel(RefreshToken.name, CONNECTION_MASTER) private refreshMasterModel: Model<RefreshTokenDocument>,
    @InjectModel(RefreshToken.name, CONNECTION_SLAVE) private refreshSlaveModel: Model<RefreshTokenDocument>
  ) {}

  createAccessToken = (_id: string) => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048
    })
    const access_token = this.jwtService.sign(
      { _id },
      {
        privateKey: privateKey,
        algorithm: 'RS256',
        expiresIn: this.configService.get<string>('JWT_ACCESS_COMPANY_EXPIRE')
      }
    )

    return {
      publicKey,
      access_token
    }
  }

  createRefreshToken = (_id: string) => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048
    })
    const refresh_token = this.jwtService.sign(
      { _id },
      {
        privateKey: privateKey,
        algorithm: 'RS256',
        expiresIn: this.configService.get<string>('JWT_REFRESH_COMPANY_EXPIRE')
      }
    )

    return {
      publicKey,
      refresh_token
    }
  }

  async loginCompany({ company_email, company_password }: loginCompanyDto) {
    const CompanyExis = await this.companiesService.getCompanyByEmail(company_email)
    if (!CompanyExis) throw new HttpException('Email hoặc mật khẩu không đúng vui lòng thử lại', HttpStatus.BAD_REQUEST)

    const isValidPassword = this.companiesService.isValidPassword(company_password, CompanyExis.company_password)
    if (!isValidPassword)
      throw new HttpException('Email hoặc mật khẩu không đúng vui lòng thử lại', HttpStatus.BAD_REQUEST)

    const token = await Promise.all([
      this.createAccessToken(String(CompanyExis._id)),
      this.createRefreshToken(String(CompanyExis._id))
    ])

    const accessPublicKeyString = token[0].publicKey.export({ type: 'spki', format: 'pem' }).toString()
    const refreshPublicKeyString = token[1].publicKey.export({ type: 'spki', format: 'pem' }).toString()

    await this.refreshMasterModel.create({
      rf_company_id: CompanyExis._id,
      rf_refresh_token: token[1].refresh_token,
      rf_public_key_access_token: accessPublicKeyString,
      rf_public_key_refresh_token: refreshPublicKeyString
    })

    return {
      access_token: token[0].access_token,
      refresh_token: token[1].refresh_token
    }
  }
}
