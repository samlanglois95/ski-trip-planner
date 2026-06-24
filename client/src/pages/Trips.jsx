import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function Trips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchTrips() {
      try {
        const res = await api.get('/api/trip/all')
        setTrips(res.data.data)
      } catch (err) {
        setError('Failed to load trips.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTrips()
  }, [])

  async function handleDelete(id, e) {
    e.stopPropagation()
    if (!confirm('Delete this trip?')) return
    setDeleting(id)
    try {
      await api.delete(`/api/trip/${id}`)
      setTrips(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error(err)
    } finally {
      setDeleting(null)
    }
  }

  function handleView(trip) {
    navigate('/results', { state: { plan: trip.plan, inputs: trip.inputs, savedTripId: trip.id, shareId: trip.share_id || null } })
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Trips</h1>
            <p className="text-slate-400 text-sm mt-1">Your saved ski trip plans</p>
          </div>
          <Link
            to="/"
            className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            + Plan New Trip
          </Link>
        </div>

        {loading && (
          <div className="text-center py-20 text-slate-400">Loading your trips...</div>
        )}

        {error && (
          <div className="p-4 bg-red-900/40 border border-red-700/50 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {!loading && trips.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-4 text-slate-600">
              <svg className="w-12 h-12 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21L12 3l10 18H2z"/>
              </svg>
            </div>
            <p className="text-slate-300 font-medium mb-2">No saved trips yet</p>
            <p className="text-slate-500 text-sm mb-6">Generate a trip and click "Save Trip" to see it here</p>
            <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium text-sm">
              Plan your first trip →
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {trips.map(trip => (
            <div
              key={trip.id}
              onClick={() => handleView(trip)}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-500 cursor-pointer transition group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition">
                    {trip.trip_name || 'Unnamed Trip'}
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Saved {formatDate(trip.created_at)}
                  </p>

                  {/* Quick stats */}
                  <div className="flex flex-wrap gap-3 mt-3">
                    {trip.inputs?.skillLevel && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 capitalize">
                        {trip.inputs.skillLevel}
                      </span>
                    )}
                    {trip.inputs?.tripType && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 capitalize">
                        {trip.inputs.tripType}
                      </span>
                    )}
                    {trip.inputs?.passType && trip.inputs.passType !== 'none' && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {trip.inputs.passType}
                      </span>
                    )}
                    {trip.plan?.budgetBreakdown?.total && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                        ${trip.plan.budgetBreakdown.total} total
                      </span>
                    )}
                  </div>

                  {/* Resort names */}
                  {trip.plan?.topResorts && (
                    <p className="text-xs text-slate-500 mt-2">
                      {trip.plan.topResorts.map(r => r.name).join(' · ')}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={(e) => handleDelete(trip.id, e)}
                    disabled={deleting === trip.id}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-900/30 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  >
                    {deleting === trip.id ? 'Deleting...' : 'Delete'}
                  </button>
                  <span className="text-slate-500 group-hover:text-blue-400 transition text-lg">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
