import {
  type GuidedDeepDiveSessionState,
  type GuidedDeepDiveStep,
  GUIDED_DEEP_DIVE_STEPS,
} from '@/lib/atom/guided-deep-dive/session-state';
import { evaluateStep, getScoreBand } from '@/lib/atom/guided-deep-dive/scoring';
import { initializeRetrievalCheckpoint } from '@/lib/atom/guided-deep-dive/retrieval-scheduler';
import type { AdaptiveMode, BranchDecision, StepAdvanceInput } from '@/lib/atom/guided-deep-dive/runtime-types';
import { createGddTelemetryEvent, type GddTelemetryEvent } from '@/lib/atom/guided-deep-dive/telemetry';

const MAX_TOTAL_LOOPS = 6;
const MAX_PER_STEP_ATTEMPTS = 4;

function nextAdaptiveMode(score: number): AdaptiveMode {
  if (score < 40) return 'remedial';
  if (score < 70) return 'standard';
  return 'fast';
}

function toTerminalNeedsReinforcement(state: GuidedDeepDiveSessionState, weakConcepts: string[]): GuidedDeepDiveSessionState {
  const now = new Date().toISOString();
  const retrievalCheckpoint = initializeRetrievalCheckpoint();
  retrievalCheckpoint.intervalDays = [1, 3, 7];
  retrievalCheckpoint.dueAt = [new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()];

  return {
    ...state,
    status: 'needs-reinforcement',
    updatedAt: now,
    weakConcepts: Array.from(new Set([...state.weakConcepts, ...weakConcepts])),
    retrievalCheckpoint,
  };
}

function decideNextStep(state: GuidedDeepDiveSessionState, score: number, overconfident: boolean, weakConcepts: string[]): BranchDecision {
  const fromStep = state.currentStep;
  if (fromStep === 'diagnose-gap') {
    return { fromStep, toStep: 'atomic-explain', reason: getScoreBand(score), weakConcepts };
  }

  if (fromStep === 'atomic-explain') {
    if (score >= 70) return { fromStep, toStep: 'active-recall', reason: 'strong', weakConcepts };
    return { fromStep, toStep: 'atomic-explain', reason: getScoreBand(score), weakConcepts };
  }

  if (fromStep === 'active-recall') {
    if (score >= 80 && !overconfident) return { fromStep, toStep: 'clinical-application', reason: 'calibrated-strong', weakConcepts };
    if (score >= 60 || overconfident) return { fromStep, toStep: 'atomic-explain', reason: 'borderline', weakConcepts };
    return { fromStep, toStep: 'diagnose-gap', reason: 'weak', weakConcepts };
  }

  if (fromStep === 'clinical-application') {
    if (score >= 75) return { fromStep, toStep: 'reflection', reason: 'strong', weakConcepts };
    if (score >= 50) return { fromStep, toStep: 'active-recall', reason: 'borderline', weakConcepts };
    return { fromStep, toStep: 'atomic-explain', reason: 'weak', weakConcepts };
  }

  if (score >= 70) {
    return { fromStep, toStep: 'reflection', reason: 'strong', weakConcepts };
  }
  return { fromStep, toStep: 'active-recall', reason: 'borderline', weakConcepts };
}

