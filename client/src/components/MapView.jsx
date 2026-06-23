import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import { safeUrl } from '../lib/safeUrl'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const AIRPORTS = {
  SLC: { lat: 40.7899, lng: -111.9791 },
  DEN: { lat: 39.8561, lng: -104.6737 },
  LAX: { lat: 33.9425, lng: -118.4081 },
  SFO: { lat: 37.6213, lng: -122.3790 },
  SEA: { lat: 47.4502, lng: -122.3088 },
  BOS: { lat: 42.3656, lng: -71.0096 },
  JFK: { lat: 40.6413, lng: -73.7781 },
  ORD: { lat: 41.9742, lng: -87.9073 },
  ATL: { lat: 33.6407, lng: -84.4277 },
  MIA: { lat: 25.7959, lng: -80.2870 },
  PHL: { lat: 39.8729, lng: -75.2437 },
  PHX: { lat: 33.4373, lng: -112.0078 },
  LAS: { lat: 36.0840, lng: -115.1537 },
  MSP: { lat: 44.8848, lng: -93.2223 },
  DTW: { lat: 42.2162, lng: -83.3554 },
  IAD: { lat: 38.9531, lng: -77.4565 },
  DCA: { lat: 38.8512, lng: -77.0402 },
  EWR: { lat: 40.6895, lng: -74.1745 },
  BDL: { lat: 41.9389, lng: -72.6832 },
  PVD: { lat: 41.7235, lng: -71.4283 },
  CDG: { lat: 49.0097, lng: 2.5479 },
  LHR: { lat: 51.4775, lng: -0.4614 },
  YYC: { lat: 51.1215, lng: -114.0076 },
  YVR: { lat: 49.1967, lng: -123.1815 },
  BLI: { lat: 48.7928, lng: -122.5375 },
  GEG: { lat: 47.6199, lng: -117.5339 },
  PDX: { lat: 45.5898, lng: -122.5951 },
  RNO: { lat: 39.4991, lng: -119.7681 },
  MMH: { lat: 37.6241, lng: -118.8378 },
  HDN: { lat: 40.4812, lng: -107.2218 },
  EGE: { lat: 39.6426, lng: -106.9177 },
  ASE: { lat: 39.2232, lng: -106.8689 },
  TEX: { lat: 37.9536, lng: -107.9088 },
  SMF: { lat: 38.6954, lng: -121.5908 },
  // Additional North America
  ABQ: { lat: 35.0402, lng: -106.6090 },
  BOI: { lat: 43.5644, lng: -116.2228 },
  BTV: { lat: 44.4719, lng: -73.1533 },
  BZN: { lat: 45.7772, lng: -111.1530 },
  DRO: { lat: 37.1515, lng: -107.7538 },
  FCA: { lat: 48.3105, lng: -114.2560 },
  GUC: { lat: 38.5339, lng: -106.9331 },
  JAC: { lat: 43.6073, lng: -110.7377 },
  PWM: { lat: 43.6462, lng: -70.3093 },
  RDM: { lat: 44.2541, lng: -121.1500 },
  SUN: { lat: 43.5044, lng: -114.2961 },
  // Canada
  YEG: { lat: 53.3097, lng: -113.5800 },
  YUL: { lat: 45.4706, lng: -73.7408 },
  YQB: { lat: 46.7911, lng: -71.3933 },
  YCG: { lat: 49.2964, lng: -117.6322 },
  YKA: { lat: 50.7022, lng: -120.4442 },
  YXC: { lat: 49.6108, lng: -115.7822 },
  // Europe
  GVA: { lat: 46.2381, lng: 6.1090 },
  ZRH: { lat: 47.4647, lng: 8.5492 },
  INN: { lat: 47.2602, lng: 11.3440 },
  SZG: { lat: 47.7933, lng: 13.0043 },
  MUC: { lat: 48.3538, lng: 11.7861 },
  GRZ: { lat: 46.9911, lng: 15.4396 },
  GNB: { lat: 45.3629, lng: 5.3294 },
  TRN: { lat: 45.2008, lng: 7.6496 },
  VCE: { lat: 45.5053, lng: 12.3519 },
  VRN: { lat: 45.3957, lng: 10.8885 },
  BGY: { lat: 45.6739, lng: 9.7042 },
  BZO: { lat: 46.4602, lng: 11.3264 },
  OSD: { lat: 63.1944, lng: 14.5003 },
  // Asia
  CTS: { lat: 42.7752, lng: 141.6923 },
  HND: { lat: 35.5494, lng: 139.7798 },
  NRT: { lat: 35.7720, lng: 140.3929 },
  ITM: { lat: 34.7855, lng: 135.4382 },
  AOJ: { lat: 40.7347, lng: 140.6907 },
  SDJ: { lat: 38.1397, lng: 140.9171 },
  ICN: { lat: 37.4602, lng: 126.4407 },
  PEK: { lat: 40.0799, lng: 116.6031 },
  // Southern Hemisphere
  SCL: { lat: -33.3930, lng: -70.7858 },
  CCP: { lat: -36.7727, lng: -73.0631 },
  MDZ: { lat: -32.8317, lng: -68.7929 },
  BRC: { lat: -41.1512, lng: -71.1575 },
  CPC: { lat: -40.0754, lng: -71.1373 },
  NQN: { lat: -38.9490, lng: -68.1557 },
  ZQN: { lat: -45.0211, lng: 168.7392 },
  CHC: { lat: -43.4894, lng: 172.5322 },
  WLG: { lat: -41.3272, lng: 174.8053 },
  MEL: { lat: -37.6690, lng: 144.8410 },
  AVV: { lat: -38.0394, lng: 144.4694 },
  CBR: { lat: -35.3069, lng: 149.1950 },
}

