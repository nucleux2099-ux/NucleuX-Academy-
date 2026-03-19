# 79) Night QA Fix Task — Auth Credential Recovery (2026-03-19 05:25 IST)

## Trigger
Nightly ATOM QA gates are green except credentialed auth preflight (`test:auth:probe`) returning `400 invalid_credentials`.

## Concrete fix task (execute now with operator access)
1. In Supabase Auth dashboard, reset password for the smoke account (`E2E_EMAIL`).
2. Update both local `.env.local` and CI secret store with the same pair:
   - `E2E_EMAIL`
   - `E2E_PASSWORD`
3. Validate in this exact order:
   - `npm run -s test:auth:probe`
   - `E2E_BASE_URL=https://nucleuxacademy.io npm run -s test:smoke`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`
4. Confirm parity using printed credential fingerprints (`email_sha`, `password_sha`) between local + CI runs.
5. Attach passing logs to overnight thread and mark ATOM QA full-green.

## Exit criteria
- `test:auth:probe` returns 2xx token response.
- Credentialed smoke test passes on `https://nucleuxacademy.io`.
- `test:atom:nightly-gates:smoke-guarded` exits 0.
