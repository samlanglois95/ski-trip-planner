import { supabaseAdmin } from '../config/supabase.js'

// listUsers() is paginated (50/page by default), so the old `users.length`
// check only ever saw the first page and silently stopped enforcing the cap
// once real signups passed one page. Page through to a real total instead.
async function countUsers() {
  let page = 1
  let total = 0
  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const n = data?.users?.length ?? 0
    total += n
    if (n === 0) break
    page++
    if (page > 1000) break // safety backstop, far beyond any real user count
  }
  return total
}

export async function signup(req, res) {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ success: false, error: 'Email and password required.' })

  const max = parseInt(process.env.MAX_USERS || '10')

  let userCount
  try {
    userCount = await countUsers()
  } catch (err) {
    console.error('User count error:', err)
    return res.status(500).json({ success: false, error: 'Server error.' })
  }

  if (userCount >= max)
    return res.status(403).json({ success: false, error: 'Signups are currently closed.' })

  const { error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (createErr) return res.status(400).json({ success: false, error: createErr.message })

  res.json({ success: true })
}
