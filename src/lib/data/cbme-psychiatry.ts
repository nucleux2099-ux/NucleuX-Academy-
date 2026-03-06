/**
 * NMC CBME — Psychiatry Curriculum: Complete UG → PG Mapping
 *
 * UG: 19 modules (PS1–PS19), NMC competency codes
 * PG: MD Psychiatry syllabus topics
 */

export type PsychiatryLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface PsychiatryCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface PsychiatryUGModule {
  id: string;
  module: string;
  title: string;
  competencies: PsychiatryCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface PsychiatryPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface PsychiatrySubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: PsychiatryLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const PSYCHIATRY_SUBSPECIALTIES: PsychiatrySubspecialtyMap[] = [
  { slug: "general-psychiatry", name: "General Psychiatry", icon: "🧠", ugTopicCount: 18, pgTopicCount: 5, levels: ["UG", "PG"] },
  { slug: "substance-abuse", name: "Substance Abuse", icon: "🚬", ugTopicCount: 4, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "child-psychiatry", name: "Child & Adolescent Psychiatry", icon: "👶", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "psychopharmacology", name: "Psychopharmacology", icon: "💊", ugTopicCount: 3, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "forensic-psychiatry", name: "Forensic Psychiatry", icon: "⚖️", ugTopicCount: 2, pgTopicCount: 1, levels: ["UG", "PG"] },
];

// ─── UG Modules (PS1–PS19) ──────────────────────────────────────────────────

export const PSYCHIATRY_UG_MODULES: PsychiatryUGModule[] = [
  {
    id: "ps1", module: "PS1", title: "Introduction to Psychiatry",
    subspecialty: "general-psychiatry", topicSlugs: ["classification-psychiatry"],
    competencies: [
      { code: "PS1.1", text: "Describe the growth of psychiatry as a medical specialty, its history and contribution to society", domain: "K", isCore: true },
      { code: "PS1.2", text: "Describe the current classification systems used in psychiatry", domain: "K", isCore: true },
      { code: "PS1.3", text: "Describe and discuss the basic psychological processes: perception, emotion, motivation, learning, memory, thinking", domain: "K", isCore: true },
    ],
  },
  {
    id: "ps2", module: "PS2", title: "Clinical Assessment",
    subspecialty: "general-psychiatry", topicSlugs: ["psychiatric-assessment"],
    competencies: [
      { code: "PS2.1", text: "Describe the components of a psychiatric history and mental status examination", domain: "KH", isCore: true },
      { code: "PS2.2", text: "Elicit, describe and document clinical features in patients with mental disorders", domain: "SH", isCore: true },
      { code: "PS2.3", text: "Perform a mental status examination", domain: "SH", isCore: true },
      { code: "PS2.4", text: "Describe, discuss and distinguish psychotic and non-psychotic disorders", domain: "KH", isCore: true },
      { code: "PS2.5", text: "Enumerate and describe common organic psychiatric disorders", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ps3", module: "PS3", title: "Schizophrenia & Other Psychoses",
    subspecialty: "general-psychiatry", topicSlugs: ["schizophrenia", "psychosis"],
    competencies: [
      { code: "PS3.1", text: "Describe the aetiology, clinical features, course and outcome of schizophrenia", domain: "KH", isCore: true },
      { code: "PS3.2", text: "Enumerate and describe the indications and side effects of commonly used drugs in management of schizophrenia", domain: "KH", isCore: true },
      { code: "PS3.3", text: "Describe the concept of positive and negative symptoms of schizophrenia", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ps4", module: "PS4", title: "Mood Disorders",
    subspecialty: "general-psychiatry", topicSlugs: ["depression", "bipolar-disorder"],
    competencies: [
      { code: "PS4.1", text: "Describe the aetiology, clinical features, course, outcome and management of depressive disorders", domain: "KH", isCore: true },
      { code: "PS4.2", text: "Describe the aetiology, clinical features, course, outcome and management of bipolar disorder", domain: "KH", isCore: true },
      { code: "PS4.3", text: "Describe the indications and side effects of commonly used drugs in mood disorders", domain: "KH", isCore: true },
      { code: "PS4.4", text: "Describe the principles and role of psychosocial interventions in management of mood disorders", domain: "K", isCore: true },
    ],
  },
  {
    id: "ps5", module: "PS5", title: "Anxiety Disorders",
    subspecialty: "general-psychiatry", topicSlugs: ["anxiety-disorders"],
    competencies: [
      { code: "PS5.1", text: "Describe the aetiology, clinical features, course, outcome and management of anxiety disorders", domain: "KH", isCore: true },
      { code: "PS5.2", text: "Describe the role of psychosocial interventions in the management of anxiety disorders", domain: "K", isCore: true },
      { code: "PS5.3", text: "Describe the indications and side effects of commonly used drugs in anxiety disorders", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ps6", module: "PS6", title: "Stress-Related & Somatoform Disorders",
    subspecialty: "general-psychiatry", topicSlugs: ["stress-disorders"],
    competencies: [
      { code: "PS6.1", text: "Describe the clinical features, course, outcome and management of somatoform, dissociative and conversion disorders", domain: "KH", isCore: true },
      { code: "PS6.2", text: "Describe the clinical features, course, outcome and management of stress-related disorders (PTSD, adjustment disorders)", domain: "KH", isCore: true },
      { code: "PS6.3", text: "Describe the clinical features, course, outcome and management of OCD", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ps7", module: "PS7", title: "Personality Disorders",
    subspecialty: "general-psychiatry", topicSlugs: ["personality-disorders"],
    competencies: [
      { code: "PS7.1", text: "Enumerate and classify personality disorders and describe their clinical features", domain: "KH", isCore: true },
      { code: "PS7.2", text: "Describe the principles of management of personality disorders", domain: "K", isCore: true },
    ],
  },
  {
    id: "ps8", module: "PS8", title: "Psychosexual & Gender Identity Disorders",
    subspecialty: "general-psychiatry", topicSlugs: ["psychosexual-disorders"],
    competencies: [
      { code: "PS8.1", text: "Enumerate and describe the clinical features and principles of management of psychosexual and gender identity disorders", domain: "K", isCore: false },
    ],
  },
  {
    id: "ps9", module: "PS9", title: "Psychiatric Emergencies",
    subspecialty: "general-psychiatry", topicSlugs: ["psychiatric-emergencies"],
    competencies: [
      { code: "PS9.1", text: "Enumerate and describe the clinical features and management of psychiatric emergencies — suicide, deliberate self-harm, violence", domain: "KH", isCore: true },
      { code: "PS9.2", text: "Describe the initial management of a patient presenting with deliberate self-harm and suicide", domain: "SH", isCore: true },
    ],
  },
  {
    id: "ps10", module: "PS10", title: "Eating Disorders & Sleep Disorders",
    subspecialty: "general-psychiatry", topicSlugs: ["eating-disorders", "sleep-disorders"],
    competencies: [
      { code: "PS10.1", text: "Describe the clinical features and management of eating disorders", domain: "K", isCore: false },
      { code: "PS10.2", text: "Describe the clinical features and management of sleep disorders", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ps11", module: "PS11", title: "Intellectual Disability",
    subspecialty: "child-psychiatry", topicSlugs: ["intellectual-disability"],
    competencies: [
      { code: "PS11.1", text: "Describe the causes, clinical features, classification and management of intellectual disability", domain: "KH", isCore: true },
      { code: "PS11.2", text: "Enumerate and describe the rights of persons with mental illness", domain: "K", isCore: true },
    ],
  },
  {
    id: "ps12", module: "PS12", title: "Substance Use Disorders",
    subspecialty: "substance-abuse", topicSlugs: ["alcohol-dependence", "opioid-dependence", "tobacco-dependence"],
    competencies: [
      { code: "PS12.1", text: "Describe the aetiology, clinical features, course, outcome and management of alcohol dependence", domain: "KH", isCore: true },
      { code: "PS12.2", text: "Describe the aetiology, clinical features, course, outcome and management of opioid dependence", domain: "KH", isCore: true },
      { code: "PS12.3", text: "Describe the aetiology, clinical features, course, outcome and management of cannabis and other substance dependence", domain: "KH", isCore: true },
      { code: "PS12.4", text: "Describe the aetiology, clinical features, course, outcome and management of tobacco dependence", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ps13", module: "PS13", title: "Psychotherapy",
    subspecialty: "general-psychiatry", topicSlugs: ["psychotherapy"],
    competencies: [
      { code: "PS13.1", text: "Enumerate and describe the principles of various types of psychotherapy", domain: "K", isCore: true },
      { code: "PS13.2", text: "Describe the principles of cognitive behaviour therapy", domain: "K", isCore: true },
      { code: "PS13.3", text: "Describe the principles of group therapy and family therapy", domain: "K", isCore: true },
    ],
  },
  {
    id: "ps14", module: "PS14", title: "Community Psychiatry",
    subspecialty: "general-psychiatry", topicSlugs: ["community-psychiatry"],
    competencies: [
      { code: "PS14.1", text: "Enumerate and describe community mental health programs and describe the role of primary care physician", domain: "K", isCore: true },
      { code: "PS14.2", text: "Describe the National Mental Health Programme", domain: "K", isCore: true },
      { code: "PS14.3", text: "Describe the Mental Health Care Act 2017", domain: "K", isCore: true },
    ],
  },
  {
    id: "ps15", module: "PS15", title: "Geriatric Psychiatry",
    subspecialty: "general-psychiatry", topicSlugs: ["geriatric-psychiatry"],
    competencies: [
      { code: "PS15.1", text: "Describe the clinical features and management of delirium and dementia", domain: "KH", isCore: true },
      { code: "PS15.2", text: "Describe the psychiatric problems seen in the elderly", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ps16", module: "PS16", title: "Child & Adolescent Psychiatry",
    subspecialty: "child-psychiatry", topicSlugs: ["adhd", "autism-spectrum"],
    competencies: [
      { code: "PS16.1", text: "Describe the common psychiatric disorders in children and adolescents — ADHD, autism, conduct disorder", domain: "KH", isCore: true },
      { code: "PS16.2", text: "Describe the principles of management of common child psychiatric disorders", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ps17", module: "PS17", title: "Psychopharmacology",
    subspecialty: "psychopharmacology", topicSlugs: ["antipsychotics", "antidepressants", "anxiolytics"],
    competencies: [
      { code: "PS17.1", text: "Enumerate and describe the principles of psychopharmacology", domain: "KH", isCore: true },
      { code: "PS17.2", text: "Describe the indications, mechanism of action, side effects of commonly used antipsychotics", domain: "KH", isCore: true },
      { code: "PS17.3", text: "Describe the indications, mechanism of action, side effects of commonly used antidepressants", domain: "KH", isCore: true },
    ],
  },
  {
    id: "ps18", module: "PS18", title: "Forensic Psychiatry",
    subspecialty: "forensic-psychiatry", topicSlugs: ["forensic-psychiatry-topics"],
    competencies: [
      { code: "PS18.1", text: "Describe the concepts of criminal responsibility and fitness to stand trial", domain: "K", isCore: true },
      { code: "PS18.2", text: "Describe the Mental Health Care Act 2017 and its implications", domain: "K", isCore: true },
    ],
  },
  {
    id: "ps19", module: "PS19", title: "Liaison Psychiatry",
    subspecialty: "general-psychiatry", topicSlugs: ["consultation-liaison"],
    competencies: [
      { code: "PS19.1", text: "Describe the role of psychiatrist in consultation-liaison services", domain: "K", isCore: true },
      { code: "PS19.2", text: "Describe the psychiatric aspects of medical and surgical conditions", domain: "KH", isCore: true },
      { code: "PS19.3", text: "Describe the role of psychiatry in palliative care and chronic illness", domain: "K", isCore: true },
    ],
  },
];

// ─── PG: MD Psychiatry Syllabus Topics ───────────────────────────────────────

export const PSYCHIATRY_PG_TOPICS: PsychiatryPGTopic[] = [
  { id: "pg-gen-01", title: "Psychoses — Schizophrenia, Delusional Disorders", section: "Clinical Psychiatry", subspecialty: "general-psychiatry", topicSlugs: ["schizophrenia", "psychosis"], ugModuleRefs: ["PS3"] },
  { id: "pg-gen-02", title: "Mood Disorders — Unipolar & Bipolar", section: "Clinical Psychiatry", subspecialty: "general-psychiatry", topicSlugs: ["depression", "bipolar-disorder"], ugModuleRefs: ["PS4"] },
  { id: "pg-gen-03", title: "Anxiety, OCD & Stress Disorders", section: "Clinical Psychiatry", subspecialty: "general-psychiatry", topicSlugs: ["anxiety-disorders", "stress-disorders"], ugModuleRefs: ["PS5", "PS6"] },
  { id: "pg-gen-04", title: "Personality Disorders & Psychotherapy", section: "Clinical Psychiatry", subspecialty: "general-psychiatry", topicSlugs: ["personality-disorders", "psychotherapy"], ugModuleRefs: ["PS7", "PS13"] },
  { id: "pg-gen-05", title: "Geriatric Psychiatry — Dementia, Delirium", section: "Clinical Psychiatry", subspecialty: "general-psychiatry", topicSlugs: ["geriatric-psychiatry"], ugModuleRefs: ["PS15"] },
  { id: "pg-sub-01", title: "Substance Abuse — Alcohol, Opioids, Tobacco", section: "Substance Abuse", subspecialty: "substance-abuse", topicSlugs: ["alcohol-dependence", "opioid-dependence"], ugModuleRefs: ["PS12"] },
  { id: "pg-sub-02", title: "De-addiction & Harm Reduction Strategies", section: "Substance Abuse", subspecialty: "substance-abuse", topicSlugs: ["tobacco-dependence"], ugModuleRefs: ["PS12"] },
  { id: "pg-child-01", title: "Child & Adolescent Psychiatric Disorders", section: "Child Psychiatry", subspecialty: "child-psychiatry", topicSlugs: ["adhd", "autism-spectrum"], ugModuleRefs: ["PS16"] },
  { id: "pg-child-02", title: "Intellectual Disability & Neurodevelopmental Disorders", section: "Child Psychiatry", subspecialty: "child-psychiatry", topicSlugs: ["intellectual-disability"], ugModuleRefs: ["PS11"] },
  { id: "pg-pharm-01", title: "Clinical Psychopharmacology — Antipsychotics, Antidepressants, Mood Stabilizers", section: "Psychopharmacology", subspecialty: "psychopharmacology", topicSlugs: ["antipsychotics", "antidepressants"], ugModuleRefs: ["PS17"] },
  { id: "pg-pharm-02", title: "ECT & Brain Stimulation Therapies", section: "Psychopharmacology", subspecialty: "psychopharmacology", topicSlugs: ["anxiolytics"], ugModuleRefs: ["PS17"] },
  { id: "pg-forensic-01", title: "Forensic Psychiatry & Mental Health Legislation", section: "Forensic Psychiatry", subspecialty: "forensic-psychiatry", topicSlugs: ["forensic-psychiatry-topics"], ugModuleRefs: ["PS18"] },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return PSYCHIATRY_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): PsychiatryUGModule[] {
  return PSYCHIATRY_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): PsychiatryPGTopic[] {
  return PSYCHIATRY_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
