import { Router } from 'express'
import { createRecord, getRecords, getUserRecords } from '../controllers/records.controller'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.post('/', authMiddleware, createRecord)
router.get('/', getRecords)
router.get('/user/:userId', getUserRecords)

export default router
