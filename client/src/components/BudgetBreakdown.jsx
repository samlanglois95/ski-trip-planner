const LABELS = {
  flights: 'Flights',
  lodging: 'Lodging',
  liftTickets: 'Lift Tickets',
  rentalCar: 'Rental Car',
  food: 'Food',
  skiRentalsAndLessons: 'Ski Rentals & Lessons'
}

const COLORS = {
  flights: 'bg-blue-500',
  lodging: 'bg-purple-500',
  liftTickets: 'bg-cyan-500',
  rentalCar: 'bg-orange-500',
  food: 'bg-amber-500',
  skiRentalsAndLessons: 'bg-green-500',
}

export default function BudgetBreakdown({ budget }) {
  if (!budget) return null

  const { total, notes, ...categories } = budget
  const entries = Object.entries(categories).filter(([key]) => LABELS[key])

  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4 flex items-center gap-2.5">
        <span className="w-1.5 h-4 rounded-full bg-blue-500 inline-block" />
        Budget Breakdown
      </h3>

      <div className="space-y-3">
        {entries.map(([key, value]) => {
          const pct = Math.round((value / total) * 100)
          return (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-300">{LABELS[key]}</span>
                <span className="text-white font-medium">${value.toLocaleString()}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${COLORS[key] ?? 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-700/50">
        <span className="text-slate-300 font-medium">Total</span>
        <span className="text-xl font-bold text-white">${total?.toLocaleString()}</span>
      </div>

      {notes && typeof notes === 'string' && (
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">{notes}</p>
      )}
      {notes && typeof notes === 'object' && (
        <div className="text-xs text-slate-500 mt-3 leading-relaxed space-y-1">
          {Object.values(notes).map((note, i) => (
            <p key={i}>{note}</p>
          ))}
        </div>
      )}
    </div>
  )
}
