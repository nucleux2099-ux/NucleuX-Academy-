import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';

function makeRequest(headers: Record<string, string>) {
  return {
    headers: {
      get(key: string) {
        return headers[key.toLowerCase()] ?? null;
      },
    },
  } as never;
}

test('resolves explicit scope envelope in non-strict mode with fallback defaults', () => {
  process.env.ATOM_SCOPE_STRICT_MODE = 'false';
  const result = resolveAtomScopeKeyForRequest({
    request: makeRequest({}),
    userId: 'u1',
    envelope: { channel: 'telegram', peer: '442382255' },
  });

  assert.equal(result.scopeKey, 'chan:telegram:peer:442382255');
});

test('strict mode rejects missing envelope fields', () => {
  process.env.ATOM_SCOPE_STRICT_MODE = 'true';
  assert.throws(() =>
    resolveAtomScopeKeyForRequest({
      request: makeRequest({}),
      userId: 'u1',
      envelope: { channel: 'telegram' },
    }),
  /Strict scope mode/);
});

test('mixed account/channel/peer permutations derive unique scoped keys', () => {
  process.env.ATOM_SCOPE_STRICT_MODE = 'false';
  process.env.ATOM_SCOPE_STRATEGY = 'per-account-channel-peer';

  const a = resolveAtomScopeKeyForRequest({
    request: makeRequest({}),
    userId: 'u1',
    envelope: { accountId: 'acc-1', channel: 'telegram', peer: 'p1' },
  }).scopeKey;
  const b = resolveAtomScopeKeyForRequest({
    request: makeRequest({}),
    userId: 'u1',
    envelope: { accountId: 'acc-2', channel: 'telegram', peer: 'p1' },
  }).scopeKey;
  const c = resolveAtomScopeKeyForRequest({
    request: makeRequest({}),
    userId: 'u1',
    envelope: { accountId: 'acc-1', channel: 'whatsapp', peer: 'p1' },
  }).scopeKey;

  assert.notEqual(a, b);
  assert.notEqual(a, c);
});
