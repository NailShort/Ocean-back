import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少標題']
  },
  time: {
    type: String,
    required: [true, '缺少時間']
  },
  description: {
    type: String,
    required: [true, '缺少內容']
  },
  image: {
    type: String,
    required: [true, '缺少圖片']
  },
  sell: {
    type: Boolean,
    required: [true, '缺少狀態']
  }
}, { versionKey: false })

export default model('latests', schema)
