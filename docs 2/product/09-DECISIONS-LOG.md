# Decisions Log (ADR-style Timeline)

**Related:** [01-PRODUCT-OVERVIEW](./01-PRODUCT-OVERVIEW.md) · [04-BACKEND-ARCHITECTURE](./04-BACKEND-ARCHITECTURE.md) · [06-QUALITY-SAFETY-GOVERNANCE](./06-QUALITY-SAFETY-GOVERNANCE.md)

## ADR-001: Canonical scope-key isolation as foundation
- **When:** Phase A
- **Decision:** Use derived canonical `scopeKey` and canonical thread mapping (`scope:<scopeKey>`) for session isolation.
- **Rationale:** Prevent cross-peer/session leakage and make one-lane scoped continuity deterministic.
- **Status:** Implemented.

## ADR-002: Single active chat UX in primary `/atom`
- **When:** Phase A
- **Decision:** Remove thread-switch complexity from active UX and keep one scoped conversation lane.
- **Rationale:** Doctor workflows favor speed and continuity over thread management overhead.
- **Status:** Implemented (LegacyAtomWorkspace active route).

## ADR-003: Scoped workspace bootstrap files
- **When:** Phase A
- **Decision:** Create per-scope bootstrap files (`AGENTS.md`, `SOUL.md`, etc.) with safe-path guards.
- **Rationale:** Support controlled long-horizon context without cross-user contamination.
- **Status:** Implemented.

## ADR-004: Scoped memory retrieval with pluggable provider
- **When:** Phase B
- **Decision:** Add deterministic scoped memory retrieval now; keep semantic provider pluggable later.
- **Rationale:** Ship safe memory context quickly without waiting for full semantic stack.
- **Status:** Implemented, with upgrade path open.

## ADR-005: Artifact Schema v1 + secure download contract
- **When:** Phase C
- **Decision:** Introduce structured artifact table and scoped download endpoint; dual-write during migration.
- **Rationale:** Stable output portability and reliable export behavior for clinicians.
- **Status:** Implemented; dual-write still present.

## ADR-006: Adaptive profile as advisory, not absolute
- **When:** Phase D
- **Decision:** Apply personalization under policy guardrails with explicit instruction precedence.
- **Rationale:** Prevent over-personalization from overriding doctor intent/safety constraints.
- **Status:** Implemented.

## ADR-007: Heartbeat noise suppression
- **When:** Phase D
- **Decision:** Heartbeat returns `HEARTBEAT_OK` without action to reduce unnecessary alerts/messages.
- **Rationale:** Operational calm and reduced fatigue.
- **Status:** Implemented.

## ADR-008: Telemetry-first quality governance
- **When:** Phase E1/E2
- **Decision:** Instrument key routes with a versioned telemetry contract.
- **Rationale:** Product quality must be measurable, not anecdotal.
- **Status:** Implemented.

## ADR-009: Closed-loop quality (feedback + calibration + alerts)
- **When:** Phase E3
- **Decision:** Add feedback APIs and aggregate quality with proxy metrics + user feedback.
- **Rationale:** Combine subjective and objective quality signals.
- **Status:** Implemented.

## ADR-010: E4/E5 hardening before aggressive expansion
- **When:** Phase E4/E5
- **Decision:** Prioritize dedupe/cooldown, RLS hardening, retention governance, and backfill checkpointing.
- **Rationale:** Operational reliability before feature sprawl.
- **Status:** Implemented.

## ADR-011: Keep ATOM V3 behind progressive gating
- **When:** Current state
- **Decision:** Maintain feature-flag/path gating for V3 advanced/GDD while UX-1 remains primary.
- **Rationale:** Avoid destabilizing core doctor workflow while maturing advanced paths.
- **Status:** Active.

## Decisions
- Continue ADR logging for every major safety/quality-impacting change.

## Actions
- Add author/approver metadata for future ADR entries.
- Link each ADR to PRs/commits once workflow mandates it.

## Open Questions
- At what milestone should ADR-011 be retired and V3 become default?
- Is a formal architecture review gate needed before introducing any new cross-scope feature?
