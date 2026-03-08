# Track A — NucleuX Original (Deep Research) First-Build Spec

**Owner:** ATOM v3 execution stream (Track A)  
**Repo:** `/Users/adityachandrabhatla/nucleux-academy`  
**Date:** 2026-03-08  
**Status:** Implementation-ready plan (Phase 2 entry)

---

## 1) Goal

Ship the first production-ready **Deep Research** path for `nucleux-original` mode with:
1. deterministic task-mode execution (existing `atom_tasks` + SSE),
2. explicit claim↔citation validation,
3. evidence grading per claim and per answer,
4. handoff into NucleuX learning cycle (Plan→Encode→Retrieve→Apply→Diagnose→Reinforce).

---

## 2) Existing baseline (already in repo)

- `POST /api/atom-v3/launch` exists and routes `nucleux-original` to `/chat?...`
- ATOM task stack exists:
  - `POST /api/atom/tasks`
  - `GET /api/atom/tasks/:id/events` (SSE replay+tail)
  - `POST /api/atom/tasks/:id/control`
  - DB tables from `005_atom_v2_phase1.sql`
- Current orchestrator is stub (`runAtomOrchestratorStub`).

**Track A converts nucleux-original from quick launch wrapper → full task-mode deep research pipeline.**

---

## 3) API & data flow (exact first build)

## 3.1 Launch flow (frontend)

### Step A — Intent submit
`AtomV3Experience.tsx` submits:
```json
{
  "mode": "nucleux-original",
  "topic": "...",
  "level": "resident",
  "timeAvailable": 40,
  "goal": "...",
  "advanced": {
    "preferredFormat": "bullet",
    "includeReferences": true,
    "clinicalContext": "..."
  }
}
```

### Step B — launch route behavior change
`POST /api/atom-v3/launch` for `mode=nucleux-original` must:
1. validate/normalize quick-start payload (existing schema),
2. call `POST /api/atom/tasks` with:
```json
{
  "message": "<goal + topic + clinicalContext compiled prompt>",
  "mode": "task",
  "sourceSelection": {
    "level": "resident",
    "preset": "clinical-deep-dive",
    "bookIds": [],
    "workflow": "nucleux-original-deep-research",
    "includeReferences": true
  },
  "room": "atom"
}
```
3. return launchPath:
```json
{
  "workflow": "nucleux-original",
  "taskId": "<uuid>",
  "eventsUrl": "/api/atom/tasks/<uuid>/events",
  "launchPath": "/chat?mode=nucleux-original&taskId=<uuid>",
  "message": "NucleuX Original Deep Research launched."
}
```

## 3.2 Runtime flow (backend)

1. `POST /api/atom/tasks` inserts `atom_tasks(status=queued, mode=task, source_snapshot=...)`
2. Emit `task.created`
3. Orchestrator starts and emits phase events:
   - `plan`
   - `retrieve`
   - `reason`
   - `draft`
   - `finalize`
4. In `draft/finalize`, create/update artifacts:
   - `outline` → research skeleton
   - `citations` → evidence map
   - `notes` → final answer + graded claims + learning handoff
   - `table` → claim-citation-validation grid
5. Emit `task.completed` or `task.failed`.

## 3.3 In-app learning cycle integration

On `task.completed`, append analytics event:
`POST /api/analytics` with:
```json
{
  "event": "deep_research_completed",
  "data": {
    "taskId": "<uuid>",
    "topic": "...",
    "claimCoverage": 0.92,
    "evidenceGrade": "B",
    "weakClaimCount": 3,
    "recommendedNext": ["retrieval_quiz", "case_apply"]
  }
}
```

Generate **Learning Handoff block** in final `notes` artifact:
- Plan: top 3 objectives
- Encode: distilled first-principles summary
- Retrieve: 5 short recall prompts
- Apply: 3 case-style questions
- Diagnose: top claim-risk areas
- Reinforce: 24h + 72h revision prompts

This makes deep research output directly usable by Desk/Backstage flows.

---

## 4) Claim↔Citation validator (implementation logic)

