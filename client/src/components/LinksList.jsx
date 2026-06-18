export default function LinksList({ title, items, urlKey, labelKey, descKey }) {
  if (!items || items.length === 0) return null

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <a key={i} href={item[urlKey]} target="_blank" rel="noopener noreferrer" className="block bg-slate-900/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg p-3.5 transition group">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white text-sm">
                {item[labelKey]}
              </span>
              <span className="text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition">
                Search →
              </span>
            </div>
            {descKey && item[descKey] && (
              <p className="text-xs text-slate-400 mt-1.5">{item[descKey]}</p>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
