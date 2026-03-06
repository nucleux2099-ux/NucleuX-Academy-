-- NucleuX Academy - Learning Lifecycle (Phase 1)
-- Migration: 005_learning_lifecycle
-- Date: 2026-02-22
-- Purpose: Persist PreStudy/Aim/Shoot/Skin workflows for cross-device continuity.

-- =====================================================
-- 1. CORE TABLES
-- =====================================================

-- Per-user topic-level lifecycle tracking
CREATE TABLE IF NOT EXISTS learning_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  atom_id UUID REFERENCES atoms(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  subspecialty TEXT NOT NULL DEFAULT '',
  topic_slug TEXT NOT NULL,
  topic_title TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'prestudy' CHECK (stage IN ('prestudy', 'aim', 'shoot', 'skin', 'review')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, subject, subspecialty, topic_slug)
);

-- Chunk-level scaffolding for Aim/Shoot/Skin work
CREATE TABLE IF NOT EXISTS learning_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_topic_id UUID NOT NULL REFERENCES learning_topics(id) ON DELETE CASCADE,
  chunk_key TEXT NOT NULL,
  chunk_order INT NOT NULL CHECK (chunk_order >= 1),
  title TEXT NOT NULL,
  why_important TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed')),
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (learning_topic_id, chunk_key),
  UNIQUE (learning_topic_id, chunk_order)
);

-- Stage execution log (multiple runs per stage supported)
CREATE TABLE IF NOT EXISTS learning_stage_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_topic_id UUID NOT NULL REFERENCES learning_topics(id) ON DELETE CASCADE,
  stage TEXT NOT NULL CHECK (stage IN ('prestudy', 'aim', 'shoot', 'skin')),
  run_index INT NOT NULL DEFAULT 1 CHECK (run_index >= 1),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed', 'abandoned')),
  summary JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (learning_topic_id, stage, run_index)
);

-- Generic artifact storage for method outputs
CREATE TABLE IF NOT EXISTS learning_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_topic_id UUID NOT NULL REFERENCES learning_topics(id) ON DELETE CASCADE,
  chunk_id UUID REFERENCES learning_chunks(id) ON DELETE SET NULL,
  stage_run_id UUID REFERENCES learning_stage_runs(id) ON DELETE SET NULL,
  artifact_type TEXT NOT NULL CHECK (
    artifact_type IN (
      'prestudy_keyword',
      'prestudy_assignment',
      'aim_question',
      'aim_rationale',
      'shoot_layer',
      'shoot_vprefre',
      'shoot_gap',
      'skin_grinde',
      'skin_gap',
      'mindmap_node',
      'mindmap_edge',
      'note',
      'other'
    )
  ),
  source TEXT NOT NULL DEFAULT 'user' CHECK (source IN ('user', 'atom', 'system')),
  version INT NOT NULL DEFAULT 1 CHECK (version >= 1),
  is_current BOOLEAN NOT NULL DEFAULT TRUE,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Checkpoint evaluations for stage progression
CREATE TABLE IF NOT EXISTS learning_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_topic_id UUID NOT NULL REFERENCES learning_topics(id) ON DELETE CASCADE,
  stage_run_id UUID REFERENCES learning_stage_runs(id) ON DELETE SET NULL,
  stage TEXT NOT NULL CHECK (stage IN ('prestudy', 'aim', 'shoot', 'skin')),
  checkpoint_code TEXT NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT FALSE,
  score NUMERIC(6,2),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 2. INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_learning_topics_user_stage_status
  ON learning_topics(user_id, stage, status);

CREATE INDEX IF NOT EXISTS idx_learning_topics_user_updated
  ON learning_topics(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_learning_chunks_topic_order
  ON learning_chunks(learning_topic_id, chunk_order);

CREATE INDEX IF NOT EXISTS idx_learning_stage_runs_topic_stage
  ON learning_stage_runs(learning_topic_id, stage, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_learning_artifacts_topic_type_current
  ON learning_artifacts(learning_topic_id, artifact_type, is_current, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_learning_artifacts_chunk
  ON learning_artifacts(chunk_id);

CREATE INDEX IF NOT EXISTS idx_learning_checkpoints_topic_stage
  ON learning_checkpoints(learning_topic_id, stage, evaluated_at DESC);

-- =====================================================
-- 3. TRIGGERS
-- =====================================================

DROP TRIGGER IF EXISTS update_learning_topics_updated_at ON learning_topics;
CREATE TRIGGER update_learning_topics_updated_at
  BEFORE UPDATE ON learning_topics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_learning_chunks_updated_at ON learning_chunks;
CREATE TRIGGER update_learning_chunks_updated_at
  BEFORE UPDATE ON learning_chunks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_learning_stage_runs_updated_at ON learning_stage_runs;
CREATE TRIGGER update_learning_stage_runs_updated_at
  BEFORE UPDATE ON learning_stage_runs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_learning_artifacts_updated_at ON learning_artifacts;
CREATE TRIGGER update_learning_artifacts_updated_at
  BEFORE UPDATE ON learning_artifacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_learning_checkpoints_updated_at ON learning_checkpoints;
CREATE TRIGGER update_learning_checkpoints_updated_at
  BEFORE UPDATE ON learning_checkpoints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- 4. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE learning_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_stage_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_checkpoints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own learning topics" ON learning_topics;
CREATE POLICY "Users can manage own learning topics"
  ON learning_topics FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own learning chunks" ON learning_chunks;
CREATE POLICY "Users can manage own learning chunks"
  ON learning_chunks FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM learning_topics lt
      WHERE lt.id = learning_chunks.learning_topic_id
        AND lt.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM learning_topics lt
      WHERE lt.id = learning_chunks.learning_topic_id
        AND lt.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage own learning stage runs" ON learning_stage_runs;
CREATE POLICY "Users can manage own learning stage runs"
  ON learning_stage_runs FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM learning_topics lt
      WHERE lt.id = learning_stage_runs.learning_topic_id
        AND lt.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM learning_topics lt
      WHERE lt.id = learning_stage_runs.learning_topic_id
        AND lt.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage own learning artifacts" ON learning_artifacts;
CREATE POLICY "Users can manage own learning artifacts"
  ON learning_artifacts FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM learning_topics lt
      WHERE lt.id = learning_artifacts.learning_topic_id
        AND lt.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM learning_topics lt
      WHERE lt.id = learning_artifacts.learning_topic_id
        AND lt.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can manage own learning checkpoints" ON learning_checkpoints;
CREATE POLICY "Users can manage own learning checkpoints"
  ON learning_checkpoints FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM learning_topics lt
      WHERE lt.id = learning_checkpoints.learning_topic_id
        AND lt.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM learning_topics lt
      WHERE lt.id = learning_checkpoints.learning_topic_id
        AND lt.user_id = auth.uid()
    )
  );
