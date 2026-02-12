import type { KootaResult, DoshaResult, MatchResult, NakshatraInfo, RashiInfo, BirthDetails } from '@/types/astrology';
import {
  NAKSHATRAS, RASHIS, getNakshatraIndex, getNakshatraPada, getRashiIndex,
  dateToJulianDay, getMoonLongitude, getMarsLongitude, getSiderealLongitude,
} from './astro-engine';

// --- Data tables ---

// Gana: 0=Dev, 1=Manushya, 2=Rakshasa
const GANA = [0,1,2,1,0,1,0,0,2,2,1,1,0,2,0,2,0,2,2,1,1,0,2,2,1,1,0];
const GANA_NAMES = ['Dev', 'Manushya', 'Rakshasa'];

// Nadi: zigzag pattern 0=Aadi(Vata), 1=Madhya(Pitta), 2=Antya(Kapha)
const NADI_PATTERN = [0,1,2,2,1,0];
const NADI_NAMES = ['Aadi (Vata)', 'Madhya (Pitta)', 'Antya (Kapha)'];
function getNadi(idx: number) { return NADI_PATTERN[idx % 6]; }

// Yoni animals per nakshatra
const YONI_ANIMAL = [0,1,2,3,3,4,5,2,5,6,6,7,8,9,8,9,10,10,4,11,12,11,13,0,13,7,1];
const YONI_ANIMAL_NAMES = ['Horse','Elephant','Goat','Serpent','Dog','Cat','Rat','Cow','Buffalo','Tiger','Deer','Monkey','Mongoose','Lion'];
const YONI_ENEMIES: [number,number][] = [[0,8],[1,13],[2,11],[3,12],[4,10],[5,6],[7,9]];

// Varna per rashi: 0=Shudra, 1=Vaishya, 2=Kshatriya, 3=Brahmin
const RASHI_VARNA = [2,1,0,3,2,1,0,3,2,1,0,3];
const VARNA_NAMES = ['Shudra','Vaishya','Kshatriya','Brahmin'];

// Vasya map: rashi -> vasya rashis
const VASYA_MAP: Record<number, number[]> = {
  0:[4,7], 1:[3,6], 2:[5], 3:[7,8], 4:[6], 5:[11,2],
  6:[5,9], 7:[3], 8:[11], 9:[10], 10:[11], 11:[9],
};

// Planet friendship: Sun=0 Moon=1 Mars=2 Mercury=3 Jupiter=4 Venus=5 Saturn=6
const PLANET_IDX: Record<string, number> = { Sun:0, Moon:1, Mars:2, Mercury:3, Jupiter:4, Venus:5, Saturn:6 };
// 1=friend 0=neutral -1=enemy
const FRIENDSHIP = [
  [ 0, 1, 1, 0, 1,-1,-1],
  [ 1, 0, 0, 1, 0, 0, 0],
  [ 1, 1, 0,-1, 1, 0, 0],
  [ 1,-1, 0, 0, 0, 1, 0],
  [ 1, 1, 1,-1, 0,-1, 0],
  [-1,-1, 0, 1, 0, 0, 1],
  [-1,-1,-1, 0, 0, 1, 0],
];

// --- Koota calculations ---

function calcVarna(bR: number, gR: number): KootaResult {
  const bv = RASHI_VARNA[bR], gv = RASHI_VARNA[gR];
  const score = bv >= gv ? 1 : 0;
  return { name: 'Varna', obtained: score, maximum: 1,
    description: `Boy: ${VARNA_NAMES[bv]}, Girl: ${VARNA_NAMES[gv]}. Represents spiritual compatibility and ego levels.`,
    status: score === 1 ? 'good' : 'needs_attention' };
}

function calcVasya(bR: number, gR: number): KootaResult {
  if (bR === gR) return { name:'Vasya', obtained:2, maximum:2, description:'Same Rashi — natural mutual attraction.', status:'good' };
  const b2g = VASYA_MAP[bR]?.includes(gR), g2b = VASYA_MAP[gR]?.includes(bR);
  const score = (b2g && g2b) ? 2 : (b2g || g2b) ? 1 : 0;
  return { name:'Vasya', obtained: score, maximum:2,
    description:'Indicates mutual attraction and influence in the relationship.',
    status: score >= 2 ? 'good' : score >= 1 ? 'average' : 'needs_attention' };
}

