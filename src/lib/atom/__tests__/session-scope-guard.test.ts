import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveCanonicalThread } from '@/lib/atom/session-store';

test('resolveCanonicalThread returns canonical thread for scope', () => {
  const threadId = resolveCanonicalThread({ scopeKey: 'chan:web:peer:u1' });
  assert.equal(threadId, 'scope:chan:web:peer:u1');
});

test('resolveCanonicalThread rejects mismatched explicit threadId', () => {
  assert.throws(
    () => resolveCanonicalThread({ scopeKey: 'chan:web:peer:u1', threadId: 'scope:chan:web:peer:u2' }),
    /Scope guard violation/,
  );
});
