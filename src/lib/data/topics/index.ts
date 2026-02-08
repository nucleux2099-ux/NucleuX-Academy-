/**
 * NucleuX Academy - Topic Exports
 * Consolidated topic data for the library system
 */

import type { LibraryTopic } from '../../types/library';

// =============================================================================
// SURGERY - GI
// =============================================================================
export { ESOPHAGUS_TOPICS, getEsophagusTopics } from './esophagus';
export { COLORECTAL_TOPICS } from './colorectal';

// =============================================================================
// BIOCHEMISTRY
// =============================================================================
export { CARB_METABOLISM_TOPICS } from './carb-metabolism';
export { BIOMOLECULES_TOPICS } from './biomolecules';

// =============================================================================
// MEDICINE - CARDIOLOGY
// =============================================================================
export { CARDIOLOGY_TOPICS } from './cardiology';

// =============================================================================
// ALL TOPICS AGGREGATOR
// =============================================================================
import { ESOPHAGUS_TOPICS } from './esophagus';
import { COLORECTAL_TOPICS } from './colorectal';
import { CARB_METABOLISM_TOPICS } from './carb-metabolism';
import { BIOMOLECULES_TOPICS } from './biomolecules';
import { CARDIOLOGY_TOPICS } from './cardiology';

export const ALL_TOPICS: LibraryTopic[] = [
  ...ESOPHAGUS_TOPICS,
  ...COLORECTAL_TOPICS,
  ...CARB_METABOLISM_TOPICS,
  ...BIOMOLECULES_TOPICS,
  ...CARDIOLOGY_TOPICS,
];

export function getAllTopics(): LibraryTopic[] {
  return ALL_TOPICS;
}

export function getTopicById(id: string): LibraryTopic | undefined {
  return ALL_TOPICS.find(t => t.id === id);
}

export function getTopicsBySubject(subjectId: string): LibraryTopic[] {
  return ALL_TOPICS.filter(t => t.subjectId === subjectId);
}

export function getTopicsBySubspecialty(subspecialtyId: string): LibraryTopic[] {
  return ALL_TOPICS.filter(t => t.subspecialtyId === subspecialtyId);
}
