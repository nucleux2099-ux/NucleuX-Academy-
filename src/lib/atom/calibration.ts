import type { TelemetrySummary } from '@/lib/atom/telemetry-metrics';

export type FeedbackRow = {
  sentiment: 'positive' | 'negative' | 'neutral' | null;
  rating: number | null;
  resolved: boolean | null;
  classification: string | null;
};

export type CalibrationSummary = {
  scopeKey: string;
  window: '24h' | '7d' | '30d';
  counts: {
    feedback: number;
    positive: number;
    negative: number;
    resolved: number;
  };
  feedbackScore: number;
  proxyQualityScore: number;
  weightedScore: number;
  trend: 'up' | 'down' | 'flat';
  dimensions: {
    continuity: number;
    grounding: number;
    personalization: number;
    operational: number;
  };
};

function clamp(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Number(value.toFixed(4));
}

export function deriveFeedbackScore(feedback: FeedbackRow[]): number {
  if (feedback.length === 0) return 0.5;
  const rated = feedback.filter((f) => typeof f.rating === 'number' && (f.rating ?? 0) >= 1 && (f.rating ?? 0) <= 5);
  const ratingScore = rated.length > 0 ? rated.reduce((s, f) => s + ((f.rating ?? 3) - 1) / 4, 0) / rated.length : 0.5;

  const pos = feedback.filter((f) => f.sentiment === 'positive').length;
  const neg = feedback.filter((f) => f.sentiment === 'negative').length;
  const sentimentScore = feedback.length > 0 ? (pos + 0.5 * (feedback.length - pos - neg)) / feedback.length : 0.5;

  const resolvedSet = feedback.filter((f) => f.resolved !== null);
  const resolvedScore = resolvedSet.length > 0 ? resolvedSet.filter((f) => f.resolved === true).length / resolvedSet.length : 0.5;

  return clamp(ratingScore * 0.5 + sentimentScore * 0.3 + resolvedScore * 0.2);
}

export function deriveProxyQualityScore(summary: TelemetrySummary): number {
  const operational = 1 - (summary.overall.failureRate * 0.65 + summary.overall.fallbackHitRate * 0.35);
  return clamp(
    summary.quality.continuityScore * 0.3
      + summary.quality.groundingScore * 0.3
      + summary.quality.personalizationScore * 0.2
      + clamp(operational) * 0.2,
  );
}

export function buildCalibrationSummary(input: {
  scopeKey: string;
  window: '24h' | '7d' | '30d';
  current: TelemetrySummary;
  previous?: TelemetrySummary;
  feedback: FeedbackRow[];
}): CalibrationSummary {
  const feedbackScore = deriveFeedbackScore(input.feedback);
  const proxyQualityScore = deriveProxyQualityScore(input.current);
  const weightedScore = clamp(proxyQualityScore * 0.7 + feedbackScore * 0.3);

  const previousWeighted = input.previous
    ? clamp(deriveProxyQualityScore(input.previous) * 0.7 + feedbackScore * 0.3)
    : weightedScore;

  const delta = weightedScore - previousWeighted;
  const trend: 'up' | 'down' | 'flat' = delta > 0.02 ? 'up' : delta < -0.02 ? 'down' : 'flat';

  return {
    scopeKey: input.scopeKey,
    window: input.window,
    counts: {
      feedback: input.feedback.length,
      positive: input.feedback.filter((f) => f.sentiment === 'positive').length,
      negative: input.feedback.filter((f) => f.sentiment === 'negative').length,
      resolved: input.feedback.filter((f) => f.resolved === true).length,
    },
    feedbackScore,
    proxyQualityScore,
    weightedScore,
    trend,
    dimensions: {
      continuity: input.current.quality.continuityScore,
      grounding: input.current.quality.groundingScore,
      personalization: input.current.quality.personalizationScore,
      operational: clamp(1 - (input.current.overall.failureRate * 0.65 + input.current.overall.fallbackHitRate * 0.35)),
    },
  };
}
