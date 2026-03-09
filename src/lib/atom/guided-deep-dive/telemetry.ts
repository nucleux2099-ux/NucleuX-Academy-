import type { GuidedDeepDiveStep } from '@/lib/atom/guided-deep-dive/session-state';

export type GddTelemetryEventName =
  | 'gdd_session_started'
  | 'gdd_step_started'
  | 'gdd_step_scored'
  | 'gdd_branch_taken'
  | 'gdd_checkpoint_recorded'
  | 'gdd_retrieval_schedule_created'
  | 'gdd_session_completed'
  | 'gdd_session_needs_reinforcement'
  | 'gdd_session_failed';

export type GddTelemetryEvent = {
  event: GddTelemetryEventName;
  timestamp: string;
  sessionId: string;
  topic: string;
  level: string;
  currentStep: GuidedDeepDiveStep;
  payload: Record<string, unknown>;
};

export function createGddTelemetryEvent(input: {
  event: GddTelemetryEventName;
  sessionId: string;
  topic: string;
  level: string;
  currentStep: GuidedDeepDiveStep;
  payload: Record<string, unknown>;
}): GddTelemetryEvent {
  return {
    event: input.event,
    timestamp: new Date().toISOString(),
    sessionId: input.sessionId,
    topic: input.topic,
    level: input.level,
    currentStep: input.currentStep,
    payload: input.payload,
  };
}
