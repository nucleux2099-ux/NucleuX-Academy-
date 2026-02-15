/**
 * NMC CBME — Surgery Curriculum: Complete UG → PG → SS Mapping
 *
 * This file contains the full surgery curriculum organized by:
 * - UG: 30 modules (SU1–SU30), 132 competency codes
 * - PG: MS General Surgery systemic topics
 * - SS: MCh super-specialty curricula
 *
 * Each level maps to library subspecialties and topics, showing clear
 * progression as you go from UG → PG → SS.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type SurgeryLevel = "UG" | "PG" | "SS";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface SurgeryCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface SurgeryUGModule {
  id: string;
  module: string; // SU1, SU2, etc.
  title: string;
  competencies: SurgeryCompetency[];
  subspecialty: string; // maps to library subspecialty slug
  topicSlugs: string[]; // maps to library topic slugs
}

export interface SurgeryPGTopic {
  id: string;
  title: string;
  section: string; // "General Topics" | "Systemic Surgery" | "Clinical Cases"
  subspecialty: string;
  topicSlugs: string[];
  /** Which UG modules build into this PG topic */
  ugModuleRefs: string[];
}

export interface SurgerySSTopic {
  id: string;
  degree: "MCh";
  specialty: string;
  title: string;
  subspecialty: string;
  topicSlugs: string[];
  /** Which PG topics build into this SS topic */
  pgTopicRefs: string[];
}

export interface SurgerySubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  ssTopicCount: number;
  levels: SurgeryLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const SURGERY_SUBSPECIALTIES: SurgerySubspecialtyMap[] = [
  { slug: "general-topics", name: "General Topics", icon: "📋", ugTopicCount: 17, pgTopicCount: 17, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "trauma", name: "Trauma Surgery", icon: "🚑", ugTopicCount: 5, pgTopicCount: 8, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "head-neck", name: "Head & Neck", icon: "🗣️", ugTopicCount: 4, pgTopicCount: 7, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "endocrine", name: "Endocrine Surgery", icon: "🦋", ugTopicCount: 5, pgTopicCount: 7, ssTopicCount: 7, levels: ["UG", "PG", "SS"] },
  { slug: "breast", name: "Breast Surgery", icon: "🎀", ugTopicCount: 3, pgTopicCount: 6, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "thoracic", name: "Thoracic Surgery", icon: "🫁", ugTopicCount: 3, pgTopicCount: 6, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "esophagus", name: "Esophagus", icon: "🔴", ugTopicCount: 2, pgTopicCount: 6, ssTopicCount: 9, levels: ["UG", "PG", "SS"] },
  { slug: "stomach-duodenum", name: "Stomach & Duodenum", icon: "🟡", ugTopicCount: 2, pgTopicCount: 4, ssTopicCount: 6, levels: ["UG", "PG", "SS"] },
  { slug: "hepatobiliary", name: "Hepatobiliary", icon: "🟤", ugTopicCount: 1, pgTopicCount: 10, ssTopicCount: 12, levels: ["UG", "PG", "SS"] },
  { slug: "pancreas", name: "Pancreas", icon: "🟠", ugTopicCount: 0, pgTopicCount: 3, ssTopicCount: 3, levels: ["PG", "SS"] },
  { slug: "small-intestine", name: "Small Intestine", icon: "🔵", ugTopicCount: 3, pgTopicCount: 7, ssTopicCount: 7, levels: ["UG", "PG", "SS"] },
  { slug: "colorectal", name: "Colorectal", icon: "🟣", ugTopicCount: 0, pgTopicCount: 6, ssTopicCount: 6, levels: ["PG", "SS"] },
  { slug: "anorectal", name: "Anorectal", icon: "🩺", ugTopicCount: 2, pgTopicCount: 6, ssTopicCount: 6, levels: ["UG", "PG", "SS"] },
  { slug: "hernia", name: "Hernia", icon: "🔲", ugTopicCount: 1, pgTopicCount: 6, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "vascular", name: "Vascular Surgery", icon: "🫀", ugTopicCount: 4, pgTopicCount: 7, ssTopicCount: 7, levels: ["UG", "PG", "SS"] },
  { slug: "urology", name: "Urology", icon: "🫘", ugTopicCount: 5, pgTopicCount: 10, ssTopicCount: 10, levels: ["UG", "PG", "SS"] },
  { slug: "orthopedic-principles", name: "Orthopedic Principles", icon: "🦴", ugTopicCount: 4, pgTopicCount: 0, ssTopicCount: 0, levels: ["UG"] },
  { slug: "procedures", name: "Surgical Procedures", icon: "🔪", ugTopicCount: 2, pgTopicCount: 7, ssTopicCount: 0, levels: ["UG", "PG"] },
];

// ─── UG Modules (SU1–SU30) ──────────────────────────────────────────────────

