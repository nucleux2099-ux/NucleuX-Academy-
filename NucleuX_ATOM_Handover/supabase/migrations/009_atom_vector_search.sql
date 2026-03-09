-- NucleuX Academy - ATOM v2: Vector Search Infrastructure
-- Migration: 009_atom_vector_search
-- Date: 2026-02-22
-- Spec: docs/specs/ATOM_RAG_PIPELINE_SPEC.md
--
-- This migration sets up:
-- 1. pgvector extension for embedding storage & similarity search
-- 2. content_chunks table (semantic chunks of /content/ markdown)
-- 3. Hybrid search function (pgvector cosine + PostgreSQL FTS)
-- 4. RLS policies (public read, admin write)

-- =====================================================
-- 1. ENABLE PGVECTOR EXTENSION
-- =====================================================

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

-- =====================================================
-- 2. CONTENT CHUNKS TABLE
-- =====================================================
-- Stores semantically chunked content from /content/ markdown files.
-- Each chunk gets a BGE-small-en-v1.5 embedding (384 dimensions).
-- Populated by the chunking pipeline (POST /api/atom/admin/embed).

CREATE TABLE IF NOT EXISTS content_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Content location (mirrors filesystem: /content/{subject}/{subspecialty}/{topic}/{source_file})
  subject TEXT NOT NULL,              -- e.g., 'surgery', 'medicine', 'anatomy'
  subspecialty TEXT NOT NULL,          -- e.g., 'esophagus', 'hepatobiliary', 'cardiac'
  topic_slug TEXT NOT NULL,            -- e.g., 'achalasia-cardia', 'breast-cancer'
  source_file TEXT NOT NULL,           -- e.g., 'explorer.md', 'exam-prep.md', 'textbook.md'
  view_mode TEXT NOT NULL,             -- explorer | exam_prep | textbook | cases | retrieval_cards | roadmap

  -- Chunk content
  chunk_index INTEGER NOT NULL,        -- position within the source file (0-based)
  content TEXT NOT NULL,               -- actual chunk text (target ~512 tokens, 64-token overlap)
  token_count INTEGER,                 -- estimated token count for context budgeting

  -- Embeddings (BGE-small-en-v1.5, 384 dimensions)
  embedding vector(384),

  -- Full-text search (auto-generated tsvector)
  fts tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,

  -- Metadata (extracted during chunking)
  metadata JSONB DEFAULT '{}',
  -- Expected shape:
  -- {
  --   "headings": ["H2: Treatment", "H3: Surgical"],
  --   "nmcCodes": ["SU22.1", "SU22.2"],
  --   "highYield": true,
  --   "difficulty": "intermediate",
  --   "textbookRef": "Sabiston 21st Ed, Ch 42",
  --   "contentType": "clinical" | "basic_science" | "pathology" | "pharmacology"
  -- }

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate chunks for the same content location
  UNIQUE(topic_slug, source_file, chunk_index)
);

-- =====================================================
-- 3. INDEXES
-- =====================================================

-- HNSW index for fast approximate nearest neighbor search
-- m=16, ef_construction=64 balances speed vs recall for ~500K chunks
CREATE INDEX IF NOT EXISTS idx_chunks_embedding
  ON content_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_chunks_fts
  ON content_chunks
  USING gin (fts);

-- Composite index for filtered vector search (search within a subject)
CREATE INDEX IF NOT EXISTS idx_chunks_subject_subspecialty
  ON content_chunks (subject, subspecialty);

-- Index for topic-level lookups
CREATE INDEX IF NOT EXISTS idx_chunks_topic
  ON content_chunks (topic_slug);

-- Index for view mode filtering
CREATE INDEX IF NOT EXISTS idx_chunks_view_mode
  ON content_chunks (view_mode);

-- Metadata GIN index for JSONB queries (e.g., high-yield filtering)
CREATE INDEX IF NOT EXISTS idx_chunks_metadata
  ON content_chunks
  USING gin (metadata);

-- =====================================================
-- 4. HYBRID SEARCH FUNCTION
-- =====================================================
-- Combines pgvector cosine similarity with PostgreSQL full-text search.
-- Returns merged, deduplicated results scored by weighted combination.
--
-- Usage:
--   SELECT * FROM hybrid_search_chunks(
--     p_embedding := <384d vector>,
--     p_query_text := 'achalasia treatment surgical',
--     p_subject := 'surgery',        -- optional filter
--     p_limit := 20,
--     p_vector_weight := 0.7,
--     p_fts_weight := 0.3
--   );

