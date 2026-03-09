import type { NextRequest } from 'next/server';
import { deriveAtomUserScopeKey, type AtomScopeInput } from '@/lib/atom/user-scope';

export type AtomScopeEnvelope = {
  accountId?: string;
  channel: string;
  peer: string;
};

function isStrictScopeModeEnabled() {
  return process.env.ATOM_SCOPE_STRICT_MODE === 'true';
}

function getRequiredFieldsForStrategy(): Array<keyof AtomScopeEnvelope> {
  if (process.env.ATOM_SCOPE_STRATEGY === 'per-account-channel-peer') {
    return ['accountId', 'channel', 'peer'];
  }
  return ['channel', 'peer'];
}

function fromHeaders(request: Pick<NextRequest, 'headers'>): Partial<AtomScopeEnvelope> {
  return {
    accountId: request.headers.get('x-atom-account-id') ?? undefined,
    channel: request.headers.get('x-atom-channel') ?? undefined,
    peer: request.headers.get('x-atom-peer') ?? undefined,
  };
}

function normalizeEnvelope(input?: Partial<AtomScopeEnvelope> | null): Partial<AtomScopeEnvelope> {
  if (!input || typeof input !== 'object') return {};
  return {
    accountId: typeof input.accountId === 'string' ? input.accountId : undefined,
    channel: typeof input.channel === 'string' ? input.channel : undefined,
    peer: typeof input.peer === 'string' ? input.peer : undefined,
  };
}

export function resolveAtomScopeKeyForRequest(params: {
  request: Pick<NextRequest, 'headers'>;
  userId: string;
  envelope?: Partial<AtomScopeEnvelope> | null;
  fallback?: Partial<AtomScopeEnvelope> | null;
}): { scopeKey: string; envelope: AtomScopeEnvelope; strict: boolean } {
  const strict = isStrictScopeModeEnabled();
  const explicitEnvelope = normalizeEnvelope(params.envelope);
  const fallback = normalizeEnvelope(params.fallback);
  const headers = fromHeaders(params.request);

  const merged: Partial<AtomScopeEnvelope> = {
    accountId: explicitEnvelope.accountId ?? headers.accountId ?? fallback.accountId,
    channel: explicitEnvelope.channel ?? headers.channel ?? fallback.channel,
    peer: explicitEnvelope.peer ?? headers.peer ?? fallback.peer,
  };

  if (strict) {
    const required = getRequiredFieldsForStrategy();
    const missing = required.filter((field) => typeof merged[field] !== 'string' || !String(merged[field]).trim());
    if (missing.length > 0) {
      throw new Error(`Strict scope mode: missing explicit scope envelope fields: ${missing.join(',')}`);
    }
  }

  const channel = merged.channel ?? 'web';
  const peer = merged.peer ?? params.userId;

  const scopeInput: AtomScopeInput = {
    userId: params.userId,
    accountId: merged.accountId,
    channel,
    peerId: peer,
  };

  return {
    scopeKey: deriveAtomUserScopeKey(scopeInput),
    envelope: {
      accountId: merged.accountId,
      channel,
      peer,
    },
    strict,
  };
}