export const SURGERY_UG_MODULES: SurgeryUGModule[] = [
  {
    id: "su1", module: "SU1", title: "Homeostasis & Metabolic Response to Injury",
    subspecialty: "general-topics", topicSlugs: ["homeostasis"],
    competencies: [
      { code: "SU1.1", text: "Describe basic concepts of homeostasis, enumerate the metabolic changes in injury and their mediators", domain: "KH", isCore: true },
      { code: "SU1.2", text: "Describe the factors that affect the metabolic response to injury", domain: "KH", isCore: true },
      { code: "SU1.3", text: "Describe basic concepts of perioperative care", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su2", module: "SU2", title: "Shock",
    subspecialty: "general-topics", topicSlugs: ["shock"],
    competencies: [
      { code: "SU2.1", text: "Describe the causes and pathophysiology of shock", domain: "KH", isCore: true },
      { code: "SU2.2", text: "Describe the clinical features of shock", domain: "KH", isCore: true },
      { code: "SU2.3", text: "Describe the principles of management of shock", domain: "SH", isCore: true },
    ],
  },
  {
    id: "su3", module: "SU3", title: "Blood Transfusion",
    subspecialty: "general-topics", topicSlugs: ["blood-transfusion"],
    competencies: [
      { code: "SU3.1", text: "Describe the indications for blood and blood product transfusion", domain: "KH", isCore: true },
      { code: "SU3.2", text: "Describe the complications of blood transfusion", domain: "KH", isCore: true },
      { code: "SU3.3", text: "Observe blood grouping and cross matching", domain: "SH", isCore: true },
    ],
  },
  {
    id: "su4", module: "SU4", title: "Burns",
    subspecialty: "general-topics", topicSlugs: ["burns"],
    competencies: [
      { code: "SU4.1", text: "Describe the etiology and classification of burns", domain: "KH", isCore: true },
      { code: "SU4.2", text: "Describe the clinical features and initial management of burns", domain: "KH", isCore: true },
      { code: "SU4.3", text: "Describe the principles of fluid resuscitation in burns", domain: "SH", isCore: true },
      { code: "SU4.4", text: "Describe the principles of treatment of burns", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su5", module: "SU5", title: "Wound Healing",
    subspecialty: "general-topics", topicSlugs: ["wound-healing"],
    competencies: [
      { code: "SU5.1", text: "Describe the process of wound healing", domain: "KH", isCore: true },
      { code: "SU5.2", text: "Describe the factors affecting wound healing", domain: "KH", isCore: true },
      { code: "SU5.3", text: "Describe the types of wound closure", domain: "KH", isCore: true },
      { code: "SU5.4", text: "Describe the complications of wound healing", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su6", module: "SU6", title: "Surgical Infections",
    subspecialty: "general-topics", topicSlugs: ["surgical-infections"],
    competencies: [
      { code: "SU6.1", text: "Describe the etiology and pathogenesis of surgical infections", domain: "KH", isCore: true },
      { code: "SU6.2", text: "Describe the principles of management of surgical infections", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su7", module: "SU7", title: "Surgical Audit & Research",
    subspecialty: "general-topics", topicSlugs: ["surgical-audit"],
    competencies: [
      { code: "SU7.1", text: "Describe the principles of surgical audit", domain: "K", isCore: true },
      { code: "SU7.2", text: "Describe the principles of evidence-based surgery", domain: "K", isCore: true },
    ],
  },
  {
    id: "su8", module: "SU8", title: "Surgical Ethics & Professionalism",
    subspecialty: "general-topics", topicSlugs: ["surgical-ethics"],
    competencies: [
      { code: "SU8.1", text: "Describe the principles of ethics as it pertains to surgery", domain: "KH", isCore: true },
      { code: "SU8.2", text: "Demonstrate the role of informed consent", domain: "SH", isCore: true },
      { code: "SU8.3", text: "Describe the medico-legal issues in surgical practice", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su9", module: "SU9", title: "Investigations & Cancer Biology",
    subspecialty: "general-topics", topicSlugs: ["investigations-imaging"],
    competencies: [
      { code: "SU9.1", text: "Describe the principles of imaging in surgical practice", domain: "KH", isCore: true },
      { code: "SU9.2", text: "Describe the principles of cancer biology", domain: "KH", isCore: true },
      { code: "SU9.3", text: "Describe the principles of cancer staging and screening", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su10", module: "SU10", title: "Perioperative Management",
    subspecialty: "general-topics", topicSlugs: ["perioperative-management"],
    competencies: [
      { code: "SU10.1", text: "Describe the principles of perioperative management", domain: "KH", isCore: true },
      { code: "SU10.2", text: "Describe the steps and obtain informed consent", domain: "SH", isCore: true },
      { code: "SU10.3", text: "Observe common surgical procedures", domain: "SH", isCore: true },
      { code: "SU10.4", text: "Demonstrate basic surgical skills", domain: "SH", isCore: true },
    ],
  },
  {
    id: "su11", module: "SU11", title: "Preoperative Assessment & Anesthesia",
    subspecialty: "general-topics", topicSlugs: ["preoperative-assessment"],
    competencies: [
      { code: "SU11.1", text: "Describe the principles of preoperative assessment", domain: "KH", isCore: true },
      { code: "SU11.2", text: "Describe ASA grading of fitness for surgery", domain: "KH", isCore: true },
      { code: "SU11.3", text: "Describe the principles of general and regional anaesthesia", domain: "KH", isCore: true },
      { code: "SU11.4", text: "Describe the principles of day care surgery", domain: "KH", isCore: true },
      { code: "SU11.5", text: "Describe the principles of safe surgery and WHO checklist", domain: "KH", isCore: true },
      { code: "SU11.6", text: "Describe the principles of monitoring in the perioperative period", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su12", module: "SU12", title: "Surgical Nutrition",
    subspecialty: "general-topics", topicSlugs: ["surgical-nutrition"],
    competencies: [
      { code: "SU12.1", text: "Describe the principles of nutritional assessment", domain: "KH", isCore: true },
      { code: "SU12.2", text: "Describe the principles of enteral nutrition", domain: "KH", isCore: true },
      { code: "SU12.3", text: "Describe the principles of parenteral nutrition", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su13", module: "SU13", title: "Organ Transplantation",
    subspecialty: "general-topics", topicSlugs: ["organ-transplantation"],
    competencies: [
      { code: "SU13.1", text: "Describe the principles of organ transplantation", domain: "K", isCore: true },
      { code: "SU13.2", text: "Describe immunological basis of organ transplantation", domain: "K", isCore: true },
      { code: "SU13.3", text: "Describe the ethical and legal aspects of organ transplantation", domain: "K", isCore: true },
      { code: "SU13.4", text: "Describe the concept of brain death", domain: "K", isCore: true },
    ],
  },
  {
    id: "su14", module: "SU14", title: "Asepsis, Sterilization & Wound Closure",
    subspecialty: "general-topics", topicSlugs: ["asepsis-sterilization"],
    competencies: [
      { code: "SU14.1", text: "Describe the principles of asepsis and sterilization", domain: "KH", isCore: true },
      { code: "SU14.2", text: "Describe the principles of OT design and functioning", domain: "KH", isCore: true },
      { code: "SU14.3", text: "Describe the principles of suturing and suture materials", domain: "KH", isCore: true },
      { code: "SU14.4", text: "Demonstrate the technique of basic wound closure", domain: "SH", isCore: true },
    ],
  },
  {
    id: "su15", module: "SU15", title: "Hospital Waste Management",
    subspecialty: "general-topics", topicSlugs: ["hospital-waste-management"],
    competencies: [
      { code: "SU15.1", text: "Describe the principles of hospital waste management", domain: "K", isCore: true },
    ],
  },
  {
    id: "su16", module: "SU16", title: "Minimally Invasive Surgery",
    subspecialty: "general-topics", topicSlugs: ["minimally-invasive-surgery"],
    competencies: [
      { code: "SU16.1", text: "Describe the principles of minimally invasive surgery", domain: "K", isCore: true },
    ],
  },
  {
    id: "su17", module: "SU17", title: "First Aid & Trauma",
    subspecialty: "trauma", topicSlugs: ["first-aid-bls", "head-injury", "soft-tissue-injuries", "chest-trauma", "airway-management"],
    competencies: [
      { code: "SU17.1", text: "Describe the principles of first aid", domain: "KH", isCore: true },
      { code: "SU17.2", text: "Describe the principles of basic life support", domain: "SH", isCore: true },
      { code: "SU17.3", text: "Describe the principles of advanced life support", domain: "KH", isCore: true },
      { code: "SU17.4", text: "Describe the clinical features of head injuries", domain: "KH", isCore: true },
      { code: "SU17.5", text: "Describe the principles of management of head injuries", domain: "KH", isCore: true },
      { code: "SU17.6", text: "Describe the Glasgow Coma Scale", domain: "SH", isCore: true },
      { code: "SU17.7", text: "Describe the principles of management of soft tissue injuries", domain: "KH", isCore: true },
      { code: "SU17.8", text: "Describe the principles of management of chest injuries", domain: "KH", isCore: true },
      { code: "SU17.9", text: "Describe the principles of intercostal drainage", domain: "KH", isCore: true },
      { code: "SU17.10", text: "Describe the principles of airway management", domain: "SH", isCore: true },
    ],
  },
  {
    id: "su18", module: "SU18", title: "Skin & Subcutaneous Tumors",
    subspecialty: "general-topics", topicSlugs: ["skin-subcutaneous-tumors"],
    competencies: [
      { code: "SU18.1", text: "Describe the etiology and classification of skin and subcutaneous tumors", domain: "KH", isCore: true },
      { code: "SU18.2", text: "Describe the clinical features of skin and subcutaneous tumors", domain: "KH", isCore: true },
      { code: "SU18.3", text: "Describe the principles of management of skin and subcutaneous tumors", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su19", module: "SU19", title: "Cleft Lip & Palate",
    subspecialty: "head-neck", topicSlugs: ["cleft-lip-palate"],
    competencies: [
      { code: "SU19.1", text: "Describe the etiology, clinical features of cleft lip and palate", domain: "KH", isCore: true },
      { code: "SU19.2", text: "Describe the principles of management of cleft lip and palate", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su20", module: "SU20", title: "Oral Cancer",
    subspecialty: "head-neck", topicSlugs: ["oral-cancer"],
    competencies: [
      { code: "SU20.1", text: "Describe the etiology and clinical features of oral cancer", domain: "KH", isCore: true },
      { code: "SU20.2", text: "Describe the principles of management of oral cancer", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su21", module: "SU21", title: "Salivary Glands",
    subspecialty: "head-neck", topicSlugs: ["salivary-glands"],
    competencies: [
      { code: "SU21.1", text: "Describe the clinical features of salivary gland tumors", domain: "KH", isCore: true },
      { code: "SU21.2", text: "Describe the principles of management of salivary gland tumors", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su22", module: "SU22", title: "Thyroid & Parathyroid",
    subspecialty: "endocrine", topicSlugs: ["thyroid-anatomy-physiology", "thyroid-swellings", "thyroid-cancer", "parathyroid"],
    competencies: [
      { code: "SU22.1", text: "Describe the applied anatomy and physiology of thyroid", domain: "KH", isCore: true },
      { code: "SU22.2", text: "Describe the clinical features of thyroid swellings", domain: "KH", isCore: true },
      { code: "SU22.3", text: "Describe the investigations for thyroid disease", domain: "KH", isCore: true },
      { code: "SU22.4", text: "Describe the clinical features and management of thyroid cancer", domain: "KH", isCore: true },
      { code: "SU22.5", text: "Describe the clinical features of hyperparathyroidism", domain: "KH", isCore: true },
      { code: "SU22.6", text: "Describe the principles of management of hyperparathyroidism", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su23", module: "SU23", title: "Adrenal Glands",
    subspecialty: "endocrine", topicSlugs: ["adrenal-glands"],
    competencies: [
      { code: "SU23.1", text: "Describe the clinical features of adrenal tumors", domain: "K", isCore: true },
      { code: "SU23.2", text: "Describe the principles of management of adrenal tumors", domain: "K", isCore: true },
      { code: "SU23.3", text: "Describe the clinical features of Cushing's syndrome and Conn's syndrome", domain: "K", isCore: true },
    ],
  },
  {
    id: "su24", module: "SU24", title: "Lymphatic System & Tumors",
    subspecialty: "head-neck", topicSlugs: ["cervical-lymphadenopathy"],
    competencies: [
      { code: "SU24.1", text: "Describe the etiology and classification of cervical lymphadenopathy", domain: "KH", isCore: true },
      { code: "SU24.2", text: "Describe the clinical features of cervical lymphadenopathy", domain: "KH", isCore: true },
      { code: "SU24.3", text: "Describe the principles of management of cervical lymphadenopathy", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su25", module: "SU25", title: "Breast",
    subspecialty: "breast", topicSlugs: ["breast-anatomy-examination", "benign-breast-disease", "breast-cancer"],
    competencies: [
      { code: "SU25.1", text: "Describe the applied anatomy of breast", domain: "KH", isCore: true },
      { code: "SU25.2", text: "Describe the clinical features and management of benign breast disease", domain: "KH", isCore: true },
      { code: "SU25.3", text: "Describe the etiology, clinical features and management of breast cancer", domain: "KH", isCore: true },
      { code: "SU25.4", text: "Describe the principles of breast cancer screening", domain: "KH", isCore: true },
      { code: "SU25.5", text: "Perform clinical breast examination", domain: "SH", isCore: true },
    ],
  },
  {
    id: "su26", module: "SU26", title: "Cardiothoracic & Mediastinal",
    subspecialty: "thoracic", topicSlugs: ["coronary-heart-disease-surgery", "mediastinal-diseases", "lung-cancer"],
    competencies: [
      { code: "SU26.1", text: "Outline the role of surgery in coronary heart disease, valvular heart diseases and congenital heart diseases", domain: "K", isCore: true },
      { code: "SU26.3", text: "Describe the clinical features of mediastinal diseases and principles of management", domain: "K", isCore: true },
      { code: "SU26.4", text: "Describe the etiology, pathogenesis, clinical features of tumors of lung and principles of management", domain: "K", isCore: true },
    ],
  },
  {
    id: "su27", module: "SU27", title: "Vascular System",
    subspecialty: "vascular", topicSlugs: ["arterial-disease", "venous-disease", "lymphatic-system"],
    competencies: [
      { code: "SU27.1", text: "Describe the etiology, pathophysiology, clinical features of peripheral arterial disease", domain: "KH", isCore: true },
      { code: "SU27.2", text: "Describe the clinical features of acute arterial occlusion", domain: "KH", isCore: true },
      { code: "SU27.3", text: "Describe the types and principles of management of gangrene", domain: "KH", isCore: true },
      { code: "SU27.4", text: "Describe the clinical features of Buerger's disease", domain: "KH", isCore: true },
      { code: "SU27.5", text: "Describe the etiology and clinical features of varicose veins", domain: "KH", isCore: true },
      { code: "SU27.6", text: "Describe the principles of management of varicose veins", domain: "KH", isCore: true },
      { code: "SU27.7", text: "Describe the pathophysiology, clinical features and management of DVT", domain: "KH", isCore: true },
      { code: "SU27.8", text: "Describe the clinical features and management of lymphedema", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su28", module: "SU28", title: "GI System",
    subspecialty: "esophagus", // Primary — maps to multiple subspecialties
    topicSlugs: [],
    competencies: [
      { code: "SU28.1", text: "Describe the clinical features and management of acute abdomen", domain: "KH", isCore: true },
      { code: "SU28.2", text: "Describe the clinical features and management of acute appendicitis", domain: "KH", isCore: true },
      { code: "SU28.3", text: "Describe the clinical features and management of peritonitis", domain: "KH", isCore: true },
      { code: "SU28.4", text: "Describe the clinical features and management of intestinal obstruction", domain: "KH", isCore: true },
      { code: "SU28.5", text: "Describe the applied anatomy of esophagus", domain: "KH", isCore: true },
      { code: "SU28.6", text: "Describe the clinical features and management of dysphagia", domain: "KH", isCore: true },
      { code: "SU28.7", text: "Describe the applied anatomy and physiology of stomach", domain: "KH", isCore: true },
      { code: "SU28.8", text: "Describe the clinical features and management of peptic ulcer disease", domain: "KH", isCore: true },
      { code: "SU28.9", text: "Describe the clinical features and management of gastric cancer", domain: "KH", isCore: true },
      { code: "SU28.10", text: "Describe the clinical features and management of liver disorders (abscess, portal hypertension, jaundice)", domain: "KH", isCore: true },
      { code: "SU28.11", text: "Describe the clinical features and management of diseases of spleen", domain: "KH", isCore: true },
      { code: "SU28.12", text: "Describe the clinical features and management of cholelithiasis and cholecystitis", domain: "KH", isCore: true },
      { code: "SU28.13", text: "Describe the applied anatomy and physiology of small intestine", domain: "KH", isCore: true },
      { code: "SU28.14", text: "Describe the clinical features and management of intestinal obstruction", domain: "KH", isCore: true },
      { code: "SU28.15", text: "Describe the clinical features and management of intestinal tuberculosis", domain: "KH", isCore: true },
      { code: "SU28.16", text: "Describe the clinical features and management of hemorrhoids", domain: "KH", isCore: true },
      { code: "SU28.17", text: "Describe the clinical features and management of fistula-in-ano", domain: "KH", isCore: true },
      { code: "SU28.18", text: "Describe the clinical features and management of carcinoma rectum", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su29", module: "SU29", title: "Urology",
    subspecialty: "urology", topicSlugs: ["urinary-symptoms-investigations", "urolithiasis", "bph", "urinary-retention", "urethral-stricture"],
    competencies: [
      { code: "SU29.1", text: "Describe the clinical features of common urological conditions", domain: "KH", isCore: true },
      { code: "SU29.2", text: "Describe the investigations for urological conditions", domain: "KH", isCore: true },
      { code: "SU29.3", text: "Describe the clinical features and management of urolithiasis", domain: "KH", isCore: true },
      { code: "SU29.4", text: "Describe the clinical features and management of BPH", domain: "KH", isCore: true },
      { code: "SU29.5", text: "Describe the principles of management of BPH", domain: "KH", isCore: true },
      { code: "SU29.6", text: "Describe the clinical features and management of acute urinary retention", domain: "KH", isCore: true },
      { code: "SU29.7", text: "Demonstrate catheterization on a mannequin", domain: "SH", isCore: true },
      { code: "SU29.8", text: "Describe the clinical features and management of urethral stricture", domain: "KH", isCore: true },
      { code: "SU29.9", text: "Describe the clinical features and management of phimosis and paraphimosis", domain: "KH", isCore: true },
      { code: "SU29.10", text: "Describe the clinical features and management of carcinoma prostate", domain: "KH", isCore: true },
      { code: "SU29.11", text: "Describe the clinical features and management of undescended testis", domain: "KH", isCore: true },
    ],
  },
  {
    id: "su30", module: "SU30", title: "Orthopedics/MSK",
    subspecialty: "orthopedic-principles", topicSlugs: ["fracture-principles", "bone-tumors", "joint-diseases", "peripheral-nerve-injuries"],
    competencies: [
      { code: "SU30.1", text: "Describe the principles of fracture management", domain: "KH", isCore: true },
      { code: "SU30.2", text: "Describe the clinical features and management of common fractures", domain: "KH", isCore: true },
      { code: "SU30.3", text: "Describe the principles of management of open fractures", domain: "KH", isCore: true },
      { code: "SU30.4", text: "Describe the clinical features and management of bone tumors", domain: "K", isCore: true },
      { code: "SU30.5", text: "Describe the clinical features and management of joint diseases", domain: "K", isCore: true },
      { code: "SU30.6", text: "Describe the clinical features and management of peripheral nerve injuries", domain: "K", isCore: true },
    ],
  },
];

// ─── SU28 Sub-mapping (GI module maps to multiple subspecialties) ────────────

export const SU28_SUBSPECIALTY_MAP: { code: string; subspecialty: string; topicSlug: string }[] = [
  { code: "SU28.1", subspecialty: "small-intestine", topicSlug: "intestinal-obstruction" },
  { code: "SU28.2", subspecialty: "small-intestine", topicSlug: "acute-appendicitis" },
  { code: "SU28.3", subspecialty: "small-intestine", topicSlug: "peritonitis" },
  { code: "SU28.4", subspecialty: "small-intestine", topicSlug: "intestinal-obstruction" },
  { code: "SU28.5", subspecialty: "esophagus", topicSlug: "esophageal-anatomy" },
  { code: "SU28.6", subspecialty: "esophagus", topicSlug: "dysphagia" },
  { code: "SU28.7", subspecialty: "stomach-duodenum", topicSlug: "gastric-anatomy-physiology" },
  { code: "SU28.8", subspecialty: "stomach-duodenum", topicSlug: "peptic-ulcer-disease" },
  { code: "SU28.9", subspecialty: "stomach-duodenum", topicSlug: "gastric-cancer" },
  { code: "SU28.10", subspecialty: "hepatobiliary", topicSlug: "liver-anatomy" },
  { code: "SU28.11", subspecialty: "hepatobiliary", topicSlug: "spleen-surgical" },
  { code: "SU28.12", subspecialty: "hepatobiliary", topicSlug: "cholelithiasis" },
  { code: "SU28.13", subspecialty: "small-intestine", topicSlug: "small-intestine-anatomy" },
  { code: "SU28.14", subspecialty: "small-intestine", topicSlug: "intestinal-obstruction" },
  { code: "SU28.15", subspecialty: "small-intestine", topicSlug: "intestinal-tuberculosis" },
  { code: "SU28.16", subspecialty: "anorectal", topicSlug: "hemorrhoids" },
  { code: "SU28.17", subspecialty: "anorectal", topicSlug: "fistula-in-ano" },
  { code: "SU28.18", subspecialty: "colorectal", topicSlug: "colorectal-cancer" },
];

// ─── PG: MS General Surgery Syllabus Topics ──────────────────────────────────

export const SURGERY_PG_TOPICS: SurgeryPGTopic[] = [
  // General Topics section
  { id: "pg-gen-01", title: "Wound Healing & Recent Advances", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["wound-healing"], ugModuleRefs: ["SU5"] },
  { id: "pg-gen-02", title: "Asepsis, Antisepsis, Sterilization", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["asepsis-sterilization"], ugModuleRefs: ["SU14"] },
  { id: "pg-gen-03", title: "Surgical Infections & Antibiotics", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["surgical-infections"], ugModuleRefs: ["SU6"] },
  { id: "pg-gen-04", title: "Shock — Etiology, Pathophysiology & Management", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["shock"], ugModuleRefs: ["SU2"] },
  { id: "pg-gen-05", title: "Blood Transfusion & Components", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["blood-transfusion"], ugModuleRefs: ["SU3"] },
  { id: "pg-gen-06", title: "Perioperative Care & Complications", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["perioperative-management", "preoperative-assessment"], ugModuleRefs: ["SU10", "SU11"] },
  { id: "pg-gen-07", title: "Surgical Nutrition", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["surgical-nutrition"], ugModuleRefs: ["SU12"] },
  { id: "pg-gen-08", title: "Burns — Management", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["burns"], ugModuleRefs: ["SU4"] },
  { id: "pg-gen-09", title: "Organ Transplantation & Brain Death", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["organ-transplantation"], ugModuleRefs: ["SU13"] },

  // Trauma
  { id: "pg-trauma-01", title: "Head Injury — GCS, Monitoring, Referral", section: "Systemic Surgery", subspecialty: "trauma", topicSlugs: ["head-injury", "polytrauma-assessment"], ugModuleRefs: ["SU17"] },
  { id: "pg-trauma-02", title: "Missile, Blast & Gunshot Injuries", section: "Systemic Surgery", subspecialty: "trauma", topicSlugs: ["blast-missile-injuries"], ugModuleRefs: ["SU17"] },
  { id: "pg-trauma-03", title: "ATLS & Disaster Management", section: "Systemic Surgery", subspecialty: "trauma", topicSlugs: ["polytrauma-assessment", "abdominal-trauma"], ugModuleRefs: ["SU17"] },

  // Head & Neck
  { id: "pg-hn-01", title: "Oral Malignancies & Salivary Neoplasms", section: "Systemic Surgery", subspecialty: "head-neck", topicSlugs: ["oral-cancer", "parotid-tumors", "salivary-glands"], ugModuleRefs: ["SU20", "SU21"] },
  { id: "pg-hn-02", title: "Cervical Lymphadenitis & Branchial Cyst", section: "Systemic Surgery", subspecialty: "head-neck", topicSlugs: ["cervical-lymphadenopathy", "branchial-cyst-cystic-hygroma", "thyroglossal-cyst"], ugModuleRefs: ["SU24", "SU19"] },
  { id: "pg-hn-03", title: "Cleft Lip & Palate", section: "Systemic Surgery", subspecialty: "head-neck", topicSlugs: ["cleft-lip-palate"], ugModuleRefs: ["SU19"] },

  // Endocrine
  { id: "pg-endo-01", title: "Goitre, Thyrotoxicosis & Solitary Nodule", section: "Systemic Surgery", subspecialty: "endocrine", topicSlugs: ["thyroid-swellings", "thyrotoxicosis", "solitary-thyroid-nodule"], ugModuleRefs: ["SU22"] },
  { id: "pg-endo-02", title: "Thyroid Neoplasms", section: "Systemic Surgery", subspecialty: "endocrine", topicSlugs: ["thyroid-cancer"], ugModuleRefs: ["SU22"] },

  // Breast
  { id: "pg-breast-01", title: "Breast — Examination, Abscess, Benign Disease", section: "Systemic Surgery", subspecialty: "breast", topicSlugs: ["breast-anatomy-examination", "breast-abscess", "benign-breast-disease", "nipple-discharge"], ugModuleRefs: ["SU25"] },
  { id: "pg-breast-02", title: "Breast Cancer — Staging & Multimodality Management", section: "Systemic Surgery", subspecialty: "breast", topicSlugs: ["breast-cancer", "breast-reconstruction"], ugModuleRefs: ["SU25"] },

  // Thoracic
  { id: "pg-thorax-01", title: "Pneumothorax, Hemothorax, Empyema", section: "Systemic Surgery", subspecialty: "thoracic", topicSlugs: ["pneumothorax-hemothorax", "empyema-thoracis"], ugModuleRefs: ["SU26"] },
  { id: "pg-thorax-02", title: "Lung Neoplasms & Thoracic Outlet", section: "Systemic Surgery", subspecialty: "thoracic", topicSlugs: ["lung-cancer", "thoracic-outlet-syndrome"], ugModuleRefs: ["SU26"] },

  // Esophagus
  { id: "pg-eso-01", title: "Esophageal Atresia, Achalasia, GERD", section: "Systemic Surgery", subspecialty: "esophagus", topicSlugs: ["esophageal-atresia", "achalasia-cardia", "gerd"], ugModuleRefs: ["SU28"] },
  { id: "pg-eso-02", title: "Cancer Esophagus", section: "Systemic Surgery", subspecialty: "esophagus", topicSlugs: ["esophageal-cancer"], ugModuleRefs: ["SU28"] },

  // Stomach & Duodenum
  { id: "pg-gastro-01", title: "Peptic Ulcer Disease & H. Pylori", section: "Systemic Surgery", subspecialty: "stomach-duodenum", topicSlugs: ["peptic-ulcer-disease", "gastric-anatomy-physiology"], ugModuleRefs: ["SU28"] },
  { id: "pg-gastro-02", title: "Gastric Cancer & Pyloric Stenosis", section: "Systemic Surgery", subspecialty: "stomach-duodenum", topicSlugs: ["gastric-cancer", "pyloric-stenosis"], ugModuleRefs: ["SU28"] },

  // HPB
  { id: "pg-hpb-01", title: "Liver Abscess, Hydatid Cyst, Portal Hypertension", section: "Systemic Surgery", subspecialty: "hepatobiliary", topicSlugs: ["liver-abscess", "hydatid-cyst", "portal-hypertension"], ugModuleRefs: ["SU28"] },
  { id: "pg-hpb-02", title: "Obstructive Jaundice & Gallstone Disease", section: "Systemic Surgery", subspecialty: "hepatobiliary", topicSlugs: ["obstructive-jaundice", "cholelithiasis", "cholecystitis"], ugModuleRefs: ["SU28"] },
  { id: "pg-hpb-03", title: "Gallbladder & Bile Duct Cancers", section: "Systemic Surgery", subspecialty: "hepatobiliary", topicSlugs: ["gallbladder-cancer", "choledochal-cyst"], ugModuleRefs: ["SU28"] },

  // Pancreas
  { id: "pg-panc-01", title: "Acute & Chronic Pancreatitis", section: "Systemic Surgery", subspecialty: "pancreas", topicSlugs: ["acute-pancreatitis", "chronic-pancreatitis"], ugModuleRefs: [] },
  { id: "pg-panc-02", title: "Carcinoma Pancreas", section: "Systemic Surgery", subspecialty: "pancreas", topicSlugs: ["pancreatic-cancer"], ugModuleRefs: [] },

  // Small Intestine
  { id: "pg-si-01", title: "Peritonitis & Acute Abdomen", section: "Systemic Surgery", subspecialty: "small-intestine", topicSlugs: ["intestinal-obstruction", "intestinal-tuberculosis"], ugModuleRefs: ["SU28"] },
  { id: "pg-si-02", title: "Appendicitis & Crohn's Disease", section: "Systemic Surgery", subspecialty: "small-intestine", topicSlugs: ["crohns-disease", "meckels-diverticulum"], ugModuleRefs: ["SU28"] },

  // Colorectal
  { id: "pg-cr-01", title: "Colitis, IBD & Colorectal Cancer", section: "Systemic Surgery", subspecialty: "colorectal", topicSlugs: ["ulcerative-colitis", "colorectal-cancer", "diverticular-disease"], ugModuleRefs: ["SU28"] },
  { id: "pg-cr-02", title: "Colostomy & Hirschsprung Disease", section: "Systemic Surgery", subspecialty: "colorectal", topicSlugs: ["colostomy-management", "hirschsprung-disease", "volvulus"], ugModuleRefs: ["SU28"] },

  // Anorectal
  { id: "pg-ar-01", title: "Hemorrhoids, Fissure, Fistula, Abscess", section: "Systemic Surgery", subspecialty: "anorectal", topicSlugs: ["hemorrhoids", "anal-fissure", "fistula-in-ano", "rectal-prolapse"], ugModuleRefs: ["SU28"] },
  { id: "pg-ar-02", title: "Anorectal Malformations & Anal Cancer", section: "Systemic Surgery", subspecialty: "anorectal", topicSlugs: ["anal-cancer", "anorectal-anomalies"], ugModuleRefs: ["SU28"] },

  // Hernia
  { id: "pg-hernia-01", title: "Inguinal, Femoral, Umbilical & Incisional Hernia", section: "Systemic Surgery", subspecialty: "hernia", topicSlugs: ["inguinal-hernia", "femoral-hernia", "umbilical-hernia", "incisional-hernia", "hiatal-hernia"], ugModuleRefs: [] },

  // Vascular
  { id: "pg-vasc-01", title: "Arterial Disease, Gangrene & Amputation", section: "Systemic Surgery", subspecialty: "vascular", topicSlugs: ["arterial-disease", "gangrene-amputation", "vascular-trauma"], ugModuleRefs: ["SU27"] },
  { id: "pg-vasc-02", title: "Varicose Veins, DVT & Lymphedema", section: "Systemic Surgery", subspecialty: "vascular", topicSlugs: ["varicose-veins", "dvt-pulmonary-embolism", "venous-disease", "lymphatic-system"], ugModuleRefs: ["SU27"] },

  // Urology
  { id: "pg-uro-01", title: "Urolithiasis & BPH", section: "Systemic Surgery", subspecialty: "urology", topicSlugs: ["urolithiasis", "bph", "urinary-retention"], ugModuleRefs: ["SU29"] },
  { id: "pg-uro-02", title: "Scrotal & Testicular Conditions", section: "Systemic Surgery", subspecialty: "urology", topicSlugs: ["hydrocele", "torsion-testis", "testicular-tumors", "undescended-testis"], ugModuleRefs: ["SU29"] },
  { id: "pg-uro-03", title: "Phimosis, Carcinoma Penis & Urethral Injuries", section: "Systemic Surgery", subspecialty: "urology", topicSlugs: ["phimosis-paraphimosis", "urethral-stricture"], ugModuleRefs: ["SU29"] },
];

// ─── SS: MCh Surgery Subspecialties ──────────────────────────────────────────

export const SURGERY_SS_SPECIALTIES: {
  id: string;
  degree: "MCh";
  title: string;
  slug: string;
  description: string;
  subspecialties: string[];
  pgPrerequisite: string;
}[] = [
  {
    id: "mch-surgical-gastro",
    degree: "MCh",
    title: "MCh Surgical Gastroenterology",
    slug: "surgical-gastroenterology",
    description: "Luminal and HPB diseases — diagnosis, surgery, and follow-up including minimal access",
    subspecialties: ["esophagus", "stomach-duodenum", "hepatobiliary", "pancreas", "small-intestine", "colorectal", "anorectal"],
    pgPrerequisite: "MS General Surgery",
  },
  {
    id: "mch-hpb-surgery",
    degree: "MCh",
    title: "MCh HPB Surgery",
    slug: "hpb-surgery",
    description: "Hepato-Pancreato-Biliary surgery including transplantation",
    subspecialties: ["hepatobiliary", "pancreas"],
    pgPrerequisite: "MS General Surgery",
  },
  {
    id: "mch-endocrine-surgery",
    degree: "MCh",
    title: "MCh Endocrine Surgery",
    slug: "endocrine-surgery",
    description: "Thyroid, parathyroid, adrenal, pancreatic endocrine surgery",
    subspecialties: ["endocrine"],
    pgPrerequisite: "MS General Surgery",
  },
  {
    id: "mch-vascular-surgery",
    degree: "MCh",
    title: "MCh Vascular Surgery",
    slug: "vascular-surgery",
    description: "Arterial, venous, and lymphatic surgery including endovascular procedures",
    subspecialties: ["vascular"],
    pgPrerequisite: "MS General Surgery",
  },
  {
    id: "mch-urology",
    degree: "MCh",
    title: "MCh Urology",
    slug: "urology",
    description: "Urological surgery including endourology, uro-oncology, reconstructive urology",
    subspecialties: ["urology"],
    pgPrerequisite: "MS General Surgery",
  },
  {
    id: "mch-pediatric-surgery",
    degree: "MCh",
    title: "MCh Pediatric Surgery",
    slug: "pediatric-surgery",
    description: "Neonatal surgery, pediatric urology, pediatric oncology",
    subspecialties: [],
    pgPrerequisite: "MS General Surgery",
  },
];

// ─── Helper: Total competency count ──────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return SURGERY_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): SurgeryUGModule[] {
  return SURGERY_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): SurgeryPGTopic[] {
  return SURGERY_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
