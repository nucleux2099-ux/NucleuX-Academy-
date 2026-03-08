# ATOM v3 — RACI, Merge Windows, and Gate Checklist

**Status:** Phase 1 governance baseline  
**Date:** 2026-03-08

---

## 1) RACI Matrix (Execution + Merge)

| Workstream / Decision | Responsible (R) | Accountable (A) | Consulted (C) | Informed (I) |
|---|---|---|---|---|
| Scope lock maintenance | Samyojak (Merge Executor) | Narasimha (Program Lead) | Vishwakarma (Architecture), QA Lead | Founders |
| Architecture-impact decisions | Vishwakarma | Narasimha | Senior Engineers | Founders, QA |
| Branch protection and merge policy | Engineering Lead | Narasimha | Samyojak, DevOps | Team |
| PR sequencing enforcement | Samyojak | Engineering Lead | Module owners | QA, Founders |
| QA gate validation | QA Lead | Engineering Lead | Feature owners | Narasimha |
| Security blocker triage (P0/P1) | Security owner / Eng Lead | Narasimha | Vishwakarma, QA Lead | Founders |
| Release readiness sign-off | Engineering Lead + QA Lead | Narasimha | Vishwakarma, Samyojak | Founders |
| Emergency rollback decision | Engineering Lead | Narasimha | Vishwakarma, QA Lead | Full team |

> Notes: Names can be mapped to current assignees as staffing changes, but role accountability remains fixed.

---

## 2) Merge Windows (IST)

To reduce collision and speed review cycles, use fixed merge windows:

### Standard Weekly Windows
1. **Window A (Low-risk merges):** Mon–Thu, 11:00–13:00 IST
2. **Window B (Integration merges):** Mon–Thu, 17:00–19:00 IST
3. **Window C (Release candidate merges only):** Fri, 15:00–18:00 IST

### Freeze Rules
- **Daily freeze:** no merges after 19:00 IST unless hotfix-approved.
- **Weekend freeze:** Sat–Sun merge only for approved hotfix/security patch.
- **Pre-release freeze:** 24h before planned cut unless release manager approves exception.

### Merge Limits Per Window
- Max **3 medium/large PRs** per integration window.
- Small docs/chore PRs can batch if no test-surface impact.
- Never merge two schema-touching PRs in same window without explicit dependency order.

---

## 3) Gate Checklist (Must Pass)

Use this as a hard checklist before merging into release line.

## A. Code & Review Gates
- [ ] PR has clear scope and references task/spec.
- [ ] At least 1 reviewer approval (2 for high-risk/security/data changes).
- [ ] No unresolved review threads.
- [ ] No TODO/FIXME that affects runtime correctness.

## B. Build & Static Gates
- [ ] Type check passes (`npx tsc --noEmit` or project equivalent).
- [ ] Lint passes per repo policy.
- [ ] Build passes (`npm run build` / equivalent).

## C. Test Gates
- [ ] Critical path tests pass (auth, learning flow, exam center, AI/chat entry points as applicable).
- [ ] Regression tests for touched modules pass.
- [ ] Manual QA spot-check completed for UI-impact PRs.

## D. Data & Migration Gates
- [ ] Any migration is reversible or has documented rollback path.
- [ ] Data-impact PR includes migration notes and backup posture.
- [ ] No unreviewed destructive migration.

## E. Security & Compliance Gates
- [ ] No new critical vulnerabilities introduced.
- [ ] Secrets/config changes documented and validated.
- [ ] Auth/permission changes include explicit test evidence.

## F. Release Readiness Gates
- [ ] Changelog/release notes entry prepared.
- [ ] Rollback command/procedure confirmed.
- [ ] Monitoring/alerts for changed services verified.
- [ ] Final approver acknowledges merge window and release impact.

---

## 4) Gate Outcome States
- **GREEN:** all mandatory gates pass → merge allowed.
- **YELLOW:** non-critical advisory items pending → merge only with A-level approval.
- **RED:** any mandatory gate fails → merge blocked.
