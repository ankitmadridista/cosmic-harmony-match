export type Gender = "male" | "female" | "other";

export interface BirthDetails {
  name: string;
  gender: Gender;
  day: number;
  month: number;
  year: number;
  hour: number;
  minute: number;
  second: number;
  place: string;
  latitude: number;
  longitude: number;
  timezone: number;
}

export interface NakshatraInfo {
  index: number;
  name: string;
  pada: number;
}

export interface RashiInfo {
  index: number;
  name: string;
  lord: string;
}

export interface KootaResult {
  name: string;
  obtained: number;
  maximum: number;
  description: string;
  status: 'good' | 'average' | 'needs_attention';
}

export interface DoshaResult {
  name: string;
  present: boolean;
  description: string;
  remedy?: string;
}

export interface MatchResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  kootas: KootaResult[];
  doshas: DoshaResult[];
  boyNakshatra: NakshatraInfo;
  girlNakshatra: NakshatraInfo;
  boyRashi: RashiInfo;
  girlRashi: RashiInfo;
  recommendation: string;
  compatibilityLevel: 'excellent' | 'very_good' | 'average' | 'not_recommended';
}

export interface CityResult {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
}
