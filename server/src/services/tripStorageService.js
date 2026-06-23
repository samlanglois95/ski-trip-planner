import crypto from 'crypto'
import { supabaseAdmin } from '../config/supabase.js'

export async function saveTrip(inputs, plan, tripName, userId) {
  const { data, error } = await supabaseAdmin
    .from('trips')
    .insert([{ inputs, plan, trip_name: tripName, user_id: userId }])
    .select()

  if (error) throw new Error(error.message)
  return data[0]
}

export async function getAllTrips(userId) {
  const { data, error } = await supabaseAdmin
    .from('trips')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function getTripById(id, userId) {
  const { data, error } = await supabaseAdmin
    .from('trips')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function deleteTrip(id, userId) {
  const { error } = await supabaseAdmin
    .from('trips')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  return true
}

// Generate (or reuse) an unguessable public share token for a trip.
// Scoped to user_id so a user can only share their own trips.
export async function createShareLink(id, userId) {
  const { data: existing, error: lookupErr } = await supabaseAdmin
    .from('trips')
    .select('share_id')
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (lookupErr) throw new Error(lookupErr.message)
  if (existing.share_id) return existing.share_id

  const shareId = crypto.randomBytes(16).toString('hex') // 128-bit, URL-safe

  const { data, error } = await supabaseAdmin
    .from('trips')
    .update({ share_id: shareId })
    .eq('id', id)
    .eq('user_id', userId)
    .select('share_id')
    .single()

  if (error) throw new Error(error.message)
  return data.share_id
}

// Stop sharing a trip — clears its public token.
export async function revokeShareLink(id, userId) {
  const { error } = await supabaseAdmin
    .from('trips')
    .update({ share_id: null })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw new Error(error.message)
  return true
}

// Public read — looks a trip up by its share token only. Returns just the
// fields needed to render the plan; never exposes user_id or other rows.
export async function getSharedTrip(shareId) {
  const { data, error } = await supabaseAdmin
    .from('trips')
    .select('trip_name, inputs, plan')
    .eq('share_id', shareId)
    .single()

  if (error) throw new Error('Trip not found')
  return data
}
