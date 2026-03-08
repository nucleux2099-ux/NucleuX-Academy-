# ATOM Cockpit Redesign Spec v1 (Chat-First)

**Owner:** ATOM v3 execution stream (UX + frontend)  
**Repo:** `/Users/adityachandrabhatla/nucleux-academy`  
**Date:** 2026-03-08  
**Status:** Design + implementation-ready (backend-compatible)

---

## 1) Purpose and outcome

This spec defines a professional, sleek, **chat-first cockpit UI** for ATOM v3 that:

1. Prioritizes rapid conversation-driven workflows,
2. Keeps contextual tools discoverable but unobtrusive,
3. Preserves compatibility with existing backend contracts for:
   - **Track A** (NucleuX Original / deep-research-first runtime),
   - **Track B** (Guided Deep Dive runtime),
   - Existing **atom task orchestration** (task IDs, statuses, outputs).

Design principle: **“Focus center, context left, outputs on demand.”**

---

## 2) Information Architecture (IA)

## 2.1 Primary layout regions

The cockpit is a 3-region shell:

1. **Left Sidebar (collapsible, fixed width when expanded)**
   - Split **50/50 vertical**:
     - **Top half: Threads** (session history, pinned, recent)
     - **Bottom half: Resources** (files, references, notes, attachments)
2. **Center Panel (primary)**
   - Chat timeline + prompt/composer surface
3. **Right Drawer (optional)**
   - Outputs / artifacts / structured task results
   - **Hidden by default** and opened only on user intent

## 2.2 Navigation hierarchy

- Level 1: Workspace (ATOM Cockpit)
- Level 2: Active Thread
- Level 3: Active Workflow Preset (MCQ, PPT, NucleuX Original, GDD, etc.)
- Level 4: Message-level operations (retry, edit, copy, open artifact)

## 2.3 Interaction priorities

1. Message and compose quickly (highest priority)
2. Switch thread context
3. Switch workflow preset
4. Inspect outputs/artifacts
5. Manage resources

---

## 3) Wireframe (text spec)

