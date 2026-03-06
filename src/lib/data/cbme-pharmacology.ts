/**
 * NMC CBME — Pharmacology Curriculum: Complete UG → PG Mapping
 *
 * UG: 5 modules (PH1–PH5), but with many sub-competencies
 * PG: MD Pharmacology
 *
 * Mapped to library content/pharmacology/ subdirs.
 */

export type PharmacologyLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface PharmacologyCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface PharmacologyUGModule {
  id: string;
  module: string;
  title: string;
  competencies: PharmacologyCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface PharmacologyPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface PharmacologySubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: PharmacologyLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const PHARMACOLOGY_SUBSPECIALTIES: PharmacologySubspecialtyMap[] = [
  { slug: "general-pharmacology", name: "General Pharmacology", icon: "💊", ugTopicCount: 8, pgTopicCount: 4, levels: ["UG", "PG"] },
  { slug: "autonomic-pharmacology", name: "Autonomic Pharmacology", icon: "🧬", ugTopicCount: 6, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "cardiovascular-drugs", name: "CVS Drugs", icon: "❤️", ugTopicCount: 5, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "cns-pharmacology", name: "CNS Pharmacology", icon: "🧠", ugTopicCount: 7, pgTopicCount: 4, levels: ["UG", "PG"] },
  { slug: "autacoids-nsaids", name: "Autacoids & NSAIDs", icon: "🔥", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "antimicrobials", name: "Antimicrobials", icon: "🦠", ugTopicCount: 6, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "chemotherapy", name: "Chemotherapy", icon: "💉", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "endocrine-pharmacology", name: "Endocrine Pharmacology", icon: "🦋", ugTopicCount: 4, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "gi-pharmacology", name: "GI Pharmacology", icon: "🟡", ugTopicCount: 2, pgTopicCount: 1, levels: ["UG", "PG"] },
  { slug: "general-topics", name: "Miscellaneous & Applied", icon: "📋", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
];

// ─── UG Modules (PH1–PH5 expanded) ─────────────────────────────────────────

export const PHARMACOLOGY_UG_MODULES: PharmacologyUGModule[] = [
  // ─── PH1: General Pharmacology ───
  {
    id: "ph1a", module: "PH1", title: "General Pharmacology — Pharmacokinetics",
    subspecialty: "general-pharmacology", topicSlugs: ["pharmacokinetics"],
    competencies: [
      { code: "PH1.1", text: "Define and describe the principles of pharmacology and pharmacotherapeutics", domain: "K", isCore: true },
      { code: "PH1.2", text: "Describe the absorption of drugs — routes, factors affecting bioavailability", domain: "KH", isCore: true },
      { code: "PH1.3", text: "Describe the distribution of drugs — volume of distribution, protein binding, barriers", domain: "KH", isCore: true },
      { code: "PH1.4", text: "Describe the metabolism of drugs — phase I, phase II reactions, enzyme induction/inhibition", domain: "KH", isCore: true },
      { code: "PH1.5", text: "Describe the excretion of drugs — renal, biliary, other routes", domain: "KH", isCore: true },
      { code: "PH1.6", text: "Describe the pharmacokinetic parameters — half-life, clearance, steady state", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph1b", module: "PH1", title: "General Pharmacology — Pharmacodynamics",
    subspecialty: "general-pharmacology", topicSlugs: ["pharmacodynamics"],
    competencies: [
      { code: "PH1.7", text: "Describe the drug-receptor interactions — agonist, antagonist, partial agonist", domain: "KH", isCore: true },
      { code: "PH1.8", text: "Describe the dose-response relationship and therapeutic index", domain: "KH", isCore: true },
      { code: "PH1.9", text: "Describe drug interactions — synergism, antagonism, potentiation", domain: "KH", isCore: true },
      { code: "PH1.10", text: "Describe adverse drug reactions — classification, monitoring, reporting", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph1c", module: "PH1", title: "General Pharmacology — Drug Development & Regulations",
    subspecialty: "general-pharmacology", topicSlugs: ["drug-development"],
    competencies: [
      { code: "PH1.11", text: "Describe the process of drug development — preclinical and clinical trials", domain: "K", isCore: true },
      { code: "PH1.12", text: "Describe the principles of prescription writing and drug regulation", domain: "KH", isCore: true },
      { code: "PH1.13", text: "Describe the essential drug concept and rational drug use", domain: "K", isCore: true },
      { code: "PH1.14", text: "Describe the sources of drug information and evidence-based medicine", domain: "K", isCore: true },
    ],
  },
  // ─── PH2: Autonomic Pharmacology ───
  {
    id: "ph2a", module: "PH2", title: "Cholinergic & Anticholinergic Drugs",
    subspecialty: "autonomic-pharmacology", topicSlugs: ["cholinergic-drugs"],
    competencies: [
      { code: "PH2.1", text: "Describe the organization of autonomic nervous system and neurohumoral transmission", domain: "KH", isCore: true },
      { code: "PH2.2", text: "Describe the pharmacology of cholinergic agonists — direct and indirect acting", domain: "KH", isCore: true },
      { code: "PH2.3", text: "Describe the pharmacology of anticholinergic drugs — atropine and its analogues", domain: "KH", isCore: true },
      { code: "PH2.4", text: "Describe the pharmacology of anticholinesterases and their poisoning", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph2b", module: "PH2", title: "Adrenergic Drugs",
    subspecialty: "autonomic-pharmacology", topicSlugs: ["adrenergic-drugs"],
    competencies: [
      { code: "PH2.5", text: "Describe the pharmacology of sympathomimetic drugs — adrenaline, noradrenaline", domain: "KH", isCore: true },
      { code: "PH2.6", text: "Describe the pharmacology of sympatholytic drugs — alpha and beta blockers", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph2c", module: "PH2", title: "Ganglionic & Neuromuscular Blockers",
    subspecialty: "autonomic-pharmacology", topicSlugs: ["ganglionic-nmj"],
    competencies: [
      { code: "PH2.7", text: "Describe the pharmacology of ganglionic stimulants and blockers", domain: "KH", isCore: true },
      { code: "PH2.8", text: "Describe the pharmacology of neuromuscular blocking agents — depolarizing and non-depolarizing", domain: "KH", isCore: true },
      { code: "PH2.9", text: "Describe the pharmacology of skeletal muscle relaxants", domain: "KH", isCore: true },
    ],
  },
  // ─── PH3: Systemic Pharmacology ───
  {
    id: "ph3a", module: "PH3", title: "Autacoids — Histamine, Serotonin & NSAIDs",
    subspecialty: "autacoids-nsaids", topicSlugs: ["autacoids"],
    competencies: [
      { code: "PH3.1", text: "Describe the pharmacology of histamine and antihistaminics — H1 and H2 blockers", domain: "KH", isCore: true },
      { code: "PH3.2", text: "Describe the pharmacology of serotonin and its antagonists", domain: "KH", isCore: true },
      { code: "PH3.3", text: "Describe the pharmacology of prostaglandins, leukotrienes, PAF", domain: "KH", isCore: true },
      { code: "PH3.4", text: "Describe the pharmacology of NSAIDs and antipyretics — aspirin, paracetamol, ibuprofen", domain: "KH", isCore: true },
      { code: "PH3.5", text: "Describe the pharmacology of drugs used in gout — colchicine, allopurinol", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph3b", module: "PH3", title: "CVS Pharmacology — Antihypertensives & Antianginals",
    subspecialty: "cardiovascular-drugs", topicSlugs: ["antihypertensives"],
    competencies: [
      { code: "PH3.6", text: "Describe the pharmacology of drugs used in hypertension — ACEi, ARBs, CCBs, diuretics, beta-blockers", domain: "KH", isCore: true },
      { code: "PH3.7", text: "Describe the pharmacology of drugs used in angina pectoris — nitrates, CCBs, beta-blockers", domain: "KH", isCore: true },
      { code: "PH3.8", text: "Describe the pharmacology of drugs used in heart failure — digoxin, diuretics, ACEi", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph3c", module: "PH3", title: "CVS Pharmacology — Antiarrhythmics & Antithrombotics",
    subspecialty: "cardiovascular-drugs", topicSlugs: ["antiarrhythmics"],
    competencies: [
      { code: "PH3.9", text: "Describe the pharmacology of antiarrhythmic drugs", domain: "KH", isCore: true },
      { code: "PH3.10", text: "Describe the pharmacology of anticoagulants — heparin, warfarin, DOACs", domain: "KH", isCore: true },
      { code: "PH3.11", text: "Describe the pharmacology of antiplatelet drugs — aspirin, clopidogrel", domain: "KH", isCore: true },
      { code: "PH3.12", text: "Describe the pharmacology of fibrinolytics and antifibrinolytics", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph3d", module: "PH3", title: "CVS Pharmacology — Hypolipidemic & Anti-shock Drugs",
    subspecialty: "cardiovascular-drugs", topicSlugs: ["hypolipidemic"],
    competencies: [
      { code: "PH3.13", text: "Describe the pharmacology of hypolipidemic drugs — statins, fibrates", domain: "KH", isCore: true },
      { code: "PH3.14", text: "Describe the pharmacology of drugs used in shock — vasopressors, inotropes", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph3e", module: "PH3", title: "GI Pharmacology",
    subspecialty: "gi-pharmacology", topicSlugs: ["gi-drugs"],
    competencies: [
      { code: "PH3.15", text: "Describe the pharmacology of drugs used in peptic ulcer — PPIs, H2 blockers, antacids", domain: "KH", isCore: true },
      { code: "PH3.16", text: "Describe the pharmacology of antiemetics, prokinetics, laxatives, antidiarrhoeals", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph3f", module: "PH3", title: "Respiratory & Uterine Pharmacology",
    subspecialty: "general-topics", topicSlugs: ["respiratory-drugs"],
    competencies: [
      { code: "PH3.17", text: "Describe the pharmacology of drugs used in bronchial asthma — bronchodilators, corticosteroids", domain: "KH", isCore: true },
      { code: "PH3.18", text: "Describe the pharmacology of drugs used in cough — antitussives, expectorants, mucolytics", domain: "KH", isCore: true },
      { code: "PH3.19", text: "Describe the pharmacology of drugs acting on uterus — oxytocics, tocolytics", domain: "KH", isCore: true },
    ],
  },
  // ─── PH4: CNS Pharmacology ───
  {
    id: "ph4a", module: "PH4", title: "General Anaesthetics & Local Anaesthetics",
    subspecialty: "cns-pharmacology", topicSlugs: ["anaesthetics"],
    competencies: [
      { code: "PH4.1", text: "Describe the pharmacology of general anaesthetics — inhalational and IV agents", domain: "KH", isCore: true },
      { code: "PH4.2", text: "Describe the pharmacology of local anaesthetics", domain: "KH", isCore: true },
      { code: "PH4.3", text: "Describe the pharmacology of pre-anaesthetic medications", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph4b", module: "PH4", title: "Sedative-Hypnotics & Antiepileptics",
    subspecialty: "cns-pharmacology", topicSlugs: ["sedative-hypnotics"],
    competencies: [
      { code: "PH4.4", text: "Describe the pharmacology of sedative-hypnotics — benzodiazepines, barbiturates", domain: "KH", isCore: true },
      { code: "PH4.5", text: "Describe the pharmacology of antiepileptic drugs", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph4c", module: "PH4", title: "Antipsychotics & Antidepressants",
    subspecialty: "cns-pharmacology", topicSlugs: ["psychopharmacology"],
    competencies: [
      { code: "PH4.6", text: "Describe the pharmacology of antipsychotic drugs — typical and atypical", domain: "KH", isCore: true },
      { code: "PH4.7", text: "Describe the pharmacology of antidepressants — TCAs, SSRIs, MAOIs", domain: "KH", isCore: true },
      { code: "PH4.8", text: "Describe the pharmacology of anti-anxiety drugs and lithium", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph4d", module: "PH4", title: "Opioid Analgesics & Anti-Parkinsonian Drugs",
    subspecialty: "cns-pharmacology", topicSlugs: ["opioids-analgesics"],
    competencies: [
      { code: "PH4.9", text: "Describe the pharmacology of opioid analgesics — morphine, codeine, synthetic opioids", domain: "KH", isCore: true },
      { code: "PH4.10", text: "Describe the pharmacology of opioid antagonists — naloxone", domain: "KH", isCore: true },
      { code: "PH4.11", text: "Describe the pharmacology of anti-Parkinsonian drugs — levodopa, dopamine agonists", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph4e", module: "PH4", title: "Alcohol & Drug Dependence",
    subspecialty: "cns-pharmacology", topicSlugs: ["substance-abuse"],
    competencies: [
      { code: "PH4.12", text: "Describe the pharmacology of ethyl alcohol and its clinical significance", domain: "KH", isCore: true },
      { code: "PH4.13", text: "Describe drug dependence, drug abuse and principles of de-addiction", domain: "KH", isCore: true },
    ],
  },
  // ─── PH5: Chemotherapy ───
  {
    id: "ph5a", module: "PH5", title: "Antimicrobials — General Principles & Antibacterials",
    subspecialty: "antimicrobials", topicSlugs: ["antibacterials-general"],
    competencies: [
      { code: "PH5.1", text: "Describe the general principles of chemotherapy — selective toxicity, resistance", domain: "KH", isCore: true },
      { code: "PH5.2", text: "Describe the pharmacology of sulfonamides, trimethoprim and quinolones", domain: "KH", isCore: true },
      { code: "PH5.3", text: "Describe the pharmacology of beta-lactam antibiotics — penicillins, cephalosporins, carbapenems", domain: "KH", isCore: true },
      { code: "PH5.4", text: "Describe the pharmacology of aminoglycosides, tetracyclines, chloramphenicol", domain: "KH", isCore: true },
      { code: "PH5.5", text: "Describe the pharmacology of macrolides, clindamycin, vancomycin, linezolid", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph5b", module: "PH5", title: "Antimicrobials — Antitubercular & Antileprotic",
    subspecialty: "antimicrobials", topicSlugs: ["antitubercular"],
    competencies: [
      { code: "PH5.6", text: "Describe the pharmacology of antitubercular drugs — DOTS regimen", domain: "KH", isCore: true },
      { code: "PH5.7", text: "Describe the pharmacology of antileprotic drugs — MDT regimen", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph5c", module: "PH5", title: "Antimicrobials — Antifungal & Antiviral",
    subspecialty: "antimicrobials", topicSlugs: ["antifungal-antiviral"],
    competencies: [
      { code: "PH5.8", text: "Describe the pharmacology of antifungal drugs — azoles, amphotericin B", domain: "KH", isCore: true },
      { code: "PH5.9", text: "Describe the pharmacology of antiviral drugs — acyclovir, antiretrovirals (ART)", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph5d", module: "PH5", title: "Antimicrobials — Antimalarials & Antiprotozoals",
    subspecialty: "antimicrobials", topicSlugs: ["antimalarials"],
    competencies: [
      { code: "PH5.10", text: "Describe the pharmacology of antimalarial drugs — chloroquine, ACT", domain: "KH", isCore: true },
      { code: "PH5.11", text: "Describe the pharmacology of antiamoebic and antigiardial drugs — metronidazole", domain: "KH", isCore: true },
      { code: "PH5.12", text: "Describe the pharmacology of anthelmintic drugs — albendazole, ivermectin", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph5e", module: "PH5", title: "Anticancer Drugs",
    subspecialty: "chemotherapy", topicSlugs: ["anticancer"],
    competencies: [
      { code: "PH5.13", text: "Describe the general principles of anticancer chemotherapy", domain: "KH", isCore: true },
      { code: "PH5.14", text: "Describe the pharmacology of alkylating agents, antimetabolites, plant alkaloids", domain: "KH", isCore: true },
      { code: "PH5.15", text: "Describe the pharmacology of targeted therapy and immunotherapy in cancer", domain: "K", isCore: true },
    ],
  },
  {
    id: "ph5f", module: "PH5", title: "Immunosuppressants & Immunomodulators",
    subspecialty: "chemotherapy", topicSlugs: ["immunosuppressants"],
    competencies: [
      { code: "PH5.16", text: "Describe the pharmacology of immunosuppressants — cyclosporine, azathioprine, biologicals", domain: "KH", isCore: true },
    ],
  },
  // ─── Endocrine Pharmacology ───
  {
    id: "ph3g", module: "PH3", title: "Endocrine — Insulin & Oral Hypoglycemics",
    subspecialty: "endocrine-pharmacology", topicSlugs: ["antidiabetics"],
    competencies: [
      { code: "PH3.20", text: "Describe the pharmacology of insulin and oral hypoglycemic agents", domain: "KH", isCore: true },
      { code: "PH3.21", text: "Describe the newer antidiabetic drugs — GLP-1 agonists, SGLT2 inhibitors, DPP-4 inhibitors", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph3h", module: "PH3", title: "Endocrine — Thyroid & Corticosteroids",
    subspecialty: "endocrine-pharmacology", topicSlugs: ["thyroid-steroids"],
    competencies: [
      { code: "PH3.22", text: "Describe the pharmacology of thyroid and antithyroid drugs", domain: "KH", isCore: true },
      { code: "PH3.23", text: "Describe the pharmacology of corticosteroids — pharmacological uses, adverse effects", domain: "KH", isCore: true },
      { code: "PH3.24", text: "Describe the pharmacology of sex hormones and oral contraceptives", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ph3i", module: "PH3", title: "Endocrine — Pituitary & Calcium Metabolism",
    subspecialty: "endocrine-pharmacology", topicSlugs: ["pituitary-calcium"],
    competencies: [
      { code: "PH3.25", text: "Describe the pharmacology of anterior and posterior pituitary hormones", domain: "KH", isCore: true },
      { code: "PH3.26", text: "Describe the pharmacology of drugs affecting calcium metabolism — bisphosphonates, calcitonin", domain: "KH", isCore: true },
    ],
  },
  // ─── Applied Pharmacology ───
  {
    id: "ph1d", module: "PH1", title: "Pharmacovigilance & Drug Regulation",
    subspecialty: "general-topics", topicSlugs: ["pharmacovigilance"],
    competencies: [
      { code: "PH1.15", text: "Describe the principles of pharmacovigilance and ADR reporting", domain: "KH", isCore: true },
      { code: "PH1.16", text: "Describe the Drugs and Cosmetics Act and Schedule H drugs", domain: "K", isCore: true },
    ],
  },
  {
    id: "ph1e", module: "PH1", title: "Pharmacogenomics & Therapeutics",
    subspecialty: "general-pharmacology", topicSlugs: ["pharmacogenomics"],
    competencies: [
      { code: "PH1.17", text: "Describe the concept of pharmacogenomics and its therapeutic implications", domain: "K", isCore: true },
      { code: "PH1.18", text: "Describe the principles of drug therapy in special populations — children, elderly, pregnancy, renal/hepatic impairment", domain: "KH", isCore: true },
    ],
  },
];

// ─── PG: MD Pharmacology Topics ─────────────────────────────────────────────

export const PHARMACOLOGY_PG_TOPICS: PharmacologyPGTopic[] = [
  { id: "pg-gen-01", title: "Advanced Pharmacokinetics & Pharmacodynamics", section: "General", subspecialty: "general-pharmacology", topicSlugs: ["pharmacokinetics", "pharmacodynamics"], ugModuleRefs: ["PH1"] },
  { id: "pg-gen-02", title: "Drug Development, Clinical Trials & Bioethics", section: "General", subspecialty: "general-pharmacology", topicSlugs: ["drug-development"], ugModuleRefs: ["PH1"] },
  { id: "pg-gen-03", title: "Pharmacogenomics & Personalized Medicine", section: "General", subspecialty: "general-pharmacology", topicSlugs: ["pharmacogenomics"], ugModuleRefs: ["PH1"] },
  { id: "pg-gen-04", title: "Pharmacovigilance, Drug Regulation & Rational Prescribing", section: "General", subspecialty: "general-pharmacology", topicSlugs: ["pharmacovigilance"], ugModuleRefs: ["PH1"] },
  { id: "pg-ans-01", title: "Autonomic Pharmacology — Cholinergic & Adrenergic Systems", section: "Systemic", subspecialty: "autonomic-pharmacology", topicSlugs: ["cholinergic-drugs", "adrenergic-drugs"], ugModuleRefs: ["PH2"] },
  { id: "pg-ans-02", title: "Neuromuscular Pharmacology & Skeletal Muscle Relaxants", section: "Systemic", subspecialty: "autonomic-pharmacology", topicSlugs: ["ganglionic-nmj"], ugModuleRefs: ["PH2"] },
  { id: "pg-ans-03", title: "Local & Regional Anaesthesia Pharmacology", section: "Systemic", subspecialty: "autonomic-pharmacology", topicSlugs: ["anaesthetics"], ugModuleRefs: ["PH4"] },
  { id: "pg-cvs-01", title: "Antihypertensives, Heart Failure & Antianginals — Advanced", section: "Systemic", subspecialty: "cardiovascular-drugs", topicSlugs: ["antihypertensives"], ugModuleRefs: ["PH3"] },
  { id: "pg-cvs-02", title: "Antiarrhythmics, Anticoagulants & Thrombolytics", section: "Systemic", subspecialty: "cardiovascular-drugs", topicSlugs: ["antiarrhythmics"], ugModuleRefs: ["PH3"] },
  { id: "pg-cvs-03", title: "Hypolipidemic Drugs & Pharmacotherapy of Dyslipidemia", section: "Systemic", subspecialty: "cardiovascular-drugs", topicSlugs: ["hypolipidemic"], ugModuleRefs: ["PH3"] },
  { id: "pg-cns-01", title: "General & Local Anaesthetics — Advanced", section: "Systemic", subspecialty: "cns-pharmacology", topicSlugs: ["anaesthetics"], ugModuleRefs: ["PH4"] },
  { id: "pg-cns-02", title: "Antiepileptics & Sedative-Hypnotics — Mechanisms & Therapeutics", section: "Systemic", subspecialty: "cns-pharmacology", topicSlugs: ["sedative-hypnotics"], ugModuleRefs: ["PH4"] },
  { id: "pg-cns-03", title: "Psychopharmacology — Antipsychotics, Antidepressants, Mood Stabilizers", section: "Systemic", subspecialty: "cns-pharmacology", topicSlugs: ["psychopharmacology"], ugModuleRefs: ["PH4"] },
  { id: "pg-cns-04", title: "Opioids, Anti-Parkinsonian & Substance Abuse Pharmacology", section: "Systemic", subspecialty: "cns-pharmacology", topicSlugs: ["opioids-analgesics", "substance-abuse"], ugModuleRefs: ["PH4"] },
  { id: "pg-aut-01", title: "Autacoids, Prostaglandins & NSAIDs — Advanced", section: "Systemic", subspecialty: "autacoids-nsaids", topicSlugs: ["autacoids"], ugModuleRefs: ["PH3"] },
  { id: "pg-aut-02", title: "Immunopharmacology & Disease-Modifying Agents", section: "Systemic", subspecialty: "autacoids-nsaids", topicSlugs: ["autacoids"], ugModuleRefs: ["PH3", "PH5"] },
  { id: "pg-anti-01", title: "Antibacterial Pharmacology — Advanced Mechanisms & Resistance", section: "Chemotherapy", subspecialty: "antimicrobials", topicSlugs: ["antibacterials-general"], ugModuleRefs: ["PH5"] },
  { id: "pg-anti-02", title: "Antitubercular, Antileprotic & Antimalarial — Regimens", section: "Chemotherapy", subspecialty: "antimicrobials", topicSlugs: ["antitubercular", "antimalarials"], ugModuleRefs: ["PH5"] },
  { id: "pg-anti-03", title: "Antifungal, Antiviral & Antiretroviral Pharmacology", section: "Chemotherapy", subspecialty: "antimicrobials", topicSlugs: ["antifungal-antiviral"], ugModuleRefs: ["PH5"] },
  { id: "pg-chemo-01", title: "Cancer Chemotherapy & Targeted Therapy", section: "Chemotherapy", subspecialty: "chemotherapy", topicSlugs: ["anticancer"], ugModuleRefs: ["PH5"] },
  { id: "pg-chemo-02", title: "Immunosuppressants & Transplant Pharmacology", section: "Chemotherapy", subspecialty: "chemotherapy", topicSlugs: ["immunosuppressants"], ugModuleRefs: ["PH5"] },
  { id: "pg-endo-01", title: "Endocrine Pharmacology — Insulin, Thyroid, Steroids", section: "Systemic", subspecialty: "endocrine-pharmacology", topicSlugs: ["antidiabetics", "thyroid-steroids"], ugModuleRefs: ["PH3"] },
  { id: "pg-endo-02", title: "Reproductive & Pituitary Pharmacology", section: "Systemic", subspecialty: "endocrine-pharmacology", topicSlugs: ["pituitary-calcium"], ugModuleRefs: ["PH3"] },
  { id: "pg-gi-01", title: "GI Pharmacology — Acid Peptic, Emesis, Motility", section: "Systemic", subspecialty: "gi-pharmacology", topicSlugs: ["gi-drugs"], ugModuleRefs: ["PH3"] },
  { id: "pg-misc-01", title: "Respiratory Pharmacology & Uterine Drugs", section: "Systemic", subspecialty: "general-topics", topicSlugs: ["respiratory-drugs"], ugModuleRefs: ["PH3"] },
  { id: "pg-misc-02", title: "Research Methodology in Pharmacology", section: "Research", subspecialty: "general-topics", topicSlugs: [], ugModuleRefs: [] },
];

// ─── Helper functions ────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return PHARMACOLOGY_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): PharmacologyUGModule[] {
  return PHARMACOLOGY_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): PharmacologyPGTopic[] {
  return PHARMACOLOGY_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
