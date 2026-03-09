import type {
  ClaimStatus,
  ClaimValidationResult,
  ClaimValidationSummary,
  DeepResearchCitation,
  DraftWithEvidence,
} from '@/lib/atom/types';

const CLAIM_SIGNAL_PATTERN = /(\d+|%|mg|mcg|mmhg|kg|ml|recommended|indicated|contraindicated|should|causes|reduces|increases|predicts|associated with)/i;
const SENTENCE_SPLIT_PATTERN = /(?<=[.!?])\s+/;
const ANCHOR_PATTERN = /\[(CIT-\d+(?:\s*,\s*CIT-\d+)*)\]|\((CIT-\d+(?:\s*,\s*CIT-\d+)*)\)/gi;

function toTokens(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2),
  );
}

function hasNegation(value: string): boolean {
  return /\b(no|not|never|without|lack|does not|do not|cannot|can't|won't)\b/i.test(value);
}

export function extractClaims(answerMarkdown: string): string[] {
  const lines = answerMarkdown
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith('#'));

  const sentences = lines.flatMap((line) => line.split(SENTENCE_SPLIT_PATTERN).map((s) => s.trim()));

  return sentences.filter((sentence) => {
    if (!sentence || sentence.length < 15) return false;
    if (/^[-*]\s*[^\s]+$/i.test(sentence)) return false;
    return CLAIM_SIGNAL_PATTERN.test(sentence);
  });
}

export function parseCitationAnchors(sentence: string): string[] {
  const anchors = new Set<string>();
  for (const match of sentence.matchAll(ANCHOR_PATTERN)) {
    const raw = (match[1] ?? match[2] ?? '').split(',');
    for (const id of raw) {
      const normalized = id.trim().toUpperCase();
      if (normalized) anchors.add(normalized);
    }
  }
  return [...anchors];
}

export function semanticSupportScore(claimText: string, quote: string | undefined): number {
  if (!quote) return 0;
  const claimTokens = toTokens(claimText);
  const quoteTokens = toTokens(quote);
  if (!claimTokens.size || !quoteTokens.size) return 0;

  let overlap = 0;
  for (const token of claimTokens) {
    if (quoteTokens.has(token)) overlap += 1;
  }

  let score = overlap / claimTokens.size;

  if (hasNegation(claimText) !== hasNegation(quote)) {
    score -= 0.4;
  }

  return Math.min(1, Math.max(0, Number(score.toFixed(2))));
}

function getClaimStatus(
  anchors: string[],
  citations: DeepResearchCitation[],
  semanticSupport: number,
): { status: ClaimStatus; issues: string[]; linkedCitationIds: string[] } {
  const issues: string[] = [];
  const citationMap = new Map(citations.map((citation) => [citation.id.toUpperCase(), citation]));

  if (!anchors.length) {
    return {
      status: 'FAIL',
      issues: ['anchor_missing'],
      linkedCitationIds: [],
    };
  }

  const missingAnchors = anchors.filter((anchor) => !citationMap.has(anchor));
  if (missingAnchors.length > 0) {
    return {
      status: 'FAIL',
      issues: [`citation_missing:${missingAnchors.join(',')}`],
      linkedCitationIds: [],
    };
  }

  const linkedCitations = anchors
    .map((anchor) => citationMap.get(anchor))
    .filter((citation): citation is DeepResearchCitation => Boolean(citation));

  const hasLocator = linkedCitations.every((citation) => Boolean(citation.chapterOrSection || citation.pageOrLocator));
  const hasQuote = linkedCitations.every((citation) => Boolean(citation.quote?.trim()));

  if (!hasLocator) issues.push('locator_missing');
  if (!hasQuote) issues.push('quote_missing');

  if (semanticSupport < 0.4) {
    issues.push('semantic_support_low');
    return { status: 'FAIL', issues, linkedCitationIds: linkedCitations.map((citation) => citation.id) };
  }

  if (!hasLocator || !hasQuote || semanticSupport < 0.55) {
    if (semanticSupport >= 0.4) {
      issues.push('semantic_support_warn');
    }
    return { status: 'WARN', issues, linkedCitationIds: linkedCitations.map((citation) => citation.id) };
  }

  return {
    status: 'PASS',
    issues,
    linkedCitationIds: linkedCitations.map((citation) => citation.id),
  };
}

export function validateClaimsWithCitations(
  draft: DraftWithEvidence,
  options?: { coverageThreshold?: number },
): ClaimValidationSummary {
  const claims = extractClaims(draft.answerMarkdown);
  const results: ClaimValidationResult[] = claims.map((claimText, index) => {
    const anchors = parseCitationAnchors(claimText);
    const linkedQuotes = anchors
      .map((anchor) => draft.citations.find((citation) => citation.id.toUpperCase() === anchor)?.quote)
      .filter((quote): quote is string => Boolean(quote));

    const semanticSupport = linkedQuotes.length
      ? Math.max(...linkedQuotes.map((quote) => semanticSupportScore(claimText, quote)))
      : 0;

    const { status, issues, linkedCitationIds } = getClaimStatus(anchors, draft.citations, semanticSupport);

    return {
      claimId: `CLM-${index + 1}`,
      claimText,
      anchors,
      status,
      issues,
      semanticSupport,
      linkedCitationIds,
    };
  });

  const passCount = results.filter((claim) => claim.status === 'PASS').length;
  const warnCount = results.filter((claim) => claim.status === 'WARN').length;
  const failCount = results.filter((claim) => claim.status === 'FAIL').length;
  const claimCount = results.length;
  const coverage = claimCount ? Number(((passCount + warnCount) / claimCount).toFixed(2)) : 0;
  const coverageThreshold = options?.coverageThreshold ?? 0.85;

  return {
    claims: results,
    claimCount,
    passCount,
    warnCount,
    failCount,
    coverage,
    shouldBlockFinalize: failCount > 0 && coverage < coverageThreshold,
  };
}
