// CBME Competencies Data Layer
// Auto-generated from NMC CBME curriculum

export interface Competency {
  code: string;
  subject: string;
  phase: 'Phase-1' | 'Phase-2' | 'Phase-3A' | 'Phase-3B';
  description: string;
  type: 'K' | 'S' | 'A' | 'C'; // Knowledge, Skill, Attitude, Communication
  level: 'Must Know' | 'Should Know' | 'Nice to Know';
  domain: 'Cognitive' | 'Psychomotor' | 'Affective';
  core: boolean;
  linkedTopics?: string[]; // Library topic IDs
  xpReward: number;
}

export interface CompetencyProgress {
  competencyCode: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'mastered';
  completedAt?: Date;
  xpEarned: number;
}

// Phase 1 - Basic Sciences (Year 1)
export const phase1Competencies: Competency[] = [
  // Anatomy
  { code: 'AN1.1', subject: 'Anatomy', phase: 'Phase-1', description: 'Describe & demonstrate the anatomical position, terms, planes & movements', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['general-anatomy'], xpReward: 10 },
  { code: 'AN1.2', subject: 'Anatomy', phase: 'Phase-1', description: 'Describe the basic structure of a cell, its components & their functions', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['general-anatomy'], xpReward: 10 },
  { code: 'AN2.1', subject: 'Anatomy', phase: 'Phase-1', description: 'Describe and demonstrate the bones of the upper limb', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['upper-limb'], xpReward: 15 },
  { code: 'AN2.2', subject: 'Anatomy', phase: 'Phase-1', description: 'Describe the formation, branches & distribution of brachial plexus', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['upper-limb'], xpReward: 20 },
  { code: 'AN2.3', subject: 'Anatomy', phase: 'Phase-1', description: 'Describe & demonstrate the muscles of upper limb', type: 'S', level: 'Must Know', domain: 'Psychomotor', core: true, linkedTopics: ['upper-limb'], xpReward: 15 },
  { code: 'AN3.1', subject: 'Anatomy', phase: 'Phase-1', description: 'Describe and demonstrate the bones of lower limb', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['lower-limb'], xpReward: 15 },
  { code: 'AN3.2', subject: 'Anatomy', phase: 'Phase-1', description: 'Describe the lumbar and sacral plexus', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['lower-limb'], xpReward: 20 },
  { code: 'AN4.1', subject: 'Anatomy', phase: 'Phase-1', description: 'Describe the anatomy of thoracic wall & diaphragm', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['thorax-anatomy'], xpReward: 15 },
  { code: 'AN4.2', subject: 'Anatomy', phase: 'Phase-1', description: 'Describe the anatomy of mediastinum & its contents', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['thorax-anatomy'], xpReward: 20 },
  { code: 'AN5.1', subject: 'Anatomy', phase: 'Phase-1', description: 'Describe the anatomy of anterior abdominal wall', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['abdomen-anatomy'], xpReward: 15 },
  { code: 'AN5.2', subject: 'Anatomy', phase: 'Phase-1', description: 'Describe the inguinal canal & its applied anatomy', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['abdomen-anatomy', 'hernia'], xpReward: 25 },
  { code: 'AN6.1', subject: 'Anatomy', phase: 'Phase-1', description: 'Describe the anatomy of head & neck regions', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['head-neck-anatomy'], xpReward: 20 },
  
  // Physiology
  { code: 'PY1.1', subject: 'Physiology', phase: 'Phase-1', description: 'Describe the structure & functions of cell membrane', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['general-physiology'], xpReward: 10 },
  { code: 'PY1.2', subject: 'Physiology', phase: 'Phase-1', description: 'Describe the transport mechanisms across cell membrane', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['general-physiology'], xpReward: 15 },
  { code: 'PY2.1', subject: 'Physiology', phase: 'Phase-1', description: 'Describe the structure & function of nerve fiber', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['nerve-muscle'], xpReward: 15 },
  { code: 'PY2.2', subject: 'Physiology', phase: 'Phase-1', description: 'Describe the physiology of neuromuscular junction', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['nerve-muscle'], xpReward: 20 },
  { code: 'PY3.1', subject: 'Physiology', phase: 'Phase-1', description: 'Describe the properties of cardiac muscle', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['cvs-physiology'], xpReward: 15 },
  { code: 'PY3.2', subject: 'Physiology', phase: 'Phase-1', description: 'Describe the cardiac cycle & its regulation', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['cvs-physiology'], xpReward: 25 },
  { code: 'PY3.3', subject: 'Physiology', phase: 'Phase-1', description: 'Describe the ECG & its clinical significance', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['cvs-physiology'], xpReward: 30 },
  { code: 'PY4.1', subject: 'Physiology', phase: 'Phase-1', description: 'Describe the mechanics of respiration', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['respiratory-physiology'], xpReward: 15 },
  { code: 'PY4.2', subject: 'Physiology', phase: 'Phase-1', description: 'Describe gas exchange & transport', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['respiratory-physiology'], xpReward: 20 },
  { code: 'PY5.1', subject: 'Physiology', phase: 'Phase-1', description: 'Describe GFR & renal blood flow', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['renal-physiology'], xpReward: 20 },
  { code: 'PY6.1', subject: 'Physiology', phase: 'Phase-1', description: 'Describe GI motility & secretions', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['gi-physiology'], xpReward: 15 },
  { code: 'PY7.1', subject: 'Physiology', phase: 'Phase-1', description: 'Describe the hormones & their mechanisms of action', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['endocrine-physiology'], xpReward: 20 },
  
  // Biochemistry
  { code: 'BI1.1', subject: 'Biochemistry', phase: 'Phase-1', description: 'Describe the structure & functions of amino acids', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['biomolecules'], xpReward: 10 },
  { code: 'BI1.2', subject: 'Biochemistry', phase: 'Phase-1', description: 'Describe the structure & functions of proteins', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['biomolecules'], xpReward: 15 },
  { code: 'BI2.1', subject: 'Biochemistry', phase: 'Phase-1', description: 'Describe the properties & classification of enzymes', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['enzymes'], xpReward: 15 },
  { code: 'BI2.2', subject: 'Biochemistry', phase: 'Phase-1', description: 'Describe enzyme kinetics & regulation', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['enzymes'], xpReward: 20 },
  { code: 'BI3.1', subject: 'Biochemistry', phase: 'Phase-1', description: 'Describe glycolysis & its regulation', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['carb-metabolism'], xpReward: 20 },
  { code: 'BI3.2', subject: 'Biochemistry', phase: 'Phase-1', description: 'Describe the TCA cycle & its significance', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['carb-metabolism'], xpReward: 25 },
  { code: 'BI4.1', subject: 'Biochemistry', phase: 'Phase-1', description: 'Describe lipid metabolism & disorders', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['lipid-metabolism'], xpReward: 20 },
  { code: 'BI5.1', subject: 'Biochemistry', phase: 'Phase-1', description: 'Describe DNA replication & repair', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['molecular-biology'], xpReward: 20 },
];

