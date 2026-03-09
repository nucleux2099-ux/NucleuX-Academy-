---
title: "Atom Backend Architecture Openclaw Style"
summary: "Backend architecture spec for ATOM orchestration and flow."
audience: "engineer"
status: "implemented"
source_path: "docs/atom-backend-architecture-openclaw-style.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# ATOM Backend Architecture (OpenClaw-style)

## 1) Isolation model + canonical key strategy

ATOM is now modeled as **single-chat per isolated user scope**.

Canonical scope key derivation:

- Preferred: `accountId:channel:peer`
- Fallback (no account): `channel:peer`
- Safe defaults: `channel=web`, `peer=userId`, `accountId=anon`
- Sanitization: lowercase + safe charset normalization

Implementation:

- `src/lib/atom/user-scope.ts`
  - `deriveAtomUserScopeKey(...)`
  - `deriveAtomThreadIdForScope(scopeKey)`

Session thread ID is canonicalized to `scope:<scopeKey>`, creating one effective session lane per scope.

## 2) Session store design

Session persistence remains in existing `atom_sessions` + `atom_session_messages` tables.

- `startOrResumeAtomSession(...)` now accepts `{ scopeKey?, threadId? }`
- If `threadId` is omitted, it deterministically uses scope-thread mapping.
- Existing conflict key (`user_id,thread_id`) keeps behavior backward-compatible.
- Every session read still requires `user_id` match, preventing cross-user leakage.

## 3) Per-user workspace layout

Scaffold introduced:

- `src/lib/atom/user-workspace.ts`
  - `getAtomWorkspaceRoot(scopeKey)`
  - `ensureAtomUserWorkspaceBootstrap(...)`

Default root:

- `${process.cwd()}/.atom-userspaces/<scopeKey>/`
- Override with `ATOM_USER_WORKSPACES_ROOT`

Bootstrap files ensured:

- `AGENTS.md`
- `SOUL.md`
- `TOOLS.md`
- `USER.md`
- `IDENTITY.md`
- `HEARTBEAT.md`
- Optional: `BOOTSTRAP.md` (created only when `ATOM_ENABLE_BOOTSTRAP_FILE=true`)

This is intentionally minimal scaffolding with TODO-ready templates for richer runtime injection.

## 4) Memory model (daily + long-term)

Recommended model (next increment):

- **Daily memory:** append-only daily logs under `<scope>/memory/daily/YYYY-MM-DD.md`
- **Long-term memory:** curated facts/preferences under `<scope>/memory/long-term.md` or structured JSON
- Session chat DB remains source-of-truth for current ATOM conversational context.

Current code includes scaffold hooks only; no aggressive memory ingestion was added to avoid over-refactor.

## 5) Heartbeat model

`HEARTBEAT.md` is bootstrapped per scope with metadata placeholders.

Planned evolution:

- periodic snapshot of session health
- recent task/result summary
- stale-session detection and reconciliation marker

No scheduler/runtime mutation added in this patch.

## 6) Artifact/output model

Artifacts continue to be generated from assistant output and persisted in message metadata.

UX now keeps:

- One conversation stream
- One outputs rail (timeline + artifacts)

No thread-switch artifact bifurcation exists in active ATOM UX.

## 7) Personalization tuning loop

Suggested loop per scope:

1. Capture outcomes (completed/failed/needs-input)
2. Aggregate weak spots and preferred output patterns
3. Update scope bootstrap docs (`SOUL.md`, `USER.md`, `TOOLS.md`) through controlled writes
4. Use deterministic merge rules to avoid prompt drift

Current patch lays foundation (scope workspace + bootstrap) but intentionally avoids automatic mutation.

## 8) Migration plan: thread UI → single chat UX

Completed in this patch for active `/atom` route:

- Removed thread list and thread switching from `LegacyAtomWorkspace`
- Single persistent chat panel retained
- Outputs panel retained
- Independent scroll behavior retained

Backend migration:

- `POST /api/atom/session/start` no longer requires `threadId`
- deterministic scope-key based session selection introduced
- `GET /api/atom/session/threads` now returns only canonical scope session(s)

Backward compatibility:

- If older callers still send `threadId`, it is respected.

## 9) Security and anti-leak guarantees

- Authentication gate unchanged (`supabase.auth.getUser()`)
- Session fetches scoped by authenticated `user_id`
- Canonical scope isolation prevents accidental cross-channel mixing when account/channel/peer are supplied
- Workspace filesystem paths are namespaced by scope key
- Sanitization prevents unsafe path/key material

## 10) Follow-ups

- Extend scope propagation from frontend for non-web channels in all entrypoints
- Introduce explicit memory append APIs with injection guards
- Add integration tests for multi-scope same-user scenarios
- Audit non-active ATOM variants (`atom-v3`, classic workspace) for full UX alignment
