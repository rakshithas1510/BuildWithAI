import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { BookOpen, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import WeekAccordion from '../components/studyplan/WeekAccordion';
import { useGetStudyPlan, useGetProfile, useMarkTaskComplete } from '../hooks/useQueries';

export default function StudyPlanPage() {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: studyPlan, isLoading: planLoading } = useGetStudyPlan();
  const markComplete = useMarkTaskComplete();

  const isLoading = profileLoading || planLoading;

  const overallStats = useMemo(() => {
    if (!studyPlan) return { completed: 0, total: 0, percentage: 0 };
    const allTasks = studyPlan.modules.flatMap((m) => m.tasks);
    const completed = allTasks.filter((t) => t.isCompleted).length;
    const total = allTasks.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [studyPlan]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <Skeleton className="h-24 w-full rounded-2xl bg-surface-2" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-2xl bg-surface-2" />
        ))}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <BookOpen className="text-neon mx-auto mb-4" size={40} />
        <h2 className="text-xl font-display font-bold text-foreground mb-2">No profile found</h2>
        <p className="text-muted-foreground mb-6">Complete onboarding to generate your study plan.</p>
        <Button
          onClick={() => navigate({ to: '/onboarding' })}
          className="bg-neon text-charcoal hover:bg-neon/90 font-semibold"
        >
          <Plus size={16} className="mr-2" />
          Start Onboarding
        </Button>
      </div>
    );
  }

  if (!studyPlan) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <BookOpen className="text-neon mx-auto mb-4" size={40} />
        <h2 className="text-xl font-display font-bold text-foreground mb-2">No study plan yet</h2>
        <p className="text-muted-foreground mb-6">Your study plan hasn't been generated yet.</p>
        <Button
          onClick={() => navigate({ to: '/onboarding' })}
          className="bg-neon text-charcoal hover:bg-neon/90 font-semibold"
        >
          Generate Plan
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Study Plan</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {studyPlan.jobRole} · {studyPlan.modules.length} weeks
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="bg-surface border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Overall Completion</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {overallStats.completed} of {overallStats.total} tasks completed
              </p>
            </div>
            <span className="text-3xl font-display font-bold text-neon">{overallStats.percentage}%</span>
          </div>
          <Progress value={overallStats.percentage} className="h-2.5 bg-surface-2" />
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="text-center p-3 rounded-xl bg-surface-2 border border-border">
              <div className="text-lg font-bold text-neon">{overallStats.completed}</div>
              <div className="text-xs text-muted-foreground">Done</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-surface-2 border border-border">
              <div className="text-lg font-bold text-foreground">{overallStats.total - overallStats.completed}</div>
              <div className="text-xs text-muted-foreground">Remaining</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-surface-2 border border-border">
              <div className="text-lg font-bold text-foreground">{studyPlan.modules.length}</div>
              <div className="text-xs text-muted-foreground">Weeks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Accordions */}
      <div className="space-y-3">
        {studyPlan.modules.map((mod) => (
          <WeekAccordion
            key={Number(mod.weekNumber)}
            module={mod}
            onComplete={(week, day) => markComplete.mutate({ week, day })}
            isPending={markComplete.isPending}
          />
        ))}
      </div>
    </div>
  );
}
