import test from 'node:test';
import assert from 'node:assert/strict';
import { isValidFeedbackType } from '@/lib/atom/feedback';
import { resolveScopeAccess } from '@/lib/atom/telemetry-access';

function req(headers: Record<string, string> = {}) {
  return {
    headers: {
      get(key: string) {
        return headers[key.toLowerCase()] ?? null;
      },
    },
  } as never;
}

test('feedback validation accepts only known taxonomy', () => {
  assert.equal(isValidFeedbackType('rating'), true);
  assert.equal(isValidFeedbackType('correction'), true);
  assert.equal(isValidFeedbackType('bad_type'), false);
  assert.equal(isValidFeedbackType(42), false);
});

test('scope access blocks cross-scope reads without admin key', () => {
  assert.throws(() => resolveScopeAccess({ request: req(), userId: 'u1', requestedScope: 'scope:other' } as never), /Forbidden scope access/);
});

test('scope access allows cross-scope reads with admin key', () => {
  process.env.ATOM_ADMIN_KEY = 'secret';
  const result = resolveScopeAccess({ request: req({ 'x-atom-admin-key': 'secret' }), userId: 'u1', requestedScope: 'scope:other' } as never);
  assert.equal(result.scopeKey, 'scope:other');
});
