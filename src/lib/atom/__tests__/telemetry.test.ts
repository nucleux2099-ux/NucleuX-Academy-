import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeMetadata, validateTelemetryEvent } from '@/lib/atom/telemetry';

test('sanitizeMetadata redacts sensitive keys', () => {
  const sanitized = sanitizeMetadata({
    message: 'hello',
    nested: { prompt: 'secret prompt', ok: true },
    email: 'a@b.com',
  });

  assert.equal(sanitized.message, '[redacted]');
  assert.equal((sanitized.nested as Record<string, unknown>).prompt, '[redacted]');
  assert.equal(sanitized.email, '[redacted]');
});

test('validateTelemetryEvent rejects negative latency', () => {
  assert.throws(() =>
    validateTelemetryEvent({
      eventId: crypto.randomUUID(),
      eventName: 'request.lifecycle',
      ts: new Date().toISOString(),
      scopeKey: 'scope:test',
      route: '/api/x',
      mode: 'chat',
      latencyMs: -1,
      status: 'ok',
      metadata: {},
    }),
  );
});
