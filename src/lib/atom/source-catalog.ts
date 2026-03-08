export const ATOM_SOURCE_LEVELS = ['UG', 'PG', 'Resident', 'Consultant'] as const;
export const ATOM_SOURCE_PRESETS = ['exam-focus', 'clinical-deep-dive', 'rapid-revision'] as const;

export type AtomSourceLevel = (typeof ATOM_SOURCE_LEVELS)[number];
export type AtomSourcePreset = (typeof ATOM_SOURCE_PRESETS)[number];

export type AtomSourceCatalogItem = {
  id: string;
  title: string;
  shortTitle: string;
  domain: string;
  levelTags: AtomSourceLevel[];
  priority: number;
  enabled: boolean;
  sortOrder: number;
  metadata?: {
    edition?: string;
    [key: string]: unknown;
  };
};

export const ATOM_SOURCE_CATALOG: AtomSourceCatalogItem[] = [
  { id: 'grays-anatomy-for-students', title: "Gray's Anatomy for Students", shortTitle: "Gray's Anatomy", levelTags: ['UG'], domain: 'Anatomy', priority: 100, enabled: true, sortOrder: 10, metadata: { edition: '5th' } },
  { id: 'ganong-review-of-medical-physiology', title: 'Ganong Review of Medical Physiology', shortTitle: 'Ganong Physiology', levelTags: ['UG'], domain: 'Physiology', priority: 100, enabled: true, sortOrder: 20, metadata: { edition: '27th' } },
  { id: 'lippincott-illustrated-reviews-biochemistry', title: 'Lippincott Illustrated Reviews: Biochemistry', shortTitle: 'Lippincott Biochemistry', levelTags: ['UG'], domain: 'Biochemistry', priority: 100, enabled: true, sortOrder: 30, metadata: { edition: '8th' } },
  { id: 'robbins-cotran-pathologic-basis-of-disease', title: 'Robbins & Cotran Pathologic Basis of Disease', shortTitle: 'Robbins & Cotran', levelTags: ['UG'], domain: 'Pathology', priority: 100, enabled: true, sortOrder: 40, metadata: { edition: '10th' } },
  { id: 'katzung-basic-clinical-pharmacology', title: "Katzung's Basic & Clinical Pharmacology", shortTitle: 'Katzung Pharmacology', levelTags: ['UG'], domain: 'Pharmacology', priority: 100, enabled: true, sortOrder: 50, metadata: { edition: '15th' } },
  { id: 'jawetz-melnick-adelberg-medical-microbiology', title: 'Jawetz, Melnick & Adelberg Medical Microbiology', shortTitle: 'Jawetz Microbiology', levelTags: ['UG'], domain: 'Microbiology', priority: 100, enabled: true, sortOrder: 60, metadata: { edition: '29th' } },
  { id: 'essentials-of-forensic-medicine-and-toxicology', title: 'Essentials of Forensic Medicine & Toxicology', shortTitle: 'Essentials Forensic', levelTags: ['UG'], domain: 'Forensic Medicine', priority: 100, enabled: true, sortOrder: 70 },
  { id: 'parks-textbook-of-preventive-and-social-medicine', title: 'Parks Textbook of Preventive & Social Medicine', shortTitle: 'Parks PSM', levelTags: ['UG'], domain: 'Community Medicine', priority: 100, enabled: true, sortOrder: 80 },

  { id: 'harrisons-principles-of-internal-medicine', title: "Harrison's Principles of Internal Medicine", shortTitle: "Harrison's", levelTags: ['PG'], domain: 'Medicine', priority: 95, enabled: true, sortOrder: 90, metadata: { edition: '21st' } },
  { id: 'bailey-and-loves-short-practice-of-surgery', title: "Bailey & Love's Short Practice of Surgery", shortTitle: 'Bailey & Love', levelTags: ['PG'], domain: 'Surgery', priority: 95, enabled: true, sortOrder: 100, metadata: { edition: '28th' } },
  { id: 'williams-obstetrics', title: 'Williams Obstetrics', shortTitle: 'Williams Obstetrics', levelTags: ['PG'], domain: 'Obstetrics & Gynecology', priority: 95, enabled: true, sortOrder: 110, metadata: { edition: '26th' } },
  { id: 'nelson-textbook-of-pediatrics', title: 'Nelson Textbook of Pediatrics', shortTitle: 'Nelson Pediatrics', levelTags: ['PG'], domain: 'Pediatrics', priority: 95, enabled: true, sortOrder: 120, metadata: { edition: '22nd' } },
  { id: 'miller-anesthesia', title: 'Miller Anesthesia', shortTitle: 'Miller', levelTags: ['PG'], domain: 'Anesthesiology', priority: 95, enabled: true, sortOrder: 130, metadata: { edition: '9th' } },
  { id: 'grainger-and-allison-diagnostic-radiology', title: 'Grainger & Allison Diagnostic Radiology', shortTitle: 'Grainger Radiology', levelTags: ['PG'], domain: 'Radiology', priority: 95, enabled: true, sortOrder: 140, metadata: { edition: '8th' } },
  { id: 'kanskis-clinical-ophthalmology', title: "Kanski's Clinical Ophthalmology", shortTitle: 'Kanski', levelTags: ['PG'], domain: 'Ophthalmology', priority: 95, enabled: true, sortOrder: 150, metadata: { edition: '10th' } },
  { id: 'scott-browns-otorhinolaryngology', title: "Scott-Brown's Otorhinolaryngology", shortTitle: 'Scott-Brown ENT', levelTags: ['PG'], domain: 'ENT', priority: 95, enabled: true, sortOrder: 160, metadata: { edition: '8th' } },

  { id: 'sabiston-textbook-of-surgery', title: 'SABISTON Textbook of Surgery', shortTitle: 'Sabiston', levelTags: ['Resident'], domain: 'Surgery', priority: 85, enabled: true, sortOrder: 170, metadata: { edition: '21st' } },
  { id: 'tintinalli-emergency-medicine', title: 'Tintinalli Emergency Medicine', shortTitle: 'Tintinalli', levelTags: ['Resident'], domain: 'Emergency Medicine', priority: 85, enabled: true, sortOrder: 180, metadata: { edition: '9th' } },
  { id: 'icu-protocols-for-residents', title: 'ICU Protocols for Residents', shortTitle: 'ICU Protocols', levelTags: ['Resident'], domain: 'Critical Care', priority: 85, enabled: true, sortOrder: 190 },
  { id: 'current-medical-diagnosis-and-treatment', title: 'Current Medical Diagnosis & Treatment', shortTitle: 'CMDT', levelTags: ['Resident'], domain: 'Medicine', priority: 85, enabled: true, sortOrder: 200, metadata: { edition: '2026' } },
  { id: 'oxford-handbook-of-clinical-medicine', title: 'Oxford Handbook of Clinical Medicine', shortTitle: 'Oxford Handbook', levelTags: ['Resident'], domain: 'General Clinical Practice', priority: 85, enabled: true, sortOrder: 210, metadata: { edition: '11th' } },

  { id: 'schwartzs-principles-of-surgery', title: "Schwartz's Principles of Surgery", shortTitle: "Schwartz's", levelTags: ['Consultant'], domain: 'Surgery', priority: 75, enabled: true, sortOrder: 220, metadata: { edition: '12th' } },
  { id: 'braunwald-heart-disease', title: 'Braunwald Heart Disease', shortTitle: 'Braunwald', levelTags: ['Consultant'], domain: 'Cardiology', priority: 75, enabled: true, sortOrder: 230, metadata: { edition: '12th' } },
  { id: 'sleisenger-and-fordtran-gastrointestinal-disease', title: 'Sleisenger and Fordtran Gastrointestinal Disease', shortTitle: 'Sleisenger GI', levelTags: ['Consultant'], domain: 'Gastroenterology', priority: 75, enabled: true, sortOrder: 240, metadata: { edition: '12th' } },
  { id: 'devita-cancer-principles-and-practice-of-oncology', title: 'DeVita Cancer: Principles & Practice of Oncology', shortTitle: 'DeVita Oncology', levelTags: ['Consultant'], domain: 'Oncology', priority: 75, enabled: true, sortOrder: 250, metadata: { edition: '12th' } },
  { id: 'campbell-walsh-wein-urology', title: 'Campbell-Walsh-Wein Urology', shortTitle: 'Campbell Urology', levelTags: ['Consultant'], domain: 'Urology', priority: 75, enabled: true, sortOrder: 260, metadata: { edition: '13th' } },
];

export const ATOM_PRESET_LABELS: Record<AtomSourcePreset, string> = {
  'exam-focus': 'Exam Focus',
  'clinical-deep-dive': 'Clinical Deep Dive',
  'rapid-revision': 'Rapid Revision',
};
