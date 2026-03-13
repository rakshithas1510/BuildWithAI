import { Skeleton } from '@/components/ui/skeleton';
import { useGetReadinessScore } from '../../hooks/useQueries';

interface ReadinessScoreRingProps {
  size?: number;
}

export default function ReadinessScoreRing({ size = 140 }: ReadinessScoreRingProps) {
  const { data, isLoading } = useGetReadinessScore();

  // Always default to 0 — never show an error state
  const score = typeof data === 'number' && isFinite(data) ? Math.min(100, Math.max(0, data)) : 0;

  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number): string => {
    if (s >= 67) return '#22c55e';
    if (s >= 34) return '#f59e0b';
    return '#ef4444';
  };

  const color = getColor(score);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <Skeleton
          className="rounded-full bg-surface-2"
          style={{ width: size, height: size }}
        />
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="oklch(0.25 0 0)"
          strokeWidth="10"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out',
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-display font-bold"
          style={{ color, fontSize: size < 120 ? '1.25rem' : '1.875rem', lineHeight: 1 }}
        >
          {score}%
        </span>
        <span className="text-xs text-muted-foreground font-medium mt-1">Ready</span>
      </div>
    </div>
  );
}
