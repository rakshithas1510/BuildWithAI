import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { BookOpen, BarChart2, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ReadinessScoreRing from '../components/dashboard/ReadinessScoreRing';
import TodayTasksList from '../components/dashboard/TodayTasksList';
import WeeklyProgress from '../components/dashboard/WeeklyProgress';
import NavigationCard from '../components/dashboard/NavigationCard';
import { useGetProfile, useGetStudyPlan, useAnalyzeSkillGaps } from '../hooks/useQueries';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: studyPlan, isLoading: planLoading } = useGetStudyPlan();
  const { data: gapData } = useAnalyzeSkillGaps();

  const isLoading = profileLoading || planLoading;

  // Get today's tasks (first incomplete tasks from week 1)
  const todayTasks = useMemo(() => {
    if (!studyPlan) return [];
    const result: Array<{ task: (typeof studyPlan.modules)[0]['tasks'][0]; weekNumber: number; dayIndex: number }> = [];
    for (const mod of studyPlan.modules) {
      for (let i = 0; i < mod.tasks.length; i++) {
        const task = mod.tasks[i];
        if (!task.isCompleted && result.length < 5) {
          result.push({ task, weekNumber: Number(mod.weekNumber), dayIndex: i });
        }
      }
      if (result.length >= 5) break;
    }
    return result;
  }, [studyPlan]);

  // Weekly progress (week 1)
  const weeklyStats = useMemo(() => {
    if (!studyPlan || studyPlan.modules.length === 0) return { completed: 0, total: 0 };
    const week1 = studyPlan.modules[0];
    const completed = week1.tasks.filter((t) => t.isCompleted).length;
    return { completed, total: week1.tasks.length };
  }, [studyPlan]);

  // Overall completion
  const overallCompletion = useMemo(() => {
    if (!studyPlan) return 0;
    const allTasks = studyPlan.modules.flatMap((m) => m.tasks);
    if (allTasks.length === 0) return 0;
    return Math.round((allTasks.filter((t) => t.isCompleted).length / allTasks.length) * 100);
  }, [studyPlan]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl bg-surface-2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 rounded-2xl bg-surface-2" />)}
        </div>
      </div>
    );
  }

  // No profile — redirect to onboarding
  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl bg-neon/10 border border-neon/30 flex items-center justify-center mb-6">
          <BookOpen className="text-neon" size={32} />
        </div>
        <h1 className="text-3xl font-display font-bold text-foreground mb-3">
          Welcome to <span className="text-neon">JobReady AI</span>
        </h1>
        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
          Your AI-powered study planner for career success. Let's set up your personalized learning path in just 2 minutes.
        </p>
        <Button
          onClick={() => navigate({ to: '/onboarding' })}
          className="bg-neon text-charcoal hover:bg-neon/90 font-bold px-8 py-3 text-base h-auto"
        >
          <Plus size={18} className="mr-2" />
          Get Started
        </Button>
        <div className="mt-12 w-full max-w-2xl rounded-2xl overflow-hidden border border-border">
          <img
            src="/assets/generated/dashboard-hero.dim_800x400.png"
            alt="Study dashboard illustration"
            className="w-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-border">
        <img
          src="/assets/generated/dashboard-hero.dim_800x400.png"
          alt="Dashboard hero"
          className="w-full h-40 sm:h-52 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/60 to-transparent flex items-center px-8">
          <div>
            <p className="text-neon text-sm font-semibold uppercase tracking-widest mb-1">Welcome back</p>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              {profile.username || 'Learner'}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Target: <span className="text-foreground font-medium">{profile.targetJobRole}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Readiness Score */}
        <Card className="bg-surface border-border col-span-1">
          <CardContent className="p-6 flex flex-col items-center justify-center gap-3">
            <ReadinessScoreRing />
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">Job Readiness</p>
              <p className="text-xs text-muted-foreground mt-0.5">Based on task completion</p>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card className="bg-surface border-border col-span-1 sm:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">This Week's Progress</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <WeeklyProgress completed={weeklyStats.completed} total={weeklyStats.total} />
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center p-3 rounded-xl bg-surface-2 border border-border">
                <div className="text-xl font-display font-bold text-neon">{overallCompletion}%</div>
                <div className="text-xs text-muted-foreground mt-0.5">Overall</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-surface-2 border border-border">
                <div className="text-xl font-display font-bold text-foreground">
                  {studyPlan?.modules.length ?? 0}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Weeks</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-surface-2 border border-border">
                <div className="text-xl font-display font-bold text-foreground">
                  {studyPlan?.modules.flatMap((m) => m.tasks).length ?? 0}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">Tasks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Tasks */}
      <Card className="bg-surface border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground">Up Next</CardTitle>
            <span className="text-xs text-muted-foreground bg-surface-2 px-2 py-1 rounded-full border border-border">
              {todayTasks.filter((t) => !t.task.isCompleted).length} pending
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <TodayTasksList tasks={todayTasks} />
        </CardContent>
      </Card>

      {/* Navigation Cards */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NavigationCard
            to="/study-plan"
            icon={BookOpen}
            title="Study Plan"
            description="View your full multi-week learning roadmap with all tasks."
            stat={`${studyPlan?.modules.length ?? 0}`}
            statLabel="weeks"
          />
          <NavigationCard
            to="/skill-gap"
            icon={BarChart2}
            title="Skill Gap Analysis"
            description="See which skills you're missing for your target role."
            stat={gapData ? `${gapData.readinessScore}%` : '—'}
            statLabel="readiness"
          />
          <NavigationCard
            to="/study-plan"
            icon={Calendar}
            title="Schedule"
            description="Track your daily and weekly study schedule progress."
            stat={`${weeklyStats.completed}/${weeklyStats.total}`}
            statLabel="this week"
          />
        </div>
      </div>
    </div>
  );
}
