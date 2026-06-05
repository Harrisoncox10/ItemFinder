import { ExternalLink, MapPin, Phone, Clock, ShoppingBag, Globe } from 'lucide-react'
import { getRetailerSearchUrl, getMapsUrl } from '../utils/retailerLinks'

const formatDist = (km) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`

const SHOP_EMOJI = {
  sports: '🏅',
  outdoor: '🏕️',
  electronics: '💻',
  computer: '💻',
  mobile_phone: '📱',
  clothes: '👕',
  shoes: '👟',
  supermarket: '🛒',
  convenience: '🏪',
  grocery: '🥦',
  books: '📚',
  chemist: '💊',
  pharmacy: '💊',
  hardware: '🔧',
  doityourself: '🔨',
  toys: '🧸',
  games: '🎮',
  department_store: '🏬',
}

export default function ShopCard({ shop, item }) {
  const { url: searchUrl, isKnown } = getRetailerSearchUrl(shop.name, item)
  const mapsUrl = getMapsUrl(shop.lat, shop.lon, shop.name)
  const icon = SHOP_EMOJI[shop.shopType] || '🏪'

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-4 hover:border-white/20 transition-all hover:bg-white/8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl flex-shrink-0">{icon}</span>
          <div className="min-w-0">
            <h3 className="font-bold text-lg text-white truncate">{shop.name}</h3>
            {shop.address && (
              <p className="text-slate-400 text-sm truncate">{shop.address}</p>
            )}
          </div>
        </div>
        <span className="flex-shrink-0 flex items-center gap-1 text-sm font-semibold bg-blue-900/60 text-blue-300 px-3 py-1 rounded-full">
          <MapPin className="w-3.5 h-3.5" />
          {formatDist(shop.distanceKm)}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-400">
        {shop.phone && (
          <a href={`tel:${shop.phone}`} className="flex items-center gap-1 hover:text-blue-400 transition">
            <Phone className="w-3.5 h-3.5" />
            {shop.phone}
          </a>
        )}
        {shop.openingHours && (
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {shop.openingHours.length > 40 ? shop.openingHours.slice(0, 40) + '…' : shop.openingHours}
          </span>
        )}
        {shop.website && (
          <a href={shop.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-400 transition">
            <Globe className="w-3.5 h-3.5" />
            {new URL(shop.website.startsWith('http') ? shop.website : 'https://' + shop.website).hostname.replace('www.', '')}
          </a>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 pt-1">
        <a
          href={searchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          {isKnown ? `Search ${shop.name.split(' ')[0]}` : 'Search Google'}
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-semibold text-sm transition-all active:scale-95"
        >
          <MapPin className="w-4 h-4" />
          Get Directions
          <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>

      {/* Confidence badge */}
      {isKnown && (
        <span className="text-xs text-emerald-400 font-medium">
          ✓ Direct store search available
        </span>
      )}
    </div>
  )
}
