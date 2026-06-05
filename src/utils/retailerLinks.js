const RETAILERS = [
  { pattern: /sports\s*direct/i,      url: 'https://www.sportsdirect.com/search?term=' },
  { pattern: /jd\s*sports/i,          url: 'https://www.jdsports.co.uk/search/' },
  { pattern: /decathlon/i,            url: 'https://www.decathlon.co.uk/search?Ntt=' },
  { pattern: /nike/i,                 url: 'https://www.nike.com/gb/search?q=' },
  { pattern: /adidas/i,              url: 'https://www.adidas.co.uk/search?q=' },
  { pattern: /under\s*armour/i,      url: 'https://www.underarmour.co.uk/en-gb/search?q=' },
  { pattern: /puma/i,                url: 'https://uk.puma.com/uk/en/search?q=' },
  { pattern: /amazon/i,              url: 'https://www.amazon.co.uk/s?k=' },
  { pattern: /ebay/i,                url: 'https://www.ebay.co.uk/sch/i.html?_nkw=' },
  { pattern: /argos/i,               url: 'https://www.argos.co.uk/search/' },
  { pattern: /john\s*lewis/i,        url: 'https://www.johnlewis.com/search?search-term=' },
  { pattern: /currys/i,              url: 'https://www.currys.co.uk/search?q=' },
  { pattern: /tesco/i,               url: 'https://www.tesco.com/groceries/en-GB/search?query=' },
  { pattern: /asda/i,                url: 'https://groceries.asda.com/search/' },
  { pattern: /sainsbury/i,           url: 'https://www.sainsburys.co.uk/gol-ui/SearchDisplayView?filters[keyword]=' },
  { pattern: /morrisons/i,           url: 'https://groceries.morrisons.com/search?entry=' },
  { pattern: /boots/i,               url: 'https://www.boots.com/search?q=' },
  { pattern: /superdrug/i,           url: 'https://www.superdrug.com/search?q=' },
  { pattern: /halfords/i,            url: 'https://www.halfords.com/search?term=' },
  { pattern: /screwfix/i,            url: 'https://www.screwfix.com/search?search=' },
  { pattern: /b\s*&\s*q|b and q/i,  url: 'https://www.diy.com/search?term=' },
  { pattern: /homebase/i,            url: 'https://www.homebase.co.uk/search?q=' },
  { pattern: /wickes/i,              url: 'https://www.wickes.co.uk/search?text=' },
  { pattern: /next/i,                url: 'https://www.next.co.uk/search?w=' },
  { pattern: /primark/i,             url: 'https://www.primark.com/en-gb/search?q=' },
  { pattern: /h\s*&\s*m|h and m/i,  url: 'https://www2.hm.com/en_gb/search-results.html?q=' },
  { pattern: /river\s*island/i,      url: 'https://www.riverisland.com/search?q=' },
  { pattern: /matalan/i,             url: 'https://www.matalan.co.uk/search/results?query=' },
  { pattern: /dunelm/i,              url: 'https://www.dunelm.com/search?searchTerm=' },
  { pattern: /the\s*range/i,         url: 'https://www.therange.co.uk/search/#q=' },
  { pattern: /hobbycraft/i,          url: 'https://www.hobbycraft.co.uk/search?q=' },
  { pattern: /pets?\s*at\s*home/i,   url: 'https://www.petsathome.com/search?q=' },
  { pattern: /waterstones/i,         url: 'https://www.waterstones.com/index/search?term=' },
  { pattern: /wilko/i,               url: 'https://www.wilko.com/en-gb/search?q=' },
  { pattern: /card\s*factory/i,      url: 'https://www.cardfactory.co.uk/search?q=' },
  { pattern: /world\s*of\s*sport/i,  url: 'https://www.worldofsport.com/search?q=' },
  { pattern: /rebel\s*sport/i,       url: 'https://www.rebelsport.com.au/search?q=' },
]

export const getRetailerSearchUrl = (shopName, item) => {
  const encoded = encodeURIComponent(item)
  for (const { pattern, url } of RETAILERS) {
    if (pattern.test(shopName)) return { url: url + encoded, isKnown: true }
  }
  return {
    url: `https://www.google.com/search?q=${encodeURIComponent(shopName + ' ' + item + ' in stock')}`,
    isKnown: false,
  }
}

export const getMapsUrl = (lat, lon, name) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=&center=${lat},${lon}`
