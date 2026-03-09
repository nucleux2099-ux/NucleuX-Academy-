import type { GuidedDeepDiveStep } from '@/lib/atom/guided-deep-dive/session-state';
import type { ScoreBand, StepEvaluation, StepAdvanceInput } from '@/lib/atom/guided-deep-dive/runtime-types';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function confidenceTarget(confidenceSelf: number): number {
  return clamp(confidenceSelf, 1, 5) * 20;
}

export function getScoreBand(score: number): ScoreBand {
  if (score >= 80) return 'strong';
  if (score >= 60) return 'borderline';
  return 'weak';
}

function computeAdjustedScore(input: StepAdvanceInput, weight: number): StepEvaluation {
  const accuracyPct = clamp(Math.round(input.accuracyPct), 0, 100);
  const hintCount = Math.max(0, Math.round(input.hintCount));
  const avgResponseSec = Math.max(0, Math.round(input.avgResponseSec));
  const confidenceSelf = clamp(Math.round(input.confidenceSelf), 1, 5);

  const hintPenalty = Math.min(20, hintCount * 5);
  const overconfident = confidenceSelf >= 4 && accuracyPct < 60;
  const underconfident = confidenceSelf <= 2 && accuracyPct >= 80;
  const calibrationPenalty = overconfident ? 10 : underconfident ? 5 : 0;
  const latencyPenalty = avgResponseSec > 90 ? 10 : avgResponseSec > 45 ? 5 : 0;

  const weightedAccuracy = Math.round(accuracyPct * weight);
  const score = clamp(weightedAccuracy - hintPenalty - calibrationPenalty - latencyPenalty, 0, 100);

  return {
    score,
    accuracyPct,
    hintCount,
    avgResponseSec,
    confidenceSelf,
    confidenceGap: Math.abs(accuracyPct - confidenceTarget(confidenceSelf)),
    overconfident,
    underconfident,
    band: getScoreBand(score),
  };
}

const STEP_WEIGHTS: Record<GuidedDeepDiveStep, number> = {
  'diagnose-gap': 1,
  'atomic-explain': 1,
  'active-recall': 1,
  'clinical-application': 1,
  reflection: 1,
};

export function evaluateStep(step: GuidedDeepDiveStep, input: StepAdvanceInput): StepEvaluation {
  return computeAdjustedScore(input, STEP_WEIGHTS[step]);
}
