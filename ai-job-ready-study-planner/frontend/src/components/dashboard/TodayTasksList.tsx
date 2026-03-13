import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2 } from 'lucide-react';
import { useMarkTaskComplete } from '../../hooks/useQueries';
import type { Task } from '../../backend';

interface TodayTasksListProps {
  tasks: Array<{ task: Task; weekNumber: number; dayIndex: number }>;
}

export default function TodayTasksList({ tasks }: TodayTasksListProps) {
  const markComplete = useMarkTaskComplete();

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <CheckCircle2 className="text-neon mb-3" size={32} />
        <p className="text-foreground font-medium">All caught up!</p>
        <p className="text-muted-foreground text-sm mt-1">No tasks scheduled for today.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(({ task, weekNumber, dayIndex }) => (
        <div
          key={`${weekNumber}-${dayIndex}`}
          className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 ${
            task.isCompleted
              ? 'bg-surface-2/50 border-border/50 opacity-60'
              : 'bg-surface-2 border-border hover:border-neon/30'
          }`}
        >
          <Checkbox
            checked={task.isCompleted}
            disabled={task.isCompleted || markComplete.isPending}
            onCheckedChange={() => {
              if (!task.isCompleted) {
                markComplete.mutate({ week: weekNumber, day: dayIndex });
              }
            }}
            className="mt-0.5 border-border data-[state=checked]:bg-neon data-[state=checked]:border-neon"
          />
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium leading-snug ${
                task.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}
            >
              {task.title}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge
                variant="outline"
                className="text-xs border-neon/30 text-neon bg-neon/5 px-2 py-0"
              >
                {task.associatedSkill}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={10} />
                {Number(task.durationMins)}m
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
