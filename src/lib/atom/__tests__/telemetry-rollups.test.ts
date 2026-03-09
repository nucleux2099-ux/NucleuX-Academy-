import test from 'node:test';
import assert from 'node:assert/strict';
import { bucketEvents } from '@/lib/atom/telemetry-rollups';
import type { AtomTelemetryEvent } from '@/lib/atom/telemetry';

const mk = (ts: string): AtomTelemetryEvent => ({
  eventId: crypto.randomUUID(),
  eventName: 'request.lifecycle',
  ts,
  scopeKey: 'scope:a',
  route: '/api/test',
  mode: 'chat',
  latencyMs: 10,
  status: 'ok',
  metadata: {},
});

test('bucketEvents groups by hour/day correctly', () => {
  const events = [
    mk('2026-03-09T10:01:00.000Z'),
    mk('2026-03-09T10:45:00.000Z'),
    mk('2026-03-09T11:10:00.000Z'),
  ];

  const hourly = bucketEvents(events, 'hour');
  const daily = bucketEvents(events, 'day');

  assert.equal(hourly.size, 2);
  assert.equal(daily.size, 1);
});
