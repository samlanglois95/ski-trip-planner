const PASSES = {
  Ikon: {
    url: 'https://www.ikonpass.com/en/shop-passes',
    wrap: 'border-purple-500/30 bg-purple-500/10',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    btn: 'bg-purple-600 hover:bg-purple-500',
  },
  Epic: {
    url: 'https://www.epicpass.com/passes/epic-pass.aspx',
    wrap: 'border-blue-500/30 bg-blue-500/10',
    badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    btn: 'bg-blue-600 hover:bg-blue-500',
  },
}

// Renders the "should you just buy a pass?" advice from plan.passRecommendation.
export default function PassAdvice({ recommendation }) {
  const rec = recommendation
  if (!rec || !rec.pass || !PASSES[rec.pass]) return null
  const p = PASSES[rec.pass]

  return (
    <div className={`rounded-2xl border ${p.wrap} p-5 fade-in-up`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[16rem]">
          <div className="flex items-center gap-2.5 mb-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${p.badge}`}>
              {rec.pass} Pass
            </span>
            {rec.worthIt && <span className="text-xs text-green-400 font-medium">Recommended for this trip</span>}
          </div>
          {rec.reason && <p className="text-sm text-slate-300 leading-relaxed">{rec.reason}</p>}
          {rec.estimatedPassCost > 0 && (
            <p className="text-xs text-slate-400 mt-2">
              Season pass ≈ <span className="text-white font-semibold">${Number(rec.estimatedPassCost).toLocaleString()}</span> / person
            </p>
          )}
        </div>
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`shrink-0 text-sm font-medium px-4 py-2.5 rounded-lg text-white transition ${p.btn}`}
        >
          Buy {rec.pass} Pass →
        </a>
      </div>
    </div>
  )
}
