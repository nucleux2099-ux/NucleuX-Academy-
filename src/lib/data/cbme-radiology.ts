/**
 * NMC CBME — Radiology Curriculum: Complete UG → PG Mapping
 *
 * UG: 3 modules (RD1–RD3), NMC competency codes
 * PG: MD Radiodiagnosis syllabus topics
 */

export type RadiologyLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface RadiologyCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface RadiologyUGModule {
  id: string;
  module: string;
  title: string;
  competencies: RadiologyCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface RadiologyPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface RadiologySubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: RadiologyLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const RADIOLOGY_SUBSPECIALTIES: RadiologySubspecialtyMap[] = [
  { slug: "diagnostic-radiology", name: "Diagnostic Radiology", icon: "🔬", ugTopicCount: 6, pgTopicCount: 4, levels: ["UG", "PG"] },
  { slug: "interventional-radiology", name: "Interventional Radiology", icon: "🎯", ugTopicCount: 2, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "radiation-oncology", name: "Radiation Physics & Safety", icon: "☢️", ugTopicCount: 3, pgTopicCount: 1, levels: ["UG", "PG"] },
];

// ─── UG Modules (RD1–RD3) ───────────────────────────────────────────────────

export const RADIOLOGY_UG_MODULES: RadiologyUGModule[] = [
  {
    id: "rd1", module: "RD1", title: "Radiation Physics & Safety",
    subspecialty: "radiation-oncology", topicSlugs: ["xray-physics", "radiation-protection", "radiation-biology"],
    competencies: [
      { code: "RD1.1", text: "Describe the principles of X-ray production and properties of X-rays", domain: "K", isCore: true },
      { code: "RD1.2", text: "Describe the principles of radiation protection", domain: "KH", isCore: true },
      { code: "RD1.3", text: "Describe the hazards of radiation and radiation safety measures", domain: "KH", isCore: true },
      { code: "RD1.4", text: "Describe the principles of radiation biology", domain: "K", isCore: true },
      { code: "RD1.5", text: "Describe the principles of interaction of radiation with matter", domain: "K", isCore: true },
      { code: "RD1.6", text: "Enumerate and describe the types of radiation detectors and dosimeters", domain: "K", isCore: true },
    ],
  },
  {
    id: "rd2", module: "RD2", title: "Diagnostic Imaging",
    subspecialty: "diagnostic-radiology", topicSlugs: ["plain-radiography", "ct-scan", "mri", "ultrasonography", "contrast-studies"],
    competencies: [
      { code: "RD2.1", text: "Describe the principles and techniques of plain radiography", domain: "KH", isCore: true },
      { code: "RD2.2", text: "Describe the principles and techniques of CT scan", domain: "KH", isCore: true },
      { code: "RD2.3", text: "Describe the principles and techniques of MRI", domain: "K", isCore: true },
      { code: "RD2.4", text: "Describe the principles and techniques of ultrasonography", domain: "KH", isCore: true },
      { code: "RD2.5", text: "Describe the principles of contrast studies — barium studies, IVP, angiography", domain: "KH", isCore: true },
      { code: "RD2.6", text: "Identify normal radiological anatomy on plain X-rays — chest, abdomen, skeletal", domain: "SH", isCore: true },
      { code: "RD2.7", text: "Describe the radiological features of common diseases — pneumonia, TB, fractures, intestinal obstruction", domain: "KH", isCore: true },
      { code: "RD2.8", text: "Describe the radiological features of common GI diseases on barium studies", domain: "KH", isCore: true },
      { code: "RD2.9", text: "Enumerate and describe the imaging modalities for common clinical conditions", domain: "KH", isCore: true },
    ],
  },
  {
    id: "rd3", module: "RD3", title: "Interventional Radiology & Special Procedures",
    subspecialty: "interventional-radiology", topicSlugs: ["interventional-procedures", "image-guided-biopsy"],
    competencies: [
      { code: "RD3.1", text: "Describe the principles and indications of interventional radiology", domain: "K", isCore: true },
      { code: "RD3.2", text: "Describe the principles and indications of image-guided biopsies and drainage procedures", domain: "K", isCore: true },
      { code: "RD3.3", text: "Describe the principles of nuclear medicine and PET-CT", domain: "K", isCore: false },
    ],
  },
];

// ─── PG: MD Radiodiagnosis Syllabus Topics ───────────────────────────────────

export const RADIOLOGY_PG_TOPICS: RadiologyPGTopic[] = [
  { id: "pg-diag-01", title: "Plain Radiography & Fluoroscopy — Systematic Interpretation", section: "Diagnostic Radiology", subspecialty: "diagnostic-radiology", topicSlugs: ["plain-radiography", "contrast-studies"], ugModuleRefs: ["RD2"] },
  { id: "pg-diag-02", title: "CT Scan — Physics, Protocols & Interpretation", section: "Diagnostic Radiology", subspecialty: "diagnostic-radiology", topicSlugs: ["ct-scan"], ugModuleRefs: ["RD2"] },
  { id: "pg-diag-03", title: "MRI — Physics, Sequences & Clinical Applications", section: "Diagnostic Radiology", subspecialty: "diagnostic-radiology", topicSlugs: ["mri"], ugModuleRefs: ["RD2"] },
  { id: "pg-diag-04", title: "Ultrasonography — Obstetric, Abdominal, Doppler", section: "Diagnostic Radiology", subspecialty: "diagnostic-radiology", topicSlugs: ["ultrasonography"], ugModuleRefs: ["RD2"] },
  { id: "pg-ir-01", title: "Vascular Interventions — Angioplasty, Embolization, Stenting", section: "Interventional Radiology", subspecialty: "interventional-radiology", topicSlugs: ["interventional-procedures"], ugModuleRefs: ["RD3"] },
  { id: "pg-ir-02", title: "Non-Vascular Interventions — Biopsy, Drainage, Ablation", section: "Interventional Radiology", subspecialty: "interventional-radiology", topicSlugs: ["image-guided-biopsy"], ugModuleRefs: ["RD3"] },
  { id: "pg-phys-01", title: "Radiation Physics, Dosimetry & Protection", section: "Radiation Physics", subspecialty: "radiation-oncology", topicSlugs: ["xray-physics", "radiation-protection"], ugModuleRefs: ["RD1"] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return RADIOLOGY_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): RadiologyUGModule[] {
  return RADIOLOGY_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): RadiologyPGTopic[] {
  return RADIOLOGY_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
