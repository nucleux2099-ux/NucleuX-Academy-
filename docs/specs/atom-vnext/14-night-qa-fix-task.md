# Night QA Fix Task — Build Warnings Cleanup (2026-03-09)

## Context
Night QA build is green, but Next 16 emitted 9 Turbopack warnings about overly broad file patterns under `content/**` in:
- `src/app/api/library/content/route.ts`
- `src/lib/content/loader.ts`

These patterns match 10k–16k files and can degrade build/runtime performance.

## Task ID
VN2-QA-14

## Objective
Constrain file-system scanning in content resolution paths so Turbopack no longer reports broad dynamic patterns.

## Scope
1. Refactor loader/route path resolution to use deterministic subject/subspecialty maps (avoid recursive broad joins in hot paths).
2. Add a tiny perf-safe helper that only probes known directories from index metadata.
3. Re-run `npm run build` and confirm warning count drops from 9 to 0 (or document residual warnings with rationale).

## Acceptance Criteria
- Build passes.
- Turbopack broad-pattern warnings removed or materially reduced with documented justification.
- No regressions in library route resolution (`/library/[subject]/[subspecialty]/[topic]`).

## Suggested owner
Coder-NucleuX / Vishwakarma

## Night run result (2026-03-09, 03:xx IST)
- ✅ Build passes (`npm run build`)
- ✅ Turbopack broad-pattern warnings reduced **9 → 5**
- ✅ Removed numbered-prefix fallback scans in both:
  - `src/app/api/library/content/route.ts`
  - `src/lib/content/loader.ts`
- ✅ `resolveContentDir` now resolves through static `SUBJECT_CONTENT_MAP` + `SUBSPECIALTY_CONTENT_MAP`
- ✅ `getSubspecialtiesFromContent` now uses map keys instead of directory-wide scans

### Residual warnings (5) — rationale
Remaining warnings come from unavoidable runtime joins in generic filesystem loaders where inputs are route/data-driven (`subject`, `subspecialty`, topic/file names). They are now constrained by static mapping and guard checks, but Turbopack still flags them as dynamic patterns.

### Next refinement option
Introduce subject/subspecialty-specific resolver modules (per-subject import graph) to fully eliminate remaining dynamic joins, at the cost of larger refactor complexity.