// Phase 2 - Para-clinical (Year 2)
export const phase2Competencies: Competency[] = [
  // Pathology
  { code: 'PA1.1', subject: 'Pathology', phase: 'Phase-2', description: 'Describe the causes & mechanisms of cell injury', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['general-pathology'], xpReward: 15 },
  { code: 'PA1.2', subject: 'Pathology', phase: 'Phase-2', description: 'Describe the types of necrosis & apoptosis', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['general-pathology'], xpReward: 20 },
  { code: 'PA2.1', subject: 'Pathology', phase: 'Phase-2', description: 'Describe acute & chronic inflammation', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['general-pathology'], xpReward: 25 },
  { code: 'PA3.1', subject: 'Pathology', phase: 'Phase-2', description: 'Describe hemodynamic disorders', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['general-pathology'], xpReward: 20 },
  { code: 'PA4.1', subject: 'Pathology', phase: 'Phase-2', description: 'Describe neoplasia & carcinogenesis', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['general-pathology'], xpReward: 30 },
  { code: 'PA5.1', subject: 'Pathology', phase: 'Phase-2', description: 'Describe hematological disorders', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['hematopathology'], xpReward: 25 },
  
  // Pharmacology
  { code: 'PH1.1', subject: 'Pharmacology', phase: 'Phase-2', description: 'Describe pharmacokinetics - ADME', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['general-pharmacology'], xpReward: 20 },
  { code: 'PH1.2', subject: 'Pharmacology', phase: 'Phase-2', description: 'Describe drug receptors & mechanisms', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['general-pharmacology'], xpReward: 25 },
  { code: 'PH2.1', subject: 'Pharmacology', phase: 'Phase-2', description: 'Describe autonomic pharmacology', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['ans-pharmacology'], xpReward: 25 },
  { code: 'PH3.1', subject: 'Pharmacology', phase: 'Phase-2', description: 'Describe cardiovascular drugs', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['cvs-pharmacology'], xpReward: 30 },
  { code: 'PH4.1', subject: 'Pharmacology', phase: 'Phase-2', description: 'Describe antimicrobial agents', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['antimicrobials'], xpReward: 35 },
  
  // Microbiology
  { code: 'MI1.1', subject: 'Microbiology', phase: 'Phase-2', description: 'Describe general bacteriology', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['general-microbiology'], xpReward: 15 },
  { code: 'MI2.1', subject: 'Microbiology', phase: 'Phase-2', description: 'Describe gram positive cocci', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['gram-positive'], xpReward: 20 },
  { code: 'MI3.1', subject: 'Microbiology', phase: 'Phase-2', description: 'Describe immunology basics', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['immunology'], xpReward: 25 },
  
  // Forensic Medicine
  { code: 'FM1.1', subject: 'Forensic Medicine', phase: 'Phase-2', description: 'Describe medico-legal aspects', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['medical-jurisprudence'], xpReward: 15 },
  { code: 'FM2.1', subject: 'Forensic Medicine', phase: 'Phase-2', description: 'Describe thanatology', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['thanatology'], xpReward: 20 },
];

