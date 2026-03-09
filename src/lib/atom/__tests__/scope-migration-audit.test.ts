import test from 'node:test';
import assert from 'node:assert/strict';
import { assessRemapConfidence } from '@/lib/atom/scope-migration-audit';

test('assessRemapConfidence marks deterministic legacy mapping as safe-auto-remap', () => {
  const out = assessRemapConfidence({
    user_id: 'u1',
    room_id: 'room-alpha',
    thread_id: 'room-alpha',
  });

  assert.equal(out.bucket, 'safe-auto-remap');
  assert.equal(out.score >= 0.85, true);
});

test('assessRemapConfidence marks opaque legacy mapping as manual review', () => {
  const out = assessRemapConfidence({
    user_id: 'u1',
    room_id: 'room-alpha',
    thread_id: '123e4567-e89b-12d3-a456-426614174000',
  });

  assert.equal(out.bucket, 'needs-manual-review');
  assert.equal(out.score < 0.85, true);
  assert.match(out.reason, /opaque|metadata|verify/i);
});
