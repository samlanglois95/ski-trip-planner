import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  generateTripPlan,
  saveTripPlan,
  listTrips,
  getTrip,
  removeTrip
} from '../controllers/tripController.js'

const router = Router()

router.post('/generate', generateTripPlan)         // public — no account needed to plan
router.post('/save', requireAuth, saveTripPlan)
router.get('/all', requireAuth, listTrips)
router.get('/:id', requireAuth, getTrip)
router.delete('/:id', requireAuth, removeTrip)

export default router
