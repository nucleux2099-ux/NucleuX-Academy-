/**
 * NMC CBME — Pediatrics Curriculum: Complete UG → PG → SS Mapping
 *
 * UG: 34 modules (PE1–PE34)
 * PG: MD Pediatrics systemic topics
 * SS: DM super-specialty curricula
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type PediatricsLevel = "UG" | "PG" | "SS";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface PediatricsCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface PediatricsUGModule {
  id: string;
  module: string;
  title: string;
  competencies: PediatricsCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface PediatricsPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface PediatricsSSTopic {
  id: string;
  degree: "DM";
  specialty: string;
  title: string;
  subspecialty: string;
  topicSlugs: string[];
  pgTopicRefs: string[];
}

export interface PediatricsSubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  ssTopicCount: number;
  levels: PediatricsLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const PEDIATRICS_SUBSPECIALTIES: PediatricsSubspecialtyMap[] = [
  { slug: "general-topics", name: "General Topics", icon: "📋", ugTopicCount: 5, pgTopicCount: 4, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "growth-development", name: "Growth & Development", icon: "📏", ugTopicCount: 8, pgTopicCount: 5, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "neonatology", name: "Neonatology", icon: "👶", ugTopicCount: 10, pgTopicCount: 7, ssTopicCount: 8, levels: ["UG", "PG", "SS"] },
  { slug: "pediatric-nutrition", name: "Nutrition", icon: "🥗", ugTopicCount: 6, pgTopicCount: 4, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "pediatric-infections", name: "Infectious Diseases", icon: "🦠", ugTopicCount: 10, pgTopicCount: 6, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "pediatric-respiratory", name: "Respiratory", icon: "🫁", ugTopicCount: 4, pgTopicCount: 4, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "pediatric-cardiology", name: "Cardiology", icon: "❤️", ugTopicCount: 4, pgTopicCount: 4, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "pediatric-gi", name: "Gastroenterology", icon: "🟡", ugTopicCount: 4, pgTopicCount: 4, ssTopicCount: 4, levels: ["UG", "PG", "SS"] },
  { slug: "pediatric-neurology", name: "Neurology", icon: "🧠", ugTopicCount: 5, pgTopicCount: 5, ssTopicCount: 5, levels: ["UG", "PG", "SS"] },
  { slug: "infectious-diseases", name: "Immunization & Prevention", icon: "💉", ugTopicCount: 4, pgTopicCount: 3, ssTopicCount: 0, levels: ["UG", "PG"] },
];

// ─── UG Modules (PE1–PE34) ──────────────────────────────────────────────────

export const PEDIATRICS_UG_MODULES: PediatricsUGModule[] = [
  {
    id: "pe1", module: "PE1", title: "Introduction to Pediatrics",
    subspecialty: "general-topics", topicSlugs: ["pediatric-history"],
    competencies: [
      { code: "PE1.1", text: "Define the age groups of children and discuss the unique aspects of pediatrics", domain: "K", isCore: true },
      { code: "PE1.2", text: "Discuss the common morbidity and mortality data in children", domain: "K", isCore: true },
      { code: "PE1.3", text: "Discuss the National Health Programs related to child health (RBSK, JSSK, NHM)", domain: "K", isCore: true },
      { code: "PE1.4", text: "Elicit, document and present a pediatric history", domain: "SH", isCore: true },
    ],
  },
  {
    id: "pe2", module: "PE2", title: "Growth",
    subspecialty: "growth-development", topicSlugs: ["growth-assessment"],
    competencies: [
      { code: "PE2.1", text: "Discuss the normal growth in infants and children", domain: "K", isCore: true },
      { code: "PE2.2", text: "Assess growth using growth charts (WHO, IAP)", domain: "SH", isCore: true },
      { code: "PE2.3", text: "Discuss the etiology and approach to a child with short stature", domain: "K", isCore: true },
      { code: "PE2.4", text: "Discuss the etiology and approach to a child with failure to thrive", domain: "K", isCore: true },
    ],
  },
  {
    id: "pe3", module: "PE3", title: "Development",
    subspecialty: "growth-development", topicSlugs: ["developmental-milestones"],
    competencies: [
      { code: "PE3.1", text: "Discuss the normal developmental milestones — motor, language, social, adaptive", domain: "K", isCore: true },
      { code: "PE3.2", text: "Assessment of developmental delay using screening tools", domain: "SH", isCore: true },
      { code: "PE3.3", text: "Discuss the approach to a child with developmental delay and intellectual disability", domain: "K", isCore: true },
    ],
  },
  {
    id: "pe4", module: "PE4", title: "Adolescent Health",
    subspecialty: "growth-development", topicSlugs: ["adolescent-health"],
    competencies: [
      { code: "PE4.1", text: "Discuss the common problems of adolescence including nutritional, psychosocial, menstrual", domain: "K", isCore: true },
      { code: "PE4.2", text: "Discuss the Adolescent Health Programme (RKSK)", domain: "K", isCore: true },
    ],
  },
  {
    id: "pe5", module: "PE5", title: "Immunization",
    subspecialty: "infectious-diseases", topicSlugs: ["immunization-schedule"],
    competencies: [
      { code: "PE5.1", text: "Discuss the National Immunization Schedule and vaccines used", domain: "KH", isCore: true },
      { code: "PE5.2", text: "Discuss the adverse effects of vaccines and contraindications", domain: "KH", isCore: true },
      { code: "PE5.3", text: "Discuss the cold chain management and AEFI surveillance", domain: "K", isCore: true },
      { code: "PE5.4", text: "Administer vaccines using correct technique (IM, SC, ID, oral)", domain: "SH", isCore: true },
    ],
  },
  {
    id: "pe6", module: "PE6", title: "Infant & Young Child Nutrition",
    subspecialty: "pediatric-nutrition", topicSlugs: ["infant-feeding", "breastfeeding"],
    competencies: [
      { code: "PE6.1", text: "Discuss breastfeeding — physiology, advantages, technique, problems", domain: "KH", isCore: true },
      { code: "PE6.2", text: "Discuss complementary feeding — timing, types, frequency", domain: "KH", isCore: true },
      { code: "PE6.3", text: "Counsel a mother on breastfeeding technique and problems", domain: "SH", isCore: true },
    ],
  },
  {
    id: "pe7", module: "PE7", title: "Protein Energy Malnutrition",
    subspecialty: "pediatric-nutrition", topicSlugs: ["pem", "sam"],
    competencies: [
      { code: "PE7.1", text: "Discuss the etiology, classification, clinical features and management of PEM", domain: "KH", isCore: true },
      { code: "PE7.2", text: "Discuss the WHO 10-step management of severe acute malnutrition", domain: "KH", isCore: true },
      { code: "PE7.3", text: "Identify and manage a child with SAM using facility-based care", domain: "SH", isCore: true },
    ],
  },
  {
    id: "pe8", module: "PE8", title: "Micronutrient Deficiencies",
    subspecialty: "pediatric-nutrition", topicSlugs: ["vitamin-deficiency"],
    competencies: [
      { code: "PE8.1", text: "Discuss the clinical features, diagnosis and management of Vitamin A deficiency", domain: "KH", isCore: true },
      { code: "PE8.2", text: "Discuss the clinical features, diagnosis and management of Vitamin D deficiency (rickets)", domain: "KH", isCore: true },
      { code: "PE8.3", text: "Discuss the clinical features, diagnosis and management of iron deficiency anemia in children", domain: "KH", isCore: true },
      { code: "PE8.4", text: "Discuss zinc and iodine deficiency disorders in children", domain: "K", isCore: true },
    ],
  },
  {
    id: "pe9", module: "PE9", title: "Newborn Care — Normal",
    subspecialty: "neonatology", topicSlugs: ["newborn-care"],
    competencies: [
      { code: "PE9.1", text: "Discuss the essential newborn care — immediate care at birth", domain: "KH", isCore: true },
      { code: "PE9.2", text: "Perform newborn examination and identify common abnormalities", domain: "SH", isCore: true },
      { code: "PE9.3", text: "Discuss the assessment of gestational age (Ballard score)", domain: "SH", isCore: true },
      { code: "PE9.4", text: "Counsel parents regarding newborn care — warmth, feeding, hygiene", domain: "SH", isCore: true },
    ],
  },
  {
    id: "pe10", module: "PE10", title: "Neonatal Resuscitation",
    subspecialty: "neonatology", topicSlugs: ["neonatal-resuscitation"],
    competencies: [
      { code: "PE10.1", text: "Discuss the principles and steps of neonatal resuscitation (NRP)", domain: "KH", isCore: true },
      { code: "PE10.2", text: "Perform bag and mask ventilation on a mannequin", domain: "SH", isCore: true },
    ],
  },
  {
    id: "pe11", module: "PE11", title: "Low Birth Weight & Prematurity",
    subspecialty: "neonatology", topicSlugs: ["lbw-prematurity"],
    competencies: [
      { code: "PE11.1", text: "Discuss the etiology, complications and management of low birth weight and preterm babies", domain: "KH", isCore: true },
      { code: "PE11.2", text: "Discuss kangaroo mother care", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe12", module: "PE12", title: "Neonatal Jaundice",
    subspecialty: "neonatology", topicSlugs: ["neonatal-jaundice"],
    competencies: [
      { code: "PE12.1", text: "Discuss the etiology, clinical features, diagnosis and management of neonatal jaundice", domain: "KH", isCore: true },
      { code: "PE12.2", text: "Discuss the indications for phototherapy and exchange transfusion", domain: "KH", isCore: true },
      { code: "PE12.3", text: "Identify pathological jaundice and differentiate from physiological", domain: "SH", isCore: true },
    ],
  },
  {
    id: "pe13", module: "PE13", title: "Neonatal Sepsis",
    subspecialty: "neonatology", topicSlugs: ["neonatal-sepsis"],
    competencies: [
      { code: "PE13.1", text: "Discuss the etiology, risk factors, clinical features, diagnosis and management of neonatal sepsis", domain: "KH", isCore: true },
      { code: "PE13.2", text: "Discuss the approach to a neonate with suspected infection — sepsis screen", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe14", module: "PE14", title: "Birth Asphyxia & HIE",
    subspecialty: "neonatology", topicSlugs: ["birth-asphyxia"],
    competencies: [
      { code: "PE14.1", text: "Discuss the etiology, clinical features and management of birth asphyxia and hypoxic-ischemic encephalopathy", domain: "KH", isCore: true },
      { code: "PE14.2", text: "Discuss the Apgar scoring system and its significance", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe15", module: "PE15", title: "Congenital Malformations",
    subspecialty: "neonatology", topicSlugs: ["congenital-anomalies"],
    competencies: [
      { code: "PE15.1", text: "Discuss the common congenital malformations — cleft lip/palate, TEF, CDH, neural tube defects", domain: "K", isCore: true },
      { code: "PE15.2", text: "Discuss the approach to a newborn with suspected congenital anomaly", domain: "K", isCore: true },
    ],
  },
  {
    id: "pe16", module: "PE16", title: "Respiratory Distress in Newborn",
    subspecialty: "neonatology", topicSlugs: ["rds-newborn"],
    competencies: [
      { code: "PE16.1", text: "Discuss the etiology, clinical features, diagnosis and management of respiratory distress syndrome", domain: "KH", isCore: true },
      { code: "PE16.2", text: "Discuss the etiology and management of transient tachypnea of newborn and meconium aspiration", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe17", module: "PE17", title: "Diarrheal Diseases",
    subspecialty: "pediatric-gi", topicSlugs: ["diarrhea-dehydration"],
    competencies: [
      { code: "PE17.1", text: "Discuss the etiology, clinical features and management of acute diarrhea", domain: "KH", isCore: true },
      { code: "PE17.2", text: "Classify dehydration and plan management using WHO plan A/B/C", domain: "SH", isCore: true },
      { code: "PE17.3", text: "Prepare and administer ORS", domain: "P", isCore: true },
      { code: "PE17.4", text: "Discuss the approach to persistent and chronic diarrhea in children", domain: "K", isCore: true },
    ],
  },
  {
    id: "pe18", module: "PE18", title: "Acute Respiratory Infections",
    subspecialty: "pediatric-respiratory", topicSlugs: ["pneumonia-children"],
    competencies: [
      { code: "PE18.1", text: "Discuss the etiology, clinical features, classification and management of pneumonia in children (IMNCI approach)", domain: "KH", isCore: true },
      { code: "PE18.2", text: "Discuss the etiology and management of bronchiolitis", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe19", module: "PE19", title: "Childhood Asthma",
    subspecialty: "pediatric-respiratory", topicSlugs: ["asthma-children"],
    competencies: [
      { code: "PE19.1", text: "Discuss the etiology, clinical features, diagnosis and management of childhood asthma", domain: "KH", isCore: true },
      { code: "PE19.2", text: "Demonstrate the use of inhaler devices and spacers", domain: "SH", isCore: true },
    ],
  },
  {
    id: "pe20", module: "PE20", title: "Common Childhood Infections",
    subspecialty: "pediatric-infections", topicSlugs: ["exanthems", "measles", "varicella"],
    competencies: [
      { code: "PE20.1", text: "Discuss the clinical features, diagnosis and management of common exanthematous fevers (measles, rubella, varicella, scarlet fever)", domain: "KH", isCore: true },
      { code: "PE20.2", text: "Discuss the complications of measles and their management", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe21", module: "PE21", title: "Tuberculosis in Children",
    subspecialty: "pediatric-infections", topicSlugs: ["tb-children"],
    competencies: [
      { code: "PE21.1", text: "Discuss the clinical features, diagnosis and management of tuberculosis in children", domain: "KH", isCore: true },
      { code: "PE21.2", text: "Discuss the NTEP guidelines for pediatric TB treatment", domain: "KH", isCore: true },
      { code: "PE21.3", text: "Perform and interpret a tuberculin skin test", domain: "SH", isCore: true },
    ],
  },
  {
    id: "pe22", module: "PE22", title: "HIV in Children",
    subspecialty: "pediatric-infections", topicSlugs: ["hiv-children"],
    competencies: [
      { code: "PE22.1", text: "Discuss the clinical features, diagnosis and management of HIV in children", domain: "K", isCore: true },
      { code: "PE22.2", text: "Discuss prevention of mother-to-child transmission (PMTCT)", domain: "K", isCore: true },
    ],
  },
  {
    id: "pe23", module: "PE23", title: "Malaria & Dengue in Children",
    subspecialty: "pediatric-infections", topicSlugs: ["malaria-children", "dengue-children"],
    competencies: [
      { code: "PE23.1", text: "Discuss the clinical features, diagnosis and management of malaria in children", domain: "KH", isCore: true },
      { code: "PE23.2", text: "Discuss the clinical features, diagnosis and management of dengue in children", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe24", module: "PE24", title: "Congenital Heart Disease",
    subspecialty: "pediatric-cardiology", topicSlugs: ["chd-acyanotic", "chd-cyanotic"],
    competencies: [
      { code: "PE24.1", text: "Discuss the clinical features, diagnosis and management of common acyanotic CHD (VSD, ASD, PDA)", domain: "K", isCore: true },
      { code: "PE24.2", text: "Discuss the clinical features, diagnosis and management of common cyanotic CHD (TOF)", domain: "K", isCore: true },
      { code: "PE24.3", text: "Discuss the approach to a child with heart murmur", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe25", module: "PE25", title: "Rheumatic Fever & RHD",
    subspecialty: "pediatric-cardiology", topicSlugs: ["rheumatic-fever"],
    competencies: [
      { code: "PE25.1", text: "Discuss the etiology, clinical features (Jones criteria), diagnosis and management of acute rheumatic fever", domain: "KH", isCore: true },
      { code: "PE25.2", text: "Discuss secondary prophylaxis for rheumatic fever", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe26", module: "PE26", title: "Nephrotic Syndrome",
    subspecialty: "pediatric-gi", topicSlugs: ["nephrotic-syndrome-children"],
    competencies: [
      { code: "PE26.1", text: "Discuss the etiology, clinical features, diagnosis and management of nephrotic syndrome in children", domain: "KH", isCore: true },
      { code: "PE26.2", text: "Discuss the complications and relapse management of nephrotic syndrome", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe27", module: "PE27", title: "UTI in Children",
    subspecialty: "pediatric-gi", topicSlugs: ["uti-children"],
    competencies: [
      { code: "PE27.1", text: "Discuss the etiology, clinical features, diagnosis and management of UTI in children", domain: "KH", isCore: true },
      { code: "PE27.2", text: "Discuss vesicoureteral reflux and its significance in children", domain: "K", isCore: true },
    ],
  },
  {
    id: "pe28", module: "PE28", title: "Seizures & Epilepsy in Children",
    subspecialty: "pediatric-neurology", topicSlugs: ["seizures-children"],
    competencies: [
      { code: "PE28.1", text: "Discuss the etiology, classification and management of seizures in children", domain: "KH", isCore: true },
      { code: "PE28.2", text: "Discuss the approach to a child with febrile seizures", domain: "KH", isCore: true },
      { code: "PE28.3", text: "Discuss the management of status epilepticus in children", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe29", module: "PE29", title: "CNS Infections in Children",
    subspecialty: "pediatric-neurology", topicSlugs: ["meningitis-children"],
    competencies: [
      { code: "PE29.1", text: "Discuss the etiology, clinical features, diagnosis and management of meningitis in children", domain: "KH", isCore: true },
      { code: "PE29.2", text: "Discuss the approach to CSF analysis in suspected meningitis", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe30", module: "PE30", title: "Hematology — Anemia & Thalassemia",
    subspecialty: "general-topics", topicSlugs: ["anemia-children", "thalassemia"],
    competencies: [
      { code: "PE30.1", text: "Discuss the etiology, clinical features, diagnosis and management of anemia in children", domain: "KH", isCore: true },
      { code: "PE30.2", text: "Discuss the clinical features, diagnosis and management of thalassemia", domain: "KH", isCore: true },
      { code: "PE30.3", text: "Discuss sickle cell disease — clinical features, crisis management", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe31", module: "PE31", title: "Childhood Malignancies",
    subspecialty: "general-topics", topicSlugs: ["childhood-cancers"],
    competencies: [
      { code: "PE31.1", text: "Discuss the common childhood malignancies — ALL, Wilms tumor, neuroblastoma, retinoblastoma", domain: "K", isCore: true },
      { code: "PE31.2", text: "Discuss the approach to a child with lymphadenopathy and hepatosplenomegaly", domain: "K", isCore: true },
    ],
  },
  {
    id: "pe32", module: "PE32", title: "Pediatric Emergencies",
    subspecialty: "general-topics", topicSlugs: ["pediatric-emergencies"],
    competencies: [
      { code: "PE32.1", text: "Discuss the approach to a critically ill child — pediatric BLS and PALS", domain: "KH", isCore: true },
      { code: "PE32.2", text: "Discuss fluid resuscitation and shock management in children", domain: "KH", isCore: true },
      { code: "PE32.3", text: "Discuss the management of acute poisoning in children", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pe33", module: "PE33", title: "Genetic & Metabolic Disorders",
    subspecialty: "general-topics", topicSlugs: ["genetic-disorders"],
    competencies: [
      { code: "PE33.1", text: "Discuss the approach to a child with suspected genetic/chromosomal disorder (Down syndrome, Turner)", domain: "K", isCore: true },
      { code: "PE33.2", text: "Discuss the approach to inborn errors of metabolism — newborn screening", domain: "K", isCore: true },
    ],
  },
  {
    id: "pe34", module: "PE34", title: "Behavioral & Neurodevelopmental Disorders",
    subspecialty: "pediatric-neurology", topicSlugs: ["autism", "adhd"],
    competencies: [
      { code: "PE34.1", text: "Discuss the clinical features, diagnosis and management of autism spectrum disorder", domain: "K", isCore: true },
      { code: "PE34.2", text: "Discuss the clinical features, diagnosis and management of ADHD", domain: "K", isCore: true },
      { code: "PE34.3", text: "Discuss the approach to a child with learning disability and cerebral palsy", domain: "K", isCore: true },
    ],
  },
];

// ─── PG: MD Pediatrics Topics ────────────────────────────────────────────────

export const PEDIATRICS_PG_TOPICS: PediatricsPGTopic[] = [
  // General
  { id: "pg-gen-01", title: "History, Examination & Approach to Common Symptoms", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["pediatric-history"], ugModuleRefs: ["PE1"] },
  { id: "pg-gen-02", title: "Pediatric Hematology — Anemia, Thalassemia, Leukemia", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["anemia-children", "thalassemia", "childhood-cancers"], ugModuleRefs: ["PE30", "PE31"] },
  { id: "pg-gen-03", title: "Pediatric Emergencies & PALS", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["pediatric-emergencies"], ugModuleRefs: ["PE32"] },
  { id: "pg-gen-04", title: "Genetics & Inborn Errors of Metabolism", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["genetic-disorders"], ugModuleRefs: ["PE33"] },

  // Growth & Development
  { id: "pg-gd-01", title: "Growth Assessment & Short Stature", section: "Growth & Development", subspecialty: "growth-development", topicSlugs: ["growth-assessment"], ugModuleRefs: ["PE2"] },
  { id: "pg-gd-02", title: "Developmental Assessment & Delay", section: "Growth & Development", subspecialty: "growth-development", topicSlugs: ["developmental-milestones"], ugModuleRefs: ["PE3"] },
  { id: "pg-gd-03", title: "Adolescent Health & RKSK", section: "Growth & Development", subspecialty: "growth-development", topicSlugs: ["adolescent-health"], ugModuleRefs: ["PE4"] },
  { id: "pg-gd-04", title: "Behavioral Pediatrics — ASD, ADHD, Cerebral Palsy", section: "Growth & Development", subspecialty: "growth-development", topicSlugs: ["autism", "adhd"], ugModuleRefs: ["PE34"] },
  { id: "pg-gd-05", title: "Early Intervention & Developmental Therapy", section: "Growth & Development", subspecialty: "growth-development", topicSlugs: ["early-intervention"], ugModuleRefs: ["PE3"] },

  // Neonatology
  { id: "pg-neo-01", title: "Essential Newborn Care & Examination", section: "Neonatology", subspecialty: "neonatology", topicSlugs: ["newborn-care"], ugModuleRefs: ["PE9"] },
  { id: "pg-neo-02", title: "Neonatal Resuscitation — NRP", section: "Neonatology", subspecialty: "neonatology", topicSlugs: ["neonatal-resuscitation"], ugModuleRefs: ["PE10"] },
  { id: "pg-neo-03", title: "Prematurity & LBW Management", section: "Neonatology", subspecialty: "neonatology", topicSlugs: ["lbw-prematurity"], ugModuleRefs: ["PE11"] },
  { id: "pg-neo-04", title: "Neonatal Jaundice — Phototherapy & Exchange Transfusion", section: "Neonatology", subspecialty: "neonatology", topicSlugs: ["neonatal-jaundice"], ugModuleRefs: ["PE12"] },
  { id: "pg-neo-05", title: "Neonatal Sepsis — Early & Late Onset", section: "Neonatology", subspecialty: "neonatology", topicSlugs: ["neonatal-sepsis"], ugModuleRefs: ["PE13"] },
  { id: "pg-neo-06", title: "Birth Asphyxia & HIE — Therapeutic Hypothermia", section: "Neonatology", subspecialty: "neonatology", topicSlugs: ["birth-asphyxia"], ugModuleRefs: ["PE14"] },
  { id: "pg-neo-07", title: "Neonatal Respiratory Disorders — RDS, MAS, TTN", section: "Neonatology", subspecialty: "neonatology", topicSlugs: ["rds-newborn"], ugModuleRefs: ["PE16"] },

  // Nutrition
  { id: "pg-nut-01", title: "Breastfeeding & Infant Feeding", section: "Nutrition", subspecialty: "pediatric-nutrition", topicSlugs: ["infant-feeding", "breastfeeding"], ugModuleRefs: ["PE6"] },
  { id: "pg-nut-02", title: "SAM Management — Facility & Community Based", section: "Nutrition", subspecialty: "pediatric-nutrition", topicSlugs: ["pem", "sam"], ugModuleRefs: ["PE7"] },
  { id: "pg-nut-03", title: "Micronutrient Deficiencies & Supplementation", section: "Nutrition", subspecialty: "pediatric-nutrition", topicSlugs: ["vitamin-deficiency"], ugModuleRefs: ["PE8"] },
  { id: "pg-nut-04", title: "Childhood Obesity & Metabolic Syndrome", section: "Nutrition", subspecialty: "pediatric-nutrition", topicSlugs: ["childhood-obesity"], ugModuleRefs: [] },

  // Infections
  { id: "pg-inf-01", title: "Immunization — Current Schedule & New Vaccines", section: "Infectious Diseases", subspecialty: "infectious-diseases", topicSlugs: ["immunization-schedule"], ugModuleRefs: ["PE5"] },
  { id: "pg-inf-02", title: "Vaccine-Preventable Diseases & Exanthems", section: "Infectious Diseases", subspecialty: "infectious-diseases", topicSlugs: ["exanthems", "measles"], ugModuleRefs: ["PE20"] },
  { id: "pg-inf-03", title: "IMNCI — Integrated Management of Childhood Illness", section: "Infectious Diseases", subspecialty: "infectious-diseases", topicSlugs: ["imnci"], ugModuleRefs: ["PE5"] },
  { id: "pg-inf-04", title: "Pediatric TB — Diagnosis & NTEP Guidelines", section: "Infectious Diseases", subspecialty: "pediatric-infections", topicSlugs: ["tb-children"], ugModuleRefs: ["PE21"] },
  { id: "pg-inf-05", title: "Pediatric HIV & PMTCT", section: "Infectious Diseases", subspecialty: "pediatric-infections", topicSlugs: ["hiv-children"], ugModuleRefs: ["PE22"] },
  { id: "pg-inf-06", title: "Malaria, Dengue & Tropical Infections in Children", section: "Infectious Diseases", subspecialty: "pediatric-infections", topicSlugs: ["malaria-children", "dengue-children"], ugModuleRefs: ["PE23"] },

  // Respiratory
  { id: "pg-resp-01", title: "Pneumonia & LRTI in Children", section: "Systemic Pediatrics", subspecialty: "pediatric-respiratory", topicSlugs: ["pneumonia-children"], ugModuleRefs: ["PE18"] },
  { id: "pg-resp-02", title: "Childhood Asthma — Acute & Chronic Management", section: "Systemic Pediatrics", subspecialty: "pediatric-respiratory", topicSlugs: ["asthma-children"], ugModuleRefs: ["PE19"] },
  { id: "pg-resp-03", title: "Bronchiolitis & Croup", section: "Systemic Pediatrics", subspecialty: "pediatric-respiratory", topicSlugs: ["bronchiolitis"], ugModuleRefs: ["PE18"] },
  { id: "pg-resp-04", title: "Stridor & Upper Airway Obstruction", section: "Systemic Pediatrics", subspecialty: "pediatric-respiratory", topicSlugs: ["stridor"], ugModuleRefs: ["PE18"] },

  // Cardiology
  { id: "pg-card-01", title: "Congenital Heart Disease — Acyanotic", section: "Systemic Pediatrics", subspecialty: "pediatric-cardiology", topicSlugs: ["chd-acyanotic"], ugModuleRefs: ["PE24"] },
  { id: "pg-card-02", title: "Cyanotic CHD — TOF & TGA", section: "Systemic Pediatrics", subspecialty: "pediatric-cardiology", topicSlugs: ["chd-cyanotic"], ugModuleRefs: ["PE24"] },
  { id: "pg-card-03", title: "Rheumatic Fever & RHD in Children", section: "Systemic Pediatrics", subspecialty: "pediatric-cardiology", topicSlugs: ["rheumatic-fever"], ugModuleRefs: ["PE25"] },
  { id: "pg-card-04", title: "Heart Failure & Cardiomyopathy in Children", section: "Systemic Pediatrics", subspecialty: "pediatric-cardiology", topicSlugs: ["pediatric-heart-failure"], ugModuleRefs: ["PE24"] },

  // GI & Renal
  { id: "pg-gi-01", title: "Diarrhea & Dehydration — WHO Management", section: "Systemic Pediatrics", subspecialty: "pediatric-gi", topicSlugs: ["diarrhea-dehydration"], ugModuleRefs: ["PE17"] },
  { id: "pg-gi-02", title: "Pediatric Liver Disease & Hepatitis", section: "Systemic Pediatrics", subspecialty: "pediatric-gi", topicSlugs: ["pediatric-liver"], ugModuleRefs: ["PE17"] },
  { id: "pg-gi-03", title: "Nephrotic Syndrome — Steroid Therapy & Relapse", section: "Systemic Pediatrics", subspecialty: "pediatric-gi", topicSlugs: ["nephrotic-syndrome-children"], ugModuleRefs: ["PE26"] },
  { id: "pg-gi-04", title: "UTI & Vesicoureteral Reflux", section: "Systemic Pediatrics", subspecialty: "pediatric-gi", topicSlugs: ["uti-children"], ugModuleRefs: ["PE27"] },

  // Neurology
  { id: "pg-neuro-01", title: "Seizures & Epilepsy Syndromes in Children", section: "Systemic Pediatrics", subspecialty: "pediatric-neurology", topicSlugs: ["seizures-children"], ugModuleRefs: ["PE28"] },
  { id: "pg-neuro-02", title: "Febrile Seizures — Evaluation & Prognosis", section: "Systemic Pediatrics", subspecialty: "pediatric-neurology", topicSlugs: ["febrile-seizures"], ugModuleRefs: ["PE28"] },
  { id: "pg-neuro-03", title: "CNS Infections — Meningitis & Encephalitis", section: "Systemic Pediatrics", subspecialty: "pediatric-neurology", topicSlugs: ["meningitis-children"], ugModuleRefs: ["PE29"] },
  { id: "pg-neuro-04", title: "Neurodegenerative & Neuromuscular Disorders", section: "Systemic Pediatrics", subspecialty: "pediatric-neurology", topicSlugs: ["neuromuscular"], ugModuleRefs: ["PE34"] },
  { id: "pg-neuro-05", title: "Cerebral Palsy & Rehabilitation", section: "Systemic Pediatrics", subspecialty: "pediatric-neurology", topicSlugs: ["cerebral-palsy"], ugModuleRefs: ["PE34"] },
];

// ─── SS: DM Pediatric Super Specialties ──────────────────────────────────────

export const PEDIATRICS_SS_SPECIALTIES: {
  id: string;
  degree: "DM";
  title: string;
  slug: string;
  description: string;
  subspecialties: string[];
  pgPrerequisite: string;
}[] = [
  {
    id: "dm-neonatology",
    degree: "DM",
    title: "DM Neonatology",
    slug: "neonatology",
    description: "NICU management, ventilation in neonates, extreme prematurity, neonatal surgery referral",
    subspecialties: ["neonatology"],
    pgPrerequisite: "MD Pediatrics",
  },
  {
    id: "dm-pediatric-neurology",
    degree: "DM",
    title: "DM Paediatric Neurology",
    slug: "pediatric-neurology",
    description: "Epilepsy syndromes, neurodegenerative disorders, neuromuscular disease, neuroimaging",
    subspecialties: ["pediatric-neurology"],
    pgPrerequisite: "MD Pediatrics",
  },
  {
    id: "dm-pediatric-nephrology",
    degree: "DM",
    title: "DM Pediatric Nephrology",
    slug: "pediatric-nephrology",
    description: "Pediatric dialysis, transplant nephrology, glomerular diseases, renal tubular disorders",
    subspecialties: ["pediatric-gi"],
    pgPrerequisite: "MD Pediatrics",
  },
  {
    id: "dm-pediatric-oncology",
    degree: "DM",
    title: "DM Paediatric Oncology",
    slug: "pediatric-oncology",
    description: "Childhood malignancies, chemotherapy protocols, bone marrow transplant",
    subspecialties: ["general-topics"],
    pgPrerequisite: "MD Pediatrics",
  },
  {
    id: "dm-pediatric-hepatology",
    degree: "DM",
    title: "DM Pediatric Hepatology",
    slug: "pediatric-hepatology",
    description: "Neonatal cholestasis, metabolic liver disease, liver transplant in children",
    subspecialties: ["pediatric-gi"],
    pgPrerequisite: "MD Pediatrics",
  },
];

// ─── Helper functions ────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return PEDIATRICS_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): PediatricsUGModule[] {
  return PEDIATRICS_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): PediatricsPGTopic[] {
  return PEDIATRICS_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
