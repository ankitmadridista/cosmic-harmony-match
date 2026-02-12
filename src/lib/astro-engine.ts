function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function normalize(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

export function dateToJulianDay(
  year: number, month: number, day: number,
  hour: number = 0, minute: number = 0, second: number = 0,
  tzOffset: number = 0
): number {
  const utHour = hour - tzOffset + minute / 60 + second / 3600;
  let y = year;
  let m = month;
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + utHour / 24 + B - 1524.5;
}

export function getMoonLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const Lp = normalize(218.3164477 + 481267.88123421 * T - 0.0015786 * T * T);
  const D = normalize(297.8501921 + 445267.1114034 * T - 0.0018819 * T * T);
  const M = normalize(357.5291092 + 35999.0502909 * T - 0.0001536 * T * T);
  const Mp = normalize(134.9633964 + 477198.8675055 * T + 0.0087414 * T * T);
  const F = normalize(93.2720950 + 483202.0175233 * T - 0.0036539 * T * T);

  const Drad = toRadians(D), Mrad = toRadians(M), Mprad = toRadians(Mp), Frad = toRadians(F);

  let sumL = 0;
  sumL += 6288774 * Math.sin(Mprad);
  sumL += 1274027 * Math.sin(2 * Drad - Mprad);
  sumL += 658314 * Math.sin(2 * Drad);
  sumL += 213618 * Math.sin(2 * Mprad);
  sumL += -185116 * Math.sin(Mrad);
  sumL += -114332 * Math.sin(2 * Frad);
  sumL += 58793 * Math.sin(2 * Drad - 2 * Mprad);
  sumL += 57066 * Math.sin(2 * Drad - Mrad - Mprad);
  sumL += 53322 * Math.sin(2 * Drad + Mprad);
  sumL += 45758 * Math.sin(2 * Drad - Mrad);
  sumL += -40923 * Math.sin(Mrad - Mprad);
  sumL += -34720 * Math.sin(Drad);
  sumL += -30383 * Math.sin(Mrad + Mprad);
  sumL += 15327 * Math.sin(2 * Drad - 2 * Frad);
  sumL += -12528 * Math.sin(Mprad + 2 * Frad);
  sumL += 10980 * Math.sin(Mprad - 2 * Frad);

  return normalize(Lp + sumL / 1000000);
}

export function getMarsLongitude(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  const L0 = normalize(355.433275 + 19140.2993313 * T);
  const M = normalize(19.3730 + 19139.85475 * T);
  const Mrad = toRadians(M);
  const C = 10.6912 * Math.sin(Mrad) + 0.6228 * Math.sin(2 * Mrad) + 0.0503 * Math.sin(3 * Mrad);
  return normalize(L0 + C);
}

export function getAyanamsa(jd: number): number {
  return 23.856 + 0.01397 * ((jd - 2451545.0) / 365.25);
}

export function getSiderealLongitude(tropicalLng: number, jd: number): number {
  return normalize(tropicalLng - getAyanamsa(jd));
}

export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati',
];

export const RASHIS = [
  { name: 'Aries (Mesha)', lord: 'Mars' },
  { name: 'Taurus (Vrishabha)', lord: 'Venus' },
  { name: 'Gemini (Mithuna)', lord: 'Mercury' },
  { name: 'Cancer (Karka)', lord: 'Moon' },
  { name: 'Leo (Simha)', lord: 'Sun' },
  { name: 'Virgo (Kanya)', lord: 'Mercury' },
  { name: 'Libra (Tula)', lord: 'Venus' },
  { name: 'Scorpio (Vrishchika)', lord: 'Mars' },
  { name: 'Sagittarius (Dhanu)', lord: 'Jupiter' },
  { name: 'Capricorn (Makara)', lord: 'Saturn' },
  { name: 'Aquarius (Kumbha)', lord: 'Saturn' },
  { name: 'Pisces (Meena)', lord: 'Jupiter' },
];

export function getNakshatraIndex(siderealLng: number): number {
  return Math.floor(siderealLng / (360 / 27));
}

export function getNakshatraPada(siderealLng: number): number {
  const span = 360 / 27;
  return Math.floor((siderealLng % span) / (span / 4)) + 1;
}

export function getRashiIndex(siderealLng: number): number {
  return Math.floor(siderealLng / 30);
}

export function getTimezoneOffset(countryCode: string, longitude: number): number {
  const map: Record<string, number> = {
    in: 5.5, np: 5.75, lk: 5.5, pk: 5, bd: 6, mm: 6.5,
    th: 7, vn: 7, cn: 8, jp: 9, kr: 9, au: 10, nz: 12,
    gb: 0, ie: 0, pt: 0, fr: 1, de: 1, it: 1, es: 1,
  };
  const cc = countryCode.toLowerCase();
  if (cc in map) return map[cc];
  return Math.round(longitude / 15);
}
