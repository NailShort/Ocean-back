import { Schema, model, ObjectId } from 'mongoose'

const schema = new Schema({
  userid: {
    type: ObjectId,
    ref: 'users',
    required: [true, '缺少使用者']
  },

  proid: {
    type: ObjectId,
    ref: 'products',
    required: [true, '缺少使用者']
  },
  time: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: [true, '缺少說明']
  },
  image: {
    type: String
  }
}, { versionKey: false })

export default model('replys', schema)