## 4.1 Input contract

Validator input (from `reason` → `draft`):
```ts
type DraftWithEvidence = {
  answerMarkdown: string;
  citations: Array<{
    id: string;                   // e.g., "CIT-7"
    title: string;
    sourceType: 'textbook' | 'guideline' | 'review' | 'trial' | 'other';
    editionOrYear?: string;
    chapterOrSection?: string;
    pageOrLocator?: string;
    quote?: string;               // exact supporting excerpt
    evidenceLevelHint?: string;
  }>;
}
```

## 4.2 Claim extraction (rule-based v1)

Treat sentence as a **claim candidate** if any true:
- contains numeric/threshold/dose (`\d+`, `%`, `mg`, `mmHg`, etc.)
- contains recommendation verbs (`should`, `recommended`, `indicated`, `contraindicated`)
- contains causal/assertive verbs (`causes`, `reduces`, `increases`, `predicts`, `is associated with`)

Ignore:
- headings/bullets without predicate
- purely procedural text (“Let us now discuss…”)

## 4.3 Citation anchoring rule

Accepted anchors in text:
- `[CIT-7]`
- `[CIT-1, CIT-3]`
- `(CIT-4)`

Validation rules per claim:
1. `anchor_present` (at least one anchor in sentence or immediately following sentence)
2. `citation_exists` (all anchors exist in citation list)
3. `locator_present` (citation has chapter/section/page/locator)
4. `quote_present` (non-empty supporting excerpt)
5. `semantic_support >= 0.55` (token-overlap + negation check heuristic in v1)

## 4.4 Claim status

Per-claim status:
- `PASS` = rules 1..5 pass
- `WARN` = anchor exists but locator/quote weak OR semantic 0.40–0.54
- `FAIL` = missing anchor, missing citation, or semantic < 0.40

## 4.5 Validator output

```ts
type ClaimValidationResult = {
  claimId: string;
  claimText: string;
  anchors: string[];
  status: 'PASS' | 'WARN' | 'FAIL';
  issues: string[];
  semanticSupport: number; // 0..1
}
```

Aggregate metrics:
- `claim_count`
- `pass_count`
- `warn_count`
- `fail_count`
- `coverage = (pass + warn) / claim_count`

Hard gate before finalize:
- if `FAIL > 0` and `coverage < 0.85` → emit `task.needs_input` OR auto-revise once.

---

## 5) Evidence grading model (v1)

## 5.1 Per-citation score (0–100)

`citation_score = hierarchy + recency + locator + quote + consistency + penalty`

Weights:
- **Hierarchy (0–30)**
  - guideline/systematic review: 28–30
  - RCT/high-quality trial: 24–27
  - observational study: 16–23
  - textbook chapter: 14–20
  - expert opinion/other: 6–13
- **Recency (0–15)**
  - <=5y: 15
  - 6–10y: 10
  - >10y: 5
  - unknown: 7
- **Locator completeness (0–15)**
  - chapter+page/section exact: 15
  - partial: 8
  - none: 0
- **Quote quality (0–15)**
  - explicit supporting excerpt present: 15
  - paraphrase only: 8
  - none: 0
- **Cross-source consistency (0–20)**
  - supported by >=2 independent citations: 20
  - one source only: 10
- **Penalty (-20..0)**
  - contradiction signals / internal inconsistency / outdated harmful recommendation

## 5.2 Per-claim grade

Claim score = max(citation_score among linked citations) adjusted by semantic support:
- semantic >=0.75: no penalty
- 0.55–0.74: -10
- 0.40–0.54: -20
- <0.40: force grade D

Grades:
- A: >=85
- B: 70–84
- C: 55–69
- D: <55

## 5.3 Final answer grade

`answer_grade_score = 0.6 * avg(top_claim_scores) + 0.4 * coverage*100`

Return in final payload:
```json
{
  "evidenceGrade": "B",
  "evidenceScore": 78,
  "coverage": 0.92,
  "claimStats": { "pass": 11, "warn": 2, "fail": 1 }
}
```

---

