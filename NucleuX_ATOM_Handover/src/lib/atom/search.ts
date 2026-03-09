/**
 * NucleuX Academy - ATOM v2: Hybrid Search Service
 *
 * Orchestrates the 5-stage RAG retrieval pipeline:
 * 1. Scribe → intent detection + query expansion
 * 2. Retriever → parallel pgvector + FTS via hybrid_search_chunks()
 * 3. Critic → Cohere cross-encoder reranking
 * 4. Assembler → context assembly within token budget
 *
 * Spec: docs/specs/ATOM_RAG_PIPELINE_SPEC.md
 */

import type {
  ViewMode,
  HybridSearchResult,
  ContentChunk,
} from '@/lib/types/atom';
import { createClient } from '@supabase/supabase-js';
import synonymsData from './synonyms.json';

// =============================================================================
// TYPES
// =============================================================================

/** Scribe output: classified intent + expanded query */
export interface ScribeResult {
  intent: 'learn' | 'practice' | 'review' | 'plan' | 'discuss' | 'generate';
  keywords: string[];
  expandedQuery: string;
  needsRetrieval: boolean;
  subjectHint: string | null;
  topicHint: string | null;
}

/** Final search result after reranking */
export interface RankedSearchResult extends HybridSearchResult {
  rerankScore?: number;
}

/** Search options passed from Gateway */
export interface SearchOptions {
  subject?: string;
  subspecialty?: string;
  viewModes?: ViewMode[];
  limit?: number;
  enableReranking?: boolean;
}

// =============================================================================
// SYNONYM EXPANSION
// =============================================================================

const SYNONYMS: Record<string, string[]> = synonymsData;

/**
 * Expand keywords with medical synonyms from the synonym map.
 * Also handles common medical abbreviation expansion.
 */
export function expandKeywords(keywords: string[]): string[] {
  const expanded = new Set(keywords);

  for (const kw of keywords) {
    const kwLower = kw.toLowerCase();
    for (const [root, syns] of Object.entries(SYNONYMS)) {
      if (kwLower.includes(root) || syns.some(s => kwLower.includes(s))) {
        expanded.add(root);
        syns.forEach(s => expanded.add(s));
      }
    }
  }

  return Array.from(expanded);
}

// =============================================================================
// EMBEDDING CLIENT
// =============================================================================

/**
 * Generate embeddings by calling the Supabase Edge Function.
 * Returns 384-dimensional vectors from BGE-small-en-v1.5.
 */
