import { Transform, Type } from 'class-transformer'
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested
} from 'class-validator'

class Markdown {
  @IsNotEmpty({ message: 'Text Markdown không được để trống' })
  @IsString({ message: 'Text Markdown phải là chu��i' })
  text: string

  @IsNotEmpty({ message: 'HTML Markdown không được để trống' })
  @IsString({ message: 'HTML Markdown phải là chu��i' })
  html: string
}

export class CreateJobDto {
  @IsNotEmpty({ message: 'Tên công việc không được để trống' })
  @IsString({ message: 'Tên công việc phải là chuỗi' })
  job_name: string

  @IsNotEmpty({ message: 'Lương không được để trống' })
  @IsString({ message: 'Lương phải là chuỗi' })
  job_wage: string

  @IsNotEmpty({ message: 'Địa chỉ ngắn gọn không được để trống' })
  @IsString({ message: 'Địa chỉ ngắn gọn là chuỗi' })
  job_address_summary: string

  @IsNotEmpty({ message: 'Yêu cầu kinh nghiệm không được để trống' })
  @IsString({ message: 'Yêu cầu kinh nghiệm phải là chuỗi' })
  job_exp: string

  @IsNotEmpty({ message: 'Cấp bậc không được để trống' })
  @IsString({ message: 'Cấp bậc phải là chuỗi' })
  job_rank: string

  @IsNotEmpty({ message: 'Số lượng tuyển không được để trống' })
  @IsNumber({}, { message: 'Số lượng tuyển phải là số' })
  job_quantity: string

  @IsNotEmpty({ message: 'Hình thức làm việc không được để trống' })
  @IsString({ message: 'Hình thức làm việc phải là chu��i' })
  job_working_type: string

  @IsNotEmpty({ message: 'Giới tính không được để trống' })
  @IsString({ message: 'Giới tính phải là chu��i' })
  job_gender: string

  @IsNotEmpty({ message: 'Ngày bắt đầu nộp hồ sơ không được để trống' })
  @IsDate({ message: 'Ngày bắt đầu nộp hồ sơ phải là ngày, tháng, năm' })
  @Transform(({ value }) => new Date(value))
  job_start_date: Date

  @IsNotEmpty({ message: 'Ngày kết thúc nộp hồ sơ không được để trống' })
  @IsDate({ message: 'Ngày kết thúc nộp hồ sơ phải là ngày, tháng, năm' })
  @Transform(({ value }) => new Date(value))
  job_end_date: Date

  @IsNotEmpty({ message: 'Ngành nghề không được để trống' })
  @IsArray({ message: 'Ngành nghề phải là mảng' })
  // @ArrayMinSize(1, { message: 'Ngành nghề phải có ít nhất một phần tử' })
  job_career: string[]

  @IsNotEmpty({ message: 'Kỹ năng không được để trống' })
  @IsArray({ message: 'Kỹ năng phải là mảng' })
  // @ArrayMinSize(1, { message: 'Kỹ năng phải có ít nhất một phần tử' })
  job_skills: string[]

  @IsNotEmpty({ message: 'Khu vực làm việc không được để trống' })
  @IsArray({ message: 'Khu vực làm việc phải là mảng' })
  // @ArrayMinSize(1, { message: 'Khu vực làm việc phải có ít nhất một khu vực' })
  job_area: string[]

  @IsNotEmptyObject({}, { message: 'Mô tả công việc không được để trống' })
  @IsObject({ message: 'Mô tả công việc phải là object' })
  @ValidateNested()
  @Type(() => Markdown)
  job_description: Markdown

  @IsNotEmptyObject({}, { message: 'Yêu cầu ứng viên không được để trống' })
  @IsObject({ message: 'Yêu cầu ứng viên phải là object' })
  @ValidateNested()
  @Type(() => Markdown)
  job_requirements: Markdown

  @IsNotEmptyObject({}, { message: 'Quyền lợi ứng viên không được để trống' })
  @IsObject({ message: 'Quyền lợi ứng viên phải là object' })
  @ValidateNested()
  @Type(() => Markdown)
  job_benefits: Markdown

  // @IsNotEmptyObject({}, { message: 'Yêu cầu thêm không được để trống' })
  @IsObject({ message: 'Yêu cầu thêm phải là object' })
  @ValidateNested()
  // @Type(() => Markdown)
  job_additional_requirements: Markdown

  @IsNotEmpty({ message: 'Địa điểm cụ thể không được để trống' })
  @ArrayMinSize(1, { message: 'Địa điểm cụ thể phải có ít nhất một địa điểm' })
  job_specific_location: string[]

  @IsNotEmpty({ message: 'Trạng thái publish không được để trống' })
  @IsBoolean({ message: 'Trạng thái publish phải là boolean' })
  job_isPublished: boolean

  @IsNotEmpty({ message: 'Trạng thái nháp không được để trống' })
  @IsBoolean({ message: 'Trạng thái nháp phải là boolean' })
  job_isDraft: boolean
}
