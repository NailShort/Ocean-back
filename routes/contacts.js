import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { getAllContacts, createContact } from '../controllers/contacts.js'

const router = Router()

// multipart/form-data上傳型態 -> jwt驗證 -> 驗證是否為管理員 -> 上傳 -> 新增商品
router.post('/', content('multipart/form-data'), jwt, admin, upload, createContact)
router.get('/all', jwt, admin, getAllContacts) // 取所有商品，管理員用

export default router
