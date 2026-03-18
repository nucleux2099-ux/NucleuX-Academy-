# NUC-7 Production Smoke Record (2026-03-18)

## Scope
- Task: `NUC-7` production mapping and release workflow verification.
- Live target: `https://nucleuxacademy.io`
- Verification timestamp: `2026-03-18 23:49 IST`

## Deployment baseline
- `vercel ls` latest production deployment (Ready):
  - `https://nucleux-academy-lfa3p80qr-aditya-chandrabhatlas-projects.vercel.app`
- Observed older production deployment (Error state) still present in history:
  - `https://nucleux-academy-1j6f1k3ue-aditya-chandrabhatlas-projects.vercel.app`

## Checks run

1. Deploy health checks (unauthenticated key routes)
   - Command: `npm run -s test:deploy:health`
   - Result: PASS
   - Route outcomes:
     - `/` -> `200`
     - `/login` -> `200`
     - `/desk` -> `307` redirect to `/login?returnTo=%2Fdesk`
     - `/library` -> `307` redirect to `/login?returnTo=%2Flibrary`
     - `/mcqs` -> `307` redirect to `/login?returnTo=%2Fmcqs`
     - `/atom` -> `200`
     - `/api/streaks` -> `401` (expected without auth)

2. Auth probe (credentialed)
   - Command: `npm run -s test:auth:probe`
   - Result: FAIL (`400 invalid_credentials`)

3. End-to-end credentialed smoke
   - Command: `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`
   - Result: FAIL at login (`Invalid login credentials`)
   - Failure artifacts:
     - `artifacts/smoke-e2e/2026-03-18T18-18-49-653Z-login.png`
     - `artifacts/smoke-e2e/2026-03-18T18-18-49-653Z-login.html`

4. Error log scan (production)
   - Command: `npx vercel logs --environment production --since 1h --level error --no-follow --limit 20`
   - Result: `No logs found`

## Status
- Key page availability and auth-gate behavior: verified.
- Credentialed production smoke: blocked by invalid E2E credentials.

## Required follow-up
- Rotate/provision valid smoke credentials and rerun:
  - `npm run -s test:auth:probe`
  - `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`
- Attach rerun output to the corresponding release issue before release sign-off.
