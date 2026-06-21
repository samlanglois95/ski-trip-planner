import { useState } from 'react'

const defaultForm = {
  budget: '',
  budgetType: 'total',
  departureLocation: '',
  groupSize: '1',
  startDate: '',
  endDate: '',
  skillLevel: '',
  tripType: '',
  preferredRegion: [],
  passType: '',
  flexibility: 'somewhat flexible',
  extraTags: [],
  extraNotes: '',
}

const EXTRA_TAGS = [
  {
    label: 'Equipment',
    tags: ['Ski rentals needed', 'Snowboard rentals needed', 'Ski lessons needed', 'Helmet rental needed'],
  },
  {
    label: 'Group',
    tags: ['Traveling with kids', 'Non-skier in group', 'Anniversary / special occasion', 'Corporate / team trip'],
  },
  {
    label: 'Lodging',
    tags: ['Ski-in / ski-out', 'Hot tub', 'Full kitchen', 'Pet-friendly'],
  },
  {
    label: 'On the mountain',
    tags: ['Terrain park', 'Powder days priority', 'Après-ski scene', 'Night skiing'],
  },
  {
    label: 'Dietary',
    tags: ['Gluten-free', 'Vegetarian / vegan', 'Nut allergy'],
  },
  {
    label: 'Vibe',
    tags: ['First ski trip ever', 'Budget-conscious', 'Luxury experience', 'Photography / video'],
  },
]

