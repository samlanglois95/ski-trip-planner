import { useLocation, Link } from 'react-router-dom'
import ResortCard from '../components/ResortCard'
import BudgetBreakdown from '../components/BudgetBreakdown'
import LinksList from '../components/LinksList'

export default function Results() {
  const location = useLocation()
  const { plan, inputs } = location.state || {}

  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="text-slate-400 mb-4">No trip plan found. Try generating a new one.</p>
        <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium">
          ← Back to planner
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Back link */}
        <Link to="/" className="text-sm text-slate-400 hover:text-white transition inline-flex items-center gap-1 mb-6">
          ← New search
        </Link>

        {/* Warning banner, if present */}
        {plan.importantWarning && (
          <div className="mb-6 p-4 bg-amber-900/30 border border-amber-700/40 rounded-xl text-amber-200 text-sm leading-relaxed">
            {plan.importantWarning}
          </div>
        )}

        {/* Summary */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-3">Your Trip Plan</h1>
          <p className="text-slate-300 leading-relaxed">{plan.summary}</p>
        </div>

        {/* Resorts */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Recommended Resorts</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {plan.topResorts?.map((resort, i) => (
              <ResortCard key={i} resort={resort} />
            ))}
          </div>
        </div>

        {/* Two column: budget + links */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <BudgetBreakdown budget={plan.budgetBreakdown} />

          <div className="space-y-6">
            <LinksList
              title="Flights"
              items={plan.flightSuggestions}
              urlKey="searchUrl"
              labelKey="nearestAirport"
            />
            <LinksList
              title="Rental Car"
              items={plan.rentalCarUrl ? [{ searchUrl: plan.rentalCarUrl, label: 'Search rental cars' }] : []}
              urlKey="searchUrl"
              labelKey="label"
            />
          </div>
        </div>

        {/* Lodging */}
        <div className="mb-8">
          <LinksList
            title="Lodging Options"
            items={plan.lodgingSuggestions}
            urlKey="searchUrl"
            labelKey="type"
            descKey="description"
          />
        </div>

        {/* Best time to book */}
        {plan.bestTimeToBook && (
          <div className="mb-8 bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">
              Booking Strategy
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{plan.bestTimeToBook}</p>
          </div>
        )}

        {/* Packing tips */}
        {plan.packingTips && (
          <div className="mb-8 bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">
              Packing Tips
            </h3>
            <ul className="space-y-2">
              {plan.packingTips.map((tip, i) => (
                <li key={i} className="text-sm text-slate-300 flex gap-2">
                  <span className="text-blue-400">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  )
}