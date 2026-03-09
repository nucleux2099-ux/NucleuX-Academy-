---
title: "06 Quality Safety Governance"
summary: "Canonical product documentation snapshot for ATOM handover."
audience: "product"
status: "implemented"
source_path: "docs/product/06-QUALITY-SAFETY-GOVERNANCE.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# Quality, Safety, and Governance

**Related:** [05-DATA-MODELS-AND-APIS](./05-DATA-MODELS-AND-APIS.md) · [07-OPERATIONS-RUNBOOK](./07-OPERATIONS-RUNBOOK.md) · [09-DECISIONS-LOG](./09-DECISIONS-LOG.md)

## 1) Doctor-safe quality goals

For clinicians, quality means:
- responses are relevant,
- internally coherent,
- grounded to selected sources/context,
- and continuously improved with feedback.

## 2) Grounding model

Grounding controls implemented across phases:
- scoped memory retrieval only (no cross-scope memory blending)
- deterministic prompt assembly layers (safety -> memory -> profile -> query)
- response feedback capture and outcome tracking
- artifact download constrained by session/scope ownership

## 3) Isolation controls

Core controls:
- canonical scope-key strategy + strict envelope option
- route-level and storage-level scope checks
- workspace path sanitization and root boundary guard
- admin-key gate for cross-scope telemetry reads

## 4) Alerting and operational governance

Telemetry alerts currently include:
- `failure_rate_spike`
- `fallback_rate_spike`
- `grounding_score_drop`
- `security_anomaly`

Hardening (E4/E5):
- dedupe keys by scope+kind+time bucket
- cooldown windows to avoid alert spam
- tighter RLS on feedback/rollups/alerts tables

## 5) Rollups, retention, and backfill

```text
Raw telemetry events
   -> hourly/daily rollups
   -> retention pruning (dry-run/enforce)
   -> optional NDJSON backfill with checkpoints
```

Governance guarantees:
- retention policy configurable (default 30 days)
- backfill idempotent via event upsert
- resumable imports through checkpoint files

## 6) Risk register and mitigations

| Risk | Impact | Current Mitigation | Residual Gap |
|---|---|---|---|
| Scope collision or leakage | High | Canonical scope/thread checks + strict mode | Requires disciplined envelope propagation across all clients |
| Ungrounded or low-quality answer drift | High | Telemetry + calibration + feedback loop | No hard quality gate enforcement in runtime yet |
| Alert fatigue | Medium | E4/E5 dedupe and cooldown | Threshold tuning by cohort still pending |
| Artifact pointer/file mismatch | Medium | Download route checks + fallback + 410 semantics | Need more production burn-in metrics |
| Personalization overreach | Medium | Policy guardrails (advisory, override precedence) | Need explicit user-facing policy transparency panel |
| Ops blind spots during rollout | Medium | Contract endpoints + runbooks + jobs | Dashboard UX not yet fully unified |

## 7) Governance checklist (release readiness)
- Migrations applied through latest hardening files
- Telemetry/alert endpoints reachable
- Rollup + retention jobs scheduled
- Admin key rotation policy defined
- Feedback loop tested in staging with resolved/unresolved path

## Decisions
- Keep safety posture “scope first, then quality optimization.”
- Prefer conservative defaults (dedupe, strict checks, explicit admin keys).

## Actions
- Define hard-stop quality thresholds for critical modes.
- Add privacy/PII audit script for telemetry metadata payloads.

## Open Questions
- Which alerts should page humans vs only populate dashboard?
- Should unresolved negative feedback trigger automatic review workflow?
