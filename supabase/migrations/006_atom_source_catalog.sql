-- NucleuX Academy - ATOM source catalog
-- Migration: 006_atom_source_catalog
-- Date: 2026-03-08

CREATE TABLE IF NOT EXISTS atom_source_catalog (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_title TEXT NOT NULL,
  domain TEXT NOT NULL,
  level_tags TEXT[] NOT NULL DEFAULT '{}',
  priority INT NOT NULL DEFAULT 100,
  enabled BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 100,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_atom_source_catalog_enabled_sort
  ON atom_source_catalog (enabled, sort_order, priority DESC);

CREATE INDEX IF NOT EXISTS idx_atom_source_catalog_level_tags
  ON atom_source_catalog USING GIN (level_tags);

CREATE INDEX IF NOT EXISTS idx_atom_source_catalog_domain
  ON atom_source_catalog (domain);

ALTER TABLE atom_source_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read atom source catalog" ON atom_source_catalog;
CREATE POLICY "Authenticated users can read atom source catalog"
  ON atom_source_catalog
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP TRIGGER IF EXISTS update_atom_source_catalog_updated_at ON atom_source_catalog;
CREATE TRIGGER update_atom_source_catalog_updated_at
  BEFORE UPDATE ON atom_source_catalog
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

INSERT INTO atom_source_catalog (id, title, short_title, domain, level_tags, priority, enabled, sort_order, metadata)
VALUES
  ('grays-anatomy-for-students', 'Gray''s Anatomy for Students', 'Gray''s Anatomy', 'Anatomy', ARRAY['UG'], 100, true, 10, '{"edition":"5th"}'::jsonb),
  ('ganong-review-of-medical-physiology', 'Ganong Review of Medical Physiology', 'Ganong Physiology', 'Physiology', ARRAY['UG'], 100, true, 20, '{"edition":"27th"}'::jsonb),
  ('lippincott-illustrated-reviews-biochemistry', 'Lippincott Illustrated Reviews: Biochemistry', 'Lippincott Biochemistry', 'Biochemistry', ARRAY['UG'], 100, true, 30, '{"edition":"8th"}'::jsonb),
  ('robbins-cotran-pathologic-basis-of-disease', 'Robbins & Cotran Pathologic Basis of Disease', 'Robbins & Cotran', 'Pathology', ARRAY['UG'], 100, true, 40, '{"edition":"10th"}'::jsonb),
  ('katzung-basic-clinical-pharmacology', 'Katzung''s Basic & Clinical Pharmacology', 'Katzung Pharmacology', 'Pharmacology', ARRAY['UG'], 100, true, 50, '{"edition":"15th"}'::jsonb),
  ('jawetz-melnick-adelberg-medical-microbiology', 'Jawetz, Melnick & Adelberg Medical Microbiology', 'Jawetz Microbiology', 'Microbiology', ARRAY['UG'], 100, true, 60, '{"edition":"29th"}'::jsonb),
  ('essentials-of-forensic-medicine-and-toxicology', 'Essentials of Forensic Medicine & Toxicology', 'Essentials Forensic', 'Forensic Medicine', ARRAY['UG'], 100, true, 70, '{}'::jsonb),
  ('parks-textbook-of-preventive-and-social-medicine', 'Parks Textbook of Preventive & Social Medicine', 'Parks PSM', 'Community Medicine', ARRAY['UG'], 100, true, 80, '{}'::jsonb),

  ('harrisons-principles-of-internal-medicine', 'Harrison''s Principles of Internal Medicine', 'Harrison''s', 'Medicine', ARRAY['PG'], 95, true, 90, '{"edition":"21st"}'::jsonb),
  ('bailey-and-loves-short-practice-of-surgery', 'Bailey & Love''s Short Practice of Surgery', 'Bailey & Love', 'Surgery', ARRAY['PG'], 95, true, 100, '{"edition":"28th"}'::jsonb),
  ('williams-obstetrics', 'Williams Obstetrics', 'Williams Obstetrics', 'Obstetrics & Gynecology', ARRAY['PG'], 95, true, 110, '{"edition":"26th"}'::jsonb),
  ('nelson-textbook-of-pediatrics', 'Nelson Textbook of Pediatrics', 'Nelson Pediatrics', 'Pediatrics', ARRAY['PG'], 95, true, 120, '{"edition":"22nd"}'::jsonb),
  ('miller-anesthesia', 'Miller Anesthesia', 'Miller', 'Anesthesiology', ARRAY['PG'], 95, true, 130, '{"edition":"9th"}'::jsonb),
  ('grainger-and-allison-diagnostic-radiology', 'Grainger & Allison Diagnostic Radiology', 'Grainger Radiology', 'Radiology', ARRAY['PG'], 95, true, 140, '{"edition":"8th"}'::jsonb),
  ('kanskis-clinical-ophthalmology', 'Kanski''s Clinical Ophthalmology', 'Kanski', 'Ophthalmology', ARRAY['PG'], 95, true, 150, '{"edition":"10th"}'::jsonb),
  ('scott-browns-otorhinolaryngology', 'Scott-Brown''s Otorhinolaryngology', 'Scott-Brown ENT', 'ENT', ARRAY['PG'], 95, true, 160, '{"edition":"8th"}'::jsonb),

  ('sabiston-textbook-of-surgery', 'SABISTON Textbook of Surgery', 'Sabiston', 'Surgery', ARRAY['Resident'], 85, true, 170, '{"edition":"21st"}'::jsonb),
  ('tintinalli-emergency-medicine', 'Tintinalli Emergency Medicine', 'Tintinalli', 'Emergency Medicine', ARRAY['Resident'], 85, true, 180, '{"edition":"9th"}'::jsonb),
  ('icu-protocols-for-residents', 'ICU Protocols for Residents', 'ICU Protocols', 'Critical Care', ARRAY['Resident'], 85, true, 190, '{}'::jsonb),
  ('current-medical-diagnosis-and-treatment', 'Current Medical Diagnosis & Treatment', 'CMDT', 'Medicine', ARRAY['Resident'], 85, true, 200, '{"edition":"2026"}'::jsonb),
  ('oxford-handbook-of-clinical-medicine', 'Oxford Handbook of Clinical Medicine', 'Oxford Handbook', 'General Clinical Practice', ARRAY['Resident'], 85, true, 210, '{"edition":"11th"}'::jsonb),

  ('schwartzs-principles-of-surgery', 'Schwartz''s Principles of Surgery', 'Schwartz''s', 'Surgery', ARRAY['Consultant'], 75, true, 220, '{"edition":"12th"}'::jsonb),
  ('braunwald-heart-disease', 'Braunwald Heart Disease', 'Braunwald', 'Cardiology', ARRAY['Consultant'], 75, true, 230, '{"edition":"12th"}'::jsonb),
  ('sleisenger-and-fordtran-gastrointestinal-disease', 'Sleisenger and Fordtran Gastrointestinal Disease', 'Sleisenger GI', 'Gastroenterology', ARRAY['Consultant'], 75, true, 240, '{"edition":"12th"}'::jsonb),
  ('devita-cancer-principles-and-practice-of-oncology', 'DeVita Cancer: Principles & Practice of Oncology', 'DeVita Oncology', 'Oncology', ARRAY['Consultant'], 75, true, 250, '{"edition":"12th"}'::jsonb),
  ('campbell-walsh-wein-urology', 'Campbell-Walsh-Wein Urology', 'Campbell Urology', 'Urology', ARRAY['Consultant'], 75, true, 260, '{"edition":"13th"}'::jsonb)
ON CONFLICT (id) DO UPDATE
SET
  title = EXCLUDED.title,
  short_title = EXCLUDED.short_title,
  domain = EXCLUDED.domain,
  level_tags = EXCLUDED.level_tags,
  priority = EXCLUDED.priority,
  enabled = EXCLUDED.enabled,
  sort_order = EXCLUDED.sort_order,
  metadata = EXCLUDED.metadata,
  updated_at = now();
