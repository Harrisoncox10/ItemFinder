// Public Overpass servers, tried in order — the primary is often overloaded
const OVERPASS_URLS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]

// Map search keywords → OSM shop tags to keep results relevant
const getShopTags = (item) => {
  const q = item.toLowerCase()

  if (/referee|whistle|football|rugby|cricket|hockey|badminton|tennis|golf|netball|sports|kit|shin|goalkeeper|jersey|strip|boot|cleat|racket|bat|ball|gym|fitness|swim|cycling|cycle/.test(q)) {
    return ['"shop"="sports"', '"shop"="outdoor"', '"leisure"="sports_centre"']
  }
  if (/phone|laptop|computer|tablet|headphone|earphone|speaker|camera|tv|television|console|playstation|xbox|nintendo|gaming|monitor|keyboard|mouse|charger|cable/.test(q)) {
    return ['"shop"="electronics"', '"shop"="computer"', '"shop"="mobile_phone"']
  }
  if (/shirt|top|trousers|jeans|dress|suit|jacket|coat|sock|shoe|sneaker|trainer|hat|cap|glove|scarf|tie|uniform/.test(q)) {
    return ['"shop"="clothes"', '"shop"="shoes"', '"shop"="fashion"', '"shop"="sports"']
  }
  if (/food|bread|milk|fruit|vegetable|drink|snack|chocolate|coffee|tea|beer|wine/.test(q)) {
    return ['"shop"="supermarket"', '"shop"="convenience"', '"shop"="grocery"']
  }
  if (/book|novel|magazine|comic|puzzle/.test(q)) {
    return ['"shop"="books"', '"shop"="newsagent"']
  }
  if (/medicine|painkiller|vitamin|supplement|cream|plaster|bandage/.test(q)) {
    return ['"shop"="chemist"', '"shop"="pharmacy"']
  }
  if (/tool|drill|screw|nail|paint|brush|plumbing|electric|hardware/.test(q)) {
    return ['"shop"="hardware"', '"shop"="doityourself"', '"shop"="trade"']
  }
  if (/toy|lego|doll|board game|game/.test(q)) {
    return ['"shop"="toys"', '"shop"="games"', '"shop"="department_store"']
  }

  // Default: broad selection
  return [
    '"shop"="sports"',
    '"shop"="department_store"',
    '"shop"="general"',
    '"shop"="variety_store"',
  ]
}

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const formatAddress = (tags) => {
  const parts = [
    tags['addr:housenumber'],
    tags['addr:street'],
    tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
    tags['addr:postcode'],
  ].filter(Boolean)
  return parts.length ? parts.join(', ') : null
}

export const findNearbyShops = async (lat, lon, item, radiusM = 5000) => {
  const shopTags = getShopTags(item)

  // Build union of node/way queries for each tag
  const filters = shopTags
    .flatMap((tag) => [
      `node[${tag}](around:${radiusM},${lat},${lon});`,
      `way[${tag}](around:${radiusM},${lat},${lon});`,
    ])
    .join('\n      ')

  const query = `
    [out:json][timeout:30];
    (
      ${filters}
    );
    out center tags;
  `

  let data = null
  let lastError = null
  for (const url of OVERPASS_URLS) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
      })
      if (!res.ok) throw new Error(`Shop lookup failed (HTTP ${res.status})`)
      data = await res.json()
      break
    } catch (err) {
      lastError = err
    }
  }
  if (!data) {
    throw new Error(
      lastError?.message
        ? `Could not reach the shop database (${lastError.message}). Please try again in a moment.`
        : 'Could not reach the shop database. Please try again in a moment.',
    )
  }

  const seen = new Set()
  return data.elements
    .filter((el) => el.tags?.name)
    .map((el) => {
      const elLat = el.lat ?? el.center?.lat
      const elLon = el.lon ?? el.center?.lon
      return {
        id: el.id,
        name: el.tags.name,
        address: formatAddress(el.tags),
        website: el.tags.website || el.tags['contact:website'] || null,
        phone: el.tags.phone || el.tags['contact:phone'] || null,
        openingHours: el.tags.opening_hours || null,
        shopType: el.tags.shop || el.tags.leisure || 'shop',
        lat: elLat,
        lon: elLon,
        distanceKm: haversineKm(lat, lon, elLat, elLon),
      }
    })
    .filter((s) => {
      if (seen.has(s.name)) return false
      seen.add(s.name)
      return true
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 25)
}
