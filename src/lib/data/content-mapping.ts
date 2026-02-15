/**
 * Content Mapping - Maps subjects, subspecialties, and topics to rich markdown content
 * 
 * This connects the library structure to the /content/ folder
 */

// Maps subject slugs to content folder names
export const SUBJECT_CONTENT_MAP: Record<string, string> = {
  'surgery': 'surgery',
  'medicine': 'medicine',
  'obgyn': 'obgyn',
  'pediatrics': 'pediatrics',
  'orthopedics': 'orthopedics',
  'anatomy': 'anatomy',
  'physiology': 'physiology',
  'biochemistry': 'biochemistry',
  'pathology': 'pathology',
  'pharmacology': 'pharmacology',
  'microbiology': 'microbiology',
  'forensic': 'forensic',
};

// Maps subspecialty slugs to content folder names (within each subject)
export const SUBSPECIALTY_CONTENT_MAP: Record<string, Record<string, string>> = {
  // SURGERY
  'surgery': {
    'esophagus': 'esophagus',
    'general-topics': '01-general-topics',
    'head-neck': '02-head-neck',
    'breast': 'breast',
    'stomach-duodenum': '05-upper-gi',
    'upper-gi': '05-upper-gi',
    'hepatobiliary': '06-hepatobiliary',
    'pancreas': '07-pancreas',
    'small-intestine': '08-small-intestine',
    'colorectal': '09-colon-rectum',
    'anorectal': '10-anorectal',
    'hernia': '11-hernias',
    'hernias': '11-hernias',
    'vascular': '13-vascular',
    'spleen': 'spleen',
    'liver': 'liver',
    'stomach': 'stomach',
    'biliary': 'biliary',
    'colon': 'colon',
  },
  // MEDICINE
  'medicine': {
    'cardiology': 'cardiology',
    'gastroenterology': 'gastroenterology',
    'pulmonology': 'pulmonology',
    'nephrology': 'nephrology',
    'endocrinology': 'endocrinology',
    'hematology': 'hematology',
    'rheumatology': 'rheumatology',
    'neurology': 'neurology',
    'infectious-diseases': 'infectious-diseases',
    'critical-care': 'critical-care',
    'dermatology': 'dermatology',
    'psychiatry': 'psychiatry',
    'geriatrics': 'geriatrics',
    'emergency': 'emergency',
  },
  // OB-GYN
  'obgyn': {
    'obstetrics': 'obstetrics',
    'gynecology': 'gynecology',
    'fetal-medicine': 'fetal-medicine',
    'high-risk-pregnancy': 'high-risk-pregnancy',
    'labor-delivery': 'labor-delivery',
    'gynec-oncology': 'gynec-oncology',
    'reproductive-endo': 'reproductive-endo',
    'infertility': 'infertility',
    'contraception': 'contraception',
    'urogynecology': 'urogynecology',
    'benign-gynecology': 'benign-gynecology',
    'antenatal-care': 'antenatal-care',
  },
  // PEDIATRICS
  'pediatrics': {
    'neonatology': 'neonatology',
    'growth-development': 'growth-development',
    'nutrition': 'nutrition',
    'infectious-diseases': 'infectious-diseases',
    'respiratory': 'respiratory',
    'cardiac': 'cardiac',
    'gi-pediatrics': 'gi-pediatrics',
    'hematology-oncology': 'hematology-oncology',
  },
  // ORTHOPEDICS
  'orthopedics': {
    'trauma': 'trauma',
    'spine': 'spine',
    'joints': 'joints',
    'pediatric-ortho': 'pediatric-ortho',
    'hand-surgery': 'hand-surgery',
    'sports-medicine': 'sports-medicine',
    'bone-diseases': 'bone-diseases',
  },
  // FORENSIC
  'forensic': {
    'thanatology': 'thanatology',
    'traumatology': 'traumatology',
    'toxicology': 'toxicology',
    'sexual-offenses': 'sexual-offenses',
    'medical-jurisprudence': 'medical-jurisprudence',
    'identification': 'identification',
  },
};

