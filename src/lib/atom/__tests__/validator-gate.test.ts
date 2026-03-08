import test from 'node:test';
import assert from 'node:assert/strict';
import { validateClaimsWithCitations } from '@/lib/atom/claim-citation-validator';

test('low coverage with fails blocks finalize', () => {
  const result = validateClaimsWithCitations(
    {
      answerMarkdown: [
        'Claim A should be done [CIT-1].',
        'Claim B should be done.',
        'Claim C should be done.',
      ].join(' '),
      citations: [
        {
          id: 'CIT-1',
          title: 'Ref',
          sourceType: 'guideline',
          chapterOrSection: 'Sec',
          pageOrLocator: 'p1',
          quote: 'Claim A should be done.',
        },
      ],
    },
    { coverageThreshold: 0.85 },
  );

  assert.equal(result.shouldBlockFinalize, true);
});
