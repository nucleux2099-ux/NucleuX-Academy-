/**
 * NMC CBME — Pathology Curriculum: Complete UG → PG Mapping
 *
 * UG: 35 modules (PA1–PA35), ~100+ competency codes
 * PG: MD Pathology
 *
 * Mapped to library content/pathology/ subdirs.
 */

export type PathologyLevel = "UG" | "PG";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface PathologyCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface PathologyUGModule {
  id: string;
  module: string;
  title: string;
  competencies: PathologyCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface PathologyPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface PathologySubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  levels: PathologyLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const PATHOLOGY_SUBSPECIALTIES: PathologySubspecialtyMap[] = [
  { slug: "general-pathology", name: "General Pathology", icon: "🔬", ugTopicCount: 10, pgTopicCount: 5, levels: ["UG", "PG"] },
  { slug: "hematopathology", name: "Hematopathology", icon: "🩸", ugTopicCount: 7, pgTopicCount: 4, levels: ["UG", "PG"] },
  { slug: "cardiovascular-pathology", name: "CVS Pathology", icon: "❤️", ugTopicCount: 2, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "respiratory-pathology", name: "Respiratory Pathology", icon: "🫁", ugTopicCount: 2, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "gi-pathology", name: "GI & Liver Pathology", icon: "🟡", ugTopicCount: 3, pgTopicCount: 3, levels: ["UG", "PG"] },
  { slug: "renal-pathology", name: "Renal Pathology", icon: "🫘", ugTopicCount: 2, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "endocrine-pathology", name: "Endocrine Pathology", icon: "🦋", ugTopicCount: 2, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "reproductive-pathology", name: "Reproductive Pathology", icon: "🩺", ugTopicCount: 2, pgTopicCount: 2, levels: ["UG", "PG"] },
  { slug: "neuropathology", name: "Neuropathology", icon: "🧠", ugTopicCount: 1, pgTopicCount: 1, levels: ["UG", "PG"] },
  { slug: "general-topics", name: "Clinical Pathology", icon: "🧪", ugTopicCount: 2, pgTopicCount: 2, levels: ["UG", "PG"] },
];

// ─── UG Modules (PA1–PA35) ──────────────────────────────────────────────────

export const PATHOLOGY_UG_MODULES: PathologyUGModule[] = [
  {
    id: "pa1", module: "PA1", title: "Introduction to Pathology",
    subspecialty: "general-pathology", topicSlugs: ["introduction"],
    competencies: [
      { code: "PA1.1", text: "Describe the role of pathology in medicine", domain: "K", isCore: true },
      { code: "PA1.2", text: "Describe the techniques of tissue diagnosis", domain: "K", isCore: true },
    ],
  },
  {
    id: "pa2", module: "PA2", title: "Cell Injury & Adaptation",
    subspecialty: "general-pathology", topicSlugs: ["cell-injury"],
    competencies: [
      { code: "PA2.1", text: "Describe the causes, mechanisms and types of cell injury", domain: "KH", isCore: true },
      { code: "PA2.2", text: "Describe and discuss the morphology of cell injury — reversible and irreversible", domain: "KH", isCore: true },
      { code: "PA2.3", text: "Describe the mechanism and morphology of cell death — necrosis and apoptosis", domain: "KH", isCore: true },
      { code: "PA2.4", text: "Describe the cellular adaptations — hypertrophy, hyperplasia, atrophy, metaplasia, dysplasia", domain: "KH", isCore: true },
      { code: "PA2.5", text: "Describe the etiology, pathogenesis, morphology of intracellular accumulations and calcification", domain: "KH", isCore: true },
      { code: "PA2.6", text: "Describe the pathology of amyloidosis", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa3", module: "PA3", title: "Inflammation & Healing",
    subspecialty: "general-pathology", topicSlugs: ["inflammation"],
    competencies: [
      { code: "PA3.1", text: "Describe the general features of acute and chronic inflammation", domain: "KH", isCore: true },
      { code: "PA3.2", text: "Describe the vascular and cellular events in acute inflammation", domain: "KH", isCore: true },
      { code: "PA3.3", text: "Describe the chemical mediators of inflammation", domain: "KH", isCore: true },
      { code: "PA3.4", text: "Describe the morphology of acute and chronic inflammation", domain: "KH", isCore: true },
      { code: "PA3.5", text: "Describe and discuss granulomatous inflammation", domain: "KH", isCore: true },
      { code: "PA3.6", text: "Describe the process of wound healing and repair", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa4", module: "PA4", title: "Hemodynamic Disorders",
    subspecialty: "general-pathology", topicSlugs: ["hemodynamics"],
    competencies: [
      { code: "PA4.1", text: "Describe the etiology, pathogenesis of edema", domain: "KH", isCore: true },
      { code: "PA4.2", text: "Describe the pathogenesis, morphology and effects of thrombosis", domain: "KH", isCore: true },
      { code: "PA4.3", text: "Describe the pathogenesis, types, evolution and effects of embolism", domain: "KH", isCore: true },
      { code: "PA4.4", text: "Describe the types, pathogenesis and morphology of infarction", domain: "KH", isCore: true },
      { code: "PA4.5", text: "Describe the pathology of shock — types, stages, morphology", domain: "KH", isCore: true },
      { code: "PA4.6", text: "Describe DIC — etiology, pathogenesis, morphology", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa5", module: "PA5", title: "Immunopathology",
    subspecialty: "general-pathology", topicSlugs: ["immunopathology"],
    competencies: [
      { code: "PA5.1", text: "Describe the mechanisms of hypersensitivity reactions — Type I, II, III, IV", domain: "KH", isCore: true },
      { code: "PA5.2", text: "Describe the pathogenesis and pathology of autoimmune diseases — SLE, RA", domain: "KH", isCore: true },
      { code: "PA5.3", text: "Describe the pathology of transplant rejection", domain: "KH", isCore: true },
      { code: "PA5.4", text: "Describe the pathology of immunodeficiency diseases including AIDS", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa6", module: "PA6", title: "Neoplasia — General",
    subspecialty: "general-pathology", topicSlugs: ["neoplasia"],
    competencies: [
      { code: "PA6.1", text: "Describe the nomenclature and classification of neoplasms", domain: "KH", isCore: true },
      { code: "PA6.2", text: "Describe the characteristics of benign and malignant neoplasms", domain: "KH", isCore: true },
      { code: "PA6.3", text: "Describe the molecular basis of cancer — oncogenes, tumor suppressor genes", domain: "KH", isCore: true },
      { code: "PA6.4", text: "Describe the etiology of cancer — chemical, physical, biological agents", domain: "KH", isCore: true },
      { code: "PA6.5", text: "Describe the spread of tumors — invasion, metastasis", domain: "KH", isCore: true },
      { code: "PA6.6", text: "Describe the staging and grading of cancer", domain: "KH", isCore: true },
      { code: "PA6.7", text: "Describe the laboratory diagnosis of cancer — biopsy, cytology, tumor markers", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa7", module: "PA7", title: "Nutritional & Environmental Pathology",
    subspecialty: "general-pathology", topicSlugs: ["nutritional-pathology"],
    competencies: [
      { code: "PA7.1", text: "Describe the pathology of nutritional deficiencies", domain: "KH", isCore: true },
      { code: "PA7.2", text: "Describe the pathology of environmental and occupational diseases", domain: "K", isCore: true },
    ],
  },
  {
    id: "pa8", module: "PA8", title: "Genetic & Pediatric Diseases",
    subspecialty: "general-pathology", topicSlugs: ["genetic-diseases"],
    competencies: [
      { code: "PA8.1", text: "Describe the pathogenesis of genetic diseases — single gene, chromosomal, multifactorial", domain: "KH", isCore: true },
      { code: "PA8.2", text: "Describe the pathology of common genetic diseases — Down syndrome, Turner, Klinefelter", domain: "KH", isCore: true },
      { code: "PA8.3", text: "Describe the pathology of storage diseases", domain: "K", isCore: true },
    ],
  },
  {
    id: "pa9", module: "PA9", title: "Infectious Diseases — Pathology",
    subspecialty: "general-pathology", topicSlugs: ["infectious-pathology"],
    competencies: [
      { code: "PA9.1", text: "Describe the pathology of tuberculosis", domain: "KH", isCore: true },
      { code: "PA9.2", text: "Describe the pathology of leprosy", domain: "KH", isCore: true },
      { code: "PA9.3", text: "Describe the pathology of fungal infections", domain: "K", isCore: true },
    ],
  },
  {
    id: "pa10", module: "PA10", title: "Aging & Degenerative Diseases",
    subspecialty: "general-pathology", topicSlugs: ["aging"],
    competencies: [
      { code: "PA10.1", text: "Describe the pathology of aging", domain: "K", isCore: true },
    ],
  },
  // ─── Hematopathology (PA11–PA17) ───
  {
    id: "pa11", module: "PA11", title: "Anemia — Classification & Approach",
    subspecialty: "hematopathology", topicSlugs: ["anemia-classification"],
    competencies: [
      { code: "PA11.1", text: "Describe the morphological classification of anemias and approach to diagnosis", domain: "KH", isCore: true },
      { code: "PA11.2", text: "Describe the laboratory tests for anemia — CBC, peripheral smear, reticulocyte count", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa12", module: "PA12", title: "Iron Deficiency & Megaloblastic Anemia",
    subspecialty: "hematopathology", topicSlugs: ["iron-deficiency-anemia", "megaloblastic-anemia"],
    competencies: [
      { code: "PA12.1", text: "Describe the etiology, pathogenesis, lab features of iron deficiency anemia", domain: "KH", isCore: true },
      { code: "PA12.2", text: "Describe the etiology, pathogenesis, lab features of megaloblastic anemia", domain: "KH", isCore: true },
      { code: "PA12.3", text: "Describe the pathology of aplastic anemia", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa13", module: "PA13", title: "Hemolytic Anemias",
    subspecialty: "hematopathology", topicSlugs: ["hemolytic-anemias"],
    competencies: [
      { code: "PA13.1", text: "Describe the classification of hemolytic anemias", domain: "KH", isCore: true },
      { code: "PA13.2", text: "Describe the pathology of sickle cell disease", domain: "KH", isCore: true },
      { code: "PA13.3", text: "Describe the pathology of thalassemia", domain: "KH", isCore: true },
      { code: "PA13.4", text: "Describe the pathology of hereditary spherocytosis and G6PD deficiency", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa14", module: "PA14", title: "White Blood Cell Disorders & Leukemia",
    subspecialty: "hematopathology", topicSlugs: ["leukemia"],
    competencies: [
      { code: "PA14.1", text: "Describe the pathology of leukocytosis, leukopenia, leukemoid reaction", domain: "KH", isCore: true },
      { code: "PA14.2", text: "Describe the classification and pathology of acute and chronic leukemias", domain: "KH", isCore: true },
      { code: "PA14.3", text: "Describe the laboratory diagnosis of leukemia", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa15", module: "PA15", title: "Lymphoma & Multiple Myeloma",
    subspecialty: "hematopathology", topicSlugs: ["lymphoma"],
    competencies: [
      { code: "PA15.1", text: "Describe the pathology and classification of Hodgkin and Non-Hodgkin lymphoma", domain: "KH", isCore: true },
      { code: "PA15.2", text: "Describe the pathology of multiple myeloma", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa16", module: "PA16", title: "Bleeding Disorders",
    subspecialty: "hematopathology", topicSlugs: ["bleeding-disorders"],
    competencies: [
      { code: "PA16.1", text: "Describe the pathology of platelet disorders — ITP, TTP", domain: "KH", isCore: true },
      { code: "PA16.2", text: "Describe the pathology of coagulation disorders — hemophilia, von Willebrand disease", domain: "KH", isCore: true },
      { code: "PA16.3", text: "Describe the laboratory tests for bleeding disorders — BT, CT, PT, aPTT", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa17", module: "PA17", title: "Blood Banking & Transfusion",
    subspecialty: "hematopathology", topicSlugs: ["blood-banking"],
    competencies: [
      { code: "PA17.1", text: "Describe the blood group systems — ABO and Rh", domain: "KH", isCore: true },
      { code: "PA17.2", text: "Describe the principles of blood grouping and cross-matching", domain: "SH", isCore: true },
      { code: "PA17.3", text: "Describe the transfusion reactions and their management", domain: "KH", isCore: true },
    ],
  },
  // ─── Systemic Pathology (PA18–PA33) ───
  {
    id: "pa18", module: "PA18", title: "CVS Pathology — I",
    subspecialty: "cardiovascular-pathology", topicSlugs: ["atherosclerosis-ihd"],
    competencies: [
      { code: "PA18.1", text: "Describe the pathology of atherosclerosis and its complications", domain: "KH", isCore: true },
      { code: "PA18.2", text: "Describe the pathology of ischemic heart disease — MI", domain: "KH", isCore: true },
      { code: "PA18.3", text: "Describe the pathology of hypertensive heart disease", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa19", module: "PA19", title: "CVS Pathology — II",
    subspecialty: "cardiovascular-pathology", topicSlugs: ["valvular-heart-disease"],
    competencies: [
      { code: "PA19.1", text: "Describe the pathology of rheumatic heart disease", domain: "KH", isCore: true },
      { code: "PA19.2", text: "Describe the pathology of infective endocarditis", domain: "KH", isCore: true },
      { code: "PA19.3", text: "Describe the pathology of congenital heart diseases", domain: "K", isCore: true },
      { code: "PA19.4", text: "Describe the pathology of cardiomyopathies", domain: "K", isCore: true },
    ],
  },
  {
    id: "pa20", module: "PA20", title: "Respiratory Pathology — I",
    subspecialty: "respiratory-pathology", topicSlugs: ["lung-infections"],
    competencies: [
      { code: "PA20.1", text: "Describe the pathology of pneumonia — lobar, bronchopneumonia, viral, fungal", domain: "KH", isCore: true },
      { code: "PA20.2", text: "Describe the pathology of lung abscess", domain: "KH", isCore: true },
      { code: "PA20.3", text: "Describe the pathology of COPD — chronic bronchitis, emphysema", domain: "KH", isCore: true },
      { code: "PA20.4", text: "Describe the pathology of bronchial asthma", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa21", module: "PA21", title: "Respiratory Pathology — II",
    subspecialty: "respiratory-pathology", topicSlugs: ["lung-tumors"],
    competencies: [
      { code: "PA21.1", text: "Describe the pathology of carcinoma lung", domain: "KH", isCore: true },
      { code: "PA21.2", text: "Describe the pathology of pleural diseases — effusion, mesothelioma", domain: "KH", isCore: true },
      { code: "PA21.3", text: "Describe the pathology of occupational lung diseases — pneumoconiosis", domain: "K", isCore: true },
    ],
  },
  {
    id: "pa22", module: "PA22", title: "GI Pathology — I",
    subspecialty: "gi-pathology", topicSlugs: ["esophagus-stomach"],
    competencies: [
      { code: "PA22.1", text: "Describe the pathology of oral cancer", domain: "KH", isCore: true },
      { code: "PA22.2", text: "Describe the pathology of esophagitis and esophageal carcinoma", domain: "KH", isCore: true },
      { code: "PA22.3", text: "Describe the pathology of peptic ulcer disease", domain: "KH", isCore: true },
      { code: "PA22.4", text: "Describe the pathology of gastric carcinoma", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa23", module: "PA23", title: "GI Pathology — II",
    subspecialty: "gi-pathology", topicSlugs: ["intestinal-pathology"],
    competencies: [
      { code: "PA23.1", text: "Describe the pathology of appendicitis", domain: "KH", isCore: true },
      { code: "PA23.2", text: "Describe the pathology of inflammatory bowel disease — Crohn's, UC", domain: "KH", isCore: true },
      { code: "PA23.3", text: "Describe the pathology of colorectal carcinoma and polyps", domain: "KH", isCore: true },
      { code: "PA23.4", text: "Describe the pathology of intestinal obstruction and malabsorption", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa24", module: "PA24", title: "Liver & Biliary Pathology",
    subspecialty: "gi-pathology", topicSlugs: ["liver-pathology"],
    competencies: [
      { code: "PA24.1", text: "Describe the pathology of hepatitis — viral, alcoholic, drug-induced", domain: "KH", isCore: true },
      { code: "PA24.2", text: "Describe the pathology of cirrhosis of liver", domain: "KH", isCore: true },
      { code: "PA24.3", text: "Describe the pathology of hepatocellular carcinoma", domain: "KH", isCore: true },
      { code: "PA24.4", text: "Describe the pathology of gallbladder diseases — cholelithiasis, carcinoma", domain: "KH", isCore: true },
      { code: "PA24.5", text: "Describe the pathology of pancreatitis and pancreatic carcinoma", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa25", module: "PA25", title: "Renal Pathology — I",
    subspecialty: "renal-pathology", topicSlugs: ["glomerulonephritis"],
    competencies: [
      { code: "PA25.1", text: "Describe the pathology of glomerulonephritis — classification, pathogenesis", domain: "KH", isCore: true },
      { code: "PA25.2", text: "Describe the pathology of nephrotic and nephritic syndromes", domain: "KH", isCore: true },
      { code: "PA25.3", text: "Describe the pathology of acute and chronic renal failure", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa26", module: "PA26", title: "Renal Pathology — II",
    subspecialty: "renal-pathology", topicSlugs: ["renal-tumors"],
    competencies: [
      { code: "PA26.1", text: "Describe the pathology of pyelonephritis and urinary tract infections", domain: "KH", isCore: true },
      { code: "PA26.2", text: "Describe the pathology of renal cell carcinoma and Wilms tumor", domain: "KH", isCore: true },
      { code: "PA26.3", text: "Describe the pathology of urolithiasis", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa27", module: "PA27", title: "Endocrine Pathology — I",
    subspecialty: "endocrine-pathology", topicSlugs: ["thyroid-pathology"],
    competencies: [
      { code: "PA27.1", text: "Describe the pathology of thyroid diseases — goitre, thyroiditis, tumors", domain: "KH", isCore: true },
      { code: "PA27.2", text: "Describe the pathology of diabetes mellitus — type 1, type 2, complications", domain: "KH", isCore: true },
      { code: "PA27.3", text: "Describe the pathology of parathyroid diseases", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa28", module: "PA28", title: "Endocrine Pathology — II",
    subspecialty: "endocrine-pathology", topicSlugs: ["adrenal-pituitary"],
    competencies: [
      { code: "PA28.1", text: "Describe the pathology of pituitary diseases — adenomas, hypopituitarism", domain: "KH", isCore: true },
      { code: "PA28.2", text: "Describe the pathology of adrenal diseases — Cushing, Addison, pheochromocytoma", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa29", module: "PA29", title: "Male Reproductive Pathology",
    subspecialty: "reproductive-pathology", topicSlugs: ["male-reproductive"],
    competencies: [
      { code: "PA29.1", text: "Describe the pathology of testicular tumors", domain: "KH", isCore: true },
      { code: "PA29.2", text: "Describe the pathology of BPH and carcinoma prostate", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa30", module: "PA30", title: "Female Reproductive Pathology",
    subspecialty: "reproductive-pathology", topicSlugs: ["female-reproductive"],
    competencies: [
      { code: "PA30.1", text: "Describe the pathology of cervical carcinoma and Pap smear screening", domain: "KH", isCore: true },
      { code: "PA30.2", text: "Describe the pathology of endometrial carcinoma and endometriosis", domain: "KH", isCore: true },
      { code: "PA30.3", text: "Describe the pathology of ovarian tumors — classification and common types", domain: "KH", isCore: true },
      { code: "PA30.4", text: "Describe the pathology of gestational trophoblastic disease", domain: "KH", isCore: true },
      { code: "PA30.5", text: "Describe the pathology of breast diseases — fibroadenoma, fibrocystic disease, carcinoma", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa31", module: "PA31", title: "Bone & Joint Pathology",
    subspecialty: "general-pathology", topicSlugs: ["bone-joint"],
    competencies: [
      { code: "PA31.1", text: "Describe the pathology of bone tumors — benign and malignant", domain: "KH", isCore: true },
      { code: "PA31.2", text: "Describe the pathology of osteomyelitis", domain: "KH", isCore: true },
      { code: "PA31.3", text: "Describe the pathology of metabolic bone diseases — osteoporosis, rickets, Paget's", domain: "KH", isCore: true },
    ],
  },
  {
    id: "pa32", module: "PA32", title: "CNS Pathology",
    subspecialty: "neuropathology", topicSlugs: ["cns-pathology"],
    competencies: [
      { code: "PA32.1", text: "Describe the pathology of CNS tumors — gliomas, meningiomas", domain: "K", isCore: true },
      { code: "PA32.2", text: "Describe the pathology of cerebrovascular disease — stroke, hemorrhage", domain: "KH", isCore: true },
      { code: "PA32.3", text: "Describe the pathology of meningitis and encephalitis", domain: "KH", isCore: true },
      { code: "PA32.4", text: "Describe the pathology of demyelinating diseases", domain: "K", isCore: true },
    ],
  },
  {
    id: "pa33", module: "PA33", title: "Skin Pathology",
    subspecialty: "general-pathology", topicSlugs: ["skin-pathology"],
    competencies: [
      { code: "PA33.1", text: "Describe the pathology of common skin diseases — dermatitis, psoriasis", domain: "K", isCore: true },
      { code: "PA33.2", text: "Describe the pathology of skin tumors — melanoma, BCC, SCC", domain: "KH", isCore: true },
    ],
  },
  // ─── Clinical Pathology (PA34–PA35) ───
  {
    id: "pa34", module: "PA34", title: "Clinical Pathology — Body Fluids",
    subspecialty: "general-topics", topicSlugs: ["body-fluids"],
    competencies: [
      { code: "PA34.1", text: "Describe the examination of urine — physical, chemical, microscopic", domain: "SH", isCore: true },
      { code: "PA34.2", text: "Describe the examination of CSF", domain: "SH", isCore: true },
      { code: "PA34.3", text: "Describe the examination of serous fluids — pleural, peritoneal, synovial", domain: "SH", isCore: true },
      { code: "PA34.4", text: "Describe the examination of semen", domain: "K", isCore: true },
    ],
  },
  {
    id: "pa35", module: "PA35", title: "Clinical Pathology — Lab Techniques",
    subspecialty: "general-topics", topicSlugs: ["lab-techniques"],
    competencies: [
      { code: "PA35.1", text: "Perform and interpret peripheral blood smear examination", domain: "SH", isCore: true },
      { code: "PA35.2", text: "Perform and interpret bone marrow aspiration smear", domain: "SH", isCore: true },
      { code: "PA35.3", text: "Describe the principles and interpret common laboratory tests — LFT, RFT, lipid profile", domain: "KH", isCore: true },
    ],
  },
];

// ─── PG: MD Pathology Topics ────────────────────────────────────────────────

export const PATHOLOGY_PG_TOPICS: PathologyPGTopic[] = [
  { id: "pg-gen-01", title: "Cell Injury, Inflammation & Healing — Advanced", section: "General Pathology", subspecialty: "general-pathology", topicSlugs: ["cell-injury", "inflammation"], ugModuleRefs: ["PA2", "PA3"] },
  { id: "pg-gen-02", title: "Hemodynamics, Thrombosis & Shock — Advanced", section: "General Pathology", subspecialty: "general-pathology", topicSlugs: ["hemodynamics"], ugModuleRefs: ["PA4"] },
  { id: "pg-gen-03", title: "Immunopathology & Autoimmune Diseases — Advanced", section: "General Pathology", subspecialty: "general-pathology", topicSlugs: ["immunopathology"], ugModuleRefs: ["PA5"] },
  { id: "pg-gen-04", title: "Neoplasia — Molecular Pathology, Tumor Biology", section: "General Pathology", subspecialty: "general-pathology", topicSlugs: ["neoplasia"], ugModuleRefs: ["PA6"] },
  { id: "pg-gen-05", title: "Genetic & Pediatric Pathology — Advanced", section: "General Pathology", subspecialty: "general-pathology", topicSlugs: ["genetic-diseases"], ugModuleRefs: ["PA8"] },
  { id: "pg-heme-01", title: "Anemia — Iron Deficiency, Megaloblastic, Hemolytic", section: "Hematopathology", subspecialty: "hematopathology", topicSlugs: ["iron-deficiency-anemia", "megaloblastic-anemia", "hemolytic-anemias"], ugModuleRefs: ["PA12", "PA13"] },
  { id: "pg-heme-02", title: "Leukemia & Lymphoma — Diagnosis & Classification", section: "Hematopathology", subspecialty: "hematopathology", topicSlugs: ["leukemia", "lymphoma"], ugModuleRefs: ["PA14", "PA15"] },
  { id: "pg-heme-03", title: "Bleeding Disorders & Coagulopathies", section: "Hematopathology", subspecialty: "hematopathology", topicSlugs: ["bleeding-disorders"], ugModuleRefs: ["PA16"] },
  { id: "pg-heme-04", title: "Blood Banking, Transfusion Medicine & Hemotherapy", section: "Hematopathology", subspecialty: "hematopathology", topicSlugs: ["blood-banking"], ugModuleRefs: ["PA17"] },
  { id: "pg-sys-01", title: "Cardiovascular Pathology — Atherosclerosis, IHD, Valvular Disease", section: "Systemic Pathology", subspecialty: "cardiovascular-pathology", topicSlugs: ["atherosclerosis-ihd", "valvular-heart-disease"], ugModuleRefs: ["PA18", "PA19"] },
  { id: "pg-sys-02", title: "Respiratory Pathology — Infections, COPD, Neoplasms", section: "Systemic Pathology", subspecialty: "respiratory-pathology", topicSlugs: ["lung-infections", "lung-tumors"], ugModuleRefs: ["PA20", "PA21"] },
  { id: "pg-sys-03", title: "GI & Hepatobiliary Pathology", section: "Systemic Pathology", subspecialty: "gi-pathology", topicSlugs: ["esophagus-stomach", "intestinal-pathology", "liver-pathology"], ugModuleRefs: ["PA22", "PA23", "PA24"] },
  { id: "pg-sys-04", title: "Renal Pathology — Glomerulonephritis, Tumors", section: "Systemic Pathology", subspecialty: "renal-pathology", topicSlugs: ["glomerulonephritis", "renal-tumors"], ugModuleRefs: ["PA25", "PA26"] },
  { id: "pg-sys-05", title: "Endocrine Pathology — Thyroid, Adrenal, Pituitary, Diabetes", section: "Systemic Pathology", subspecialty: "endocrine-pathology", topicSlugs: ["thyroid-pathology", "adrenal-pituitary"], ugModuleRefs: ["PA27", "PA28"] },
  { id: "pg-sys-06", title: "Reproductive Pathology & Breast — Tumors, Cytology", section: "Systemic Pathology", subspecialty: "reproductive-pathology", topicSlugs: ["male-reproductive", "female-reproductive"], ugModuleRefs: ["PA29", "PA30"] },
  { id: "pg-sys-07", title: "Neuropathology — CNS Tumors, Infections, Demyelination", section: "Systemic Pathology", subspecialty: "neuropathology", topicSlugs: ["cns-pathology"], ugModuleRefs: ["PA32"] },
  { id: "pg-clin-01", title: "Surgical Pathology & Histopathology Reporting", section: "Clinical Pathology", subspecialty: "general-topics", topicSlugs: ["lab-techniques"], ugModuleRefs: ["PA35"] },
  { id: "pg-clin-02", title: "Cytopathology — FNAC, Pap Smear, Body Fluid Cytology", section: "Clinical Pathology", subspecialty: "general-topics", topicSlugs: ["body-fluids"], ugModuleRefs: ["PA34"] },
  { id: "pg-sys-08", title: "Cardiovascular Pathology — Cardiomyopathy, Congenital", section: "Systemic Pathology", subspecialty: "cardiovascular-pathology", topicSlugs: ["valvular-heart-disease"], ugModuleRefs: ["PA19"] },
  { id: "pg-sys-09", title: "Respiratory Pathology — Occupational & Pleural Diseases", section: "Systemic Pathology", subspecialty: "respiratory-pathology", topicSlugs: ["lung-tumors"], ugModuleRefs: ["PA21"] },
  { id: "pg-sys-10", title: "GI Pathology — Malabsorption & IBD Advanced", section: "Systemic Pathology", subspecialty: "gi-pathology", topicSlugs: ["intestinal-pathology"], ugModuleRefs: ["PA23"] },
  { id: "pg-sys-11", title: "Renal Pathology — Tubulointerstitial & Vascular", section: "Systemic Pathology", subspecialty: "renal-pathology", topicSlugs: ["glomerulonephritis"], ugModuleRefs: ["PA25"] },
  { id: "pg-sys-12", title: "Endocrine Pathology — MEN Syndromes", section: "Systemic Pathology", subspecialty: "endocrine-pathology", topicSlugs: ["adrenal-pituitary"], ugModuleRefs: ["PA28"] },
  { id: "pg-sys-13", title: "Reproductive Pathology — GTD & Placental Pathology", section: "Systemic Pathology", subspecialty: "reproductive-pathology", topicSlugs: ["female-reproductive"], ugModuleRefs: ["PA30"] },
];

// ─── Helper functions ────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return PATHOLOGY_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): PathologyUGModule[] {
  return PATHOLOGY_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): PathologyPGTopic[] {
  return PATHOLOGY_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
