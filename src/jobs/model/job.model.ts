import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { Company } from 'src/companies/model/company.schema'
import { SampleSchema } from 'src/utils/sample.schema'
// import { Role } from 'src/roles/schemas/role.schema'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User extends SampleSchema {
  @Prop({ type: Types.ObjectId, ref: Company.name, required: true })
  jb_company_id: string

  // @Prop()
}

export const UserSchema = SchemaFactory.createForClass(User)
