# 54) Night Orchestrator Pulse — 2026-03-16 03:00 IST

## Objective this cycle
Restore release confidence after a new smoke drift surfaced in MCQ submit flow, while keeping continuity/source-grounding gates stable.

## What changed
1. **Hardened smoke E2E MCQ selection logic** in `scripts/smoke-e2e.mjs`
   - Replaced ambiguous option click (`/^A\s/`) with content-based option candidates:
     - `Whipple procedure`
     - `Distal pancreatectomy`
     - `Total pancreatectomy`
     - `Frey procedure`
   - Added explicit submit-enabled wait before clicking `Submit Answer`.
   - Rationale: previous selector sometimes matched unrelated `A*` buttons (e.g., filters), leaving submit disabled and causing false failures.

2. **Added failure artifact capture for smoke triage** in `scripts/smoke-e2e.mjs`
   - On any step failure, script now writes:
     - full-page screenshot (`artifacts/smoke-e2e/<timestamp>-<step>.png`)
     - DOM snapshot (`artifacts/smoke-e2e/<timestamp>-<step>.html`)
   - Logs artifact paths directly in stderr.
   - Rationale: faster diagnosis for overnight breakages without rerun guesswork.

## Validation run (with E2E env loaded)
- `set -a; source .env.local; set +a; npm run -s test:atom:nightly-gates:smoke-guarded` ✅ PASS
  - typecheck ✅
  - lint ✅
  - build ✅
  - atom route smoke ✅
  - reliability (continue continuity + strict source insufficiency) ✅
  - dedup ✅
  - smoke e2e ✅ (Login, Desk CTA, MCQ submit, Settings save)
- `curl -s -o /dev/null -w '%{http_code} %{url_effective}\n' https://nucleux-academy-lfa3p80qr-aditya-chandrabhatlas-projects.vercel.app/atom` ✅ `401`

## Outcome
Overnight reliability gates are green again end-to-end, and smoke diagnostics are now materially better for unattended runs.

## Next recommendation
- Add `data-testid` to MCQ option container and submit button to remove text-coupling entirely.
- Optionally upload smoke artifacts as CI build attachments on failure for remote triage.
