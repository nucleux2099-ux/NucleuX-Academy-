export const LEARNING_CYCLE_PHASES = [
  'plan',
  'learn',
  'recall',
  'apply',
  'reflect',
] as const;

export type LearningCyclePhase = (typeof LEARNING_CYCLE_PHASES)[number];

export type LearningCycleHookPayload = {
  phase: LearningCyclePhase;
  topic: string;
  source: string;
  metadata?: Record<string, unknown>;
};

export type LearningCycleHookResult = {
  accepted: boolean;
  status: 'scaffold';
  emittedAt: string;
};

export interface LearningCycleHooks {
  onPhaseCheckpoint(payload: LearningCycleHookPayload): Promise<LearningCycleHookResult>;
}

export function createLearningCycleHooksScaffold(): LearningCycleHooks {
  return {
    async onPhaseCheckpoint() {
      return {
        accepted: true,
        status: 'scaffold',
        emittedAt: new Date().toISOString(),
      };
    },
  };
}
