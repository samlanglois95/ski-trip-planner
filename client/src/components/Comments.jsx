import { useEffect, useState } from 'react'
import api from '../lib/api'
import { safeUrl } from '../lib/safeUrl'

function timeAgo(iso) {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const s = Math.floor((Date.now() - then) / 1000)
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

function Card({ children }) {
  return (
    <div className="bg-slate-800/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2.5">
        <span className="w-1.5 h-5 rounded-full bg-blue-500 shrink-0" />
        Comments
      </h2>
      {children}
    </div>
  )
}

// Group comment thread for a trip. Posting is public (anyone with the share
// link) — the server rate-limits, length-caps, and validates the link; here we
// re-check the link with safeUrl and rely on React escaping the text.
export default function Comments({ shareId }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [author, setAuthor] = useState('')
  const [body, setBody] = useState('')
  const [link, setLink] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!shareId) return
    let active = true
    api.get(`/api/trip/shared/${shareId}/comments`)
      .then(res => { if (active) setComments(res.data.data || []) })
      .catch(() => { /* a missing thread just shows empty */ })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [shareId])

  // Comments are keyed off the public share token, so an unshared trip can't
  // have them yet — nudge the owner to share first.
  if (!shareId) {
    return (
      <Card>
        <p className="text-sm text-slate-400">
          Share this trip (the <span className="text-slate-200">Share</span> button up top) to let your group leave comments and weigh in on options.
        </p>
      </Card>
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!author.trim() || !body.trim() || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await api.post(`/api/trip/shared/${shareId}/comments`, {
        author: author.trim(),
        body: body.trim(),
        link: link.trim() || undefined,
      })
      setComments(prev => [...prev, res.data.data])
      setBody('')
      setLink('')
      // keep the name filled in so repeat comments are one click
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0] ||
        err.response?.data?.error ||
        'Could not post your comment. Try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      {loading ? (
        <p className="text-sm text-slate-500">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-slate-500 mb-5">No comments yet — be the first to weigh in.</p>
      ) : (
        <ul className="space-y-3 mb-5">
          {comments.map(c => {
            const href = safeUrl(c.link)
            let host = ''
            try { if (href) host = new URL(href).hostname.replace(/^www\./, '') } catch { /* ignore */ }
            return (
              <li key={c.id} className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3.5">
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <span className="text-sm font-semibold text-white">{c.author}</span>
                  <span className="text-[11px] text-slate-500 shrink-0">{timeAgo(c.created_at)}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-words">{c.body}</p>
                {href && (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition break-all">
                    🔗 {host || 'View link'}
                  </a>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="space-y-2.5 border-t border-slate-700/50 pt-5">
        <input
          type="text"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          maxLength={40}
          placeholder="Your name"
          className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          maxLength={1000}
          rows={2}
          placeholder="Add a comment (e.g. I like this Airbnb — let's book it)"
          className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-y"
        />
        <input
          type="url"
          value={link}
          onChange={e => setLink(e.target.value)}
          maxLength={500}
          placeholder="Optional link (Airbnb, Booking, etc.)"
          className="w-full bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !author.trim() || !body.trim()}
            className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white transition"
          >
            {submitting ? 'Posting…' : 'Post comment'}
          </button>
        </div>
      </form>
    </Card>
  )
}
