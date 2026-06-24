# SkiPlanner

An AI-powered ski trip planning web application that generates personalized trip recommendations based on your budget, dates, skill level, and preferences. Built with React, Node.js/Express, the Anthropic Claude API, Mapbox GL, and Supabase.

LIVE URL: https://ski-trip-planner-ebon.vercel.app

### NOTE:
The backend is hosted on Render to keep costs realistic, if it is inactive for more than 15 minutes it will spin down.
If the front end loads but you can't generate a trip, give it a minute or two the backend is simply starting up.

## What It Does

Enter your budget, travel dates, group size, skill level, and preferred region. SkiPlanner calls the Anthropic Claude API and returns a complete, structured trip plan including:

- **3 resort recommendations** with real coordinates, lift ticket prices, and direct booking links — drawn from a verified database of 150+ global resorts
- **Interactive Mapbox map** showing resort pins colored by pass type (Ikon/Epic), your departure airport, destination airport, and a flight arc between them
- **Day-by-day itinerary** as a visual timeline with per-day type icons (travel, ski, rest, explore, departure) and a one-click **Add to Calendar** export (.ics)
- **Average snowfall report** per resort with monthly conditions — model-supplied from real resort reputations, not a flaky weather API
- **Pass recommendation** — if your resorts are all on Ikon or Epic, it tells you the estimated season pass cost and whether it beats buying day tickets
- **Deterministic booking links** — flights and rental cars built server-side from your real dates and airport codes (Kayak), lodging filtered to your group size and dates (Airbnb or Booking.com)
- **Getting There guide** — step-by-step from your departure city to the resort: flights, airport transfers, approximate cost and time
- **Know Before You Go** — destination-specific essentials for US travelers: visa, cash, eSIM, power plugs, local etiquette
- **Food & Nightlife** — real, named venues with Google Maps links for live ratings, hours, and directions
- **Per-person budget breakdown** with animated bars showing the split across flights, lodging, lift tickets, rental car, and food
- **Trip saving and history** — auto-saves for signed-in users; browse, revisit, and delete past plans
- **Trip sharing** — generate a public link with a 128-bit token; anyone can view the plan without an account

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| Map | Mapbox GL JS |
| Database & Auth | Supabase (PostgreSQL + Supabase Auth) |
| HTTP Client | Axios with JWT interceptor |
| CI | GitHub Actions (lint + Vite build on every PR) |
| Hosting | Vercel (frontend) + Render (backend) |

---

## Architecture

```
Browser (React + Vite)
    │
    │  axios + JWT in Authorization header
    ▼
Express Backend (Node.js)                     ← API keys never leave here
    │  ├── trust proxy (real client IP for rate limiting)
    │  ├── Rate limiting — 100 req/15 min global, 3 generations/10 min
    │  ├── Input validation — dates, budget, group size, skill level
    │  ├── JWT verification via Supabase Auth
    │  └── Per-user scoped DB queries (user_id enforced)
    │
    ├──▶ Anthropic Claude API     (trip plan generation)
    │       └── Verified resort DB injected into prompt
    │           so coords, airports & URLs are real, not hallucinated
    │
    └──▶ Supabase PostgreSQL      (trip storage + auth)
            └── RLS: users can only read/write their own rows
```

