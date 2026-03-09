import fs from 'node:fs/promises';
import path from 'node:path';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getAtomWorkspaceRoot } from '@/lib/atom/user-workspace';

export type AtomTelemetryEventName =
  | 'request.lifecycle'
  | 'retrieval.outcome'
  | 'artifact.usage'
  | 'profile.decision'
  | 'policy.decision'
  | 'heartbeat.outcome'
  | 'feedback.submitted'
  | 'feedback.classified'
  | 'outcome.confirmed'
  | 'correction.recorded';

export type AtomTelemetryStatus = 'ok' | 'error' | 'skipped' | 'blocked';

export type AtomTelemetryEvent = {
  eventId: string;
  eventName: AtomTelemetryEventName;
  ts: string;
  scopeKey: string;
  actorUserId?: string;
  sessionId?: string;
  route: string;
  mode: string;
  latencyMs: number;
  status: AtomTelemetryStatus;
  reasonCode?: string;
  metadata: Record<string, unknown>;
};

const REDACT_KEYS = /(content|message|text|prompt|email|phone|token|secret|cookie|authorization)/i;

export function telemetryEnabled(): boolean {
  const value = (process.env.ATOM_TELEMETRY_ENABLED ?? 'true').toLowerCase();
  return ['1', 'true', 'yes', 'on'].includes(value);
}

function sanitizeValue(key: string, value: unknown, depth = 0): unknown {
  if (depth > 4) return '[truncated-depth]';
  if (REDACT_KEYS.test(key)) return '[redacted]';
  if (typeof value === 'string') {
    if (value.length > 240) return `${value.slice(0, 240)}…`;
    return value;
  }
  if (Array.isArray(value)) return value.slice(0, 20).map((v) => sanitizeValue(key, v, depth + 1));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = sanitizeValue(k, v, depth + 1);
    }
    return out;
  }
  return value;
}

export function sanitizeMetadata(metadata: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(metadata)) {
    out[k] = sanitizeValue(k, v);
  }
  return out;
}

export function validateTelemetryEvent(event: AtomTelemetryEvent): void {
  if (!event.eventId || !event.ts || !event.scopeKey || !event.route || !event.mode || !event.status || !event.eventName) {
    throw new Error('Invalid telemetry event: missing required fields');
  }
  if (!Number.isFinite(event.latencyMs) || event.latencyMs < 0) {
    throw new Error('Invalid telemetry event: latencyMs must be >= 0');
  }
}

type TelemetrySink = {
  write(event: AtomTelemetryEvent): Promise<void>;
};

class DbTelemetrySink implements TelemetrySink {
  constructor(private readonly supabase: SupabaseClient) {}

  async write(event: AtomTelemetryEvent): Promise<void> {
    await this.supabase.from('atom_telemetry_events').insert({
      event_id: event.eventId,
      event_name: event.eventName,
      ts: event.ts,
      scope_key: event.scopeKey,
      actor_user_id: event.actorUserId ?? null,
      session_id: event.sessionId ?? null,
      route: event.route,
      mode: event.mode,
      latency_ms: event.latencyMs,
      status: event.status,
      reason_code: event.reasonCode ?? null,
      metadata: event.metadata,
    });
  }
}

class FileTelemetrySink implements TelemetrySink {
  async write(event: AtomTelemetryEvent): Promise<void> {
    const file = path.join(getAtomWorkspaceRoot(event.scopeKey), 'memory', 'telemetry.ndjson');
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.appendFile(file, `${JSON.stringify(event)}\n`, 'utf8');
  }
}

export class AtomTelemetryLogger {
  constructor(private readonly primary: TelemetrySink, private readonly fallback: TelemetrySink = new FileTelemetrySink()) {}

  async log(eventInput: Omit<AtomTelemetryEvent, 'metadata'> & { metadata?: Record<string, unknown> }): Promise<void> {
    if (!telemetryEnabled()) return;

    const event: AtomTelemetryEvent = {
      ...eventInput,
      metadata: sanitizeMetadata(eventInput.metadata ?? {}),
    };
    validateTelemetryEvent(event);

    try {
      await this.primary.write(event);
    } catch {
      await this.fallback.write(event);
    }
  }
}

export function createAtomTelemetryLogger(supabase?: SupabaseClient): AtomTelemetryLogger {
  return new AtomTelemetryLogger(supabase ? new DbTelemetrySink(supabase) : new FileTelemetrySink());
}

export function startTimer() {
  const start = Date.now();
  return () => Date.now() - start;
}
