# Troubleshooting Playbook

## Fast Triage
1. Identify route class first using `docs/ROUTE-STATUS.md`:
   - data-backed vs mixed/mock
2. Check environment variable availability
3. Check database bootstrap/migrations
4. Check API response status and server logs

## Common Issues

### 1. `401 Unauthorized` on protected APIs
Symptoms:
- `/api/profile`, `/api/progress`, `/api/study-plan`, etc. return 401

Checks:
- Confirm user is authenticated in UI
- Confirm middleware/session flow (`src/middleware.ts`, `src/lib/supabase/middleware.ts`)
- Verify Supabase URL/anon key env vars are set correctly

Fixes:
- Re-authenticate user
- Correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Confirm callback/redirect URL aligns with `NEXT_PUBLIC_SITE_URL`

### 2. Login callback redirects to error
Symptoms:
- Redirects to `/login?error=auth_callback_error`

Checks:
- `src/app/auth/callback/route.ts`
- Supabase OAuth app redirect URLs
- `NEXT_PUBLIC_SITE_URL` correctness

Fixes:
- Align Supabase OAuth redirect URL with deployed origin
- Set/update `NEXT_PUBLIC_SITE_URL`

### 3. Chat API fails (`ANTHROPIC_API_KEY not configured`)
Symptoms:
- `/api/chat` returns 500 with missing key message

Checks:
- `ANTHROPIC_API_KEY` set in runtime environment

Fix:
- Add valid API key and restart app

### 4. Speech API fails (`SARVAM_API_KEY is not set`)
Symptoms:
- `/api/speech/stt` or `/api/speech/tts` returns 500

Checks:
- `SARVAM_API_KEY` set
- language code/payload format valid

Fixes:
- Set key in runtime
- Validate request payload fields per `docs/API-REFERENCE.md`

### 5. Build fails during CBME validation
Symptoms:
- `npm run build` fails before Next build

Checks:
- `scripts/validate-cbme-links.ts` output
- CBME link mappings in `src/lib/data/cbme-*`

Fixes:
- Correct invalid library paths/subject mappings
- Re-run `npm run validate:cbme`

### 6. Content not loading for a topic
Symptoms:
- Topic page shows missing content / fallback only

Checks:
- `content/<subject>/<subspecialty>/<topic>/` exists
- `_index.yaml` includes topic slug
- `src/lib/data/content-mapping.ts` mapping for subject/subspecialty/topic
- `src/lib/content/loader.ts` fallback path behavior

Fixes:
- Add missing content files (`explorer.md`, `_meta.yaml` at minimum)
- Correct slug/folder mapping
- Run `npm run content:validate`

### 7. Progress/session analytics updates fail
Symptoms:
- Study session ends but stats/streak not updating

Checks:
- RPC functions exist in DB: `increment_study_time`, `increment_mcq_stats`, `increment_topics_completed`
- DB migration bootstrap completeness (`docs/DATABASE.md`)

Fixes:
- Apply missing migrations/functions
- Validate by retrying `/api/study-sessions` PATCH flow

### 8. Settings save shows failure
Symptoms:
- Save action in `/settings` returns error toast/status

Checks:
- `/api/profile` PATCH response payload
- RLS/user ownership on `profiles` and `user_preferences`

Fixes:
- Ensure authenticated user row exists in both tables
- Confirm update fields are valid and not blocked by policy

### 9. Smoke e2e fails in CI/local
Symptoms:
- `npm run test:smoke` fails login or route checks

Checks:
- `E2E_EMAIL`, `E2E_PASSWORD` availability
- app actually running on `E2E_BASE_URL`
- Playwright browser installed

Fixes:
- Set creds and run `npx playwright install chromium`
- Ensure server startup before test execution

## Useful Commands
```bash
npm run lint
npm run lint:stabilization
npm run validate:cbme
npm run content:validate
npm run build
```

## Escalation Order
1. Reproduce locally with clean env
2. Verify route/API with direct request
3. Verify DB schema + migration state
4. Review recent changes in affected module
5. Add or update docs if root cause is a process/documentation gap
