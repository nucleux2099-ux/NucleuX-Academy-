# 65) Night Orchestrator Pulse — 2026-03-17 07:00 IST

## Scope this run
1. Unblock auth smoke by validating Supabase credential health.
2. Re-run guarded nightly reliability gates end-to-end (including credentialed smoke).

## Commands executed
```bash
set -a; [ -f .env.local ] && source .env.local; set +a; npm run -s test:auth:probe
set -a; [ -f .env.local ] && source .env.local; set +a; npm run -s test:atom:nightly-gates:smoke-guarded
```

## Results
- `test:auth:probe` ✅
  - `settings: status=200`
  - `token: status=200`
  - Supabase password grant reachable and valid with current env.
- `test:atom:nightly-gates:smoke-guarded` ✅
  - typecheck ✅
  - lint ✅
  - build ✅
  - `/atom` route present in build manifest ✅
  - `test:atom:route-smoke` ✅
  - `test:atom:chat-contracts` ✅
  - `test:atom:reliability` ✅ (continue continuity + strict insufficiency language)
  - `test:atom:dedup` ✅
  - `test:smoke` ✅ (login, desk CTA, MCQ submit, settings save)

## Reliability/continuity status
- Session continuity (`continue` behavior): green.
- Source grounding insufficiency guard: green.
- Chat UX smoke path (login → desk CTA → key interactions): green.

## Notes
- Non-blocking runtime log observed during shutdown: analytics POST `ECONNRESET` after smoke completion.
- No functional gate failures.

## Next action
1. Keep auth probe in pre-smoke routine for early credential drift detection.
2. Monitor `ECONNRESET` analytics-on-shutdown noise and suppress/log-tune if it creates false alarms.
