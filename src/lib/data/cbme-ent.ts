/**
 * NMC CBME — ENT (Otorhinolaryngology) Curriculum: Complete UG → PG Mapping
 *
 * UG: 4 modules (EN1–EN4), NMC competency codes
 * PG: MS ENT syllabus topics
 */

export type ENTLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface ENTCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface ENTUGModule {
  id: string;
  module: string;
  title: string;
  competencies: ENTCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface ENTPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface ENTSubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: ENTLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const ENT_SUBSPECIALTIES: ENTSubspecialtyMap[] = [
  { slug: "ear", name: "Ear (Otology)", icon: "👂", ugTopicCount: 15, pgTopicCount: 4, levels: ["UG", "PG"] },
  { slug: "nose-sinuses", name: "Nose & Sinuses (Rhinology)", icon: "👃", ugTopicCount: 10, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "throat-larynx", name: "Throat & Larynx", icon: "🗣️", ugTopicCount: 14, pgTopicCount: 4, levels: ["UG", "PG"] },
  { slug: "head-neck-ent", name: "Head & Neck", icon: "🎯", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
];

// ─── UG Modules (EN1–EN4) ───────────────────────────────────────────────────

export const ENT_UG_MODULES: ENTUGModule[] = [
  {
    id: "en1", module: "EN1", title: "Ear",
    subspecialty: "ear", topicSlugs: ["anatomy-ear", "deafness", "csom", "otosclerosis", "vertigo", "otitis-media"],
    competencies: [
      { code: "EN1.1", text: "Describe the anatomy and physiology of the ear", domain: "K", isCore: true },
      { code: "EN1.2", text: "Elicit, document and present a correct history, demonstrate and describe the clinical features, choose the correct investigations and describe the principles of management of otalgia", domain: "KH", isCore: true },
      { code: "EN1.3", text: "Elicit, document and present a correct history, demonstrate and describe the clinical features, choose the correct investigations and describe the principles of management of hearing loss", domain: "KH", isCore: true },
      { code: "EN1.4", text: "Enumerate the causes and describe the clinical features, investigations and management of discharging ear", domain: "KH", isCore: true },
      { code: "EN1.5", text: "Elicit, document and present a correct history, demonstrate and describe the clinical features, choose the correct investigations and describe the principles of management of CSOM", domain: "KH", isCore: true },
      { code: "EN1.6", text: "Describe the clinical features, investigations and management of otosclerosis", domain: "KH", isCore: true },
      { code: "EN1.7", text: "Elicit, document and present a correct history, demonstrate and describe the clinical features, choose the correct investigations and describe the principles of management of vertigo", domain: "KH", isCore: true },
      { code: "EN1.8", text: "Elicit, document and present a correct history, demonstrate and describe the clinical features, choose the correct investigations and describe the principles of management of facial nerve palsy", domain: "KH", isCore: true },
      { code: "EN1.9", text: "Describe the clinical features, investigations and management of mastoiditis", domain: "KH", isCore: true },
      { code: "EN1.10", text: "Describe the clinical features, investigations and management of tinnitus", domain: "KH", isCore: true },
      { code: "EN1.11", text: "Describe the clinical features, investigations and management of complications of CSOM", domain: "KH", isCore: true },
      { code: "EN1.12", text: "Describe the clinical features, investigations and management of ASOM", domain: "KH", isCore: true },
      { code: "EN1.13", text: "Identify, resuscitate and manage ENT emergencies — epistaxis, foreign body, stridor", domain: "SH", isCore: true },
      { code: "EN1.14", text: "Describe the clinical features, investigations and management of tumors of ear", domain: "K", isCore: false },
      { code: "EN1.15", text: "Describe the clinical features, investigations and management of noise-induced hearing loss", domain: "KH", isCore: true },
    ],
  },
  {
    id: "en2", module: "EN2", title: "Nose & Paranasal Sinuses",
    subspecialty: "nose-sinuses", topicSlugs: ["anatomy-nose", "sinusitis", "epistaxis", "nasal-polyps", "deviated-septum"],
    competencies: [
      { code: "EN2.1", text: "Describe the anatomy and physiology of the nose and paranasal sinuses", domain: "K", isCore: true },
      { code: "EN2.2", text: "Elicit, document and present a correct history, demonstrate and describe the clinical features, choose the correct investigations and describe the principles of management of nasal obstruction", domain: "KH", isCore: true },
      { code: "EN2.3", text: "Elicit, document and present a correct history, demonstrate and describe the clinical features, choose the correct investigations and describe the principles of management of rhinosinusitis", domain: "KH", isCore: true },
      { code: "EN2.4", text: "Elicit, document and present a correct history, demonstrate and describe the clinical features, choose the correct investigations and describe the principles of management of epistaxis", domain: "KH", isCore: true },
      { code: "EN2.5", text: "Describe the clinical features, investigations and management of nasal polyps", domain: "KH", isCore: true },
      { code: "EN2.6", text: "Describe the clinical features, investigations and management of DNS and septal perforation", domain: "KH", isCore: true },
      { code: "EN2.7", text: "Describe the clinical features, investigations and management of allergic rhinitis", domain: "KH", isCore: true },
      { code: "EN2.8", text: "Describe the clinical features, investigations and management of tumors of nose and paranasal sinuses", domain: "KH", isCore: true },
      { code: "EN2.9", text: "Describe the clinical features, investigations and management of nasal and facial trauma", domain: "KH", isCore: true },
      { code: "EN2.10", text: "Describe the clinical features, investigations and management of foreign body in the nose", domain: "SH", isCore: true },
    ],
  },
  {
    id: "en3", module: "EN3", title: "Throat & Larynx",
    subspecialty: "throat-larynx", topicSlugs: ["tonsillitis", "laryngeal-tumors", "tracheostomy", "stridor", "pharyngitis"],
    competencies: [
      { code: "EN3.1", text: "Describe the anatomy and physiology of the pharynx and larynx", domain: "K", isCore: true },
      { code: "EN3.2", text: "Elicit, document and present a correct history, demonstrate and describe the clinical features, choose the correct investigations and describe the principles of management of tonsillitis", domain: "KH", isCore: true },
      { code: "EN3.3", text: "Elicit, document and present a correct history, demonstrate and describe the clinical features, choose the correct investigations and describe the principles of management of adenoid hypertrophy", domain: "KH", isCore: true },
      { code: "EN3.4", text: "Describe the clinical features, investigations and management of pharyngeal and laryngeal tumors", domain: "KH", isCore: true },
      { code: "EN3.5", text: "Describe the clinical features, investigations and management of stridor", domain: "KH", isCore: true },
      { code: "EN3.6", text: "Describe the principles and steps of tracheostomy and the management of a tracheostomized patient", domain: "SH", isCore: true },
      { code: "EN3.7", text: "Describe the clinical features, investigations and management of hoarseness of voice", domain: "KH", isCore: true },
      { code: "EN3.8", text: "Describe the clinical features, investigations and management of foreign body in the air and food passages", domain: "SH", isCore: true },
      { code: "EN3.9", text: "Describe the clinical features, investigations and management of dysphagia", domain: "KH", isCore: true },
      { code: "EN3.10", text: "Describe the clinical features, investigations and management of acute and chronic laryngitis", domain: "KH", isCore: true },
      { code: "EN3.11", text: "Describe the clinical features, investigations and management of Ludwig's angina", domain: "KH", isCore: true },
      { code: "EN3.12", text: "Describe the clinical features, investigations and management of peritonsillar abscess", domain: "KH", isCore: true },
      { code: "EN3.13", text: "Describe the clinical features, investigations and management of vocal cord paralysis", domain: "KH", isCore: true },
      { code: "EN3.14", text: "Describe the clinical features, investigations and management of sleep apnoea", domain: "KH", isCore: true },
    ],
  },
  {
    id: "en4", module: "EN4", title: "Head & Neck",
    subspecialty: "head-neck-ent", topicSlugs: ["neck-masses", "salivary-gland-diseases", "deep-neck-space-infections"],
    competencies: [
      { code: "EN4.1", text: "Enumerate the causes of neck masses and describe the clinical features, investigations and management", domain: "KH", isCore: true },
      { code: "EN4.2", text: "Describe the clinical features, investigations and management of diseases of the salivary glands", domain: "KH", isCore: true },
      { code: "EN4.3", text: "Describe the clinical features, investigations and management of deep neck space infections", domain: "KH", isCore: true },
    ],
  },
];

// ─── PG: MS ENT Syllabus Topics ─────────────────────────────────────────────

export const ENT_PG_TOPICS: ENTPGTopic[] = [
  { id: "pg-ear-01", title: "Otology — CSOM, Cholesteatoma, Mastoid Surgery", section: "Otology", subspecialty: "ear", topicSlugs: ["csom", "otitis-media"], ugModuleRefs: ["EN1"] },
  { id: "pg-ear-02", title: "Otosclerosis & Stapedectomy", section: "Otology", subspecialty: "ear", topicSlugs: ["otosclerosis"], ugModuleRefs: ["EN1"] },
  { id: "pg-ear-03", title: "Sensorineural Hearing Loss & Cochlear Implant", section: "Otology", subspecialty: "ear", topicSlugs: ["deafness"], ugModuleRefs: ["EN1"] },
  { id: "pg-ear-04", title: "Vestibular Disorders & Meniere's Disease", section: "Otology", subspecialty: "ear", topicSlugs: ["vertigo"], ugModuleRefs: ["EN1"] },
  { id: "pg-nose-01", title: "Functional Endoscopic Sinus Surgery (FESS)", section: "Rhinology", subspecialty: "nose-sinuses", topicSlugs: ["sinusitis", "nasal-polyps"], ugModuleRefs: ["EN2"] },
  { id: "pg-nose-02", title: "Sinonasal Tumors & Anterior Skull Base", section: "Rhinology", subspecialty: "nose-sinuses", topicSlugs: ["nasal-polyps"], ugModuleRefs: ["EN2"] },
  { id: "pg-nose-03", title: "Rhinoplasty & Septoplasty", section: "Rhinology", subspecialty: "nose-sinuses", topicSlugs: ["deviated-septum"], ugModuleRefs: ["EN2"] },
  { id: "pg-throat-01", title: "Laryngeal Malignancies & Laryngectomy", section: "Laryngology", subspecialty: "throat-larynx", topicSlugs: ["laryngeal-tumors"], ugModuleRefs: ["EN3"] },
  { id: "pg-throat-02", title: "Airway Management — Tracheostomy, Microlaryngeal Surgery", section: "Laryngology", subspecialty: "throat-larynx", topicSlugs: ["tracheostomy", "stridor"], ugModuleRefs: ["EN3"] },
  { id: "pg-throat-03", title: "Phonosurgery & Voice Disorders", section: "Laryngology", subspecialty: "throat-larynx", topicSlugs: ["stridor"], ugModuleRefs: ["EN3"] },
  { id: "pg-throat-04", title: "Obstructive Sleep Apnoea — Diagnosis & Surgery", section: "Laryngology", subspecialty: "throat-larynx", topicSlugs: ["tonsillitis"], ugModuleRefs: ["EN3"] },
  { id: "pg-hn-01", title: "Head & Neck Oncology — Comprehensive Management", section: "Head & Neck", subspecialty: "head-neck-ent", topicSlugs: ["neck-masses", "salivary-gland-diseases"], ugModuleRefs: ["EN4"] },
  { id: "pg-hn-02", title: "Salivary Gland Surgery & Neck Dissection", section: "Head & Neck", subspecialty: "head-neck-ent", topicSlugs: ["salivary-gland-diseases", "deep-neck-space-infections"], ugModuleRefs: ["EN4"] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return ENT_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): ENTUGModule[] {
  return ENT_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): ENTPGTopic[] {
  return ENT_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
