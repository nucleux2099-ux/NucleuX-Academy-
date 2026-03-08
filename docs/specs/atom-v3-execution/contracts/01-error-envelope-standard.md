# ATOM v3 — Error Envelope Standard (Phase 1)

Status: **Standardized / Frozen for v3.0.x**  
Effective date: **2026-03-08**

## 1) Canonical error envelope

All non-2xx API responses in ATOM BFF/API surface must conform to:

```json
{
  "error": {
    "code": "string_machine_code",
    "message": "human-readable summary",
    "retryable": false,
    "details": {},
    "requestId": "uuid-or-trace-id"
  }
}
```

### Field rules
- `code` (required): stable, machine-parseable (`snake_case`)
- `message` (required): concise user-facing summary
- `retryable` (required): whether client can safely retry same request
- `details` (optional object): structured diagnostics; must not include secrets/PII
- `requestId` (required): trace correlation id

## 2) HTTP mapping (default)

- `400` invalid request → `invalid_request`
- `401` unauthenticated → `unauthorized`
- `403` forbidden → `forbidden`
- `404` missing entity/route → `not_found`
- `409` conflict/state mismatch → `conflict`
- `422` validation/semantic errors → `validation_failed`
- `429` throttled → `rate_limited`
- `500` internal failure → `internal_error`
- `502/503/504` upstream/dependency failures → `upstream_error` / `service_unavailable` / `timeout`

## 3) SSE error event envelope

For SSE task streams, use:

```json
{
  "eventId": 0,
  "taskId": "uuid",
  "type": "task.failed",
  "ts": "ISO-8601",
  "payload": {
    "error": {
      "code": "string_machine_code",
      "message": "human-readable summary",
      "retryable": false,
      "details": {},
      "requestId": "uuid-or-trace-id"
    }
  }
}
```

## 4) Backward-compatibility bridge

Current legacy responses like:

```json
{ "error": "Unauthorized" }
```

are tolerated during transition but must be wrapped by BFF adapters into canonical shape before UI handling. Raw legacy shape is **deprecated in v3.0.x** and removed in next major.

## 5) Implementation note

- Create a shared helper in BFF (e.g., `errorEnvelope(code, message, status, opts)`)
- Enforce in route handlers and orchestrator failure emitters
- Add contract tests for each major status class (4xx/5xx/SSE failure)
