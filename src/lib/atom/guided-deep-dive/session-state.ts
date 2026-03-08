export const GUIDED_DEEP_DIVE_STEPS = [
  'diagnose-gap',
  'atomic-explain',
  'active-recall',
  'clinical-application',
  'reflection',
] as const;

export type GuidedDeepDiveStep = (typeof GUIDED_DEEP_DIVE_STEPS)[number];

export type GuidedDeepDiveSessionState = {
  sessionId: string;
  topic: string;
  level: string;
  goal: string;
  status: 'scaffold';
  currentStep: GuidedDeepDiveStep;
  completedSteps: GuidedDeepDiveStep[];
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
    status: 'scaffold',
    currentStep: 'diagnose-gap',
    completedSteps: [],
    createdAt: now,
    updatedAt: now,
  };
}
