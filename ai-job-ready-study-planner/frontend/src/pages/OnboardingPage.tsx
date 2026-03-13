import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import StepIndicator from '../components/onboarding/StepIndicator';
import JobRoleStep from '../components/onboarding/JobRoleStep';
import SkillsStep from '../components/onboarding/SkillsStep';
import StudyHoursStep from '../components/onboarding/StudyHoursStep';
import { useCreateOrUpdateProfile, useGenerateDefaultPlan } from '../hooks/useQueries';
import type { Skill } from '../backend';

const STEP_LABELS = ['Job Role', 'Skills', 'Schedule'];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [jobRole, setJobRole] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [studyHours, setStudyHours] = useState(10);
  const [error, setError] = useState('');

  const createProfile = useCreateOrUpdateProfile();
  const generatePlan = useGenerateDefaultPlan();

  const isLoading = createProfile.isPending || generatePlan.isPending;

  const canProceed = () => {
    if (step === 1) return jobRole.trim().length > 0;
    if (step === 2) return true; // skills optional
    if (step === 3) return studyHours > 0;
    return false;
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setError('');
    try {
      await createProfile.mutateAsync({
        username: 'User',
        targetJobRole: jobRole,
        skills,
        studyGoals: `Study ${studyHours} hours per week to become a ${jobRole}`,
      });
      await generatePlan.mutateAsync();
      navigate({ to: '/' });
    } catch (e) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="/assets/generated/app-logo.dim_128x128.png"
              alt="JobReady AI"
              className="h-10 w-10 rounded-xl object-cover"
            />
            <span className="font-display font-bold text-2xl text-foreground">
              Job<span className="text-neon">Ready</span> AI
            </span>
          </div>
          <p className="text-muted-foreground text-sm">Your personalized path to career success</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <StepIndicator currentStep={step} totalSteps={3} labels={STEP_LABELS} />
        </div>

        {/* Card */}
        <Card className="bg-surface border-border shadow-2xl">
          <CardContent className="p-8">
            {step === 1 && <JobRoleStep value={jobRole} onChange={setJobRole} />}
            {step === 2 && <SkillsStep skills={skills} onChange={setSkills} />}
            {step === 3 && <StudyHoursStep value={studyHours} onChange={setStudyHours} />}

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={step === 1 || isLoading}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>

              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-neon text-charcoal hover:bg-neon/90 font-semibold px-6"
                >
                  Continue
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isLoading}
                  className="bg-neon text-charcoal hover:bg-neon/90 font-semibold px-6"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Launch My Plan
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Step {step} of 3 — Takes less than 2 minutes
        </p>
      </div>
    </div>
  );
}
