# 23) Night QA Fix Task — Remote /atom Deployment Smoke

## Why this exists
Night QA validated local build + route behavior, but still lacks direct evidence from the latest remote deployment.

## Concrete task (execute at first available credentialed window)
1. Hit production `/atom` and `/api/atom/session/start` with valid auth context.
2. Run one two-turn continuity smoke in same session:
   - Turn 1: topic prompt (non-trivial clinical question)
   - Turn 2: `continue`
   - Assert continuation remains on same topic.
3. Force selected-source narrow mode with intentionally missing coverage and verify insufficiency wording is returned.
4. Archive transcript + headers + timestamp in `docs/specs/atom-vnext/` pulse note.

## Exit criteria
- Remote `/atom` returns healthy response under auth.
- Continuity smoke passes on remote, not just local.
- Source insufficiency behavior confirmed with evidence.
