import type { AdaptiveLearnerProfile } from '@/lib/atom/adaptive-profile';
import type { MemorySnippet } from '@/lib/atom/memory-retrieval';
import { formatMemoryContextForPrompt } from '@/lib/atom/memory-retrieval';

export type PromptAssemblyInput = {
  safetySystemText: string;
  retrievedMemory: MemorySnippet[];
  profile: AdaptiveLearnerProfile;
  heartbeatChecklist?: string;
  currentQuery: string;
  includeHeartbeat: boolean;
  maxChars?: number;
};

function compactProfileSummary(profile: AdaptiveLearnerProfile) {
  return [
    '## Adaptive profile (advisory)',
    `- response_style: ${profile.response_style}`,
    `- difficulty_preference: ${profile.difficulty_preference}`,
    `- weak_topics: ${profile.weak_topics.join(', ') || 'none'}`,
    `- pace: ${profile.pace}`,
    `- format_preference: ${profile.format_preference}`,
    `- version: ${profile.version}`,
  ].join('\n');
}

export function assemblePromptV3(input: PromptAssemblyInput): string {
  const maxChars = input.maxChars ?? 9_000;
  const layers: string[] = [];

  // 1) safety/system
  layers.push(`# Layer 1: safety/system\n${input.safetySystemText}`);

  // 2) scoped memory retrieval context
  layers.push(`# Layer 2: scoped memory\n${formatMemoryContextForPrompt(input.retrievedMemory, 4000)}`);

  // 3) compact profile summary
  layers.push(`# Layer 3: profile\n${compactProfileSummary(input.profile)}`);

  // 4) heartbeat checklist (heartbeat runs only)
  if (input.includeHeartbeat && input.heartbeatChecklist) {
    layers.push(`# Layer 4: heartbeat checklist\n${input.heartbeatChecklist.slice(0, 1800)}`);
  }

  // 5) current query
  layers.push(`# Layer 5: current query\n${input.currentQuery}`);

  let out = '';
  for (const layer of layers) {
    const next = `${out}${out ? '\n\n' : ''}${layer}`;
    if (next.length > maxChars) break;
    out = next;
  }

  return out;
}