## 3.1 Desktop default (>=1280px)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Top Bar: ATOM logo | Thread title | status chips | global actions          │
├───────────────┬───────────────────────────────────────┬─────────────────────┤
│ LEFT SIDEBAR  │ CENTER CHAT PANEL                     │ RIGHT OUTPUTS       │
│ (expanded)    │                                       │ DRAWER (closed by   │
│               │ [message timeline scroll area]        │ default)            │
│ ┌───────────┐ │                                       │                     │
│ │ Threads   │ │                                       │                     │
│ │ (50%)     │ │                                       │                     │
│ └───────────┘ │                                       │                     │
│ ┌───────────┐ │                                       │                     │
│ │ Resources │ │                                       │                     │
│ │ (50%)     │ │                                       │                     │
│ └───────────┘ │───────────────────────────────────────│                     │
│               │ Preset dropdown (above composer)      │                     │
│               │ Gemini-style composer + send/actions  │                     │
└───────────────┴───────────────────────────────────────┴─────────────────────┘
```

## 3.2 Composer zone behavior

- Preset dropdown is anchored immediately above composer.
- Composer uses clean rounded field, low visual noise, optional quick actions.
- Enter = send; Shift+Enter = newline.
- Optional action chips: attach, voice, retry, stop.

## 3.3 Right drawer behavior

- Default: hidden (no occupied width)
- Trigger: “Outputs” icon/button in top bar or message-level artifact click
- Modes:
  - Peek (overlay, non-disruptive)
  - Docked (persistent while open)

---

## 4) Component map (UI ↔ functional responsibilities)

| Component | Responsibility | Data source / contract | Notes |
|---|---|---|---|
| `CockpitShell` | 3-region layout, sizing, panel state | Local UI state + URL params | Controls collapse/open states |
| `LeftSidebar` | Container for threads/resources | Thread/resource APIs | Collapsible |
| `ThreadPane` | List/search/switch threads | Existing thread/session endpoints | Must preserve thread IDs |
| `ResourcePane` | List/manage references/files | Existing resource attachment contracts | 50% height in sidebar |
| `ChatPanel` | Message timeline rendering | Message stream + task status stream | Primary focus region |
| `PresetSelector` | Workflow preset switching | Mapped to existing mode/task payload fields | Above composer |
| `GeminiComposer` | Prompt input + send + interrupts | Existing launch/continue APIs | Chat-first UX |
| `OutputsDrawer` | Artifacts/structured outputs | Existing task output payloads | Hidden by default |
| `StatusChips` | Track state, task lifecycle visibility | Task status enums (unchanged) | Non-intrusive |
| `CompatAdapter` | UI-to-backend payload normalization | Track A/B + atom task contracts | Additive-only mapping |

---

## 5) Backend compatibility constraints (non-negotiable)

## 5.1 Contract preservation

UI redesign must be **presentation-first, contract-stable**:

- No breaking changes to existing API request/response envelopes.
- Keep existing identifiers stable:
  - `threadId`, `sessionId`, `taskId`, `mode`, `status`.
- Additions are allowed only as optional UI metadata fields.

## 5.2 Track mapping

- **Track A** (NucleuX Original / deep-research-first):
  - Preset selector must route to current Track A mode payload without field renames.
- **Track B** (Guided Deep Dive):
  - Preset selector must route to existing `guided-deep-dive` runtime launch/continue contracts.
- Shared atom tasks:
  - Output drawer reads existing artifact structures (markdown/text/json/files) without altering schema.

## 5.3 Compatibility strategy

- Introduce a frontend-only `CompatAdapter` layer:
  - `UIPreset -> backend.mode`
  - `UIThreadSelection -> existing session fetch`
  - `UIDrawerView -> existing artifacts map`
- Feature flag rollout to allow fallback to previous cockpit if needed.

---

## 6) Responsive behavior

## 6.1 Breakpoints

- **Desktop (>=1280px):** left sidebar expanded by default, right drawer closed by default.
- **Laptop/tablet landscape (960–1279px):** left sidebar collapsible; right drawer overlays center.
- **Mobile (<960px):** single-column chat-first; left and right panels become slide-over sheets.

## 6.2 Panel rules by viewport

1. Desktop:
   - Left: 280–340px
   - Center: fluid, min 640px
   - Right drawer when open: 360–420px
2. Tablet:
   - Left defaults collapsed to icon rail
   - Preset selector remains above composer
3. Mobile:
   - Default visible: timeline + composer only
   - Threads/resources accessed via bottom/top sheet actions
   - Outputs drawer as full-height modal sheet

## 6.3 Input ergonomics

- Sticky composer on all viewport sizes
- Respect safe-area insets on mobile
- Touch targets >= 40px

---

## 7) Visual and interaction language

- Tone: clinical-professional, modern, low-clutter.
- Surface hierarchy:
  - Primary focus contrast on center panel,
  - Subdued neutrals for side regions,
  - Accent only for state and key actions.
- Motion:
  - Sidebar collapse/expand: 160–220ms ease
  - Drawer open/close: 180–240ms
- Accessibility:
  - Keyboard navigable threads/messages/composer,
  - AA contrast,
  - Visible focus rings,
  - Semantic landmarks for screen readers.

---

## 8) Non-goals (v1)

1. Rewriting backend orchestration logic.
2. Introducing new task status enums or lifecycle semantics.
3. Changing Track A/B scoring/pedagogy rules.
4. Advanced AI personalization of layout.
5. Full design system overhaul outside cockpit scope.

---

## 9) Rollout phases (UX-1 / UX-2 / UX-3)

## UX-1 — Shell and navigation foundation

**Scope:**
- New cockpit shell with left/center/right architecture
- Left sidebar 50/50 split (threads/resources)
- Basic collapsible behavior
- Center chat timeline migration

**Exit criteria:**
- Existing thread switching works unchanged
- No regression in message send/receive
- Right drawer remains disabled/hidden

## UX-2 — Composer and workflow control

**Scope:**
- Gemini-style composer implementation
- Preset dropdown above composer
- Workflow mapping to existing Track A/B + atom modes via adapter
- Keyboard/touch UX polish

**Exit criteria:**
- Preset changes correctly map to legacy-compatible payloads
- Compose/send latency parity or better vs current cockpit
- Accessibility checks pass for composer flow

## UX-3 — Outputs drawer and polish

**Scope:**
- Right outputs drawer (hidden by default)
- Artifact rendering states (loading/empty/error/success)
- Final responsive and motion polish
- Feature flag + gradual release controls

**Exit criteria:**
- Drawer opens on demand without disrupting active composition
- Artifact compatibility validated across Track A/B tasks
- Usability benchmark and regression tests complete

---

## 10) Success metrics

## 10.1 Product/UX metrics

1. **Time-to-first-message (TTFM):** reduce by >= 20%
2. **Thread switch time:** reduce median by >= 25%
3. **Preset discoverability:** >= 90% users can switch workflow without guidance
4. **Composer completion rate:** >= 98% successful send (no accidental mode confusion)
5. **Outputs drawer usage:** opened in >= 40% artifact-generating sessions (without harming completion)

## 10.2 Engineering/quality metrics

1. **Backend compatibility:** 0 breaking contract incidents in Track A/B launch + continuation paths
2. **UI performance:** maintain smooth interactions at >= 55 FPS during panel transitions on target devices
3. **Error rate:** no increase in task launch failures attributable to UI mapping
4. **Regression gate:** all existing atom task integration tests pass

## 10.3 Operational metrics

- Feature-flag rollback possible within one deploy cycle
- UX-1/2/3 each independently shippable

---

## 11) Implementation notes and guardrails

- Keep redesign behind a named feature flag: `atomCockpitV3`.
- Preserve deep links to existing thread/session routes.
- Add telemetry events for:
  - sidebar collapse/expand,
  - preset changed,
  - drawer opened/closed,
  - send initiated/success/fail.
- Ensure old and new cockpit can coexist during migration.

---

## 12) Final acceptance checklist

- [ ] Left sidebar is collapsible and split 50/50 (threads/resources)
- [ ] Center panel is chat-first with clean Gemini-style composer
- [ ] Preset dropdown is above composer with required workflows (MCQ/PPT/NucleuX Original/GDD/etc.)
- [ ] Right outputs drawer is optional and hidden by default
- [ ] Track A/B and atom task backend contracts remain compatible
- [ ] Responsive behavior validated desktop/tablet/mobile
- [ ] UX-1/UX-2/UX-3 rollout gates documented and testable
- [ ] Success metrics instrumented and review-ready

---

This spec is approved as the execution baseline for ATOM cockpit redesign v1.