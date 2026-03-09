# ATOM v2: Phase 3 Documentation

This document outlines the components implemented during Phase 3 (Advanced Retrieval) of the ATOM v2 backend migration. The goal of this phase was to replace naive keyword search with an intelligent, highly accurate context-gathering mechanism using semantic search and cross-encoder reranking.

## Components Built

1. **The Retriever Agent (`src/lib/atom/agents/retriever.ts`)**
   - Serves as the first step of the retrieval pipeline.
   - Takes the query (which has already been expanded with medical synonyms by the **Scribe** agent).
   - Generates an embedding for this query via the local `embed` Edge Function.
   - Executes the `hybrid_search_chunks` Supabase RPC function, pulling the top 20 candidates.
   - The hybrid search weights mathematical semantic similarity (Cosine) at 70% and exact terminology matches (BM25 FTS) at 30%.

2. **The Critic Agent (`src/lib/atom/agents/critic.ts`)**
   - Takes the 20 raw candidates from the Retriever and re-ranks them using a cross-encoder model via the **Cohere Rerank API** (`rerank-english-v3.0`).
   - Assesses the chunks based on deep structured relevance rather than pure similarity.
   - Discards noise below a `0.3` relevance threshold.
   - Ultimately picks the top 5 highest-quality chunks.
   - Implements a graceful fallback: if the Cohere API is unavailable or fails, it falls back to the native hybrid scores calculated by the database.

3. **The Context Assembler (`src/lib/atom/gateway/assembler.ts`)**
   - Takes the final accepted chunks from the Critic.
   - Bundles them securely into a structured string that will be injected into Claude's System Prompt.
   - Enforces a strict **~200,000 token budget** limit. This ensures the prompt doesn't cause overflow issues or massive latency spikes (Time To First Token) while interacting with the LLM API.

## Integration

All three components were cleanly integrated sequentially into the single `POST` handler in `src/app/api/chat/route.ts`:

1. **Scribe** detects intent and expands query.
2. If `requiresRetrieval` is true, the **Retriever** fetches 20 candidates.
3. The **Critic** distills them to the top 5.
4. The **Assembler** bundles them within token limits.
5. The result is injected as `relevantContent` into the `claude-sonnet-3.5` system context.
