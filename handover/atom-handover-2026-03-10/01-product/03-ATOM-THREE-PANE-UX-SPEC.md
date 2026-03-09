---
title: "03 Atom Three Pane Ux Spec"
summary: "Canonical product documentation snapshot for ATOM handover."
audience: "product"
status: "implemented"
source_path: "docs/product/03-ATOM-THREE-PANE-UX-SPEC.md"
last_verified_at: "2026-03-10T01:17:24+05:30"
phase_tags: "A/B/C/D/E"
llm_handover_relevance: "high"
---

# ATOM Three-Pane UX Specification

**Related:** [01-PRODUCT-OVERVIEW](./01-PRODUCT-OVERVIEW.md) · [04-BACKEND-ARCHITECTURE](./04-BACKEND-ARCHITECTURE.md) · [10-DOCTOR-QUICKSTART](./10-DOCTOR-QUICKSTART.md)

## 1) UX intent

ATOM’s three-pane layout is designed for a doctor’s actual cognitive flow:
- **Prepare context** (left),
- **ask/think/respond** (center),
- **capture outputs** (right).

Current implementation source: `src/components/atom/LegacyAtomWorkspace.tsx`.

## 2) Information architecture (left/center/right)

```text
+------------------+-------------------------------+----------------------+
| LEFT: Cockpit    | CENTER: Conversation          | RIGHT: Outputs       |
| - Source filters | - Session status              | - Timeline events    |
| - Book selection | - Chat history                | - Artifacts list     |
| - Topic/goal     | - Feedback controls           | - Download action    |
| - Profile prefs  | - Composer                    |                      |
| - Quality cards  |                               |                      |
+------------------+-------------------------------+----------------------+
```

## 3) Left pane spec (Context Cockpit)

### User-visible purpose
“Control what ATOM is allowed to use and how it should respond.”

### Current behaviors
- Source catalog load from `/api/atom/sources`
- Filters: level + domain + pending sources toggle
- Multi-select source books
- Topic + goal + room profile selectors
- Response preferences synced via `/api/atom/profile`:
  - response style
  - difficulty preference
  - format preference
  - pace
- Quality ops cards from telemetry endpoints:
  - `/api/atom/telemetry/calibration`
  - `/api/atom/telemetry/alerts`
  - `/api/atom/telemetry/rollups`

### Caveats
- Room modes and advanced launch exist but not all paths are fully production-wired.

## 4) Center pane spec (Clinical Consult Core)

### User-visible purpose
“Run a focused doctor conversation with continuity.”

### Current behaviors
- Session auto-hydration from canonical scoped thread (`/api/atom/session/threads`, `/api/atom/session/:id`)
- Chat send to:
  - `/api/atom/session/:id/message`
  - `/api/atom/session/:id/continue` when user asks for continuation
- Assistant/user message timeline with markdown rendering
- Inline response feedback controls:
  - helpful / needs fix
  - optional reason
  - resolved/unresolved

### Reliability behavior
- Shows loading state during hydration
- Error cards for API failure, feedback failure, sync failure

## 5) Right pane spec (Outputs Rail)

### User-visible purpose
“See what happened and take away reusable outputs.”

### Current behaviors
- Timeline events (task/event updates)
- Artifact cards merged from:
  - persisted v1 artifacts
  - parser/code-block extracted assistant outputs
- Download priority:
  1. Scoped download API `/api/atom/session/:sessionId/artifacts/:artifactId/download`
  2. local fallback blob download

## 6) User journeys

## Journey A: Clinical consult
1. Doctor selects sources + sets topic.
2. Sends focused case question.
3. Reviews structured response.
4. Marks feedback.
5. Downloads key artifact.

## Journey B: Learning/revision
1. Sets goal for exam recall.
2. Iteratively asks “continue / next / more”.
3. Uses profile controls to tune detail/difficulty.
4. Captures final summary artifact.

## Journey C: Research synthesis
1. Chooses deep source subset.
2. Requests synthesis with explicit constraints.
3. Validates response quality via right-side ops signals.
4. Exports artifact for external review.

## Journey D: Output export for teaching
1. Generate concise structured explanation.
2. Open outputs pane and inspect artifact quality.
3. Download and repurpose for PPT/teaching sheet.

## 7) Mobile adaptation guidance (target)

Current desktop-first shell should adapt into stacked panes:

```text
Mobile Tab Model
[Context] [Consult] [Outputs]

- Context tab: source + profile controls
- Consult tab: full chat + composer
- Outputs tab: timeline + artifacts + download
```

Recommended behaviors:
- Preserve scoped session continuity across tabs.
- Keep composer always sticky in Consult tab.
- Do not hide feedback controls; collapse into compact row.

## 8) UX quality guardrails
- Never send chat with zero selected sources (already enforced in composer button state).
- Always show status badge for trust in long-running workflows.
- Keep outputs independent from conversation scroll.

## Decisions
- Maintain three-pane mental model as product constant.
- Keep feedback controls embedded in assistant messages.

## Actions
- Complete UX-2 composer revamp under feature flag.
- Add explicit mobile-first navigation implementation.

## Open Questions
- Should outputs pane auto-open when new artifact arrives?
- Should source selection be made mandatory per room profile type?
