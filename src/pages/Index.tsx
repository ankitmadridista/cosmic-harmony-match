import { useState, useRef } from 'react';
import type { BirthDetails, MatchResult } from '@/types/astrology';
import { calculateMatch } from '@/lib/ashtakoot';
import BirthForm from '@/components/kundli/BirthForm';
import ResultsDisplay from '@/components/kundli/ResultsDisplay';
import EducationalContent from '@/components/kundli/EducationalContent';

const Index = () => {
  const [results, setResults] = useState<MatchResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [boyName, setBoyName] = useState('');
  const [girlName, setGirlName] = useState('');
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (boy: BirthDetails, girl: BirthDetails) => {
    setIsCalculating(true);
    setBoyName(boy.name);
    setGirlName(girl.name);
    setTimeout(() => {
      const result = calculateMatch(boy, girl);
      setResults(result);
      setIsCalculating(false);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }, 600);
  };

  const handleReset = () => setResults(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="py-10 md:py-14 text-center bg-gradient-to-b from-primary/8 to-background border-b border-border/50">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-2 tracking-tight">
          🕉️ Kundli Matching
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto px-4">
          Free & instant Ashtakoot Guna Milan — discover compatibility through ancient Vedic wisdom
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <section className="mb-10">
          <BirthForm onSubmit={handleSubmit} isCalculating={isCalculating} />
        </section>

        {results && (
          <section ref={resultsRef} className="mb-10">
            <ResultsDisplay results={results} boyName={boyName} girlName={girlName} onReset={handleReset} />
          </section>
        )}

        <section className="mt-12 mb-8">
          <EducationalContent />
        </section>
      </main>

      <footer className="py-6 text-center text-xs text-muted-foreground border-t border-border/50">
        <p>© 2025 Kundli Matching · For educational purposes only</p>
        <p className="mt-1">Astrology is interpretative. Consult a qualified astrologer for personalized guidance.</p>
      </footer>
    </div>
  );
};

export default Index;
