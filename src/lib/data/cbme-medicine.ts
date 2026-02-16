/**
 * NMC CBME — Medicine (Internal Medicine) Curriculum: Complete UG → PG → SS Mapping
 *
 * UG: 26 modules (IM1–IM26), ~100+ competency codes
 * PG: MD General Medicine systemic topics
 * SS: DM super-specialty curricula
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type MedicineLevel = "UG" | "PG" | "SS";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface MedicineCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface MedicineUGModule {
  id: string;
  module: string;
  title: string;
  competencies: MedicineCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface MedicinePGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface MedicineSSTopic {
  id: string;
  degree: "DM";
  specialty: string;
  title: string;
  subspecialty: string;
  topicSlugs: string[];
  pgTopicRefs: string[];
}

export interface MedicineSubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  ssTopicCount: number;
  levels: MedicineLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const MEDICINE_SUBSPECIALTIES: MedicineSubspecialtyMap[] = [
  { slug: "general-topics", name: "General Topics", icon: "📋", ugTopicCount: 8, pgTopicCount: 6, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "pulmonology", name: "Pulmonology", icon: "🫁", ugTopicCount: 6, pgTopicCount: 5, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "cardiology", name: "Cardiology", icon: "❤️", ugTopicCount: 8, pgTopicCount: 6, ssTopicCount: 8, levels: ["UG", "PG", "SS"] },
  { slug: "gastroenterology", name: "Gastroenterology", icon: "🟡", ugTopicCount: 5, pgTopicCount: 5, ssTopicCount: 6, levels: ["UG", "PG", "SS"] },
  { slug: "nephrology", name: "Nephrology", icon: "🫘", ugTopicCount: 5, pgTopicCount: 5, ssTopicCount: 6, levels: ["UG", "PG", "SS"] },
  { slug: "endocrinology", name: "Endocrinology", icon: "🦋", ugTopicCount: 8, pgTopicCount: 6, ssTopicCount: 6, levels: ["UG", "PG", "SS"] },
  { slug: "hematology", name: "Hematology", icon: "🩸", ugTopicCount: 6, pgTopicCount: 5, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "infectious-diseases", name: "Infectious Diseases", icon: "🦠", ugTopicCount: 10, pgTopicCount: 6, ssTopicCount: 4, levels: ["UG", "PG", "SS"] },
  { slug: "neurology", name: "Neurology", icon: "🧠", ugTopicCount: 8, pgTopicCount: 6, ssTopicCount: 6, levels: ["UG", "PG", "SS"] },
  { slug: "rheumatology", name: "Rheumatology", icon: "🦴", ugTopicCount: 5, pgTopicCount: 4, ssTopicCount: 5, levels: ["UG", "PG", "SS"] },
  { slug: "dermatology", name: "Dermatology", icon: "🧴", ugTopicCount: 4, pgTopicCount: 3, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "psychiatry", name: "Psychiatry", icon: "🧩", ugTopicCount: 3, pgTopicCount: 3, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "geriatrics", name: "Geriatrics", icon: "👴", ugTopicCount: 2, pgTopicCount: 3, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "emergency", name: "Emergency Medicine", icon: "🚑", ugTopicCount: 5, pgTopicCount: 4, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "critical-care", name: "Critical Care", icon: "🏥", ugTopicCount: 3, pgTopicCount: 4, ssTopicCount: 5, levels: ["UG", "PG", "SS"] },
  { slug: "toxicology", name: "Toxicology", icon: "☠️", ugTopicCount: 4, pgTopicCount: 3, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "oncology", name: "Oncology", icon: "🎗️", ugTopicCount: 0, pgTopicCount: 3, ssTopicCount: 0, levels: ["PG"] },
];

// ─── UG Modules (IM1–IM26) ──────────────────────────────────────────────────

export const MEDICINE_UG_MODULES: MedicineUGModule[] = [
  {
    id: "im1", module: "IM1", title: "Clinical Approach to Disease",
    subspecialty: "general-topics", topicSlugs: ["clinical-approach"],
    competencies: [
      { code: "IM1.1", text: "Describe and discuss the approach to a patient with common symptoms: fever, weight loss, fatigue", domain: "K", isCore: true },
      { code: "IM1.2", text: "Describe and discuss the approach to a patient with lymphadenopathy", domain: "K", isCore: true },
      { code: "IM1.3", text: "Describe and discuss the approach to a patient with edema", domain: "K", isCore: true },
      { code: "IM1.4", text: "Elicit, document and present a general history and examination", domain: "SH", isCore: true },
      { code: "IM1.5", text: "Perform and interpret a urinalysis", domain: "SH", isCore: true },
      { code: "IM1.6", text: "Perform and interpret a peripheral blood smear", domain: "SH", isCore: true },
      { code: "IM1.7", text: "Order and interpret basic investigations (CBC, LFT, KFT, electrolytes)", domain: "SH", isCore: true },
      { code: "IM1.8", text: "Describe and discuss the indication and interpret chest X-ray and ECG", domain: "SH", isCore: true },
    ],
  },
  {
    id: "im2", module: "IM2", title: "Respiratory System",
    subspecialty: "pulmonology", topicSlugs: ["pneumonia", "copd", "asthma", "pleural-effusion", "tuberculosis"],
    competencies: [
      { code: "IM2.1", text: "Discuss and describe the aetiology, clinical presentation and diagnostic approach of pneumonia", domain: "K", isCore: true },
      { code: "IM2.2", text: "Discuss and describe the etiology, pathophysiology, clinical features and management of COPD", domain: "K", isCore: true },
      { code: "IM2.3", text: "Discuss and describe the etiology, pathophysiology, clinical features, diagnosis and management of asthma", domain: "K", isCore: true },
      { code: "IM2.4", text: "Discuss and describe the etiological agents, clinical features, diagnosis and management of pleural effusion", domain: "K", isCore: true },
      { code: "IM2.5", text: "Discuss and describe the etiology, clinical features, diagnosis and management of pulmonary tuberculosis", domain: "K", isCore: true },
      { code: "IM2.6", text: "Perform and interpret a peak expiratory flow rate", domain: "SH", isCore: true },
    ],
  },
  {
    id: "im3", module: "IM3", title: "Cardiology — Heart Failure",
    subspecialty: "cardiology", topicSlugs: ["heart-failure", "hypertension", "ischemic-heart-disease"],
    competencies: [
      { code: "IM3.1", text: "Describe and discuss the etiology, pathophysiology, clinical features, diagnosis and management of heart failure", domain: "K", isCore: true },
      { code: "IM3.2", text: "Discuss and describe the etiology, pathophysiology, clinical features, diagnosis and management of acute coronary syndrome", domain: "K", isCore: true },
      { code: "IM3.3", text: "Discuss and describe the etiology, pathophysiology, clinical features, diagnosis and management of hypertension", domain: "K", isCore: true },
      { code: "IM3.4", text: "Perform and interpret an ECG", domain: "SH", isCore: true },
      { code: "IM3.5", text: "Describe and discuss the management of cardiac emergencies", domain: "KH", isCore: true },
      { code: "IM3.6", text: "Enumerate the indications for and interpret echocardiography", domain: "KH", isCore: true },
      { code: "IM3.7", text: "Discuss and describe the etiology, clinical features, diagnosis and management of pericardial diseases", domain: "K", isCore: true },
      { code: "IM3.8", text: "Discuss and describe the etiology, clinical features, diagnosis and management of infective endocarditis", domain: "K", isCore: true },
    ],
  },
  {
    id: "im4", module: "IM4", title: "Rheumatic Heart Disease",
    subspecialty: "cardiology", topicSlugs: ["rheumatic-heart-disease"],
    competencies: [
      { code: "IM4.1", text: "Discuss and describe the etiology, pathophysiology, clinical features, diagnosis and management of rheumatic heart disease", domain: "K", isCore: true },
      { code: "IM4.2", text: "Discuss and describe the etiology, clinical features, diagnosis and management of valvular heart diseases", domain: "K", isCore: true },
      { code: "IM4.3", text: "Discuss and describe the pathophysiology, clinical features, diagnosis and management of common congenital heart diseases", domain: "K", isCore: true },
    ],
  },
  {
    id: "im5", module: "IM5", title: "Gastrointestinal System",
    subspecialty: "gastroenterology", topicSlugs: ["peptic-ulcer", "gi-bleeding", "malabsorption"],
    competencies: [
      { code: "IM5.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of acid peptic disease", domain: "K", isCore: true },
      { code: "IM5.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of upper and lower GI bleeding", domain: "K", isCore: true },
      { code: "IM5.3", text: "Describe and discuss the etiology, clinical features, diagnosis and management of diarrhea and malabsorption syndrome", domain: "K", isCore: true },
      { code: "IM5.4", text: "Describe and discuss the approach to a patient presenting with abdominal pain", domain: "K", isCore: true },
      { code: "IM5.5", text: "Describe and discuss the clinical features and management of inflammatory bowel disease", domain: "K", isCore: true },
    ],
  },
  {
    id: "im6", module: "IM6", title: "Liver Diseases",
    subspecialty: "gastroenterology", topicSlugs: ["hepatitis", "cirrhosis", "liver-failure"],
    competencies: [
      { code: "IM6.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of acute and chronic hepatitis", domain: "K", isCore: true },
      { code: "IM6.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of cirrhosis and its complications", domain: "K", isCore: true },
      { code: "IM6.3", text: "Describe and discuss the clinical approach to a patient with jaundice", domain: "K", isCore: true },
      { code: "IM6.4", text: "Describe and discuss the etiology, clinical features, diagnosis and management of hepatic encephalopathy", domain: "K", isCore: true },
      { code: "IM6.5", text: "Describe and discuss the etiology, clinical features, diagnosis and management of liver abscess", domain: "K", isCore: true },
    ],
  },
  {
    id: "im7", module: "IM7", title: "Hematology",
    subspecialty: "hematology", topicSlugs: ["anemia", "bleeding-disorders", "leukemia"],
    competencies: [
      { code: "IM7.1", text: "Describe and discuss the approach to a patient with anemia: iron deficiency, megaloblastic, aplastic, hemolytic", domain: "K", isCore: true },
      { code: "IM7.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of bleeding disorders", domain: "K", isCore: true },
      { code: "IM7.3", text: "Describe and discuss the etiology, clinical features, diagnosis and management of blood dyscrasias (leukemia, lymphoma, myeloma)", domain: "K", isCore: true },
      { code: "IM7.4", text: "Describe and discuss the approach to a patient with pancytopenia", domain: "K", isCore: true },
      { code: "IM7.5", text: "Describe and discuss the indications for blood transfusion and component therapy", domain: "KH", isCore: true },
      { code: "IM7.6", text: "Perform and interpret a peripheral smear and reticulocyte count", domain: "SH", isCore: true },
    ],
  },
  {
    id: "im8", module: "IM8", title: "Infectious & Tropical Diseases",
    subspecialty: "infectious-diseases", topicSlugs: ["malaria", "typhoid", "dengue", "hiv-aids", "tuberculosis"],
    competencies: [
      { code: "IM8.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of malaria", domain: "K", isCore: true },
      { code: "IM8.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of enteric fever", domain: "K", isCore: true },
      { code: "IM8.3", text: "Describe and discuss the etiology, clinical features, diagnosis and management of dengue", domain: "K", isCore: true },
      { code: "IM8.4", text: "Describe and discuss the etiology, clinical features, diagnosis and management of HIV/AIDS", domain: "K", isCore: true },
      { code: "IM8.5", text: "Describe and discuss the etiology, clinical features, diagnosis and management of common parasitic infections (kala-azar, filariasis)", domain: "K", isCore: true },
      { code: "IM8.6", text: "Describe and discuss the etiology, clinical features, diagnosis and management of leptospirosis", domain: "K", isCore: true },
      { code: "IM8.7", text: "Describe and discuss the etiology, clinical features, diagnosis and management of rabies", domain: "K", isCore: true },
      { code: "IM8.8", text: "Describe and discuss the approach to a patient with fever of unknown origin", domain: "K", isCore: true },
      { code: "IM8.9", text: "Describe and discuss the etiology, clinical features, diagnosis and management of sepsis", domain: "K", isCore: true },
      { code: "IM8.10", text: "Describe and discuss the approach to a patient with common bacterial infections: pneumonia, UTI, skin infections", domain: "K", isCore: true },
    ],
  },
  {
    id: "im9", module: "IM9", title: "Renal System",
    subspecialty: "nephrology", topicSlugs: ["acute-kidney-injury", "chronic-kidney-disease", "glomerulonephritis"],
    competencies: [
      { code: "IM9.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of acute kidney injury", domain: "K", isCore: true },
      { code: "IM9.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of chronic kidney disease", domain: "K", isCore: true },
      { code: "IM9.3", text: "Describe and discuss the etiology, clinical features, diagnosis and management of nephrotic syndrome", domain: "K", isCore: true },
      { code: "IM9.4", text: "Describe and discuss the etiology, clinical features, diagnosis and management of nephritic syndrome", domain: "K", isCore: true },
      { code: "IM9.5", text: "Describe and discuss the etiology, clinical features, diagnosis and management of urinary tract infections", domain: "K", isCore: true },
    ],
  },
  {
    id: "im10", module: "IM10", title: "Diabetes Mellitus",
    subspecialty: "endocrinology", topicSlugs: ["diabetes-mellitus", "diabetic-emergencies"],
    competencies: [
      { code: "IM10.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of diabetes mellitus type 1 and type 2", domain: "K", isCore: true },
      { code: "IM10.2", text: "Describe and discuss the acute and chronic complications of diabetes mellitus", domain: "K", isCore: true },
      { code: "IM10.3", text: "Describe and discuss the principles of insulin therapy and oral hypoglycemic drugs", domain: "KH", isCore: true },
      { code: "IM10.4", text: "Describe and discuss the management of diabetic ketoacidosis and hyperosmolar state", domain: "KH", isCore: true },
    ],
  },
  {
    id: "im11", module: "IM11", title: "Thyroid Disorders",
    subspecialty: "endocrinology", topicSlugs: ["hypothyroidism", "hyperthyroidism"],
    competencies: [
      { code: "IM11.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of hypothyroidism", domain: "K", isCore: true },
      { code: "IM11.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of hyperthyroidism", domain: "K", isCore: true },
      { code: "IM11.3", text: "Order and interpret thyroid function tests", domain: "SH", isCore: true },
    ],
  },
  {
    id: "im12", module: "IM12", title: "Adrenal & Pituitary Disorders",
    subspecialty: "endocrinology", topicSlugs: ["adrenal-disorders", "pituitary-disorders"],
    competencies: [
      { code: "IM12.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of Cushing's syndrome", domain: "K", isCore: true },
      { code: "IM12.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of Addison's disease", domain: "K", isCore: true },
      { code: "IM12.3", text: "Describe and discuss the etiology, clinical features, diagnosis and management of pituitary disorders (acromegaly, hypopituitarism)", domain: "K", isCore: true },
      { code: "IM12.4", text: "Describe and discuss the etiology, clinical features, diagnosis and management of pheochromocytoma", domain: "K", isCore: true },
    ],
  },
  {
    id: "im13", module: "IM13", title: "Rheumatology — Arthritis",
    subspecialty: "rheumatology", topicSlugs: ["rheumatoid-arthritis", "osteoarthritis"],
    competencies: [
      { code: "IM13.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of rheumatoid arthritis", domain: "K", isCore: true },
      { code: "IM13.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of osteoarthritis", domain: "K", isCore: true },
      { code: "IM13.3", text: "Describe and discuss the approach to a patient with joint pain", domain: "K", isCore: true },
    ],
  },
  {
    id: "im14", module: "IM14", title: "Connective Tissue Disorders",
    subspecialty: "rheumatology", topicSlugs: ["sle", "scleroderma"],
    competencies: [
      { code: "IM14.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of SLE", domain: "K", isCore: true },
      { code: "IM14.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of vasculitis syndromes", domain: "K", isCore: true },
      { code: "IM14.3", text: "Describe and discuss the etiology, clinical features, diagnosis and management of spondyloarthropathies", domain: "K", isCore: true },
    ],
  },
  {
    id: "im15", module: "IM15", title: "Metabolic Bone Disease",
    subspecialty: "rheumatology", topicSlugs: ["gout", "osteoporosis"],
    competencies: [
      { code: "IM15.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of gout and hyperuricemia", domain: "K", isCore: true },
      { code: "IM15.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of osteoporosis", domain: "K", isCore: true },
      { code: "IM15.3", text: "Describe and discuss calcium and phosphorus metabolism disorders", domain: "K", isCore: true },
    ],
  },
  {
    id: "im16", module: "IM16", title: "Neurology — Stroke & Headache",
    subspecialty: "neurology", topicSlugs: ["stroke", "headache"],
    competencies: [
      { code: "IM16.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of cerebrovascular accidents (stroke)", domain: "K", isCore: true },
      { code: "IM16.2", text: "Describe and discuss the approach to a patient with headache", domain: "K", isCore: true },
      { code: "IM16.3", text: "Describe and discuss the clinical features, diagnosis and management of migraine and tension headache", domain: "K", isCore: true },
    ],
  },
  {
    id: "im17", module: "IM17", title: "Neurology — Seizures & Movement Disorders",
    subspecialty: "neurology", topicSlugs: ["epilepsy", "parkinsons-disease"],
    competencies: [
      { code: "IM17.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of epilepsy", domain: "K", isCore: true },
      { code: "IM17.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of Parkinson's disease", domain: "K", isCore: true },
      { code: "IM17.3", text: "Describe and discuss the etiology, clinical features, diagnosis and management of meningitis and encephalitis", domain: "K", isCore: true },
    ],
  },
  {
    id: "im18", module: "IM18", title: "Neurology — Neuropathy & Demyelination",
    subspecialty: "neurology", topicSlugs: ["peripheral-neuropathy", "guillain-barre-syndrome"],
    competencies: [
      { code: "IM18.1", text: "Describe and discuss the approach to a patient with weakness and peripheral neuropathy", domain: "K", isCore: true },
      { code: "IM18.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of Guillain-Barré syndrome", domain: "K", isCore: true },
      { code: "IM18.3", text: "Describe and discuss the etiology, clinical features, diagnosis and management of myasthenia gravis", domain: "K", isCore: true },
      { code: "IM18.4", text: "Describe and discuss the etiology, clinical features, diagnosis and management of multiple sclerosis", domain: "K", isCore: true },
    ],
  },
  {
    id: "im19", module: "IM19", title: "Dermatology — Skin Manifestations",
    subspecialty: "dermatology", topicSlugs: ["psoriasis", "eczema"],
    competencies: [
      { code: "IM19.1", text: "Describe and discuss the approach to a patient with skin lesions — morphology and distribution", domain: "K", isCore: true },
      { code: "IM19.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of psoriasis", domain: "K", isCore: true },
    ],
  },
  {
    id: "im20", module: "IM20", title: "Dermatology — Infections & Allergies",
    subspecialty: "dermatology", topicSlugs: ["urticaria", "drug-reactions"],
    competencies: [
      { code: "IM20.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of urticaria and angioedema", domain: "K", isCore: true },
      { code: "IM20.2", text: "Describe and discuss the clinical features and management of drug reactions (SJS, TEN)", domain: "K", isCore: true },
    ],
  },
  {
    id: "im21", module: "IM21", title: "Dermatology — Systemic Manifestations",
    subspecialty: "dermatology", topicSlugs: ["skin-systemic-disease"],
    competencies: [
      { code: "IM21.1", text: "Describe and discuss the dermatologic manifestations of systemic diseases", domain: "K", isCore: true },
      { code: "IM21.2", text: "Describe and discuss the clinical features and management of leprosy", domain: "K", isCore: true },
    ],
  },
  {
    id: "im22", module: "IM22", title: "Psychiatry — Common Disorders",
    subspecialty: "psychiatry", topicSlugs: ["depression", "anxiety-disorders", "psychosis"],
    competencies: [
      { code: "IM22.1", text: "Describe and discuss the clinical features, diagnosis and management of depression", domain: "K", isCore: true },
      { code: "IM22.2", text: "Describe and discuss the clinical features, diagnosis and management of anxiety disorders", domain: "K", isCore: true },
      { code: "IM22.3", text: "Describe and discuss the clinical features, diagnosis and management of psychosis and schizophrenia", domain: "K", isCore: true },
    ],
  },
  {
    id: "im23", module: "IM23", title: "Geriatrics",
    subspecialty: "geriatrics", topicSlugs: ["falls-elderly", "polypharmacy"],
    competencies: [
      { code: "IM23.1", text: "Describe and discuss the principles of geriatric assessment and common problems in the elderly", domain: "K", isCore: true },
      { code: "IM23.2", text: "Describe and discuss polypharmacy, drug interactions and adverse drug reactions in the elderly", domain: "K", isCore: true },
    ],
  },
  {
    id: "im24", module: "IM24", title: "Emergency Medicine & Critical Care",
    subspecialty: "emergency", topicSlugs: ["cardiac-arrest", "anaphylaxis", "status-epilepticus"],
    competencies: [
      { code: "IM24.1", text: "Describe and discuss the approach to cardiac arrest and CPR", domain: "SH", isCore: true },
      { code: "IM24.2", text: "Describe and discuss the approach to anaphylaxis and acute allergic reactions", domain: "KH", isCore: true },
      { code: "IM24.3", text: "Describe and discuss the approach to status epilepticus", domain: "KH", isCore: true },
      { code: "IM24.4", text: "Describe and discuss the approach to acute pulmonary edema", domain: "KH", isCore: true },
      { code: "IM24.5", text: "Describe and discuss the approach to acute severe asthma", domain: "KH", isCore: true },
    ],
  },
  {
    id: "im25", module: "IM25", title: "Toxicology",
    subspecialty: "toxicology", topicSlugs: ["poisoning-general", "snake-bite", "drug-overdose"],
    competencies: [
      { code: "IM25.1", text: "Describe and discuss the approach to a patient with acute poisoning — general principles of management", domain: "KH", isCore: true },
      { code: "IM25.2", text: "Describe and discuss the clinical features and management of common poisoning: organophosphorus, corrosive, rodenticides", domain: "KH", isCore: true },
      { code: "IM25.3", text: "Describe and discuss the clinical features and management of snake bite envenomation", domain: "KH", isCore: true },
      { code: "IM25.4", text: "Describe and discuss the clinical features and management of drug overdose (paracetamol, opioids)", domain: "KH", isCore: true },
    ],
  },
  {
    id: "im26", module: "IM26", title: "Clinical Skills & Procedures",
    subspecialty: "general-topics", topicSlugs: ["clinical-examination-skills"],
    competencies: [
      { code: "IM26.1", text: "Perform a systematic examination of the cardiovascular system", domain: "SH", isCore: true },
      { code: "IM26.2", text: "Perform a systematic examination of the respiratory system", domain: "SH", isCore: true },
      { code: "IM26.3", text: "Perform a systematic examination of the abdomen", domain: "SH", isCore: true },
      { code: "IM26.4", text: "Perform a systematic examination of the nervous system", domain: "SH", isCore: true },
      { code: "IM26.5", text: "Perform a lumbar puncture on a mannequin", domain: "SH", isCore: true },
      { code: "IM26.6", text: "Perform a pleural tap and interpret pleural fluid", domain: "SH", isCore: true },
      { code: "IM26.7", text: "Perform an abdominal paracentesis and interpret ascitic fluid", domain: "SH", isCore: true },
      { code: "IM26.8", text: "Perform a bone marrow aspiration on a mannequin", domain: "SH", isCore: true },
    ],
  },
];

// ─── PG: MD General Medicine Topics ──────────────────────────────────────────

export const MEDICINE_PG_TOPICS: MedicinePGTopic[] = [
  // General Topics
  { id: "pg-gen-01", title: "Clinical Methods & History Taking", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["clinical-approach"], ugModuleRefs: ["IM1"] },
  { id: "pg-gen-02", title: "Fluid, Electrolyte & Acid-Base Disorders", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["electrolyte-disorders"], ugModuleRefs: ["IM1"] },
  { id: "pg-gen-03", title: "Nutrition in Medicine", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["nutrition"], ugModuleRefs: [] },
  { id: "pg-gen-04", title: "Immunology & Allergy", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["immunology"], ugModuleRefs: [] },
  { id: "pg-gen-05", title: "Evidence-Based Medicine & Research", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["ebm"], ugModuleRefs: [] },
  { id: "pg-gen-06", title: "Pharmacotherapeutics & Rational Drug Use", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["pharmacotherapy"], ugModuleRefs: [] },

  // Pulmonology
  { id: "pg-pulm-01", title: "Pneumonia, LRTI & Lung Abscess", section: "Systemic Medicine", subspecialty: "pulmonology", topicSlugs: ["pneumonia"], ugModuleRefs: ["IM2"] },
  { id: "pg-pulm-02", title: "COPD & Bronchiectasis", section: "Systemic Medicine", subspecialty: "pulmonology", topicSlugs: ["copd"], ugModuleRefs: ["IM2"] },
  { id: "pg-pulm-03", title: "Asthma & Allergic Lung Disease", section: "Systemic Medicine", subspecialty: "pulmonology", topicSlugs: ["asthma"], ugModuleRefs: ["IM2"] },
  { id: "pg-pulm-04", title: "Interstitial Lung Disease & Pulmonary Fibrosis", section: "Systemic Medicine", subspecialty: "pulmonology", topicSlugs: ["ild"], ugModuleRefs: ["IM2"] },
  { id: "pg-pulm-05", title: "Pleural Diseases & Lung Cancer", section: "Systemic Medicine", subspecialty: "pulmonology", topicSlugs: ["pleural-effusion"], ugModuleRefs: ["IM2"] },

  // Cardiology
  { id: "pg-card-01", title: "Heart Failure — Acute & Chronic Management", section: "Systemic Medicine", subspecialty: "cardiology", topicSlugs: ["heart-failure"], ugModuleRefs: ["IM3"] },
  { id: "pg-card-02", title: "Coronary Artery Disease & Acute Coronary Syndrome", section: "Systemic Medicine", subspecialty: "cardiology", topicSlugs: ["ischemic-heart-disease"], ugModuleRefs: ["IM3"] },
  { id: "pg-card-03", title: "Hypertension & Secondary Causes", section: "Systemic Medicine", subspecialty: "cardiology", topicSlugs: ["hypertension"], ugModuleRefs: ["IM3"] },
  { id: "pg-card-04", title: "Arrhythmias & Conduction Disorders", section: "Systemic Medicine", subspecialty: "cardiology", topicSlugs: ["arrhythmias"], ugModuleRefs: ["IM3"] },
  { id: "pg-card-05", title: "Valvular Heart Disease & RHD", section: "Systemic Medicine", subspecialty: "cardiology", topicSlugs: ["rheumatic-heart-disease"], ugModuleRefs: ["IM4"] },
  { id: "pg-card-06", title: "Cardiomyopathies & Pericardial Disease", section: "Systemic Medicine", subspecialty: "cardiology", topicSlugs: ["cardiomyopathy"], ugModuleRefs: ["IM3"] },

  // Gastroenterology
  { id: "pg-gi-01", title: "Acid Peptic Disease & H. pylori", section: "Systemic Medicine", subspecialty: "gastroenterology", topicSlugs: ["peptic-ulcer"], ugModuleRefs: ["IM5"] },
  { id: "pg-gi-02", title: "Hepatitis — Acute & Chronic", section: "Systemic Medicine", subspecialty: "gastroenterology", topicSlugs: ["hepatitis"], ugModuleRefs: ["IM6"] },
  { id: "pg-gi-03", title: "Cirrhosis & Portal Hypertension", section: "Systemic Medicine", subspecialty: "gastroenterology", topicSlugs: ["cirrhosis"], ugModuleRefs: ["IM6"] },
  { id: "pg-gi-04", title: "Inflammatory Bowel Disease", section: "Systemic Medicine", subspecialty: "gastroenterology", topicSlugs: ["ibd"], ugModuleRefs: ["IM5"] },
  { id: "pg-gi-05", title: "Pancreatitis & GI Malignancies", section: "Systemic Medicine", subspecialty: "gastroenterology", topicSlugs: ["pancreatitis"], ugModuleRefs: ["IM5"] },

  // Nephrology
  { id: "pg-neph-01", title: "Acute Kidney Injury — Etiology & Management", section: "Systemic Medicine", subspecialty: "nephrology", topicSlugs: ["acute-kidney-injury"], ugModuleRefs: ["IM9"] },
  { id: "pg-neph-02", title: "Chronic Kidney Disease & Dialysis", section: "Systemic Medicine", subspecialty: "nephrology", topicSlugs: ["chronic-kidney-disease"], ugModuleRefs: ["IM9"] },
  { id: "pg-neph-03", title: "Glomerulonephritis & Nephrotic Syndrome", section: "Systemic Medicine", subspecialty: "nephrology", topicSlugs: ["glomerulonephritis"], ugModuleRefs: ["IM9"] },
  { id: "pg-neph-04", title: "Renal Tubular Disorders & Urolithiasis", section: "Systemic Medicine", subspecialty: "nephrology", topicSlugs: ["renal-tubular"], ugModuleRefs: ["IM9"] },
  { id: "pg-neph-05", title: "Hypertension & Renal Disease", section: "Systemic Medicine", subspecialty: "nephrology", topicSlugs: ["hypertensive-nephropathy"], ugModuleRefs: ["IM9"] },

  // Endocrinology
  { id: "pg-endo-01", title: "Diabetes Mellitus — Comprehensive Management", section: "Systemic Medicine", subspecialty: "endocrinology", topicSlugs: ["diabetes-mellitus"], ugModuleRefs: ["IM10"] },
  { id: "pg-endo-02", title: "Thyroid Disorders — Complete Spectrum", section: "Systemic Medicine", subspecialty: "endocrinology", topicSlugs: ["hypothyroidism", "hyperthyroidism"], ugModuleRefs: ["IM11"] },
  { id: "pg-endo-03", title: "Adrenal & Pituitary Disorders", section: "Systemic Medicine", subspecialty: "endocrinology", topicSlugs: ["adrenal-disorders", "pituitary-disorders"], ugModuleRefs: ["IM12"] },
  { id: "pg-endo-04", title: "Metabolic Syndrome & Obesity", section: "Systemic Medicine", subspecialty: "endocrinology", topicSlugs: ["metabolic-syndrome"], ugModuleRefs: ["IM10"] },
  { id: "pg-endo-05", title: "Calcium & Bone Metabolism Disorders", section: "Systemic Medicine", subspecialty: "endocrinology", topicSlugs: ["calcium-disorders"], ugModuleRefs: ["IM15"] },
  { id: "pg-endo-06", title: "Reproductive Endocrinology", section: "Systemic Medicine", subspecialty: "endocrinology", topicSlugs: ["reproductive-endocrine"], ugModuleRefs: [] },

  // Hematology
  { id: "pg-hema-01", title: "Anemia — Iron Deficiency, Megaloblastic, Hemolytic", section: "Systemic Medicine", subspecialty: "hematology", topicSlugs: ["anemia"], ugModuleRefs: ["IM7"] },
  { id: "pg-hema-02", title: "Bleeding & Coagulation Disorders", section: "Systemic Medicine", subspecialty: "hematology", topicSlugs: ["bleeding-disorders"], ugModuleRefs: ["IM7"] },
  { id: "pg-hema-03", title: "Leukemia, Lymphoma & Myeloma", section: "Systemic Medicine", subspecialty: "hematology", topicSlugs: ["leukemia"], ugModuleRefs: ["IM7"] },
  { id: "pg-hema-04", title: "Transfusion Medicine & Bone Marrow Failure", section: "Systemic Medicine", subspecialty: "hematology", topicSlugs: ["transfusion"], ugModuleRefs: ["IM7"] },
  { id: "pg-hema-05", title: "Thrombotic Disorders & Anticoagulation", section: "Systemic Medicine", subspecialty: "hematology", topicSlugs: ["thrombosis"], ugModuleRefs: ["IM7"] },

  // Infectious Diseases
  { id: "pg-id-01", title: "Malaria & Parasitic Infections", section: "Systemic Medicine", subspecialty: "infectious-diseases", topicSlugs: ["malaria"], ugModuleRefs: ["IM8"] },
  { id: "pg-id-02", title: "Tuberculosis — Pulmonary & Extrapulmonary", section: "Systemic Medicine", subspecialty: "infectious-diseases", topicSlugs: ["tuberculosis"], ugModuleRefs: ["IM8"] },
  { id: "pg-id-03", title: "HIV/AIDS & Opportunistic Infections", section: "Systemic Medicine", subspecialty: "infectious-diseases", topicSlugs: ["hiv-aids"], ugModuleRefs: ["IM8"] },
  { id: "pg-id-04", title: "Viral Hepatitis & Emerging Infections", section: "Systemic Medicine", subspecialty: "infectious-diseases", topicSlugs: ["hepatitis"], ugModuleRefs: ["IM8"] },
  { id: "pg-id-05", title: "Antimicrobial Therapy & Resistance", section: "Systemic Medicine", subspecialty: "infectious-diseases", topicSlugs: ["antimicrobials"], ugModuleRefs: ["IM8"] },
  { id: "pg-id-06", title: "Tropical Fevers — Dengue, Typhoid, Leptospirosis", section: "Systemic Medicine", subspecialty: "infectious-diseases", topicSlugs: ["dengue", "typhoid"], ugModuleRefs: ["IM8"] },

  // Neurology
  { id: "pg-neuro-01", title: "Stroke — Ischemic & Hemorrhagic", section: "Systemic Medicine", subspecialty: "neurology", topicSlugs: ["stroke"], ugModuleRefs: ["IM16"] },
  { id: "pg-neuro-02", title: "Epilepsy & Status Epilepticus", section: "Systemic Medicine", subspecialty: "neurology", topicSlugs: ["epilepsy"], ugModuleRefs: ["IM17"] },
  { id: "pg-neuro-03", title: "Headache — Migraine & Secondary Causes", section: "Systemic Medicine", subspecialty: "neurology", topicSlugs: ["headache"], ugModuleRefs: ["IM16"] },
  { id: "pg-neuro-04", title: "Movement Disorders — Parkinson's & Tremors", section: "Systemic Medicine", subspecialty: "neurology", topicSlugs: ["parkinsons-disease"], ugModuleRefs: ["IM17"] },
  { id: "pg-neuro-05", title: "Peripheral Neuropathy & GBS", section: "Systemic Medicine", subspecialty: "neurology", topicSlugs: ["peripheral-neuropathy"], ugModuleRefs: ["IM18"] },
  { id: "pg-neuro-06", title: "CNS Infections & Demyelinating Diseases", section: "Systemic Medicine", subspecialty: "neurology", topicSlugs: ["meningitis"], ugModuleRefs: ["IM17", "IM18"] },

  // Rheumatology
  { id: "pg-rheum-01", title: "Rheumatoid Arthritis & Seronegative Arthropathies", section: "Systemic Medicine", subspecialty: "rheumatology", topicSlugs: ["rheumatoid-arthritis"], ugModuleRefs: ["IM13"] },
  { id: "pg-rheum-02", title: "SLE & Connective Tissue Disorders", section: "Systemic Medicine", subspecialty: "rheumatology", topicSlugs: ["sle"], ugModuleRefs: ["IM14"] },
  { id: "pg-rheum-03", title: "Gout & Crystal Arthropathies", section: "Systemic Medicine", subspecialty: "rheumatology", topicSlugs: ["gout"], ugModuleRefs: ["IM15"] },
  { id: "pg-rheum-04", title: "Vasculitis & Sarcoidosis", section: "Systemic Medicine", subspecialty: "rheumatology", topicSlugs: ["vasculitis"], ugModuleRefs: ["IM14"] },

  // Dermatology
  { id: "pg-derm-01", title: "Psoriasis & Papulosquamous Disorders", section: "Systemic Medicine", subspecialty: "dermatology", topicSlugs: ["psoriasis"], ugModuleRefs: ["IM19"] },
  { id: "pg-derm-02", title: "Drug Reactions & Urticaria", section: "Systemic Medicine", subspecialty: "dermatology", topicSlugs: ["drug-reactions"], ugModuleRefs: ["IM20"] },
  { id: "pg-derm-03", title: "Dermatological Manifestations of Systemic Disease", section: "Systemic Medicine", subspecialty: "dermatology", topicSlugs: ["skin-systemic-disease"], ugModuleRefs: ["IM21"] },

  // Psychiatry
  { id: "pg-psych-01", title: "Depression & Mood Disorders", section: "Systemic Medicine", subspecialty: "psychiatry", topicSlugs: ["depression"], ugModuleRefs: ["IM22"] },
  { id: "pg-psych-02", title: "Anxiety, OCD & Psychotic Disorders", section: "Systemic Medicine", subspecialty: "psychiatry", topicSlugs: ["anxiety-disorders"], ugModuleRefs: ["IM22"] },
  { id: "pg-psych-03", title: "Delirium, Dementia & Substance Abuse", section: "Systemic Medicine", subspecialty: "psychiatry", topicSlugs: ["delirium"], ugModuleRefs: ["IM22"] },

  // Geriatrics
  { id: "pg-geri-01", title: "Comprehensive Geriatric Assessment", section: "Systemic Medicine", subspecialty: "geriatrics", topicSlugs: ["falls-elderly"], ugModuleRefs: ["IM23"] },
  { id: "pg-geri-02", title: "Polypharmacy & ADRs in Elderly", section: "Systemic Medicine", subspecialty: "geriatrics", topicSlugs: ["polypharmacy"], ugModuleRefs: ["IM23"] },
  { id: "pg-geri-03", title: "Frailty, Sarcopenia & End-of-Life Care", section: "Systemic Medicine", subspecialty: "geriatrics", topicSlugs: ["frailty"], ugModuleRefs: ["IM23"] },

  // Emergency
  { id: "pg-emerg-01", title: "Cardiac Arrest & Advanced Life Support", section: "Emergency Medicine", subspecialty: "emergency", topicSlugs: ["cardiac-arrest"], ugModuleRefs: ["IM24"] },
  { id: "pg-emerg-02", title: "Anaphylaxis & Acute Allergic Reactions", section: "Emergency Medicine", subspecialty: "emergency", topicSlugs: ["anaphylaxis"], ugModuleRefs: ["IM24"] },
  { id: "pg-emerg-03", title: "Acute Stroke & Neurological Emergencies", section: "Emergency Medicine", subspecialty: "emergency", topicSlugs: ["stroke"], ugModuleRefs: ["IM24"] },
  { id: "pg-emerg-04", title: "Acute Coronary Syndrome — Emergency Management", section: "Emergency Medicine", subspecialty: "emergency", topicSlugs: ["acs-emergency"], ugModuleRefs: ["IM24"] },

  // Critical Care
  { id: "pg-cc-01", title: "Mechanical Ventilation & ARDS", section: "Emergency Medicine", subspecialty: "critical-care", topicSlugs: ["ventilation"], ugModuleRefs: ["IM24"] },
  { id: "pg-cc-02", title: "Sepsis & Septic Shock", section: "Emergency Medicine", subspecialty: "critical-care", topicSlugs: ["sepsis"], ugModuleRefs: ["IM8"] },
  { id: "pg-cc-03", title: "Multi-Organ Dysfunction Syndrome", section: "Emergency Medicine", subspecialty: "critical-care", topicSlugs: ["mods"], ugModuleRefs: ["IM24"] },
  { id: "pg-cc-04", title: "ICU Monitoring & Hemodynamic Assessment", section: "Emergency Medicine", subspecialty: "critical-care", topicSlugs: ["icu-monitoring"], ugModuleRefs: ["IM24"] },

  // Toxicology
  { id: "pg-tox-01", title: "Acute Poisoning — OP, Corrosives, Metals", section: "Emergency Medicine", subspecialty: "toxicology", topicSlugs: ["poisoning-general"], ugModuleRefs: ["IM25"] },
  { id: "pg-tox-02", title: "Snake & Scorpion Envenomation", section: "Emergency Medicine", subspecialty: "toxicology", topicSlugs: ["snake-bite"], ugModuleRefs: ["IM25"] },
  { id: "pg-tox-03", title: "Drug Overdose & Antidotes", section: "Emergency Medicine", subspecialty: "toxicology", topicSlugs: ["drug-overdose"], ugModuleRefs: ["IM25"] },

  // Oncology
  { id: "pg-onc-01", title: "Principles of Medical Oncology", section: "Systemic Medicine", subspecialty: "oncology", topicSlugs: ["oncology-principles"], ugModuleRefs: [] },
  { id: "pg-onc-02", title: "Paraneoplastic Syndromes", section: "Systemic Medicine", subspecialty: "oncology", topicSlugs: ["paraneoplastic"], ugModuleRefs: [] },
  { id: "pg-onc-03", title: "Palliative Care & End-of-Life Medicine", section: "Systemic Medicine", subspecialty: "oncology", topicSlugs: ["palliative"], ugModuleRefs: [] },
];

// ─── SS: DM Medicine Super Specialties ───────────────────────────────────────

export const MEDICINE_SS_SPECIALTIES: {
  id: string;
  degree: "DM";
  title: string;
  slug: string;
  description: string;
  subspecialties: string[];
  pgPrerequisite: string;
}[] = [
  {
    id: "dm-cardiology",
    degree: "DM",
    title: "DM Cardiology",
    slug: "cardiology",
    description: "Interventional cardiology, electrophysiology, heart failure, cardiac imaging",
    subspecialties: ["cardiology"],
    pgPrerequisite: "MD General Medicine",
  },
  {
    id: "dm-neurology",
    degree: "DM",
    title: "DM Neurology",
    slug: "neurology",
    description: "Stroke, epilepsy, movement disorders, demyelinating diseases, neuromuscular disorders",
    subspecialties: ["neurology"],
    pgPrerequisite: "MD General Medicine",
  },
  {
    id: "dm-nephrology",
    degree: "DM",
    title: "DM Nephrology",
    slug: "nephrology",
    description: "Dialysis, transplant nephrology, glomerular diseases, CKD management",
    subspecialties: ["nephrology"],
    pgPrerequisite: "MD General Medicine",
  },
  {
    id: "dm-gastroenterology",
    degree: "DM",
    title: "DM Gastroenterology",
    slug: "gastroenterology",
    description: "Diagnostic & therapeutic endoscopy, hepatology, IBD, motility disorders",
    subspecialties: ["gastroenterology"],
    pgPrerequisite: "MD General Medicine",
  },
  {
    id: "dm-endocrinology",
    degree: "DM",
    title: "DM Endocrinology",
    slug: "endocrinology",
    description: "Diabetes, thyroid, adrenal, pituitary, reproductive endocrinology, metabolic bone disease",
    subspecialties: ["endocrinology"],
    pgPrerequisite: "MD General Medicine",
  },
  {
    id: "dm-pulmonary-medicine",
    degree: "DM",
    title: "DM Pulmonary Medicine",
    slug: "pulmonary-medicine",
    description: "Interventional pulmonology, sleep medicine, ILD, pulmonary hypertension",
    subspecialties: ["pulmonology"],
    pgPrerequisite: "MD General Medicine / MD Pulmonary Medicine",
  },
  {
    id: "dm-rheumatology",
    degree: "DM",
    title: "DM Clinical Immunology & Rheumatology",
    slug: "rheumatology",
    description: "Autoimmune diseases, vasculitis, immunodeficiency, biologic therapy",
    subspecialties: ["rheumatology"],
    pgPrerequisite: "MD General Medicine",
  },
  {
    id: "dm-critical-care",
    degree: "DM",
    title: "DM Critical Care Medicine",
    slug: "critical-care-medicine",
    description: "ICU management, mechanical ventilation, hemodynamic monitoring, ECMO",
    subspecialties: ["critical-care", "emergency"],
    pgPrerequisite: "MD General Medicine / MD Anesthesia",
  },
  {
    id: "dm-hepatology",
    degree: "DM",
    title: "DM Hepatology",
    slug: "hepatology",
    description: "Liver transplant medicine, portal hypertension, viral hepatitis, NAFLD",
    subspecialties: ["gastroenterology"],
    pgPrerequisite: "MD General Medicine",
  },
  {
    id: "dm-infectious-diseases",
    degree: "DM",
    title: "DM Infectious Diseases",
    slug: "infectious-diseases",
    description: "Antimicrobial stewardship, HIV medicine, tropical infections, infection control",
    subspecialties: ["infectious-diseases"],
    pgPrerequisite: "MD General Medicine / MD Microbiology",
  },
];

// ─── Helper functions ────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return MEDICINE_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): MedicineUGModule[] {
  return MEDICINE_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): MedicinePGTopic[] {
  return MEDICINE_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
