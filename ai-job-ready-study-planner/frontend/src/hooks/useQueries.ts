import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Skill, StudyPlan } from '../backend';

export function useGetProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getProfile();
      return result ?? null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStudyPlan() {
  const { actor, isFetching } = useActor();
  return useQuery<StudyPlan | null>({
    queryKey: ['studyPlan'],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getStudyPlan();
      return result ?? null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReadinessScore() {
  const { actor, isFetching } = useActor();
  return useQuery<number>({
    queryKey: ['readinessScore'],
    queryFn: async () => {
      if (!actor) return 0;
      try {
        const score = await actor.getReadinessScore();
        const n = Number(score);
        return isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
      } catch {
        return 0;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
    // Never surface an error — always resolve to a number
    throwOnError: false,
  });
}

export function useAnalyzeSkillGaps() {
  const { actor, isFetching } = useActor();
  return useQuery<{ readinessScore: number; missingSkills: Skill[] } | null>({
    queryKey: ['skillGaps'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const [score, missing] = await actor.analyzeSkillGaps();
        return {
          readinessScore: Number(score),
          missingSkills: missing,
        };
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useCreateOrUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      username,
      targetJobRole,
      skills,
      studyGoals,
    }: {
      username: string;
      targetJobRole: string;
      skills: Skill[];
      studyGoals: string;
    }) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.createOrUpdateProfile(username, targetJobRole, skills, studyGoals);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['skillGaps'] });
      queryClient.invalidateQueries({ queryKey: ['readinessScore'] });
    },
  });
}

export function useGenerateDefaultPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not ready');
      await actor.generateDefaultPlan();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studyPlan'] });
      queryClient.invalidateQueries({ queryKey: ['readinessScore'] });
    },
  });
}

export function useMarkTaskComplete() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ week, day }: { week: number; day: number }) => {
      if (!actor) throw new Error('Actor not ready');
      await actor.markTaskComplete(BigInt(week), BigInt(day));
    },
    onMutate: async ({ week, day }) => {
      await queryClient.cancelQueries({ queryKey: ['studyPlan'] });
      const previous = queryClient.getQueryData<StudyPlan>(['studyPlan']);
      if (previous) {
        const updated: StudyPlan = {
          ...previous,
          modules: previous.modules.map((mod) => {
            if (Number(mod.weekNumber) === week) {
              return {
                ...mod,
                tasks: mod.tasks.map((task, idx) =>
                  idx === day ? { ...task, isCompleted: true } : task
                ),
              };
            }
            return mod;
          }),
        };
        queryClient.setQueryData(['studyPlan'], updated);
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['studyPlan'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['studyPlan'] });
      queryClient.invalidateQueries({ queryKey: ['readinessScore'] });
    },
  });
}
