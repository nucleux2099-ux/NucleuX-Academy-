/**
 * NucleuX Academy - Topic Exports & Registry
 * 
 * Consolidated topic data for the library system.
 * Now includes a registry pattern for easier dynamic lookups.
 * 
 * @updated 2026-02-09 - Added NEPHROLOGY, created TOPIC_REGISTRY
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
// MEDICINE
// =============================================================================
export { CARDIOLOGY_TOPICS } from './cardiology';
export { NEPHROLOGY_TOPICS } from './nephrology';

// =============================================================================
// IMPORTS FOR REGISTRY
// =============================================================================
import { ESOPHAGUS_TOPICS } from './esophagus';
import { COLORECTAL_TOPICS } from './colorectal';
import { CARB_METABOLISM_TOPICS } from './carb-metabolism';
import { BIOMOLECULES_TOPICS } from './biomolecules';
import { CARDIOLOGY_TOPICS } from './cardiology';
import { NEPHROLOGY_TOPICS } from './nephrology';

// =============================================================================
// TOPIC REGISTRY - Maps subspecialty slugs to topic arrays
// This enables dynamic lookup without hardcoding if-statements
// =============================================================================
export const TOPIC_REGISTRY: Record<string, LibraryTopic[]> = {
  // Surgery - GI
  'esophagus': ESOPHAGUS_TOPICS,
  'colorectal': COLORECTAL_TOPICS,
  
  // Biochemistry
  'carbohydrate-metabolism': CARB_METABOLISM_TOPICS,
  'biomolecules': BIOMOLECULES_TOPICS,
  
  // Medicine
  'cardiology': CARDIOLOGY_TOPICS,
  'nephrology': NEPHROLOGY_TOPICS,
};

/**
 * Get topics for a subspecialty by slug
 * Returns empty array if not found
 */
export function getTopicsForSubspecialty(subspecialtySlug: string): LibraryTopic[] {
  return TOPIC_REGISTRY[subspecialtySlug] ?? [];
}

/**
 * Check if a subspecialty has legacy TypeScript topics
 */
export function hasLegacyTopics(subspecialtySlug: string): boolean {
  return subspecialtySlug in TOPIC_REGISTRY;
}

// =============================================================================
// ALL TOPICS AGGREGATOR
// =============================================================================
export const ALL_TOPICS: LibraryTopic[] = Object.values(TOPIC_REGISTRY).flat();

export function getAllTopics(): LibraryTopic[] {
  return ALL_TOPICS;
}

export function getTopicById(id: string): LibraryTopic | undefined {
  return ALL_TOPICS.find(t => t.id === id);
}

export function getTopicsBySubject(subjectId: string): LibraryTopic[] {
  return ALL_TOPICS.filter(t => t.subjectId === subjectId);
}

export function getTopicsBySubspecialtyId(subspecialtyId: string): LibraryTopic[] {
  return ALL_TOPICS.filter(t => t.subspecialtyId === subspecialtyId);
}
