import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import tripRoutes from './routes/trip.js'
import authRoutes from './routes/auth.js'
import { globalLimiter } from './middleware/rateLimiter.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// Hosted behind a single proxy (Render/Vercel) — trust one hop so the rate
// limiter keys on the real client IP instead of the proxy's (and can't be
// bypassed with a spoofed X-Forwarded-For).
app.set('trust proxy', 1)

app.use(cors({
  origin: ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean)
}))
app.use(express.json({ limit: '100kb' }))
app.use(globalLimiter)

// Routes
app.use('/api/trip', tripRoutes)
app.use('/api/auth', authRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
