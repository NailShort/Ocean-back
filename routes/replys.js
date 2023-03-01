import { Router } from 'express'
import content from '../middleware/content.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { createReply, editReply, getReply } from '../controllers/replys.js'

const router = Router()

// content上傳資料(multipart/form-data上傳型態) -> jwt驗證 -> 驗證是否為管理員 -> 上傳 -> 新增商品
router.post('/', content('multipart/form-data'), jwt, upload, createReply)
router.patch('/:id', content('multipart/form-data'), jwt, upload, editReply) // 編輯商品
router.get('/:id', getReply) // 取單個回覆
export default router
