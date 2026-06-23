function pad(n) { return String(n).padStart(2, '0') }

function icsDate(d) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`
}

function escapeICS(s) {
  return String(s || '').replace(/([\\,;])/g, '\\$1').replace(/\n/g, '\\n')
}

// Build an .ics calendar (one all-day event per itinerary day) from the
// itinerary + the trip start date.
export function buildItineraryICS(itinerary, startDate, tripName = 'Ski Trip') {
  if (!Array.isArray(itinerary) || itinerary.length === 0 || !startDate) return null
  const start = new Date(`${startDate}T00:00:00Z`)
  if (isNaN(start.getTime())) return null

  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SkiPlanner//EN', 'CALSCALE:GREGORIAN']

  itinerary.forEach((day, i) => {
    const dayNum = Number(day?.day) || (i + 1)
    const date = new Date(start.getTime() + (dayNum - 1) * 86400000)
    const next = new Date(date.getTime() + 86400000)
    const activities = Array.isArray(day?.activities)
      ? day.activities.map(a => (typeof a === 'string' ? a : Object.values(a || {}).filter(v => typeof v === 'string').join(' ')))
      : []
    const description = [day?.description, activities.join('\n')].filter(Boolean).join('\n\n')

    lines.push(
      'BEGIN:VEVENT',
      `UID:skiplanner-day${dayNum}-${icsDate(date)}@skiplanner`,
      `DTSTART;VALUE=DATE:${icsDate(date)}`,
      `DTEND;VALUE=DATE:${icsDate(next)}`,
      `SUMMARY:${escapeICS(`${tripName} — Day ${dayNum}: ${day?.title || ''}`)}`,
      `DESCRIPTION:${escapeICS(description)}`,
      'END:VEVENT'
    )
  })

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

export function downloadICS(filename, content) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
