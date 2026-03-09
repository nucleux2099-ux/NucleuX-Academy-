import type { TelemetrySummary } from '@/lib/atom/telemetry-metrics';

export type AtomTelemetryAlertKind = 'failure_rate_spike' | 'fallback_rate_spike' | 'grounding_score_drop' | 'security_anomaly';

export type AtomTelemetryAlert = {
  kind: AtomTelemetryAlertKind;
  severity: 'warning' | 'critical';
  metricValue: number;
  thresholdValue: number;
  metadata?: Record<string, unknown>;
};

export type AlertCooldownRecord = {
  kind: AtomTelemetryAlertKind;
  ts: string;
};

const DEFAULT_THRESHOLDS = {
  failureRateSpike: 0.15,
  fallbackRateSpike: 0.25,
  groundingScoreDrop: 0.6,
  securityAnomalyCount: 1,
};

const ALERT_COOLDOWN_MS: Record<AtomTelemetryAlertKind, number> = {
  failure_rate_spike: 30 * 60 * 1000,
  fallback_rate_spike: 30 * 60 * 1000,
  grounding_score_drop: 45 * 60 * 1000,
  security_anomaly: 15 * 60 * 1000,
};

export function alertTimeBucket(ts: Date): string {
  const d = new Date(ts);
  d.setUTCMinutes(0, 0, 0);
  return d.toISOString();
}

export function buildAlertDedupeKey(scopeKey: string, kind: AtomTelemetryAlertKind, ts = new Date()): string {
  return `${scopeKey}:${kind}:${alertTimeBucket(ts)}`;
}

export function shouldEmitAlert(alert: AtomTelemetryAlert, now: Date, recentAlerts: AlertCooldownRecord[]): boolean {
  const cooldown = ALERT_COOLDOWN_MS[alert.kind];
  const threshold = now.getTime() - cooldown;
  return !recentAlerts.some((a) => a.kind === alert.kind && new Date(a.ts).getTime() >= threshold);
}

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
