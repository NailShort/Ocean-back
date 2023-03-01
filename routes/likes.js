import { Router } from 'express'
import { jwt } from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import { createLike, getMyLikes, getAllLikes } from '../controllers/likes.js'

const router = Router()

router.post('/', jwt, createLike)
router.get('/', jwt, getMyLikes)
router.get('/all', jwt, admin, getAllLikes)

export default router
