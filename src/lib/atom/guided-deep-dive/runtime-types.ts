import type { GuidedDeepDiveStep } from '@/lib/atom/guided-deep-dive/session-state';

export type AdaptiveMode = 'remedial' | 'standard' | 'fast';

export type ScoreBand = 'strong' | 'borderline' | 'weak';

export type StepEvaluation = {
  score: number;
  accuracyPct: number;
  hintCount: number;
  avgResponseSec: number;
  confidenceSelf: number;
  confidenceGap: number;
  overconfident: boolean;
  underconfident: boolean;
  band: ScoreBand;
};

export type BranchDecisionReason = ScoreBand | 'loop-cap' | 'calibrated-strong';

export type BranchDecision = {
  fromStep: GuidedDeepDiveStep;
  toStep: GuidedDeepDiveStep;
  reason: BranchDecisionReason;
  weakConcepts: string[];
};

export type StepAdvanceInput = {
  accuracyPct: number;
  hintCount: number;
  avgResponseSec: number;
  confidenceSelf: number;
  weakConcepts?: string[];
  elapsedSec?: number;
  answerText?: string;
};
