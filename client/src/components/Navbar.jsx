import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()

  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-sm bg-slate-900/80 sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 21L12 3l10 18H2z"/>
        </svg>
        <span className="text-xl font-bold tracking-tight text-white">
          Ski<span className="text-blue-400">Planner</span>
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-xs text-slate-500 hidden sm:block max-w-40 truncate">
              {user.email}
            </span>
            <Link to="/trips" className="text-sm text-slate-400 hover:text-white transition">
              My Trips
            </Link>
            <button
              onClick={signOut}
              className="text-sm text-slate-400 hover:text-white transition"
            >
              Sign out
            </button>
            <Link to="/" className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition">
              + New Trip
            </Link>
          </>
        ) : (
          <>
            <Link to="/trips" className="text-sm text-slate-400 hover:text-white transition">
              My Trips
            </Link>
            <Link to="/login" className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition">
              Sign in
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
