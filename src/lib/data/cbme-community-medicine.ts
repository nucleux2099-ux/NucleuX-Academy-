/**
 * NMC CBME — Community Medicine (PSM) Curriculum: Complete UG → PG Mapping
 *
 * UG: 19 modules (CM1–CM19), NMC competency codes
 * PG: MD Community Medicine syllabus topics
 */

export type CommunityMedicineLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface CommunityMedicineCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface CommunityMedicineUGModule {
  id: string;
  module: string;
  title: string;
  competencies: CommunityMedicineCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface CommunityMedicinePGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface CommunityMedicineSubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: CommunityMedicineLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const COMMUNITY_MEDICINE_SUBSPECIALTIES: CommunityMedicineSubspecialtyMap[] = [
  { slug: "epidemiology", name: "Epidemiology", icon: "📊", ugTopicCount: 8, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "biostatistics", name: "Biostatistics", icon: "📈", ugTopicCount: 6, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "public-health", name: "Public Health & Nutrition", icon: "🏥", ugTopicCount: 10, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "national-health-programs", name: "National Health Programs", icon: "🇮🇳", ugTopicCount: 8, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "occupational-health", name: "Occupational & Environmental Health", icon: "🏭", ugTopicCount: 5, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "family-medicine", name: "Family Medicine & MCH", icon: "👨‍👩‍👧", ugTopicCount: 6, pgTopicCount: 2, levels: ["UG", "PG"] },
];

// ─── UG Modules (CM1–CM19) ──────────────────────────────────────────────────

export const COMMUNITY_MEDICINE_UG_MODULES: CommunityMedicineUGModule[] = [
  {
    id: "cm1", module: "CM1", title: "Concept of Health & Disease",
    subspecialty: "public-health", topicSlugs: ["concept-of-health"],
    competencies: [
      { code: "CM1.1", text: "Define and describe the concept of health and disease", domain: "K", isCore: true },
      { code: "CM1.2", text: "Describe the natural history of disease", domain: "K", isCore: true },
      { code: "CM1.3", text: "Describe the concepts of prevention and control of disease", domain: "KH", isCore: true },
      { code: "CM1.4", text: "Describe the principles of health promotion", domain: "K", isCore: true },
    ],
  },
  {
    id: "cm2", module: "CM2", title: "Epidemiology — Principles",
    subspecialty: "epidemiology", topicSlugs: ["epidemiological-methods", "measures-of-disease"],
    competencies: [
      { code: "CM2.1", text: "Describe the principles and methods of epidemiology", domain: "KH", isCore: true },
      { code: "CM2.2", text: "Define, describe and calculate rates, ratios and proportions", domain: "SH", isCore: true },
      { code: "CM2.3", text: "Describe the study designs — cross-sectional, case-control, cohort, RCT", domain: "KH", isCore: true },
      { code: "CM2.4", text: "Describe the concepts of association and causation", domain: "KH", isCore: true },
      { code: "CM2.5", text: "Describe screening for disease", domain: "KH", isCore: true },
    ],
  },
  {
    id: "cm3", module: "CM3", title: "Biostatistics",
    subspecialty: "biostatistics", topicSlugs: ["descriptive-statistics", "inferential-statistics"],
    competencies: [
      { code: "CM3.1", text: "Describe the principles of biostatistics", domain: "KH", isCore: true },
      { code: "CM3.2", text: "Describe measures of central tendency and dispersion", domain: "SH", isCore: true },
      { code: "CM3.3", text: "Describe the principles of statistical tests — t-test, chi-square, ANOVA", domain: "KH", isCore: true },
      { code: "CM3.4", text: "Describe the concepts of sample size, power and confidence intervals", domain: "KH", isCore: true },
    ],
  },
  {
    id: "cm4", module: "CM4", title: "Nutrition",
    subspecialty: "public-health", topicSlugs: ["nutrition-assessment", "malnutrition"],
    competencies: [
      { code: "CM4.1", text: "Describe the principles of nutrition and dietary requirements", domain: "KH", isCore: true },
      { code: "CM4.2", text: "Describe protein-energy malnutrition and its management", domain: "KH", isCore: true },
      { code: "CM4.3", text: "Describe vitamin and mineral deficiency diseases", domain: "KH", isCore: true },
      { code: "CM4.4", text: "Describe the national nutrition programs", domain: "K", isCore: true },
    ],
  },
  {
    id: "cm5", module: "CM5", title: "Maternal & Child Health",
    subspecialty: "family-medicine", topicSlugs: ["maternal-health", "child-health-programs"],
    competencies: [
      { code: "CM5.1", text: "Describe the indicators of maternal and child health", domain: "KH", isCore: true },
      { code: "CM5.2", text: "Describe the RCH program and ICDS", domain: "K", isCore: true },
      { code: "CM5.3", text: "Describe the Universal Immunization Programme", domain: "KH", isCore: true },
      { code: "CM5.4", text: "Describe the under-5 mortality and strategies for reduction", domain: "KH", isCore: true },
    ],
  },
  {
    id: "cm6", module: "CM6", title: "Communicable Diseases",
    subspecialty: "epidemiology", topicSlugs: ["communicable-disease-epidemiology", "disease-surveillance"],
    competencies: [
      { code: "CM6.1", text: "Describe the epidemiology, prevention and control of communicable diseases — TB, malaria, HIV, dengue, hepatitis", domain: "KH", isCore: true },
      { code: "CM6.2", text: "Describe the principles of disease surveillance", domain: "KH", isCore: true },
      { code: "CM6.3", text: "Describe the principles of outbreak investigation", domain: "SH", isCore: true },
    ],
  },
  {
    id: "cm7", module: "CM7", title: "Non-Communicable Diseases",
    subspecialty: "epidemiology", topicSlugs: ["ncd-epidemiology"],
    competencies: [
      { code: "CM7.1", text: "Describe the epidemiology, prevention and control of NCDs — diabetes, hypertension, CVD, cancer", domain: "KH", isCore: true },
      { code: "CM7.2", text: "Describe the National Programme for Prevention and Control of Cancer, Diabetes, CVD and Stroke (NPCDCS)", domain: "K", isCore: true },
      { code: "CM7.3", text: "Describe the concepts of NCD risk factors and lifestyle modification", domain: "KH", isCore: true },
    ],
  },
  {
    id: "cm8", module: "CM8", title: "Environmental Health",
    subspecialty: "occupational-health", topicSlugs: ["water-sanitation", "air-pollution"],
    competencies: [
      { code: "CM8.1", text: "Describe the concepts of environmental health — water, air, housing, waste disposal", domain: "KH", isCore: true },
      { code: "CM8.2", text: "Describe the standards of safe drinking water and water purification", domain: "KH", isCore: true },
      { code: "CM8.3", text: "Describe the principles of solid and liquid waste management", domain: "K", isCore: true },
    ],
  },
  {
    id: "cm9", module: "CM9", title: "Occupational Health",
    subspecialty: "occupational-health", topicSlugs: ["occupational-diseases", "industrial-hygiene"],
    competencies: [
      { code: "CM9.1", text: "Describe the principles of occupational health and industrial hygiene", domain: "KH", isCore: true },
      { code: "CM9.2", text: "Describe occupational diseases and their prevention", domain: "KH", isCore: true },
    ],
  },
  {
    id: "cm10", module: "CM10", title: "Health Education & Communication",
    subspecialty: "public-health", topicSlugs: ["health-education"],
    competencies: [
      { code: "CM10.1", text: "Describe the principles and methods of health education and communication", domain: "KH", isCore: true },
      { code: "CM10.2", text: "Describe the principles of behaviour change communication", domain: "K", isCore: true },
    ],
  },
  {
    id: "cm11", module: "CM11", title: "Demography & Family Planning",
    subspecialty: "family-medicine", topicSlugs: ["demography", "family-planning"],
    competencies: [
      { code: "CM11.1", text: "Describe demographic indices and their significance", domain: "KH", isCore: true },
      { code: "CM11.2", text: "Describe the demographic cycle and population policies", domain: "K", isCore: true },
      { code: "CM11.3", text: "Describe methods of contraception and family planning programs", domain: "KH", isCore: true },
    ],
  },
  {
    id: "cm12", module: "CM12", title: "National Health Programs — Communicable",
    subspecialty: "national-health-programs", topicSlugs: ["rntcp", "nvbdcp", "nacp"],
    competencies: [
      { code: "CM12.1", text: "Describe the National Tuberculosis Elimination Programme (NTEP)", domain: "KH", isCore: true },
      { code: "CM12.2", text: "Describe the National Vector Borne Disease Control Programme", domain: "K", isCore: true },
      { code: "CM12.3", text: "Describe the National AIDS Control Programme", domain: "K", isCore: true },
      { code: "CM12.4", text: "Describe the National Leprosy Eradication Programme", domain: "K", isCore: true },
    ],
  },
  {
    id: "cm13", module: "CM13", title: "National Health Programs — NCD & Others",
    subspecialty: "national-health-programs", topicSlugs: ["npcdcs", "nmhp", "npcb"],
    competencies: [
      { code: "CM13.1", text: "Describe the NPCDCS and National Cancer Control Programme", domain: "K", isCore: true },
      { code: "CM13.2", text: "Describe the National Mental Health Programme", domain: "K", isCore: true },
      { code: "CM13.3", text: "Describe the National Programme for Control of Blindness", domain: "K", isCore: true },
      { code: "CM13.4", text: "Describe the Ayushman Bharat and Health and Wellness Centres", domain: "K", isCore: true },
    ],
  },
  {
    id: "cm14", module: "CM14", title: "Health Care Delivery System",
    subspecialty: "public-health", topicSlugs: ["healthcare-delivery"],
    competencies: [
      { code: "CM14.1", text: "Describe the health care delivery system in India — primary, secondary, tertiary", domain: "KH", isCore: true },
      { code: "CM14.2", text: "Describe the role of PHC, CHC, district hospital", domain: "KH", isCore: true },
      { code: "CM14.3", text: "Describe the National Health Policy and National Health Mission", domain: "K", isCore: true },
    ],
  },
  {
    id: "cm15", module: "CM15", title: "International Health",
    subspecialty: "public-health", topicSlugs: ["international-health"],
    competencies: [
      { code: "CM15.1", text: "Describe the role of WHO, UNICEF and other international health agencies", domain: "K", isCore: true },
      { code: "CM15.2", text: "Describe the Millennium and Sustainable Development Goals", domain: "K", isCore: true },
    ],
  },
  {
    id: "cm16", module: "CM16", title: "Health Economics & Management",
    subspecialty: "public-health", topicSlugs: ["health-economics"],
    competencies: [
      { code: "CM16.1", text: "Describe the principles of health economics and health financing", domain: "K", isCore: true },
      { code: "CM16.2", text: "Describe the principles of health planning and management", domain: "K", isCore: true },
    ],
  },
  {
    id: "cm17", module: "CM17", title: "Disaster Management",
    subspecialty: "public-health", topicSlugs: ["disaster-management"],
    competencies: [
      { code: "CM17.1", text: "Describe the principles of disaster management", domain: "K", isCore: true },
      { code: "CM17.2", text: "Describe the role of the health sector in disaster management", domain: "K", isCore: true },
    ],
  },
  {
    id: "cm18", module: "CM18", title: "Genetics & Health",
    subspecialty: "epidemiology", topicSlugs: ["genetic-epidemiology"],
    competencies: [
      { code: "CM18.1", text: "Describe the principles of genetics in relation to health and disease", domain: "K", isCore: true },
    ],
  },
  {
    id: "cm19", module: "CM19", title: "Research Methodology & Ethics",
    subspecialty: "biostatistics", topicSlugs: ["research-methodology", "medical-ethics-research"],
    competencies: [
      { code: "CM19.1", text: "Describe the principles of research methodology", domain: "KH", isCore: true },
      { code: "CM19.2", text: "Describe the principles of medical ethics in research", domain: "K", isCore: true },
      { code: "CM19.3", text: "Describe the process of writing a research protocol", domain: "SH", isCore: true },
    ],
  },
];

// ─── PG: MD Community Medicine Syllabus Topics ───────────────────────────────

export const COMMUNITY_MEDICINE_PG_TOPICS: CommunityMedicinePGTopic[] = [
  { id: "pg-epi-01", title: "Advanced Epidemiology — Study Designs, Meta-analysis", section: "Epidemiology", subspecialty: "epidemiology", topicSlugs: ["epidemiological-methods", "measures-of-disease"], ugModuleRefs: ["CM2"] },
  { id: "pg-epi-02", title: "Disease Surveillance & Outbreak Investigation", section: "Epidemiology", subspecialty: "epidemiology", topicSlugs: ["communicable-disease-epidemiology", "disease-surveillance"], ugModuleRefs: ["CM6"] },
  { id: "pg-bio-01", title: "Advanced Biostatistics & Data Analysis", section: "Biostatistics", subspecialty: "biostatistics", topicSlugs: ["descriptive-statistics", "inferential-statistics"], ugModuleRefs: ["CM3"] },
  { id: "pg-bio-02", title: "Research Methodology & Scientific Writing", section: "Biostatistics", subspecialty: "biostatistics", topicSlugs: ["research-methodology"], ugModuleRefs: ["CM19"] },
  { id: "pg-ph-01", title: "Public Health Nutrition & Food Safety", section: "Public Health", subspecialty: "public-health", topicSlugs: ["nutrition-assessment", "malnutrition"], ugModuleRefs: ["CM4"] },
  { id: "pg-ph-02", title: "Health Systems & Health Policy", section: "Public Health", subspecialty: "public-health", topicSlugs: ["healthcare-delivery", "health-economics"], ugModuleRefs: ["CM14", "CM16"] },
  { id: "pg-ph-03", title: "Health Education & Behaviour Change", section: "Public Health", subspecialty: "public-health", topicSlugs: ["health-education"], ugModuleRefs: ["CM10"] },
  { id: "pg-nhp-01", title: "National Health Programs — Implementation & Evaluation", section: "National Programs", subspecialty: "national-health-programs", topicSlugs: ["rntcp", "nvbdcp", "nacp"], ugModuleRefs: ["CM12"] },
  { id: "pg-nhp-02", title: "NCD Programs & Urban Health", section: "National Programs", subspecialty: "national-health-programs", topicSlugs: ["npcdcs"], ugModuleRefs: ["CM13"] },
  { id: "pg-occ-01", title: "Occupational Health & Industrial Toxicology", section: "Environmental Health", subspecialty: "occupational-health", topicSlugs: ["occupational-diseases", "industrial-hygiene"], ugModuleRefs: ["CM9"] },
  { id: "pg-occ-02", title: "Environmental Health — Climate Change, Water, Sanitation", section: "Environmental Health", subspecialty: "occupational-health", topicSlugs: ["water-sanitation", "air-pollution"], ugModuleRefs: ["CM8"] },
  { id: "pg-fam-01", title: "MCH — Reproductive Health, Immunization", section: "Family Medicine", subspecialty: "family-medicine", topicSlugs: ["maternal-health", "child-health-programs"], ugModuleRefs: ["CM5"] },
  { id: "pg-fam-02", title: "Demography, Family Planning & Population Sciences", section: "Family Medicine", subspecialty: "family-medicine", topicSlugs: ["demography", "family-planning"], ugModuleRefs: ["CM11"] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return COMMUNITY_MEDICINE_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): CommunityMedicineUGModule[] {
  return COMMUNITY_MEDICINE_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): CommunityMedicinePGTopic[] {
  return COMMUNITY_MEDICINE_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
