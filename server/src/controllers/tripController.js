import { buildTripPlan } from '../services/claudeService.js'

export async function generateTripPlan(req, res) {
  try {
    const userInputs = req.body
    const tripPlan = await buildTripPlan(userInputs)
    res.json({ success: true, data: tripPlan })
  } catch (error) {
    console.error('Trip generation error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}