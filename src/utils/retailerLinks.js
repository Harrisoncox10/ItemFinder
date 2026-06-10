const RETAILERS = [
  { pattern: /sports\s*direct/i,        url: 'https://www.sportsdirect.com/search?term=' },
  { pattern: /\bjd\s*sports?\b/i,       url: 'https://www.jdsports.co.uk/search/' },
  { pattern: /decathlon/i,              url: 'https://www.decathlon.co.uk/search?Ntt=' },
  { pattern: /\bnike\b/i,               url: 'https://www.nike.com/gb/search?q=' },
  { pattern: /\badidas\b/i,             url: 'https://www.adidas.co.uk/search?q=' },
  { pattern: /under\s*armour/i,         url: 'https://www.underarmour.co.uk/en-gb/search?q=' },
  { pattern: /\bpuma\b/i,               url: 'https://uk.puma.com/uk/en/search?q=' },
  { pattern: /\bamazon\b/i,             url: 'https://www.amazon.co.uk/s?k=' },
  { pattern: /\bebay\b/i,               url: 'https://www.ebay.co.uk/sch/i.html?_nkw=' },
  { pattern: /\bargos\b/i,              url: 'https://www.argos.co.uk/search/' },
  { pattern: /john\s*lewis/i,           url: 'https://www.johnlewis.com/search?search-term=' },
  { pattern: /\bcurrys\b/i,             url: 'https://www.currys.co.uk/search?q=' },
  { pattern: /\btesco\b/i,              url: 'https://www.tesco.com/groceries/en-GB/search?query=' },
  { pattern: /\basda\b/i,               url: 'https://groceries.asda.com/search/' },
  { pattern: /sainsbury/i,              url: 'https://www.sainsburys.co.uk/gol-ui/SearchDisplayView?filters[keyword]=' },
  { pattern: /\bmorrisons\b/i,          url: 'https://groceries.morrisons.com/search?entry=' },
  { pattern: /\bboots\b/i,              url: 'https://www.boots.com/search?q=' },
  { pattern: /\bsuperdrug\b/i,          url: 'https://www.superdrug.com/search?q=' },
  { pattern: /\bhalfords\b/i,           url: 'https://www.halfords.com/search?term=' },
  { pattern: /\bscrewfix\b/i,           url: 'https://www.screwfix.com/search?search=' },
  { pattern: /\btoolstation\b/i,        url: 'https://www.toolstation.com/search?q=' },
  { pattern: /\bb\s*&\s*q\b|\bb\s+and\s+q\b/i, url: 'https://www.diy.com/search?term=' },
  { pattern: /\bhomebase\b/i,           url: 'https://www.homebase.co.uk/search?q=' },
  { pattern: /\bwickes\b/i,             url: 'https://www.wickes.co.uk/search?text=' },
  { pattern: /\bnext\b/i,               url: 'https://www.next.co.uk/search?w=' },
  { pattern: /\bprimark\b/i,            url: 'https://www.primark.com/en-gb/search?q=' },
  { pattern: /\bh\s*&\s*m\b|\bh\s+and\s+m\b/i, url: 'https://www2.hm.com/en_gb/search-results.html?q=' },
  { pattern: /river\s*island/i,         url: 'https://www.riverisland.com/search?q=' },
  { pattern: /\bmatalan\b/i,            url: 'https://www.matalan.co.uk/search/results?query=' },
  { pattern: /\bdunelm\b/i,             url: 'https://www.dunelm.com/search?searchTerm=' },
  { pattern: /\bthe\s+range\b/i,        url: 'https://www.therange.co.uk/search/#q=' },
  { pattern: /\bhobbycraft\b/i,         url: 'https://www.hobbycraft.co.uk/search?q=' },
  { pattern: /pets?\s*at\s*home/i,      url: 'https://www.petsathome.com/search?q=' },
  { pattern: /\bwaterstones\b/i,        url: 'https://www.waterstones.com/index/search?term=' },
  { pattern: /\bwilko\b/i,              url: 'https://www.wilko.com/en-gb/search?q=' },
  { pattern: /card\s*factory/i,         url: 'https://www.cardfactory.co.uk/search?q=' },
  { pattern: /\bsmyths\b/i,             url: 'https://www.smythstoys.com/uk/en-gb/search/?text=' },
  { pattern: /\bgo\s*outdoors\b/i,      url: 'https://www.gooutdoors.co.uk/search?q=' },
  { pattern: /mountain\s*warehouse/i,   url: 'https://www.mountainwarehouse.com/search/?q=' },
  { pattern: /\btk\s*maxx\b/i,          url: 'https://www.tkmaxx.com/uk/en/search?q=' },
]

export const getRetailerSearchUrl = (shopName, item) => {
  const encoded = encodeURIComponent(item)
  for (const { pattern, url } of RETAILERS) {
    if (pattern.test(shopName)) return { url: url + encoded, isKnown: true }
  }
  return {
    url: `https://www.google.com/search?q=${encodeURIComponent(shopName + ' ' + item + ' in stock near me')}`,
    isKnown: false,
  }
}

export const getDirectionsUrl = (lat, lon) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`

// Online fallbacks shown when few/no local shops are found
export const ONLINE_RETAILERS = [
  { name: 'Amazon',          url: (q) => `https://www.amazon.co.uk/s?k=${encodeURIComponent(q)}` },
  { name: 'eBay',            url: (q) => `https://www.ebay.co.uk/sch/i.html?_nkw=${encodeURIComponent(q)}` },
  { name: 'Google Shopping', url: (q) => `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(q)}` },
  { name: 'Sports Direct',   url: (q) => `https://www.sportsdirect.com/search?term=${encodeURIComponent(q)}` },
  { name: 'Decathlon',       url: (q) => `https://www.decathlon.co.uk/search?Ntt=${encodeURIComponent(q)}` },
]
