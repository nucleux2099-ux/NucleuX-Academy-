#!/usr/bin/env tsx
import fs from 'node:fs';
import readline from 'node:readline';
import { createClient } from '@supabase/supabase-js';
import { sanitizeMetadata, type AtomTelemetryEvent } from '@/lib/atom/telemetry';

function arg(name: string, fallback?: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] ?? fallback;
}

async function main() {
  const file = arg('file');
  const dryRun = process.argv.includes('--dry-run');
  if (!file) throw new Error('Usage: tsx scripts/atom-telemetry-backfill.ts --file <telemetry.ndjson> [--dry-run]');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const stream = fs.createReadStream(file, 'utf8');
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let total = 0;
  let parsed = 0;
  let deduped = 0;
  let inserted = 0;
  const seen = new Set<string>();
  const batch: AtomTelemetryEvent[] = [];

  for await (const line of rl) {
    total += 1;
    if (!line.trim()) continue;
    try {
      const event = JSON.parse(line) as AtomTelemetryEvent;
      if (!event.eventId || seen.has(event.eventId)) {
        deduped += 1;
        continue;
      }
      seen.add(event.eventId);
      batch.push({ ...event, metadata: sanitizeMetadata((event.metadata ?? {}) as Record<string, unknown>) });
      parsed += 1;
    } catch {
      // skip malformed rows
    }

    if (batch.length >= 250) {
      inserted += await flush(batch, dryRun, supabase);
      batch.length = 0;
    }
  }

  if (batch.length > 0) inserted += await flush(batch, dryRun, supabase);

  console.log(JSON.stringify({ kind: 'atom.telemetry.backfill.report.v1', file, dryRun, total, parsed, deduped, inserted }, null, 2));
}

async function flush(batch: AtomTelemetryEvent[], dryRun: boolean, supabase: unknown): Promise<number> {
  if (dryRun) return batch.length;

  const payload = batch.map((event) => ({
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
  }));

  const client = supabase as { from: (table: string) => { upsert: (rows: unknown, opts: { onConflict: string; ignoreDuplicates: boolean }) => PromiseLike<{ error: { message?: string } | null }> } };
  const { error } = await client.from('atom_telemetry_events').upsert(payload, { onConflict: 'event_id', ignoreDuplicates: true });
  if (error) throw new Error(error.message ?? 'Backfill upsert failed');
  return payload.length;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
