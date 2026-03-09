# Operations Runbook

**Related:** [06-QUALITY-SAFETY-GOVERNANCE](./06-QUALITY-SAFETY-GOVERNANCE.md) · [04-BACKEND-ARCHITECTURE](./04-BACKEND-ARCHITECTURE.md) · [08-ROADMAP-NEXT](./08-ROADMAP-NEXT.md)

## 1) Go-live checklist

## Infra + schema
- [ ] Apply migrations up to `014_atom_phase_e4_e5_hardening.sql` (and current head).
- [ ] Verify required indexes for alerts/rollups.
- [ ] Validate RLS behavior on telemetry/feedback tables.

## Runtime config
- [ ] Set `ATOM_ADMIN_KEY` securely.
- [ ] Confirm `ATOM_SCOPE_STRATEGY` and `ATOM_SCOPE_STRICT_MODE` values.
- [ ] Validate workspace root (`ATOM_USER_WORKSPACES_ROOT`) permissions.
- [ ] Confirm telemetry flags and retention days.

## App health
- [ ] `bun run lint`
- [ ] `bun run build`
- [ ] `bun run test:atom:route-smoke`
- [ ] Smoke test `/atom` session start/message/continue/download.

## 2) Routine operations

## Daily
- Review active alerts (`/api/atom/telemetry/alerts?window=24h`)
- Check calibration confidence/trend
- Spot check unresolved negative feedback

## Hourly/Daily jobs
Use package scripts:
- `bun run atom:rollup:hourly`
- `bun run atom:rollup:daily`
- `bun run atom:retention:dry-run`
- `bun run atom:retention:enforce` (as scheduled policy)

## Source sync routine
- `bun run atom:sources:sync`
- `bun run atom:sources:sync-vyasa`
- Validate status summary route after sync.

## 3) Cron job guidance

Example cadence:
- Hourly: rollup (hour)
- Daily (off-peak): rollup (day)
- Daily/weekly: retention dry-run report
- Weekly: retention enforce (or daily if high volume)

## 4) Troubleshooting playbook

## Symptom: session appears mixed or wrong
- Check scope envelope in request path/client.
- Verify `ATOM_SCOPE_STRICT_MODE` behavior.
- Run scope migration audit (`bun run atom:scope:audit`).

## Symptom: no artifacts downloadable
- Validate `ATOM_PHASE_C_ARTIFACTS_ENABLED`.
- Check session ownership and artifact ID.
- Inspect for 404/410 route responses.

## Symptom: telemetry dashboards flat/empty
- Confirm `ATOM_TELEMETRY_ENABLED=true`.
- Verify event writes in `atom_telemetry_events`.
- Run rollup jobs manually and re-check contracts endpoints.

## Symptom: profile not persisting
- Ensure migration `011_atom_scope_profiles.sql` applied.
- Confirm scope envelope is stable across requests.

## 5) Incident response playbook

```text
Detect -> Triage -> Contain -> Fix -> Validate -> Communicate -> Retrospective
```

## Severity mapping
- **SEV-1:** possible data leak, widespread outage, auth/scope breach
- **SEV-2:** critical workflow degradation (chat unavailable, artifacts broken)
- **SEV-3:** quality regression, delayed jobs, partial endpoint failures

## Immediate containment actions
- Disable non-critical feature flags (V3/GDD/advanced modes)
- Enforce strict scope mode if leakage suspected
- Pause retention enforce if telemetry integrity investigation ongoing

## Recovery validation
- session isolation smoke tests
- artifact download + telemetry contract checks
- targeted cohort verification (Sarath/Aditya workflows)

## 6) Rollback strategy

Priority rollback order:
1. Feature flag rollback (safest)
2. Route-level rollback (problem endpoints)
3. Service/module rollback (telemetry/artifacts/profile)
4. Migration rollback only if unavoidable and data-safe

Always keep a post-incident ADR entry in [09-DECISIONS-LOG](./09-DECISIONS-LOG.md).

## Decisions
- Keep operational controls script-first (repeatable, auditable).
- Prefer feature-flag rollback before schema-level rollback.

## Actions
- Add automated health-check script aggregating key endpoint checks.
- Define on-call ownership windows for SEV-1/SEV-2.

## Open Questions
- Who owns final incident command role during off-hours?
- Should retention enforce be auto-paused on active SEV-2+ incidents?
