---
title: "Go Live And Validation Checklist"
summary: "Synthesis document generated for external LLM/frontend handover."
audience: "ops"
status: "implemented"
source_path: "generated"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# Go-Live and Validation Checklist

- [ ] Environment variables set (`ATOM_SCOPE_STRATEGY`, telemetry toggles, provider key).
- [ ] Supabase migrations through `014` applied in target environment.
- [ ] API smoke checks pass for `/api/atom/{tasks,sources,profile,feedback}`.
- [ ] Session isolation validated across at least two distinct peers.
- [ ] Artifact generation and persistence verified.
- [ ] Telemetry rollup and retention jobs tested (dry-run + enforce path).
- [ ] Alert dedupe and cooldown behavior verified.
- [ ] Feedback submission and admin visibility verified.
- [ ] Rollback plan rehearsed (provider flag and deployment rollback).
