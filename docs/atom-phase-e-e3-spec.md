# ATOM Phase E3 Spec — Feedback, Calibration, Alerts, Rollups, Backfill

## Delivered

### E3.1 Feedback capture
- Extended telemetry taxonomy with:
  - `feedback.submitted`
  - `feedback.classified`
  - `outcome.confirmed`
  - `correction.recorded`
- Added API endpoints:
  - `POST /api/atom/feedback`
  - `PATCH /api/atom/feedback/:id`
- Feedback schema is scope-bound and can link to `sessionId`, `messageId`, `artifactId`.

### E3.2 Closed-loop calibration
- Added calibration service correlating user feedback + telemetry proxies.
- Weighted scoring:
  - 70% proxy quality (continuity/grounding/personalization/operational)
  - 30% direct feedback (sentiment/rating/resolution)
- Added endpoint:
  - `GET /api/atom/telemetry/calibration?window=24h|7d|30d[&scopeKey=...]`

### E3.3 Alerting thresholds
- Evaluates:
  - failure-rate spikes
  - fallback-rate spikes
  - grounding-score drops
  - scope/security anomaly presence
- Emits structured alerts and persists them in `atom_telemetry_alerts`.
- Added endpoint:
  - `GET /api/atom/telemetry/alerts?window=24h|7d[&scopeKey=...]`

### E3.4 Rollups + retention
- Added hourly/daily rollup service from raw telemetry to `atom_telemetry_rollups`.
- Added endpoint:
  - `GET /api/atom/telemetry/rollups?granularity=hour|day&window=7d|30d[&scopeKey=...]`
- Added retention pruning utility with dry-run mode.

### E3.5 Backfill tooling
- Added NDJSON importer script:
  - `scripts/atom-telemetry-backfill.ts`
- Supports:
  - dry-run report mode
  - dedupe by `eventId`
  - upsert by `event_id`

## Security/privacy
- Existing telemetry metadata sanitization + redaction preserved.
- Cross-scope/global reads require `x-atom-admin-key` == `ATOM_ADMIN_KEY`.
- Scope constraints enforced in feedback update/read paths.