// Phase 3 - Clinical
export const phase3Competencies: Competency[] = [
  // Medicine
  { code: 'IM1.1', subject: 'Medicine', phase: 'Phase-3B', description: 'Describe approach to fever', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['cardiology', 'pulmonology'], xpReward: 20 },
  { code: 'IM2.1', subject: 'Medicine', phase: 'Phase-3B', description: 'Describe cardiovascular diseases', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['cardiology'], xpReward: 30 },
  { code: 'IM3.1', subject: 'Medicine', phase: 'Phase-3B', description: 'Describe respiratory diseases', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['pulmonology'], xpReward: 30 },
  { code: 'IM4.1', subject: 'Medicine', phase: 'Phase-3B', description: 'Describe GI disorders', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['gastroenterology'], xpReward: 30 },
  { code: 'IM5.1', subject: 'Medicine', phase: 'Phase-3B', description: 'Describe renal disorders', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['nephrology'], xpReward: 25 },
  { code: 'IM6.1', subject: 'Medicine', phase: 'Phase-3B', description: 'Describe endocrine disorders', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['endocrinology'], xpReward: 30 },
  
  // Surgery
  { code: 'SU1.1', subject: 'Surgery', phase: 'Phase-3B', description: 'Describe surgical history & examination', type: 'S', level: 'Must Know', domain: 'Psychomotor', core: true, linkedTopics: ['esophagus', 'stomach'], xpReward: 20 },
  { code: 'SU2.1', subject: 'Surgery', phase: 'Phase-3B', description: 'Describe esophageal disorders', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['esophagus'], xpReward: 25 },
  { code: 'SU3.1', subject: 'Surgery', phase: 'Phase-3B', description: 'Describe gastric disorders', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['stomach'], xpReward: 25 },
  { code: 'SU4.1', subject: 'Surgery', phase: 'Phase-3B', description: 'Describe hepatobiliary disorders', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['hepatobiliary'], xpReward: 30 },
  { code: 'SU5.1', subject: 'Surgery', phase: 'Phase-3B', description: 'Describe pancreatic disorders', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['pancreas'], xpReward: 30 },
  { code: 'SU6.1', subject: 'Surgery', phase: 'Phase-3B', description: 'Describe colorectal disorders', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['colorectal'], xpReward: 25 },
  { code: 'SU7.1', subject: 'Surgery', phase: 'Phase-3B', description: 'Describe hernia types & repair', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['hernia'], xpReward: 25 },
  
  // OBG
  { code: 'OG1.1', subject: 'OBG', phase: 'Phase-3B', description: 'Describe antenatal care', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['obstetrics'], xpReward: 25 },
  { code: 'OG2.1', subject: 'OBG', phase: 'Phase-3B', description: 'Describe labor & delivery', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['obstetrics'], xpReward: 30 },
  { code: 'OG3.1', subject: 'OBG', phase: 'Phase-3B', description: 'Describe gynecological disorders', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['gynecology'], xpReward: 25 },
  
  // Pediatrics
  { code: 'PE1.1', subject: 'Pediatrics', phase: 'Phase-3B', description: 'Describe growth & development', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['growth-development'], xpReward: 20 },
  { code: 'PE2.1', subject: 'Pediatrics', phase: 'Phase-3B', description: 'Describe neonatal care', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['neonatology'], xpReward: 25 },
  { code: 'PE3.1', subject: 'Pediatrics', phase: 'Phase-3B', description: 'Describe pediatric nutrition', type: 'K', level: 'Must Know', domain: 'Cognitive', core: true, linkedTopics: ['pediatric-nutrition'], xpReward: 20 },
];

