import test from 'node:test';
import assert from 'node:assert/strict';
import { createGuidedDeepDiveSessionState } from '@/lib/atom/guided-deep-dive/session-state';
import { advanceGuidedDeepDive } from '@/lib/atom/guided-deep-dive/runtime';

test('B-03 diagnose weak moves to atomic-explain with remedial mode', () => {
  const session = createGuidedDeepDiveSessionState({ topic: 'DKA', level: 'resident', goal: 'master' });
  const { state } = advanceGuidedDeepDive(session, { accuracyPct: 35, hintCount: 0, avgResponseSec: 20, confidenceSelf: 3 });
  assert.equal(state.currentStep, 'atomic-explain');
  assert.equal(state.adaptiveMode, 'remedial');
});

test('B-07/B-10/B-12 happy path completes and creates retrieval schedule', () => {
  let state = createGuidedDeepDiveSessionState({ topic: 'Sepsis', level: 'resident', goal: 'master' });
  state = advanceGuidedDeepDive(state, { accuracyPct: 82, hintCount: 0, avgResponseSec: 20, confidenceSelf: 4 }).state;
  state = advanceGuidedDeepDive(state, { accuracyPct: 72, hintCount: 0, avgResponseSec: 20, confidenceSelf: 3 }).state;
  state = advanceGuidedDeepDive(state, { accuracyPct: 84, hintCount: 0, avgResponseSec: 20, confidenceSelf: 4 }).state;
  state = advanceGuidedDeepDive(state, { accuracyPct: 78, hintCount: 0, avgResponseSec: 20, confidenceSelf: 4 }).state;
  state = advanceGuidedDeepDive(state, { accuracyPct: 74, hintCount: 0, avgResponseSec: 20, confidenceSelf: 4 }).state;

  assert.equal(state.status, 'completed');
  assert.equal(state.currentStep, 'reflection');
  assert.equal(state.retrievalCheckpoint.intervalDays.length, 3);
});

test('B-14 loop cap sets needs-reinforcement and day-1 due', () => {
  let state = createGuidedDeepDiveSessionState({ topic: 'ARDS', level: 'resident', goal: 'master' });
  for (let i = 0; i < 8; i += 1) {
    state = advanceGuidedDeepDive(state, { accuracyPct: 40, hintCount: 3, avgResponseSec: 80, confidenceSelf: 4 }).state;
  }
  assert.equal(state.status, 'needs-reinforcement');
  assert.ok(state.retrievalCheckpoint.dueAt.length >= 1);
});
