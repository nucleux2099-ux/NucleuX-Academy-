import type { AtomTelemetryEvent } from '@/lib/atom/telemetry';

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
