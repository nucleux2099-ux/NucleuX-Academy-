---
title: "Atom Feedback And Alerting Ops"
summary: "Feedback + alerting operational playbook."
audience: "ops"
status: "implemented"
source_path: "docs/atom-feedback-and-alerting-ops.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "E"
llm_handover_relevance: "high"
---

# ATOM Feedback + Alerting Ops

## Feedback API

### Submit feedback
`POST /api/atom/feedback`

Body (example):
```json
{
  "feedbackType": "rating",
  "sentiment": "positive",
  "rating": 5,
  "sessionId": "...",
  "messageId": "msg_123",
  "artifactId": "...",
  "classification": "helpful",
  "comment": "Concise and accurate"
}
```

### Update feedback outcome
`PATCH /api/atom/feedback/:id`

Body (example):
```json
{ "resolved": true, "classification": "resolved-after-correction" }
```

## Alerting endpoint
`GET /api/atom/telemetry/alerts?window=24h|7d`

Returns persisted structured alerts:
- `failure_rate_spike`
- `fallback_rate_spike`
- `grounding_score_drop`
- `security_anomaly`

## Cross-scope access
For `scopeKey` override, include header:
- `x-atom-admin-key: <ATOM_ADMIN_KEY>`

Without it, requests are confined to caller-derived scope.
