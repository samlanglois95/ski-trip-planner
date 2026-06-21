import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

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
    console.log('MapView useEffect fired')
    console.log('resorts:', resorts)
    console.log('flightSuggestions:', flightSuggestions)
    console.log('map.current exists:', !!map.current)
    console.log('departure airport:', flightSuggestions?.[0]?.departureAirport)
    console.log('nearest airport:', flightSuggestions?.[0]?.nearestAirport)
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
          .setHTML(`
            <div style="font-family:system-ui;padding:4px;">
              <p style="font-weight:700;font-size:14px;margin:0 0 4px 0;color:#0f172a">${resort.name}</p>
              <p style="font-size:12px;color:#475569;margin:0 0 2px 0">${resort.region}</p>
              <p style="font-size:12px;color:#475569;margin:0 0 6px 0">${resort.passType} Pass · $${resort.estimatedLiftTicket}/day</p>
              <a href="${resort.bookingUrl}" target="_blank" style="font-size:12px;color:#2563eb;font-weight:600;">Get Tickets →</a>
            </div>
          `)

        new mapboxgl.Marker({ color: passColor })
          .setLngLat([resort.mapboxCoords.lng, resort.mapboxCoords.lat])
          .setPopup(popup)
          .addTo(map.current)
      })

      // Fit map to show everything
      const bounds = new mapboxgl.LngLatBounds()
      validResorts.forEach(r => bounds.extend([r.mapboxCoords.lng, r.mapboxCoords.lat]))
      if (departureCoords) bounds.extend([departureCoords.lng, departureCoords.lat])
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