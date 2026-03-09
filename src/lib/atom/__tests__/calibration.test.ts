import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCalibrationSummary, deriveFeedbackScore } from '@/lib/atom/calibration';
import type { TelemetrySummary } from '@/lib/atom/telemetry-metrics';

const summary: TelemetrySummary = {
  window: '24h',
  range: { from: new Date().toISOString(), to: new Date().toISOString() },
  scopeKey: 'scope:a',
  overall: { events: 10, p95LatencyMs: 1200, failureRate: 0.1, fallbackHitRate: 0.1 },
  quality: { continuityScore: 0.8, groundingScore: 0.7, isolationScore: 1, personalizationScore: 0.6 },
  routes: [],
};

test('feedback score combines rating sentiment and resolution', () => {
  const score = deriveFeedbackScore([
    { sentiment: 'positive', rating: 5, resolved: true, classification: 'good' },
    { sentiment: 'negative', rating: 2, resolved: false, classification: 'bad' },
  ]);
  assert.equal(score > 0 && score < 1, true);
});

test('calibration summary returns weighted score and trend', () => {
  const out = buildCalibrationSummary({
    scopeKey: 'scope:a',
    window: '7d',
    current: summary,
    previous: { ...summary, quality: { ...summary.quality, groundingScore: 0.9 } },
    feedback: [{ sentiment: 'positive', rating: 5, resolved: true, classification: 'good' }],
  });

  assert.equal(out.scopeKey, 'scope:a');
  assert.equal(out.window, '7d');
  assert.equal(typeof out.weightedScore, 'number');
  assert.equal(['up', 'down', 'flat'].includes(out.trend), true);
});
