import { Schema, model } from 'mongoose'

const schema = new Schema({
  userid: {
    type: String,
    ref: 'users',
    required: [true, '缺少使用者']
  },
  name: {
    type: String,
    required: [true, '缺少名稱']
  },
  time: {
    type: String,
    required: [true, '缺少日期']
  },
  description: {
    type: String,
    required: [true, '缺少說明']
  },
  image: {
    type: String,
    required: [true, '缺少圖片']
  },
  sell: {
    type: Boolean,
    required: [true, '缺少狀態']
  },
  category: {
    type: String,
    required: [true, '缺少分類'],
    enum: {
      values: ['海水魚類', '珊瑚軟體', '硬體設備', '二手分享'],
      message: '分類錯誤'
    }
  }
}, { versionKey: false })

export default model('products', schema)
