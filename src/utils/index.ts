import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

export const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds)
}

export const generateSlug = (input: string): string => {
  // Chuyển chuỗi thành chữ thường và loại bỏ dấu tiếng Việt
  const slug = input
    .toLowerCase()
    .normalize('NFD') // Chuẩn hóa chuỗi
    .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
    .replace(/[^a-z0-9\s-]/g, '') // Loại bỏ ký tự đặc biệt
    .trim() // Loại bỏ khoảng trắng đầu cuối
    .replace(/\s+/g, '-') // Thay thế khoảng trắng bằng dấu gạch ngang

  const uuid = uuidv4()

  return `${slug}-${uuid}.html`
}
