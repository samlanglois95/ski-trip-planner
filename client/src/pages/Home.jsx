import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TripForm from '../components/TripForm'
import api from '../lib/api'
import heroBg from '../assets/front-page.jpeg'

const WAKEUP_MESSAGE = "Waking up the server — the first request after it's been idle can take up to a minute…"

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [statusMsg, setStatusMsg] = useState(null)
  const navigate = useNavigate()

  // The backend (Render free tier) spins down when idle. Ping it on mount so it
  // starts waking up while the user fills out the form.
  useEffect(() => {
    api.get('/health').catch(() => {})
  }, [])

  async function handleSubmit(formData) {
    setLoading(true)
    setError(null)
    setStatusMsg(null)

    // A cold start tends to be slow rather than failing outright — reassure the
    // user (without aborting) if it's taking a while.
    const slowTimer = setTimeout(() => setStatusMsg(WAKEUP_MESSAGE), 8000)
    const maxAttempts = 5

    try {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const res = await api.post('/api/trip/generate', formData)
          navigate('/results', { state: { plan: res.data.data, inputs: formData, autosave: true } })
          return
        } catch (err) {
          // No response or a gateway error usually means the backend is still
          // booting — show the wake-up message and retry a few times.
          const stillWaking = !err.response || [502, 503, 504].includes(err.response.status)
          if (stillWaking && attempt < maxAttempts) {
            setStatusMsg(WAKEUP_MESSAGE)
            await new Promise(r => setTimeout(r, 5000))
            continue
          }
          setError(err.response?.data?.error || 'Something went wrong generating your trip. Please try again.')
          console.error(err)
          return
        }
      }
    } finally {
      clearTimeout(slowTimer)
      setLoading(false)
      setStatusMsg(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-b from-blue-950/95 via-slate-900/95 to-slate-900/95 backdrop-blur-md overflow-hidden">
          {/* Snowflakes */}
          {[
            { left: '5%',  size: '5px',  duration: '4s',   delay: '0s' },
            { left: '15%', size: '3px',  duration: '3s',   delay: '0.5s' },
            { left: '28%', size: '6px',  duration: '5s',   delay: '1s' },
            { left: '42%', size: '4px',  duration: '3.5s', delay: '0.2s' },
            { left: '58%', size: '5px',  duration: '4.5s', delay: '1.5s' },
            { left: '70%', size: '3px',  duration: '3.2s', delay: '0.8s' },
            { left: '83%', size: '5px',  duration: '4s',   delay: '0.3s' },
            { left: '93%', size: '4px',  duration: '5.2s', delay: '1.2s' },
          ].map((flake, i) => (
            <span
              key={i}
              className="snowflake"
              style={{ left: flake.left, top: '-20px', width: flake.size, height: flake.size, animationDuration: flake.duration, animationDelay: flake.delay }}
            />
          ))}
          <div className="mb-6 animate-bounce text-blue-400">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 21L12 3l10 18H2z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Planning your trip...</h2>
          <p className="text-slate-400 text-sm mb-8">{statusMsg || 'Scanning resorts, flights, and lodging just for you'}</p>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-blue-400"
                style={{ animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Hero section with background image */}
      <div
        className="relative min-h-105 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-slate-900/60 via-slate-900/50 to-slate-900" />

        {/* Hero content */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 pt-16 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-blue-200 mb-6">
            AI-powered ski trip planning
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
            Your perfect ski trip,<br />
            <span className="text-blue-400">planned in seconds</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed drop-shadow">
            Tell us your budget, dates, and skill level — we'll handle the rest.
            Resorts, flights, lodging, and lift tickets, all in one plan.
          </p>
        </div>
      </div>

      {/* Form section */}
      <div className="max-w-2xl mx-auto px-6 pb-24 -mt-8 relative z-10">
        {error && (
          <div className="mb-5 p-4 bg-red-900/40 border border-red-700/50 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Glassmorphism form card */}
        <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
          <TripForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}