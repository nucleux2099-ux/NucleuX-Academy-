import type {
  ClaimEvidenceGrade,
  ClaimEvidenceScore,
  ClaimValidationSummary,
  CitationScoreResult,
  DeepResearchCitation,
  EvidenceGradeSummary,
} from '@/lib/atom/types';

function getHierarchyScore(sourceType: DeepResearchCitation['sourceType']): number {
  switch (sourceType) {
    case 'guideline':
    case 'review':
      return 29;
    case 'trial':
      return 25;
    case 'textbook':
      return 17;
    default:
      return 10;
  }
}

function parseYear(value?: string): number | null {
  if (!value) return null;
  const match = value.match(/(19|20)\d{2}/);
  return match ? Number.parseInt(match[0], 10) : null;
}

function getRecencyScore(editionOrYear?: string): number {
  const year = parseYear(editionOrYear);
  if (!year) return 7;

  const age = new Date().getFullYear() - year;
  if (age <= 5) return 15;
  if (age <= 10) return 10;
  return 5;
}

function getLocatorScore(citation: DeepResearchCitation): number {
  if (citation.chapterOrSection && citation.pageOrLocator) return 15;
  if (citation.chapterOrSection || citation.pageOrLocator) return 8;
  return 0;
}

function getQuoteScore(quote?: string): number {
  if (!quote) return 0;
  return quote.trim().length >= 30 ? 15 : 8;
}

export function scoreCitation(
  citation: DeepResearchCitation,
  usageCountByCitationId: Record<string, number>,
): CitationScoreResult {
  const hierarchy = getHierarchyScore(citation.sourceType);
  const recency = getRecencyScore(citation.editionOrYear);
  const locator = getLocatorScore(citation);
  const quote = getQuoteScore(citation.quote);
  const consistency = (usageCountByCitationId[citation.id] ?? 0) >= 2 ? 20 : 10;
  const penalty = /not recommended|contraindicated|harmful/i.test(citation.quote ?? '') ? -10 : 0;

  const score = Math.max(0, Math.min(100, hierarchy + recency + locator + quote + consistency + penalty));

  return {
    citationId: citation.id,
    score,
    breakdown: {
      hierarchy,
      recency,
      locator,
      quote,
      consistency,
      penalty,
    },
  };
}

function gradeFromScore(score: number): ClaimEvidenceGrade {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  return 'D';
}

function applySemanticPenalty(score: number, semanticSupport: number): number {
  if (semanticSupport >= 0.75) return score;
  if (semanticSupport >= 0.55) return score - 10;
  if (semanticSupport >= 0.4) return score - 20;
  return 40;
}

export function gradeEvidence(
  citations: DeepResearchCitation[],
  validationSummary: ClaimValidationSummary,
): EvidenceGradeSummary {
  const usageCountByCitationId = validationSummary.claims.reduce<Record<string, number>>((acc, claim) => {
    for (const citationId of claim.linkedCitationIds) {
      acc[citationId] = (acc[citationId] ?? 0) + 1;
    }
    return acc;
  }, {});

  const citationScores = citations.map((citation) => scoreCitation(citation, usageCountByCitationId));
  const citationScoreMap = new Map(citationScores.map((entry) => [entry.citationId, entry.score]));

  const claimScores: ClaimEvidenceScore[] = validationSummary.claims.map((claim) => {
    const bestCitationScore = Math.max(
      0,
      ...claim.linkedCitationIds.map((citationId) => citationScoreMap.get(citationId) ?? 0),
    );

    const adjusted = applySemanticPenalty(bestCitationScore, claim.semanticSupport);
    const bounded = Math.max(0, Math.min(100, adjusted));

    return {
      claimId: claim.claimId,
      score: bounded,
      grade: gradeFromScore(bounded),
      semanticSupport: claim.semanticSupport,
      citationIds: claim.linkedCitationIds,
    };
  });

  const avgTopClaimScore = claimScores.length
    ? claimScores.reduce((acc, claim) => acc + claim.score, 0) / claimScores.length
    : 0;

  const evidenceScore = Math.round(0.6 * avgTopClaimScore + 0.4 * validationSummary.coverage * 100);

  return {
    evidenceScore,
    evidenceGrade: gradeFromScore(evidenceScore),
    coverage: validationSummary.coverage,
    claimStats: {
      pass: validationSummary.passCount,
      warn: validationSummary.warnCount,
      fail: validationSummary.failCount,
    },
    citationScores,
    claimScores,
  };
}
