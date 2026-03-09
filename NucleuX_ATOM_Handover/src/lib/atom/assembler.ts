/**
 * NucleuX Academy - ATOM v2: Context Assembler
 *
 * Assembles the final context string for Claude from:
 * - Retrieved content chunks (from Retriever/Critic)
 * - User memory (from Memorist)
 * - Page context (current topic, view mode)
 * - Conversation history (with compaction)
 *
 * Manages token budget allocation and truncation priority.
 *
 * Spec: docs/specs/ATOM_RAG_PIPELINE_SPEC.md § Context Assembly
 */

import type {
  ATOMMessage,
  ATOMUserMemory,
  ATOMPageContext,
  StudentProfile,
  MemoryContext,
} from '@/lib/types/atom';
import type { RankedSearchResult } from './search';
import { estimateTokens } from './chunker';

// =============================================================================
// TOKEN BUDGET
// =============================================================================

/**
 * Token budget allocation for a single ATOM request.
 * Total ~50,500 tokens (well within Claude Sonnet's 200K context).
 */
export const TOKEN_BUDGET = {
  systemPrompts: 3_000,       // base + room persona + plugin prompts
  memory: 2_000,              // from Memorist (goals, weak areas, preferences)
  retrievedChunks: 10_000,    // from Critic (top 5 chunks × ~2K each)
  pageContext: 500,            // current topic, view mode, active content
  conversationHistory: 30_000, // previous messages
  generation: 5_000,          // max_tokens for Claude response
} as const;

// =============================================================================
// MEMORY CONTEXT FORMATTING
// =============================================================================

/**
 * Format memory context for system prompt injection.
 * Prioritizes by type: goals > weak areas > mastered > preferences > patterns.
 */
export function formatMemoryContext(
  memories: ATOMUserMemory[],
  maxTokens: number = TOKEN_BUDGET.memory
): string {
  if (memories.length === 0) return '';

  // Group by type, prioritize by importance
  const grouped: MemoryContext = {
    goals: [],
    weakAreas: [],
    masteredTopics: [],
    preferences: [],
    insights: [],
    studyPatterns: [],
    clinicalConnections: [],
    tokenBudget: maxTokens,
    totalTokensUsed: 0,
  };

  for (const m of memories) {
    switch (m.memoryType) {
      case 'goal': grouped.goals.push(m); break;
      case 'weak_area': grouped.weakAreas.push(m); break;
      case 'topic_mastery': grouped.masteredTopics.push(m); break;
      case 'preference': grouped.preferences.push(m); break;
      case 'insight': grouped.insights.push(m); break;
      case 'study_pattern': grouped.studyPatterns.push(m); break;
      case 'clinical_connection': grouped.clinicalConnections.push(m); break;
    }
  }

  const sections: string[] = [];
  let tokensUsed = 0;

  // Priority 1: Goals (never truncated)
  if (grouped.goals.length > 0) {
    const goalText = `**Student Goals:**\n${grouped.goals.map(g => `- ${g.content}`).join('\n')}`;
    const goalTokens = estimateTokens(goalText);
    if (tokensUsed + goalTokens <= maxTokens) {
      sections.push(goalText);
      tokensUsed += goalTokens;
    }
  }

  // Priority 2: Weak areas (never truncated — critical for personalization)
  if (grouped.weakAreas.length > 0) {
    const weakText = `**Known Weak Areas:**\n${grouped.weakAreas.map(w => `- ${w.content}`).join('\n')}`;
    const weakTokens = estimateTokens(weakText);
    if (tokensUsed + weakTokens <= maxTokens) {
      sections.push(weakText);
      tokensUsed += weakTokens;
    }
  }

  // Priority 3: Mastered topics
  if (grouped.masteredTopics.length > 0) {
    const masteredText = `**Mastered Topics:**\n${grouped.masteredTopics.slice(0, 5).map(m => `- ${m.content}`).join('\n')}`;
    const masteredTokens = estimateTokens(masteredText);
    if (tokensUsed + masteredTokens <= maxTokens) {
      sections.push(masteredText);
      tokensUsed += masteredTokens;
    }
  }

  // Priority 4: Preferences
  if (grouped.preferences.length > 0) {
    const prefText = `**Learning Preferences:**\n${grouped.preferences.slice(0, 3).map(p => `- ${p.content}`).join('\n')}`;
    const prefTokens = estimateTokens(prefText);
    if (tokensUsed + prefTokens <= maxTokens) {
      sections.push(prefText);
      tokensUsed += prefTokens;
    }
  }

  // Priority 5: Study patterns (if room left)
  if (grouped.studyPatterns.length > 0 && tokensUsed < maxTokens * 0.8) {
    const patternText = `**Study Patterns:**\n${grouped.studyPatterns.slice(0, 2).map(p => `- ${p.content}`).join('\n')}`;
    const patternTokens = estimateTokens(patternText);
    if (tokensUsed + patternTokens <= maxTokens) {
      sections.push(patternText);
      tokensUsed += patternTokens;
    }
  }

  // Priority 6: Clinical connections (if room left)
  if (grouped.clinicalConnections.length > 0 && tokensUsed < maxTokens * 0.9) {
    const connText = `**Clinical Connections:**\n${grouped.clinicalConnections.slice(0, 2).map(c => `- ${c.content}`).join('\n')}`;
    const connTokens = estimateTokens(connText);
    if (tokensUsed + connTokens <= maxTokens) {
      sections.push(connText);
      tokensUsed += connTokens;
    }
  }

  if (sections.length === 0) return '';

  return `## Student Knowledge State\n${sections.join('\n\n')}`;
}

