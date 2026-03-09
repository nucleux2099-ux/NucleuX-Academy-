import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deriveAtomThreadIdForScope,
  deriveAtomUserScopeKey,
  isCanonicalScopeThreadId,
  sanitizeScopeKeyForPath,
} from '@/lib/atom/user-scope';

test('deriveAtomUserScopeKey defaults to per-channel-peer', () => {
  const key = deriveAtomUserScopeKey({ channel: 'TeLeGram', peerId: '442382255' });
  assert.equal(key, 'chan:telegram:peer:442382255');
});

test('deriveAtomUserScopeKey supports per-account-channel-peer strategy', () => {
  const key = deriveAtomUserScopeKey({
    accountId: 'Primary Account',
    channel: 'telegram',
    peerId: '442382255',
    strategy: 'per-account-channel-peer',
  });
  assert.equal(key, 'acct:primary_account:chan:telegram:peer:442382255');
});

test('scope derivation sanitizes unsafe characters', () => {
  const key = deriveAtomUserScopeKey({ channel: '../Web', peerId: 'User/42' });
  assert.equal(key, 'chan:.._web:peer:user_42');
  assert.equal(sanitizeScopeKeyForPath('../../evil'), '.._.._evil');
});

test('thread id is canonical and namespaced', () => {
  const scopeKey = 'chan:web:peer:abc';
  const threadId = deriveAtomThreadIdForScope(scopeKey);
  assert.equal(threadId, 'scope:chan:web:peer:abc');
  assert.equal(isCanonicalScopeThreadId(threadId), true);
  assert.equal(isCanonicalScopeThreadId('legacy-thread-1'), false);
});
