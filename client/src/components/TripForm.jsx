import { useState } from 'react'

const REGIONS = [
  'Colorado', 'Utah', 'California', 'Pacific Northwest',
  'Vermont / New England', 'Alps (Europe)', 'Canada', 'Flexible'
]

const defaultForm = {
  budget: '',
  budgetType: 'total',
  departureLocation: '',
  groupSize: '1',
  startDate: '',
  endDate: '',
  skillLevel: '',
  tripType: '',
  preferredRegion: '',
  passType: '',
  flexibility: 'somewhat flexible',
  extras: ''
}

export default function TripForm({ onSubmit, loading }) {
  const [form, setForm] = useState(defaultForm)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(form)
  }

  const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5"
  const sectionClass = "bg-slate-800/50 border border-slate-700/50 rounded-xl p-5"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Budget & Group */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
          Budget & Group
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Budget (USD)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="3000"
                required
                className={inputClass + " pl-7 pr-28"}
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex bg-slate-700 rounded-md overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, budgetType: 'total' }))}
                  className={`px-2.5 py-1.5 transition ${form.budgetType === 'total' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Total
                </button>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, budgetType: 'per person' }))}
                  className={`px-2.5 py-1.5 transition ${form.budgetType === 'per person' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  /person
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {form.budgetType === 'per person'
                ? `$${form.budget || '0'} per person — $${(Number(form.budget) * Number(form.groupSize)) || '0'} total for ${form.groupSize} ${Number(form.groupSize) === 1 ? 'person' : 'people'}`
                : `$${form.budget || '0'} total — $${form.budget && form.groupSize ? Math.round(Number(form.budget) / Number(form.groupSize)) : '0'} per person`
              }
            </p>
          </div>
          <div>
            <label className={labelClass}>Group Size</label>
            <select name="groupSize" value={form.groupSize} onChange={handleChange} className={inputClass}>
              {[1,2,3,4,5,6,7,8,10,12].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Departing From</label>
          <input
            type="text"
            name="departureLocation"
            value={form.departureLocation}
            onChange={handleChange}
            placeholder="e.g. Philadelphia, PA or PHL"
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Dates */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
          Dates
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className={inputClass + " [color-scheme:dark]"}
            />
          </div>
          <div>
            <label className={labelClass}>End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className={inputClass + " [color-scheme:dark]"}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={labelClass}>Date Flexibility</label>
          <select name="flexibility" value={form.flexibility} onChange={handleChange} className={inputClass}>
            <option value="exact">Exact dates only</option>
            <option value="somewhat flexible">± a few days</option>
            <option value="very flexible">Very flexible (best price wins)</option>
          </select>
        </div>
      </div>

      {/* Skiing Style */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
          Skiing Style
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Skill Level</label>
            <select name="skillLevel" value={form.skillLevel} onChange={handleChange} required className={inputClass}>
              <option value="">Select level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert / Black Diamond</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Trip Type</label>
            <select name="tripType" value={form.tripType} onChange={handleChange} required className={inputClass}>
              <option value="">Select type</option>
              <option value="resort">Resort</option>
              <option value="backcountry">Backcountry</option>
              <option value="hybrid">Hybrid (both)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location & Pass */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
          Location & Pass
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Preferred Region</label>
            <select name="preferredRegion" value={form.preferredRegion} onChange={handleChange} required className={inputClass}>
              <option value="">Select region</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Pass Type</label>
            <select name="passType" value={form.passType} onChange={handleChange} className={inputClass}>
              <option value="none">No pass / buy tickets</option>
              <option value="Ikon">Ikon Pass</option>
              <option value="Epic">Epic Pass</option>
              <option value="flexible">No preference</option>
            </select>
          </div>
        </div>
      </div>

      {/* Extras */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
          Anything Else?
        </h3>
        <textarea
          name="extras"
          value={form.extras}
          onChange={handleChange}
          placeholder="e.g. need ski rentals, traveling with kids, want a hot tub, prefer ski-in ski-out, allergic to gluten..."
          rows={3}
          className={inputClass + " resize-none"}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base"
      >
        {loading ? '🔍 Planning your trip...' : '🏔️ Plan My Trip'}
      </button>
    </form>
  )
}