/**
 * NMC CBME — Anesthesia Curriculum: Complete UG → PG Mapping
 *
 * UG: 10 modules (AS1–AS10), NMC competency codes
 * PG: MD Anesthesia syllabus topics
 */

export type AnesthesiaLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface AnesthesiaCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface AnesthesiaUGModule {
  id: string;
  module: string;
  title: string;
  competencies: AnesthesiaCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface AnesthesiaPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface AnesthesiaSubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: AnesthesiaLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const ANESTHESIA_SUBSPECIALTIES: AnesthesiaSubspecialtyMap[] = [
  { slug: "general-anesthesia", name: "General Anesthesia", icon: "💉", ugTopicCount: 8, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "regional-anesthesia", name: "Regional Anesthesia", icon: "🎯", ugTopicCount: 4, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "critical-care-anesthesia", name: "Critical Care & ICU", icon: "🏥", ugTopicCount: 6, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "pain-management", name: "Pain Management", icon: "🩺", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
];

// ─── UG Modules (AS1–AS10) ──────────────────────────────────────────────────

export const ANESTHESIA_UG_MODULES: AnesthesiaUGModule[] = [
  {
    id: "as1", module: "AS1", title: "Pre-Anesthetic Assessment",
    subspecialty: "general-anesthesia", topicSlugs: ["pre-anesthetic-evaluation", "asa-grading"],
    competencies: [
      { code: "AS1.1", text: "Describe the principles of pre-anesthetic evaluation", domain: "KH", isCore: true },
      { code: "AS1.2", text: "Enumerate and describe the ASA grading system", domain: "KH", isCore: true },
      { code: "AS1.3", text: "Describe the concept of informed consent for anesthesia", domain: "KH", isCore: true },
      { code: "AS1.4", text: "Describe the preoperative fasting guidelines", domain: "KH", isCore: true },
    ],
  },
  {
    id: "as2", module: "AS2", title: "Airway Management",
    subspecialty: "general-anesthesia", topicSlugs: ["airway-assessment", "intubation", "difficult-airway"],
    competencies: [
      { code: "AS2.1", text: "Describe the anatomy of the airway and its assessment", domain: "KH", isCore: true },
      { code: "AS2.2", text: "Describe the techniques of airway management including endotracheal intubation", domain: "KH", isCore: true },
      { code: "AS2.3", text: "Describe the concept of difficult airway and its management", domain: "KH", isCore: true },
      { code: "AS2.4", text: "Demonstrate bag-mask ventilation on a mannequin", domain: "SH", isCore: true },
    ],
  },
  {
    id: "as3", module: "AS3", title: "General Anesthesia",
    subspecialty: "general-anesthesia", topicSlugs: ["inhalational-agents", "intravenous-agents", "muscle-relaxants"],
    competencies: [
      { code: "AS3.1", text: "Describe the pharmacology of inhalational anesthetic agents", domain: "KH", isCore: true },
      { code: "AS3.2", text: "Describe the pharmacology of intravenous anesthetic agents", domain: "KH", isCore: true },
      { code: "AS3.3", text: "Describe the pharmacology of muscle relaxants", domain: "KH", isCore: true },
      { code: "AS3.4", text: "Describe the stages and signs of general anesthesia", domain: "KH", isCore: true },
    ],
  },
  {
    id: "as4", module: "AS4", title: "Regional Anesthesia",
    subspecialty: "regional-anesthesia", topicSlugs: ["spinal-anesthesia", "epidural-anesthesia", "nerve-blocks"],
    competencies: [
      { code: "AS4.1", text: "Describe the principles and pharmacology of local anesthetic agents", domain: "KH", isCore: true },
      { code: "AS4.2", text: "Describe the principles, technique, indications and complications of spinal anesthesia", domain: "KH", isCore: true },
      { code: "AS4.3", text: "Describe the principles, technique, indications and complications of epidural anesthesia", domain: "KH", isCore: true },
      { code: "AS4.4", text: "Describe the principles of common nerve blocks", domain: "K", isCore: true },
    ],
  },
  {
    id: "as5", module: "AS5", title: "Monitoring",
    subspecialty: "general-anesthesia", topicSlugs: ["intraoperative-monitoring"],
    competencies: [
      { code: "AS5.1", text: "Describe the principles of intraoperative monitoring", domain: "KH", isCore: true },
      { code: "AS5.2", text: "Describe the principles of pulse oximetry, capnography, ECG monitoring", domain: "KH", isCore: true },
      { code: "AS5.3", text: "Describe the principles of invasive and non-invasive blood pressure monitoring", domain: "K", isCore: true },
    ],
  },
  {
    id: "as6", module: "AS6", title: "Pain Management",
    subspecialty: "pain-management", topicSlugs: ["acute-pain", "chronic-pain", "pain-assessment"],
    competencies: [
      { code: "AS6.1", text: "Describe the principles of pain assessment and management", domain: "KH", isCore: true },
      { code: "AS6.2", text: "Describe the WHO pain ladder and principles of analgesic use", domain: "KH", isCore: true },
      { code: "AS6.3", text: "Describe the principles of pain management in palliative care", domain: "K", isCore: true },
    ],
  },
  {
    id: "as7", module: "AS7", title: "Critical Care & ICU",
    subspecialty: "critical-care-anesthesia", topicSlugs: ["icu-management", "mechanical-ventilation", "shock-icu"],
    competencies: [
      { code: "AS7.1", text: "Describe the principles of ICU management — admission criteria, monitoring", domain: "KH", isCore: true },
      { code: "AS7.2", text: "Describe the principles of mechanical ventilation", domain: "KH", isCore: true },
      { code: "AS7.3", text: "Describe the principles of management of sepsis and septic shock", domain: "KH", isCore: true },
      { code: "AS7.4", text: "Describe the principles of nutrition in critical illness", domain: "K", isCore: true },
    ],
  },
  {
    id: "as8", module: "AS8", title: "Resuscitation",
    subspecialty: "critical-care-anesthesia", topicSlugs: ["cpr-bls", "acls", "neonatal-resuscitation"],
    competencies: [
      { code: "AS8.1", text: "Describe and demonstrate the principles of BLS in adults and children", domain: "SH", isCore: true },
      { code: "AS8.2", text: "Describe the principles of ACLS", domain: "KH", isCore: true },
      { code: "AS8.3", text: "Describe the principles of neonatal resuscitation", domain: "KH", isCore: true },
    ],
  },
  {
    id: "as9", module: "AS9", title: "Day-Care Anesthesia",
    subspecialty: "general-anesthesia", topicSlugs: ["day-care-anesthesia"],
    competencies: [
      { code: "AS9.1", text: "Describe the principles of day-care anesthesia", domain: "K", isCore: true },
      { code: "AS9.2", text: "Describe the selection criteria for day-care surgery", domain: "K", isCore: true },
    ],
  },
  {
    id: "as10", module: "AS10", title: "Anesthesia in Special Situations",
    subspecialty: "critical-care-anesthesia", topicSlugs: ["obstetric-anesthesia", "pediatric-anesthesia"],
    competencies: [
      { code: "AS10.1", text: "Describe the principles of anesthesia in obstetrics", domain: "K", isCore: true },
      { code: "AS10.2", text: "Describe the principles of anesthesia in pediatric patients", domain: "K", isCore: true },
      { code: "AS10.3", text: "Describe the principles of anesthesia in emergency surgery", domain: "K", isCore: true },
    ],
  },
];

// ─── PG: MD Anesthesia Syllabus Topics ───────────────────────────────────────

export const ANESTHESIA_PG_TOPICS: AnesthesiaPGTopic[] = [
  { id: "pg-ga-01", title: "Pharmacology of Anesthetic Agents — IV, Inhalational, Muscle Relaxants", section: "General Anesthesia", subspecialty: "general-anesthesia", topicSlugs: ["inhalational-agents", "intravenous-agents", "muscle-relaxants"], ugModuleRefs: ["AS3"] },
  { id: "pg-ga-02", title: "Airway Management — Difficult Airway, Fiberoptic Intubation", section: "General Anesthesia", subspecialty: "general-anesthesia", topicSlugs: ["airway-assessment", "intubation", "difficult-airway"], ugModuleRefs: ["AS2"] },
  { id: "pg-ga-03", title: "Monitoring — Hemodynamic, Neuro, TEE", section: "General Anesthesia", subspecialty: "general-anesthesia", topicSlugs: ["intraoperative-monitoring"], ugModuleRefs: ["AS5"] },
  { id: "pg-ra-01", title: "Neuraxial & Peripheral Nerve Blocks", section: "Regional Anesthesia", subspecialty: "regional-anesthesia", topicSlugs: ["spinal-anesthesia", "epidural-anesthesia", "nerve-blocks"], ugModuleRefs: ["AS4"] },
  { id: "pg-ra-02", title: "USG-Guided Regional Anesthesia", section: "Regional Anesthesia", subspecialty: "regional-anesthesia", topicSlugs: ["nerve-blocks"], ugModuleRefs: ["AS4"] },
  { id: "pg-cc-01", title: "Critical Care — Sepsis, ARDS, MOF", section: "Critical Care", subspecialty: "critical-care-anesthesia", topicSlugs: ["icu-management", "mechanical-ventilation", "shock-icu"], ugModuleRefs: ["AS7"] },
  { id: "pg-cc-02", title: "Mechanical Ventilation — Modes, Weaning, ECMO", section: "Critical Care", subspecialty: "critical-care-anesthesia", topicSlugs: ["mechanical-ventilation"], ugModuleRefs: ["AS7"] },
  { id: "pg-cc-03", title: "Cardiac, Neuro & Obstetric Anesthesia", section: "Critical Care", subspecialty: "critical-care-anesthesia", topicSlugs: ["obstetric-anesthesia", "pediatric-anesthesia"], ugModuleRefs: ["AS10"] },
  { id: "pg-pain-01", title: "Acute & Chronic Pain Management", section: "Pain Management", subspecialty: "pain-management", topicSlugs: ["acute-pain", "chronic-pain"], ugModuleRefs: ["AS6"] },
  { id: "pg-pain-02", title: "Interventional Pain Procedures & Palliative Care", section: "Pain Management", subspecialty: "pain-management", topicSlugs: ["chronic-pain", "pain-assessment"], ugModuleRefs: ["AS6"] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return ANESTHESIA_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): AnesthesiaUGModule[] {
  return ANESTHESIA_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): AnesthesiaPGTopic[] {
  return ANESTHESIA_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
