-- NucleuX Academy - ATOM source availability sync fields
-- Migration: 007_atom_source_availability
-- Date: 2026-03-08

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'atom_source_availability_status'
  ) THEN
    CREATE TYPE atom_source_availability_status AS ENUM (
      'indexed_ready',
      'md_ready_not_ingested',
      'pdf_only',
      'missing'
    );
  END IF;
END $$;

ALTER TABLE atom_source_catalog
  ADD COLUMN IF NOT EXISTS availability_status atom_source_availability_status,
  ADD COLUMN IF NOT EXISTS chapter_count INT,
  ADD COLUMN IF NOT EXISTS chunk_count INT,
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_atom_source_catalog_availability
  ON atom_source_catalog (availability_status, enabled, sort_order, priority DESC);
