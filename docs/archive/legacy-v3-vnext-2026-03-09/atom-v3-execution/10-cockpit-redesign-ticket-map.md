# ATOM Cockpit Redesign — Execution Ticket Map (UX1 / UX2 / UX3)

**Source scope:** `09-cockpit-redesign-spec-v1.md`  
**Repo:** `/Users/adityachandrabhatla/nucleux-academy`  
**Date:** 2026-03-08  
**Status:** Execution-ready ticket breakdown

---

## 1) Ticket Inventory (with owners)

## UX1 — Shell + IA Foundation

| Ticket ID | Title | Primary Owner | Supporting Owners | Deliverable |
|---|---|---|---|---|
| UX1-01 | Build `CockpitShell` 3-region layout scaffold | Frontend Engineer (Shell) | UX Engineer | Left/center/right structural layout with state model |
| UX1-02 | Implement `LeftSidebar` 50/50 split (Threads/Resources) | Frontend Engineer (Sidebar) | UX Engineer | Split-pane sidebar with stable sizing behavior |
| UX1-03 | Migrate center chat timeline into `ChatPanel` | Frontend Engineer (Chat) | QA Engineer | Current timeline functionality rendered in new center panel |
| UX1-04 | Thread switching parity in new shell | Frontend Engineer (Data/UI) | QA Engineer | Existing thread/session switching works unchanged |
| UX1-05 | Sidebar collapse/expand interactions + persistence | UX Engineer | Frontend Engineer (Shell) | Smooth collapse state with local persistence |
| UX1-06 | UX1 regression pack + acceptance evidence | QA Engineer | Frontend + Product Owner | Gate evidence for send/receive/thread switching parity |

## UX2 — Composer + Preset Runtime Mapping

| Ticket ID | Title | Primary Owner | Supporting Owners | Deliverable |
|---|---|---|---|---|
| UX2-01 | Implement `GeminiComposer` base (send/newline/interrupt controls) | Frontend Engineer (Composer) | UX Engineer | Chat-first composer with Enter/Shift+Enter behavior |
| UX2-02 | Add `PresetSelector` above composer | UX Engineer | Frontend Engineer (Composer) | Preset control anchored above composer |
| UX2-03 | Build `CompatAdapter` preset→mode mapping | Frontend Engineer (Platform) | Backend Engineer (Consult) | `UIPreset -> backend.mode` additive mapping |
| UX2-04 | Track A/B launch+continue contract compatibility tests | QA Engineer | Frontend Engineer (Platform) | Automated/manual proof no envelope breakage |
| UX2-05 | Composer accessibility and keyboard navigation polish | UX Engineer | QA Engineer | AA contrast, focus rings, keyboard flow pass |
| UX2-06 | Telemetry events for compose/preset interactions | Frontend Engineer (Telemetry) | Product Analyst | Events: preset changed, send initiated/success/fail |

## UX3 — Outputs Drawer + Responsive Polish + Rollout Safety

| Ticket ID | Title | Primary Owner | Supporting Owners | Deliverable |
|---|---|---|---|---|
| UX3-01 | Implement `OutputsDrawer` hidden-by-default (peek/docked) | Frontend Engineer (Drawer) | UX Engineer | On-demand drawer without default width occupation |
| UX3-02 | Artifact rendering states (loading/empty/error/success) | Frontend Engineer (Drawer/Data) | QA Engineer | Stable render states across atom artifact payloads |
| UX3-03 | Cross-track artifact compatibility validation (Track A/B) | QA Engineer | Frontend + Backend (Consult) | Compatibility matrix with proof artifacts |
| UX3-04 | Responsive rules (desktop/tablet/mobile panel behavior) | UX Engineer | Frontend Engineer (Shell) | Viewport-specific panel/drawer/sheet behavior |
| UX3-05 | Feature flag rollout + fallback to old cockpit (`atomCockpitV3`) | Frontend Engineer (Platform) | DevOps Engineer | Gradual rollout + one-cycle rollback readiness |
| UX3-06 | Motion/performance/usability benchmark and final gate pack | QA Engineer | UX + Frontend + Product Owner | FPS/usability/regression evidence for release sign-off |

---

## 2) Dependency Graph

```text
UX1-01 -> UX1-02 -> UX1-03 -> UX1-04 -> UX1-06
     \-> UX1-05 ----/

UX1-06 -> UX2-01 -> UX2-02 -> UX2-03 -> UX2-04 -> UX2-06
                          \-> UX2-05 ----/

UX2-04 -> UX3-01 -> UX3-02 -> UX3-03 -> UX3-06
       \-> UX3-04 ----/
       \-> UX3-05 ----/
```

