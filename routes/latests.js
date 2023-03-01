import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { jwt } from '../middleware/auth.js'
import { createLatest, getAllLatests, getLatest, getSellLatests, editLatest, deletLatest } from '../controllers/latests.js'

const router = Router()

// multipart/form-data上傳型態 -> jwt驗證 -> 驗證是否為管理員 -> 上傳 -> 新增商品
router.post('/', content('multipart/form-data'), jwt, admin, upload, createLatest)
router.get('/', getSellLatests) // 取上架商品
router.get('/all', jwt, admin, getAllLatests) // 取所有商品，管理員用
router.get('/:id', getLatest) // 取單個商品
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editLatest) // 編輯商品
router.delete('/:id', jwt, admin, upload, deletLatest) // 刪除商品

export default router
