import test from 'node:test';
import assert from 'node:assert/strict';
import { deriveTelemetrySummary } from '@/lib/atom/telemetry-metrics';

test('deriveTelemetrySummary computes continuity + operational metrics', () => {
  const now = new Date().toISOString();
  const summary = deriveTelemetrySummary({
    window: '24h',
    scopeKey: 'scope:a',
    from: now,
    to: now,
    events: [
      {
        eventId: crypto.randomUUID(),
        eventName: 'request.lifecycle',
        ts: now,
        scopeKey: 'scope:a',
        route: '/api/atom/session/1/continue',
        mode: 'continue',
        latencyMs: 100,
        status: 'ok',
        metadata: {},
      },
      {
        eventId: crypto.randomUUID(),
        eventName: 'retrieval.outcome',
        ts: now,
        scopeKey: 'scope:a',
        route: '/api/atom/session/1/message',
        mode: 'chat',
        latencyMs: 80,
        status: 'ok',
        metadata: { snippetCount: 2 },
      },
    ],
  });

  assert.equal(summary.quality.continuityScore, 1);
  assert.equal(summary.quality.groundingScore, 1);
  assert.equal(summary.overall.failureRate, 0);
});
