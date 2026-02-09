/**
 * Patient Simulation Case Template
 * Case: Acute Cholecystitis in a 45-year-old Female
 * 
 * Complete interactive case with scoring rubric
 */

// ============== TYPE DEFINITIONS ==============

export interface PatientDemographics {
  age: number;
  sex: 'Male' | 'Female';
  occupation: string;
  socioeconomic: string;
  presentingComplaint: string;
  duration: string;
}

export interface HistoryQuestion {
  id: string;
  category: 'HPI' | 'Associated' | 'Systemic' | 'Past' | 'Drug' | 'Family' | 'Personal' | 'Obstetric' | 'Menstrual';
  question: string;
  expectedQuestion: string[];  // Variations of how student might ask
  answer: string;
  criticalInfo: boolean;
  points: number;
  teachingNote?: string;
}

export interface ExaminationFinding {
  system: string;
  component: string;
  finding: string;
  isAbnormal: boolean;
  significance: string;
  points: number;
}

export interface Investigation {
  category: 'Blood' | 'Imaging' | 'Special';
  name: string;
  value: string;
  normalRange: string;
  interpretation: string;
  isAbnormal: boolean;
  urgency: 'Immediate' | 'Urgent' | 'Routine';
  points: number;
}

export interface DifferentialDiagnosis {
  rank: number;
  diagnosis: string;
  supportingFeatures: string[];
  againstFeatures: string[];
  probability: 'Most likely' | 'Likely' | 'Possible' | 'Unlikely';
}

export interface ManagementStep {
  phase: 'Immediate' | 'Resuscitation' | 'Definitive' | 'Follow-up';
  order: number;
  action: string;
  rationale: string;
  points: number;
  isCritical: boolean;
  timeframe: string;
}

export interface ScoringRubric {
  historyTaking: { max: number; passing: number; };
  examination: { max: number; passing: number; };
  investigations: { max: number; passing: number; };
  diagnosis: { max: number; passing: number; };
  management: { max: number; passing: number; };
  communication: { max: number; passing: number; };
  total: { max: number; passing: number; distinction: number; };
}

export interface PatientSimulation {
  id: string;
  title: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  estimatedTime: number; // minutes
  targetAudience: string[];
  learningObjectives: string[];
  
  // Patient Details
  patient: PatientDemographics;
  
  // Interactive Elements
  historyQuestions: HistoryQuestion[];
  examinationFindings: ExaminationFinding[];
  investigations: Investigation[];
  
  // Clinical Reasoning
  differentialDiagnosis: DifferentialDiagnosis[];
  finalDiagnosis: string;
  diagnosisCriteria: string[];
  
  // Management
  managementSteps: ManagementStep[];
  complications: string[];
  prognosis: string;
  
  // Assessment
  scoringRubric: ScoringRubric;
  criticalActions: string[];
  commonErrors: string[];
  
  // References
  references: string[];
}

// ============== SAMPLE CONTENT ==============

