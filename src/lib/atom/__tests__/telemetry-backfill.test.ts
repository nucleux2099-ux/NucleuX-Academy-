import test from 'node:test';
import assert from 'node:assert/strict';
import { dedupeByEventId, backfillInsertCount } from '@/lib/atom/telemetry-backfill';
import type { AtomTelemetryEvent } from '@/lib/atom/telemetry';

const e = (id: string): AtomTelemetryEvent => ({
  eventId: id,
  eventName: 'request.lifecycle',
  ts: new Date().toISOString(),
  scopeKey: 'scope:a',
  route: '/api/test',
  mode: 'chat',
  latencyMs: 1,
  status: 'ok',
  metadata: {},
});

test('backfill dedupe removes duplicate eventIds', () => {
  const out = dedupeByEventId([e('1'), e('1'), e('2')]);
  assert.equal(out.unique.length, 2);
  assert.equal(out.deduped, 1);
});

test('backfill dry-run reports insert count without DB writes', () => {
  const items = [e('1'), e('2')];
  assert.equal(backfillInsertCount(items, true), 2);
});
