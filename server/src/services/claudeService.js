import axios from 'axios'

export async function buildTripPlan(inputs) {
  const {
    budget, startDate, endDate, skillLevel,
    tripType, preferredRegion, passType, groupSize, flexibility
  } = inputs

  const prompt = `
You are an expert ski trip planner. Based on the following user inputs, generate a detailed ski trip plan.

USER INPUTS:
- Budget: $${budget} total for ${groupSize} people
- Dates: ${startDate} to ${endDate}
- Skill Level: ${skillLevel} (beginner/intermediate/advanced/expert)
- Trip Type: ${tripType} (resort/backcountry/hybrid)
- Preferred Region: ${preferredRegion}
- Pass Type: ${passType} (Ikon/Epic/none/flexible)
- Flexibility: ${flexibility}

Return ONLY valid JSON in this exact structure, no extra text:
{
  "summary": "2-3 sentence overview of the recommended trip",
  "topResorts": [
    {
      "name": "Resort Name",
      "region": "Colorado",
      "passType": "Ikon",
      "skillMatch": "intermediate-advanced",
      "whyRecommended": "Short reason",
      "estimatedLiftTicket": 120,
      "websiteUrl": "https://...",
      "bookingUrl": "https://...",
      "mapboxCoords": { "lat": 39.48, "lng": -106.06 }
    }
  ],
  "flightSuggestions": [
    {
      "nearestAirport": "DEN",
      "searchUrl": "https://www.google.com/flights?..."
    }
  ],
  "lodgingSuggestions": [
    {
      "type": "hotel or airbnb",
      "description": "Ski-in/ski-out lodge",
      "searchUrl": "https://www.airbnb.com/s/..."
    }
  ],
  "rentalCarUrl": "https://www.kayak.com/cars/...",
  "budgetBreakdown": {
    "flights": 400,
    "lodging": 600,
    "liftTickets": 300,
    "rentalCar": 200,
    "food": 150,
    "total": 1650
  },
  "packingTips": ["tip1", "tip2"],
  "bestTimeToBook": "Book flights 6-8 weeks out for best prices"
}
  `

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    },
    {
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      }
    }
  )

  const text = response.data.content[0].text
  const cleaned = text.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}