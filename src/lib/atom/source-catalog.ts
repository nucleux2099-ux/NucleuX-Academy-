export const ATOM_SOURCE_LEVELS = ['UG', 'PG', 'Resident', 'Consultant'] as const;
export const ATOM_SOURCE_PRESETS = ['exam-focus', 'clinical-deep-dive', 'rapid-revision'] as const;

export type AtomSourceLevel = (typeof ATOM_SOURCE_LEVELS)[number];
export type AtomSourcePreset = (typeof ATOM_SOURCE_PRESETS)[number];

export type AtomSourceCatalogItem = {
  id: string;
  title: string;
  level: AtomSourceLevel;
  domain: string;
  edition?: string;
};

export const ATOM_SOURCE_CATALOG: AtomSourceCatalogItem[] = [
  { id: 'src-001', title: "Gray's Anatomy for Students", level: 'UG', domain: 'Anatomy', edition: '5th' },
  { id: 'src-002', title: 'Ganong Review of Medical Physiology', level: 'UG', domain: 'Physiology', edition: '27th' },
  { id: 'src-003', title: 'Lippincott Illustrated Reviews: Biochemistry', level: 'UG', domain: 'Biochemistry', edition: '8th' },
  { id: 'src-004', title: "Robbins & Cotran Pathologic Basis of Disease", level: 'UG', domain: 'Pathology', edition: '10th' },
  { id: 'src-005', title: "Katzung's Basic & Clinical Pharmacology", level: 'UG', domain: 'Pharmacology', edition: '15th' },
  { id: 'src-006', title: 'Jawetz, Melnick & Adelberg Medical Microbiology', level: 'UG', domain: 'Microbiology', edition: '29th' },
  { id: 'src-007', title: 'Essentials of Forensic Medicine & Toxicology', level: 'UG', domain: 'Forensic Medicine' },
  { id: 'src-008', title: 'Parks Textbook of Preventive & Social Medicine', level: 'UG', domain: 'Community Medicine' },

  { id: 'src-009', title: "Harrison's Principles of Internal Medicine", level: 'PG', domain: 'Medicine', edition: '21st' },
  { id: 'src-010', title: "Bailey & Love's Short Practice of Surgery", level: 'PG', domain: 'Surgery', edition: '28th' },
  { id: 'src-011', title: "Williams Obstetrics", level: 'PG', domain: 'Obstetrics & Gynecology', edition: '26th' },
  { id: 'src-012', title: 'Nelson Textbook of Pediatrics', level: 'PG', domain: 'Pediatrics', edition: '22nd' },
  { id: 'src-013', title: 'Miller Anesthesia', level: 'PG', domain: 'Anesthesiology', edition: '9th' },
  { id: 'src-014', title: 'Grainger & Allison Diagnostic Radiology', level: 'PG', domain: 'Radiology', edition: '8th' },
  { id: 'src-015', title: "Kanski's Clinical Ophthalmology", level: 'PG', domain: 'Ophthalmology', edition: '10th' },
  { id: 'src-016', title: "Scott-Brown's Otorhinolaryngology", level: 'PG', domain: 'ENT', edition: '8th' },

  { id: 'src-017', title: 'SABISTON Textbook of Surgery', level: 'Resident', domain: 'Surgery', edition: '21st' },
  { id: 'src-018', title: 'Tintinalli Emergency Medicine', level: 'Resident', domain: 'Emergency Medicine', edition: '9th' },
  { id: 'src-019', title: 'ICU Protocols for Residents', level: 'Resident', domain: 'Critical Care' },
  { id: 'src-020', title: 'Current Medical Diagnosis & Treatment', level: 'Resident', domain: 'Medicine', edition: '2026' },
  { id: 'src-021', title: 'Oxford Handbook of Clinical Medicine', level: 'Resident', domain: 'General Clinical Practice', edition: '11th' },

  { id: 'src-022', title: "Schwartz's Principles of Surgery", level: 'Consultant', domain: 'Surgery', edition: '12th' },
  { id: 'src-023', title: 'Braunwald Heart Disease', level: 'Consultant', domain: 'Cardiology', edition: '12th' },
  { id: 'src-024', title: 'Sleisenger and Fordtran Gastrointestinal Disease', level: 'Consultant', domain: 'Gastroenterology', edition: '12th' },
  { id: 'src-025', title: 'DeVita Cancer: Principles & Practice of Oncology', level: 'Consultant', domain: 'Oncology', edition: '12th' },
  { id: 'src-026', title: 'Campbell-Walsh-Wein Urology', level: 'Consultant', domain: 'Urology', edition: '13th' },
];

export const ATOM_PRESET_LABELS: Record<AtomSourcePreset, string> = {
  'exam-focus': 'Exam Focus',
  'clinical-deep-dive': 'Clinical Deep Dive',
  'rapid-revision': 'Rapid Revision',
};
