import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import TripPlanView from '../components/TripPlanView'

export default function SharedTrip() {
  const { shareId } = useParams()
  const [plan, setPlan] = useState(null)
  const [tripName, setTripName] = useState('')
  const [status, setStatus] = useState('loading') // loading | ok | notfound | error

  useEffect(() => {
    let active = true
    api.get(`/api/trip/shared/${shareId}`)
      .then(res => {
        if (!active) return
        setPlan(res.data.data.plan)
        setTripName(res.data.data.trip_name || 'Shared trip')
        setStatus('ok')
      })
      .catch(err => {
        if (!active) return
        setStatus(err.response?.status === 404 ? 'notfound' : 'error')
      })
    return () => { active = false }
  }, [shareId])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading trip…
      </div>
    )
  }

  if (status !== 'ok') {
    const message = status === 'notfound'
      ? 'This shared trip link is invalid or has been turned off.'
      : 'Something went wrong loading this trip. Give it a minute — the backend may be waking up.'
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="text-slate-400 mb-4">{message}</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">
          Plan your own trip →
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-blue-300 uppercase tracking-wider mb-2">Shared trip plan</p>
              <h1 className="text-3xl font-bold text-white mb-1">{tripName}</h1>
              <p className="text-slate-300 text-sm">
                {plan.topResorts?.length} resorts recommended
                {plan.budgetBreakdown?.total && ` · $${plan.budgetBreakdown.total.toLocaleString()} estimated total`}
              </p>
            </div>
            <Link
              to="/"
              className="shrink-0 text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition mt-6"
            >
              Plan your own →
            </Link>
          </div>
        </div>
      </div>

      <TripPlanView plan={plan} />
    </div>
  )
}
