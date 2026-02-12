import type { MatchResult } from '@/types/astrology';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ScoreGauge from './ScoreGauge';
import { toast } from 'sonner';

interface Props { results: MatchResult; boyName: string; girlName: string; onReset: () => void; }

const statusBadge = (status: string) => {
  const cls: Record<string, string> = {
    good: 'bg-green-100 text-green-800 border-green-200',
    average: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    needs_attention: 'bg-red-100 text-red-800 border-red-200',
  };
  const lbl: Record<string, string> = { good: '✓ Good', average: '~ Average', needs_attention: '✗ Attention' };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${cls[status]}`}>{lbl[status]}</span>;
};

export default function ResultsDisplay({ results, boyName, girlName, onReset }: Props) {
  const handleShare = async () => {
    const text = `Kundli Matching: ${boyName} & ${girlName} scored ${results.totalScore}/36 (${results.percentage}%)`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Kundli Match', text, url: window.location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6 print:space-y-4" id="results-report">
      {/* Summary Card */}
      <Card className="border-primary/30 shadow-md">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Compatibility Report</h2>
            <p className="text-muted-foreground">{boyName} & {girlName}</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <ScoreGauge score={results.totalScore} maxScore={results.maxScore} />
            <div className="text-center md:text-left space-y-1.5">
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <span className="text-muted-foreground">Boy's Nakshatra:</span>
                <span className="font-medium">{results.boyNakshatra.name} (Pada {results.boyNakshatra.pada})</span>
                <span className="text-muted-foreground">Girl's Nakshatra:</span>
                <span className="font-medium">{results.girlNakshatra.name} (Pada {results.girlNakshatra.pada})</span>
                <span className="text-muted-foreground">Boy's Rashi:</span>
                <span className="font-medium">{results.boyRashi.name}</span>
                <span className="text-muted-foreground">Girl's Rashi:</span>
                <span className="font-medium">{results.girlRashi.name}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Koota Table */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Ashtakoot (8 Koota) Breakdown</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 font-semibold">Koota</th>
                  <th className="text-center py-2 px-2 font-semibold">Score</th>
                  <th className="text-left py-2 px-2 hidden sm:table-cell font-semibold">Description</th>
                  <th className="text-center py-2 px-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {results.kootas.map((k, i) => (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="py-3 px-2 font-medium">{k.name}</td>
                    <td className="py-3 px-2 text-center font-mono">{k.obtained} / {k.maximum}</td>
                    <td className="py-3 px-2 text-muted-foreground hidden sm:table-cell text-xs">{k.description}</td>
                    <td className="py-3 px-2 text-center">{statusBadge(k.status)}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-muted/50">
                  <td className="py-3 px-2">Total</td>
                  <td className="py-3 px-2 text-center font-mono">{results.totalScore} / {results.maxScore}</td>
                  <td className="py-3 px-2 hidden sm:table-cell"></td>
                  <td className="py-3 px-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dosha Analysis */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Dosha Analysis</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {results.doshas.map((d, i) => (
            <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${d.present ? 'bg-red-500' : 'bg-green-500'}`} />
                <h4 className="font-semibold text-sm">{d.name}</h4>
                <Badge variant={d.present ? 'destructive' : 'secondary'} className="text-xs">
                  {d.present ? 'Present' : 'Not Present'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{d.description}</p>
              {d.remedy && <p className="text-sm mt-2 text-primary italic">💡 {d.remedy}</p>}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendation */}
      <Card className="border-primary/20">
        <CardHeader><CardTitle className="text-lg">Overall Recommendation</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{results.recommendation}</p>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-3 print:hidden">
        <Button onClick={() => window.print()} variant="outline">📄 Print / Save PDF</Button>
        <Button onClick={handleShare} variant="outline">🔗 Share Result</Button>
        <Button onClick={onReset} variant="outline">🔄 New Match</Button>
      </div>
    </div>
  );
}