export default function TripForm({ onSubmit, loading }) {
  const [form, setForm] = useState(defaultForm)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleTagToggle(tag) {
    setForm(prev => ({
      ...prev,
      extraTags: prev.extraTags.includes(tag)
        ? prev.extraTags.filter(t => t !== tag)
        : [...prev.extraTags, tag]
    }))
  }

  function handleRegionToggle(region) {
    setForm(prev => {
      const current = prev.preferredRegion
      return {
        ...prev,
        preferredRegion: current.includes(region)
          ? current.filter(r => r !== region)
          : [...current, region]
      }
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.skillLevel || !form.tripType) return
    const extras = [...form.extraTags, form.extraNotes.trim()].filter(Boolean).join('. ')
    onSubmit({ ...form, extras })
  }

  const inputClass = "w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
  const labelClass = "block text-sm font-medium text-slate-300 mb-1.5"
  const sectionClass = "bg-slate-900/40 border border-white/5 rounded-xl p-5"

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
              className={inputClass + " scheme-dark"}
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
              className={inputClass + " scheme-dark"}
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

        <div className="mb-5">
          <label className={labelClass}>Skill Level</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              {
                value: 'beginner',
                symbol: <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="10" fill="#22c55e"/></svg>,
                label: 'Beginner',
                sub: 'Learning the basics'
              },
              {
                value: 'intermediate',
                symbol: <svg width="22" height="22" viewBox="0 0 22 22"><rect x="1" y="1" width="20" height="20" rx="1" fill="#3b82f6"/></svg>,
                label: 'Intermediate',
                sub: 'Blues & easy reds'
              },
              {
                value: 'advanced',
                symbol: <svg width="22" height="22" viewBox="0 0 22 22"><polygon points="11,1 21,11 11,21 1,11" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5"/></svg>,
                label: 'Advanced',
                sub: 'Blacks & moguls'
              },
              {
                value: 'expert',
                symbol: (
                  <div style={{ display: 'flex', gap: '3px' }}>
                    <svg width="17" height="17" viewBox="0 0 22 22"><polygon points="11,1 21,11 11,21 1,11" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5"/></svg>
                    <svg width="17" height="17" viewBox="0 0 22 22"><polygon points="11,1 21,11 11,21 1,11" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5"/></svg>
                  </div>
                ),
                label: 'Expert',
                sub: 'Double black'
              },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, skillLevel: opt.value }))}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition ${
                  form.skillLevel === opt.value
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="h-6 flex items-center justify-center">{opt.symbol}</div>
                <span className="text-xs font-semibold">{opt.label}</span>
                <span className="text-[10px] text-slate-500 leading-tight">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Trip Type</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                value: 'resort',
                symbol: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 20L12 4L21 20H3Z"/>
                  </svg>
                ),
                label: 'Resort',
                sub: 'Groomed runs & lifts'
              },
              {
                value: 'backcountry',
                symbol: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3L7 10H10L5 17H11V22H13V17H19L14 10H17L12 3Z"/>
                  </svg>
                ),
                label: 'Backcountry',
                sub: 'Off-piste adventure'
              },
              {
                value: 'hybrid',
                symbol: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 20L9 8L13 14L16 10L21 20"/>
                  </svg>
                ),
                label: 'Hybrid',
                sub: 'Best of both'
              },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, tripType: opt.value }))}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition ${
                  form.tripType === opt.value
                    ? 'bg-blue-600/20 border-blue-500 text-white'
                    : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                }`}
              >
                <div className="h-6 flex items-center justify-center">{opt.symbol}</div>
                <span className="text-xs font-semibold">{opt.label}</span>
                <span className="text-[10px] text-slate-500 leading-tight">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Location & Pass */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
          Location & Pass
        </h3>

        <div className="mb-4">
          <label className={labelClass}>
            Preferred Region(s)
            <span className="text-slate-500 font-normal ml-2">— select one or more</span>
          </label>

          {/* Group regions by continent */}
          {[
            {
              label: 'North America',
              regions: [
                'Colorado',
                'Utah',
                'California / Lake Tahoe',
                'Pacific Northwest (WA/OR)',
                'Wyoming / Montana / Idaho',
                'Vermont / New England',
                'Canada - BC (Whistler / Revelstoke)',
                'Canada - Alberta (Banff / Lake Louise)',
                'Canada - Quebec (Tremblant)',
              ]
            },
            {
              label: 'Europe',
              regions: [
                'French Alps (Chamonix / Les 3 Vallées)',
                'Swiss Alps (Zermatt / St. Moritz / Verbier)',
                'Austrian Alps (Kitzbühel / Ischgl / Sölden)',
                'Italian Dolomites',
              ]
            },
            {
              label: 'Asia',
              regions: [
                'Japan - Hokkaido (Niseko / Rusutsu / Furano)',
                'Japan - Honshu (Hakuba / Zao)',
                'South Korea',
                'China',
              ]
            },
            {
              label: 'Southern Hemisphere',
              regions: [
                'Chile (Valle Nevado / Portillo)',
                'Argentina (Las Leñas / Bariloche)',
                'New Zealand (Queenstown / Wanaka)',
                'Australia',
              ]
            },
            {
              label: 'Open',
              regions: ['Surprise me / Flexible']
            }
          ].map(group => (
            <div key={group.label} className="mb-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.regions.map(region => {
                  const selected = form.preferredRegion.includes(region)
                  return (
                    <button
                      key={region}
                      type="button"
                      onClick={() => handleRegionToggle(region)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${
                        selected
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {region}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {form.preferredRegion.length === 0 && (
            <p className="text-xs text-amber-400 mt-2">Please select at least one region</p>
          )}
          {form.preferredRegion.length > 0 && (
            <p className="text-xs text-slate-500 mt-2">
              {form.preferredRegion.length} region{form.preferredRegion.length > 1 ? 's' : ''} selected
            </p>
          )}
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

      {/* Extras */}
      <div className={sectionClass}>
        <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
          Anything Else?
        </h3>

        <div className="space-y-3 mb-4">
          {EXTRA_TAGS.map(group => (
            <div key={group.label}>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">{group.label}</p>
              <div className="flex flex-wrap gap-2">
                {group.tags.map(tag => {
                  const selected = form.extraTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition ${
                        selected
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <textarea
          name="extraNotes"
          value={form.extraNotes}
          onChange={handleChange}
          placeholder="Anything else not covered above..."
          rows={2}
          className={inputClass + " resize-none"}
        />
      </div>

      <button
        type="submit"
        disabled={loading || form.preferredRegion.length === 0 || !form.skillLevel || !form.tripType}
        className="w-full py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-base"
      >
        {loading ? 'Planning your trip...' : 'Plan My Trip'}
      </button>
    </form>
  )
}