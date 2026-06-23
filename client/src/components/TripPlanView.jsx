import ResortCard from './ResortCard'
import BudgetBreakdown from './BudgetBreakdown'
import LinksList from './LinksList'
import MapView from './MapView'
import Itinerary from './Itinerary'
import PassAdvice from './PassAdvice'
import SnowReport from './SnowReport'
import { buildItineraryICS, downloadICS } from '../lib/calendar'

function SectionCard({ children, delay = 0, className = '' }) {
  return (
    <div
      className={`bg-slate-800/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 fade-in-up ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2.5">
      <span className="w-1.5 h-5 rounded-full bg-blue-500 shrink-0" />
      {children}
    </h2>
  )
}

// Presentational view of a trip plan, shared by the Results page (owner) and
// the public SharedTrip page (anyone with the link).
export default function TripPlanView({ plan }) {
  if (!plan) return null

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">

      {/* Warning banner */}
      {plan.importantWarning && (
        <div className="p-4 bg-amber-900/30 border border-amber-700/40 rounded-xl text-amber-200 text-sm leading-relaxed fade-in-up">
          {plan.importantWarning}
        </div>
      )}

      {/* Summary */}
      <SectionCard delay={0.05}>
        <SectionHeading>Trip Summary</SectionHeading>
        <p className="text-slate-300 leading-relaxed">{plan.summary}</p>
      </SectionCard>

      {/* Map */}
      <SectionCard delay={0.1} className="p-0! overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <SectionHeading>Resort Locations</SectionHeading>
        </div>
        <div className="px-6 pb-6">
          <MapView resorts={plan.topResorts} flightSuggestions={plan.flightSuggestions} />
        </div>
      </SectionCard>

      {/* Resorts */}
      <SectionCard delay={0.15}>
        <SectionHeading>Recommended Resorts</SectionHeading>
        <div className="grid md:grid-cols-3 gap-4">
          {plan.topResorts?.map((resort, i) => (
            <ResortCard key={i} resort={resort} rank={i + 1} />
          ))}
        </div>
      </SectionCard>

      {/* Pass advice (renders nothing if no single pass helps) */}
      <PassAdvice recommendation={plan.passRecommendation} />

      {/* Live snow */}
      {plan.topResorts?.length > 0 && (
        <SectionCard delay={0.16}>
          <SectionHeading>Current Snow</SectionHeading>
          <SnowReport resorts={plan.topResorts} />
        </SectionCard>
      )}

      {/* Day-by-day itinerary */}
      {plan.itinerary?.length > 0 && (
        <SectionCard delay={0.18}>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2.5">
              <span className="w-1.5 h-5 rounded-full bg-blue-500 shrink-0" />
              Day-by-Day Itinerary
            </h2>
            {plan.startDate && (
              <button
                onClick={() => {
                  const ics = buildItineraryICS(plan.itinerary, plan.startDate, plan.topResorts?.[0]?.region || 'Ski Trip')
                  if (ics) downloadICS('ski-trip.ics', ics)
                }}
                className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
              >
                Add to Calendar
              </button>
            )}
          </div>
          <Itinerary itinerary={plan.itinerary} />
        </SectionCard>
      )}

      {/* Budget + Links */}
      <div className="grid md:grid-cols-2 gap-6 fade-in-up" style={{ animationDelay: '0.2s' }}>
        <BudgetBreakdown budget={plan.budgetBreakdown} groupSize={plan.groupSize} />
        <div className="space-y-4">
          <SectionCard delay={0.22}>
            <LinksList
              title="Flights"
              items={plan.flightSuggestions}
              urlKey="searchUrl"
              labelKey="nearestAirport"
            />
          </SectionCard>
          <SectionCard delay={0.24}>
            <LinksList
              title="Rental Car"
              items={plan.rentalCarUrl ? [{ searchUrl: plan.rentalCarUrl, label: 'Search rental cars' }] : []}
              urlKey="searchUrl"
              labelKey="label"
            />
          </SectionCard>
        </div>
      </div>

      {/* Lodging */}
      <SectionCard delay={0.25}>
        <LinksList
          title="Lodging Options"
          items={plan.lodgingSuggestions}
          urlKey="searchUrl"
          labelKey="type"
          descKey="description"
        />
      </SectionCard>

      {/* Booking Strategy */}
      {plan.bestTimeToBook && (
        <SectionCard delay={0.3}>
          <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-blue-500 shrink-0" />
            Booking Strategy
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">{plan.bestTimeToBook}</p>
        </SectionCard>
      )}

    </div>
  )
}
