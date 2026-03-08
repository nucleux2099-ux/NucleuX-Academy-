# ATOM v3 — Phase 1 Scope Lock (Final)

**Document owner:** Samyojak (Merge Executor)  
**Repo:** `/Users/adityachandrabhatla/nucleux-academy`  
**Status:** Locked for Phase 1 execution  
**Date:** 2026-03-08

---

## 1) Objective
Phase 1 establishes a hard scope lock for ATOM v3 execution so the team can deliver a deterministic integration baseline before any feature expansion. This phase focuses on **planning certainty, branch hygiene, and merge governance**.

---

## 2) In-Scope (Locked)

### A. Scope Governance Artifacts
1. Final scope lock document (this file) with explicit non-goals.
2. RACI + merge windows + gate checklist.
3. Release branch strategy with branch names + PR sequence.

### B. Execution Controls
1. Freeze ad-hoc feature additions into ATOM v3 execution stream.
2. Define approval authority for scope changes.
3. Define minimum gate criteria for merge readiness.

### C. Merge Readiness Alignment
1. Common execution language across engineering, QA, and product.
2. Single sequence for PR orchestration to reduce merge conflicts.
3. Explicit rollback points and release branch checkpoints.

---

## 3) Deliverables (Phase 1 Exit Criteria)
Phase 1 is complete only when all are true:
- [x] Scope lock doc finalized and versioned under `docs/specs/atom-v3-execution/`
- [x] Non-goals documented and accepted
- [x] RACI matrix + merge windows + gate checklist published
- [x] Release branch strategy + PR sequence published
- [x] Team agrees no out-of-scope work enters Phase 1–2 merge line without approved change request

---

## 4) Scope Change Policy (During Locked Window)
Any scope addition must include:
1. Business/clinical rationale.
2. Impact estimate (engineering + QA + timeline risk).
3. Explicit defer/accept decision by owner group.
4. Branch impact statement (which branch is touched and why).

**Default policy:** If unclear, **defer to post-Phase-1 backlog**.

---

## 5) Non-Goals (Explicit)
The following are **not** part of Phase 1 and must not block Phase 1 closure:

1. Net-new product features unrelated to merge execution controls.
2. UI redesign/rebrand polish beyond what is needed for merge stability.
3. Large refactors of stable modules “for cleanliness only”.
4. Performance optimization campaigns not tied to critical regressions.
5. Infrastructure re-platforming (new cloud architecture, major DevOps migration).
6. Analytics instrumentation expansion beyond required release telemetry.
7. New external integrations unless mandatory for current merge path.
8. Content revamp or full curriculum rewrite.
9. Security hardening beyond must-fix blockers defined in gate checklist.
10. Post-launch growth experiments.

---

## 6) Risk Boundaries for Phase 1
- No force-pushes to protected release branches.
- No direct commits to release branches.
- No unreviewed schema-altering migrations in locked branches.
- No dependency upgrades outside approved stability list.

---

## 7) Definition of “Locked”
Scope is considered locked when:
- This document exists in-repo,
- linked governance docs exist,
- and merge/release workflow is accepted by responsible owners.

**Lock effective:** immediately upon publication of this package.
