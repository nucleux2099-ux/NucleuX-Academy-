import test from 'node:test';
import assert from 'node:assert/strict';
import { assemblePromptV3 } from '@/lib/atom/prompt-assembly-v3';

test('prompt assembly v3 preserves deterministic layer ordering', () => {
  const out = assemblePromptV3({
    safetySystemText: 'safe',
    retrievedMemory: [],
    profile: {
      scopeKey: 's',
      response_style: 'balanced',
      difficulty_preference: 'adaptive',
      weak_topics: [],
      pace: 'normal',
      format_preference: 'mixed',
      updatedAt: new Date().toISOString(),
      version: 1,
    },
    includeHeartbeat: true,
    heartbeatChecklist: 'hb',
    currentQuery: 'q',
  });

  const i1 = out.indexOf('Layer 1');
  const i2 = out.indexOf('Layer 2');
  const i3 = out.indexOf('Layer 3');
  const i4 = out.indexOf('Layer 4');
  const i5 = out.indexOf('Layer 5');
  assert.equal(i1 < i2 && i2 < i3 && i3 < i4 && i4 < i5, true);
});
