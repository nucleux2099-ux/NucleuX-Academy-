import test from 'node:test';
import assert from 'node:assert/strict';
import { AtomTelemetryLogger } from '@/lib/atom/telemetry';

test('logger falls back when primary sink fails', async () => {
  const writes: string[] = [];
  const logger = new AtomTelemetryLogger(
    { write: async () => { throw new Error('db down'); } },
    { write: async () => { writes.push('fallback'); } },
  );

  await logger.log({
    eventId: crypto.randomUUID(),
    eventName: 'request.lifecycle',
    ts: new Date().toISOString(),
    scopeKey: 'scope:a',
    route: '/api/test',
    mode: 'chat',
    latencyMs: 10,
    status: 'ok',
    metadata: { message: 'should redact' },
  });

  assert.equal(writes.length, 1);
});
