/**
 * NMC CBME — Biochemistry Curriculum: Complete UG → PG Mapping
 *
 * UG: 11 modules (BI1–BI11), NMC competency codes
 * PG: MD Biochemistry syllabus topics
 */

export type BiochemistryLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface BiochemistryCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface BiochemistryUGModule {
  id: string;
  module: string;
  title: string;
  competencies: BiochemistryCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface BiochemistryPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface BiochemistrySubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: BiochemistryLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const BIOCHEMISTRY_SUBSPECIALTIES: BiochemistrySubspecialtyMap[] = [
  { slug: "biomolecules", name: "Biomolecules", icon: "🧬", ugTopicCount: 6, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "enzymes", name: "Enzymes", icon: "⚗️", ugTopicCount: 4, pgTopicCount: 1, levels: ["UG", "PG"] },
  { slug: "carbohydrate-metabolism", name: "Carbohydrate Metabolism", icon: "🍬", ugTopicCount: 5, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "lipid-metabolism", name: "Lipid Metabolism", icon: "🧈", ugTopicCount: 4, pgTopicCount: 1, levels: ["UG", "PG"] },
  { slug: "protein-amino-acid-metabolism", name: "Protein & Amino Acid Metabolism", icon: "🥩", ugTopicCount: 5, pgTopicCount: 1, levels: ["UG", "PG"] },
  { slug: "molecular-biology", name: "Molecular Biology", icon: "🔬", ugTopicCount: 5, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "vitamins-minerals", name: "Vitamins & Minerals", icon: "💊", ugTopicCount: 4, pgTopicCount: 1, levels: ["UG", "PG"] },
  { slug: "clinical-biochemistry", name: "Clinical Biochemistry", icon: "🏥", ugTopicCount: 5, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "general-topics", name: "General Topics", icon: "📋", ugTopicCount: 3, pgTopicCount: 1, levels: ["UG", "PG"] },
];

// ─── UG Modules (BI1–BI11) ──────────────────────────────────────────────────

export const BIOCHEMISTRY_UG_MODULES: BiochemistryUGModule[] = [
  {
    id: "bi1", module: "BI1", title: "Amino Acids & Proteins",
    subspecialty: "biomolecules", topicSlugs: ["amino-acids", "protein-structure"],
    competencies: [
      { code: "BI1.1", text: "Describe and discuss the classification, structure and properties of amino acids", domain: "K", isCore: true },
      { code: "BI1.2", text: "Describe and discuss the levels of organization of protein structure", domain: "K", isCore: true },
      { code: "BI1.3", text: "Describe and discuss the structure-function relationship of proteins", domain: "KH", isCore: true },
    ],
  },
  {
    id: "bi2", module: "BI2", title: "Enzymes",
    subspecialty: "enzymes", topicSlugs: ["enzyme-kinetics", "enzyme-regulation", "clinical-enzymology"],
    competencies: [
      { code: "BI2.1", text: "Describe and discuss the classification, properties and mechanism of action of enzymes", domain: "KH", isCore: true },
      { code: "BI2.2", text: "Describe and discuss enzyme kinetics — Michaelis-Menten, Lineweaver-Burk", domain: "KH", isCore: true },
      { code: "BI2.3", text: "Describe and discuss enzyme inhibition and regulation", domain: "KH", isCore: true },
      { code: "BI2.4", text: "Describe the clinical significance of enzymes — diagnostic enzymology", domain: "KH", isCore: true },
    ],
  },
  {
    id: "bi3", module: "BI3", title: "Carbohydrate Metabolism",
    subspecialty: "carbohydrate-metabolism", topicSlugs: ["glycolysis", "tca-cycle", "gluconeogenesis", "glycogen-metabolism"],
    competencies: [
      { code: "BI3.1", text: "Describe and discuss the chemistry and metabolism of carbohydrates", domain: "KH", isCore: true },
      { code: "BI3.2", text: "Describe glycolysis — reactions, energetics, regulation", domain: "KH", isCore: true },
      { code: "BI3.3", text: "Describe the TCA cycle — reactions, energetics, regulation", domain: "KH", isCore: true },
      { code: "BI3.4", text: "Describe gluconeogenesis, glycogenesis and glycogenolysis", domain: "KH", isCore: true },
      { code: "BI3.5", text: "Describe the HMP shunt and its significance", domain: "KH", isCore: true },
      { code: "BI3.6", text: "Describe the regulation of blood glucose and diabetes mellitus", domain: "KH", isCore: true },
    ],
  },
  {
    id: "bi4", module: "BI4", title: "Lipid Metabolism",
    subspecialty: "lipid-metabolism", topicSlugs: ["fatty-acid-oxidation", "lipid-transport", "cholesterol-metabolism"],
    competencies: [
      { code: "BI4.1", text: "Describe and discuss the chemistry and metabolism of lipids", domain: "KH", isCore: true },
      { code: "BI4.2", text: "Describe beta-oxidation of fatty acids and ketogenesis", domain: "KH", isCore: true },
      { code: "BI4.3", text: "Describe cholesterol metabolism and its regulation", domain: "KH", isCore: true },
      { code: "BI4.4", text: "Describe lipoproteins and lipid transport", domain: "KH", isCore: true },
      { code: "BI4.5", text: "Describe the biochemical basis of atherosclerosis and dyslipidemias", domain: "KH", isCore: true },
    ],
  },
  {
    id: "bi5", module: "BI5", title: "Protein & Amino Acid Metabolism",
    subspecialty: "protein-amino-acid-metabolism", topicSlugs: ["amino-acid-catabolism", "urea-cycle", "one-carbon-metabolism"],
    competencies: [
      { code: "BI5.1", text: "Describe and discuss protein digestion, absorption and amino acid metabolism", domain: "KH", isCore: true },
      { code: "BI5.2", text: "Describe transamination, deamination and the urea cycle", domain: "KH", isCore: true },
      { code: "BI5.3", text: "Describe the metabolism of specific amino acids and inborn errors", domain: "KH", isCore: true },
      { code: "BI5.4", text: "Describe one-carbon metabolism and its significance", domain: "KH", isCore: true },
    ],
  },
  {
    id: "bi6", module: "BI6", title: "Nucleic Acids & Molecular Biology",
    subspecialty: "molecular-biology", topicSlugs: ["dna-structure", "replication", "transcription", "translation"],
    competencies: [
      { code: "BI6.1", text: "Describe the structure and function of DNA and RNA", domain: "KH", isCore: true },
      { code: "BI6.2", text: "Describe the process of DNA replication", domain: "KH", isCore: true },
      { code: "BI6.3", text: "Describe transcription and its regulation", domain: "KH", isCore: true },
      { code: "BI6.4", text: "Describe translation — genetic code, ribosomes, protein synthesis", domain: "KH", isCore: true },
      { code: "BI6.5", text: "Describe mutations and DNA repair mechanisms", domain: "KH", isCore: true },
      { code: "BI6.6", text: "Describe the principles of recombinant DNA technology and PCR", domain: "K", isCore: true },
    ],
  },
  {
    id: "bi7", module: "BI7", title: "Vitamins",
    subspecialty: "vitamins-minerals", topicSlugs: ["water-soluble-vitamins", "fat-soluble-vitamins"],
    competencies: [
      { code: "BI7.1", text: "Describe the chemistry, sources, daily requirement, biochemical role and deficiency of water-soluble vitamins", domain: "KH", isCore: true },
      { code: "BI7.2", text: "Describe the chemistry, sources, daily requirement, biochemical role and deficiency of fat-soluble vitamins", domain: "KH", isCore: true },
    ],
  },
  {
    id: "bi8", module: "BI8", title: "Minerals & Trace Elements",
    subspecialty: "vitamins-minerals", topicSlugs: ["minerals-calcium-iron", "trace-elements"],
    competencies: [
      { code: "BI8.1", text: "Describe the metabolism and functions of calcium, phosphorus and iron", domain: "KH", isCore: true },
      { code: "BI8.2", text: "Describe the metabolism and functions of trace elements — zinc, copper, selenium, iodine", domain: "K", isCore: true },
    ],
  },
  {
    id: "bi9", module: "BI9", title: "Organ Function Tests & Clinical Biochemistry",
    subspecialty: "clinical-biochemistry", topicSlugs: ["liver-function-tests", "kidney-function-tests", "thyroid-function-tests"],
    competencies: [
      { code: "BI9.1", text: "Describe and interpret liver function tests", domain: "KH", isCore: true },
      { code: "BI9.2", text: "Describe and interpret kidney function tests", domain: "KH", isCore: true },
      { code: "BI9.3", text: "Describe and interpret thyroid function tests", domain: "KH", isCore: true },
      { code: "BI9.4", text: "Describe the biochemical basis and interpretation of cardiac markers", domain: "KH", isCore: true },
    ],
  },
  {
    id: "bi10", module: "BI10", title: "Acid-Base Balance & Electrolytes",
    subspecialty: "clinical-biochemistry", topicSlugs: ["acid-base-balance", "electrolyte-balance"],
    competencies: [
      { code: "BI10.1", text: "Describe the principles of acid-base balance and buffer systems", domain: "KH", isCore: true },
      { code: "BI10.2", text: "Describe and interpret ABG analysis", domain: "SH", isCore: true },
      { code: "BI10.3", text: "Describe the regulation of sodium, potassium and water balance", domain: "KH", isCore: true },
    ],
  },
  {
    id: "bi11", module: "BI11", title: "Integration & Applied Biochemistry",
    subspecialty: "general-topics", topicSlugs: ["metabolic-integration", "nutrition-biochemistry"],
    competencies: [
      { code: "BI11.1", text: "Describe the integration of metabolism in fed, fasted and starvation states", domain: "KH", isCore: true },
      { code: "BI11.2", text: "Describe the biochemistry of cancer", domain: "K", isCore: true },
      { code: "BI11.3", text: "Describe the biochemical aspects of environmental pollution and xenobiotic metabolism", domain: "K", isCore: false },
      { code: "BI11.4", text: "Describe the principles of nutrition biochemistry", domain: "K", isCore: true },
    ],
  },
];

// ─── PG: MD Biochemistry Syllabus Topics ─────────────────────────────────────

export const BIOCHEMISTRY_PG_TOPICS: BiochemistryPGTopic[] = [
  { id: "pg-bio-01", title: "Protein Structure, Proteomics & Structural Biology", section: "Biomolecules", subspecialty: "biomolecules", topicSlugs: ["amino-acids", "protein-structure"], ugModuleRefs: ["BI1"] },
  { id: "pg-bio-02", title: "Advanced Enzymology — Mechanisms, Isoenzymes, Ribozymes", section: "Biomolecules", subspecialty: "enzymes", topicSlugs: ["enzyme-kinetics", "enzyme-regulation", "clinical-enzymology"], ugModuleRefs: ["BI2"] },
  { id: "pg-carb-01", title: "Carbohydrate Metabolism — Diabetes, Glycogen Storage Diseases", section: "Metabolism", subspecialty: "carbohydrate-metabolism", topicSlugs: ["glycolysis", "tca-cycle", "gluconeogenesis"], ugModuleRefs: ["BI3"] },
  { id: "pg-carb-02", title: "Bioenergetics & Electron Transport Chain", section: "Metabolism", subspecialty: "carbohydrate-metabolism", topicSlugs: ["tca-cycle"], ugModuleRefs: ["BI3"] },
  { id: "pg-lip-01", title: "Lipid Metabolism — Dyslipidemias, Lipid Storage Diseases", section: "Metabolism", subspecialty: "lipid-metabolism", topicSlugs: ["fatty-acid-oxidation", "cholesterol-metabolism"], ugModuleRefs: ["BI4"] },
  { id: "pg-prot-01", title: "Amino Acid Metabolism & Inborn Errors", section: "Metabolism", subspecialty: "protein-amino-acid-metabolism", topicSlugs: ["amino-acid-catabolism", "urea-cycle"], ugModuleRefs: ["BI5"] },
  { id: "pg-mol-01", title: "Molecular Biology — Gene Expression, Regulation, Epigenetics", section: "Molecular Biology", subspecialty: "molecular-biology", topicSlugs: ["dna-structure", "transcription", "translation"], ugModuleRefs: ["BI6"] },
  { id: "pg-mol-02", title: "Recombinant DNA, Genomics, Gene Therapy", section: "Molecular Biology", subspecialty: "molecular-biology", topicSlugs: ["replication"], ugModuleRefs: ["BI6"] },
  { id: "pg-vit-01", title: "Vitamins, Minerals & Nutrition Biochemistry", section: "Nutrition", subspecialty: "vitamins-minerals", topicSlugs: ["water-soluble-vitamins", "fat-soluble-vitamins", "minerals-calcium-iron"], ugModuleRefs: ["BI7", "BI8"] },
  { id: "pg-clin-01", title: "Clinical Biochemistry — Organ Function Tests, Tumor Markers", section: "Clinical Biochemistry", subspecialty: "clinical-biochemistry", topicSlugs: ["liver-function-tests", "kidney-function-tests", "thyroid-function-tests"], ugModuleRefs: ["BI9"] },
  { id: "pg-clin-02", title: "Acid-Base & Electrolyte Disorders", section: "Clinical Biochemistry", subspecialty: "clinical-biochemistry", topicSlugs: ["acid-base-balance", "electrolyte-balance"], ugModuleRefs: ["BI10"] },
  { id: "pg-gen-01", title: "Metabolic Integration & Cancer Biochemistry", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["metabolic-integration", "nutrition-biochemistry"], ugModuleRefs: ["BI11"] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return BIOCHEMISTRY_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): BiochemistryUGModule[] {
  return BIOCHEMISTRY_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): BiochemistryPGTopic[] {
  return BIOCHEMISTRY_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