function calcTara(bN: number, gN: number): KootaResult {
  const auspicious = [0,1,3,5,7];
  const b2g = ((gN - bN + 27) % 27) % 9;
  const g2b = ((bN - gN + 27) % 27) % 9;
  const ba = auspicious.includes(b2g), ga = auspicious.includes(g2b);
  const score = (ba && ga) ? 3 : (ba || ga) ? 1.5 : 0;
  return { name:'Tara', obtained: score, maximum:3,
    description:'Measures destiny compatibility and health aspects of the couple.',
    status: score >= 3 ? 'good' : score >= 1.5 ? 'average' : 'needs_attention' };
}

function calcYoni(bN: number, gN: number): KootaResult {
  const ba = YONI_ANIMAL[bN], ga = YONI_ANIMAL[gN];
  let score = 2;
  if (ba === ga) score = 4;
  else if (YONI_ENEMIES.some(([a,b]) => (a===ba&&b===ga)||(b===ba&&a===ga))) score = 0;
  return { name:'Yoni', obtained: score, maximum:4,
    description: `Boy: ${YONI_ANIMAL_NAMES[ba]}, Girl: ${YONI_ANIMAL_NAMES[ga]}. Represents physical and sexual compatibility.`,
    status: score >= 3 ? 'good' : score >= 2 ? 'average' : 'needs_attention' };
}

function calcGrahaMaitri(bR: number, gR: number): KootaResult {
  const bl = RASHIS[bR].lord, gl = RASHIS[gR].lord;
  if (bl === gl) return { name:'Graha Maitri', obtained:5, maximum:5,
    description:`Both ruled by ${bl}. Natural mental compatibility.`, status:'good' };
  const bi = PLANET_IDX[bl], gi = PLANET_IDX[gl];
  const b2g = FRIENDSHIP[bi][gi], g2b = FRIENDSHIP[gi][bi];
  let score = 0;
  if (b2g===1&&g2b===1) score=5;
  else if ((b2g===1&&g2b===0)||(b2g===0&&g2b===1)) score=4;
  else if (b2g===0&&g2b===0) score=3;
  else if ((b2g===1&&g2b===-1)||(b2g===-1&&g2b===1)) score=1;
  else if ((b2g===0&&g2b===-1)||(b2g===-1&&g2b===0)) score=0.5;
  return { name:'Graha Maitri', obtained: score, maximum:5,
    description:`Boy's lord: ${bl}, Girl's lord: ${gl}. Mental compatibility and friendship.`,
    status: score>=4?'good':score>=2?'average':'needs_attention' };
}

function calcGana(bN: number, gN: number): KootaResult {
  const bg = GANA[bN], gg = GANA[gN];
  const matrix = [[6,5,1],[5,6,0],[1,0,6]];
  const score = matrix[bg][gg];
  return { name:'Gana', obtained: score, maximum:6,
    description:`Boy: ${GANA_NAMES[bg]}, Girl: ${GANA_NAMES[gg]}. Temperament and behavior compatibility.`,
    status: score>=5?'good':score>=3?'average':'needs_attention' };
}

function calcBhakoot(bR: number, gR: number): KootaResult {
  const diff = ((gR - bR) + 12) % 12;
  const score = [1,5,7,11].includes(diff) ? 0 : 7;
  return { name:'Bhakoot', obtained: score, maximum:7,
    description:'Affects health, wealth, and happiness. Based on relative Rashi positions.',
    status: score===7?'good':'needs_attention' };
}

function calcNadi(bN: number, gN: number): KootaResult {
  const bn = getNadi(bN), gn = getNadi(gN);
  const score = bn !== gn ? 8 : 0;
  return { name:'Nadi', obtained: score, maximum:8,
    description:`Boy: ${NADI_NAMES[bn]}, Girl: ${NADI_NAMES[gn]}. Most important koota — physiological and hereditary compatibility.`,
    status: score===8?'good':'needs_attention' };
}

function getLevel(s: number): MatchResult['compatibilityLevel'] {
  if (s >= 32) return 'excellent';
  if (s >= 24) return 'very_good';
  if (s >= 18) return 'average';
  return 'not_recommended';
}

function getRecommendation(score: number, level: string): string {
  const msgs: Record<string, string> = {
    excellent: `With a score of ${score}/36, this is an excellent match! The couple shares outstanding compatibility. This union is highly favorable according to Vedic astrology.`,
    very_good: `With a score of ${score}/36, this is a very good match. Strong compatibility in most areas. This union is considered favorable and auspicious.`,
    average: `With a score of ${score}/36, this is an acceptable match. Some aspects may require understanding and effort. Consulting a learned astrologer is recommended.`,
    not_recommended: `With a score of ${score}/36, this match may face challenges. It is advisable to consult an experienced Vedic astrologer for remedies before proceeding.`,
  };
  return msgs[level] || msgs.not_recommended;
}

