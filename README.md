# SkiPlanner

An AI-powered ski trip planning web application that generates personalized trip recommendations based on your budget, dates, skill level, and preferences. Built with React, Node.js/Express, the Anthropic Claude API, Mapbox GL, and Supabase.

LIVE URL: https://ski-trip-planner-ebon.vercel.app/trips

### NOTE:
The backend is hosted on Render to keep costs realistic, if it is inactive for more than 15 minutes it will spin down.
If the front end loads but you can't generate a trip, give it a minute or two the backend is simply starting up.

---

## Features

- **AI Trip Generation** — Claude AI analyzes your inputs and returns a fully structured trip plan including resort recommendations, budget breakdown, flight search links, lodging options, rental car links, packing tips, and booking strategy
- **Interactive Map** — Mapbox GL visualization showing recommended resort pins colored by pass type (Ikon/Epic), departure airport marker, destination airport marker, and a dashed flight arc between them
- **Global Resort Database** — 150+ resorts across 6 continents including North America, Europe, Japan, South Korea, China, South America, New Zealand, and Australia — with Ikon, Epic, and independent resort coverage
- **Smart Budget Planning** — Enter budget as a total or per-person amount with live calculation showing the equivalent in the other format
- **Multi-Region Selection** — Choose one or multiple regions grouped by continent; Claude picks the best match based on your other criteria
- **Trip Preferences** — Add extras (ski rentals, terrain park, pet-friendly lodging, après-ski, etc.) for more personalized recommendations
- **User Authentication** — Supabase Auth with protected routes, per-user trip storage, and a max-user cap to prevent abuse
- **Trip History** — Save, browse, and revisit past trip plans; delete trips you no longer need
- **Rate Limiting** — Global and per-route rate limiting on the backend to protect API costs

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| AI | Anthropic Claude API (`claude-sonnet-4-6`) |
| Map | Mapbox GL JS |
| Database & Auth | Supabase (PostgreSQL + Supabase Auth) |
| HTTP Client | Axios |
| Hosting (Frontend) | Vercel |
| Hosting (Backend) | Render / Railway |

---

## Architecture

```
Browser (React + Vite)
    │
    │  axios + JWT in Authorization header
    ▼
Express Backend (Node.js)
    │  ├── Rate limiting (express-rate-limit)
    │  ├── CORS (localhost + deployed frontend)
    │  ├── JWT verification via Supabase Auth
    │  └── Scoped DB queries (user_id enforced)
    │
    ├──▶ Anthropic Claude API  (trip generation)
    └──▶ Supabase PostgreSQL   (trip storage)
```