export const acuteCholecystitisSimulation: PatientSimulation = {
  id: "SIM-HPB-001",
  title: "Acute Calculous Cholecystitis in a 45F",
  difficulty: "Intermediate",
  estimatedTime: 30,
  targetAudience: ["MBBS Final Year", "Internship", "NEET-PG Aspirants", "DNB Residents"],
  
  learningObjectives: [
    "Obtain focused history for right upper quadrant pain",
    "Perform systematic abdominal examination",
    "Interpret LFTs and USG findings in cholecystitis",
    "Apply Tokyo Guidelines for severity assessment",
    "Plan appropriate management including timing of surgery"
  ],
  
  patient: {
    age: 45,
    sex: "Female",
    occupation: "Homemaker",
    socioeconomic: "Middle class",
    presentingComplaint: "Severe pain in the right upper abdomen",
    duration: "2 days"
  },
  
  historyQuestions: [
    // History of Presenting Illness
    {
      id: "HQ-001",
      category: "HPI",
      question: "Onset of pain",
      expectedQuestion: ["When did the pain start?", "How did it begin?", "Sudden or gradual?"],
      answer: "The pain started suddenly 2 days ago, about 30 minutes after eating a heavy, oily dinner. It began as a dull ache and progressively worsened.",
      criticalInfo: true,
      points: 2,
      teachingNote: "Postprandial onset (especially after fatty meal) is classic for biliary colic/cholecystitis"
    },
    {
      id: "HQ-002",
      category: "HPI",
      question: "Location of pain",
      expectedQuestion: ["Where exactly is the pain?", "Can you point to where it hurts?", "Site of pain?"],
      answer: "The pain is in the right upper part of my abdomen, just below the ribs.",
      criticalInfo: true,
      points: 2
    },
    {
      id: "HQ-003",
      category: "HPI",
      question: "Radiation of pain",
      expectedQuestion: ["Does the pain go anywhere else?", "Does it radiate?", "Does it move to back or shoulder?"],
      answer: "Yes, the pain goes to my right shoulder and back, between the shoulder blades.",
      criticalInfo: true,
      points: 2,
      teachingNote: "Referred pain to right scapula is pathognomonic (Boas' sign)"
    },
    {
      id: "HQ-004",
      category: "HPI",
      question: "Character of pain",
      expectedQuestion: ["What type of pain?", "How would you describe it?", "Is it constant or comes and goes?"],
      answer: "Initially it was crampy and coming in waves, but now it's constant and severe, like a heavy pressure.",
      criticalInfo: true,
      points: 2,
      teachingNote: "Evolution from colicky to constant pain suggests progression from biliary colic to cholecystitis"
    },
    {
      id: "HQ-005",
      category: "HPI",
      question: "Severity of pain",
      expectedQuestion: ["How severe is the pain?", "Pain scale 1-10?", "Worst pain ever?"],
      answer: "It's 8 out of 10. I couldn't sleep last night because of the pain.",
      criticalInfo: false,
      points: 1
    },
    {
      id: "HQ-006",
      category: "HPI",
      question: "Aggravating factors",
      expectedQuestion: ["What makes it worse?", "Anything that aggravates?", "Position or food that worsens?"],
      answer: "The pain gets worse after eating anything, especially oily food. Deep breathing also hurts. Moving around makes it worse.",
      criticalInfo: true,
      points: 2
    },
    {
      id: "HQ-007",
      category: "HPI",
      question: "Relieving factors",
      expectedQuestion: ["What relieves the pain?", "Does anything help?", "Position of comfort?"],
      answer: "Lying still on my right side gives some relief. I took paracetamol but it didn't help much.",
      criticalInfo: false,
      points: 1
    },
    {
      id: "HQ-008",
      category: "HPI",
      question: "Previous similar episodes",
      expectedQuestion: ["Had this before?", "Any similar attacks?", "First time or recurrent?"],
      answer: "Yes, I've had 3-4 similar but milder episodes over the past year. They usually lasted a few hours and went away on their own. This is the worst and longest episode.",
      criticalInfo: true,
      points: 2,
      teachingNote: "Previous biliary colic episodes suggest cholelithiasis with progression to cholecystitis"
    },
    
    // Associated Symptoms
    {
      id: "HQ-009",
      category: "Associated",
      question: "Fever",
      expectedQuestion: ["Do you have fever?", "Temperature?", "Chills or rigors?"],
      answer: "Yes, I've had fever since yesterday. It's been around 101°F. I also had chills but no rigors.",
      criticalInfo: true,
      points: 2,
      teachingNote: "Fever indicates inflammatory/infectious process. Rigors would suggest cholangitis."
    },
    {
      id: "HQ-010",
      category: "Associated",
      question: "Nausea and vomiting",
      expectedQuestion: ["Any vomiting?", "Feeling sick?", "Nausea?"],
      answer: "I've been feeling nauseated throughout. I vomited twice - it was just the food I ate, not blood or anything dark.",
      criticalInfo: true,
      points: 2
    },
    {
      id: "HQ-011",
      category: "Associated",
      question: "Jaundice",
      expectedQuestion: ["Yellow eyes or skin?", "Dark urine?", "Pale stools?", "Jaundice?"],
      answer: "My family says my eyes look slightly yellow. My urine has been dark tea-colored since yesterday. Stools are normal colored.",
      criticalInfo: true,
      points: 2,
      teachingNote: "Mild jaundice suggests CBD stone or Mirizzi syndrome. Dark urine = conjugated hyperbilirubinemia."
    },
    {
      id: "HQ-012",
      category: "Associated",
      question: "Appetite",
      expectedQuestion: ["How is your appetite?", "Eating normally?", "Anorexia?"],
      answer: "I have no appetite at all. I haven't been able to eat properly since this started.",
      criticalInfo: false,
      points: 1
    },
    {
      id: "HQ-013",
      category: "Associated",
      question: "Bowel habits",
      expectedQuestion: ["Bowel movements?", "Constipation or diarrhea?", "Passing gas?"],
      answer: "I passed stool yesterday, it was normal. I'm passing gas normally.",
      criticalInfo: true,
      points: 1,
      teachingNote: "Important to rule out bowel obstruction"
    },
    {
      id: "HQ-014",
      category: "Associated",
      question: "Itching",
      expectedQuestion: ["Any itching?", "Pruritus?", "Scratching?"],
      answer: "No itching.",
      criticalInfo: false,
      points: 1
    },
    
    // Systemic Review
    {
      id: "HQ-015",
      category: "Systemic",
      question: "Cardiorespiratory symptoms",
      expectedQuestion: ["Any chest pain?", "Breathing difficulty?", "Cough?"],
      answer: "I have some difficulty taking deep breaths because of the pain. No chest pain or cough.",
      criticalInfo: true,
      points: 1,
      teachingNote: "Splinting due to pain - important for post-op respiratory complications"
    },
    {
      id: "HQ-016",
      category: "Systemic",
      question: "Urinary symptoms",
      expectedQuestion: ["Burning urination?", "Frequency?", "Blood in urine?"],
      answer: "No burning or frequency. Just the dark color.",
      criticalInfo: false,
      points: 1
    },
    
    // Past History
    {
      id: "HQ-017",
      category: "Past",
      question: "Previous surgeries",
      expectedQuestion: ["Any operations before?", "Previous surgeries?", "Hospitalized before?"],
      answer: "I had a cesarean section 15 years ago. No other surgeries.",
      criticalInfo: true,
      points: 1,
      teachingNote: "Previous surgery may cause adhesions - relevant for laparoscopic approach"
    },
    {
      id: "HQ-018",
      category: "Past",
      question: "Medical conditions",
      expectedQuestion: ["Any medical problems?", "Diabetes? Hypertension?", "Chronic diseases?"],
      answer: "I have type 2 diabetes for 5 years. I'm on metformin. My sugars are usually around 150-180. I also have mild hypertension controlled with amlodipine.",
      criticalInfo: true,
      points: 2,
      teachingNote: "Diabetes increases risk of emphysematous cholecystitis and gangrenous cholecystitis"
    },
    {
      id: "HQ-019",
      category: "Past",
      question: "Allergies",
      expectedQuestion: ["Any allergies?", "Drug allergies?", "Food allergies?"],
      answer: "No known allergies.",
      criticalInfo: true,
      points: 1
    },
    
    // Drug History
    {
      id: "HQ-020",
      category: "Drug",
      question: "Current medications",
      expectedQuestion: ["What medicines do you take?", "Regular medications?", "Any tablets?"],
      answer: "Metformin 500mg twice daily, Amlodipine 5mg once daily. I also take occasional antacids.",
      criticalInfo: true,
      points: 1
    },
    {
      id: "HQ-021",
      category: "Drug",
      question: "Blood thinners",
      expectedQuestion: ["Any blood thinners?", "Aspirin? Clopidogrel?", "Anticoagulants?"],
      answer: "No blood thinners.",
      criticalInfo: true,
      points: 1,
      teachingNote: "Important for surgical planning"
    },
    
    // Family History
    {
      id: "HQ-022",
      category: "Family",
      question: "Family history of gallstones",
      expectedQuestion: ["Anyone in family with gallstones?", "Family history?", "Mother or sisters with similar problem?"],
      answer: "Yes, my mother had her gallbladder removed when she was 50. My elder sister also has gallstones.",
      criticalInfo: false,
      points: 1,
      teachingNote: "Gallstones have familial predisposition (FFF)"
    },
    
    // Personal History
    {
      id: "HQ-023",
      category: "Personal",
      question: "Diet",
      expectedQuestion: ["What do you eat?", "Diet type?", "Vegetarian?"],
      answer: "I'm non-vegetarian. I eat oily food frequently. My husband says I should eat less fried food.",
      criticalInfo: false,
      points: 1,
      teachingNote: "High fat diet is a risk factor"
    },
    {
      id: "HQ-024",
      category: "Personal",
      question: "Smoking and alcohol",
      expectedQuestion: ["Do you smoke?", "Alcohol?", "Any addictions?"],
      answer: "I don't smoke or drink alcohol.",
      criticalInfo: false,
      points: 1
    },
    
    // Obstetric History
    {
      id: "HQ-025",
      category: "Obstetric",
      question: "Parity",
      expectedQuestion: ["How many children?", "Pregnancies?", "Obstetric history?"],
      answer: "I have 3 children, all normal deliveries except the last one which was cesarean. No abortions.",
      criticalInfo: false,
      points: 1,
      teachingNote: "Multiparity is a risk factor (Fair, Fat, Fertile, Forty, Female)"
    }
  ],
  
  examinationFindings: [
    // General Examination
    {
      system: "General",
      component: "Appearance",
      finding: "Patient appears ill and in distress, lying still, reluctant to move",
      isAbnormal: true,
      significance: "Suggests peritoneal irritation",
      points: 1
    },
    {
      system: "General",
      component: "Built",
      finding: "Obese (BMI 32)",
      isAbnormal: true,
      significance: "Obesity is a risk factor for gallstones",
      points: 1
    },
    {
      system: "General",
      component: "Pallor",
      finding: "Mild pallor present",
      isAbnormal: true,
      significance: "Chronic illness",
      points: 1
    },
    {
      system: "General",
      component: "Icterus",
      finding: "Mild icterus visible in sclera",
      isAbnormal: true,
      significance: "Suggests biliary involvement - CBD stone or Mirizzi syndrome",
      points: 2
    },
    {
      system: "General",
      component: "Hydration",
      finding: "Mild dehydration - dry tongue, reduced skin turgor",
      isAbnormal: true,
      significance: "Due to fever, vomiting, and poor intake",
      points: 1
    },
    
    // Vital Signs
    {
      system: "Vitals",
      component: "Temperature",
      finding: "38.5°C (101.3°F)",
      isAbnormal: true,
      significance: "Fever indicates inflammatory/infectious process",
      points: 2
    },
    {
      system: "Vitals",
      component: "Pulse",
      finding: "98/min, regular, good volume",
      isAbnormal: true,
      significance: "Tachycardia due to fever and pain",
      points: 1
    },
    {
      system: "Vitals",
      component: "Blood Pressure",
      finding: "136/88 mmHg",
      isAbnormal: false,
      significance: "Upper limit of normal, acceptable",
      points: 1
    },
    {
      system: "Vitals",
      component: "Respiratory Rate",
      finding: "20/min, shallow breathing",
      isAbnormal: true,
      significance: "Splinting due to pain",
      points: 1
    },
    {
      system: "Vitals",
      component: "SpO2",
      finding: "97% on room air",
      isAbnormal: false,
      significance: "Normal oxygenation",
      points: 1
    },
    
    // Abdominal Examination
    {
      system: "Abdomen",
      component: "Inspection",
      finding: "Abdomen obese, moves with respiration but restricted in upper abdomen, previous LSCS scar visible",
      isAbnormal: true,
      significance: "Restricted movement indicates peritoneal irritation",
      points: 2
    },
    {
      system: "Abdomen",
      component: "Palpation - Tenderness",
      finding: "Severe tenderness in right hypochondrium with guarding. Murphy's sign POSITIVE - patient arrests inspiration on deep palpation of RUQ.",
      isAbnormal: true,
      significance: "Murphy's sign is pathognomonic of acute cholecystitis (sensitivity 65%, specificity 87%)",
      points: 3
    },
    {
      system: "Abdomen",
      component: "Palpation - Mass",
      finding: "A vague, tender mass palpable in right hypochondrium, difficult to define edges due to guarding",
      isAbnormal: true,
      significance: "Likely distended gallbladder or omental wrapping",
      points: 2
    },
    {
      system: "Abdomen",
      component: "Palpation - Liver",
      finding: "Liver not palpable separately, lower border masked by tenderness",
      isAbnormal: false,
      significance: "Hepatomegaly excluded clinically",
      points: 1
    },
    {
      system: "Abdomen",
      component: "Palpation - Rebound",
      finding: "Localized rebound tenderness present in RUQ",
      isAbnormal: true,
      significance: "Indicates localized peritonitis",
      points: 2
    },
    {
      system: "Abdomen",
      component: "Percussion",
      finding: "Tympanic note generally, no shifting dullness, liver span normal (12 cm in MCL)",
      isAbnormal: false,
      significance: "No ascites, no hepatomegaly",
      points: 1
    },
    {
      system: "Abdomen",
      component: "Auscultation",
      finding: "Bowel sounds present, slightly reduced in frequency",
      isAbnormal: true,
      significance: "Mild ileus due to adjacent inflammation",
      points: 1
    },
    {
      system: "Abdomen",
      component: "Boas' Sign",
      finding: "Hyperesthesia present below right scapula",
      isAbnormal: true,
      significance: "Referred pain pathway - phrenic nerve (C3-5)",
      points: 1
    },
    
    // Other Systems
    {
      system: "Respiratory",
      component: "Chest examination",
      finding: "Reduced air entry at right base, dull percussion note at right base posteriorly",
      isAbnormal: true,
      significance: "Reactive right pleural effusion (sympathetic effusion)",
      points: 2
    },
    {
      system: "Cardiovascular",
      component: "Heart sounds",
      finding: "S1S2 normal, no murmurs",
      isAbnormal: false,
      significance: "No cardiac abnormality",
      points: 1
    }
  ],
  
  investigations: [
    // Blood Investigations
    {
      category: "Blood",
      name: "Complete Blood Count",
      value: "Hb: 11.2 g/dL, TLC: 14,500/mm³ (N: 82%), Platelets: 245,000/mm³",
      normalRange: "Hb: 12-16 g/dL, TLC: 4000-11000/mm³, Plt: 150,000-400,000",
      interpretation: "Leukocytosis with neutrophilia indicates acute inflammatory process",
      isAbnormal: true,
      urgency: "Immediate",
      points: 2
    },
    {
      category: "Blood",
      name: "Random Blood Sugar",
      value: "198 mg/dL",
      normalRange: "<140 mg/dL (random)",
      interpretation: "Uncontrolled diabetes, stress hyperglycemia",
      isAbnormal: true,
      urgency: "Immediate",
      points: 1
    },
    {
      category: "Blood",
      name: "Serum Bilirubin",
      value: "Total: 3.2 mg/dL, Direct: 2.1 mg/dL",
      normalRange: "Total: 0.2-1.2 mg/dL, Direct: 0-0.3 mg/dL",
      interpretation: "Conjugated hyperbilirubinemia - suggests CBD involvement (stone or Mirizzi)",
      isAbnormal: true,
      urgency: "Urgent",
      points: 2
    },
    {
      category: "Blood",
      name: "Liver Enzymes",
      value: "AST: 85 U/L, ALT: 110 U/L, ALP: 285 U/L, GGT: 180 U/L",
      normalRange: "AST: 10-40, ALT: 7-56, ALP: 44-147, GGT: 9-48",
      interpretation: "Elevated ALP and GGT with mild transaminase rise = cholestatic pattern",
      isAbnormal: true,
      urgency: "Urgent",
      points: 2
    },
    {
      category: "Blood",
      name: "Serum Amylase",
      value: "95 U/L",
      normalRange: "28-100 U/L",
      interpretation: "Normal - rules out acute pancreatitis",
      isAbnormal: false,
      urgency: "Urgent",
      points: 2
    },
    {
      category: "Blood",
      name: "Serum Lipase",
      value: "45 U/L",
      normalRange: "0-60 U/L",
      interpretation: "Normal - confirms no pancreatitis",
      isAbnormal: false,
      urgency: "Urgent",
      points: 1
    },
    {
      category: "Blood",
      name: "Renal Function",
      value: "BUN: 22 mg/dL, Creatinine: 0.9 mg/dL",
      normalRange: "BUN: 7-20, Cr: 0.6-1.2",
      interpretation: "Mildly elevated BUN - prerenal azotemia from dehydration",
      isAbnormal: true,
      urgency: "Urgent",
      points: 1
    },
    {
      category: "Blood",
      name: "Coagulation Profile",
      value: "PT: 13.5 sec, INR: 1.1, aPTT: 32 sec",
      normalRange: "PT: 11-13.5, INR: 0.8-1.2, aPTT: 25-35",
      interpretation: "Normal coagulation - cleared for surgery",
      isAbnormal: false,
      urgency: "Urgent",
      points: 1
    },
    {
      category: "Blood",
      name: "Serum Electrolytes",
      value: "Na: 138 mEq/L, K: 3.8 mEq/L, Cl: 102 mEq/L",
      normalRange: "Na: 135-145, K: 3.5-5.0, Cl: 98-106",
      interpretation: "Normal electrolytes",
      isAbnormal: false,
      urgency: "Urgent",
      points: 1
    },
    
    // Imaging
    {
      category: "Imaging",
      name: "Ultrasound Abdomen",
      value: `
• Gallbladder: Distended, wall thickened (6mm, normal <3mm)
• Multiple echogenic foci with posterior acoustic shadowing (calculi) - largest 18mm
• Pericholecystic fluid present
• Positive sonographic Murphy's sign
• CBD: 9mm (upper limit of normal)
• No CBD calculi visualized
• Liver: Normal echotexture
• Pancreas: Normal
• No free fluid in pelvis
• Right pleural effusion: Minimal`,
      normalRange: "GB wall <3mm, no stones, CBD <6mm",
      interpretation: "Acute calculous cholecystitis with possible CBD dilatation. TG18 Grade II severity.",
      isAbnormal: true,
      urgency: "Immediate",
      points: 3
    },
    {
      category: "Imaging",
      name: "Chest X-ray",
      value: "Blunting of right costophrenic angle. No air under diaphragm. Heart size normal.",
      normalRange: "Clear lung fields, sharp CP angles",
      interpretation: "Right-sided pleural effusion (reactive). No perforation.",
      isAbnormal: true,
      urgency: "Urgent",
      points: 2
    },
    {
      category: "Imaging",
      name: "X-ray Abdomen (Erect)",
      value: "No air-fluid levels. No dilated bowel loops. No radio-opaque calculi seen (only 15% gallstones are radio-opaque).",
      normalRange: "No obstruction, no free air",
      interpretation: "Rules out intestinal obstruction and perforation",
      isAbnormal: false,
      urgency: "Urgent",
      points: 1
    },
    
    // Special Investigations
    {
      category: "Special",
      name: "MRCP (if CBD involvement suspected)",
      value: "Indicated if bilirubin remains elevated or CBD >10mm on USG. May show CBD stone or Mirizzi syndrome.",
      normalRange: "N/A",
      interpretation: "To be ordered if conservative management or before surgery for CBD clearance",
      isAbnormal: false,
      urgency: "Routine",
      points: 1
    },
    {
      category: "Special",
      name: "ECG",
      value: "Sinus tachycardia (98/min), no ST-T changes",
      normalRange: "Normal sinus rhythm",
      interpretation: "Pre-operative clearance - no contraindication to surgery",
      isAbnormal: true,
      urgency: "Urgent",
      points: 1
    }
  ],
  
  differentialDiagnosis: [
    {
      rank: 1,
      diagnosis: "Acute Calculous Cholecystitis",
      supportingFeatures: [
        "RUQ pain after fatty meal",
        "Murphy's sign positive",
        "Fever",
        "Leukocytosis",
        "USG: thickened GB wall, stones, pericholecystic fluid",
        "Sonographic Murphy's sign"
      ],
      againstFeatures: [],
      probability: "Most likely"
    },
    {
      rank: 2,
      diagnosis: "Choledocholithiasis with Cholangitis",
      supportingFeatures: [
        "Jaundice",
        "Elevated ALP/GGT",
        "Dilated CBD on USG (9mm)"
      ],
      againstFeatures: [
        "No rigors",
        "No hypotension",
        "CBD not significantly dilated",
        "Charcot's triad incomplete"
      ],
      probability: "Possible"
    },
    {
      rank: 3,
      diagnosis: "Mirizzi Syndrome",
      supportingFeatures: [
        "Jaundice with cholecystitis",
        "Large stone (18mm) - could compress CBD",
        "Elevated bilirubin"
      ],
      againstFeatures: [
        "CBD not visualized as compressed on USG",
        "Would need MRCP/ERCP to confirm"
      ],
      probability: "Possible"
    },
    {
      rank: 4,
      diagnosis: "Acute Pancreatitis",
      supportingFeatures: [
        "Epigastric pain radiating to back possible",
        "Gallstones (could cause gallstone pancreatitis)"
      ],
      againstFeatures: [
        "Amylase and lipase normal",
        "Pain maximum in RUQ, not epigastric",
        "Murphy's sign positive"
      ],
      probability: "Unlikely"
    },
    {
      rank: 5,
      diagnosis: "Perforated Peptic Ulcer",
      supportingFeatures: [
        "Severe abdominal pain",
        "Peritonitic features"
      ],
      againstFeatures: [
        "No air under diaphragm on X-ray",
        "Pain localized to RUQ",
        "Postprandial aggravation (opposite to PUD)",
        "USG shows GB pathology"
      ],
      probability: "Unlikely"
    }
  ],
  
  finalDiagnosis: "Acute Calculous Cholecystitis (Tokyo Grade II - Moderate) with possible early Choledocholithiasis",
  
  diagnosisCriteria: [
    "Tokyo Guidelines 2018 (TG18) Criteria Met:",
    "A. Local signs: Murphy's sign ✓, RUQ mass/pain/tenderness ✓",
    "B. Systemic signs: Fever ✓, Elevated CRP/WBC ✓",
    "C. Imaging: Thickened GB wall ✓, Pericholecystic fluid ✓, Stones ✓",
    "",
    "Definite diagnosis: One item from A + One item from B + C",
    "",
    "Severity Grade II (Moderate): WBC >18,000 OR palpable mass OR symptoms >72 hours"
  ],
  
  managementSteps: [
    // Immediate
    {
      phase: "Immediate",
      order: 1,
      action: "NPO (Nil per oral)",
      rationale: "Rest the biliary system and prepare for possible surgery",
      points: 2,
      isCritical: true,
      timeframe: "Immediately"
    },
    {
      phase: "Immediate",
      order: 2,
      action: "IV access and fluid resuscitation - NS/RL at 100-125 mL/hr",
      rationale: "Correct dehydration, maintain perfusion",
      points: 2,
      isCritical: true,
      timeframe: "Within 15 minutes"
    },
    {
      phase: "Immediate",
      order: 3,
      action: "Analgesics - IV Paracetamol 1g or IV Tramadol 50mg (avoid NSAIDs initially)",
      rationale: "Pain relief. NSAIDs can be added later but caution with renal function.",
      points: 2,
      isCritical: true,
      timeframe: "Within 30 minutes"
    },
    {
      phase: "Immediate",
      order: 4,
      action: "Antiemetics - IV Ondansetron 4mg",
      rationale: "Control nausea and vomiting",
      points: 1,
      isCritical: false,
      timeframe: "Within 30 minutes"
    },
    {
      phase: "Immediate",
      order: 5,
      action: "IV Antibiotics - Piperacillin-Tazobactam 4.5g or Ceftriaxone 2g + Metronidazole 500mg",
      rationale: "Cover gram-negative and anaerobic organisms (E.coli, Klebsiella, Enterococcus, Bacteroides)",
      points: 2,
      isCritical: true,
      timeframe: "Within 1 hour"
    },
    {
      phase: "Immediate",
      order: 6,
      action: "Blood sugar control - Insulin sliding scale, stop metformin",
      rationale: "Optimize glycemic control before surgery, metformin contraindicated with contrast/surgery",
      points: 2,
      isCritical: true,
      timeframe: "Within 1 hour"
    },
    {
      phase: "Immediate",
      order: 7,
      action: "Insert Foley catheter, monitor urine output",
      rationale: "Monitor fluid status, target UO >0.5 mL/kg/hr",
      points: 1,
      isCritical: false,
      timeframe: "Within 1 hour"
    },
    
    // Resuscitation
    {
      phase: "Resuscitation",
      order: 8,
      action: "Complete investigations as listed above",
      rationale: "Confirm diagnosis, assess severity, pre-operative workup",
      points: 1,
      isCritical: false,
      timeframe: "Within 2-4 hours"
    },
    {
      phase: "Resuscitation",
      order: 9,
      action: "Apply Tokyo Guidelines - Severity Assessment",
      rationale: "Grade I: Early lap chole, Grade II: Early lap chole if expertise available, Grade III: Drainage first",
      points: 2,
      isCritical: true,
      timeframe: "Within 4 hours"
    },
    {
      phase: "Resuscitation",
      order: 10,
      action: "Surgical consultation",
      rationale: "Early surgical involvement for definitive planning",
      points: 1,
      isCritical: true,
      timeframe: "Within 4 hours"
    },
    
    // Definitive
    {
      phase: "Definitive",
      order: 11,
      action: "MRCP or EUS to evaluate CBD",
      rationale: "Bilirubin elevated, CBD mildly dilated - need to rule out CBD stone before cholecystectomy",
      points: 2,
      isCritical: true,
      timeframe: "Within 24-48 hours"
    },
    {
      phase: "Definitive",
      order: 12,
      action: "Early Laparoscopic Cholecystectomy (within 72 hours of admission)",
      rationale: "TG18 recommends early cholecystectomy for Grade I and II. Reduces hospital stay, costs, and recurrence.",
      points: 3,
      isCritical: true,
      timeframe: "Within 72 hours"
    },
    {
      phase: "Definitive",
      order: 13,
      action: "If CBD stone on MRCP: ERCP + Sphincterotomy first, then Lap Cholecystectomy",
      rationale: "Clear CBD before cholecystectomy to prevent retained stones",
      points: 2,
      isCritical: true,
      timeframe: "Before or during cholecystectomy"
    },
    {
      phase: "Definitive",
      order: 14,
      action: "Intraoperative Cholangiogram (IOC) or Laparoscopic CBD exploration if indicated",
      rationale: "Alternative to pre-op ERCP for CBD stone management",
      points: 1,
      isCritical: false,
      timeframe: "During surgery"
    },
    
    // Follow-up
    {
      phase: "Follow-up",
      order: 15,
      action: "DVT prophylaxis - Enoxaparin 40mg SC OD, compression stockings",
      rationale: "Obese, diabetic patient undergoing surgery - high VTE risk",
      points: 1,
      isCritical: false,
      timeframe: "Post-operative"
    },
    {
      phase: "Follow-up",
      order: 16,
      action: "Early mobilization, chest physiotherapy",
      rationale: "Prevent post-op respiratory complications",
      points: 1,
      isCritical: false,
      timeframe: "POD 0-1"
    },
    {
      phase: "Follow-up",
      order: 17,
      action: "Histopathology of gallbladder specimen",
      rationale: "Rule out incidental gallbladder carcinoma (found in 0.2-3% of cholecystectomy specimens)",
      points: 1,
      isCritical: true,
      timeframe: "Post-operative"
    },
    {
      phase: "Follow-up",
      order: 18,
      action: "Follow-up at 2 weeks with LFT, wound check",
      rationale: "Ensure normalization of liver function, wound healing",
      points: 1,
      isCritical: false,
      timeframe: "2 weeks post-discharge"
    }
  ],
  
  complications: [
    "Gangrenous cholecystitis (higher risk in diabetics)",
    "Perforation → Biliary peritonitis",
    "Empyema of gallbladder",
    "Cholecystoenteric fistula → Gallstone ileus",
    "Mirizzi syndrome (Type I-IV)",
    "Acute cholangitis (if CBD involved)",
    "Acute pancreatitis",
    "Sepsis and multi-organ dysfunction"
  ],
  
  prognosis: "With timely laparoscopic cholecystectomy, prognosis is excellent. Mortality for uncomplicated cholecystitis is <1%. Risk increases with complications (gangrenous/perforated: 15-20% mortality) and in elderly/diabetic patients.",
  
  scoringRubric: {
    historyTaking: { max: 35, passing: 21 },
    examination: { max: 25, passing: 15 },
    investigations: { max: 20, passing: 12 },
    diagnosis: { max: 10, passing: 6 },
    management: { max: 25, passing: 15 },
    communication: { max: 10, passing: 6 },
    total: { max: 125, passing: 75, distinction: 100 }
  },
  
  criticalActions: [
    "Identify Murphy's sign",
    "Order ultrasound abdomen urgently",
    "Start IV antibiotics within 1 hour",
    "Assess severity using Tokyo Guidelines",
    "Plan early laparoscopic cholecystectomy",
    "Evaluate CBD before/during surgery if jaundice present"
  ],
  
  commonErrors: [
    "Forgetting to ask about previous similar episodes (biliary colic history)",
    "Missing the mild jaundice on examination",
    "Not ordering amylase/lipase to rule out pancreatitis",
    "Delayed antibiotic administration",
    "Not assessing Tokyo severity grade",
    "Planning interval cholecystectomy when early surgery is indicated",
    "Forgetting to evaluate CBD in a jaundiced patient",
    "Missing the diabetic status and its implications"
  ],
  
  references: [
    "Tokyo Guidelines 2018 (TG18): Diagnostic criteria and severity grading of acute cholecystitis",
    "Bailey & Love Chapter 67: The Gallbladder and Bile Ducts (pp. 1188-1220)",
    "Sabiston Chapter 55: Biliary System (pp. 1476-1516)",
    "Blumgart's Surgery of the Liver, Biliary Tract and Pancreas, 6th Ed, Chapter 30-35",
    "SAGES Guidelines for Laparoscopic Cholecystectomy"
  ]
};

// ============== HELPER FUNCTIONS ==============

export function calculateSimulationScore(
  historyPoints: number,
  examPoints: number,
  investigationPoints: number,
  diagnosisPoints: number,
  managementPoints: number,
  communicationPoints: number
): {
  total: number;
  percentage: number;
  grade: 'Distinction' | 'Pass' | 'Fail';
  feedback: string;
} {
  const rubric = acuteCholecystitisSimulation.scoringRubric;
  const total = historyPoints + examPoints + investigationPoints + diagnosisPoints + managementPoints + communicationPoints;
  const percentage = Math.round((total / rubric.total.max) * 100);
  
  let grade: 'Distinction' | 'Pass' | 'Fail';
  let feedback: string;
  
  if (total >= rubric.total.distinction) {
    grade = 'Distinction';
    feedback = 'Excellent performance! You demonstrated comprehensive clinical skills.';
  } else if (total >= rubric.total.passing) {
    grade = 'Pass';
    feedback = 'Good performance. Review areas where points were lost for improvement.';
  } else {
    grade = 'Fail';
    feedback = 'Needs improvement. Focus on critical actions and systematic approach.';
  }
  
  return { total, percentage, grade, feedback };
}

export default acuteCholecystitisSimulation;
