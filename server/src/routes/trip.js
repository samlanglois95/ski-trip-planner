import { Router } from 'express'
import { generateTripPlan } from '../controllers/tripController.js'

const router = Router()

router.post('/generate', generateTripPlan)

export default router