CREATE OR REPLACE FUNCTION hybrid_search_chunks(
  p_embedding vector(384),
  p_query_text TEXT,
  p_subject TEXT DEFAULT NULL,
  p_subspecialty TEXT DEFAULT NULL,
  p_view_modes TEXT[] DEFAULT NULL,
  p_limit INTEGER DEFAULT 20,
  p_vector_weight FLOAT DEFAULT 0.7,
  p_fts_weight FLOAT DEFAULT 0.3
)
RETURNS TABLE (
  id UUID,
  topic_slug TEXT,
  subject TEXT,
  subspecialty TEXT,
  source_file TEXT,
  view_mode TEXT,
  chunk_index INTEGER,
  content TEXT,
  token_count INTEGER,
  metadata JSONB,
  vector_score FLOAT,
  fts_score FLOAT,
  combined_score FLOAT
) AS $$
BEGIN
  RETURN QUERY
  WITH vector_results AS (
    SELECT
      c.id,
      1 - (c.embedding <=> p_embedding) AS v_score
    FROM content_chunks c
    WHERE c.embedding IS NOT NULL
      AND (p_subject IS NULL OR c.subject = p_subject)
      AND (p_subspecialty IS NULL OR c.subspecialty = p_subspecialty)
      AND (p_view_modes IS NULL OR c.view_mode = ANY(p_view_modes))
    ORDER BY c.embedding <=> p_embedding
    LIMIT p_limit * 2  -- fetch extra for merging
  ),
  fts_results AS (
    SELECT
      c.id,
      ts_rank_cd(c.fts, websearch_to_tsquery('english', p_query_text)) AS f_score
    FROM content_chunks c
    WHERE c.fts @@ websearch_to_tsquery('english', p_query_text)
      AND (p_subject IS NULL OR c.subject = p_subject)
      AND (p_subspecialty IS NULL OR c.subspecialty = p_subspecialty)
      AND (p_view_modes IS NULL OR c.view_mode = ANY(p_view_modes))
    ORDER BY f_score DESC
    LIMIT p_limit * 2
  ),
  merged AS (
    SELECT
      COALESCE(v.id, f.id) AS chunk_id,
      COALESCE(v.v_score, 0.0) AS v_score,
      COALESCE(f.f_score, 0.0) AS f_score,
      (COALESCE(v.v_score, 0.0) * p_vector_weight) +
      (COALESCE(f.f_score, 0.0) * p_fts_weight) AS c_score
    FROM vector_results v
    FULL OUTER JOIN fts_results f ON v.id = f.id
  )
  SELECT
    c.id,
    c.topic_slug,
    c.subject,
    c.subspecialty,
    c.source_file,
    c.view_mode,
    c.chunk_index,
    c.content,
    c.token_count,
    c.metadata,
    m.v_score::FLOAT AS vector_score,
    m.f_score::FLOAT AS fts_score,
    m.c_score::FLOAT AS combined_score
  FROM merged m
  JOIN content_chunks c ON c.id = m.chunk_id
  ORDER BY m.c_score DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- =====================================================
-- 5. RLS POLICIES
-- =====================================================
-- Content chunks are public read (all authenticated users can search).
-- Only service_role (admin/backend) can INSERT/UPDATE/DELETE.

ALTER TABLE content_chunks ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read content chunks
CREATE POLICY "Authenticated users can read chunks"
  ON content_chunks
  FOR SELECT
  TO authenticated
  USING (true);

-- =====================================================
-- 6. UPDATED_AT TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Only create if not already exists (other migrations may have created it)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_content_chunks'
  ) THEN
    CREATE TRIGGER set_updated_at_content_chunks
      BEFORE UPDATE ON content_chunks
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- =====================================================
-- 7. COMMENTS
-- =====================================================

COMMENT ON TABLE content_chunks IS 'Semantic content chunks with BGE-small embeddings for ATOM v2 RAG pipeline. See docs/specs/ATOM_RAG_PIPELINE_SPEC.md';
COMMENT ON COLUMN content_chunks.embedding IS 'BGE-small-en-v1.5 384d embedding via Supabase Edge Function';
COMMENT ON COLUMN content_chunks.fts IS 'Auto-generated tsvector for PostgreSQL full-text search';
COMMENT ON COLUMN content_chunks.metadata IS 'Extracted metadata: headings, NMC codes, high-yield flags, difficulty, textbook refs';
COMMENT ON FUNCTION hybrid_search_chunks IS 'Hybrid search combining pgvector cosine similarity (0.7 weight) with FTS (0.3 weight). See ATOM_RAG_PIPELINE_SPEC.md';
