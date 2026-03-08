# ATOM Night Execution Sheet

**Date:** 2026-03-09  
**Owner:** Sarath + ATOM Autopilot  
**Source pack:** `docs/reference/openclaw-atom-distilled/ATOM_OPENCLAW_DISTILLED_INDEX.md`

---

## 0) Objective for tonight

Ship **session-stable, source-grounded, continuation-safe ATOM chat** on `/atom`.

Success means:
1. `continue` resumes same topic/format reliably.
2. selected books are enforced in grounding.
3. long outputs do not drift after interruptions.
4. UI stays simple and usable.

---

## 1) Module plan (read -> implement -> validate)

## Module A — Session Core (highest priority)

### Read first
- `/concepts/session`
- `/reference/session-management-compaction`
- `/cli/sessions`
- `/concepts/session-tool`

### Implement
1. Add tables:
   - `atom_sessions`
   - `atom_session_messages`
   - `atom_session_summaries`
2. Add APIs:
   - `POST /api/atom/session/start`
   - `POST /api/atom/session/:id/message`
   - `POST /api/atom/session/:id/continue`
   - `GET /api/atom/session/:id`
3. Bind thread -> session ID in frontend state.

### Validate
- [ ] Same thread, multi-turn answer keeps context
- [ ] Refresh page, session continuity preserved
- [ ] `continue` does not switch topic

---

## Module B — Memory + Context discipline

### Read first
- `/concepts/memory`
- `/concepts/context`

### Implement
1. Distinguish:
   - session transcript context (short-term)
   - optional durable facts (long-term, deferred)
2. Build prompt from:
   - latest session summary
   - last N turns
   - current message
3. Add explicit `continueLike` handling in backend query builder.

### Validate
- [ ] Prompt payload contains prior turns for follow-up
- [ ] `continue` uses previous user query anchor, not raw "continue"

---

## Module C — Source grounding strictness

### Read first
- Distilled references from session/memory/context groups

### Implement
1. Add deterministic `book_id -> content scope` map.
2. Retrieval only from selected scopes in strict mode.
3. Return insufficiency message when evidence absent.
4. Attach used source paths in response metadata.

### Validate
- [ ] Sabiston selected + trauma query uses surgery/trauma-relevant scope
- [ ] Non-matching query returns insufficiency (not hallucinated citations)
- [ ] Source paths visible for debugging

---

## Module D — Streaming, partials, and resume safety

### Read first
- `/concepts/streaming`
- `/concepts/compaction`
- `/concepts/session-pruning`

### Implement
1. Persist assistant turn incrementally or at completion with cursor checkpoint.
2. Store continuation cursor:
   - last heading
   - last outline item
   - expected output format
3. On interrupted stream, `/continue` resumes from cursor.

### Validate
- [ ] Force-interrupt a long answer, then continue resumes correctly
- [ ] No restart from unrelated topic

---

## Module E — UI pass (simple high-end chat)

### Implement
1. Keep current simple center chat design.
2. Add visible chips:
   - Session ID (short)
   - Grounding mode (strict)
   - Sources selected count
3. Add continue action that hits `/session/:id/continue`.

### Validate
- [ ] Clean chat UX remains minimal
- [ ] No old run/stop/branch controls
- [ ] Continuation UX obvious and reliable

---

## 2) Execution timeline (IST)

- **00:00–00:30**: migrations + repositories (Module A)
- **00:30–01:30**: session APIs + frontend binding (Module A)
- **01:30–02:15**: continue semantics + context discipline (Module B)
- **02:15–03:15**: strict source scope map + retrieval policy (Module C)
- **03:15–04:00**: streaming resume cursor + continue endpoint hardening (Module D)
- **04:00–04:30**: UI polish + badges/chips (Module E)
- **04:30–05:00**: full smoke + build + deploy candidate

---

## 3) Quality gates (must pass)

1. `pnpm -s tsc --noEmit`
2. `pnpm -s build`
3. Chat smoke:
   - turn1 prompt
   - turn2 follow-up
   - continue
4. Grounding smoke:
   - selected Sabiston + trauma query
   - verify source scopes used
5. Recovery smoke:
   - interrupt long output, continue resume

---

## 4) Rollback plan

If regression appears:
1. Disable new session route usage in frontend (toggle).
2. Fallback to previous `/api/chat` path.
3. Keep DB migrations additive (no destructive rollback required).
4. Re-deploy last known stable commit.

---

## 5) Progress update format (for autopilot + manual)

Use this exact block each check-in:

- ✅ Done:
- 🟡 In progress:
- ⛔ Blocker:
- ▶️ Next 30 min:
- 🧪 Gate status: (`tsc` / `build` / `smoke`)

---

## 6) Definition of done (tonight)

- Session-backed chat live in `/atom`
- `continue` deterministic and topic-safe
- strict selected-book grounding active
- minimal clean UI intact
- deploy passes and user validates with trauma test
