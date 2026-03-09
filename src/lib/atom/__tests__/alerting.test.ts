import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAlertDedupeKey, evaluateAlerts, shouldEmitAlert } from '@/lib/atom/alerting';
import type { TelemetrySummary } from '@/lib/atom/telemetry-metrics';

const base: TelemetrySummary = {
  window: '24h',
  range: { from: new Date().toISOString(), to: new Date().toISOString() },
  scopeKey: 'scope:a',
  overall: { events: 20, p95LatencyMs: 1000, failureRate: 0.2, fallbackHitRate: 0.3 },
  quality: { continuityScore: 0.8, groundingScore: 0.4, isolationScore: 0.9, personalizationScore: 0.7 },
  routes: [],
};

test('alert evaluator triggers expected alert kinds', () => {
  const alerts = evaluateAlerts({
    current: base,
    previous: { ...base, quality: { ...base.quality, groundingScore: 0.9 } },
    securityAnomalies: 2,
  });

  const kinds = alerts.map((a) => a.kind);
  assert.equal(kinds.includes('failure_rate_spike'), true);
  assert.equal(kinds.includes('fallback_rate_spike'), true);
  assert.equal(kinds.includes('grounding_score_drop'), true);
  assert.equal(kinds.includes('security_anomaly'), true);
});

test('alert dedupe key uses scope + kind + hourly bucket', () => {
  const key = buildAlertDedupeKey('scope:a', 'failure_rate_spike', new Date('2026-03-09T10:27:00.000Z'));
  assert.equal(key, 'scope:a:failure_rate_spike:2026-03-09T10:00:00.000Z');
});

test('cooldown blocks repeated alert kind in active window', () => {
  const now = new Date('2026-03-09T10:40:00.000Z');
  const allowed = shouldEmitAlert(
    { kind: 'failure_rate_spike', severity: 'warning', metricValue: 0.2, thresholdValue: 0.15 },
    now,
    [{ kind: 'failure_rate_spike', ts: '2026-03-09T10:25:00.000Z' }],
  );
  assert.equal(allowed, false);
});