### Critical path
`UX1-01 → UX1-02 → UX1-03 → UX1-04 → UX1-06 → UX2-01 → UX2-02 → UX2-03 → UX2-04 → UX3-01 → UX3-02 → UX3-03 → UX3-06`

---

## 3) Merge Sequence (PR order)

Use short-lived branches and merge in this order to reduce conflicts:

1. `feat/ux1-01-cockpit-shell-layout`
2. `feat/ux1-02-sidebar-split`
3. `feat/ux1-03-chatpanel-migration`
4. `feat/ux1-04-thread-switch-parity`
5. `feat/ux1-05-sidebar-collapse-state`
6. `test/ux1-06-regression-pack`
7. `feat/ux2-01-gemini-composer`
8. `feat/ux2-02-preset-selector`
9. `feat/ux2-03-compat-adapter`
10. `test/ux2-04-track-compat-validation`
11. `feat/ux2-05-composer-a11y-polish`
12. `feat/ux2-06-compose-telemetry`
13. `feat/ux3-01-outputs-drawer`
14. `feat/ux3-02-artifact-render-states`
15. `test/ux3-03-artifact-compat-matrix`
16. `feat/ux3-04-responsive-polish`
17. `ops/ux3-05-feature-flag-rollout`
18. `test/ux3-06-final-benchmark-gate`

### Merge policy
- UX1 must be fully green before UX2 merges.
- UX2 compatibility gates must be green before UX3 starts.
- UX3-05 (feature flag/rollback) must merge before final UX3 release gate completion.

---

## 4) Gate Checks (must pass)

## Gate A — UX1 foundation gate
- [ ] 3-region shell renders correctly (desktop baseline)
- [ ] Left sidebar 50/50 split implemented
- [ ] Thread switching parity confirmed (no ID/session regressions)
- [ ] Message send/receive path unchanged
- [ ] Right drawer remains disabled/hidden in UX1

## Gate B — UX2 contract + composer gate
- [ ] Preset selector is above composer and keyboard accessible
- [ ] `CompatAdapter` mapping preserves `threadId/sessionId/taskId/mode/status`
- [ ] Track A launch/continue compatibility pass
- [ ] Track B launch/continue compatibility pass
- [ ] Compose latency parity (or better) vs current cockpit
- [ ] A11y checks pass for composer flow

## Gate C — UX3 outputs + rollout gate
- [ ] Outputs drawer hidden by default; opens on explicit intent
- [ ] Artifact states render correctly across loading/empty/error/success
- [ ] Track A/B artifact payload compatibility validated
- [ ] Responsive behaviors validated for desktop/tablet/mobile
- [ ] Feature flag `atomCockpitV3` supports fallback to old cockpit
- [ ] Regression + usability + performance benchmark complete

## Gate D — Release readiness gate
- [ ] Type check/lint/build pass
- [ ] Core integration tests pass
- [ ] Telemetry events verified in staging
- [ ] Rollback tested within one deploy cycle
- [ ] Product + QA + Engineering sign-off recorded

---

## 5) One-Week Execution Timeline (IST)

## Day 1 (Mon)
- Kickoff + branch prep + scope reconfirm
- Execute: UX1-01, UX1-02
- Start UX1-03

## Day 2 (Tue)
- Complete UX1-03, UX1-04, UX1-05
- Execute UX1-06
- **Milestone:** Gate A decision (GO/NO-GO)

## Day 3 (Wed)
- Execute UX2-01, UX2-02
- Start UX2-03

## Day 4 (Thu)
- Complete UX2-03
- Execute UX2-04, UX2-05, UX2-06
- **Milestone:** Gate B decision (GO/NO-GO)

## Day 5 (Fri)
- Execute UX3-01, UX3-02
- Start UX3-04 (responsive work can run in parallel)

## Day 6 (Sat)
- Execute UX3-03, complete UX3-04
- Execute UX3-05

## Day 7 (Sun)
- Execute UX3-06
- Run Gate C + Gate D full checks
- Freeze RC candidate + publish execution summary

---

## 6) Risk Notes and Mitigation

- **Risk:** Contract drift in preset mapping.  
  **Mitigation:** UX2-03 paired with UX2-04 before any UX3 functional merge.
- **Risk:** Drawer impacts compose focus/perf.  
  **Mitigation:** Isolate drawer state; benchmark in UX3-06.
- **Risk:** Responsive regressions near release.  
  **Mitigation:** Pull UX3-04 earlier (Day 5) and keep daily device spot-check.

---

This ticket map is the execution baseline for cockpit redesign implementation and merge control.