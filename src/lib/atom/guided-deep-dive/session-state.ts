import { initializeRetrievalCheckpoint, type RetrievalCheckpoint } from '@/lib/atom/guided-deep-dive/retrieval-scheduler';
import type { AdaptiveMode } from '@/lib/atom/guided-deep-dive/runtime-types';

export const GUIDED_DEEP_DIVE_STEPS = [
  'diagnose-gap',
  'atomic-explain',
  'active-recall',
  'clinical-application',
  'reflection',
] as const;

export type GuidedDeepDiveStep = (typeof GUIDED_DEEP_DIVE_STEPS)[number];

export type GuidedDeepDiveStatus = 'scaffold' | 'running' | 'needs-reinforcement' | 'completed' | 'failed' | 'cancelled';

export type StepStatus = 'pending' | 'running' | 'completed' | 'skipped' | 'failed';

export type GuidedDeepDiveSessionState = {
  sessionId: string;
  topic: string;
  level: string;
  goal: string;
  status: GuidedDeepDiveStatus;
  currentStep: GuidedDeepDiveStep;
  completedSteps: GuidedDeepDiveStep[];
  stepStatus: Record<GuidedDeepDiveStep, StepStatus>;
  attemptsByStep: Record<GuidedDeepDiveStep, number>;
  masteryScoreByStep: Partial<Record<GuidedDeepDiveStep, number>>;
  weakConcepts: string[];
  retrievalCheckpoint: RetrievalCheckpoint;
  telemetrySessionId: string;
  adaptiveMode: AdaptiveMode;
  totalLoops: number;
  createdAt: string;
  updatedAt: string;
};

export function createGuidedDeepDiveSessionState(input: {
  topic: string;
  level: string;
  goal: string;
  sessionId?: string;
}): GuidedDeepDiveSessionState {
  const now = new Date().toISOString();

  return {
    sessionId: input.sessionId ?? crypto.randomUUID(),
    topic: input.topic,
    level: input.level,
    goal: input.goal,
    status: 'running',
    currentStep: 'diagnose-gap',
    completedSteps: [],
    stepStatus: {
      'diagnose-gap': 'running',
      'atomic-explain': 'pending',
      'active-recall': 'pending',
      'clinical-application': 'pending',
      reflection: 'pending',
    },
    attemptsByStep: {
      'diagnose-gap': 0,
      'atomic-explain': 0,
      'active-recall': 0,
      'clinical-application': 0,
      reflection: 0,
    },
    masteryScoreByStep: {},
    weakConcepts: [],
    retrievalCheckpoint: initializeRetrievalCheckpoint(),
    telemetrySessionId: crypto.randomUUID(),
    adaptiveMode: 'standard',
    totalLoops: 0,
    createdAt: now,
    updatedAt: now,
  };
}
