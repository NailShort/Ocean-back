import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少中文名稱']
  },
  egname: {
    type: String,
    required: [true, '缺少英文名稱']
  },
  stname: {
    type: String,
    required: [true, '缺少學術名稱']
  },
  danger: {
    type: String,
    required: [true, '缺少危險性'],
    enum: {
      values: ['溫和', '具攻擊性', '危險', '同科相殘', '攻擊珊瑚'],
      message: '分類錯誤'
    }
  },
  food: {
    type: String,
    required: [true, '缺少食性'],
    enum: {
      values: ['雜食', '肉食', '素食'],
      message: '分類錯誤'
    }
  },
  size: {
    type: Number,
    min: [0, '尺寸錯誤'],
    required: [true, '缺少尺寸']
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
  place: {
    type: String,
    required: [true, '缺少產地'],
    enum: {
      values: ['印度洋', '西太平洋', '紅海', '印度尼西亞', '大堡礁', '聖誕島', '澳大利亞', '珊瑚海', '斐濟'],
      message: '分類錯誤'
    }
  },
  category: {
    type: String,
    required: [true, '缺少分類'],
    enum: {
      values: ['小丑魚', '雀鯛', '倒吊', '小型神仙', '大型神仙', '蝶魚', '砲彈', '箱魨', '魨魚', '青蛙', '隆頭魚', '草莓魚', '海金魚', '蝦虎'],
      message: '分類錯誤'
    }
  }
}, { versionKey: false })

export default model('fishs', schema)
