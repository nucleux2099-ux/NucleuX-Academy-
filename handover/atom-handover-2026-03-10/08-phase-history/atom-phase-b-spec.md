---
title: "Atom Phase B Spec"
summary: "Phase B implementation specification."
audience: "engineer"
status: "implemented"
source_path: "docs/atom-phase-b-spec.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "B"
llm_handover_relevance: "high"
---

# ATOM Phase B Spec — Scoped File Memory + Retrieval Integration

## Goals
- Add robust scoped memory files under each user workspace.
- Retrieve memory context strictly from current scope only.
- Inject retrieved memory context into ATOM message/continue flow before assistant generation.
- Preserve Phase A isolation and backward compatibility when strict scope mode is disabled.

## Memory layout (per scope)
Inside `<workspace-root>/<scope>/`:
- `MEMORY.md` (index)
- `memory/YYYY-MM-DD.md` (daily append log)
- `memory/preferences.md` (optional profile)
- `memory/learning-profile.md` (optional profile)
- `memory/topic-mastery.md` (optional profile)

Implemented in `src/lib/atom/memory-store.ts`.

### Memory service guarantees
- Safe pathing via scoped root (`getAtomWorkspaceRoot(scopeKey)`).
- Idempotent structure creation.
- Bounded append:
  - max append size (`MAX_APPEND_BYTES`)
  - auto-trim when daily file exceeds bounded size (`MAX_FILE_BYTES`).
- APIs:
  - `ensureAtomMemoryStructure(scopeKey)`
  - `appendAtomMemory({ scopeKey, section, content })`
  - `readAtomMemoryFiles(scopeKey)`

## Retrieval layer
Implemented in `src/lib/atom/memory-retrieval.ts`.

### Current provider
- Deterministic keyword retrieval provider (pluggable interface).
- Searches **only** files returned by `readAtomMemoryFiles(scopeKey)`.
- Returns snippets with source metadata:
  - `sourceFile`
  - `startLine`
  - `endLine`
  - `score`

### Semantic-ready interface
- `MemoryRetrievalProvider` interface and `setMemoryRetrievalProvider()` enable drop-in semantic/embedding provider in Phase C without route contract changes.

## Prompt assembly integration
Updated routes:
- `POST /api/atom/session/[sessionId]/message`
- `POST /api/atom/session/[sessionId]/continue`

Flow:
1. Resolve scope envelope and scopeKey.
2. Ensure memory structure.
3. Append user input to scoped daily memory.
4. Retrieve scoped memory snippets using current topic/query.
5. Build deterministic memory context block with citations and char cap.
6. Prepend this block to chat payload before assistant call.
7. Persist assistant output and retrieval citation metadata in message meta.
8. Append assistant output into scoped memory file.

Budget controls:
- Retrieval chunk limit and deterministic sort.
- Prompt memory section capped by `maxChars` in formatter.

## Strict scope envelope mode (Phase A gap closure)
Implemented in `src/lib/atom/scope-envelope.ts` and integrated into all ATOM session routes.

Enable with:
- `ATOM_SCOPE_STRICT_MODE=true`

Behavior:
- Requires explicit scope identity envelope fields.
- Rejects ambiguous requests with `400`.
- Honors scope strategy:
  - `per-channel-peer`: requires `channel`, `peer`
  - `per-account-channel-peer`: requires `accountId`, `channel`, `peer`
- When strict mode is off, legacy fallback behavior remains.

## Tests added
- `src/lib/atom/__tests__/memory-retrieval.test.ts`
- `src/lib/atom/__tests__/scope-envelope.test.ts`

These cover:
- scope-local memory retrieval isolation
- snippet metadata/citation data
- strict-mode rejection behavior
- mixed account/channel permutations producing distinct scopes

## Phase C readiness
- Semantic provider insertion point is ready (`setMemoryRetrievalProvider`).
- Next: embeddings, re-ranking, recency weighting, and long-horizon memory compaction policies.
