import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { Company } from 'src/companies/model/company.schema'
import { SampleSchema } from 'src/utils/sample.schema'
// import { Role } from 'src/roles/schemas/role.schema'

export type JobDocument = HydratedDocument<Job>

@Schema({ timestamps: true })
export class Job extends SampleSchema {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name, required: true })
  job_company_id: mongoose.Schema.Types.ObjectId

  @Prop({ type: String, required: true })
  job_name: string

  @Prop({ type: String })
  job_slug: string

  //lương
  @Prop({ type: String, required: true })
  job_wage: string

  //địa chỉ ngắn gọn
  @Prop({ type: String, required: true })
  job_address_summary: string

  //yêu cầu kinh nghiệm
  @Prop({ type: String, required: true })
  job_exp: string

  //chức vụ
  @Prop({ type: String, required: true })
  job_rank: string

  //số lượng tuyển
  @Prop({ type: Number, required: true })
  job_quantity: number

  //hình thức làm việc
  @Prop({ type: String, required: true })
  job_working_type: string

  //giới tính
  @Prop({ type: String, required: true })
  job_gender: string

  //ngày bắt đầu ứng tuyển
  @Prop({ type: Date, required: true })
  job_start_date: Date

  //ngày hết hạn ứng tuyển
  @Prop({ type: Date, required: true })
  job_end_date: Date

  //ngành nghề
  @Prop({ type: Array, required: true })
  job_career: string[]

  //kỹ năng cần có
  @Prop({ type: Array, required: true })
  job_skills: string[]

  //khu vực
  @Prop({ type: Array, required: true })
  job_area: string[]

  //mô tả công việc
  @Prop({ type: Object, required: true })
  job_description: {
    text: string
    html: string
  }

  //yêu cầu ứng viên
  @Prop({ type: Object, required: true })
  job_requirements: {
    text: string
    html: string
  }

  //quyền lợi
  @Prop({ type: Object, required: true })
  job_benefits: {
    text: string
    html: string
  }

  //tiêu chí phụ đi kèm
  @Prop({ type: Object, required: true })
  job_additional_requirements: {
    text: string
    html: string
  }

  //địa điểm làm việc cụ thể
  @Prop({ type: Array, required: true })
  job_specific_location: string[]

  //trạng thái publish
  @Prop({ type: Boolean, required: true, default: false })
  job_isPublished: boolean

  //trạng thái nháp
  @Prop({ type: Boolean, required: true, default: true })
  job_isDraft: boolean

  //trạng thái job ['chờ duyệt','đã duyệt','không được duyệt']
  @Prop({ type: String, required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' })
  job_status: string

  //trạng thái job ['chờ đăng','đang tuyển','đã hết hạn'] | chuyển sang tiếng anh cho tôi copilot ơi
  @Prop({ type: String, required: true, enum: ['draft', 'applying', 'expired'], default: 'draft' })
  job_publish_status: string
}

export const JobSchema = SchemaFactory.createForClass(Job)
