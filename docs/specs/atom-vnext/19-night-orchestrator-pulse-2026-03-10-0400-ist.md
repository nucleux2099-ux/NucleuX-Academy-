# 19) Night Orchestrator Pulse — 2026-03-10 04:00 IST

## Focus
1. Add regression coverage for backlink highlighting when topic title contains regex-special characters.
2. Add persistence-path sanitization coverage for artifact workspace copy paths (scope/session/artifact).

## Changes made
- Added `src/components/Backlinks.test.tsx` for regex-special title highlight regression (`C++ (Basics)?`).
- Exported `renderHighlightedContext` from `src/components/Backlinks.tsx` for direct deterministic test coverage.
- Extended `src/lib/atom/artifacts/__tests__/service.test.ts` with a path-sanitization persistence test validating:
  - Supabase `blob_path` sanitization
  - Workspace copy write path correctness
  - Deterministic persisted content

## Validation
Passes in this runtime:
- `npm run -s typecheck` ✅
- `npm run -s lint` ✅
- `node --import tsx --test src/app/__tests__/atom-route-smoke.test.ts` ✅
- `node --import tsx --test src/components/atom/chatEventDedup.test.ts` ✅
- `node --import tsx --test src/components/Backlinks.test.tsx` ✅
- `node --import tsx --test src/lib/atom/artifacts/__tests__/service.test.ts` ✅
- `node --import tsx scripts/validate-cbme-links.ts` ✅

Blocked in this sandbox:
- `npm run -s test:atom:route-smoke` ⛔ (`tsx` IPC pipe EPERM in `/var/folders/.../tsx-501/*.pipe`)
- `npm run -s test:atom:dedup` ⛔ (same `tsx` IPC EPERM)
- `npm run -s build` ⛔ (cannot fetch Google Fonts `Geist`/`Geist Mono` from `fonts.googleapis.com`)

## Blocker
Environment-level constraints prevent full script-level validation and production build in this sandbox:
1) `tsx` CLI IPC permission failure (EPERM on Unix socket/pipe).
2) Outbound network restriction during `next build` font fetch.

## Next
1. Re-run **exact required script commands** in a runtime with pipe support and outbound access.
2. If all green, commit and push:
   - `test(atom): add regression coverage for backlink regex escaping and path sanitization`
3. If build still fails, switch to fallback reliability task:
   - Local font bundling / no-remote-font build path for deterministic CI/night runs.
