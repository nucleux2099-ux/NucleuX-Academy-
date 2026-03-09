import type { NextRequest } from 'next/server';
import { resolveAtomScopeKeyForRequest } from '@/lib/atom/scope-envelope';

export type SupportedWindow = '24h' | '7d' | '30d';

export function parseWindow(value: string | null | undefined): SupportedWindow {
  if (value === '7d' || value === '30d' || value === '24h') return value;
  return '24h';
}

export function windowStart(window: SupportedWindow): Date {
  const now = Date.now();
  if (window === '30d') return new Date(now - 30 * 24 * 60 * 60 * 1000);
  if (window === '7d') return new Date(now - 7 * 24 * 60 * 60 * 1000);
  return new Date(now - 24 * 60 * 60 * 1000);
}

export function resolveScopeAccess(params: {
  request: NextRequest;
  userId: string;
  requestedScope?: string | null;
}): { scopeKey: string; isGlobal: boolean } {
  const scope = resolveAtomScopeKeyForRequest({ request: params.request, userId: params.userId });
  const requested = params.requestedScope;
  if (!requested || requested === scope.scopeKey) {
    return { scopeKey: scope.scopeKey, isGlobal: false };
  }

  const adminKey = params.request.headers.get('x-atom-admin-key');
  if (!adminKey || adminKey !== process.env.ATOM_ADMIN_KEY) {
    throw new Error('Forbidden scope access');
  }

  return { scopeKey: requested, isGlobal: requested === 'global' || requested === '*' };
}
