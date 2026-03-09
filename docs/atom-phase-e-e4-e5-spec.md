# ATOM Phase E4/E5 — Hardening + Governance Completion

Status: ✅ Implemented (production reliability pass)

## Scope Delivered

1. **Alert dedupe + cooldown**
   - Dedupe key format: `scope + alertKind + hourly timeBucket`
   - Cooldown windows by alert kind to suppress repeated spam
   - Persistence upgraded to upsert on `(dedupe_key, time_bucket)`

2. **DB defense-in-depth**
   - New migration: `014_atom_phase_e4_e5_hardening.sql`
   - Tightened RLS for `atom_telemetry_rollups`, `atom_telemetry_alerts`, `atom_feedback`
   - Added stricter checks/indexes for alerts/rollups/feedback query paths

3. **Scheduled rollups + retention jobs**
   - `scripts/atom-telemetry-rollup-job.ts` (hour/day materialization)
   - `scripts/atom-telemetry-retention-job.ts` (dry-run/enforce)
   - package scripts for cron wiring

4. **Calibration robustness**
   - Minimum sample threshold gate (`minSampleThresholdMet`)
   - EWMA smoothing to reduce noisy trend flips
   - Confidence labels: `low|medium|high`
   - Confidence band included in response

5. **Backfill checkpointing**
   - `scripts/atom-telemetry-backfill.ts` now supports `--checkpoint-file`
   - Resumable by line cursor (`resumedFromLine`)
   - Idempotent restart behavior retained via DB upsert on `event_id`

6. **Operator dashboard data contracts (API)**
   - `GET /api/atom/telemetry/contracts/calibration-trend`
   - `GET /api/atom/telemetry/contracts/alert-burndown`
   - `GET /api/atom/telemetry/contracts/retention-status`

## Contract Notes

- `calibration-trend`: rollup points for trend charting
- `alert-burndown`: alert timeline by kind/severity/time bucket
- `retention-status`: retention cutoff + expiring row count

## Policy Assumptions

- API scope checks remain primary authorization boundary.
- DB RLS now additionally requires existence of same-user telemetry in scope before exposing rollups/alerts/feedback rows.
- Service role jobs continue to bypass RLS as intended for maintenance operations.
