-- NucleuX Academy - ATOM Source Platform Final V2
-- Migration: 008_atom_source_platform_v2
-- Date: 2026-03-08

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'source_lifecycle_state') THEN
    CREATE TYPE source_lifecycle_state AS ENUM (
      'cataloged',
      'qc_pending',
      'qc_failed',
      'qc_passed',
      'ingestion_running',
      'indexed_ready',
      'stale',
      'archived'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'source_rollout_state') THEN
    CREATE TYPE source_rollout_state AS ENUM ('inactive', 'canary', 'active', 'rolled_back');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'source_qc_run_status') THEN
    CREATE TYPE source_qc_run_status AS ENUM ('pending', 'passed', 'failed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'source_ingestion_status') THEN
    CREATE TYPE source_ingestion_status AS ENUM ('queued', 'running', 'indexed_ready', 'failed', 'rolled_back');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'source_chapter_qc_status') THEN
    CREATE TYPE source_chapter_qc_status AS ENUM ('pending', 'passed', 'failed', 'warning');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS source_books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT UNIQUE,
  title TEXT NOT NULL,
  domain TEXT,
  level_tags TEXT[] NOT NULL DEFAULT '{}',
  lifecycle_state source_lifecycle_state NOT NULL DEFAULT 'cataloged',

  pipeline_version TEXT,
  ocr_model_version TEXT,
  prompt_version TEXT,

  approved_by UUID,
  approved_at TIMESTAMPTZ,
  override_reason TEXT,

  validated_at TIMESTAMPTZ,
  revalidate_after TIMESTAMPTZ,

  active_index_version TEXT,
  candidate_index_version TEXT,
  rollout_state source_rollout_state NOT NULL DEFAULT 'inactive',

  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT source_books_source_id_catalog_fk
    FOREIGN KEY (source_id) REFERENCES atom_source_catalog(id) ON DELETE SET NULL,
  CONSTRAINT source_books_approved_by_user_fk
    FOREIGN KEY (approved_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_source_books_lifecycle_rollout
  ON source_books (lifecycle_state, rollout_state);

CREATE INDEX IF NOT EXISTS idx_source_books_source_id
  ON source_books (source_id);

CREATE TABLE IF NOT EXISTS source_book_qc_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_book_id UUID NOT NULL REFERENCES source_books(id) ON DELETE CASCADE,
  status source_qc_run_status NOT NULL DEFAULT 'pending',
  summary TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,

  pipeline_version TEXT,
  ocr_model_version TEXT,
  prompt_version TEXT,

  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  override_reason TEXT,

  validated_at TIMESTAMPTZ,
  revalidate_after TIMESTAMPTZ,

  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_source_book_qc_runs_book_created
  ON source_book_qc_runs (source_book_id, created_at DESC);

CREATE TABLE IF NOT EXISTS source_chapter_qc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_book_id UUID NOT NULL REFERENCES source_books(id) ON DELETE CASCADE,
  qc_run_id UUID NOT NULL REFERENCES source_book_qc_runs(id) ON DELETE CASCADE,
  chapter_key TEXT,
  chapter_title TEXT,
  status source_chapter_qc_status NOT NULL DEFAULT 'pending',
  score NUMERIC(5,2),
  findings JSONB NOT NULL DEFAULT '{}'::jsonb,

  validated_at TIMESTAMPTZ,
  revalidate_after TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (qc_run_id, chapter_key)
);

CREATE INDEX IF NOT EXISTS idx_source_chapter_qc_book_status
  ON source_chapter_qc (source_book_id, status);

CREATE TABLE IF NOT EXISTS source_ingestion_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_book_id UUID NOT NULL REFERENCES source_books(id) ON DELETE CASCADE,
  status source_ingestion_status NOT NULL DEFAULT 'queued',
  notes TEXT,

  pipeline_version TEXT,
  ocr_model_version TEXT,
  prompt_version TEXT,

  chunk_count INTEGER,
  ingest_duration_ms BIGINT,
  embed_cost_usd NUMERIC(12,6),
  index_cost_usd NUMERIC(12,6),

  active_index_version TEXT,
  candidate_index_version TEXT,
  rollout_state source_rollout_state,

  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_source_ingestion_runs_book_created
  ON source_ingestion_runs (source_book_id, created_at DESC);

