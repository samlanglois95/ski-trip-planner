import { useLocation, Link } from 'react-router-dom'
import { useState } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import ResortCard from '../components/ResortCard'
import BudgetBreakdown from '../components/BudgetBreakdown'
import LinksList from '../components/LinksList'
import MapView from '../components/MapView'

function SectionCard({ children, delay = 0, className = '' }) {
  return (
    <div
      className={`bg-slate-800/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 fade-in-up ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2.5">
      <span className="w-1.5 h-5 rounded-full bg-blue-500 shrink-0" />
      {children}
    </h2>
  )
}

export default function Results() {
  const location = useLocation()
  const { plan, inputs } = location.state || {}
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const { user } = useAuth()

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    try {
      const tripName = `${inputs?.preferredRegion?.join(', ') || 'Trip'} — ${inputs?.startDate || ''}`
      await api.post('/api/trip/save', { inputs, plan, tripName })
      setSaved(true)
    } catch (err) {
      setSaveError('Failed to save trip. Try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

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
              {saved ? (
                <span className="text-sm text-green-400 font-medium flex items-center gap-1.5">
                  ✓ Saved to trip log
                </span>
              ) : !user ? (
                <Link
                  to="/login"
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium transition"
                >
                  Sign in to save →
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

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">

        {/* Warning banner */}
        {plan.importantWarning && (
          <div className="p-4 bg-amber-900/30 border border-amber-700/40 rounded-xl text-amber-200 text-sm leading-relaxed fade-in-up">
            {plan.importantWarning}
          </div>
        )}

        {/* Summary */}
        <SectionCard delay={0.05}>
          <SectionHeading>Trip Summary</SectionHeading>
          <p className="text-slate-300 leading-relaxed">{plan.summary}</p>
        </SectionCard>

        {/* Map */}
        <SectionCard delay={0.1} className="p-0! overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <SectionHeading>Resort Locations</SectionHeading>
          </div>
          <div className="px-6 pb-6">
            <MapView resorts={plan.topResorts} flightSuggestions={plan.flightSuggestions} />
          </div>
        </SectionCard>

        {/* Resorts */}
        <SectionCard delay={0.15}>
          <SectionHeading>Recommended Resorts</SectionHeading>
          <div className="grid md:grid-cols-3 gap-4">
            {plan.topResorts?.map((resort, i) => (
              <ResortCard key={i} resort={resort} rank={i + 1} />
            ))}
          </div>
        </SectionCard>

        {/* Budget + Links */}
        <div className="grid md:grid-cols-2 gap-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
          <BudgetBreakdown budget={plan.budgetBreakdown} />
          <div className="space-y-4">
            <SectionCard delay={0.22}>
              <LinksList
                title="Flights"
                items={plan.flightSuggestions}
                urlKey="searchUrl"
                labelKey="nearestAirport"
              />
            </SectionCard>
            <SectionCard delay={0.24}>
              <LinksList
                title="Rental Car"
                items={plan.rentalCarUrl ? [{ searchUrl: plan.rentalCarUrl, label: 'Search rental cars' }] : []}
                urlKey="searchUrl"
                labelKey="label"
              />
            </SectionCard>
          </div>
        </div>

        {/* Lodging */}
        <SectionCard delay={0.25}>
          <LinksList
            title="Lodging Options"
            items={plan.lodgingSuggestions}
            urlKey="searchUrl"
            labelKey="type"
            descKey="description"
          />
        </SectionCard>

        {/* Booking Strategy */}
        {plan.bestTimeToBook && (
          <SectionCard delay={0.3}>
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-blue-500 shrink-0" />
              Booking Strategy
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{plan.bestTimeToBook}</p>
          </SectionCard>
        )}

        {/* Itinerary */}
        {plan.itinerary && plan.itinerary.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Day-by-Day Itinerary</h2>
            <div className="space-y-3">
              {plan.itinerary.map((day, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                      <span className="text-blue-400 font-bold text-sm">{day.day}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{day.title}</h3>
                      <p className="text-slate-400 text-sm mb-3">{day.description}</p>
                      <ul className="space-y-1.5">
                        {day.activities?.map((activity, j) => (
                          <li key={j} className="text-sm text-slate-300 flex gap-2">
                            <span className="text-blue-400 mt-0.5">→</span>
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
