export type AtomScopeInput = {
  userId?: string | null;
  accountId?: string | null;
  channel?: string | null;
  peer?: string | null;
};

const FALLBACK = 'unknown';

function normalizePart(value?: string | null, fallback = FALLBACK): string {
  if (typeof value !== 'string') return fallback;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return fallback;
  return trimmed.replace(/[^a-z0-9._:-]/g, '_');
}

export function deriveAtomUserScopeKey(input: AtomScopeInput): string {
  const account = normalizePart(input.accountId, 'anon');
  const channel = normalizePart(input.channel, 'web');
  const peer = normalizePart(input.peer ?? input.userId, 'self');

  if (account !== 'anon') {
    return `${account}:${channel}:${peer}`;
  }

  return `${channel}:${peer}`;
}

export function deriveAtomThreadIdForScope(scopeKey: string): string {
  return `scope:${normalizePart(scopeKey, 'web:self')}`;
}
