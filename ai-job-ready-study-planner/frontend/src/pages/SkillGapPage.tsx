import { useNavigate } from '@tanstack/react-router';
import { BarChart2, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ReadinessScoreRing from '../components/dashboard/ReadinessScoreRing';
import SkillBadge from '../components/skillgap/SkillBadge';
import MissingSkillsList from '../components/skillgap/MissingSkillsList';
import { useGetProfile, useAnalyzeSkillGaps, useCreateOrUpdateProfile } from '../hooks/useQueries';
import type { Skill } from '../backend';

export default function SkillGapPage() {
  const navigate = useNavigate();
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: gapData, isLoading: gapLoading } = useAnalyzeSkillGaps();
  const updateProfile = useCreateOrUpdateProfile();

  const isLoading = profileLoading || gapLoading;

  const handleAddSkill = async (skill: Skill) => {
    if (!profile) return;
    const alreadyHas = profile.skills.some((s) => s.id === skill.id);
    if (alreadyHas) return;
    await updateProfile.mutateAsync({
      username: profile.username,
      targetJobRole: profile.targetJobRole,
      skills: [...profile.skills, skill],
      studyGoals: profile.studyGoals,
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <Skeleton className="h-48 w-full rounded-2xl bg-surface-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-2xl bg-surface-2" />
          <Skeleton className="h-64 rounded-2xl bg-surface-2" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <BarChart2 className="text-neon mx-auto mb-4" size={40} />
        <h2 className="text-xl font-display font-bold text-foreground mb-2">No profile found</h2>
        <p className="text-muted-foreground mb-6">Complete onboarding to see your skill gap analysis.</p>
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">Skill Gap Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Target role: <span className="text-foreground font-medium">{profile.targetJobRole}</span>
        </p>
      </div>

      {/* Score + Summary — always visible */}
      <Card className="bg-surface border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <ReadinessScoreRing size={160} />
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-lg font-display font-bold text-foreground">Job Readiness</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Based on completed study plan tasks
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-surface-2 border border-border text-center">
                  <div className="text-xl font-display font-bold text-neon">
                    {profile.skills.length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Current Skills</div>
                </div>
                <div className="p-3 rounded-xl bg-surface-2 border border-border text-center">
                  <div className="text-xl font-display font-bold text-destructive">
                    {gapData ? gapData.missingSkills.length : 0}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">Missing Skills</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info notice when gap analysis is unavailable */}
      {!gapData && (
        <Alert className="bg-surface border-border">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <AlertDescription className="text-muted-foreground">
            Skill gap analysis is not available for this role yet. The system is still learning about{' '}
            <strong className="text-foreground">{profile.targetJobRole}</strong> requirements.
          </AlertDescription>
        </Alert>
      )}

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Skills */}
        <Card className="bg-surface border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Your Current Skills</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {profile.skills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <SkillBadge key={skill.id} name={skill.name} matched={true} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Missing Skills */}
        <Card className="bg-surface border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Skills to Acquire</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {!gapData || gapData.missingSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {gapData ? '🎉 You have all required skills!' : 'No gap data available.'}
              </p>
            ) : (
              <MissingSkillsList
                missingSkills={gapData.missingSkills}
                onAddSkill={handleAddSkill}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