CREATE TABLE IF NOT EXISTS source_book_status (
  source_book_id UUID PRIMARY KEY REFERENCES source_books(id) ON DELETE CASCADE,
  source_id TEXT,
  title TEXT NOT NULL,
  domain TEXT,
  level_tags TEXT[] NOT NULL DEFAULT '{}',
  lifecycle_state source_lifecycle_state NOT NULL,

  qc_passed BOOLEAN NOT NULL DEFAULT false,
  indexed_ready BOOLEAN NOT NULL DEFAULT false,
  rollout_state source_rollout_state NOT NULL DEFAULT 'inactive',
  selectable BOOLEAN GENERATED ALWAYS AS (indexed_ready AND qc_passed AND rollout_state = 'active'::source_rollout_state) STORED,
  availability_reason TEXT,

  last_qc_run_id UUID REFERENCES source_book_qc_runs(id) ON DELETE SET NULL,
  last_ingestion_run_id UUID REFERENCES source_ingestion_runs(id) ON DELETE SET NULL,

  pipeline_version TEXT,
  ocr_model_version TEXT,
  prompt_version TEXT,

  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  override_reason TEXT,

  validated_at TIMESTAMPTZ,
  revalidate_after TIMESTAMPTZ,

  chunk_count INTEGER,
  ingest_duration_ms BIGINT,
  embed_cost_usd NUMERIC(12,6),
  index_cost_usd NUMERIC(12,6),

  active_index_version TEXT,
  candidate_index_version TEXT,

  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_source_book_status_selectable
  ON source_book_status (selectable, lifecycle_state, rollout_state);

CREATE INDEX IF NOT EXISTS idx_source_book_status_source
  ON source_book_status (source_id);

-- updated_at triggers
DROP TRIGGER IF EXISTS update_source_books_updated_at ON source_books;
CREATE TRIGGER update_source_books_updated_at
  BEFORE UPDATE ON source_books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_source_chapter_qc_updated_at ON source_chapter_qc;
CREATE TRIGGER update_source_chapter_qc_updated_at
  BEFORE UPDATE ON source_chapter_qc
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_source_book_status_updated_at ON source_book_status;
CREATE TRIGGER update_source_book_status_updated_at
  BEFORE UPDATE ON source_book_status
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE source_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_book_qc_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_chapter_qc ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_ingestion_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_book_status ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read source_books" ON source_books;
CREATE POLICY "Authenticated users can read source_books"
  ON source_books FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write source_books" ON source_books;
CREATE POLICY "Authenticated users can write source_books"
  ON source_books FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read source_book_qc_runs" ON source_book_qc_runs;
CREATE POLICY "Authenticated users can read source_book_qc_runs"
  ON source_book_qc_runs FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write source_book_qc_runs" ON source_book_qc_runs;
CREATE POLICY "Authenticated users can write source_book_qc_runs"
  ON source_book_qc_runs FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read source_chapter_qc" ON source_chapter_qc;
CREATE POLICY "Authenticated users can read source_chapter_qc"
  ON source_chapter_qc FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write source_chapter_qc" ON source_chapter_qc;
CREATE POLICY "Authenticated users can write source_chapter_qc"
  ON source_chapter_qc FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read source_ingestion_runs" ON source_ingestion_runs;
CREATE POLICY "Authenticated users can read source_ingestion_runs"
  ON source_ingestion_runs FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write source_ingestion_runs" ON source_ingestion_runs;
CREATE POLICY "Authenticated users can write source_ingestion_runs"
  ON source_ingestion_runs FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can read source_book_status" ON source_book_status;
CREATE POLICY "Authenticated users can read source_book_status"
  ON source_book_status FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can write source_book_status" ON source_book_status;
CREATE POLICY "Authenticated users can write source_book_status"
  ON source_book_status FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');