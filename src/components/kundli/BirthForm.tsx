import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BirthDetails, CityResult, Gender } from '@/types/astrology';
import { searchCities } from '@/lib/geocoding';
import { getTimezoneOffset } from '@/lib/astro-engine';

const days = Array.from({ length: 31 }, (_, i) => i + 1);
const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const years = Array.from({ length: 106 }, (_, i) => 2025 - i);
const hrs = Array.from({ length: 24 }, (_, i) => i);
const minsArr = Array.from({ length: 60 }, (_, i) => i);

interface PersonData {
  name: string; gender: string;
  day: string; month: string; year: string;
  hour: string; minute: string; second: string;
  place: string; latitude: number; longitude: number; countryCode: string;
}

const emptyPerson = (gender: string): PersonData => ({
  name: '', gender, day: '', month: '', year: '',
  hour: '', minute: '', second: '0',
  place: '', latitude: 0, longitude: 0, countryCode: '',
});

function CitySearch({ value, onChange, onSelect }: {
  value: string; onChange: (v: string) => void; onSelect: (c: CityResult) => void;
}) {
  const [results, setResults] = useState<CityResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (value.length < 3) { setResults([]); return; }
    const t = setTimeout(async () => {
      setSearching(true);
      const cities = await searchCities(value);
      setResults(cities);
      setShow(true);
      setSearching(false);
    }, 500);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="relative">
      <Input value={value} onChange={e => onChange(e.target.value)}
        placeholder="Search city..." onFocus={() => results.length > 0 && setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 200)} />
      {show && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {results.map((c, i) => (
            <button key={i} className="w-full text-left px-3 py-2 hover:bg-muted text-sm truncate"
              onMouseDown={() => { onSelect(c); setShow(false); }}>
              {c.displayName}
            </button>
          ))}
        </div>
      )}
      {searching && <span className="absolute right-3 top-2.5 text-xs text-muted-foreground">Searching...</span>}
    </div>
  );
}

function PersonSection({ title, icon, data, onChange }: {
  title: string; icon: string; data: PersonData; onChange: (d: PersonData) => void;
}) {
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="text-2xl">{icon}</span> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Full Name</Label>
          <Input value={data.name} onChange={e => onChange({ ...data, name: e.target.value })} placeholder="Enter full name" className="mt-1" />
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gender</Label>
          <Select value={data.gender} onValueChange={v => onChange({ ...data, gender: v })}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date of Birth</Label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <Select value={data.day} onValueChange={v => onChange({ ...data, day: v })}>
              <SelectTrigger><SelectValue placeholder="Day" /></SelectTrigger>
              <SelectContent>{days.map(d => <SelectItem key={d} value={String(d)}>{d}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={data.month} onValueChange={v => onChange({ ...data, month: v })}>
              <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
              <SelectContent>{monthNames.map((m, i) => <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={data.year} onValueChange={v => onChange({ ...data, year: v })}>
              <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Time of Birth</Label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <Select value={data.hour} onValueChange={v => onChange({ ...data, hour: v })}>
              <SelectTrigger><SelectValue placeholder="Hour" /></SelectTrigger>
              <SelectContent>{hrs.map(h => <SelectItem key={h} value={String(h)}>{String(h).padStart(2, '0')}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={data.minute} onValueChange={v => onChange({ ...data, minute: v })}>
              <SelectTrigger><SelectValue placeholder="Min" /></SelectTrigger>
              <SelectContent>{minsArr.map(m => <SelectItem key={m} value={String(m)}>{String(m).padStart(2, '0')}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={data.second} onValueChange={v => onChange({ ...data, second: v })}>
              <SelectTrigger><SelectValue placeholder="Sec" /></SelectTrigger>
              <SelectContent>{minsArr.map(s => <SelectItem key={s} value={String(s)}>{String(s).padStart(2, '0')}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Birth Place</Label>
          <div className="mt-1">
            <CitySearch value={data.place} onChange={v => onChange({ ...data, place: v })}
              onSelect={city => onChange({ ...data, place: `${city.name}, ${city.country}`, latitude: city.latitude, longitude: city.longitude, countryCode: city.countryCode })} />
          </div>
          {data.latitude !== 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              📍 {data.latitude.toFixed(2)}°, {data.longitude.toFixed(2)}° · TZ: UTC{getTimezoneOffset(data.countryCode, data.longitude) >= 0 ? '+' : ''}{getTimezoneOffset(data.countryCode, data.longitude)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface Props { onSubmit: (boy: BirthDetails, girl: BirthDetails) => void; isCalculating: boolean; }

export default function BirthForm({ onSubmit, isCalculating }: Props) {
  const [boy, setBoy] = useState<PersonData>(emptyPerson('male'));
  const [girl, setGirl] = useState<PersonData>(emptyPerson('female'));
  const [error, setError] = useState('');

  const validate = (): boolean => {
    for (const [label, data] of [['Boy', boy], ['Girl', girl]] as const) {
      if (!data.name.trim()) { setError(`${label}'s name is required`); return false; }
      if (!data.day || !data.month || !data.year) { setError(`${label}'s date of birth is required`); return false; }
      if (data.hour === '' || data.minute === '') { setError(`${label}'s time of birth is required`); return false; }
      if (!data.latitude && !data.longitude) { setError(`Please select ${label}'s birth place from suggestions`); return false; }
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const convert = (d: PersonData): BirthDetails => ({
      name: d.name.trim(), gender: d.gender as Gender,
      day: parseInt(d.day), month: parseInt(d.month), year: parseInt(d.year),
      hour: parseInt(d.hour), minute: parseInt(d.minute), second: parseInt(d.second || '0'),
      place: d.place, latitude: d.latitude, longitude: d.longitude,
      timezone: getTimezoneOffset(d.countryCode, d.longitude),
    });
    onSubmit(convert(boy), convert(girl));
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <PersonSection title="Boy's Details" icon="👦" data={boy} onChange={setBoy} />
        <PersonSection title="Girl's Details" icon="👧" data={girl} onChange={setGirl} />
      </div>
      {error && <p className="text-center text-destructive text-sm font-medium">{error}</p>}
      <div className="flex justify-center">
        <Button onClick={handleSubmit} disabled={isCalculating} size="lg"
          className="px-12 text-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
          {isCalculating ? '🔄 Calculating...' : '🔮 Match Kundli'}
        </Button>
      </div>
    </div>
  );
}