// Maps topic slugs to markdown filenames (without .md extension)
export const TOPIC_CONTENT_MAP: Record<string, Record<string, Record<string, string>>> = {
  // SURGERY
  'surgery': {
    'esophagus': {
      'esophageal-anatomy': 'Esophageal Anatomy',
      'gerd': 'GERD',
      'surgical-gerd': 'Surgical Management of GERD',
      'achalasia': 'Achalasia Cardia',
      'achalasia-surgery': 'Achalasia - LHM vs POEM',
      'motility-disorders': 'Esophageal Motility Disorders',
      'les-physiology': 'LES Physiology',
      'manometry': 'Esophageal Manometry',
      'fundoplication': 'Fundoplication',
      'heller-myotomy': 'Heller Myotomy Technique',
      'poem': 'POEM Procedure',
      'esophageal-reconstruction': 'Esophageal Reconstruction',
      'zenker-diverticulum': 'Zenker Diverticulum',
    },
    'biliary': {
      'cholelithiasis': 'Cholelithiasis',
      'acute-cholecystitis': 'Acute Cholecystitis',
      'choledocholithiasis': 'Choledocholithiasis',
      'cholangitis': 'Cholangitis',
      'biliary-dyskinesia': 'Biliary Dyskinesia',
    },
    'stomach': {
      'gastric-cancer': 'Gastric Cancer',
      'upper-gi-bleeding': 'Upper GI Bleeding',
    },
    'pancreas': {
      'acute-pancreatitis': 'Acute Pancreatitis',
      'pancreatic-cancer': 'Pancreatic Cancer',
    },
    'liver': {
      'hcc': 'Hepatocellular Carcinoma',
    },
    'spleen': {
      'splenic-trauma': 'Splenic Trauma',
      'splenectomy': 'Splenectomy Indications',
      'hypersplenism': 'Hypersplenism',
      'opsi': 'OPSI',
    },
    'colon': {
      'colorectal-cancer': 'Colorectal Cancer',
      'bowel-obstruction': 'Bowel Obstruction',
      'lower-gi-bleeding': 'Lower GI Bleeding',
    },
    'hernia': {
      'inguinal-hernia': 'Inguinal Hernia',
      'femoral-hernia': 'Femoral Hernia',
      'incisional-hernia': 'Incisional Hernia',
      'umbilical-hernia': 'Umbilical Hernia',
      'hiatal-hernia': 'Hiatal Hernia',
    },
  },
  // MEDICINE
  'medicine': {
    'cardiology': {
      'ischemic-heart-disease': 'ischemic-heart-disease',
      'heart-failure': 'heart-failure',
      'arrhythmias': 'arrhythmias',
      'hypertension': 'hypertension',
      'valvular-heart-disease': 'valvular-heart-disease',
    },
    'gastroenterology': {
      'liver-cirrhosis': 'liver-cirrhosis',
      'inflammatory-bowel-disease': 'inflammatory-bowel-disease',
      'peptic-ulcer-disease': 'peptic-ulcer-disease',
      'gerd': 'gerd',
      'acute-pancreatitis': 'acute-pancreatitis',
    },
  },
  // OB-GYN
  'obgyn': {
    'high-risk-pregnancy': {
      'pregnancy-induced-hypertension': 'pregnancy-induced-hypertension',
      'gestational-diabetes': 'gestational-diabetes',
      'antepartum-hemorrhage': 'antepartum-hemorrhage',
      'rh-isoimmunization': 'rh-isoimmunization',
      'multiple-pregnancy': 'multiple-pregnancy',
    },
    'gynec-oncology': {
      'cervical-cancer': 'cervical-cancer',
      'ovarian-cancer': 'ovarian-cancer',
      'endometrial-cancer': 'endometrial-cancer',
      'vulvar-cancer': 'vulvar-cancer',
      'gestational-trophoblastic-disease': 'gestational-trophoblastic-disease',
    },
  },
  // PEDIATRICS
  'pediatrics': {
    'neonatology': {
      'respiratory-distress-syndrome': 'respiratory-distress-syndrome',
      'neonatal-jaundice': 'neonatal-jaundice',
      'neonatal-sepsis': 'neonatal-sepsis',
      'necrotizing-enterocolitis': 'necrotizing-enterocolitis',
      'prematurity': 'prematurity',
    },
    'infectious-diseases': {
      'measles': 'measles',
      'acute-diarrhea': 'acute-diarrhea',
      'bacterial-meningitis': 'bacterial-meningitis',
      'upper-respiratory-infections': 'upper-respiratory-infections',
      'vaccine-preventable-diseases': 'vaccine-preventable-diseases',
    },
  },
};

// Get content folder for a subject
export function getSubjectFolder(subjectSlug: string): string | null {
  return SUBJECT_CONTENT_MAP[subjectSlug] || null;
}

// Get content folder for a subspecialty within a subject
export function getContentFolder(subjectSlug: string, subspecialtySlug: string): string | null {
  const subjectMap = SUBSPECIALTY_CONTENT_MAP[subjectSlug];
  if (!subjectMap) return null;
  return subjectMap[subspecialtySlug] || null;
}

// Get content filename for a topic (legacy - for surgery only)
export function getContentFilename(subspecialtySlug: string, topicSlug: string): string | null {
  // Legacy support for surgery
  const surgeryTopics = TOPIC_CONTENT_MAP['surgery'];
  if (!surgeryTopics) return null;
  
  // Find the folder for this subspecialty
  const folder = SUBSPECIALTY_CONTENT_MAP['surgery']?.[subspecialtySlug];
  if (!folder) return null;
  
  const topicMap = surgeryTopics[folder];
  if (!topicMap) return null;
  
  return topicMap[topicSlug] || null;
}

// Get content filename for a topic (full path)
export function getContentFilenameForSubject(subjectSlug: string, subspecialtySlug: string, topicSlug: string): string | null {
  const subjectTopics = TOPIC_CONTENT_MAP[subjectSlug];
  if (!subjectTopics) return null;
  
  const folder = getContentFolder(subjectSlug, subspecialtySlug);
  if (!folder) return null;
  
  const topicMap = subjectTopics[folder];
  if (!topicMap) return null;
  
  return topicMap[topicSlug] || null;
}

// Check if rich content exists for a topic (legacy)
export function hasRichContent(subspecialtySlug: string, topicSlug: string): boolean {
  return getContentFilename(subspecialtySlug, topicSlug) !== null;
}

// Check if rich content exists for a topic (full)
export function hasRichContentForSubject(subjectSlug: string, subspecialtySlug: string, topicSlug: string): boolean {
  return getContentFilenameForSubject(subjectSlug, subspecialtySlug, topicSlug) !== null;
}

// Get all topics with rich content for a subspecialty
export function getRichTopics(subjectSlug: string, subspecialtySlug: string): string[] {
  const folder = getContentFolder(subjectSlug, subspecialtySlug);
  if (!folder) return [];
  
  const subjectTopics = TOPIC_CONTENT_MAP[subjectSlug];
  if (!subjectTopics) return [];
  
  const topicMap = subjectTopics[folder];
  if (!topicMap) return [];
  
  return Object.keys(topicMap);
}
