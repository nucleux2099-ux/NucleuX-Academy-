---
title: "Atom System Map"
summary: "Synthesis document generated for external LLM/frontend handover."
audience: "engineer"
status: "implemented"
source_path: "generated"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# ATOM System Map (ASCII)

```text
[Doctor UI (/atom)]
   |  Next.js client components
   v
[API Routes: /api/atom/*, /api/chat]
   |  auth + scope derivation + validation
   +--------------------------+
   |                          |
   v                          v
[ATOM Runtime (src/lib/atom)] [LLM Provider Adapter]
   |                          |
   | sessions/tasks/artifacts | prompt+completion
   v                          v
[Supabase Postgres]       [Anthropic/OpenAI/Alt-LLM]
  tables: atom_sessions,
  atom_task_artifacts,
  atom_scope_profiles,
  atom_telemetry_*, feedback
   |
   v
[Ops jobs/scripts]
  rollup, retention, backfill,
  alerting, heartbeat profile

[Filesystem userspaces]
  .atom-userspaces/<scope>
  AGENTS.md/SOUL.md/TOOLS.md/...
```

## Boundary notes
- Scope key -> canonical thread (`scope:<key>`) is the principal isolation boundary.
- DB RLS + API authorization enforce same-user/same-scope visibility.
- Ops jobs use service role and are expected to bypass user RLS by design.
