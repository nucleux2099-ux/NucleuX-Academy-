import test from 'node:test';
import assert from 'node:assert/strict';
import { applyRoomDefaults, resolveAtomRoomProfile } from '@/lib/atom/room-profiles';

test('resolveAtomRoomProfile falls back to atom for unknown room', () => {
  const profile = resolveAtomRoomProfile('unknown-room');
  assert.equal(profile.roomId, 'atom');
});

test('applyRoomDefaults keeps manual overrides while applying new room defaults', () => {
  const library = resolveAtomRoomProfile('library');
  const next = applyRoomDefaults(
    {
      topic: 'Manual hepatobiliary topic',
      level: 'resident',
      timeAvailable: '55',
      goal: 'Manual goal',
      mode: 'mcq',
    },
    library,
    {
      topic: true,
      goal: true,
      level: false,
      timeAvailable: false,
    },
  );

  assert.equal(next.topic, 'Manual hepatobiliary topic');
  assert.equal(next.goal, 'Manual goal');
  assert.equal(next.level, library.defaultLevel);
  assert.equal(next.timeAvailable, String(library.defaultTimeMinutes));
  assert.equal(next.mode, 'nucleux-original');
});

test('applyRoomDefaults moves mode to room default when mode is not enabled', () => {
  const classroom = resolveAtomRoomProfile('classroom');
  const next = applyRoomDefaults(
    {
      topic: 'Any',
      level: 'intern',
      timeAvailable: '20',
      goal: 'Any',
      mode: 'guided-deep-dive',
    },
    classroom,
    {},
  );

  assert.equal(next.mode, classroom.defaultMode);
});
