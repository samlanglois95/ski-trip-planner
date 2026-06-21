import { buildTripPlan } from '../services/claudeService.js'
import { saveTrip, getAllTrips, getTripById, deleteTrip } from '../services/tripStorageService.js'

export async function generateTripPlan(req, res) {
  try {
    const tripPlan = await buildTripPlan(req.body)
    res.json({ success: true, data: tripPlan })
  } catch (error) {
    console.error('Trip generation error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

export async function saveTripPlan(req, res) {
  try {
    const { inputs, plan, tripName } = req.body
    const saved = await saveTrip(inputs, plan, tripName, req.user.id)
    res.json({ success: true, data: saved })
  } catch (error) {
    console.error('Save trip error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

export async function listTrips(req, res) {
  try {
    const trips = await getAllTrips(req.user.id)
    res.json({ success: true, data: trips })
  } catch (error) {
    console.error('List trips error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

export async function getTrip(req, res) {
  try {
    const trip = await getTripById(req.params.id, req.user.id)
    res.json({ success: true, data: trip })
  } catch (error) {
    console.error('Get trip error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}

export async function removeTrip(req, res) {
  try {
    await deleteTrip(req.params.id, req.user.id)
    res.json({ success: true })
  } catch (error) {
    console.error('Delete trip error:', error)
    res.status(500).json({ success: false, error: error.message })
  }
}