export function advanceGuidedDeepDive(
  state: GuidedDeepDiveSessionState,
  stepInput: StepAdvanceInput,
): { state: GuidedDeepDiveSessionState; events: GddTelemetryEvent[] } {
  if (state.status === 'completed' || state.status === 'failed' || state.status === 'cancelled' || state.status === 'needs-reinforcement') {
    return { state, events: [] };
  }

  const events: GddTelemetryEvent[] = [];
  const now = new Date().toISOString();
  const currentStep = state.currentStep;
  const attemptsByStep = {
    ...state.attemptsByStep,
    [currentStep]: (state.attemptsByStep[currentStep] ?? 0) + 1,
  };
  const totalLoops = state.totalLoops + 1;

  events.push(
    createGddTelemetryEvent({
      event: 'gdd_step_started',
      sessionId: state.sessionId,
      topic: state.topic,
      level: state.level,
      currentStep,
      payload: { step: currentStep, attempt: attemptsByStep[currentStep] },
    }),
  );

  const evaluation = evaluateStep(currentStep, stepInput);
  const weakConcepts = Array.from(new Set([...(state.weakConcepts ?? []), ...(stepInput.weakConcepts ?? [])]));

  events.push(
    createGddTelemetryEvent({
      event: 'gdd_step_scored',
      sessionId: state.sessionId,
      topic: state.topic,
      level: state.level,
      currentStep,
      payload: {
        step: currentStep,
        score: evaluation.score,
        accuracyPct: evaluation.accuracyPct,
        hintCount: evaluation.hintCount,
        confidenceSelf: evaluation.confidenceSelf,
      },
    }),
  );

  if (totalLoops > MAX_TOTAL_LOOPS || attemptsByStep[currentStep] > MAX_PER_STEP_ATTEMPTS) {
    const terminal = toTerminalNeedsReinforcement(state, weakConcepts);
    events.push(
      createGddTelemetryEvent({
        event: 'gdd_session_needs_reinforcement',
        sessionId: state.sessionId,
        topic: state.topic,
        level: state.level,
        currentStep,
        payload: {
          totalLoops,
          weakConcepts,
          nextDueAt: terminal.retrievalCheckpoint.dueAt[0],
        },
      }),
    );
    return { state: terminal, events };
  }

  const decision = decideNextStep(state, evaluation.score, evaluation.overconfident, weakConcepts);

  const completedSteps = state.completedSteps.includes(currentStep) ? state.completedSteps : [...state.completedSteps, currentStep];
  const stepStatus = { ...state.stepStatus, [currentStep]: 'completed' as const, [decision.toStep]: 'running' as const };

  let nextState: GuidedDeepDiveSessionState = {
    ...state,
    status: 'running',
    currentStep: decision.toStep,
    completedSteps,
    stepStatus,
    attemptsByStep,
    masteryScoreByStep: { ...state.masteryScoreByStep, [currentStep]: evaluation.score },
    weakConcepts,
    adaptiveMode: currentStep === 'diagnose-gap' ? nextAdaptiveMode(evaluation.score) : state.adaptiveMode,
    totalLoops,
    updatedAt: now,
  };

  events.push(
    createGddTelemetryEvent({
      event: 'gdd_branch_taken',
      sessionId: state.sessionId,
      topic: state.topic,
      level: state.level,
      currentStep,
      payload: decision,
    }),
  );

  if (currentStep === 'active-recall') {
    events.push(
      createGddTelemetryEvent({
        event: 'gdd_checkpoint_recorded',
        sessionId: state.sessionId,
        topic: state.topic,
        level: state.level,
        currentStep,
        payload: { checkpoint: 'retrieval-1', score: evaluation.score },
      }),
    );
  }

  if (currentStep === 'reflection' && evaluation.score >= 70) {
    nextState = {
      ...nextState,
      status: 'completed',
      currentStep: 'reflection',
      retrievalCheckpoint: initializeRetrievalCheckpoint(),
    };

    events.push(
      createGddTelemetryEvent({
        event: 'gdd_checkpoint_recorded',
        sessionId: state.sessionId,
        topic: state.topic,
        level: state.level,
        currentStep: 'reflection',
        payload: { checkpoint: 'retrieval-2', score: evaluation.score },
      }),
      createGddTelemetryEvent({
        event: 'gdd_retrieval_schedule_created',
        sessionId: state.sessionId,
        topic: state.topic,
        level: state.level,
        currentStep: 'reflection',
        payload: {
          intervals: nextState.retrievalCheckpoint.intervalDays,
          dueAt: nextState.retrievalCheckpoint.dueAt,
          easeFactor: nextState.retrievalCheckpoint.easeFactor,
          reviewCount: nextState.retrievalCheckpoint.reviewCount,
        },
      }),
      createGddTelemetryEvent({
        event: 'gdd_session_completed',
        sessionId: state.sessionId,
        topic: state.topic,
        level: state.level,
        currentStep: 'reflection',
        payload: {
          totalMinutes: Math.round((stepInput.elapsedSec ?? 0) / 60),
          totalLoops,
          finalMasteryScore: evaluation.score,
          status: 'completed',
        },
      }),
    );
  }

  return { state: nextState, events };
}

export function isValidGuidedDeepDiveStep(step: string): step is GuidedDeepDiveStep {
  return (GUIDED_DEEP_DIVE_STEPS as readonly string[]).includes(step);
}
