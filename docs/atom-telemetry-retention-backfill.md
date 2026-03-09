# ATOM Telemetry Retention + Backfill

## Rollups
Endpoint:
- `GET /api/atom/telemetry/rollups?granularity=hour|day&window=7d|30d`

Rollups are computed from raw `atom_telemetry_events` and stored in `atom_telemetry_rollups`.

## Retention pruning utility
Library function: `pruneRawTelemetry()` in `src/lib/atom/telemetry-rollups.ts`

Behavior:
- default retention window: `ATOM_TELEMETRY_RETENTION_DAYS` (default 30)
- supports `dryRun` mode for non-destructive auditing

## Backfill NDJSON → DB
Script:
- `tsx scripts/atom-telemetry-backfill.ts --file <path/to/telemetry.ndjson> [--dry-run]`

Details:
- Parses line-delimited JSON telemetry
- Deduplicates by `eventId` within file
- Upserts by `event_id` to prevent duplicates on reruns
- Emits structured report summary on completion
