import { useEffect, useState } from 'react'

// Live snowfall from Open-Meteo (free, no API key). Past 7 days + the next few
// days' forecast at each resort's coordinates.
async function fetchSnow(lat, lng) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=snowfall_sum&past_days=7&forecast_days=4&timezone=auto`
  const res = await fetch(url)
  if (!res.ok) throw new Error('snow fetch failed')
  const json = await res.json()
  const all = json.daily?.snowfall_sum || []
  const last7 = all.slice(0, 7).reduce((a, b) => a + (b || 0), 0)
  const next = all.slice(7).reduce((a, b) => a + (b || 0), 0)
  return { last7: Math.round(last7), next: Math.round(next) }
}

export default function SnowReport({ resorts }) {
  const valid = (resorts || []).filter(r => r.mapboxCoords?.lat != null && r.mapboxCoords?.lng != null)
  const [data, setData] = useState(null)

  useEffect(() => {
    const list = (resorts || []).filter(r => r.mapboxCoords?.lat != null && r.mapboxCoords?.lng != null)
    if (list.length === 0) return
    let active = true
    Promise.all(list.map(async r => {
      try { return [r.name, await fetchSnow(r.mapboxCoords.lat, r.mapboxCoords.lng)] }
      catch { return [r.name, null] }
    })).then(pairs => { if (active) setData(Object.fromEntries(pairs)) })
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (valid.length === 0) return null

  return (
    <div className="space-y-2.5">
      {valid.map(r => {
        const d = data?.[r.name]
        const loading = data == null
        const offSeason = d && d.last7 === 0 && d.next === 0
        return (
          <div key={r.name} className="flex items-center justify-between gap-3 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3">
            <span className="text-sm font-medium text-white">{r.name}</span>
            <span className="text-sm text-right">
              {loading ? (
                <span className="text-slate-500">Checking…</span>
              ) : !d ? (
                <span className="text-slate-500">Unavailable</span>
              ) : offSeason ? (
                <span className="text-slate-500">Off-season — no snow yet</span>
              ) : (
                <>
                  <span className="text-cyan-300 font-semibold">{d.last7} cm</span>
                  <span className="text-slate-400"> last 7 days</span>
                  {d.next > 0 && <span className="text-slate-400"> · {d.next} cm forecast</span>}
                </>
              )}
            </span>
          </div>
        )
      })}
      <p className="text-xs text-slate-500 mt-1">Live snowfall via Open-Meteo · shows current conditions at each resort.</p>
    </div>
  )
}
