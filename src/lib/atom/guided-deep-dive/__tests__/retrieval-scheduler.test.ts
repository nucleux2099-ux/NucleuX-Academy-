import test from 'node:test';
import assert from 'node:assert/strict';
import { initializeRetrievalCheckpoint, updateRetrievalCheckpoint } from '@/lib/atom/guided-deep-dive/retrieval-scheduler';

test('B-15 low quality reset drops to D1 and EF floor respected', () => {
  let checkpoint = initializeRetrievalCheckpoint(new Date('2026-01-01T00:00:00.000Z'));
  checkpoint = updateRetrievalCheckpoint(checkpoint, 45, new Date('2026-01-02T00:00:00.000Z'));
  assert.equal(checkpoint.intervalDays[0], 1);
  assert.ok(checkpoint.easeFactor >= 1.3);
});

test('B-16 high quality grows intervals monotonically', () => {
  let checkpoint = initializeRetrievalCheckpoint(new Date('2026-01-01T00:00:00.000Z'));
  checkpoint = updateRetrievalCheckpoint(checkpoint, 95);
  checkpoint = updateRetrievalCheckpoint(checkpoint, 95);
  checkpoint = updateRetrievalCheckpoint(checkpoint, 95);
  assert.ok(checkpoint.intervalDays[0] >= 1);
  assert.ok(checkpoint.intervalDays[1] >= checkpoint.intervalDays[0]);
  assert.ok(checkpoint.intervalDays[2] >= checkpoint.intervalDays[1]);
});
