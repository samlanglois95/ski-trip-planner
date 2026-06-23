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

      {/* Average snowfall */}
      {plan.snowReport?.length > 0 && (
        <SectionCard delay={0.16}>
          <SectionHeading>Average Snowfall</SectionHeading>
          <SnowReport snowReport={plan.snowReport} />
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

      {/* Getting there */}
      {plan.gettingThere?.length > 0 && (
        <SectionCard delay={0.19}>
          <SectionHeading>Getting There</SectionHeading>
          <ol className="space-y-3">
            {plan.gettingThere.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-300">
                <span className="shrink-0 w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="leading-relaxed pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
      )}

      {/* Food & nightlife */}
      {plan.foodAndDrink?.length > 0 && (
        <SectionCard delay={0.2}>
          <SectionHeading>Food & Nightlife</SectionHeading>
          <div className="grid sm:grid-cols-2 gap-3">
            {plan.foodAndDrink.map((item, i) => {
              const obj = item && typeof item === 'object'
              const name = obj ? item.name : item
              const vibe = obj ? item.vibe : null
              const why = obj ? item.why : null
              const url = obj ? item.mapsUrl : null
              return (
                <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3.5 hover:border-slate-600 transition-colors">
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-white hover:text-amber-300 transition inline-flex items-center gap-1">
                      {name} <span className="text-amber-400 text-xs">↗</span>
                    </a>
                  ) : (
                    <span className="text-sm font-semibold text-white">{name}</span>
                  )}
                  {vibe && (
                    <div className="text-[10px] uppercase tracking-wide text-amber-300/80 mt-0.5">{vibe}</div>
                  )}
                  {why && <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{why}</p>}
                </div>
              )
            })}
          </div>
          <p className="text-xs text-slate-500 mt-3">Tap a spot to open it in Google Maps — live ratings, hours & directions.</p>
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

      {/* Know before you go */}
      {plan.essentials?.length > 0 && (
        <SectionCard delay={0.28}>
          <SectionHeading>Know Before You Go</SectionHeading>
          <ul className="space-y-2.5">
            {plan.essentials.map((item, i) => (
              <li key={i} className="text-sm text-slate-300 flex gap-2.5 leading-relaxed">
                <span className="shrink-0 mt-0.5 text-green-400">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

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