Trip generation flow: validated inputs → resort DB filtered by pass type → prompt built with real resort data → Claude returns structured JSON → server rewrites booking URLs with real dates → plan returned to client → auto-saved for signed-in users.

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- [Supabase](https://supabase.com) project
- [Anthropic](https://console.anthropic.com) API key
- [Mapbox](https://mapbox.com) access token

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ski-trip-planner.git
cd ski-trip-planner
npm run install:all
```

### 2. Set up the database

In your Supabase dashboard → **SQL Editor → New Query**, run:

```sql
create table trips (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  inputs jsonb not null,
  plan jsonb not null,
  trip_name text,
  user_id uuid,
  share_id text unique
);

create index if not exists idx_trips_user_id on trips (user_id);
create index if not exists idx_trips_share_id on trips (share_id);

alter table trips enable row level security;

create policy "users_own_trips" on trips
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create comments table (group comments on a shared trip)
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  trip_id uuid not null references trips(id) on delete cascade,
  author text not null,
  body text not null,
  link text,
  created_at timestamp with time zone default now()
);

-- Index for fast per-trip comment lookups
create index if not exists idx_comments_trip_id on comments (trip_id, created_at);

-- The server reads/writes comments with the service-role key (which bypasses
-- RLS). Enable RLS with no policies so the table is server-only and never
-- reachable with the public anon key.
alter table comments enable row level security;
```

> **Already running an older deploy?** Just run the `create table … comments …`,
> `create index … idx_comments_trip_id …`, and `alter table comments enable row
> level security;` statements above — they're idempotent and safe to re-run.

### 3. Configure environment variables

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
- `ANTHROPIC_API_KEY` — [console.anthropic.com](https://console.anthropic.com) → API Keys
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — Supabase → Settings → API
- `VITE_MAPBOX_TOKEN` — [mapbox.com](https://mapbox.com) → Account → Access Tokens

### 4. Run

```bash
npm run dev
```

Opens frontend at `localhost:5173` and backend at `localhost:4000` concurrently.

---

## Project Structure

```
ski-trip-planner/
├── package.json                      ← root runner (concurrently)
├── .github/workflows/ci.yml          ← lint + build CI on every PR
├── client/                           ← React frontend (deployed to Vercel)
│   ├── vercel.json                   ← SPA rewrite rule for direct URL loads
│   └── src/
│       ├── App.jsx                   ← routing, auth provider, protected routes
│       ├── context/AuthContext.jsx   ← Supabase session, signIn/signUp/signOut
│       ├── lib/
│       │   ├── api.js                ← axios instance with JWT interceptor
│       │   ├── supabase.js           ← Supabase client
│       │   ├── calendar.js           ← .ics generation for Add to Calendar
│       │   └── safeUrl.js            ← URL sanitization utility
│       ├── pages/
│       │   ├── Home.jsx              ← hero, form, staged loading, cold-start retry
│       │   ├── Results.jsx           ← trip plan display, save, share
│       │   ├── Trips.jsx             ← saved trip history
│       │   ├── SharedTrip.jsx        ← public shared trip view (no auth required)
│       │   └── LoginPage.jsx         ← sign in / sign up
│       └── components/
│           ├── TripForm.jsx          ← all trip parameters + tag extras
│           ├── TripPlanView.jsx      ← reusable plan renderer (Results + SharedTrip)
│           ├── MapView.jsx           ← Mapbox map, resort pins, flight arc
│           ├── Itinerary.jsx         ← visual day-by-day timeline
│           ├── ResortCard.jsx        ← resort recommendation card
│           ├── BudgetBreakdown.jsx   ← animated budget bars with per-person split
│           ├── PassAdvice.jsx        ← Ikon/Epic pass recommendation card
│           ├── SnowReport.jsx        ← average snowfall comparison bars
│           ├── LinksList.jsx         ← flight/lodging/car link cards
│           ├── ShareTripModal.jsx    ← share link modal with copy/email/sms
│           └── Navbar.jsx            ← auth-aware navigation
└── server/                           ← Express backend (deployed to Render)
    └── src/
        ├── index.js                  ← Express app, CORS, rate limiting, trust proxy
        ├── config/supabase.js        ← anon + service role clients
        ├── middleware/
        │   ├── auth.js               ← JWT verification via Supabase
        │   ├── rateLimiter.js        ← global + per-route limits
        │   └── validateTrip.js       ← input validation + prompt injection sanitization
        ├── routes/
        │   ├── trip.js               ← trip CRUD + share routes
        │   └── auth.js               ← signup with MAX_USERS cap
        ├── controllers/
        │   ├── tripController.js     ← request/response handlers
        │   └── authController.js     ← signup, paginated user count
        └── services/
            ├── claudeService.js      ← prompt engineering, resort DB injection,
            │                            URL rewriting, Claude API call with timeout
            └── tripStorageService.js ← Supabase CRUD + share token management
```

---

## Security

- API keys are server-side only — never sent to or stored in the browser
- JWT tokens verified server-side via Supabase on every authenticated request
- All trip queries scoped to `req.user.id` — users cannot access each other's data
- Supabase RLS enabled as a second isolation layer
- Trip sharing uses a 128-bit cryptographically random token; public endpoint returns only `trip_name`, `inputs`, and `plan` — never `user_id`
- `MAX_USERS` cap with paginated user count (no silent page-1-only enforcement)
- Rate limiting: 100 req/15 min globally, 3 trip generations/10 min on the AI endpoint
- `trust proxy 1` so rate limiting keys on real client IPs behind Render's proxy
- `express.json({ limit: '100kb' })` payload size cap
- Input validation middleware rejects invalid dates, absurd budgets/group sizes, and sanitizes the extras field against prompt injection
- CORS restricted to known frontend origins only
- CI pipeline — lint + Vite build runs on every PR, broken builds cannot be merged

---

## Environment Variables Reference

| Variable | Where | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | server | Claude API key |
| `SUPABASE_URL` | server + client | Supabase project URL |
| `SUPABASE_ANON_KEY` | server + client | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Admin key — bypasses RLS for backend ops |
| `FRONTEND_URL` | server | Deployed frontend URL for CORS |
| `PORT` | server | Backend port (default 4000) |
| `MAX_USERS` | server | Account creation cap (default 10) |
| `VITE_API_URL` | client | Backend base URL |
| `VITE_MAPBOX_TOKEN` | client | Mapbox public access token |

---

## Resort Database

`server/src/data/resorts.json` contains **150+ verified ski resorts** across 6 continents with real coordinates, IATA airport codes, official website URLs, and lift ticket booking URLs. The database is filtered by pass type and injected directly into the Claude prompt so the model copies exact resort data rather than hallucinating coordinates, airports, or links.

Coverage: Colorado · Utah · California/Tahoe · Pacific Northwest · Wyoming/Montana/Idaho · Vermont/New England · British Columbia · Alberta · Quebec · French Alps · Swiss Alps · Austrian Alps · Italian Dolomites · Japan (Hokkaido + Honshu) · South Korea · China · Chile · Argentina · New Zealand · Australia

---

## Deployment

### Frontend → Vercel
- Root Directory: `client`
- Framework: Vite (auto-detected)
- `client/vercel.json` includes the SPA rewrite rule so direct URL loads (shared trip links) resolve correctly instead of 404ing

### Backend → Render
- Root Directory: `server`
- Build: `npm install` · Start: `npm start`
- Add all `server/.env` variables in Render's environment settings
- Free tier spins down after inactivity; the app pings `/health` on mount to pre-warm the server while you fill the form, and auto-retries once on a fast gateway failure

---

## Roadmap

- [ ] RSVP / comments on shared trips
- [ ] Expand to general travel (beach, city, adventure)
- [ ] Mobile layout pass
- [ ] Error boundary components

---

## Work Log

### June 24, 2026
- Merged PR #5: deterministic Kayak flight/car URLs built server-side from real inputs; Airbnb links filtered to group size and bedroom count
- Merged PR #6: per-person budget split, Ikon/Epic pass recommendation card, snowfall report, Add to Calendar (.ics export), tailored Airbnb lodging
- Merged PR #7: staged loading progress messages, first-timer Getting There + Know Before You Go + Food & Nightlife sections with Google Maps links, model-supplied snowfall data

### June 23, 2026
- Merged PR #3: `client/vercel.json` SPA rewrite — fixes shared trip links 404ing on direct load
- Merged PR #2: auto-save on generation, resort DB grounded into prompt (real coords/URLs/airports), MAX_USERS pagination fix, Claude call hardened (60s timeout, 429/529 → 503, finds text block), cold-start handling with auto-retry, GitHub Actions CI pipeline

### June 19, 2026
- Merged PR #1: itinerary visual timeline with day-type icons, trip sharing with 128-bit tokens and public route, XSS/rate-limit fixes
- Added Mapbox interactive map with resort pins, flight arc, departure/destination markers
- Added hero background image and glassmorphism form card
- Expanded resort database to 150+ global destinations across 6 continents
- Added multi-region selection with continent grouping

### June 17, 2026
- Added Supabase Auth — sign in, sign up, protected routes, per-user trip storage with RLS
- Added rate limiting, input validation, prompt injection sanitization, MAX_USERS cap
- Added axios interceptor for automatic JWT attachment on every request

### June 15, 2026
- Initial project scaffold — React frontend, Express backend, Claude API integration
- Trip planning form, results page, Supabase trip history, concurrently dev setup

---

## License

MIT