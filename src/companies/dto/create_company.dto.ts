import { ArrayMinSize, IsArray, IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator'

export class CompanyAddress {
  @IsString({ message: 'Địa chỉ phải là chuỗi' })
  address: string

  @IsString({ message: 'Tọa độ phải là chuỗi' })
  coordinates: string
}

export class CreateCompanyDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsString({ message: 'Email phải là chuỗi' })
  company_email: string

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  // @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng' })
  @IsString({ message: 'Số điện thoại phải là chuỗi' })
  company_phone: string

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    {
      message: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt, và dài ít nhất 8 ký tự'
    }
  )
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  company_password: string

  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  @IsString({ message: 'Tên công ty phải là chuỗi' })
  company_name: string

  @IsNotEmpty({ message: 'Avatar công ty không được để trống' })
  company_avatar: {
    local: string
    cloudinary: string
    custom: string
  }

  @IsNotEmpty({ message: 'Baner công ty không được để trống' })
  company_banner: {
    local: string
    cloudinary: string
    custom: string
  }

  @IsNotEmpty({ message: 'Mô tả công ty không được để trống' })
  company_description: {
    text: string
    html: string
  }

  @IsString({ message: 'Website công ty phải là chuỗi' })
  company_website: string

  @IsNotEmpty({ message: 'Địa chỉ công ty không được để trống' })
  @IsArray({ message: 'Địa chỉ công ty phải là mảng' })
  // @ValidateNested({ each: true })
  // @Type(() => CompanyAddress)
  @ArrayMinSize(1, { message: 'Địa chỉ công ty phải có ít nhất một phần tử' })
  company_address: string[]

  @IsNotEmpty({ message: 'Số lượng nhân viên công ty không được để trống' })
  @IsString({ message: 'Số lượng nhân viên công ty phải là chuỗi' })
  company_employee_total: string

  @IsNotEmpty({ message: 'Lĩnh vực kinh doanh không được để trống' })
  @IsString({ message: 'Lĩnh vực kinh doanh phải là chuỗi' })
  company_business_field: string

  @IsNotEmpty({ message: 'Mã số thuế không được để trống' })
  @IsString({ message: 'Mã số thuế phải là chuỗi' })
  company_code_fiscal: string

  @IsNotEmpty({ message: 'Trạng thái tuyển dụng không được để trống' })
  @IsString({ message: 'Trạng thái tuyển dụng phải là chuỗi' })
  company_recruitment_status: string
}
