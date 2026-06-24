// Validate + normalise a public comment before it touches the DB. Comments are
// posted without auth from the shared-trip link, so this is the trust boundary:
// cap lengths (cheap denial-of-wallet / spam guard) and only accept http(s)
// links. The comment text is rendered through React (auto-escaped) and any link
// is re-checked with safeUrl on the client, so this is the server-side half.
export function validateComment(req, res, next) {
  const { author, body, link } = req.body
  const errors = []

  if (typeof author !== 'string' || !author.trim()) {
    errors.push('Name is required')
  } else if (author.trim().length > 40) {
    errors.push('Name must be 40 characters or less')
  }

  if (typeof body !== 'string' || !body.trim()) {
    errors.push('Comment text is required')
  } else if (body.trim().length > 1000) {
    errors.push('Comment must be 1000 characters or less')
  }

  // Optional link — must be a real http(s) URL if present.
  let normalizedLink = null
  if (link != null && link !== '') {
    if (typeof link !== 'string' || link.length > 500) {
      errors.push('Link is too long')
    } else {
      try {
        const u = new URL(link)
        if (u.protocol !== 'http:' && u.protocol !== 'https:') {
          errors.push('Link must be an http(s) URL')
        } else {
          normalizedLink = u.href
        }
      } catch {
        errors.push('Link must be a valid URL')
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors })
  }

  req.body.author = author.trim()
  req.body.body = body.trim()
  req.body.link = normalizedLink
  next()
}
