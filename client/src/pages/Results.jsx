import { useLocation, Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import TripPlanView from '../components/TripPlanView'
import ShareTripModal from '../components/ShareTripModal'

export default function Results() {
  const location = useLocation()
  const { plan, inputs, autosave } = location.state || {}
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(!!location.state?.savedTripId)
  const [saveError, setSaveError] = useState(null)
  const [savedTripId, setSavedTripId] = useState(location.state?.savedTripId || null)
  const [shareId, setShareId] = useState(location.state?.shareId || null)
  const [sharing, setSharing] = useState(false)
  const [shareUrl, setShareUrl] = useState(null)
  const [shareError, setShareError] = useState(null)
  const { user } = useAuth()
  const savePromise = useRef(null)
  const autoSaveStarted = useRef(false)

  const tripName = `${inputs?.preferredRegion?.join(', ') || 'Trip'}${inputs?.startDate ? ` — ${inputs.startDate}` : ''}`

  // Save the trip at most once; concurrent callers (auto-save + Share) share the
  // same in-flight request so we never write duplicate rows.
  async function ensureSaved() {
    if (savedTripId) return savedTripId
    if (savePromise.current) return savePromise.current
    savePromise.current = (async () => {
      const res = await api.post('/api/trip/save', { inputs, plan, tripName })
      const id = res.data.data.id
      setSavedTripId(id)
      setSaved(true)
      return id
    })()
    try {
      return await savePromise.current
    } catch (err) {
      savePromise.current = null // let it be retried
      throw err
    }
  }

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    try {
      await ensureSaved()
    } catch (err) {
      setSaveError('Failed to save trip. Try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  async function handleShare() {
    setSharing(true)
    setShareError(null)
    try {
      const id = await ensureSaved()
      const res = await api.post(`/api/trip/${id}/share`)
      const { shareId: newShareId } = res.data.data
      setShareId(newShareId)
      setShareUrl(`${window.location.origin}/shared/${newShareId}`)
    } catch (err) {
      setShareError('Could not create a share link. Try again.')
      console.error(err)
    } finally {
      setSharing(false)
    }
  }

  // Auto-save a freshly generated trip for signed-in users, so it lands in My
  // Trips and can be shared later. Runs once; trips opened from history already
  // have an id (savedTripId) and are skipped.
  useEffect(() => {
    if (autosave && user && plan && !savedTripId && !autoSaveStarted.current) {
      autoSaveStarted.current = true
      handleSave()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="text-slate-400 mb-4">No trip plan found. Try generating a new one.</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">
          ← Back to planner
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">

      {/* Hero banner */}
      <div className="relative bg-linear-to-r from-blue-900/80 via-slate-800 to-slate-900 border-b border-slate-700/50 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 40%)'
          }}
        />
        <div className="relative max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div>
              <Link to="/" className="text-sm text-slate-400 hover:text-white transition inline-flex items-center gap-1 mb-3">
                ← New search
              </Link>
              <h1 className="text-3xl font-bold text-white mb-1">
                Your Trip Plan
              </h1>
              <p className="text-slate-300 text-sm">
                {plan.topResorts?.length} resorts recommended
                {plan.budgetBreakdown?.total && ` · $${plan.budgetBreakdown.total.toLocaleString()} estimated total`}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {saveError && (
                <span className="text-xs text-red-400">{saveError}</span>
              )}
              {shareError && (
                <span className="text-xs text-red-400">{shareError}</span>
              )}

              {user && (
                <button
                  onClick={handleShare}
                  disabled={sharing}
                  className="text-sm font-medium px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white transition"
                >
                  {sharing ? 'Creating link…' : 'Share'}
                </button>
              )}

              {saved ? (
                <span className="text-sm text-green-400 font-medium flex items-center gap-1.5">
                  ✓ Saved to trip log
                </span>
              ) : !user ? (
                <Link
                  to="/login"
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium transition"
                >
                  Sign in to save & share →
                </Link>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition"
                >
                  {saving ? 'Saving...' : 'Save Trip'}
                </button>
              )}
              <Link
                to="/trips"
                className="text-sm font-medium px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
              >
                My Trips
              </Link>
            </div>
          </div>
        </div>
      </div>

      <TripPlanView plan={plan} shareId={shareId} />

      {shareUrl && (
        <ShareTripModal
          url={shareUrl}
          tripName={tripName}
          onClose={() => setShareUrl(null)}
        />
      )}
    </div>
  )
}
