import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeEvidence } from '@/lib/atom/evidence-grader';
import { validateClaimsWithCitations } from '@/lib/atom/claim-citation-validator';

test('strong citations with high semantic support produce A/B', () => {
  const validation = validateClaimsWithCitations({
    answerMarkdown: 'Guideline recommends intervention at threshold 10 [CIT-1, CIT-2].',
    citations: [
      {
        id: 'CIT-1',
        title: 'Guideline 2025',
        sourceType: 'guideline',
        editionOrYear: '2025',
        chapterOrSection: 'Section 4',
        pageOrLocator: 'p22',
        quote: 'Guideline recommends intervention at threshold 10.',
      },
      {
        id: 'CIT-2',
        title: 'Review 2024',
        sourceType: 'review',
        editionOrYear: '2024',
        chapterOrSection: 'Findings',
        pageOrLocator: 'p11',
        quote: 'Intervention at threshold 10 is recommended.',
      },
    ],
  });

  const graded = gradeEvidence(validation.claims[0]?.linkedCitationIds.length ? [
    {
      id: 'CIT-1',
      title: 'Guideline 2025',
      sourceType: 'guideline',
      editionOrYear: '2025',
      chapterOrSection: 'Section 4',
      pageOrLocator: 'p22',
      quote: 'Guideline recommends intervention at threshold 10.',
    },
    {
      id: 'CIT-2',
      title: 'Review 2024',
      sourceType: 'review',
      editionOrYear: '2024',
      chapterOrSection: 'Findings',
      pageOrLocator: 'p11',
      quote: 'Intervention at threshold 10 is recommended.',
    },
  ] : [], validation);

  assert.ok(['A', 'B'].includes(graded.evidenceGrade));
});

test('single weak outdated claim trends C/D', () => {
  const validation = validateClaimsWithCitations({
    answerMarkdown: 'Drug should be used broadly [CIT-1].',
    citations: [
      {
        id: 'CIT-1',
        title: 'Old opinion',
        sourceType: 'other',
        editionOrYear: '2001',
        quote: 'Opinion only.',
      },
    ],
  });

  const graded = gradeEvidence(
    [
      {
        id: 'CIT-1',
        title: 'Old opinion',
        sourceType: 'other',
        editionOrYear: '2001',
        quote: 'Opinion only.',
      },
    ],
    validation,
  );

  assert.ok(['C', 'D'].includes(graded.evidenceGrade));
});

test('coverage contributes to final score bucket', () => {
  const validation = validateClaimsWithCitations({
    answerMarkdown: [
      'Claim one should proceed [CIT-1].',
      'Claim two should proceed [CIT-2].',
      'Claim three should proceed [CIT-3].',
      'Claim four should proceed [CIT-4].',
      'Claim five should proceed.',
    ].join(' '),
    citations: ['CIT-1', 'CIT-2', 'CIT-3', 'CIT-4'].map((id) => ({
      id,
      title: `Ref ${id}`,
      sourceType: 'guideline' as const,
      chapterOrSection: 'Sec',
      pageOrLocator: 'p1',
      quote: 'Claim should proceed.',
    })),
  });

  const graded = gradeEvidence(validation.claims.map((claim) => claim.linkedCitationIds).flat().length ? [
    ...['CIT-1', 'CIT-2', 'CIT-3', 'CIT-4'].map((id) => ({
      id,
      title: `Ref ${id}`,
      sourceType: 'guideline' as const,
      chapterOrSection: 'Sec',
      pageOrLocator: 'p1',
      quote: 'Claim should proceed.',
    })),
  ] : [], validation);

  assert.ok(graded.coverage >= 0.8);
  assert.ok(graded.evidenceScore > 0);
});
