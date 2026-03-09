/**
 * NucleuX Academy - ATOM v2: Barrel Export
 *
 * Re-exports all ATOM v2 modules for clean imports:
 *
 * ```typescript
 * import { chunkContent, retrieveContext, processGatewayRequest } from '@/lib/atom';
 * ```
 *
 * Modules:
 * - chunker: Content chunking engine (offline pipeline)
 * - search: Hybrid search + Cohere reranking (online retrieval)
 * - assembler: Context assembly with token budgets (online)
 * - prompts: System prompt layers (base + room personas)
 * - gateway: Orchestration layer (Lane Queue, 7-phase pipeline, SSE)
 */

// Chunking engine (offline pipeline)
export {
  chunkContent,
  parseContentPath,
  splitByHeaders,
  detectViewMode,
  estimateTokens,
  contentHash,
  type ChunkInput,
  type ProcessedChunk,
} from './chunker';

// Hybrid search service (online retrieval)
export {
  expandKeywords,
  generateEmbedding,
  embedQuery,
  hybridSearch,
  rerankResults,
  retrieveContext,
  getCachedSearch,
  setCachedSearch,
  type ScribeResult,
  type RankedSearchResult,
  type SearchOptions,
} from './search';

// Context assembler (online assembly)
export {
  TOKEN_BUDGET,
  formatMemoryContext,
  formatRetrievedChunks,
  formatPageContext,
  formatStudentProfile,
  trimConversationHistory,
  assembleContext,
  type AssembledContext,
} from './assembler';

// System prompt layers (base identity + room personas)
export {
  ATOM_BASE_PROMPT,
  getRoomPrompt,
  buildSystemPrompt,
} from './prompts';

// Gateway orchestration (online — entry point for all AI interactions)
export {
  processGatewayRequest,
  GatewayError,
  type GatewayInput,
  type GatewayConfig,
} from './gateway';

// Provider & hooks (client-side — 'use client' components)
export { ATOMProvider, useATOM } from './provider';
export {
  useATOMStream,
  type StreamOptions,
  type UseATOMStreamReturn,
} from './hooks/useATOMStream';

// Shared utilities (client-side helpers)
export {
  deduplicateStreamingMessages,
  accumulatorIsEmpty,
} from './utils';
