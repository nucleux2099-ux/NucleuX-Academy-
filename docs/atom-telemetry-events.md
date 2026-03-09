# ATOM Telemetry Event Catalog

## Core schema
Each event payload (logical contract) includes:
- `eventId` (UUID)
- `eventName` (`request.lifecycle`, `retrieval.outcome`, `artifact.usage`, `profile.decision`, `policy.decision`, `heartbeat.outcome`)
- `ts` (ISO timestamp)
- `scopeKey` (hash-safe scoped identifier)
- `sessionId` (optional)
- `route`
- `mode`
- `latencyMs`
- `status` (`ok` | `error` | `skipped` | `blocked`)
- `reasonCode` (optional)
- `metadata` (sanitized/minimized JSON)

## Event meanings
- `request.lifecycle`
  - Per-route request outcome + latency + fallback markers
- `retrieval.outcome`
  - Retrieval snippet count and score characteristics
- `artifact.usage`
  - Artifact download/use events
- `profile.decision`
  - Adaptive profile read/write outcomes
- `policy.decision`
  - Guardrail/policy decisions (personalization + reason codes)
- `heartbeat.outcome`
  - Heartbeat run result, emit decision, file-read counts

## Redaction policy
- Metadata keys matching sensitive patterns (`content`, `message`, `text`, `prompt`, `email`, `phone`, `token`, `secret`, `cookie`, `authorization`) are redacted.
- Long strings are truncated.
- Nested objects/arrays are depth- and length-bounded.
