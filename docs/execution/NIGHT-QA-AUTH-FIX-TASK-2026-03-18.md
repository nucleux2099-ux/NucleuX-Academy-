# Night QA Fix Task — Auth Probe Failure (2026-03-18 IST)

## Trigger
`npm run -s test:auth:probe` failed with:
- `token: status=400`
- `error_code=invalid_credentials`

## Impact
- Credentialed auth path is currently failing.
- Full credentialed smoke confidence is reduced until resolved.

## Immediate Fix Steps
1. Update `.env.local` test credentials:
   - `E2E_EMAIL`
   - `E2E_PASSWORD`
2. Verify account is active in Supabase Auth.
3. Re-run:
   - `npm run -s test:auth:probe`
   - `npm run -s test:atom:nightly-gates:smoke-guarded`
4. Capture output artifact under `reports/` with pass/fail stamp.

## Exit Criteria
- `test:auth:probe` returns token endpoint 2xx.
- `test:atom:nightly-gates:smoke-guarded` passes fully (including credentialed smoke).
