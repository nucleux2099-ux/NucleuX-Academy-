# ATOM v2: Phase 1 & 2 Documentation

This document outlines the components implemented during Phase 1 (RAG Foundation) and Phase 2 (Core Orchestration) of the ATOM v2 backend migration.

## Phase 1: RAG Foundation (Data Layer)

The goal of Phase 1 was to transition from naive keyword searches (reading files off disk) to a sophisticated semantic vector search infrastructure.

### Components Built

1. **Database Schema (`009_atom_vector_search.sql`)**
   - Enabled the `pgvector` extension.
   - Created the `content_chunks` table to store curriculum data.
   - Set up an `HNSW` index for sub-millisecond approximate nearest neighbor (ANN) vector searches.
   - Set up a `GIN` index and a computed `fts` (tsvector) column for PostgreSQL Full-Text Search.
   - Created the `hybrid_search_chunks` RPC function to merge Cosine Similarity (Vector) and BM25 (FTS) scores, returning the top heavily-matched chunks.

2. **Embedding Edge Function (`supabase/functions/embed/index.ts`)**
   - Developed a self-hosted Supabase Edge Function using `Transformers.js`.
   - Runs the `BAAI/bge-small-en-v1.5` ONNX model directly on Deno, removing any dependency on paid APIs (like OpenAI ADA) for generating 384-dimensional embeddings.

3. **Offline Chunking Pipeline (`scripts/chunk-content.ts`)**
   - Script that recursively reads the `/content/` directory.
   - Splits markdown texts semantically (headers and paragraphs) ensuring chunks stay below the strict 512-token limit.
   - Calls the `embed` edge function and batches upsert operations into the `content_chunks` table.

---

## Phase 2: Core Orchestration (Gateway Layer)

Phase 2 built the entry point for the AI system, ensuring it can handle concurrent requests and route them intelligently.

### Components Built

1. **Session Lane Queue (`src/lib/atom/gateway/session-manager.ts`)**
   - Implemented an asynchronous locking mechanism (`acquireSessionLock`).
   - If a user sends 3 messages rapidly, the Lane Queue ensures Message 1 is completely processed (including background memory writes in later phases) before Message 2 begins. This prevents database race conditions on the same session ID.

2. **The Scribe Agent (`src/lib/atom/agents/scribe.ts`)**
   - The first agent in the pipeline.
   - Analyzes incoming user queries to classify intent (`learn`, `practice`, `review`, `chit_chat`, etc.).
   - Crucially, it expands medical queries using a `MEDICAL_SYNONYMS` terminology map (e.g., expanding "appendicitis" to include "rlq", "mcburney") to ensure the downstream Retriever agent pulls highly relevant semantic vectors.
   - Intelligently bypasses the expensive RAG pipeline if the intent is simply `chit_chat` or a generic greeting.

3. **API Route Integration (`src/app/api/chat/route.ts`)**
   - Refactored the core Next.js POST route.
   - Integrated the `session-manager` to wrap the entire block in a lock/release sequence.
   - Injected the `Scribe` intent analysis directly into the system prompt logic, allowing Claude to tailor its pedagogical approach based on whether the student wants to learn a new topic versus review an old one.
