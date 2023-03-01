import { Router } from 'express'
import upload from '../middleware/upload.js'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import { register, login, logout, extend, getUser, getAllUsers, editUser, editCart, getCart, editLike, getLike } from '../controllers/users.js'

const router = Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.patch('/extend', auth.jwt, extend)
router.get('/me', auth.jwt, getUser)
router.get('/all', auth.jwt, getAllUsers) // 取所有商品，管理員用
router.patch('/eduser', content('multipart/form-data'), auth.jwt, upload, editUser) // 編輯會員
router.post('/cart', content('application/json'), auth.jwt, editCart)
router.get('/cart', auth.jwt, getCart)
router.post('/like', content('application/json'), auth.jwt, editLike)
router.get('/like', auth.jwt, getLike)

export default router
