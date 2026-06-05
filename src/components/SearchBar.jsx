import { Search, MapPin } from 'lucide-react'

export default function SearchBar({ value, onChange, onSearch, loading }) {
  const handleKey = (e) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-2xl">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKey}
          placeholder="e.g. Referee top, whistle, football boots…"
          disabled={loading}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 transition"
        />
      </div>
      <button
        onClick={onSearch}
        disabled={loading || !value.trim()}
        className="flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        <MapPin className="w-5 h-5" />
        {loading ? 'Searching…' : 'Find Near Me'}
      </button>
    </div>
  )
}
