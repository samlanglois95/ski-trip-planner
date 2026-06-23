import { useState } from 'react'

export default function ShareTripModal({ url, tripName, onClose }) {
  const [copied, setCopied] = useState(false)

  const name = tripName || 'my ski trip'
  const subject = `Check out ${name}`
  const body = `I planned a ski trip — take a look:\n\n${url}`
  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  const sms = `sms:?&body=${encodeURIComponent(`${subject} ${url}`)}`
  const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share

  function copy() {
    navigator.clipboard?.writeText(url)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  function nativeShare() {
    navigator.share?.({ title: subject, text: 'My ski trip plan', url }).catch(() => {})
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-bold text-white">Share this trip</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-white transition text-xl leading-none -mt-1"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-slate-400 mb-5">
          Anyone with this link can view the plan — no account needed.
        </p>

        {/* Link + copy */}
        <div className="flex gap-2 mb-5">
          <input
            type="text"
            readOnly
            value={url}
            onFocus={e => e.target.select()}
            className="flex-1 bg-slate-900/70 border border-slate-600 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={copy}
            className="shrink-0 text-sm font-medium px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Send options */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={mailto}
            className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
          >
            Email
          </a>
          <a
            href={sms}
            className="flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
          >
            Text
          </a>
        </div>

        {canNativeShare && (
          <button
            onClick={nativeShare}
            className="w-full mt-3 text-sm font-medium px-4 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
          >
            More sharing options…
          </button>
        )}
      </div>
    </div>
  )
}
