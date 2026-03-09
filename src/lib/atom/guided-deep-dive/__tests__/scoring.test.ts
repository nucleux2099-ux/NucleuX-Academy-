import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateStep } from '@/lib/atom/guided-deep-dive/scoring';

test('hint + confidence penalties applied deterministically', () => {
  const result = evaluateStep('active-recall', {
    accuracyPct: 70,
    hintCount: 2,
    avgResponseSec: 20,
    confidenceSelf: 4,
  });

  assert.equal(result.score, 60);
  assert.equal(result.band, 'borderline');
});
