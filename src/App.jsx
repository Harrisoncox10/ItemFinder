import { useState } from 'react'
import { AlertCircle, PackageSearch, MapPin, ShoppingCart, ExternalLink } from 'lucide-react'
import SearchBar from './components/SearchBar'
import ShopCard from './components/ShopCard'
import LoadingState from './components/LoadingState'
import { getCurrentLocation } from './services/locationService'
import { findNearbyShops } from './services/shopService'
import { ONLINE_RETAILERS } from './utils/retailerLinks'

const RADIUS_OPTIONS = [1000, 2000, 5000, 10000, 20000]
const radiusLabel = (m) => (m >= 1000 ? `${m / 1000} km` : `${m} m`)

const EXAMPLE_ITEMS = ['Referee top', 'Whistle', 'Football boots', 'Shin pads', 'Phone charger']

export default function App() {
  const [query, setQuery] = useState('')
  const [radius, setRadius] = useState(5000)
  const [shops, setShops] = useState([])
  const [searched, setSearched] = useState(false)
  const [searchedItem, setSearchedItem] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadStep, setLoadStep] = useState(0)
  const [error, setError] = useState(null)
  const [locationName, setLocationName] = useState(null)

  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
        { headers: { 'Accept-Language': 'en' } },
      )
      const data = await res.json()
      return data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || null
    } catch {
      return null
    }
  }

  const handleSearch = async (overrideItem) => {
    const item = (typeof overrideItem === 'string' ? overrideItem : query).trim()
    if (!item) return
    if (typeof overrideItem === 'string') setQuery(overrideItem)

    setLoading(true)
    setError(null)
    setShops([])
    setSearched(false)
    setLoadStep(0)

    try {
      setLoadStep(0)
      const { lat, lon } = await getCurrentLocation()

      setLoadStep(1)
      const [place, results] = await Promise.all([
        reverseGeocode(lat, lon),
        findNearbyShops(lat, lon, item, radius),
      ])

      setLoadStep(2)
      setLocationName(place)
      setShops(results)
      setSearchedItem(item)
      setSearched(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15),_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-12 flex flex-col items-center text-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/50">
              <PackageSearch className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Item<span className="text-blue-400">Finder</span>
            </h1>
          </div>

          <p className="text-slate-300 text-lg max-w-lg">
            Search for any item and we'll find the nearby shops where you can buy it — with direct links to check stock.
          </p>

          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={handleSearch}
            loading={loading}
          />

          {/* Example suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-slate-500">Try:</span>
            {EXAMPLE_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => handleSearch(item)}
                disabled={loading}
                className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/15 hover:text-white transition disabled:opacity-40"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Radius picker */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <MapPin className="w-4 h-4" />
            <span>Search within</span>
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRadius(r)}
                disabled={loading}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  radius === r
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                } disabled:opacity-40`}
              >
                {radiusLabel(r)}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        {/* Loading */}
        {loading && <LoadingState step={loadStep} />}

        {/* Error */}
        {!loading && error && (
          <div className="flex items-start gap-3 p-5 rounded-2xl bg-red-950/50 border border-red-800/60 text-red-300">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold">Something went wrong</p>
              <p className="text-sm mt-1 text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white">
                {shops.length > 0
                  ? `Found ${shops.length} shop${shops.length !== 1 ? 's' : ''} near ${locationName || 'you'}`
                  : 'No shops found nearby'}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {shops.length > 0
                  ? `Showing stores where you might find "${searchedItem}" within ${radiusLabel(radius)}.`
                  : `Try increasing the search radius or a different item name.`}
              </p>
            </div>

            {shops.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shops.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} item={searchedItem} />
                ))}
              </div>
            )}

            {shops.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-12 text-slate-500">
                <PackageSearch className="w-16 h-16 opacity-30" />
                <p className="text-lg">No shops found in this area for that item type.</p>
                <p className="text-sm">Try expanding the radius or searching more broadly (e.g. "sports equipment").</p>
              </div>
            )}

            {/* Online fallback */}
            <div className="mt-10 glass rounded-2xl p-5">
              <h3 className="flex items-center gap-2 font-bold text-white mb-1">
                <ShoppingCart className="w-4 h-4 text-blue-400" />
                Can't find it locally?
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                Search for "{searchedItem}" at these online retailers:
              </p>
              <div className="flex flex-wrap gap-2">
                {ONLINE_RETAILERS.map(({ name, url }) => (
                  <a
                    key={name}
                    href={url(searchedItem)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-sm font-medium transition"
                  >
                    {name}
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </a>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && !searched && !error && (
          <div className="flex flex-col items-center gap-4 py-20 text-slate-600">
            <PackageSearch className="w-20 h-20 opacity-20" />
            <p className="text-lg font-medium">Type an item above to get started</p>
            <p className="text-sm text-center max-w-sm">
              We use your location to find relevant shops nearby, then give you direct links to search their stock.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-white/5 text-center py-4 text-xs text-slate-600">
        Shop data via <a href="https://www.openstreetmap.org/" className="underline hover:text-slate-400" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>
        {' · '}
        Your location is never stored.
      </footer>
    </div>
  )
}
