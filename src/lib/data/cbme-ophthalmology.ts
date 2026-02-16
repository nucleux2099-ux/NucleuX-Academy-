/**
 * NMC CBME — Ophthalmology Curriculum: Complete UG → PG Mapping
 *
 * UG: 9 modules (OP1–OP9), NMC competency codes
 * PG: MS Ophthalmology syllabus topics
 *
 * Each level maps to library subspecialties and topics.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type OphthalmologyLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface OphthalmologyCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface OphthalmologyUGModule {
  id: string;
  module: string;
  title: string;
  competencies: OphthalmologyCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface OphthalmologyPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface OphthalmologySubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: OphthalmologyLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const OPHTHALMOLOGY_SUBSPECIALTIES: OphthalmologySubspecialtyMap[] = [
  { slug: "anterior-segment", name: "Anterior Segment", icon: "👁️", ugTopicCount: 12, pgTopicCount: 4, levels: ["UG", "PG"] },
  { slug: "glaucoma", name: "Glaucoma", icon: "🟢", ugTopicCount: 4, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "posterior-segment", name: "Posterior Segment", icon: "🔴", ugTopicCount: 5, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "squint-neuro-ophthalmology", name: "Squint & Neuro-Ophthalmology", icon: "🔄", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "community-ophthalmology", name: "Community Ophthalmology", icon: "🏥", ugTopicCount: 4, pgTopicCount: 1, levels: ["UG", "PG"] },
];

// ─── UG Modules (OP1–OP9) ───────────────────────────────────────────────────

export const OPHTHALMOLOGY_UG_MODULES: OphthalmologyUGModule[] = [
  {
    id: "op1", module: "OP1", title: "Optics & Refraction",
    subspecialty: "anterior-segment", topicSlugs: ["refraction", "optics"],
    competencies: [
      { code: "OP1.1", text: "Describe the physiology of vision", domain: "K", isCore: true },
      { code: "OP1.2", text: "Define, classify and describe the types and methods of correcting refractive errors", domain: "KH", isCore: true },
      { code: "OP1.3", text: "Demonstrate the steps in performing the visual acuity assessment", domain: "SH", isCore: true },
      { code: "OP1.4", text: "Enumerate the indications and describe the principles of refractive surgery", domain: "K", isCore: false },
      { code: "OP1.5", text: "Define, classify and describe the aetiology and management of amblyopia", domain: "KH", isCore: true },
    ],
  },
  {
    id: "op2", module: "OP2", title: "Ophthalmic Anatomy & Examination",
    subspecialty: "anterior-segment", topicSlugs: ["anatomy-of-eye", "ophthalmic-examination"],
    competencies: [
      { code: "OP2.1", text: "Enumerate the causes of a red eye and distinguish infective from allergic", domain: "KH", isCore: true },
      { code: "OP2.2", text: "Describe and discuss the aetiology, clinical presentations and diagnostic features of common conditions of the lid and adnexa", domain: "KH", isCore: true },
      { code: "OP2.3", text: "Describe the aetiology, clinical features and management of orbital diseases", domain: "KH", isCore: true },
      { code: "OP2.4", text: "Describe the anatomy of the lacrimal system and classify, discuss the aetiology, clinical features and management of dacryocystitis", domain: "KH", isCore: true },
      { code: "OP2.5", text: "Describe the clinical features and management of proptosis", domain: "KH", isCore: true },
      { code: "OP2.6", text: "Enumerate the differential diagnosis of proptosis", domain: "KH", isCore: true },
      { code: "OP2.7", text: "Classify the types of strabismus and describe the methods of assessment", domain: "KH", isCore: true },
      { code: "OP2.8", text: "List the investigations helpful in diagnosis of optic nerve and visual pathway disorders", domain: "KH", isCore: true },
    ],
  },
  {
    id: "op3", module: "OP3", title: "Cornea & Sclera",
    subspecialty: "anterior-segment", topicSlugs: ["corneal-ulcer", "keratitis", "corneal-dystrophies"],
    competencies: [
      { code: "OP3.1", text: "Elicit, document and present an appropriate history in a patient with a red eye", domain: "SH", isCore: true },
      { code: "OP3.2", text: "Demonstrate the correct technique of instillation of eye drops", domain: "SH", isCore: true },
      { code: "OP3.3", text: "Describe the aetiology, pathophysiology, ocular features, complications and management of trachoma", domain: "KH", isCore: true },
      { code: "OP3.4", text: "Describe the aetiology, pathophysiology, ocular features, complications and management of vernal catarrh", domain: "KH", isCore: true },
      { code: "OP3.5", text: "Describe the aetiology, pathophysiology, ocular features, complications and management of pterygium", domain: "KH", isCore: true },
      { code: "OP3.6", text: "Describe the aetiology, pathophysiology, ocular features, complications and management of symblepharon", domain: "KH", isCore: true },
      { code: "OP3.7", text: "Describe the aetiology, pathophysiology, ocular features, complications and management of corneal ulcer", domain: "KH", isCore: true },
      { code: "OP3.8", text: "Demonstrate the correct technique of a fundus examination and describe and distinguish normal and abnormal findings", domain: "SH", isCore: true },
      { code: "OP3.9", text: "Demonstrate the correct technique of corneal staining and identify a corneal ulcer", domain: "SH", isCore: true },
    ],
  },
  {
    id: "op4", module: "OP4", title: "Lens & Cataract",
    subspecialty: "anterior-segment", topicSlugs: ["cataract", "lens-disorders"],
    competencies: [
      { code: "OP4.1", text: "Enumerate, describe and discuss the types and causes of cataract", domain: "KH", isCore: true },
      { code: "OP4.2", text: "Describe and discuss the aetiology, clinical features, types of glaucoma", domain: "KH", isCore: true },
      { code: "OP4.3", text: "Demonstrate correct technique of measuring intraocular pressure", domain: "SH", isCore: true },
      { code: "OP4.4", text: "Describe and discuss aetiology, clinical features, complications and management of proptosis", domain: "KH", isCore: true },
      { code: "OP4.5", text: "Describe and discuss the clinical features and management of tumors of the eye and adnexa", domain: "KH", isCore: true },
      { code: "OP4.6", text: "Enumerate intraocular tumors in adults and children and describe in brief the clinical features, investigations and management of retinoblastoma", domain: "KH", isCore: true },
      { code: "OP4.7", text: "Enumerate and discuss the causes and management of a blind eye", domain: "KH", isCore: true },
      { code: "OP4.8", text: "Enumerate and discuss the indications for enucleation and evisceration", domain: "KH", isCore: true },
      { code: "OP4.9", text: "Describe the clinical features and management of an aphakic and pseudophakic eye", domain: "KH", isCore: true },
      { code: "OP4.10", text: "Counsel patients and family about eye donation", domain: "SH", isCore: true },
    ],
  },
  {
    id: "op5", module: "OP5", title: "Glaucoma",
    subspecialty: "glaucoma", topicSlugs: ["primary-glaucoma", "secondary-glaucoma"],
    competencies: [
      { code: "OP5.1", text: "Define, classify and describe the aetiology, clinical features, diagnostic investigations and principles of management of glaucoma", domain: "KH", isCore: true },
      { code: "OP5.2", text: "Describe the clinical features, investigations and principles of management of primary open-angle glaucoma", domain: "KH", isCore: true },
    ],
  },
  {
    id: "op6", module: "OP6", title: "Retina & Uvea",
    subspecialty: "posterior-segment", topicSlugs: ["diabetic-retinopathy", "retinal-detachment", "uveitis", "age-related-macular-degeneration"],
    competencies: [
      { code: "OP6.1", text: "Describe clinical features, investigations and principles of management of retinal detachment", domain: "KH", isCore: true },
      { code: "OP6.2", text: "Describe the clinical features and management of diabetic retinopathy and hypertensive retinopathy", domain: "KH", isCore: true },
      { code: "OP6.3", text: "Describe the clinical features, investigations and principles of management of diseases of the uveal tract", domain: "KH", isCore: true },
      { code: "OP6.4", text: "Describe the clinical features, investigations and principles of management of vascular occlusions of the retina", domain: "KH", isCore: true },
      { code: "OP6.5", text: "Describe and discuss the clinical features and management of ARMD", domain: "K", isCore: false },
      { code: "OP6.6", text: "Describe the clinical features, fundus changes, complications and management of hypertensive retinopathy", domain: "KH", isCore: true },
    ],
  },
  {
    id: "op7", module: "OP7", title: "Strabismus & Neuro-Ophthalmology",
    subspecialty: "squint-neuro-ophthalmology", topicSlugs: ["strabismus", "neuro-ophthalmology"],
    competencies: [
      { code: "OP7.1", text: "Describe the aetiology, types, clinical features, investigations and management of strabismus", domain: "KH", isCore: true },
      { code: "OP7.2", text: "Describe the anatomy of the visual pathway and the effects of lesions at various levels", domain: "KH", isCore: true },
      { code: "OP7.3", text: "Describe the aetiology, clinical features and management of papilloedema and optic atrophy", domain: "KH", isCore: true },
    ],
  },
  {
    id: "op8", module: "OP8", title: "Ocular Emergencies & Trauma",
    subspecialty: "anterior-segment", topicSlugs: ["ocular-trauma", "chemical-injuries"],
    competencies: [
      { code: "OP8.1", text: "Enumerate the causes of ocular morbidity and blindness and describe the principles of prevention and management of the important causes", domain: "KH", isCore: true },
      { code: "OP8.2", text: "Describe and discuss the clinical features, investigations and principles of management of ocular injuries", domain: "KH", isCore: true },
      { code: "OP8.3", text: "Demonstrate the correct technique of removal of foreign body from the conjunctival sac and cornea", domain: "SH", isCore: true },
      { code: "OP8.4", text: "Enumerate the causes and describe the clinical features and management of chemical injuries", domain: "KH", isCore: true },
      { code: "OP8.5", text: "Describe the first aid management of ocular emergencies", domain: "SH", isCore: true },
    ],
  },
  {
    id: "op9", module: "OP9", title: "Community Ophthalmology",
    subspecialty: "community-ophthalmology", topicSlugs: ["blindness-prevention", "national-eye-programs"],
    competencies: [
      { code: "OP9.1", text: "Describe the National Programme for Control of Blindness", domain: "KH", isCore: true },
      { code: "OP9.2", text: "Describe the evaluation of eye camps and the various national and international bodies involved in prevention of blindness", domain: "K", isCore: false },
      { code: "OP9.3", text: "Demonstrate the correct technique of eye banking and enumerate the indications for keratoplasty", domain: "KH", isCore: true },
      { code: "OP9.4", text: "Enumerate the causes and describe the clinical features and management of a white pupillary reflex in a child", domain: "KH", isCore: true },
    ],
  },
];

// ─── PG: MS Ophthalmology Syllabus Topics ────────────────────────────────────

export const OPHTHALMOLOGY_PG_TOPICS: OphthalmologyPGTopic[] = [
  { id: "pg-ant-01", title: "Corneal Diseases, Keratoplasty & Refractive Surgery", section: "Clinical Ophthalmology", subspecialty: "anterior-segment", topicSlugs: ["corneal-ulcer", "keratitis", "corneal-dystrophies"], ugModuleRefs: ["OP3"] },
  { id: "pg-ant-02", title: "Cataract Surgery — SICS, Phaco, IOL", section: "Clinical Ophthalmology", subspecialty: "anterior-segment", topicSlugs: ["cataract", "lens-disorders"], ugModuleRefs: ["OP4"] },
  { id: "pg-ant-03", title: "Uveal Tract Diseases & Immunology", section: "Clinical Ophthalmology", subspecialty: "anterior-segment", topicSlugs: ["uveitis"], ugModuleRefs: ["OP6"] },
  { id: "pg-ant-04", title: "Lid, Orbit & Lacrimal Surgery", section: "Clinical Ophthalmology", subspecialty: "anterior-segment", topicSlugs: ["ophthalmic-examination"], ugModuleRefs: ["OP2"] },
  { id: "pg-glauc-01", title: "Glaucoma — Medical & Surgical Management", section: "Clinical Ophthalmology", subspecialty: "glaucoma", topicSlugs: ["primary-glaucoma", "secondary-glaucoma"], ugModuleRefs: ["OP5"] },
  { id: "pg-glauc-02", title: "Glaucoma Investigations — Perimetry, OCT, Gonioscopy", section: "Clinical Ophthalmology", subspecialty: "glaucoma", topicSlugs: ["primary-glaucoma"], ugModuleRefs: ["OP5"] },
  { id: "pg-post-01", title: "Vitreoretinal Diseases & Surgery", section: "Clinical Ophthalmology", subspecialty: "posterior-segment", topicSlugs: ["retinal-detachment", "diabetic-retinopathy"], ugModuleRefs: ["OP6"] },
  { id: "pg-post-02", title: "Medical Retina — DR, AMD, RVO/RAO", section: "Clinical Ophthalmology", subspecialty: "posterior-segment", topicSlugs: ["diabetic-retinopathy", "age-related-macular-degeneration"], ugModuleRefs: ["OP6"] },
  { id: "pg-post-03", title: "Ocular Oncology — Retinoblastoma, Melanoma", section: "Clinical Ophthalmology", subspecialty: "posterior-segment", topicSlugs: ["retinal-detachment"], ugModuleRefs: ["OP4"] },
  { id: "pg-neuro-01", title: "Neuro-Ophthalmology — Optic Nerve, Visual Pathway", section: "Clinical Ophthalmology", subspecialty: "squint-neuro-ophthalmology", topicSlugs: ["neuro-ophthalmology"], ugModuleRefs: ["OP7"] },
  { id: "pg-neuro-02", title: "Strabismus — Diagnosis & Surgical Correction", section: "Clinical Ophthalmology", subspecialty: "squint-neuro-ophthalmology", topicSlugs: ["strabismus"], ugModuleRefs: ["OP7"] },
  { id: "pg-comm-01", title: "Community Ophthalmology & Public Health", section: "Community Ophthalmology", subspecialty: "community-ophthalmology", topicSlugs: ["blindness-prevention", "national-eye-programs"], ugModuleRefs: ["OP9"] },
];

// ─── Helper functions ────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return OPHTHALMOLOGY_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): OphthalmologyUGModule[] {
  return OPHTHALMOLOGY_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): OphthalmologyPGTopic[] {
  return OPHTHALMOLOGY_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
