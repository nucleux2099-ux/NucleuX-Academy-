import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';

function req(headers: Record<string, string> = {}) {
  return {
    headers: {
      get(key: string) {
        return headers[key.toLowerCase()] ?? null;
      },
    },
  } as never;
}

test('route scope resolution isolates mixed account/channel/peer collisions', () => {
  process.env.ATOM_SCOPE_STRATEGY = 'per-account-channel-peer';
  process.env.ATOM_SCOPE_STRICT_MODE = 'false';

  const base = { userId: 'auth-user-1', request: req() };
  const k1 = resolveAtomScopeKeyForRequest({ ...base, envelope: { accountId: 'main', channel: 'telegram', peer: '442382255' } }).scopeKey;
  const k2 = resolveAtomScopeKeyForRequest({ ...base, envelope: { accountId: 'main', channel: 'telegram', peer: '433999465' } }).scopeKey;
  const k3 = resolveAtomScopeKeyForRequest({ ...base, envelope: { accountId: 'alt', channel: 'telegram', peer: '442382255' } }).scopeKey;
  const k4 = resolveAtomScopeKeyForRequest({ ...base, envelope: { accountId: 'main', channel: 'whatsapp', peer: '442382255' } }).scopeKey;

  assert.notEqual(k1, k2);
  assert.notEqual(k1, k3);
  assert.notEqual(k1, k4);
});

test('route strict mode rejects ambiguous identity envelope', () => {
  process.env.ATOM_SCOPE_STRICT_MODE = 'true';
  process.env.ATOM_SCOPE_STRATEGY = 'per-account-channel-peer';

  assert.throws(
    () => resolveAtomScopeKeyForRequest({ userId: 'auth-user-1', request: req(), envelope: { channel: 'telegram', peer: '442382255' } }),
    /missing explicit scope envelope fields: accountId/i,
  );
});
