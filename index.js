import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoute from './routes/users.js'
import productRoute from './routes/products.js'
import fishRoute from './routes/fishs.js'
import orderRoute from './routes/orders.js'
import likeRoute from './routes/likes.js'
import latestsRoute from './routes/latests.js'
import replyRoute from './routes/replys.js'
import contactRoute from './routes/contacts.js'

import './passport/passport.js'

mongoose.connect(process.env.DB_URL)
mongoose.set('sanitizeFilter', true) // mongoose 有特殊字元時過濾 (消毒)

const app = express()

// 跨域請求設定
app.use(cors({
  // origin 代表請求來源, Postman 等後端的請求會是 undefined
  // callback(錯誤, 是否允許)
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error(), false)
    }
  }
}))
// 處理跨域錯誤
app.use((_, req, res, next) => {
  res.status(403).json({ success: false, message: '請求被拒' })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(400).json({ success: false, message: '格式錯誤' })
})

app.use('/users', userRoute)
app.use('/products', productRoute)
app.use('/fishs', fishRoute)
app.use('/orders', orderRoute)
app.use('/likes', likeRoute)
app.use('/latests', latestsRoute)
app.use('/replys', replyRoute)
app.use('/contacts', contactRoute)

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: '' })
})

app.all('*', (req, res) => {
  res.status(404).json({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})
