export type AtomScopeStrategy = 'per-channel-peer' | 'per-account-channel-peer';

export type AtomScopeInput = {
  userId?: string | null;
  accountId?: string | null;
  channel?: string | null;
  peerId?: string | null;
  peer?: string | null;
  strategy?: AtomScopeStrategy;
};

const FALLBACK = 'unknown';

function normalizePart(value?: string | null, fallback = FALLBACK): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return fallback;
  const sanitized = trimmed.replace(/[^a-z0-9._:-]/g, '_').replace(/_+/g, '_').slice(0, 64);
  return sanitized || fallback;
}

function resolveStrategy(explicit?: AtomScopeStrategy): AtomScopeStrategy {
  if (explicit) return explicit;
  return process.env.ATOM_SCOPE_STRATEGY === 'per-account-channel-peer'
    ? 'per-account-channel-peer'
    : 'per-channel-peer';
}

export function deriveAtomUserScopeKey(input: AtomScopeInput): string {
  const strategy = resolveStrategy(input.strategy);
  const account = normalizePart(input.accountId, 'anon');
  const channel = normalizePart(input.channel, 'web');
  const peer = normalizePart(input.peerId ?? input.peer ?? input.userId, 'self');

  if (strategy === 'per-account-channel-peer') {
    return `acct:${account}:chan:${channel}:peer:${peer}`;
  }

  return `chan:${channel}:peer:${peer}`;
}

export function deriveAtomThreadIdForScope(scopeKey: string): string {
  return `scope:${normalizePart(scopeKey, 'chan:web:peer:self')}`;
}

export function isCanonicalScopeThreadId(threadId?: string | null): boolean {
  if (typeof threadId !== 'string') return false;
  return threadId.startsWith('scope:') && threadId.length > 6;
}

export function sanitizeScopeKeyForPath(scopeKey: string): string {
  return normalizePart(scopeKey, 'chan:web:peer:self');
}
