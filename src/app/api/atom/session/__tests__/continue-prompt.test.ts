import test from 'node:test';
import assert from 'node:assert/strict';
import { buildContinueMessage } from '../[sessionId]/continue/route';

test('continue prompt keeps previous topic when available', () => {
  const out = buildContinueMessage('Acute pancreatitis severity stratification');
  assert.match(out, /about: Acute pancreatitis severity stratification/i);
  assert.match(out, /Stay on same topic and format\.$/);
});

test('continue prompt falls back safely when topic is missing', () => {
  const out = buildContinueMessage('   ');
  assert.equal(out, 'Continue exactly from where the last answer stopped. Stay on same topic and format.');
});
