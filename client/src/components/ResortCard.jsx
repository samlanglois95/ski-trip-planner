export default function ResortCard({ resort }) {
  const passColor = resort.passType === 'Ikon'
    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    : resort.passType === 'Epic'
    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    : 'bg-slate-500/20 text-slate-300 border-slate-500/30'

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold text-white">{resort.name}</h3>
          <p className="text-sm text-slate-400">{resort.region}</p>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${passColor}`}>
          {resort.passType}
        </span>
      </div>

      <p className="text-sm text-slate-300 mt-3 leading-relaxed">
        {resort.whyRecommended}
      </p>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
        <div>
          <span className="text-xs text-slate-500">Lift Ticket</span>
          <p className="text-white font-semibold">${resort.estimatedLiftTicket}/day</p>
        </div>
        <div className="flex gap-2">
          <a href={resort.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition">
            Website
          </a>
          <a href={resort.bookingUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition">
            Get Tickets
          </a>
        </div>
      </div>
    </div>
  )
}
