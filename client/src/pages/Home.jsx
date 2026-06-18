import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TripForm from '../components/TripForm'
import axios from 'axios'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handleSubmit(formData) {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.post('http://localhost:4000/api/trip/generate', formData)
      navigate('/results', { state: { plan: res.data.data, inputs: formData } })
    } catch (err) {
      setError('Something went wrong generating your trip. Check that your backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-900 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto px-6 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-6">
            <span>✨</span> AI-powered ski trip planning
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Your perfect ski trip,<br />
            <span className="text-blue-400">planned in seconds</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Tell us your budget, dates, and skill level — we'll handle the rest.
            Resorts, flights, lodging, and lift tickets, all in one plan.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 pb-24">
        {error && (
          <div className="mb-5 p-4 bg-red-900/40 border border-red-700/50 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}
        <TripForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}