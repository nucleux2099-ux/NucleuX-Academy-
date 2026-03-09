import type { TelemetrySummary } from '@/lib/atom/telemetry-metrics';

export type AtomTelemetryAlert = {
  kind: 'failure_rate_spike' | 'fallback_rate_spike' | 'grounding_score_drop' | 'security_anomaly';
  severity: 'warning' | 'critical';
  metricValue: number;
  thresholdValue: number;
  metadata?: Record<string, unknown>;
};

const DEFAULT_THRESHOLDS = {
  failureRateSpike: 0.15,
  fallbackRateSpike: 0.25,
  groundingScoreDrop: 0.6,
  securityAnomalyCount: 1,
};

export function evaluateAlerts(params: {
  current: TelemetrySummary;
  previous?: TelemetrySummary;
  securityAnomalies?: number;
}): AtomTelemetryAlert[] {
  const out: AtomTelemetryAlert[] = [];
  const { current } = params;

  if (current.overall.failureRate >= DEFAULT_THRESHOLDS.failureRateSpike) {
    out.push({
      kind: 'failure_rate_spike',
      severity: current.overall.failureRate >= DEFAULT_THRESHOLDS.failureRateSpike * 1.5 ? 'critical' : 'warning',
      metricValue: current.overall.failureRate,
      thresholdValue: DEFAULT_THRESHOLDS.failureRateSpike,
    });
  }

  if (current.overall.fallbackHitRate >= DEFAULT_THRESHOLDS.fallbackRateSpike) {
    out.push({
      kind: 'fallback_rate_spike',
      severity: current.overall.fallbackHitRate >= DEFAULT_THRESHOLDS.fallbackRateSpike * 1.5 ? 'critical' : 'warning',
      metricValue: current.overall.fallbackHitRate,
      thresholdValue: DEFAULT_THRESHOLDS.fallbackRateSpike,
    });
  }

  const baselineGrounding = params.previous?.quality.groundingScore ?? 1;
  const groundingDrop = baselineGrounding - current.quality.groundingScore;
  if (current.quality.groundingScore < DEFAULT_THRESHOLDS.groundingScoreDrop || groundingDrop > 0.2) {
    out.push({
      kind: 'grounding_score_drop',
      severity: current.quality.groundingScore < 0.45 ? 'critical' : 'warning',
      metricValue: current.quality.groundingScore,
      thresholdValue: DEFAULT_THRESHOLDS.groundingScoreDrop,
      metadata: { baselineGrounding },
    });
  }

  const anomalies = params.securityAnomalies ?? 0;
  if (anomalies >= DEFAULT_THRESHOLDS.securityAnomalyCount) {
    out.push({
      kind: 'security_anomaly',
      severity: anomalies >= 3 ? 'critical' : 'warning',
      metricValue: anomalies,
      thresholdValue: DEFAULT_THRESHOLDS.securityAnomalyCount,
    });
  }

  return out;
}
