import type { AtomTelemetryEvent } from '@/lib/atom/telemetry';

export type TelemetryBackfillCheckpoint = {
  line: number;
  inserted: number;
  deduped: number;
  malformed: number;
  updatedAt: string;
};

export function dedupeByEventId(events: AtomTelemetryEvent[]): { unique: AtomTelemetryEvent[]; deduped: number } {
  const seen = new Set<string>();
  const unique: AtomTelemetryEvent[] = [];
  let deduped = 0;
  for (const event of events) {
    if (!event.eventId || seen.has(event.eventId)) {
      deduped += 1;
      continue;
    }
    seen.add(event.eventId);
    unique.push(event);
  }
  return { unique, deduped };
}

export function backfillInsertCount(events: AtomTelemetryEvent[], dryRun: boolean): number {
  return dryRun ? events.length : events.length;
}

export function nextCheckpoint(prev: TelemetryBackfillCheckpoint | null, patch: Partial<TelemetryBackfillCheckpoint>): TelemetryBackfillCheckpoint {
  return {
    line: patch.line ?? prev?.line ?? 0,
    inserted: patch.inserted ?? prev?.inserted ?? 0,
    deduped: patch.deduped ?? prev?.deduped ?? 0,
    malformed: patch.malformed ?? prev?.malformed ?? 0,
    updatedAt: new Date().toISOString(),
  };
}
