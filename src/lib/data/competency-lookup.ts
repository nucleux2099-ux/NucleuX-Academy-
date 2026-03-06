/**
 * Competency code → Library topic reverse lookup.
 *
 * Source: topic-nmc-codes.json (topicPath → codes[])
 * This module builds a reverse map: code → topicPaths[]
 */

import topicNmcCodes from './topic-nmc-codes.json';

// Build reverse map once
const reverseMap: Record<string, string[]> = {};
for (const [topicPath, codes] of Object.entries(topicNmcCodes as Record<string, string[]>)) {
  for (const code of codes) {
    if (!reverseMap[code]) reverseMap[code] = [];
    reverseMap[code].push(topicPath);
  }
}

export interface TopicMatch {
  subject: string;
  subspecialty: string;
  topic: string;
  path: string; // /library/subject/subspecialty/topic
}

/**
 * Get library topics that map to a given NMC competency code.
 */
export function getTopicsForCompetencyCode(code: string): TopicMatch[] {
  const paths = reverseMap[code] || [];
  return paths.map((p) => {
    const [subject, subspecialty, topic] = p.split('/');
    return {
      subject,
      subspecialty,
      topic,
      path: `/library/${p}`,
    };
  });
}

/**
 * Check if a competency code has any library topics mapped.
 */
export function hasLibraryMatch(code: string): boolean {
  return (reverseMap[code]?.length ?? 0) > 0;
}

/**
 * Get the first matching library path for a code, or null.
 */
export function getFirstTopicPath(code: string): string | null {
  const paths = reverseMap[code];
  if (!paths || paths.length === 0) return null;
  return `/library/${paths[0]}`;
}