export function calculateMatch(boy: BirthDetails, girl: BirthDetails): MatchResult {
  const bJD = dateToJulianDay(boy.year, boy.month, boy.day, boy.hour, boy.minute, boy.second, boy.timezone);
  const gJD = dateToJulianDay(girl.year, girl.month, girl.day, girl.hour, girl.minute, girl.second, girl.timezone);

  const bMoonSid = getSiderealLongitude(getMoonLongitude(bJD), bJD);
  const gMoonSid = getSiderealLongitude(getMoonLongitude(gJD), gJD);

  const bNIdx = getNakshatraIndex(bMoonSid), gNIdx = getNakshatraIndex(gMoonSid);
  const bRIdx = getRashiIndex(bMoonSid), gRIdx = getRashiIndex(gMoonSid);

  const boyNakshatra: NakshatraInfo = { index: bNIdx, name: NAKSHATRAS[bNIdx], pada: getNakshatraPada(bMoonSid) };
  const girlNakshatra: NakshatraInfo = { index: gNIdx, name: NAKSHATRAS[gNIdx], pada: getNakshatraPada(gMoonSid) };
  const boyRashi: RashiInfo = { index: bRIdx, name: RASHIS[bRIdx].name, lord: RASHIS[bRIdx].lord };
  const girlRashi: RashiInfo = { index: gRIdx, name: RASHIS[gRIdx].name, lord: RASHIS[gRIdx].lord };

  const kootas: KootaResult[] = [
    calcVarna(bRIdx, gRIdx), calcVasya(bRIdx, gRIdx), calcTara(bNIdx, gNIdx), calcYoni(bNIdx, gNIdx),
    calcGrahaMaitri(bRIdx, gRIdx), calcGana(bNIdx, gNIdx), calcBhakoot(bRIdx, gRIdx), calcNadi(bNIdx, gNIdx),
  ];

  const totalScore = kootas.reduce((s, k) => s + k.obtained, 0);

  // Doshas
  const doshas: DoshaResult[] = [];

  // Nadi Dosha
  doshas.push({
    name: 'Nadi Dosha', present: kootas[7].obtained === 0,
    description: kootas[7].obtained === 0
      ? 'Both partners have the same Nadi, which may indicate health concerns for offspring.'
      : 'No Nadi Dosha. Partners have different Nadis.',
    remedy: kootas[7].obtained === 0 ? 'Nadi Dosha can be mitigated through specific pujas, charitable acts, and consulting an experienced astrologer.' : undefined,
  });

  // Bhakoot Dosha
  doshas.push({
    name: 'Bhakoot Dosha', present: kootas[6].obtained === 0,
    description: kootas[6].obtained === 0
      ? 'Unfavorable Rashi combination detected, which may affect financial prosperity and harmony.'
      : 'No Bhakoot Dosha. Rashi positions are favorable.',
    remedy: kootas[6].obtained === 0 ? 'Remedies include performing specific havans, wearing recommended gemstones, and charitable donations.' : undefined,
  });

  // Manglik Dosha (approximate: Mars position relative to Moon sign)
  const bMarsSid = getSiderealLongitude(getMarsLongitude(bJD), bJD);
  const gMarsSid = getSiderealLongitude(getMarsLongitude(gJD), gJD);
  const bMarsR = getRashiIndex(bMarsSid), gMarsR = getRashiIndex(gMarsSid);
  const manglikHouses = [0,1,3,6,7,11];
  const bManglik = manglikHouses.includes(((bMarsR - bRIdx) + 12) % 12);
  const gManglik = manglikHouses.includes(((gMarsR - gRIdx) + 12) % 12);
  const bothManglik = bManglik && gManglik;

  doshas.push({
    name: 'Manglik Dosha',
    present: (bManglik || gManglik) && !bothManglik,
    description: bothManglik
      ? 'Both partners are Manglik — the dosha is considered neutralized.'
      : bManglik || gManglik
        ? `${bManglik ? "Boy" : "Girl"} is Manglik while the other is not. This may require attention.`
        : 'Neither partner is Manglik. No Mangal Dosha concerns.',
    remedy: (bManglik || gManglik) && !bothManglik
      ? 'Remedies include Kumbh Vivah, reciting Hanuman Chalisa, wearing coral gemstone, and Mangal Shanti Puja.'
      : undefined,
  });

  const level = getLevel(totalScore);

  return {
    totalScore, maxScore: 36, percentage: Math.round((totalScore / 36) * 100),
    kootas, doshas, boyNakshatra, girlNakshatra, boyRashi, girlRashi,
    recommendation: getRecommendation(totalScore, level), compatibilityLevel: level,
  };
}