export async function generateEmbedding(
  texts: string[],
  supabaseUrl: string,
  serviceRoleKey: string
): Promise<number[][]> {
  const response = await fetch(`${supabaseUrl}/functions/v1/embed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({ texts }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Embedding failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.embeddings;
}

/**
 * Generate a single embedding for a search query.
 * Adds BGE instruction prefix for better retrieval quality.
 */
export async function embedQuery(
  query: string,
  supabaseUrl: string,
  serviceRoleKey: string
): Promise<number[]> {
  // BGE models benefit from instruction prefix for queries
  const prefixedQuery = `Represent this sentence for searching relevant passages: ${query}`;
  const embeddings = await generateEmbedding([prefixedQuery], supabaseUrl, serviceRoleKey);
  return embeddings[0];
}

// =============================================================================
// HYBRID SEARCH
// =============================================================================

/**
 * Execute hybrid search using the hybrid_search_chunks() RPC function.
 * Combines pgvector cosine similarity (0.7 weight) with PostgreSQL FTS (0.3 weight).
 */
export async function hybridSearch(
  queryEmbedding: number[],
  queryText: string,
  options: SearchOptions,
  supabaseUrl: string,
  serviceRoleKey: string
): Promise<HybridSearchResult[]> {
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data, error } = await supabase.rpc('hybrid_search_chunks', {
    p_embedding: queryEmbedding,
    p_query_text: queryText,
    p_subject: options.subject || null,
    p_subspecialty: options.subspecialty || null,
    p_view_modes: options.viewModes || null,
    p_limit: options.limit || 20,
    p_vector_weight: 0.7,
    p_fts_weight: 0.3,
  });

  if (error) {
    console.error('[search] Hybrid search RPC error:', error);
    throw new Error(`Hybrid search failed: ${error.message}`);
  }

  // Map snake_case DB columns to camelCase TypeScript types
  return (data || []).map((row: Record<string, unknown>) => ({
    id: row.id as string,
    subject: row.subject as string,
    subspecialty: row.subspecialty as string,
    topicSlug: row.topic_slug as string,
    sourceFile: row.source_file as string,
    viewMode: row.view_mode as ViewMode,
    chunkIndex: row.chunk_index as number,
    content: row.content as string,
    tokenCount: row.token_count as number | null,
    metadata: (row.metadata || {}) as ContentChunk['metadata'],
    createdAt: row.created_at as string || '',
    updatedAt: row.updated_at as string || '',
    vectorScore: row.vector_score as number,
    ftsScore: row.fts_score as number,
    combinedScore: row.combined_score as number,
  }));
}

// =============================================================================
// COHERE RERANKING (Critic Agent)
// =============================================================================

interface CohereRerankResult {
  index: number;
  relevance_score: number;
}

/**
 * Rerank search results using Cohere's cross-encoder model.
 * Returns top N results with relevance_score >= 0.3.
 *
 * Falls back to combinedScore ordering if Cohere is unavailable.
 */
export async function rerankResults(
  query: string,
  results: HybridSearchResult[],
  topN: number = 5,
  cohereApiKey?: string
): Promise<RankedSearchResult[]> {
  // If no Cohere key or no results, fall back to combined score
  if (!cohereApiKey || results.length === 0) {
    return results
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, topN)
      .map(r => ({ ...r }));
  }

  try {
    const response = await fetch('https://api.cohere.ai/v1/rerank', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cohereApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'rerank-english-v3.0',
        query,
        documents: results.map(r => r.content),
        top_n: topN,
        return_documents: false,
      }),
    });

    if (!response.ok) {
      console.warn(`[search] Cohere rerank failed: ${response.status}. Falling back to combined score.`);
      return results
        .sort((a, b) => b.combinedScore - a.combinedScore)
        .slice(0, topN)
        .map(r => ({ ...r }));
    }

    const data = await response.json();
    const rerankResults: CohereRerankResult[] = data.results || [];

    // Filter by noise threshold (0.3) and map back to original results
    return rerankResults
      .filter(r => r.relevance_score >= 0.3)
      .map(r => ({
        ...results[r.index],
        rerankScore: r.relevance_score,
      }));
  } catch (error) {
    console.warn('[search] Cohere rerank error, falling back:', error);
    return results
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, topN)
      .map(r => ({ ...r }));
  }
}

// =============================================================================
// FULL RETRIEVAL PIPELINE
// =============================================================================

/**
 * Execute the complete RAG retrieval pipeline:
 * 1. Embed query
 * 2. Hybrid search (pgvector + FTS)
 * 3. Rerank with Cohere (optional)
 *
 * @returns Top 5 ranked content chunks
 */
export async function retrieveContext(
  expandedQuery: string,
  queryKeywords: string[],
  options: SearchOptions & {
    supabaseUrl: string;
    serviceRoleKey: string;
    cohereApiKey?: string;
  }
): Promise<RankedSearchResult[]> {
  const {
    supabaseUrl,
    serviceRoleKey,
    cohereApiKey,
    ...searchOptions
  } = options;

  // Step 1: Embed the expanded query
  const queryEmbedding = await embedQuery(expandedQuery, supabaseUrl, serviceRoleKey);

  // Step 2: Hybrid search (vector + FTS in parallel via the RPC)
  const candidates = await hybridSearch(
    queryEmbedding,
    queryKeywords.join(' '),
    { ...searchOptions, limit: 20 },
    supabaseUrl,
    serviceRoleKey
  );

  if (candidates.length === 0) {
    return [];
  }

  // Step 3: Rerank with Cohere (falls back gracefully)
  const enableReranking = searchOptions.enableReranking !== false;
  const ranked = enableReranking
    ? await rerankResults(expandedQuery, candidates, 5, cohereApiKey)
    : candidates.sort((a, b) => b.combinedScore - a.combinedScore).slice(0, 5);

  return ranked;
}

// =============================================================================
// SEARCH RESULT CACHE (Short TTL)
// =============================================================================

const CACHE_TTL_MS = 10_000; // 10 seconds

interface CacheEntry {
  results: RankedSearchResult[];
  expiresAt: number;
}

const searchCache = new Map<string, CacheEntry>();

/** Generate cache key from query + options */
function cacheKey(query: string, options: SearchOptions): string {
  return `${query}::${options.subject || ''}::${options.subspecialty || ''}::${(options.viewModes || []).join(',')}`;
}

/** Get cached results if still valid */
export function getCachedSearch(query: string, options: SearchOptions): RankedSearchResult[] | null {
  const key = cacheKey(query, options);
  const cached = searchCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.results;
  }
  searchCache.delete(key);
  return null;
}

/** Store results in cache */
export function setCachedSearch(
  query: string,
  options: SearchOptions,
  results: RankedSearchResult[]
): void {
  const key = cacheKey(query, options);
  searchCache.set(key, {
    results,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });

  // Prune expired entries periodically
  if (searchCache.size > 100) {
    const now = Date.now();
    for (const [k, v] of searchCache) {
      if (v.expiresAt <= now) searchCache.delete(k);
    }
  }
}
