# NucleuX Academy Product Documentation Index

This folder is the **doctor-friendly operating manual** for the current NucleuX Academy + ATOM state.

If you are short on time, start with:
1. [10-DOCTOR-QUICKSTART.md](./10-DOCTOR-QUICKSTART.md)
2. [03-ATOM-THREE-PANE-UX-SPEC.md](./03-ATOM-THREE-PANE-UX-SPEC.md)
3. [01-PRODUCT-OVERVIEW.md](./01-PRODUCT-OVERVIEW.md)

---

## Reading Order (recommended)

1. **[01-PRODUCT-OVERVIEW.md](./01-PRODUCT-OVERVIEW.md)**  
   Why this exists, who it serves, what is in/out of scope.
2. **[02-PERSONAS-AND-USECASES.md](./02-PERSONAS-AND-USECASES.md)**  
   Cohorts, priorities, and real doctor workflows.
3. **[03-ATOM-THREE-PANE-UX-SPEC.md](./03-ATOM-THREE-PANE-UX-SPEC.md)**  
   Clinical UX behavior: left cockpit, center consult, right outputs.
4. **[04-BACKEND-ARCHITECTURE.md](./04-BACKEND-ARCHITECTURE.md)**  
   Phase A–E architecture and operational pipelines.
5. **[05-DATA-MODELS-AND-APIS.md](./05-DATA-MODELS-AND-APIS.md)**  
   Tables, entities, API contracts, auth/scope rules.
6. **[06-QUALITY-SAFETY-GOVERNANCE.md](./06-QUALITY-SAFETY-GOVERNANCE.md)**  
   Grounding, risk controls, telemetry governance.
7. **[07-OPERATIONS-RUNBOOK.md](./07-OPERATIONS-RUNBOOK.md)**  
   Go-live checks, daily ops, incidents, rollback.
8. **[08-ROADMAP-NEXT.md](./08-ROADMAP-NEXT.md)**  
   What to build next and why.
9. **[09-DECISIONS-LOG.md](./09-DECISIONS-LOG.md)**  
   ADR-style timeline of major product decisions.
10. **[10-DOCTOR-QUICKSTART.md](./10-DOCTOR-QUICKSTART.md)**  
    Day-to-day guide for clinicians.
11. **[11-CONFORMANCE-CHECK-A-E.md](./11-CONFORMANCE-CHECK-A-E.md)**  
    Strict Phase A–E conformance audit against code/migrations/APIs, with deviations and fixes.

---

## Who should read what

- **Doctor / faculty / resident using ATOM daily**: 10 → 03 → 02
- **Product lead (Sarath) / owner (Aditya)**: 01 → 02 → 08 → 09
- **Engineering (frontend + backend)**: 03 → 04 → 05 → 07
- **QA / safety / operations**: 06 → 07 → 05
- **New team member onboarding**: 01 → 03 → 04 → 10

---

## Ground truth and assumptions

This pack reflects the currently implemented state in:
- `src/components/atom/LegacyAtomWorkspace.tsx` (active ATOM UX shell)
- `src/app/api/atom/**` and `src/lib/atom/**` (core ATOM runtime)
- `supabase/migrations/009` through `014` (Phase A–E ATOM sessions/artifacts/profiles/telemetry/feedback)
- `supabase/migrations/015_competency_progress.sql` (separate LMS competency schema; not part of ATOM Phase A–E)
- Existing architecture docs under `/docs/atom-*.md`

Known caveat: some Track A / Guided Deep Dive functionality exists as scaffold or feature-flagged paths; active `/atom` user flow is primarily single-chat UX.

---

## Decisions
- Use doctor-first language in all product docs, with technical details below each section.
- Treat Phases A–E as implemented baseline, with explicit caveats where scaffold-only.

## Actions
- Keep this index updated whenever a new product doc is added.
- During each release, refresh links to changed APIs and migrations.

## Open Questions
- Should this product pack become the canonical docs hub replacing older `docs/atom-*.md`, or remain a curated layer above them?