function getCoords(code) {
  if (!code) return null
  const clean = code.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3)
  return AIRPORTS[clean] || null
}

function arcCoords(from, to, steps = 60) {
  const coords = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const lat = from.lat + (to.lat - from.lat) * t
    const lng = from.lng + (to.lng - from.lng) * t
    const arc = Math.sin(Math.PI * t) * (Math.abs(to.lng - from.lng) * 0.2)
    coords.push([lng, lat + arc])
  }
  return coords
}

// Build the resort popup as DOM nodes with textContent (never innerHTML), so
// AI-supplied fields like resort.name can't inject markup/script. The booking
// link is scheme-checked via safeUrl before it becomes an href.
function buildPopupContent(resort) {
  const wrap = document.createElement('div')
  wrap.style.cssText = 'font-family:system-ui;padding:4px;'

  const name = document.createElement('p')
  name.style.cssText = 'font-weight:700;font-size:14px;margin:0 0 4px 0;color:#0f172a'
  name.textContent = resort.name ?? ''

  const region = document.createElement('p')
  region.style.cssText = 'font-size:12px;color:#475569;margin:0 0 2px 0'
  region.textContent = resort.region ?? ''

  const pass = document.createElement('p')
  pass.style.cssText = 'font-size:12px;color:#475569;margin:0 0 6px 0'
  const ticket = resort.estimatedLiftTicket != null ? `$${resort.estimatedLiftTicket}/day` : ''
  pass.textContent = [resort.passType ? `${resort.passType} Pass` : '', ticket].filter(Boolean).join(' · ')

  wrap.append(name, region, pass)

  const booking = safeUrl(resort.bookingUrl)
  if (booking) {
    const link = document.createElement('a')
    link.href = booking
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.style.cssText = 'font-size:12px;color:#2563eb;font-weight:600;'
    link.textContent = 'Get Tickets →'
    wrap.append(link)
  }

  return wrap
}

function addMarker(map, coords, emoji, color) {
  const el = document.createElement('div')
  el.style.cssText = `
    width: 32px; height: 32px; border-radius: 50%;
    background: ${color}; border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white; font-family: system-ui;
    cursor: default; position: relative;
  `
  el.innerHTML = emoji
  new mapboxgl.Marker(el).setLngLat([coords.lng, coords.lat]).addTo(map)
}

export default function MapView({ resorts, flightSuggestions }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  // activeResort used for hover tooltip — feature in progress

  useEffect(() => {
    if (!resorts || resorts.length === 0) return
    if (map.current) return

    const validResorts = resorts.filter(r => r.mapboxCoords?.lat && r.mapboxCoords?.lng)
    if (validResorts.length === 0) return

    const avgLat = validResorts.reduce((sum, r) => sum + r.mapboxCoords.lat, 0) / validResorts.length
    const avgLng = validResorts.reduce((sum, r) => sum + r.mapboxCoords.lng, 0) / validResorts.length

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [avgLng, avgLat],
      zoom: 5
    })

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

    map.current.on('load', () => {
      // Get departure and destination airports
      const firstFlight = flightSuggestions?.[0]
      const departureCoords = getCoords(firstFlight?.departureAirport)
      const destinationCoords = getCoords(firstFlight?.nearestAirport)

      // Draw flight arc from departure to destination airport
      if (departureCoords && destinationCoords) {
        const arcPoints = arcCoords(departureCoords, destinationCoords)
        map.current.addSource('flight-arc', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: arcPoints }
          }
        })
        map.current.addLayer({
          id: 'flight-arc',
          type: 'line',
          source: 'flight-arc',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#f59e0b',
            'line-width': 2,
            'line-opacity': 0.7,
            'line-dasharray': [2, 2]
          }
        })

        // Departure airport marker
        addMarker(map.current, departureCoords, 'H', '#f59e0b')

        // Destination airport marker
        addMarker(map.current, destinationCoords, 'A', '#f59e0b')
      }

      // Resort markers
      validResorts.forEach((resort) => {
        const passColor = resort.passType === 'Ikon'
          ? '#a855f7'
          : resort.passType === 'Epic'
          ? '#3b82f6'
          : '#64748b'

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setDOMContent(buildPopupContent(resort))

        new mapboxgl.Marker({ color: passColor })
          .setLngLat([resort.mapboxCoords.lng, resort.mapboxCoords.lat])
          .setPopup(popup)
          .addTo(map.current)
      })

      // Frame the map on the resorts (plus the destination airport) rather than
      // the whole departure→destination flight span, so the ski area isn't tiny
      // and stuck at the edge. The departure marker + arc still draw; pan/zoom
      // out to see the full flight path.
      const bounds = new mapboxgl.LngLatBounds()
      validResorts.forEach(r => bounds.extend([r.mapboxCoords.lng, r.mapboxCoords.lat]))
      if (destinationCoords) bounds.extend([destinationCoords.lng, destinationCoords.lat])
      map.current.fitBounds(bounds, { padding: 80, maxZoom: 9 })
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [resorts, flightSuggestions])

  if (!resorts || resorts.length === 0) return null

  return (
    <div className="rounded-xl border border-slate-700/50" style={{ height: '420px', position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%', borderRadius: '0.75rem' }} />

      <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-4 text-xs text-slate-300">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
          Ikon
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          Epic
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-500 inline-block" />
          Other
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-amber-500 inline-flex items-center justify-center text-[8px] font-bold text-white">H</span>
          You
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded-full bg-amber-500 inline-flex items-center justify-center text-[8px] font-bold text-white">A</span>
          Fly into
        </span>
      </div>
    </div>
  )
}