export function sortHotels(hotels, by, dir = 'asc') {
  return hotels.slice().sort((a, b) => {
    let va = a[by];
    let vb = b[by];

    if (['price', 'rating', 'stars', 'roomSize', 'capacity'].includes(by)) {
      return dir === 'asc' ? va - vb : vb - va;
    }
    
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    
    if (va < vb) return dir === 'asc' ? -1 : 1;
    if (va > vb) return dir === 'asc' ? 1 : -1;
    return 0;
  });
}

export function filterByType(hotels, type) {
  if (!type) return hotels.slice();
  return hotels.filter(h => h.type === type);
}

export function filterByStars(hotels, stars) {
  if (!stars) return hotels.slice();
  return hotels.filter(h => h.stars == stars);
}

export function searchHotels(hotels, text) {
  const t = (text || '').toLowerCase();
  return hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(t) ||
    hotel.city.toLowerCase().includes(t) ||
    hotel.country.toLowerCase().includes(t) ||
    (hotel.amenities && hotel.amenities.join(' ').toLowerCase().includes(t))
  );
}