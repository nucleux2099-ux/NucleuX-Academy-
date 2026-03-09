import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateAlerts } from '@/lib/atom/alerting';
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
