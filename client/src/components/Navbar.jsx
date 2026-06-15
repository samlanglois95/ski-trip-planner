export default function Navbar() {
  return (
    <nav className="w-full px-8 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-sm bg-slate-900/80 sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <span className="text-2xl">⛷️</span>
        <span className="text-xl font-bold tracking-tight text-white">
          Ski<span className="text-blue-400">Planner</span>
        </span>
      </div>
      <div className="text-sm text-slate-400">
        AI-Powered Trip Planning
      </div>
    </nav>
  )
}