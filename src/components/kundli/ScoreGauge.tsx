interface Props { score: number; maxScore: number; }

export default function ScoreGauge({ score, maxScore }: Props) {
  const pct = (score / maxScore) * 100;
  const r = 75;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  const color = score < 18 ? '#ef4444' : score < 24 ? '#eab308' : score < 32 ? '#22c55e' : '#15803d';
  const label = score < 18 ? 'Not Recommended' : score < 24 ? 'Average Match' : score < 32 ? 'Very Good Match' : 'Excellent Match';

  return (
    <div className="flex flex-col items-center">
      <svg width="190" height="190" viewBox="0 0 190 190">
        <circle cx="95" cy="95" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
        <circle cx="95" cy="95" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          transform="rotate(-90 95 95)" style={{ transition: 'stroke-dashoffset 1s ease-out' }} />
        <text x="95" y="85" textAnchor="middle" style={{ fill: 'hsl(var(--foreground))' }} fontSize="36" fontWeight="bold">{score}</text>
        <text x="95" y="110" textAnchor="middle" style={{ fill: 'hsl(var(--muted-foreground))' }} fontSize="14">out of {maxScore}</text>
      </svg>
      <span className="mt-1 text-base font-semibold" style={{ color }}>{label}</span>
      <span className="text-sm text-muted-foreground">{pct}% Compatible</span>
    </div>
  );
}
