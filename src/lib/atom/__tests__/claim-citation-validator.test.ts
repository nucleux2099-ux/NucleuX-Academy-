import test from 'node:test';
import assert from 'node:assert/strict';
import { validateClaimsWithCitations } from '@/lib/atom/claim-citation-validator';

test('claim with valid anchor + locator + quote is PASS', () => {
  const result = validateClaimsWithCitations({
    answerMarkdown: 'Dose should be 5 mg daily for high-risk patients [CIT-1].',
    citations: [
      {
        id: 'CIT-1',
        title: 'Guideline',
        sourceType: 'guideline',
        chapterOrSection: 'Dose',
        pageOrLocator: 'p10',
        quote: 'Dose should be 5 mg daily for high-risk patients.',
      },
    ],
  });

  assert.equal(result.claims[0]?.status, 'PASS');
});

test('missing anchor is FAIL', () => {
  const result = validateClaimsWithCitations({
    answerMarkdown: 'Dose should be 5 mg daily for high-risk patients.',
    citations: [],
  });
  assert.equal(result.claims[0]?.status, 'FAIL');
  assert.ok(result.claims[0]?.issues.includes('anchor_missing'));
});

test('unknown citation id is FAIL', () => {
  const result = validateClaimsWithCitations({
    answerMarkdown: 'Dose should be 5 mg daily [CIT-99].',
    citations: [],
  });
  assert.equal(result.claims[0]?.status, 'FAIL');
});

test('weak locator is WARN', () => {
  const result = validateClaimsWithCitations({
    answerMarkdown: 'Intervention should be considered in selected patients [CIT-1].',
    citations: [
      {
        id: 'CIT-1',
        title: 'Review',
        sourceType: 'review',
        quote: 'Intervention should be considered in selected patients.',
      },
    ],
  });

  assert.equal(result.claims[0]?.status, 'WARN');
});

test('semantic contradiction is FAIL', () => {
  const result = validateClaimsWithCitations({
    answerMarkdown: 'Drug A reduces mortality [CIT-1].',
    citations: [
      {
        id: 'CIT-1',
        title: 'Trial',
        sourceType: 'trial',
        chapterOrSection: 'Result',
        pageOrLocator: 'p1',
        quote: 'Drug A does not reduce mortality in this cohort.',
      },
    ],
  });

  assert.equal(result.claims[0]?.status, 'FAIL');
  assert.ok((result.claims[0]?.semanticSupport ?? 1) < 0.4);
});
