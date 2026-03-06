/**
 * NMC CBME — Forensic Medicine Curriculum: Complete UG → PG Mapping
 *
 * UG: 14 modules (FM1–FM14), ~50+ competency codes
 * PG: MD Forensic Medicine
 *
 * Mapped to library content/forensic/ subdirs.
 */

export type ForensicLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface ForensicCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface ForensicUGModule {
  id: string;
  module: string;
  title: string;
  competencies: ForensicCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface ForensicPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface ForensicSubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: ForensicLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const FORENSIC_SUBSPECIALTIES: ForensicSubspecialtyMap[] = [
  { slug: "medical-jurisprudence", name: "Medical Jurisprudence", icon: "⚖️", ugTopicCount: 5, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "thanatology", name: "Thanatology", icon: "💀", ugTopicCount: 4, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "mechanical-injuries", name: "Mechanical Injuries", icon: "🩹", ugTopicCount: 4, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "asphyxia", name: "Asphyxia", icon: "😵", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "sexual-offenses", name: "Sexual Offenses", icon: "🔒", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "forensic-toxicology", name: "Forensic Toxicology", icon: "☠️", ugTopicCount: 6, pgTopicCount: 4, levels: ["UG", "PG"] },
  { slug: "traumatology", name: "Traumatology & Identification", icon: "🔍", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "general-topics", name: "Applied & Clinical FM", icon: "📋", ugTopicCount: 2, pgTopicCount: 2, levels: ["UG", "PG"] },
];

// ─── UG Modules (FM1–FM14) ─────────────────────────────────────────────────

export const FORENSIC_UG_MODULES: ForensicUGModule[] = [
  {
    id: "fm1", module: "FM1", title: "Medical Jurisprudence — Introduction & Legal Procedures",
    subspecialty: "medical-jurisprudence", topicSlugs: ["legal-procedures"],
    competencies: [
      { code: "FM1.1", text: "Describe the legal procedures — inquest, dying declaration, evidence", domain: "KH", isCore: true },
      { code: "FM1.2", text: "Describe the Indian legal system relevant to medical practice", domain: "K", isCore: true },
      { code: "FM1.3", text: "Describe the courts in India and their functions in medico-legal cases", domain: "K", isCore: true },
    ],
  },
  {
    id: "fm2", module: "FM2", title: "Medical Ethics & Professional Conduct",
    subspecialty: "medical-jurisprudence", topicSlugs: ["medical-ethics"],
    competencies: [
      { code: "FM2.1", text: "Describe the duties, rights, privileges and responsibilities of a medical practitioner", domain: "KH", isCore: true },
      { code: "FM2.2", text: "Describe medical negligence — civil and criminal liability, defenses", domain: "KH", isCore: true },
      { code: "FM2.3", text: "Describe informed consent — types, validity, exceptions", domain: "KH", isCore: true },
      { code: "FM2.4", text: "Describe the MCI/NMC code of ethics and professional misconduct", domain: "KH", isCore: true },
      { code: "FM2.5", text: "Describe the Consumer Protection Act and its relevance to medicine", domain: "K", isCore: true },
    ],
  },
  {
    id: "fm3", module: "FM3", title: "Medico-Legal Documentation",
    subspecialty: "medical-jurisprudence", topicSlugs: ["medico-legal-documents"],
    competencies: [
      { code: "FM3.1", text: "Describe the medico-legal documents — wound certificate, death certificate, fitness certificate", domain: "KH", isCore: true },
      { code: "FM3.2", text: "Describe the dying declaration — legal aspects and medical significance", domain: "KH", isCore: true },
      { code: "FM3.3", text: "Prepare a medico-legal report — injury report, postmortem report", domain: "SH", isCore: true },
    ],
  },
  {
    id: "fm4", module: "FM4", title: "Thanatology — Death & Changes After Death",
    subspecialty: "thanatology", topicSlugs: ["death-signs"],
    competencies: [
      { code: "FM4.1", text: "Describe the types and signs of death — somatic, molecular, brain death", domain: "KH", isCore: true },
      { code: "FM4.2", text: "Describe the postmortem changes — cooling, rigor mortis, livor mortis, decomposition", domain: "KH", isCore: true },
      { code: "FM4.3", text: "Estimate the time since death from postmortem changes", domain: "KH", isCore: true },
      { code: "FM4.4", text: "Describe the autopsy — types, objectives, techniques, legal requirements", domain: "KH", isCore: true },
    ],
  },
  {
    id: "fm5", module: "FM5", title: "Cause of Death & Sudden Death",
    subspecialty: "thanatology", topicSlugs: ["cause-of-death"],
    competencies: [
      { code: "FM5.1", text: "Describe the cause of death certification and its importance", domain: "KH", isCore: true },
      { code: "FM5.2", text: "Describe the causes of sudden natural death — cardiac, CNS, respiratory", domain: "KH", isCore: true },
      { code: "FM5.3", text: "Describe the exhumation — indications, procedures, medico-legal importance", domain: "K", isCore: true },
    ],
  },
  {
    id: "fm6", module: "FM6", title: "Mechanical Injuries — Blunt & Sharp Force",
    subspecialty: "mechanical-injuries", topicSlugs: ["blunt-injuries", "sharp-injuries"],
    competencies: [
      { code: "FM6.1", text: "Describe and classify mechanical injuries — abrasion, bruise, laceration, incised wound, stab wound", domain: "KH", isCore: true },
      { code: "FM6.2", text: "Describe the medico-legal importance of injuries — age of wound, cause, nature", domain: "KH", isCore: true },
      { code: "FM6.3", text: "Differentiate between ante-mortem and post-mortem injuries", domain: "KH", isCore: true },
      { code: "FM6.4", text: "Describe injuries caused by different weapons — blunt, sharp, firearm", domain: "KH", isCore: true },
    ],
  },
  {
    id: "fm7", module: "FM7", title: "Regional Injuries & Firearm Injuries",
    subspecialty: "mechanical-injuries", topicSlugs: ["firearm-injuries", "regional-injuries"],
    competencies: [
      { code: "FM7.1", text: "Describe firearm injuries — types, range determination, medico-legal aspects", domain: "KH", isCore: true },
      { code: "FM7.2", text: "Describe the injuries of head, spine, thorax, abdomen — medico-legal aspects", domain: "KH", isCore: true },
      { code: "FM7.3", text: "Describe the injuries caused by explosives and bomb blast", domain: "K", isCore: true },
    ],
  },
  {
    id: "fm8", module: "FM8", title: "Thermal, Electrical & Lightning Injuries",
    subspecialty: "mechanical-injuries", topicSlugs: ["thermal-electrical"],
    competencies: [
      { code: "FM8.1", text: "Describe the medico-legal aspects of burns and scalds", domain: "KH", isCore: true },
      { code: "FM8.2", text: "Describe the medico-legal aspects of electrocution and lightning", domain: "KH", isCore: true },
      { code: "FM8.3", text: "Describe the medico-legal aspects of heat stroke and hypothermia", domain: "K", isCore: true },
    ],
  },
  {
    id: "fm9", module: "FM9", title: "Asphyxia",
    subspecialty: "asphyxia", topicSlugs: ["hanging-strangulation", "drowning", "suffocation"],
    competencies: [
      { code: "FM9.1", text: "Describe the definition, classification and general features of asphyxia", domain: "KH", isCore: true },
      { code: "FM9.2", text: "Describe the medico-legal aspects of hanging — types, postmortem findings", domain: "KH", isCore: true },
      { code: "FM9.3", text: "Describe the medico-legal aspects of strangulation — ligature, manual, bansdola", domain: "KH", isCore: true },
      { code: "FM9.4", text: "Describe the medico-legal aspects of drowning — types, postmortem findings, diatom test", domain: "KH", isCore: true },
      { code: "FM9.5", text: "Describe the medico-legal aspects of suffocation, smothering, gagging, choking", domain: "KH", isCore: true },
      { code: "FM9.6", text: "Describe traumatic asphyxia and postural asphyxia", domain: "K", isCore: true },
    ],
  },
  {
    id: "fm10", module: "FM10", title: "Sexual Offenses",
    subspecialty: "sexual-offenses", topicSlugs: ["sexual-assault", "virginity-potency"],
    competencies: [
      { code: "FM10.1", text: "Describe the medico-legal aspects of sexual offenses — rape, sodomy, incest", domain: "KH", isCore: true },
      { code: "FM10.2", text: "Describe the examination of victim and accused in sexual assault", domain: "KH", isCore: true },
      { code: "FM10.3", text: "Describe the POCSO Act and its medico-legal implications", domain: "KH", isCore: true },
      { code: "FM10.4", text: "Describe the medico-legal aspects of virginity, defloration and pregnancy", domain: "KH", isCore: true },
      { code: "FM10.5", text: "Describe the medico-legal aspects of impotence, sterility and artificial insemination", domain: "K", isCore: true },
    ],
  },
  {
    id: "fm11", module: "FM11", title: "Identification",
    subspecialty: "traumatology", topicSlugs: ["identification-methods"],
    competencies: [
      { code: "FM11.1", text: "Describe the methods of identification — corpus delicti, personal identity", domain: "KH", isCore: true },
      { code: "FM11.2", text: "Describe the identification from skeletal remains — age, sex, race, stature estimation", domain: "KH", isCore: true },
      { code: "FM11.3", text: "Describe DNA fingerprinting and its medico-legal significance", domain: "KH", isCore: true },
      { code: "FM11.4", text: "Describe dactylography (fingerprinting) — types, classification, medico-legal importance", domain: "KH", isCore: true },
    ],
  },
  {
    id: "fm12", module: "FM12", title: "Toxicology — General Principles",
    subspecialty: "forensic-toxicology", topicSlugs: ["general-toxicology"],
    competencies: [
      { code: "FM12.1", text: "Describe the general principles of toxicology — classification, routes, factors affecting toxicity", domain: "KH", isCore: true },
      { code: "FM12.2", text: "Describe the general principles of management of poisoning", domain: "KH", isCore: true },
      { code: "FM12.3", text: "Describe the medico-legal aspects of poisoning — duties of doctor, preservation of evidence", domain: "KH", isCore: true },
    ],
  },
  {
    id: "fm13", module: "FM13", title: "Toxicology — Specific Poisons",
    subspecialty: "forensic-toxicology", topicSlugs: ["corrosive-poisons", "metallic-poisons", "organic-poisons", "gaseous-poisons"],
    competencies: [
      { code: "FM13.1", text: "Describe the toxicology of corrosive poisons — acids, alkalis", domain: "KH", isCore: true },
      { code: "FM13.2", text: "Describe the toxicology of metallic poisons — arsenic, mercury, lead, copper", domain: "KH", isCore: true },
      { code: "FM13.3", text: "Describe the toxicology of phosphorus and its compounds", domain: "KH", isCore: true },
      { code: "FM13.4", text: "Describe the toxicology of organophosphorus compounds and carbamates", domain: "KH", isCore: true },
      { code: "FM13.5", text: "Describe the toxicology of plant poisons — Dhatura, Aconite, Abrus, Oleander", domain: "KH", isCore: true },
      { code: "FM13.6", text: "Describe the toxicology of snake bite — types, clinical features, management", domain: "KH", isCore: true },
      { code: "FM13.7", text: "Describe the toxicology of carbon monoxide, cyanide, and other gases", domain: "KH", isCore: true },
      { code: "FM13.8", text: "Describe the toxicology of alcohol — ethanol, methanol — medico-legal aspects", domain: "KH", isCore: true },
    ],
  },
  {
    id: "fm14", module: "FM14", title: "Toxicology — Drugs of Abuse & Special Topics",
    subspecialty: "forensic-toxicology", topicSlugs: ["drugs-of-abuse"],
    competencies: [
      { code: "FM14.1", text: "Describe the toxicology of drugs of abuse — opioids, cannabis, cocaine, amphetamines", domain: "KH", isCore: true },
      { code: "FM14.2", text: "Describe the toxicology of sedative-hypnotics and antidepressants", domain: "KH", isCore: true },
      { code: "FM14.3", text: "Describe the medico-legal aspects of food poisoning — bacterial, chemical", domain: "KH", isCore: true },
      { code: "FM14.4", text: "Describe the analytical toxicology — methods of detection, preservation of viscera", domain: "KH", isCore: true },
    ],
  },
];

// ─── PG: MD Forensic Medicine Topics ────────────────────────────────────────

export const FORENSIC_PG_TOPICS: ForensicPGTopic[] = [
  { id: "pg-jur-01", title: "Medical Jurisprudence — Legal System, Evidence & Courts", section: "Jurisprudence", subspecialty: "medical-jurisprudence", topicSlugs: ["legal-procedures"], ugModuleRefs: ["FM1"] },
  { id: "pg-jur-02", title: "Medical Ethics, Negligence & Consumer Protection", section: "Jurisprudence", subspecialty: "medical-jurisprudence", topicSlugs: ["medical-ethics"], ugModuleRefs: ["FM2"] },
  { id: "pg-jur-03", title: "Medico-Legal Documentation & Expert Testimony", section: "Jurisprudence", subspecialty: "medical-jurisprudence", topicSlugs: ["medico-legal-documents"], ugModuleRefs: ["FM3"] },
  { id: "pg-death-01", title: "Thanatology — Death, Postmortem Changes & Time Since Death", section: "Forensic Pathology", subspecialty: "thanatology", topicSlugs: ["death-signs"], ugModuleRefs: ["FM4"] },
  { id: "pg-death-02", title: "Autopsy — Techniques, Virtual Autopsy & Cause of Death", section: "Forensic Pathology", subspecialty: "thanatology", topicSlugs: ["cause-of-death"], ugModuleRefs: ["FM4", "FM5"] },
  { id: "pg-inj-01", title: "Mechanical Injuries — Pattern Analysis & Age of Wound", section: "Forensic Pathology", subspecialty: "mechanical-injuries", topicSlugs: ["blunt-injuries", "sharp-injuries"], ugModuleRefs: ["FM6"] },
  { id: "pg-inj-02", title: "Firearm, Explosive & Regional Injuries — Advanced", section: "Forensic Pathology", subspecialty: "mechanical-injuries", topicSlugs: ["firearm-injuries", "regional-injuries"], ugModuleRefs: ["FM7"] },
  { id: "pg-inj-03", title: "Thermal, Electrical & Environmental Injuries", section: "Forensic Pathology", subspecialty: "mechanical-injuries", topicSlugs: ["thermal-electrical"], ugModuleRefs: ["FM8"] },
  { id: "pg-asph-01", title: "Asphyxia — Hanging, Strangulation, Drowning — Advanced", section: "Forensic Pathology", subspecialty: "asphyxia", topicSlugs: ["hanging-strangulation", "drowning"], ugModuleRefs: ["FM9"] },
  { id: "pg-asph-02", title: "Suffocation, Traumatic & Postural Asphyxia", section: "Forensic Pathology", subspecialty: "asphyxia", topicSlugs: ["suffocation"], ugModuleRefs: ["FM9"] },
  { id: "pg-sex-01", title: "Sexual Offenses — Examination, Evidence Collection", section: "Clinical FM", subspecialty: "sexual-offenses", topicSlugs: ["sexual-assault"], ugModuleRefs: ["FM10"] },
  { id: "pg-sex-02", title: "POCSO, Virginity, Potency & Reproductive Medico-Legal Issues", section: "Clinical FM", subspecialty: "sexual-offenses", topicSlugs: ["virginity-potency"], ugModuleRefs: ["FM10"] },
  { id: "pg-id-01", title: "Identification — Skeletal, DNA, Fingerprints — Advanced", section: "Forensic Science", subspecialty: "traumatology", topicSlugs: ["identification-methods"], ugModuleRefs: ["FM11"] },
  { id: "pg-id-02", title: "Forensic Anthropology & Mass Disaster Management", section: "Forensic Science", subspecialty: "traumatology", topicSlugs: ["identification-methods"], ugModuleRefs: ["FM11"] },
  { id: "pg-tox-01", title: "General Toxicology — Principles, Management & Evidence", section: "Toxicology", subspecialty: "forensic-toxicology", topicSlugs: ["general-toxicology"], ugModuleRefs: ["FM12"] },
  { id: "pg-tox-02", title: "Corrosive, Metallic & Agrochemical Poisons — Advanced", section: "Toxicology", subspecialty: "forensic-toxicology", topicSlugs: ["corrosive-poisons", "metallic-poisons"], ugModuleRefs: ["FM13"] },
  { id: "pg-tox-03", title: "Plant & Animal Poisons, Snake Bite — Advanced", section: "Toxicology", subspecialty: "forensic-toxicology", topicSlugs: ["organic-poisons"], ugModuleRefs: ["FM13"] },
  { id: "pg-tox-04", title: "Drugs of Abuse, Analytical Toxicology & Forensic Chemistry", section: "Toxicology", subspecialty: "forensic-toxicology", topicSlugs: ["drugs-of-abuse", "gaseous-poisons"], ugModuleRefs: ["FM13", "FM14"] },
  { id: "pg-app-01", title: "Forensic Psychiatry & Criminal Responsibility", section: "Applied", subspecialty: "general-topics", topicSlugs: [], ugModuleRefs: ["FM2"] },
  { id: "pg-app-02", title: "Research Methodology & Biostatistics in Forensic Medicine", section: "Applied", subspecialty: "general-topics", topicSlugs: [], ugModuleRefs: [] },
];

// ─── Helper functions ────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return FORENSIC_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): ForensicUGModule[] {
  return FORENSIC_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): ForensicPGTopic[] {
  return FORENSIC_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