// =============================================================================
// RETRIEVED CHUNKS FORMATTING
// =============================================================================

/**
 * Format retrieved chunks for system prompt injection.
 * Includes source attribution and metadata.
 */
export function formatRetrievedChunks(
  chunks: RankedSearchResult[],
  maxTokens: number = TOKEN_BUDGET.retrievedChunks
): string {
  if (chunks.length === 0) return '';

  const sections: string[] = [];
  let tokensUsed = 0;

  for (const chunk of chunks) {
    const header = `--- Source: ${chunk.subject}/${chunk.subspecialty}/${chunk.topicSlug} (${chunk.sourceFile}) ---`;
    const metadata: string[] = [];

    if (chunk.metadata?.headings && chunk.metadata.headings.length > 0) {
      metadata.push(`Section: ${chunk.metadata.headings.join(' > ')}`);
    }
    if (chunk.metadata?.highYield) {
      metadata.push('⭐ HIGH YIELD');
    }
    if (chunk.metadata?.textbookRef) {
      metadata.push(`Ref: ${chunk.metadata.textbookRef}`);
    }

    const metaLine = metadata.length > 0 ? `[${metadata.join(' | ')}]\n` : '';
    const fullChunk = `${header}\n${metaLine}${chunk.content}`;
    const chunkTokens = estimateTokens(fullChunk);

    if (tokensUsed + chunkTokens > maxTokens) {
      // If we've reached budget, truncate this chunk or skip
      const remaining = maxTokens - tokensUsed;
      if (remaining > 100) {
        // Truncate to fit
        const truncatedContent = chunk.content.slice(0, remaining * 4);
        sections.push(`${header}\n${metaLine}${truncatedContent}...`);
      }
      break;
    }

    sections.push(fullChunk);
    tokensUsed += chunkTokens;
  }

  if (sections.length === 0) return '';

  return `## Retrieved Content\n\n${sections.join('\n\n')}`;
}

// =============================================================================
// PAGE CONTEXT FORMATTING
// =============================================================================

/**
 * Format the current page context (what the student is looking at).
 */
export function formatPageContext(
  context: ATOMPageContext | undefined,
  maxTokens: number = TOKEN_BUDGET.pageContext
): string {
  if (!context) return '';

  const parts: string[] = [];
  parts.push(`Room: ${context.room}`);

  if (context.subject) parts.push(`Subject: ${context.subject}`);
  if (context.subspecialty) parts.push(`Subspecialty: ${context.subspecialty}`);
  if (context.topicSlug) parts.push(`Topic: ${context.topicSlug}`);
  if (context.viewMode) parts.push(`View: ${context.viewMode}`);

  let result = `## Current Context\n${parts.join(' | ')}`;

  if (context.activeContent) {
    const contentTokens = estimateTokens(context.activeContent);
    const headerTokens = estimateTokens(result);
    const remaining = maxTokens - headerTokens;

    if (remaining > 50) {
      const truncated = context.activeContent.slice(0, Math.min(remaining * 4, context.activeContent.length));
      result += `\n\nActive Content:\n${truncated}`;
    }
  }

  return result;
}

// =============================================================================
// STUDENT PROFILE FORMATTING
// =============================================================================

/**
 * Format student profile for system prompt injection.
 */
