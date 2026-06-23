import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { generateLimiter } from '../middleware/rateLimiter.js'
import { validateTripInputs } from '../middleware/validateTrip.js'
import {
  generateTripPlan,
  saveTripPlan,
  listTrips,
  getTrip,
  removeTrip
} from '../controllers/tripController.js'

const router = Router()

router.post('/generate', generateLimiter, validateTripInputs, generateTripPlan)
router.post('/save', requireAuth, saveTripPlan)
router.get('/all', requireAuth, listTrips)
router.get('/:id', requireAuth, getTrip)
router.delete('/:id', requireAuth, removeTrip)

export default router