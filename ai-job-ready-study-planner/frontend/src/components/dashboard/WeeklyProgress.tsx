import { Progress } from '@/components/ui/progress';

interface WeeklyProgressProps {
  completed: number;
  total: number;
}

export default function WeeklyProgress({ completed, total }: WeeklyProgressProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Tasks completed this week</span>
        <span className="text-sm font-bold text-foreground">
          {completed} / {total}
        </span>
      </div>
      <div className="relative">
        <Progress
          value={percentage}
          className="h-3 bg-surface-2"
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{percentage}% complete</span>
        <span>{total - completed} remaining</span>
      </div>
    </div>
  );
}
