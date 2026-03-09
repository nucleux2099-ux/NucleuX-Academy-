import type { GuidedDeepDiveSessionState } from '@/lib/atom/guided-deep-dive/session-state';
import type { GddTelemetryEvent } from '@/lib/atom/guided-deep-dive/telemetry';

type StoredSession = {
  session: GuidedDeepDiveSessionState;
  events: GddTelemetryEvent[];
};

const gddSessions = new Map<string, StoredSession>();

export function putGuidedDeepDiveSession(session: GuidedDeepDiveSessionState, events: GddTelemetryEvent[] = []): StoredSession {
  const stored = { session, events };
  gddSessions.set(session.sessionId, stored);
  return stored;
}

export function getGuidedDeepDiveSession(sessionId: string): StoredSession | null {
  return gddSessions.get(sessionId) ?? null;
}

export function appendGuidedDeepDiveEvents(sessionId: string, events: GddTelemetryEvent[]): StoredSession | null {
  const existing = gddSessions.get(sessionId);
  if (!existing) return null;

  const updated = {
    session: existing.session,
    events: [...existing.events, ...events],
  };

  gddSessions.set(sessionId, updated);
  return updated;
}

export function updateGuidedDeepDiveSession(session: GuidedDeepDiveSessionState): StoredSession | null {
  const existing = gddSessions.get(session.sessionId);
  if (!existing) return null;

  const updated = {
    session,
    events: existing.events,
  };

  gddSessions.set(session.sessionId, updated);
  return updated;
}
