import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import tripRoutes from './routes/trip.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean)
}))
app.use(express.json())

// Routes
app.use('/api/trip', tripRoutes)

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})