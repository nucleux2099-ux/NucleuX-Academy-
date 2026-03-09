---
title: "Readme First"
summary: "Synthesis document generated for external LLM/frontend handover."
audience: "product"
status: "implemented"
source_path: "generated"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# ATOM Handover: 30-Minute Fast Start

## Purpose
This package enables an external frontend team to safely experiment with an alternate LLM backend while preserving ATOM product behavior, data integrity, and ops constraints.

## 30-minute path
1. Read `../INDEX.md` for role-based sequence.
2. Read `ATOM-SYSTEM-MAP.md` for architecture mental model.
3. For frontend: jump to `../05-frontend-wiring/FRONTEND-INTEGRATION-PLAYBOOK.md`.
4. For backend/API parity: read `../03-backend-apis/API-COMPATIBILITY-FOR-ALT-LLM.md`.
5. For safety/ops: read `../06-ops-governance/INDEX.md` and checklists in `../10-checklists`.

## What is inside
- Product intent and UX behavior from canonical product docs.
- Phase A–E implementation evidence, including migrations and rollout hardening.
- API + data model references tied to current code paths.
- OpenClaw behavioral context for sessions, memory, heartbeat, and tool usage.

## Success criteria for alt-LLM experiments
- Existing `/atom` user flow remains stable.
- Session scope isolation and workspace guards preserved.
- Artifacts, telemetry, feedback, and alerts still conform to current contracts.
- Rollback route available (provider switch or feature flag rollback).
