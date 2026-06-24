import rateLimit from 'express-rate-limit'

const opts = { standardHeaders: true, legacyHeaders: false }

export const globalLimiter = rateLimit({
  ...opts,
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests, please try again later.' }
})

export const generateLimiter = rateLimit({
  ...opts,
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: { success: false, error: 'Too many trip requests. Please wait before trying again.' }
})

// Comments post from the public shared-trip link (no auth), so keep the abuse
// surface small: 8 posts per 10 min per IP.
export const commentLimiter = rateLimit({
  ...opts,
  windowMs: 10 * 60 * 1000,
  max: 8,
  message: { success: false, error: 'Too many comments. Please wait a bit before posting again.' }
})
