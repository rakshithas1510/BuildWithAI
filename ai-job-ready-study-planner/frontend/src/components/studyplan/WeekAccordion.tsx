import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import TaskItem from './TaskItem';
import type { WeeklyModule } from '../../backend';

interface WeekAccordionProps {
  module: WeeklyModule;
  onComplete: (week: number, day: number) => void;
  isPending?: boolean;
}

export default function WeekAccordion({ module, onComplete, isPending }: WeekAccordionProps) {
  const weekNum = Number(module.weekNumber);
  const completedCount = module.tasks.filter((t) => t.isCompleted).length;
  const totalCount = module.tasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value={`week-${weekNum}`}
        className="bg-surface border border-border rounded-2xl overflow-hidden mb-0"
      >
        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-surface-2/50 transition-colors [&[data-state=open]]:bg-surface-2/30">
          <div className="flex items-center gap-4 w-full">
            <div className="w-10 h-10 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center flex-shrink-0">
              <span className="text-neon font-bold text-sm">W{weekNum}</span>
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-foreground">Week {weekNum}</span>
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-0 h-5 ${
                    percentage === 100
                      ? 'border-neon/50 text-neon bg-neon/10'
                      : 'border-border text-muted-foreground'
                  }`}
                >
                  {completedCount}/{totalCount} tasks
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden max-w-32">
                  <div
                    className="h-full bg-neon rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{percentage}%</span>
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <div className="space-y-2 pt-2">
            {module.tasks.map((task, idx) => (
              <TaskItem
                key={idx}
                task={task}
                weekNumber={weekNum}
                dayIndex={idx}
                onComplete={onComplete}
                isPending={isPending}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
