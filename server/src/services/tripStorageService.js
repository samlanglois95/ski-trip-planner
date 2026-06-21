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
