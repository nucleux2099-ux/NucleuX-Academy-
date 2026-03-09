---
title: "Atom Phase A Spec"
summary: "Phase A scope isolation and workspace bootstrap implementation spec."
audience: "engineer"
status: "implemented"
source_path: "docs/atom-phase-a-spec.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A"
llm_handover_relevance: "high"
---

# ATOM Phase A Spec — Identity Isolation, User Workspaces, Single-Chat UX

## Architecture decisions

1. **Canonical scope key is the root identity primitive** for all ATOM session operations.
2. **Session store APIs now require `scopeKey`** for read/write access. Session lookup is scoped by:
   - `user_id`
   - `session_id`
   - canonical `thread_id` derived from `scopeKey`
3. **Thread ID is now a deterministic projection of scope key** (`scope:${scopeKey}` sanitized), preventing accidental shared/unscoped sessions.
4. **One active session per scoped key** enforced via existing unique constraint `unique(user_id, thread_id)`.
5. **Per-user workspace bootstrap** under an app-owned root with safe-path guard and idempotent file creation.
6. **Phase A UX keeps a single chat timeline + outputs panel**, with no thread selector/section in active UI.

## Canonical key spec

Implemented in `src/lib/atom/user-scope.ts`.

Supported strategies:
- `per-channel-peer` (default): `chan:${channel}:peer:${peer}`
- `per-account-channel-peer` (configurable): `acct:${account}:chan:${channel}:peer:${peer}`

Inputs:
- `accountId`
- `channel`
- `peerId` (fallback `peer`, then `userId`)

Normalization/sanitization:
- trim + lowercase
- allow `[a-z0-9._:-]`
- replace others with `_`
- collapse underscores
- length capped per segment

Canonical thread ID:
- `deriveAtomThreadIdForScope(scopeKey) => scope:${sanitizedScopeKey}`

## Workspace layout

Implemented in `src/lib/atom/user-workspace.ts`.

Root:
- `ATOM_USER_WORKSPACES_ROOT` env var, else `${process.cwd()}/.atom-userspaces`

Per-scope directory:
- `${root}/${sanitizeScopeKeyForPath(scopeKey)}`

Scaffolded files (idempotent):
- `AGENTS.md`
- `SOUL.md`
- `TOOLS.md`
- `USER.md`
- `IDENTITY.md`
- `HEARTBEAT.md`
- optional `BOOTSTRAP.md` when `ATOM_ENABLE_BOOTSTRAP_FILE=true`

Guards:
- resolved path must stay under root
- creation uses `wx` write flag (no overwrite)

## API changes

Affected routes:
- `POST /api/atom/session/start`
- `GET /api/atom/session/threads`
- `GET /api/atom/session/[sessionId]`
- `POST /api/atom/session/[sessionId]/message`
- `POST /api/atom/session/[sessionId]/continue`

Behavioral changes:
- routes derive canonical scope from request/body/header identity hints
- session fetches now enforce `thread_id === deriveAtomThreadIdForScope(scopeKey)`
- message writes/reads/cursor updates verify session ownership within scope key

## Migration plan (Phase A)

Backwards compatibility strategy in `startOrResumeAtomSession`:
1. Resolve canonical thread for scope.
2. If no canonical session exists, attempt to find latest non-canonical legacy thread for same user + room.
3. Migrate that session in place by updating `thread_id` to canonical thread.
4. Continue normal upsert/read path.

Notes:
- This is a lightweight in-app migration path (no schema migration required).
- Preserves existing message history by reusing session row.

## Threat model: cross-user leak prevention

Primary risks:
1. **Cross-peer leakage under same authenticated user** (e.g., Telegram peer A reading peer B’s session)
2. **Unscoped session access via raw `sessionId`**
3. **Path traversal in workspace scaffolding**

Mitigations:
- session store scope guard (`user_id` + canonical `thread_id` + `session_id`)
- scope-thread mismatch hard fail in `resolveCanonicalThread`
- route-level scope derivation + mandatory scoped store functions
- workspace root boundary check + sanitized directory naming
- non-overwriting bootstrap writes

Residual risk:
- if callers intentionally provide wrong channel/account/peer metadata consistently, they can open a different valid scope for the same auth principal. This is expected behavior; not a leak.

## Test strategy

Added tests:
- `src/lib/atom/__tests__/user-scope.test.ts`
  - key derivation for both strategies
  - sanitization behavior
  - canonical thread ID checks
- `src/lib/atom/__tests__/session-scope-guard.test.ts`
  - mismatch guardrail for explicit thread IDs
- `src/lib/atom/__tests__/user-workspace.test.ts`
  - first-run scaffold creation
  - repeat-run idempotency

Validation gates:
- build
- typecheck (`tsc --noEmit`)
- atom route smoke test (`npm run test:atom:route-smoke`)

## Rollback plan

If rollback is needed:
1. Revert route + session-store scope enforcement commit.
2. Keep workspace scaffolding code isolated (safe to retain).
3. Remove/ignore scope-key thread mapping and revert to prior `user_id + session_id` checks.
4. If migrated thread IDs need rollback, remap canonical `scope:*` thread IDs back to legacy naming via SQL script (optional, data-safe if not required).
