// Reference scale (~15 m) so a deep resort's bar reads as "way above average".
const REF_CM = 1500

export default function SnowReport({ snowReport }) {
  if (!Array.isArray(snowReport) || snowReport.length === 0) return null

  const maxCm = Math.max(REF_CM, ...snowReport.map(s => Number(s.avgAnnualSnowfallCm) || 0))

  return (
    <div className="space-y-4">
      {snowReport.map((s, i) => {
        const cm = Number(s.avgAnnualSnowfallCm) || 0
        const pct = cm > 0 ? Math.max(5, Math.min(100, Math.round((cm / maxCm) * 100))) : 0
        const label = s.avgAnnualSnowfallLabel || (cm > 0 ? `${(cm / 100).toFixed(1)} m` : '—')
        return (
          <div key={i}>
            <div className="flex items-baseline justify-between gap-3 mb-1.5">
              <span className="text-sm font-medium text-white">{s.resort}</span>
              <span className="text-sm">
                <span className="text-cyan-300 font-bold">{label}</span>
                <span className="text-slate-500 text-xs"> avg / season</span>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-cyan-500" style={{ width: `${pct}%` }} />
            </div>
            {s.note && <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{s.note}</p>}
          </div>
        )
      })}
      <p className="text-xs text-slate-500 mt-1">Typical average annual snowfall — bar is relative to a ~15 m / season scale.</p>
    </div>
  )
}
