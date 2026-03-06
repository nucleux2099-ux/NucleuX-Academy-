/**
 * NMC CBME — Physiology Curriculum: Complete UG → PG Mapping
 *
 * UG: 11 modules (PY1–PY11), ~70+ competency codes
 * PG: MD Physiology
 *
 * Mapped to library content/physiology/ subdirs.
 */

export type PhysiologyLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface PhysiologyCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface PhysiologyUGModule {
  id: string;
  module: string;
  title: string;
  competencies: PhysiologyCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface PhysiologyPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface PhysiologySubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: PhysiologyLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const PHYSIOLOGY_SUBSPECIALTIES: PhysiologySubspecialtyMap[] = [
  { slug: "general-physiology", name: "General Physiology", icon: "🔬", ugTopicCount: 4, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "nerve-muscle", name: "Nerve & Muscle", icon: "⚡", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "blood-immunity", name: "Blood & Immunity", icon: "🩸", ugTopicCount: 6, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "cardiovascular-physiology", name: "CVS Physiology", icon: "❤️", ugTopicCount: 6, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "respiratory-physiology", name: "Respiratory Physiology", icon: "🫁", ugTopicCount: 5, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "renal-physiology", name: "Renal Physiology", icon: "🫘", ugTopicCount: 5, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "gi-physiology", name: "GI Physiology", icon: "🟡", ugTopicCount: 5, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "endocrine-physiology", name: "Endocrine Physiology", icon: "🦋", ugTopicCount: 5, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "cns-physiology", name: "CNS & Special Senses", icon: "🧠", ugTopicCount: 8, pgTopicCount: 4, levels: ["UG", "PG"] },
  { slug: "general-topics", name: "Reproduction & Exercise", icon: "🏃", ugTopicCount: 4, pgTopicCount: 2, levels: ["UG", "PG"] },
];

// ─── UG Modules (PY1–PY11) ─────────────────────────────────────────────────

export const PHYSIOLOGY_UG_MODULES: PhysiologyUGModule[] = [
  // ─── PY1: General Physiology ───
  {
    id: "py1", module: "PY1", title: "General Physiology",
    subspecialty: "general-physiology", topicSlugs: ["cell-physiology", "body-fluids", "transport-mechanisms"],
    competencies: [
      { code: "PY1.1", text: "Describe the structure and function of cell membrane and transport mechanisms", domain: "KH", isCore: true },
      { code: "PY1.2", text: "Describe the composition and functions of body fluids — ICF, ECF", domain: "KH", isCore: true },
      { code: "PY1.3", text: "Describe the homeostasis and feedback mechanisms", domain: "KH", isCore: true },
      { code: "PY1.4", text: "Describe the principles of bioelectricity — resting membrane potential, action potential", domain: "KH", isCore: true },
      { code: "PY1.5", text: "Describe the intercellular communication — gap junctions, second messengers", domain: "KH", isCore: true },
      { code: "PY1.6", text: "Describe the acid-base balance and its regulation", domain: "KH", isCore: true },
    ],
  },
  // ─── PY2: Nerve & Muscle Physiology ───
  {
    id: "py2", module: "PY2", title: "Nerve & Muscle Physiology",
    subspecialty: "nerve-muscle", topicSlugs: ["nerve-physiology", "muscle-physiology", "neuromuscular-junction"],
    competencies: [
      { code: "PY2.1", text: "Describe the properties of nerve fibers — classification, conduction velocity", domain: "KH", isCore: true },
      { code: "PY2.2", text: "Describe the degeneration and regeneration of nerve fibers", domain: "KH", isCore: true },
      { code: "PY2.3", text: "Describe the neuromuscular junction — structure, transmission, disorders", domain: "KH", isCore: true },
      { code: "PY2.4", text: "Describe the mechanism of contraction of skeletal muscle", domain: "KH", isCore: true },
      { code: "PY2.5", text: "Describe the properties and types of skeletal muscle contraction — twitch, tetanus", domain: "KH", isCore: true },
      { code: "PY2.6", text: "Describe the structure and function of smooth muscle", domain: "KH", isCore: true },
      { code: "PY2.7", text: "Describe the structure and function of cardiac muscle", domain: "KH", isCore: true },
    ],
  },
  // ─── PY3: Blood ───
  {
    id: "py3", module: "PY3", title: "Blood",
    subspecialty: "blood-immunity", topicSlugs: ["blood-composition", "rbc", "wbc", "platelets", "coagulation", "blood-groups"],
    competencies: [
      { code: "PY3.1", text: "Describe the composition and functions of blood", domain: "KH", isCore: true },
      { code: "PY3.2", text: "Describe the RBC — formation, destruction, regulation, indices", domain: "KH", isCore: true },
      { code: "PY3.3", text: "Describe the types, functions and life cycle of WBCs", domain: "KH", isCore: true },
      { code: "PY3.4", text: "Describe hemoglobin — structure, types, synthesis, breakdown", domain: "KH", isCore: true },
      { code: "PY3.5", text: "Describe the mechanisms of hemostasis — platelets, coagulation cascade", domain: "KH", isCore: true },
      { code: "PY3.6", text: "Describe the blood groups — ABO, Rh, transfusion reactions", domain: "KH", isCore: true },
      { code: "PY3.7", text: "Describe the physiology of immunity — innate and adaptive", domain: "KH", isCore: true },
      { code: "PY3.8", text: "Describe the ESR, PCV and their clinical significance", domain: "SH", isCore: true },
      { code: "PY3.9", text: "Describe the physiology of anemia — iron deficiency, megaloblastic, hemolytic", domain: "KH", isCore: true },
      { code: "PY3.10", text: "Perform and interpret blood grouping and Rh typing", domain: "SH", isCore: true },
    ],
  },
  // ─── PY4: CVS Physiology ───
  {
    id: "py4", module: "PY4", title: "Cardiovascular Physiology",
    subspecialty: "cardiovascular-physiology", topicSlugs: ["cardiac-cycle", "ecg", "cardiac-output", "blood-pressure", "regional-circulation"],
    competencies: [
      { code: "PY4.1", text: "Describe the functional anatomy of heart and its conducting system", domain: "KH", isCore: true },
      { code: "PY4.2", text: "Describe the properties of cardiac muscle — automaticity, rhythmicity, conductivity, contractility", domain: "KH", isCore: true },
      { code: "PY4.3", text: "Describe the cardiac cycle — pressure, volume, flow changes", domain: "KH", isCore: true },
      { code: "PY4.4", text: "Describe the generation and interpretation of ECG — normal and abnormal", domain: "SH", isCore: true },
      { code: "PY4.5", text: "Describe the cardiac output — determinants, regulation, measurement", domain: "KH", isCore: true },
      { code: "PY4.6", text: "Describe the regulation of blood pressure — neural, hormonal, local", domain: "KH", isCore: true },
      { code: "PY4.7", text: "Describe the physiology of shock — types and compensatory mechanisms", domain: "KH", isCore: true },
      { code: "PY4.8", text: "Describe the regional circulations — coronary, cerebral, splanchnic, cutaneous", domain: "KH", isCore: true },
      { code: "PY4.9", text: "Describe the hemodynamics — Poiseuille's law, resistance, compliance", domain: "KH", isCore: true },
      { code: "PY4.10", text: "Record and interpret the normal ECG", domain: "SH", isCore: true },
    ],
  },
  // ─── PY5: Respiratory Physiology ───
  {
    id: "py5", module: "PY5", title: "Respiratory Physiology",
    subspecialty: "respiratory-physiology", topicSlugs: ["lung-mechanics", "gas-exchange", "oxygen-transport", "regulation-breathing"],
    competencies: [
      { code: "PY5.1", text: "Describe the mechanics of respiration — muscles, pressures, compliance, surfactant", domain: "KH", isCore: true },
      { code: "PY5.2", text: "Describe the lung volumes and capacities — spirometry", domain: "KH", isCore: true },
      { code: "PY5.3", text: "Describe the gas exchange — diffusion, ventilation-perfusion ratio", domain: "KH", isCore: true },
      { code: "PY5.4", text: "Describe the transport of oxygen and carbon dioxide in blood", domain: "KH", isCore: true },
      { code: "PY5.5", text: "Describe the regulation of respiration — neural and chemical", domain: "KH", isCore: true },
      { code: "PY5.6", text: "Describe the physiology of hypoxia — types, effects, acclimatization", domain: "KH", isCore: true },
      { code: "PY5.7", text: "Describe the physiology of artificial respiration and oxygen therapy", domain: "KH", isCore: true },
      { code: "PY5.8", text: "Perform and interpret spirometry", domain: "SH", isCore: true },
    ],
  },
  // ─── PY6: Renal Physiology ───
  {
    id: "py6", module: "PY6", title: "Renal Physiology",
    subspecialty: "renal-physiology", topicSlugs: ["glomerular-filtration", "tubular-function", "urine-concentration", "acid-base-renal"],
    competencies: [
      { code: "PY6.1", text: "Describe the functional anatomy of kidney and nephron", domain: "KH", isCore: true },
      { code: "PY6.2", text: "Describe the glomerular filtration — GFR, filtration fraction, regulation", domain: "KH", isCore: true },
      { code: "PY6.3", text: "Describe the tubular reabsorption and secretion", domain: "KH", isCore: true },
      { code: "PY6.4", text: "Describe the mechanism of urine concentration and dilution — countercurrent mechanism", domain: "KH", isCore: true },
      { code: "PY6.5", text: "Describe the regulation of water and electrolyte balance — ADH, aldosterone", domain: "KH", isCore: true },
      { code: "PY6.6", text: "Describe the role of kidney in acid-base balance", domain: "KH", isCore: true },
      { code: "PY6.7", text: "Describe the renal function tests — clearance, GFR estimation", domain: "KH", isCore: true },
      { code: "PY6.8", text: "Describe the physiology of micturition", domain: "KH", isCore: true },
    ],
  },
  // ─── PY7: GI Physiology ───
  {
    id: "py7", module: "PY7", title: "GI Physiology",
    subspecialty: "gi-physiology", topicSlugs: ["gi-motility", "gi-secretion", "digestion-absorption", "liver-physiology"],
    competencies: [
      { code: "PY7.1", text: "Describe the GI motility — mastication, deglutition, gastric, intestinal motility", domain: "KH", isCore: true },
      { code: "PY7.2", text: "Describe the salivary secretion — composition, regulation, functions", domain: "KH", isCore: true },
      { code: "PY7.3", text: "Describe the gastric secretion — composition, phases, regulation", domain: "KH", isCore: true },
      { code: "PY7.4", text: "Describe the pancreatic and biliary secretion", domain: "KH", isCore: true },
      { code: "PY7.5", text: "Describe the intestinal secretion and digestion of carbohydrates, proteins, fats", domain: "KH", isCore: true },
      { code: "PY7.6", text: "Describe the absorption of nutrients, water and electrolytes", domain: "KH", isCore: true },
      { code: "PY7.7", text: "Describe the functions of liver — bile, metabolism, detoxification", domain: "KH", isCore: true },
      { code: "PY7.8", text: "Describe the GI hormones and their functions", domain: "KH", isCore: true },
      { code: "PY7.9", text: "Describe the physiology of defecation and vomiting", domain: "KH", isCore: true },
    ],
  },
  // ─── PY8: Endocrine Physiology ───
  {
    id: "py8", module: "PY8", title: "Endocrine Physiology",
    subspecialty: "endocrine-physiology", topicSlugs: ["pituitary", "thyroid-physiology", "adrenal-physiology", "pancreas-endocrine"],
    competencies: [
      { code: "PY8.1", text: "Describe the general principles of endocrinology — hormone types, mechanisms, regulation", domain: "KH", isCore: true },
      { code: "PY8.2", text: "Describe the hypothalamo-pituitary axis and functions of anterior and posterior pituitary hormones", domain: "KH", isCore: true },
      { code: "PY8.3", text: "Describe the thyroid hormones — synthesis, secretion, regulation, functions", domain: "KH", isCore: true },
      { code: "PY8.4", text: "Describe the parathyroid hormone, calcitonin and vitamin D — calcium metabolism", domain: "KH", isCore: true },
      { code: "PY8.5", text: "Describe the adrenal cortical hormones — glucocorticoids, mineralocorticoids, sex hormones", domain: "KH", isCore: true },
      { code: "PY8.6", text: "Describe the adrenal medullary hormones — catecholamines", domain: "KH", isCore: true },
      { code: "PY8.7", text: "Describe the endocrine pancreas — insulin, glucagon — regulation of blood glucose", domain: "KH", isCore: true },
      { code: "PY8.8", text: "Describe the physiology of growth — growth hormone, factors affecting growth", domain: "KH", isCore: true },
    ],
  },
  // ─── PY9: Neurophysiology ───
  {
    id: "py9", module: "PY9", title: "Neurophysiology",
    subspecialty: "cns-physiology", topicSlugs: ["sensory-physiology", "motor-physiology", "autonomic-ns", "higher-functions"],
    competencies: [
      { code: "PY9.1", text: "Describe the organization of nervous system — central, peripheral, autonomic", domain: "KH", isCore: true },
      { code: "PY9.2", text: "Describe the somatic sensations — receptors, pathways, cortical processing", domain: "KH", isCore: true },
      { code: "PY9.3", text: "Describe the physiology of pain — types, pathways, gate control theory", domain: "KH", isCore: true },
      { code: "PY9.4", text: "Describe the motor system — UMN, LMN, pyramidal, extrapyramidal, cerebellar", domain: "KH", isCore: true },
      { code: "PY9.5", text: "Describe the physiology of reflexes — spinal, stretch, withdrawal, postural", domain: "KH", isCore: true },
      { code: "PY9.6", text: "Describe the basal ganglia — functions, disorders", domain: "KH", isCore: true },
      { code: "PY9.7", text: "Describe the cerebellum — functions, signs of cerebellar lesions", domain: "KH", isCore: true },
      { code: "PY9.8", text: "Describe the autonomic nervous system — sympathetic, parasympathetic", domain: "KH", isCore: true },
      { code: "PY9.9", text: "Describe the higher functions — learning, memory, speech, EEG, sleep-wake cycle", domain: "KH", isCore: true },
      { code: "PY9.10", text: "Describe the CSF — formation, circulation, functions", domain: "KH", isCore: true },
      { code: "PY9.11", text: "Describe the limbic system and its functions — emotion, behavior", domain: "KH", isCore: true },
    ],
  },
  // ─── PY10: Special Senses ───
  {
    id: "py10", module: "PY10", title: "Special Senses",
    subspecialty: "cns-physiology", topicSlugs: ["vision", "hearing", "taste-smell", "vestibular"],
    competencies: [
      { code: "PY10.1", text: "Describe the physiology of vision — optics, photoreception, visual pathway, color vision", domain: "KH", isCore: true },
      { code: "PY10.2", text: "Describe the physiology of hearing — sound transmission, cochlear mechanics, auditory pathway", domain: "KH", isCore: true },
      { code: "PY10.3", text: "Describe the physiology of taste and smell — receptors, pathways", domain: "KH", isCore: true },
      { code: "PY10.4", text: "Describe the vestibular system — receptors, reflexes, motion sickness", domain: "KH", isCore: true },
      { code: "PY10.5", text: "Describe the errors of refraction and their correction", domain: "KH", isCore: true },
      { code: "PY10.6", text: "Perform visual acuity testing and color vision testing", domain: "SH", isCore: true },
    ],
  },
  // ─── PY11: Reproduction & Exercise ───
  {
    id: "py11", module: "PY11", title: "Reproductive Physiology & Exercise",
    subspecialty: "general-topics", topicSlugs: ["male-reproductive-physiology", "female-reproductive-physiology", "exercise-physiology"],
    competencies: [
      { code: "PY11.1", text: "Describe the male reproductive physiology — spermatogenesis, hormonal regulation", domain: "KH", isCore: true },
      { code: "PY11.2", text: "Describe the female reproductive physiology — menstrual cycle, ovulation, hormonal regulation", domain: "KH", isCore: true },
      { code: "PY11.3", text: "Describe the physiology of pregnancy — fertilization, implantation, placental functions", domain: "KH", isCore: true },
      { code: "PY11.4", text: "Describe the physiology of lactation", domain: "KH", isCore: true },
      { code: "PY11.5", text: "Describe the physiology of contraception", domain: "KH", isCore: true },
      { code: "PY11.6", text: "Describe the physiology of exercise — cardiorespiratory adaptations, training effects", domain: "KH", isCore: true },
      { code: "PY11.7", text: "Describe the physiology of aging", domain: "K", isCore: true },
      { code: "PY11.8", text: "Describe the physiology of temperature regulation", domain: "KH", isCore: true },
    ],
  },
];

// ─── PG: MD Physiology Topics ───────────────────────────────────────────────

export const PHYSIOLOGY_PG_TOPICS: PhysiologyPGTopic[] = [
  { id: "pg-gen-01", title: "Cell Physiology, Membrane Transport & Bioelectricity — Advanced", section: "General", subspecialty: "general-physiology", topicSlugs: ["cell-physiology", "transport-mechanisms"], ugModuleRefs: ["PY1"] },
  { id: "pg-gen-02", title: "Body Fluids, Acid-Base Balance & Homeostasis", section: "General", subspecialty: "general-physiology", topicSlugs: ["body-fluids"], ugModuleRefs: ["PY1"] },
  { id: "pg-nm-01", title: "Nerve Physiology — Conduction, Degeneration & Regeneration", section: "Systemic", subspecialty: "nerve-muscle", topicSlugs: ["nerve-physiology"], ugModuleRefs: ["PY2"] },
  { id: "pg-nm-02", title: "Muscle Physiology — Skeletal, Smooth, Cardiac — Advanced", section: "Systemic", subspecialty: "nerve-muscle", topicSlugs: ["muscle-physiology", "neuromuscular-junction"], ugModuleRefs: ["PY2"] },
  { id: "pg-blood-01", title: "Hematology — RBC, WBC, Hemoglobin, Indices", section: "Systemic", subspecialty: "blood-immunity", topicSlugs: ["blood-composition", "rbc", "wbc"], ugModuleRefs: ["PY3"] },
  { id: "pg-blood-02", title: "Hemostasis, Coagulation & Blood Groups — Advanced", section: "Systemic", subspecialty: "blood-immunity", topicSlugs: ["platelets", "coagulation", "blood-groups"], ugModuleRefs: ["PY3"] },
  { id: "pg-blood-03", title: "Immunology — Innate, Adaptive & Clinical", section: "Systemic", subspecialty: "blood-immunity", topicSlugs: ["blood-composition"], ugModuleRefs: ["PY3"] },
  { id: "pg-cvs-01", title: "Cardiac Physiology — Cardiac Cycle, ECG, Hemodynamics", section: "Systemic", subspecialty: "cardiovascular-physiology", topicSlugs: ["cardiac-cycle", "ecg"], ugModuleRefs: ["PY4"] },
  { id: "pg-cvs-02", title: "Cardiac Output, Blood Pressure & Shock — Advanced", section: "Systemic", subspecialty: "cardiovascular-physiology", topicSlugs: ["cardiac-output", "blood-pressure"], ugModuleRefs: ["PY4"] },
  { id: "pg-cvs-03", title: "Regional Circulations & Cardiovascular Regulation", section: "Systemic", subspecialty: "cardiovascular-physiology", topicSlugs: ["regional-circulation"], ugModuleRefs: ["PY4"] },
  { id: "pg-resp-01", title: "Lung Mechanics, Volumes & Spirometry — Advanced", section: "Systemic", subspecialty: "respiratory-physiology", topicSlugs: ["lung-mechanics"], ugModuleRefs: ["PY5"] },
  { id: "pg-resp-02", title: "Gas Exchange, O2/CO2 Transport & V/Q Matching", section: "Systemic", subspecialty: "respiratory-physiology", topicSlugs: ["gas-exchange", "oxygen-transport"], ugModuleRefs: ["PY5"] },
  { id: "pg-resp-03", title: "Regulation of Respiration & Applied Physiology", section: "Systemic", subspecialty: "respiratory-physiology", topicSlugs: ["regulation-breathing"], ugModuleRefs: ["PY5"] },
  { id: "pg-renal-01", title: "GFR, Tubular Function & Clearance — Advanced", section: "Systemic", subspecialty: "renal-physiology", topicSlugs: ["glomerular-filtration", "tubular-function"], ugModuleRefs: ["PY6"] },
  { id: "pg-renal-02", title: "Countercurrent Mechanism & Urine Concentration", section: "Systemic", subspecialty: "renal-physiology", topicSlugs: ["urine-concentration"], ugModuleRefs: ["PY6"] },
  { id: "pg-renal-03", title: "Renal Acid-Base, Electrolytes & Micturition", section: "Systemic", subspecialty: "renal-physiology", topicSlugs: ["acid-base-renal"], ugModuleRefs: ["PY6"] },
  { id: "pg-gi-01", title: "GI Motility & Secretion — Advanced", section: "Systemic", subspecialty: "gi-physiology", topicSlugs: ["gi-motility", "gi-secretion"], ugModuleRefs: ["PY7"] },
  { id: "pg-gi-02", title: "Digestion, Absorption & GI Hormones", section: "Systemic", subspecialty: "gi-physiology", topicSlugs: ["digestion-absorption"], ugModuleRefs: ["PY7"] },
  { id: "pg-gi-03", title: "Liver Physiology & Applied GI Physiology", section: "Systemic", subspecialty: "gi-physiology", topicSlugs: ["liver-physiology"], ugModuleRefs: ["PY7"] },
  { id: "pg-endo-01", title: "Hypothalamo-Pituitary-Thyroid-Adrenal Axis — Advanced", section: "Systemic", subspecialty: "endocrine-physiology", topicSlugs: ["pituitary", "thyroid-physiology", "adrenal-physiology"], ugModuleRefs: ["PY8"] },
  { id: "pg-endo-02", title: "Endocrine Pancreas, Growth & Calcium Metabolism", section: "Systemic", subspecialty: "endocrine-physiology", topicSlugs: ["pancreas-endocrine"], ugModuleRefs: ["PY8"] },
  { id: "pg-endo-03", title: "Reproductive Endocrinology & Puberty", section: "Systemic", subspecialty: "endocrine-physiology", topicSlugs: ["pituitary"], ugModuleRefs: ["PY8", "PY11"] },
  { id: "pg-cns-01", title: "Sensory Physiology & Pain — Advanced", section: "Systemic", subspecialty: "cns-physiology", topicSlugs: ["sensory-physiology"], ugModuleRefs: ["PY9"] },
  { id: "pg-cns-02", title: "Motor System — Pyramidal, Extrapyramidal, Cerebellar", section: "Systemic", subspecialty: "cns-physiology", topicSlugs: ["motor-physiology"], ugModuleRefs: ["PY9"] },
  { id: "pg-cns-03", title: "Higher Functions — EEG, Sleep, Memory, Speech", section: "Systemic", subspecialty: "cns-physiology", topicSlugs: ["higher-functions"], ugModuleRefs: ["PY9"] },
  { id: "pg-cns-04", title: "Special Senses — Vision, Hearing, Vestibular — Advanced", section: "Systemic", subspecialty: "cns-physiology", topicSlugs: ["vision", "hearing", "vestibular"], ugModuleRefs: ["PY10"] },
  { id: "pg-misc-01", title: "Reproductive Physiology & Exercise Physiology", section: "Applied", subspecialty: "general-topics", topicSlugs: ["male-reproductive-physiology", "female-reproductive-physiology", "exercise-physiology"], ugModuleRefs: ["PY11"] },
  { id: "pg-misc-02", title: "Research Methodology & Biostatistics in Physiology", section: "Applied", subspecialty: "general-topics", topicSlugs: [], ugModuleRefs: [] },
];

// ─── Helper functions ────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return PHYSIOLOGY_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): PhysiologyUGModule[] {
  return PHYSIOLOGY_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): PhysiologyPGTopic[] {
  return PHYSIOLOGY_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
