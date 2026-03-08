# ATOM Night QA Nudge — 2026-03-08

## Trigger
Night QA found `/atom` live and functional, but identified one UX-quality gap in continuation flow under source-limited chat sessions.

## Gap
- In conversation panel, a `continue` follow-up can appear as duplicated user text blocks before/alongside assistant response in the same thread.
- This can reduce confidence that continuation state is deterministic.

## Immediate Fix Task (VN2-QA-14)
Owner: ATOM frontend/backend pair

1. Reproduce with deterministic script:
   - Ask grounded query in `/atom` Simple Chat.
   - Send `continue` once.
   - Verify single appended user message event.
2. Inspect event ingestion/render path in:
   - `src/components/atom/LegacyAtomWorkspace.tsx`
   - any chat event normalizer/projector used by `/atom` mode
3. Add de-dup guard by message id + timestamp window (client-side) and preserve server truth.
4. Add regression test for "single continue message append" in chat event reducer.
5. Validate:
   - `pnpm -s tsc --noEmit`
   - `pnpm -s build`

## Acceptance Criteria
- `continue` request creates exactly one user message node in UI.
- Assistant continuation remains on prior topic.
- No regression in strict-source grounding warnings when selected sources are insufficient.
