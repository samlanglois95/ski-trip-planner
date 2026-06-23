import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { generateLimiter } from '../middleware/rateLimiter.js'
import { validateTripInputs } from '../middleware/validateTrip.js'
import {
  generateTripPlan,
  saveTripPlan,
  listTrips,
  getTrip,
  removeTrip,
  shareTrip,
  unshareTrip,
  viewSharedTrip
} from '../controllers/tripController.js'

const router = Router()

router.post('/generate', generateLimiter, validateTripInputs, generateTripPlan)
router.get('/shared/:shareId', viewSharedTrip)                      // public — open a shared trip link
router.post('/save', requireAuth, saveTripPlan)
router.get('/all', requireAuth, listTrips)
router.post('/:id/share', requireAuth, shareTrip)
router.delete('/:id/share', requireAuth, unshareTrip)
router.get('/:id', requireAuth, getTrip)
router.delete('/:id', requireAuth, removeTrip)

export default router