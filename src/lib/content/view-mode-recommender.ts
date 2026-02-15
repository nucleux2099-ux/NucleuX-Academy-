/**
 * View Mode Recommender
 *
 * Recommends which view modes should be generated for a topic
 * based on its NMC competency codes and learning-science principles.
 *
 * Domain-based priority (Miller's Pyramid):
 *   K  (Knows)      → Explorer (schema building)
 *   KH (Knows How)  → Textbook (deep encoding) + Exam Prep (retrieval)
 *   SH (Shows How)  → Quiz (spaced retrieval) + Cases (clinical reasoning)
 *   P  (Performs)    → Cases (transfer learning)
 */

import type { NmcCode } from '../types/library';
import type { ViewMode } from '../types/library';

export function recommendViewModes(nmcCodes: NmcCode[]): ViewMode[] {
  if (nmcCodes.length === 0) {
    return ['explorer']; // default fallback
  }

  const domains = new Set(nmcCodes.map(c => c.domain));
  const modes: ViewMode[] = ['explorer']; // always present — foundation

  // K / KH → deep study modes
  if (domains.has('K') || domains.has('KH')) {
    modes.push('textbook', 'examPrep');
  }

  // SH → active retrieval + clinical reasoning
  if (domains.has('SH')) {
    modes.push('quiz', 'cases');
  }

  // P → transfer learning through cases
  if (domains.has('P')) {
    modes.push('cases');
  }

  // Core competencies always get exam-prep (high-yield for exams)
  if (nmcCodes.some(c => c.core)) {
    modes.push('examPrep');
  }

  // Deduplicate while preserving order
  return [...new Set(modes)];
}

/**
 * Returns a human-readable rationale for why certain modes were recommended.
 */
export function getRecommendationRationale(nmcCodes: NmcCode[]): string[] {
  const domains = new Set(nmcCodes.map(c => c.domain));
  const reasons: string[] = [];

  if (domains.has('K')) {
    reasons.push('K-domain: Explorer mode for foundational schema building');
  }
  if (domains.has('KH')) {
    reasons.push('KH-domain: Textbook + Exam Prep for deep encoding and retrieval practice');
  }
  if (domains.has('SH')) {
    reasons.push('SH-domain: Quiz + Cases for spaced retrieval and clinical reasoning');
  }
  if (domains.has('P')) {
    reasons.push('P-domain: Cases for transfer learning to clinical performance');
  }
  if (nmcCodes.some(c => c.core)) {
    reasons.push('Core competency: Exam Prep prioritized (high-yield)');
  }

  return reasons;
}
