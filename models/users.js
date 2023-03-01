import { Schema, model, ObjectId, Error } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const cartSchema = new Schema({
  p_id: {
    type: ObjectId,
    ref: 'products',
    required: [true, '缺少商品']
  },
  quantity: { // quantity 數量
    type: Number,
    required: [true, '缺少數量']
  }
})

const likeSchema = new Schema({
  p_id: {
    type: ObjectId,
    ref: 'products',
    required: [true, '缺少商品']
  },
  quantity: { // quantity 數量
    type: Number,
    required: [true, '缺少數量']
  }
})

const schema = new Schema({
  account: {
    type: String,
    required: [true, '缺少帳號'],
    minlength: [4, '帳號太短'],
    maxlength: [20, '帳號太長'],
    unique: true,
    match: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
  },
  name: {
    type: String
  },
  image: {
    type: String,
    default: 'https://source.boringavatars.com/beam/256/aaaa?colors=000000,F0A818,304878,181848,F0A818'
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, '缺少信箱'],
    unique: true,
    validate: {
      validator (email) {
        return validator.isEmail(email)
      },
      message: '信箱格式錯誤'
    }
  },
  tokens: { // tokens 代幣
    type: [String],
    default: []
  },
  cart: { // cart 購物車
    type: [cartSchema],
    default: []
  },
  like: { // cart 購物車
    type: [likeSchema],
    default: []
  },
  role: { // role 角色
    type: Number,
    // 0 = 使用者
    // 1 = 管理員
    default: 0
  }
}, { versionKey: false })

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) { // 密碼長度太長或太短
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' })) // ValidatorError 驗證器錯誤
      next(error)
      return
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) { // findOneAndUpdate 查找並更新
  const user = this._update
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度錯誤' }))
      next(error)
      return
    }
  }
  next()
})

export default model('users', schema)
