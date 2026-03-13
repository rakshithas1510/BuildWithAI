import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import type { Task } from '../../backend';

interface TaskItemProps {
  task: Task;
  weekNumber: number;
  dayIndex: number;
  onComplete: (week: number, day: number) => void;
  isPending?: boolean;
}

export default function TaskItem({ task, weekNumber, dayIndex, onComplete, isPending }: TaskItemProps) {
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
        task.isCompleted
          ? 'bg-surface-2/40 border-border/40 opacity-60'
          : 'bg-surface-2 border-border hover:border-neon/30 hover:bg-surface-2/80'
      }`}
    >
      <Checkbox
        checked={task.isCompleted}
        disabled={task.isCompleted || isPending}
        onCheckedChange={() => {
          if (!task.isCompleted) {
            onComplete(weekNumber, dayIndex);
          }
        }}
        className="mt-0.5 border-border data-[state=checked]:bg-neon data-[state=checked]:border-neon flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium leading-snug ${
            task.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge
            variant="outline"
            className="text-xs border-neon/30 text-neon bg-neon/5 px-2 py-0 h-5"
          >
            {task.associatedSkill}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={10} />
            {Number(task.durationMins)} min
          </span>
          {task.isCompleted && (
            <span className="text-xs text-neon font-medium">✓ Completed</span>
          )}
        </div>
      </div>
    </div>
  );
}