export function formatStudentProfile(profile: StudentProfile | null): string {
  if (!profile) return '';

  const parts: string[] = [];
  parts.push(`Level: ${profile.level}`);
  parts.push(`Exam Target: ${profile.examTarget}`);

  if (profile.examDate) {
    const daysRemaining = Math.ceil(
      (new Date(profile.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    parts.push(`Exam Date: ${profile.examDate} (${daysRemaining} days remaining)`);
  }

  if (profile.strongSubjects.length > 0) {
    parts.push(`Strong In: ${profile.strongSubjects.join(', ')}`);
  }
  if (profile.weakSubjects.length > 0) {
    parts.push(`Needs Work: ${profile.weakSubjects.join(', ')}`);
  }

  return `## Student Profile\n${parts.join('\n')}`;
}

// =============================================================================
// CONVERSATION HISTORY MANAGEMENT
// =============================================================================

/**
 * Trim conversation history to fit within token budget.
 * Keeps recent messages verbatim and summarizes older ones.
 *
 * Note: The actual summarization call to Claude is handled by the Gateway.
 * This function does the token counting and splitting.
 */
export function trimConversationHistory(
  messages: ATOMMessage[],
  maxTokens: number = TOKEN_BUDGET.conversationHistory
): { recent: ATOMMessage[]; older: ATOMMessage[]; needsCompaction: boolean } {
  // Count total tokens
  let totalTokens = 0;
  const tokenCounts: number[] = messages.map(m => {
    const tokens = estimateTokens(m.content);
    totalTokens += tokens;
    return tokens;
  });

  if (totalTokens <= maxTokens) {
    return { recent: messages, older: [], needsCompaction: false };
  }

  // Keep last 10 messages verbatim
  const keepCount = Math.min(10, messages.length);
  const recent = messages.slice(-keepCount);
  const older = messages.slice(0, -keepCount);

  // Check if recent alone fits
  const recentTokens = tokenCounts.slice(-keepCount).reduce((a, b) => a + b, 0);

  if (recentTokens > maxTokens) {
    // Even recent messages exceed budget — keep fewer
    const reducedRecent: ATOMMessage[] = [];
    let used = 0;
    for (let i = messages.length - 1; i >= 0 && used < maxTokens; i--) {
      reducedRecent.unshift(messages[i]);
      used += tokenCounts[i];
    }
    return {
      recent: reducedRecent,
      older: messages.slice(0, messages.length - reducedRecent.length),
      needsCompaction: true,
    };
  }

  return { recent, older, needsCompaction: older.length > 0 };
}

// =============================================================================
// FULL CONTEXT ASSEMBLY
// =============================================================================

export interface AssembledContext {
  /** Formatted string to inject into system prompt */
  contextString: string;
  /** Total estimated tokens used */
  totalTokens: number;
  /** Number of retrieved chunks included */
  chunksIncluded: number;
  /** Number of memories included */
  memoriesIncluded: number;
  /** Whether conversation compaction is needed */
  needsCompaction: boolean;
  /** Older messages that need summarization (if compaction needed) */
  olderMessages: ATOMMessage[];
}

/**
 * Assemble the complete context for ATOM's system prompt.
 *
 * Priority order (last to be truncated):
 * 1. Base + Room prompts — Never truncated (handled by Gateway)
 * 2. Active weak areas — Never truncated
 * 3. Top 3 retrieved chunks — Reduce from 5 to 3 if needed
 * 4. Other memories — Reduce from 5 to 2
 * 5. Page context — Drop optional metadata
 * 6. Conversation history — Summarize older messages
 */
export function assembleContext(params: {
  retrievedChunks: RankedSearchResult[];
  memories: ATOMUserMemory[];
  pageContext?: ATOMPageContext;
  studentProfile: StudentProfile | null;
  conversationHistory: ATOMMessage[];
}): AssembledContext {
  const {
    retrievedChunks,
    memories,
    pageContext,
    studentProfile,
    conversationHistory,
  } = params;

  // Step 1: Format each section
  const profileStr = formatStudentProfile(studentProfile);
  const memoryStr = formatMemoryContext(memories);
  const chunksStr = formatRetrievedChunks(retrievedChunks);
  const pageStr = formatPageContext(pageContext);

  // Step 2: Check conversation history
  const { recent, older, needsCompaction } = trimConversationHistory(conversationHistory);

  // Step 3: Assemble context string
  const sections = [profileStr, memoryStr, chunksStr, pageStr].filter(s => s.length > 0);
  const contextString = sections.join('\n\n');

  // Step 4: Calculate token usage
  const totalTokens = estimateTokens(contextString) +
    recent.reduce((sum, m) => sum + estimateTokens(m.content), 0);

  return {
    contextString,
    totalTokens,
    chunksIncluded: retrievedChunks.length,
    memoriesIncluded: memories.length,
    needsCompaction,
    olderMessages: older,
  };
}