// All competencies combined
export const allCompetencies: Competency[] = [
  ...phase1Competencies,
  ...phase2Competencies,
  ...phase3Competencies,
];

// Helper functions
export function getCompetenciesBySubject(subject: string): Competency[] {
  return allCompetencies.filter(c => c.subject === subject);
}

export function getCompetenciesByPhase(phase: string): Competency[] {
  return allCompetencies.filter(c => c.phase === phase);
}

export function getCompetenciesByTopic(topicId: string): Competency[] {
  return allCompetencies.filter(c => c.linkedTopics?.includes(topicId));
}

export function getTotalXPForPhase(phase: string): number {
  return getCompetenciesByPhase(phase).reduce((sum, c) => sum + c.xpReward, 0);
}

export function getCompetencyStats() {
  return {
    total: allCompetencies.length,
    byPhase: {
      'Phase-1': phase1Competencies.length,
      'Phase-2': phase2Competencies.length,
      'Phase-3': phase3Competencies.length,
    },
    totalXP: allCompetencies.reduce((sum, c) => sum + c.xpReward, 0),
  };
}

// Subject list with competency counts
export const subjectsWithCompetencies = [
  { id: 'anatomy', name: 'Anatomy', phase: 'Phase-1', count: phase1Competencies.filter(c => c.subject === 'Anatomy').length },
  { id: 'physiology', name: 'Physiology', phase: 'Phase-1', count: phase1Competencies.filter(c => c.subject === 'Physiology').length },
  { id: 'biochemistry', name: 'Biochemistry', phase: 'Phase-1', count: phase1Competencies.filter(c => c.subject === 'Biochemistry').length },
  { id: 'pathology', name: 'Pathology', phase: 'Phase-2', count: phase2Competencies.filter(c => c.subject === 'Pathology').length },
  { id: 'pharmacology', name: 'Pharmacology', phase: 'Phase-2', count: phase2Competencies.filter(c => c.subject === 'Pharmacology').length },
  { id: 'microbiology', name: 'Microbiology', phase: 'Phase-2', count: phase2Competencies.filter(c => c.subject === 'Microbiology').length },
  { id: 'forensic', name: 'Forensic Medicine', phase: 'Phase-2', count: phase2Competencies.filter(c => c.subject === 'Forensic Medicine').length },
  { id: 'medicine', name: 'Medicine', phase: 'Phase-3B', count: phase3Competencies.filter(c => c.subject === 'Medicine').length },
  { id: 'surgery', name: 'Surgery', phase: 'Phase-3B', count: phase3Competencies.filter(c => c.subject === 'Surgery').length },
  { id: 'obg', name: 'OBG', phase: 'Phase-3B', count: phase3Competencies.filter(c => c.subject === 'OBG').length },
  { id: 'pediatrics', name: 'Pediatrics', phase: 'Phase-3B', count: phase3Competencies.filter(c => c.subject === 'Pediatrics').length },
];
