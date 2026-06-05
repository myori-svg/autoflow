import { Router } from 'express'
import { estimateHandler } from '../controllers/aiController'

const router = Router()

router.post('/estimate', estimateHandler)

export default router
