const LABELS = {
  flights: 'Flights',
  lodging: 'Lodging',
  liftTickets: 'Lift Tickets',
  rentalCar: 'Rental Car',
  food: 'Food',
  skiRentalsAndLessons: 'Ski Rentals & Lessons'
}

export default function BudgetBreakdown({ budget }) {
  if (!budget) return null

  const { total, notes, ...categories } = budget
  const entries = Object.entries(categories).filter(([key]) => LABELS[key])

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
        Budget Breakdown
      </h3>

      <div className="space-y-2.5">
        {entries.map(([key, value]) => {
          const pct = Math.round((value / total) * 100)
          return (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{LABELS[key]}</span>
                <span className="text-white font-medium">${value}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700/50">
        <span className="text-slate-300 font-medium">Total</span>
        <span className="text-xl font-bold text-white">${total}</span>
      </div>

      {notes && (
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">{notes}</p>
      )}
    </div>
  )
}