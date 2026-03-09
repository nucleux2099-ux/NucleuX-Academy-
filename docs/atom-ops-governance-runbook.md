# ATOM Ops Governance Runbook

## Cron Wiring (recommended)

### Hourly rollup
`bun run atom:rollup:hourly`

### Daily rollup
`bun run atom:rollup:daily`

### Retention dry-run audit
`bun run atom:retention:dry-run`

### Retention enforce
`bun run atom:retention:enforce`

## Backfill Resume

Dry-run:
`tsx scripts/atom-telemetry-backfill.ts --file <telemetry.ndjson> --dry-run --checkpoint-file ./.atom/backfill-checkpoint.json`

Enforce:
`tsx scripts/atom-telemetry-backfill.ts --file <telemetry.ndjson> --checkpoint-file ./.atom/backfill-checkpoint.json`

## Operational Endpoints

- Calibration trend: `/api/atom/telemetry/contracts/calibration-trend`
- Alert burn-down: `/api/atom/telemetry/contracts/alert-burndown`
- Retention status: `/api/atom/telemetry/contracts/retention-status`

## Safety Checks Before Go-Live

1. Run migration `014_atom_phase_e4_e5_hardening.sql`
2. Verify alert dedupe index exists (`idx_atom_alerts_dedupe_bucket`)
3. Validate retention job in dry-run mode
4. Confirm rollup jobs run without scope/auth errors
5. Run ATOM tests + smoke
