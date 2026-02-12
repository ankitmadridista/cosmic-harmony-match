import type { CityResult } from '@/types/astrology';

let lastReq = 0;

export async function searchCities(query: string): Promise<CityResult[]> {
  if (query.length < 3) return [];

  const now = Date.now();
  if (now - lastReq < 1000) await new Promise(r => setTimeout(r, 1000 - (now - lastReq)));
  lastReq = Date.now();

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
      { headers: { 'Accept-Language': 'en', 'User-Agent': 'KundliMatchingApp/1.0' } }
    );
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    return data.map((item: any) => ({
      name: item.address?.city || item.address?.town || item.address?.village || item.name,
      displayName: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      country: item.address?.country || '',
      countryCode: item.address?.country_code || '',
    }));
  } catch (e) {
    console.error('City search error:', e);
    return [];
  }
}
