-- NucleuX Academy - ATOM v2 Orchestrator Phase 1
-- Migration: 005_atom_v2_phase1
-- Date: 2026-03-08

CREATE TABLE IF NOT EXISTS atom_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('queued', 'running', 'needs_input', 'completed', 'failed', 'cancelled')),
  mode TEXT NOT NULL CHECK (mode IN ('quick', 'task')),
  title TEXT,
  input_message TEXT NOT NULL,
  source_snapshot JSONB NOT NULL,
  current_phase TEXT,
  error_code TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_atom_tasks_user_created_at
  ON atom_tasks (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_atom_tasks_status_created_at
  ON atom_tasks (status, created_at DESC);

CREATE TABLE IF NOT EXISTS atom_task_events (
  id BIGSERIAL PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES atom_tasks(id) ON DELETE CASCADE,
  seq INT NOT NULL,
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(task_id, seq)
);

CREATE INDEX IF NOT EXISTS idx_atom_task_events_task_id_id
  ON atom_task_events (task_id, id);

CREATE TABLE IF NOT EXISTS atom_task_artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES atom_tasks(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('code', 'table', 'notes', 'citations', 'outline', 'mindmap', 'file')),
  title TEXT,
  content JSONB NOT NULL,
  version INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_atom_task_artifacts_task_kind_updated
  ON atom_task_artifacts (task_id, kind, updated_at DESC);

CREATE TABLE IF NOT EXISTS atom_task_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES atom_tasks(id) ON DELETE CASCADE,
  phase TEXT NOT NULL,
  state JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE atom_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_task_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_task_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE atom_task_checkpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own atom tasks" ON atom_tasks
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage events for own atom tasks" ON atom_task_events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM atom_tasks t
      WHERE t.id = atom_task_events.task_id
      AND t.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM atom_tasks t
      WHERE t.id = atom_task_events.task_id
      AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage artifacts for own atom tasks" ON atom_task_artifacts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM atom_tasks t
      WHERE t.id = atom_task_artifacts.task_id
      AND t.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM atom_tasks t
      WHERE t.id = atom_task_artifacts.task_id
      AND t.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage checkpoints for own atom tasks" ON atom_task_checkpoints
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM atom_tasks t
      WHERE t.id = atom_task_checkpoints.task_id
      AND t.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM atom_tasks t
      WHERE t.id = atom_task_checkpoints.task_id
      AND t.user_id = auth.uid()
    )
  );
