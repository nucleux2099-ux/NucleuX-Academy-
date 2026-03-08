# ATOM v3 — Release Branch Strategy and PR Sequence

**Status:** Phase 1 lock package (enforced sequence)  
**Date:** 2026-03-08

---

## 1) Branching Model

### Long-lived branches
- `main` — stable integration baseline (protected).
- `release/atom-v3` — release candidate stabilization line (protected).

### Phase branches (short-lived, ordered)
- `phase/atom-v3-01-scope-lock`
- `phase/atom-v3-02-foundation-fixes`
- `phase/atom-v3-03-learning-lifecycle-port`
- `phase/atom-v3-04-component-army-port`
- `phase/atom-v3-05-security-hardening`
- `phase/atom-v3-06-rag-activation`
- `phase/atom-v3-07-integration-polish`

### Support branches
- `hotfix/atom-v3-<ticket>` (only from `release/atom-v3`)
- `chore/atom-v3-<scope>`
- `docs/atom-v3-<scope>`

---

## 2) Protection Rules
For `main` and `release/atom-v3`:
1. No direct push.
2. Mandatory PR + approvals.
3. Required checks: type/lint/build/test gates.
4. Linear history (squash or rebase policy, team standard).
5. Force-push disabled.

---

## 3) PR Sequence (Mandatory Order)

### Stage 0: Governance lock
1. `phase/atom-v3-01-scope-lock` → `main`  
   PR title: `ATOM v3 Phase 1: Scope lock package`

### Stage 1: Foundation and blockers
2. `phase/atom-v3-02-foundation-fixes` → `main`  
3. `main` → `release/atom-v3` (sync PR: `Release sync #1`)

### Stage 2: Core merge payloads
4. `phase/atom-v3-03-learning-lifecycle-port` → `main`  
5. `phase/atom-v3-04-component-army-port` → `main`  
6. `main` → `release/atom-v3` (sync PR: `Release sync #2`)

### Stage 3: Hardening and activation
7. `phase/atom-v3-05-security-hardening` → `main`  
8. `phase/atom-v3-06-rag-activation` → `main`  
9. `main` → `release/atom-v3` (sync PR: `Release sync #3`)

### Stage 4: Final integration
10. `phase/atom-v3-07-integration-polish` → `main`  
11. `main` → `release/atom-v3` (RC cut PR: `ATOM v3 RC cut`)
12. `release/atom-v3` → `main` (final reconciliation PR before launch tag)

---

## 4) PR Template Requirements (Minimum)
Each PR in the sequence must contain:
- Scope statement: what is included / excluded.
- Risk statement + rollback plan.
- Gate checklist status.
- Test evidence summary.
- Linked issue/task/spec path.

---

## 5) Hotfix Flow (Post-RC)
1. Branch from `release/atom-v3`: `hotfix/atom-v3-<ticket>`
2. PR into `release/atom-v3`
3. After validation, back-merge PR: `release/atom-v3` → `main`
4. Tag patch release after back-merge

---

## 6) Tagging Convention
- RC tags: `v3.0.0-rc.N`
- Stable: `v3.0.0`
- Patches: `v3.0.X`

---

## 7) Merge Conflict Policy
- First resolve in phase branch.
- If repeated conflict appears across >2 PRs, create dedicated `chore/atom-v3-conflict-resolution` PR before next feature PR.
- Never bypass checks due to timeline pressure; escalate instead.
