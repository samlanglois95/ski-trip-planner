export default function ResortCard({ resort, rank }) {
  const pass = resort.passType === 'Ikon'
    ? { bar: 'bg-purple-500', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30', glow: 'hover:shadow-purple-900/30' }
    : resort.passType === 'Epic'
    ? { bar: 'bg-blue-500', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30', glow: 'hover:shadow-blue-900/30' }
    : { bar: 'bg-slate-500', badge: 'bg-slate-500/20 text-slate-300 border-slate-500/30', glow: 'hover:shadow-slate-800/30' }

  const rankRing = ['ring-yellow-400 text-yellow-400', 'ring-slate-300 text-slate-300', 'ring-amber-600 text-amber-600']

  return (
    <div className={`relative bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-slate-600 hover:shadow-lg ${pass.glow} transition-all duration-200`}>
      {/* Colored top accent bar */}
      <div className={`h-1 w-full ${pass.bar}`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start gap-2.5">
            {rank && (
              <span className={`shrink-0 mt-0.5 w-7 h-7 rounded-full ring-2 flex items-center justify-center text-xs font-bold ${rankRing[rank - 1] ?? 'ring-slate-600 text-slate-400'}`}>
                {rank}
              </span>
            )}
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{resort.name}</h3>
              <p className="text-sm text-slate-400">{resort.region}</p>
            </div>
          </div>
          <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full border ${pass.badge}`}>
            {resort.passType}
          </span>
        </div>

        <p className="text-sm text-slate-300 mt-3 leading-relaxed">
          {resort.whyRecommended}
        </p>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Lift Ticket</span>
            <span className="text-sm font-bold text-white bg-slate-700/60 px-2.5 py-0.5 rounded-full">
              ${resort.estimatedLiftTicket}/day
            </span>
          </div>
          <div className="flex gap-2">
            <a
              href={resort.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs font-medium px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
            >
              Website
            </a>
            <a
              href={resort.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs font-medium px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
            >
              Get Tickets →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