The backend acts as a secure middleman — API keys never reach the browser. All trip storage operations are scoped to the authenticated user's ID, enforced both in the query layer and via Supabase Row Level Security.

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com) project
- An [Anthropic](https://console.anthropic.com) API key
- A [Mapbox](https://mapbox.com) access token

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ski-trip-planner.git
cd ski-trip-planner
```

### 2. Install dependencies

```bash
npm run install:all
```

### 3. Set up the database

In your Supabase dashboard, go to **SQL Editor → New Query** and run:

```sql
-- Create trips table
create table trips (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  inputs jsonb not null,
  plan jsonb not null,
  trip_name text,
  user_id uuid
);

-- Index for fast per-user lookups
create index if not exists idx_trips_user_id on trips (user_id);

-- Enable Row Level Security
alter table trips enable row level security;

-- Policy: users can only access their own rows
create policy "users_own_trips" on trips
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
```

### 4. Configure environment variables

**`server/.env`**
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:5173
PORT=4000
MAX_USERS=10
```

**`client/.env`**
```
VITE_API_URL=http://localhost:4000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_MAPBOX_TOKEN=pk.your-mapbox-token
```

Where to find each value:
- `ANTHROPIC_API_KEY` → [console.anthropic.com](https://console.anthropic.com) → API Keys
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` → Supabase dashboard → Settings → API
- `VITE_MAPBOX_TOKEN` → [mapbox.com](https://mapbox.com) → Account → Access Tokens

### 5. Run the app

```bash
npm run dev
```

This starts both the frontend (`localhost:5173`) and backend (`localhost:4000`) concurrently.

---

## Project Structure

```
ski-trip-planner/
├── package.json                  ← root runner (concurrently)
├── client/                       ← React frontend
│   ├── src/
│   │   ├── App.jsx               ← routing + auth provider + protected routes
│   │   ├── main.jsx
│   │   ├── index.css             ← Tailwind + custom animations
│   │   ├── context/
│   │   │   └── AuthContext.jsx   ← Supabase auth state + signIn/signUp/signOut
│   │   ├── lib/
│   │   │   ├── api.js            ← axios instance with JWT interceptor
│   │   │   └── supabase.js       ← Supabase client
│   │   ├── pages/
│   │   │   ├── Home.jsx          ← hero image, form, loading overlay
│   │   │   ├── Results.jsx       ← trip plan display with map
│   │   │   ├── Trips.jsx         ← saved trip history
│   │   │   └── LoginPage.jsx     ← sign in / sign up
│   │   └── components/
│   │       ├── TripForm.jsx      ← all trip parameters + tag extras
│   │       ├── MapView.jsx       ← Mapbox map with resort pins + flight arc
│   │       ├── ResortCard.jsx    ← individual resort recommendation card
│   │       ├── BudgetBreakdown.jsx ← animated budget bars
│   │       ├── LinksList.jsx     ← flight/lodging/car link cards
│   │       └── Navbar.jsx        ← auth-aware navigation
│   └── vite.config.js
└── server/                       ← Express backend
    └── src/
        ├── index.js              ← Express app, CORS, rate limiting
        ├── config/
        │   └── supabase.js       ← anon + service role Supabase clients
        ├── middleware/
        │   ├── auth.js           ← JWT verification via Supabase
        │   └── rateLimiter.js    ← global + generate-specific limits
        ├── routes/
        │   ├── trip.js           ← trip CRUD routes
        │   └── auth.js           ← signup route
        ├── controllers/
        │   ├── tripController.js ← request handlers
        │   └── authController.js ← signup with MAX_USERS cap
        ├── services/
        │   ├── claudeService.js  ← prompt engineering + Claude API call
        │   └── tripStorageService.js ← Supabase CRUD operations
        └── data/
            └── resorts.json      ← 75+ global resort database
```

---

## Security

- API keys stored server-side only, never exposed to the browser
- All authenticated routes verify JWT tokens via Supabase Auth before processing
- Trip operations scoped to `req.user.id` — users cannot access each other's data
- Supabase Row Level Security enabled as a second layer of data isolation
- `MAX_USERS` environment variable caps account creation
- Rate limiting: 100 requests / 15 min globally, 3 trip generations / 10 min on the AI endpoint
- CORS restricted to known frontend origins only

---

## Environment Variables Reference

| Variable | Location | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | server | Claude API key |
| `SUPABASE_URL` | server + client | Supabase project URL |
| `SUPABASE_ANON_KEY` | server + client | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Admin key (bypasses RLS) |
| `FRONTEND_URL` | server | Deployed frontend URL for CORS |
| `PORT` | server | Backend port (default 4000) |
| `MAX_USERS` | server | Max accounts allowed (default 10) |
| `VITE_API_URL` | client | Backend base URL |
| `VITE_MAPBOX_TOKEN` | client | Mapbox public token |

---

## Roadmap

- [ ] Deploy to Vercel (frontend) + Render (backend)
- [ ] Snow condition integration (live resort snow reports)
- [ ] Expand to general travel (beach, city, adventure trips)
- [ ] Trip sharing via public link
- [ ] Side panel on map hover showing resort details
- [ ] Mobile-optimized layout pass
- [ ] Error boundary components for resilient rendering

---

## Work Log

### June 22, 2026
- Added security featues: Rate limiting to prevent token overuse as well as a limit on the # of accounts

### June 20, 2026
- Added Auth system using Supabase
- Polished the look of the app, removing unneeded fluff

### June 19, 2026
- Added Mapbox interactive map with resort pins, flight arc, departure/destination markers
- Added hero background image and results page hero banner
- Added animated loading overlay with snowflakes
- Expanded resort database to 75+ global destinations across 6 continents
- Added multi-region selection with continent grouping
- Added tag-based trip extras (equipment, group, lodging, vibe preferences)

### June 17, 2026
- Added Supabase Auth — sign in, sign up, protected routes, per-user trip storage
- Added rate limiting and MAX_USERS cap for security
- Added `api.js` axios interceptor for automatic JWT attachment
- Migrated trip storage to per-user scoped queries with RLS

### June 15, 2026
- Initial project scaffold — React frontend, Express backend, Claude API integration
- Trip planning form with all parameters
- Results page with resort cards, budget breakdown, lodging/flight links
- Supabase trip history (save, view, delete)
- Concurrently setup for single-command dev startup

---

## License

MIT