## 6) Acceptance test set (must pass)

## 6.1 API contract tests
1. **Launch nucleux-original creates task**
   - Input: valid quick-start payload
   - Expect: `taskId`, `eventsUrl`, deep-research launch path
2. **Launch with invalid payload returns 400 envelope**
3. **SSE replay works**
   - create task, consume events with `since`, verify deterministic order

## 6.2 Validator unit tests
4. claim with valid `[CIT-x]` + locator + quote → `PASS`
5. claim with missing anchor → `FAIL`
6. anchor points to unknown citation id → `FAIL`
7. anchor exists, weak locator → `WARN`
8. semantic contradiction phrase (“A reduces B” vs quote “A does not reduce B”) → `FAIL`

## 6.3 Evidence grade tests
9. two strong citations + high semantic support ⇒ grade A/B
10. single outdated uncited-style claim ⇒ grade C/D
11. mixed claim set with 85%+ coverage computes expected final score bucket

## 6.4 Learning-cycle integration tests
12. completed deep research emits `analytics.event=deep_research_completed`
13. final `notes` artifact contains all six learning-loop sections
14. weak claims produce non-empty `Diagnose` recommendations

## 6.5 End-to-end task-mode tests
15. user can stop/retry; status transitions obey contract
16. failed validator with low coverage triggers one revise pass before completion

---

## 7) Implementation task list (coder-ready)

## A. Routing & payload plumbing
1. **Update** `src/app/api/atom-v3/launch/route.ts`
   - For `nucleux-original`, call `/api/atom/tasks` server-side instead of plain `/chat` redirect
   - Return `taskId/eventsUrl` in response
2. **Update** `src/components/atom/AtomV3Experience.tsx`
   - Preserve task metadata and navigate with `taskId`

## B. Deep research orchestration
3. **Refactor** `src/lib/atom/orchestrator.ts`
   - Keep stub path for non-research modes
   - Add `runNucleuxOriginalDeepResearch(...)`
4. Add phase payload contracts in `src/lib/atom/types.ts`
   - `DeepResearchConfig`, `ClaimValidationResult`, `EvidenceGradeSummary`

## C. Validator module
5. **Create** `src/lib/atom/claim-citation-validator.ts`
   - claim extraction
   - anchor parser
   - citation existence checks
   - semantic support heuristic
   - aggregate metrics + hard gate

## D. Evidence grading module
6. **Create** `src/lib/atom/evidence-grader.ts`
   - citation scoring
   - claim grade mapping
   - final answer grade

## E. Artifact persistence
7. In orchestrator finalize phase, write/update:
   - `outline` artifact
   - `table` artifact (`claim_validation_table`)
   - `citations` artifact (`evidence_map`)
   - `notes` artifact (`final_answer_with_learning_handoff`)

## F. Learning cycle handoff
8. **Create** `src/lib/atom/learning-handoff.ts`
   - build Plan/Encode/Retrieve/Apply/Diagnose/Reinforce block from graded output
9. **Hook** analytics emit in completion path (`/api/analytics` event)

## G. Testing
10. Add route tests under `src/app/api/atom-v3/__tests__/launch.nucleux-original.test.ts`
11. Add validator tests under `src/lib/atom/__tests__/claim-citation-validator.test.ts`
12. Add grader tests under `src/lib/atom/__tests__/evidence-grader.test.ts`
13. Add orchestrator integration test with simulated events/artifacts

## H. Done criteria
14. All 16 acceptance tests pass
15. No regression in non-`nucleux-original` quick-start modes
16. Contract outputs remain additive-only (Phase 1 compatibility policy)

---

## 8) Out-of-scope for first build

- LLM-based NLI verifier (heuristic semantic check only in v1)
- Editable artifact canvas (read-first)
- User-custom evidence weighting profiles
- Cross-task longitudinal claim memory

---

## 9) Delivery checkpoint

Track A is “ready for merge” when:
- deep research launch is task-native,
- validator + grading are enforced pre-finalize,
- learning handoff artifact is generated,
- acceptance suite green in CI.
