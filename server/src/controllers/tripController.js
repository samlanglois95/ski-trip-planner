import { buildTripPlan } from '../services/claudeService.js'
import {
  saveTrip,
  getAllTrips,
  getTripById,
  deleteTrip,
  createShareLink,
  revokeShareLink,
  getSharedTrip,
  resolveShareId,
  getComments,
  addComment
} from '../services/tripStorageService.js'

export async function generateTripPlan(req, res) {
  try {
    const tripPlan = await buildTripPlan(req.body)
    res.json({ success: true, data: tripPlan })
  } catch (error) {
    console.error('Trip generation error:', error)
    res.status(error.statusCode || 500).json({ success: false, error: error.message })
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

export async function shareTrip(req, res) {
  try {
    const shareId = await createShareLink(req.params.id, req.user.id)
    res.json({ success: true, data: { shareId } })
  } catch (error) {
    console.error('Share trip error:', error)
    res.status(500).json({ success: false, error: 'Could not create share link' })
  }
}

export async function unshareTrip(req, res) {
  try {
    await revokeShareLink(req.params.id, req.user.id)
    res.json({ success: true })
  } catch (error) {
    console.error('Unshare trip error:', error)
    res.status(500).json({ success: false, error: 'Could not revoke share link' })
  }
}

// Public — no auth. Returns a shared trip by its token, or 404.
export async function viewSharedTrip(req, res) {
  try {
    const { shareId } = req.params
    if (!shareId || typeof shareId !== 'string') {
      return res.status(400).json({ success: false, error: 'Invalid share link' })
    }
    const trip = await getSharedTrip(shareId)
    res.json({ success: true, data: trip })
  } catch (error) {
    res.status(404).json({ success: false, error: 'Trip not found' })
  }
}

// Public — list comments on a shared trip (looked up by its share token).
export async function listComments(req, res) {
  try {
    const tripId = await resolveShareId(req.params.shareId)
    const comments = await getComments(tripId)
    res.json({ success: true, data: comments })
  } catch (error) {
    res.status(404).json({ success: false, error: 'Trip not found' })
  }
}

// Public — add a comment to a shared trip. Validated + rate-limited upstream;
// only attaches to a trip that has a live share link.
export async function postComment(req, res) {
  try {
    const tripId = await resolveShareId(req.params.shareId)
    const { author, body, link } = req.body
    const comment = await addComment(tripId, { author, body, link })
    res.status(201).json({ success: true, data: comment })
  } catch (error) {
    console.error('Post comment error:', error)
    const notFound = error.message === 'Trip not found'
    res.status(notFound ? 404 : 500).json({
      success: false,
      error: notFound ? 'Trip not found' : 'Could not post comment'
    })
  }
}
