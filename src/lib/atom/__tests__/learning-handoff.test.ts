import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLearningHandoff, renderLearningHandoffMarkdown } from '@/lib/atom/learning-handoff';

test('learning handoff contains all six sections and diagnose recommendations', () => {
  const handoff = buildLearningHandoff({
    topic: 'Portal Hypertension',
    finalAnswer: 'A concise final answer',
    evidence: {
      evidenceScore: 72,
      evidenceGrade: 'B',
      coverage: 0.9,
      claimStats: { pass: 3, warn: 1, fail: 0 },
      citationScores: [],
      claimScores: [
        { claimId: 'CLM-1', score: 88, grade: 'A', semanticSupport: 0.8, citationIds: ['CIT-1'] },
        { claimId: 'CLM-2', score: 54, grade: 'D', semanticSupport: 0.43, citationIds: ['CIT-2'] },
      ],
    },
  });

  const markdown = renderLearningHandoffMarkdown(handoff);

  assert.ok(markdown.includes('### Plan'));
  assert.ok(markdown.includes('### Encode'));
  assert.ok(markdown.includes('### Retrieve'));
  assert.ok(markdown.includes('### Apply'));
  assert.ok(markdown.includes('### Diagnose'));
  assert.ok(markdown.includes('### Reinforce'));
  assert.ok(handoff.learningCycle.diagnose.length > 0);
  assert.ok(handoff.weakClaimCount > 0);
});
