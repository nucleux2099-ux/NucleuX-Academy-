/**
 * OSCE Station Template
 * Station: Thyroid Swelling Examination
 * 
 * Timed clinical examination with examiner checklist
 */

// ============== TYPE DEFINITIONS ==============

export interface ChecklistItem {
  id: string;
  category: 'Introduction' | 'Inspection' | 'Palpation' | 'Percussion' | 'Auscultation' | 
            'Special Tests' | 'Systemic' | 'Communication' | 'Conclusion';
  action: string;
  marks: number;
  isCritical: boolean;
  expectedFindings?: string[];
  commonMistakes?: string;
  teachingNote?: string;
}

export interface ScoringCriteria {
  category: string;
  maxMarks: number;
  passingMarks: number;
  items: string[];
}

export interface ModelAnswer {
  section: string;
  approach: string;
  verbalScript: string;
  keyPoints: string[];
}

export interface OSCEStation {
  id: string;
  stationNumber: number;
  title: string;
  system: string;
  topic: string;
  
  // Station Setup
  timeLimit: number; // minutes
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  targetLevel: string[];
  
  // Task
  taskDescription: string;
  candidateInstructions: string;
  patientInstructions?: string;
  examinerInstructions: string;
  
  // Materials
  equipmentRequired: string[];
  patientPosition: string;
  
  // Assessment
  checklist: ChecklistItem[];
  scoringCriteria: ScoringCriteria[];
  totalMarks: number;
  passingMarks: number;
  distinctionMarks: number;
  
  // Answers
  modelAnswers: ModelAnswer[];
  keyDifferentials: string[];
  redFlags: string[];
  
  // Learning
  commonMistakes: string[];
  tips: string[];
  references: string[];
  
  // Metadata
  lastUpdated: string;
  author: string;
}

// ============== SAMPLE CONTENT ==============

export const thyroidExaminationOSCE: OSCEStation = {
  id: "OSCE-ENDO-001",
  stationNumber: 5,
  title: "Examination of Thyroid Swelling",
  system: "Endocrine",
  topic: "Thyroid Examination",
  
  timeLimit: 8,
  difficulty: "Intermediate",
  targetLevel: ["MBBS Final Year", "Internship", "MRCS Part B", "DNB Practical"],
  
  taskDescription: `A 35-year-old female has noticed a swelling in her neck for 6 months. 
She has no complaints of difficulty swallowing or breathing. 
Examine this patient's thyroid gland and present your findings.`,
  
  candidateInstructions: `You have 8 minutes for this station.

1. Examine this patient's thyroid swelling systematically
2. You may ask the patient to perform certain maneuvers
3. A glass of water is available if needed
4. State your findings as you examine
5. Be prepared to answer questions from the examiner

IMPORTANT: 
- Obtain verbal consent before starting
- Ensure patient comfort throughout
- Wash/sanitize hands before and after
- Examine from the front AND from behind`,

  patientInstructions: `You are a 35-year-old woman who noticed a neck swelling 6 months ago.

- The swelling has slowly increased in size
- No pain, no difficulty swallowing or breathing
- You feel slightly "hyper" - occasional palpitations, lost 3kg weight
- No family history of thyroid problems
- If asked to swallow: the swelling moves up
- If asked to protrude tongue: no movement

FINDINGS TO DEMONSTRATE:
- Visible swelling in front of neck (R > L)
- Moves with swallowing
- No movement with tongue protrusion
- No eye signs (eyes are normal)
- Hands: slight fine tremor if arms outstretched
- Pulse: slightly fast (90/min, regular)
- Warm, moist palms`,

  examinerInstructions: `Mark the candidate on the checklist below.

EXPECTED FINDINGS for this patient:
- Solitary thyroid nodule (right lobe) OR Asymmetric multinodular goiter
- Moves with deglutition, NOT with tongue protrusion
- Mild thyrotoxic features (tremor, tachycardia, warm hands)
- No lymphadenopathy
- No retrosternal extension (Pemberton's negative)
- No bruit

QUESTIONS TO ASK (if time permits):
1. "What is your differential diagnosis?" 
   → Solitary toxic nodule, MNG with dominant nodule, Follicular neoplasm, Papillary carcinoma

2. "What investigations would you order?"
   → TSH, Free T4/T3, Thyroid USG, FNAC

3. "Why does it move with swallowing but not tongue protrusion?"
   → Thyroid is attached to pretracheal fascia (swallowing), 
   → Thyroglossal cyst attached to hyoid (tongue protrusion)`,

  equipmentRequired: [
    "Glass of water",
    "Stethoscope",
    "Tendon hammer (optional)",
    "Measuring tape",
    "Watch with second hand (for pulse)"
  ],
  
  patientPosition: "Sitting upright on a chair, neck slightly extended, good lighting from the front",
  
  checklist: [
    // INTRODUCTION (4 marks)
    {
      id: "C01",
      category: "Introduction",
      action: "Greets patient, introduces self, confirms identity",
      marks: 1,
      isCritical: false,
      teachingNote: "Professional introduction sets the tone"
    },
    {
      id: "C02",
      category: "Introduction",
      action: "Explains procedure and obtains verbal consent",
      marks: 1,
      isCritical: true,
      commonMistakes: "Rushing into examination without consent"
    },
    {
      id: "C03",
      category: "Introduction",
      action: "Washes/sanitizes hands (or states intention)",
      marks: 1,
      isCritical: true,
      teachingNote: "Infection control is essential"
    },
    {
      id: "C04",
      category: "Introduction",
      action: "Ensures adequate exposure (neck, chest visible) with dignity",
      marks: 1,
      isCritical: false,
      teachingNote: "Neck should be fully visible; chest may need exposure for peripheral signs"
    },
    
    // INSPECTION (5 marks)
    {
      id: "C05",
      category: "Inspection",
      action: "Inspects from the FRONT - notes swelling, skin changes, visible pulsations",
      marks: 1,
      isCritical: true,
      expectedFindings: [
        "Visible swelling in anterior neck",
        "Size, shape, surface",
        "Skin over swelling (normal, stretched, scars)",
        "Visible veins"
      ],
      commonMistakes: "Standing too close - step back for proper view"
    },
    {
      id: "C06",
      category: "Inspection",
      action: "Asks patient to SWALLOW (with water) and observes movement",
      marks: 2,
      isCritical: true,
      expectedFindings: ["Swelling moves UP with swallowing = thyroid origin"],
      teachingNote: "Thyroid attached to pretracheal fascia, moves with trachea during swallowing",
      commonMistakes: "Not giving water to swallow"
    },
    {
      id: "C07",
      category: "Inspection",
      action: "Asks patient to PROTRUDE TONGUE and observes for movement",
      marks: 2,
      isCritical: true,
      expectedFindings: [
        "NO movement = thyroid",
        "Moves UP = thyroglossal cyst"
      ],
      teachingNote: "Thyroglossal cyst attached to hyoid via thyroglossal duct remnant",
      commonMistakes: "Forgetting this step - key differentiating feature!"
    },
    
    // PALPATION (10 marks)
    {
      id: "C08",
      category: "Palpation",
      action: "Palpates FROM BEHIND with both hands, chin slightly flexed",
      marks: 1,
      isCritical: true,
      teachingNote: "Classical technique - examiner stands behind patient",
      commonMistakes: "Examining only from the front"
    },
    {
      id: "C09",
      category: "Palpation",
      action: "Identifies and palpates BOTH LOBES and ISTHMUS",
      marks: 2,
      isCritical: true,
      expectedFindings: [
        "Right lobe (larger/nodular)",
        "Left lobe (normal or smaller)",
        "Isthmus over 2nd-4th tracheal rings"
      ]
    },
    {
      id: "C10",
      category: "Palpation",
      action: "Notes SIZE of gland/nodule (measures or estimates)",
      marks: 1,
      isCritical: false,
      teachingNote: "Measure in cm - important for follow-up and surgical planning"
    },
    {
      id: "C11",
      category: "Palpation",
      action: "Notes SURFACE - smooth, nodular, irregular",
      marks: 1,
      isCritical: true,
      expectedFindings: [
        "Smooth = diffuse goiter, Graves'",
        "Nodular = MNG, adenoma",
        "Hard/irregular = malignancy"
      ]
    },
    {
      id: "C12",
      category: "Palpation",
      action: "Notes CONSISTENCY - soft, firm, hard, variable",
      marks: 1,
      isCritical: true,
      expectedFindings: [
        "Soft = colloid, cyst",
        "Firm = adenoma, MNG",
        "Hard = carite, calcified nodule, malignancy"
      ]
    },
    {
      id: "C13",
      category: "Palpation",
      action: "Checks MOBILITY - horizontal and vertical planes",
      marks: 1,
      isCritical: true,
      expectedFindings: [
        "Mobile = benign",
        "Fixed = malignancy (T4 stage)"
      ],
      teachingNote: "Ask patient to swallow during palpation for vertical mobility"
    },
    {
      id: "C14",
      category: "Palpation",
      action: "Confirms swelling MOVES WITH SWALLOWING on palpation",
      marks: 1,
      isCritical: true,
      teachingNote: "Palpate while patient swallows - feel the upward movement"
    },
    {
      id: "C15",
      category: "Palpation",
      action: "Checks for TENDERNESS",
      marks: 1,
      isCritical: false,
      expectedFindings: [
        "Tender = thyroiditis (subacute, acute)",
        "Non-tender = most thyroid conditions"
      ]
    },
    {
      id: "C16",
      category: "Palpation",
      action: "Attempts to get BELOW lower border (retrosternal extension)",
      marks: 1,
      isCritical: true,
      expectedFindings: [
        "Can get below = no retrosternal extension",
        "Cannot get below = retrosternal goiter possible"
      ],
      commonMistakes: "Forgetting to check this - important for surgical planning"
    },
    
    // PERCUSSION (2 marks)
    {
      id: "C17",
      category: "Percussion",
      action: "Percusses over MANUBRIUM for retrosternal extension",
      marks: 2,
      isCritical: false,
      expectedFindings: [
        "Resonant = no retrosternal extension",
        "Dull = retrosternal goiter"
      ],
      teachingNote: "Retrosternal goiter may cause SVC obstruction"
    },
    
    // AUSCULTATION (2 marks)
    {
      id: "C18",
      category: "Auscultation",
      action: "Auscultates over the thyroid gland for BRUIT",
      marks: 2,
      isCritical: true,
      expectedFindings: [
        "Bruit present = hypervascular (Graves' disease)",
        "No bruit = MNG, adenoma"
      ],
      teachingNote: "Ask patient to hold breath to eliminate venous hum",
      commonMistakes: "Forgetting auscultation - important in hyperthyroidism"
    },
    
    // SPECIAL TESTS (6 marks)
    {
      id: "C19",
      category: "Special Tests",
      action: "Checks TRACHEAL POSITION (midline or deviated)",
      marks: 1,
      isCritical: true,
      expectedFindings: [
        "Midline = balanced goiter",
        "Deviated = pushed by large goiter, or pulled by fibrosis/malignancy"
      ]
    },
    {
      id: "C20",
      category: "Special Tests",
      action: "Performs PEMBERTON'S SIGN (arms raised above head for 1 min)",
      marks: 2,
      isCritical: true,
      expectedFindings: [
        "Positive = facial plethora, cyanosis, stridor, JVD",
        "Indicates thoracic inlet obstruction (retrosternal goiter, SVC syndrome)"
      ],
      teachingNote: "Raising arms compresses thoracic inlet if retrosternal mass present"
    },
    {
      id: "C21",
      category: "Special Tests",
      action: "Checks for CAROTID PULSATION (Berry's sign if absent)",
      marks: 1,
      isCritical: false,
      expectedFindings: [
        "Berry's sign = absence of carotid pulsation behind thyroid mass = malignancy encasing carotid"
      ]
    },
    {
      id: "C22",
      category: "Special Tests",
      action: "Examines CERVICAL LYMPH NODES systematically",
      marks: 2,
      isCritical: true,
      expectedFindings: [
        "Jugulodigastric, deep cervical, supraclavicular",
        "Enlarged nodes = papillary carcinoma, lymphoma"
      ],
      teachingNote: "Papillary carcinoma has early lymph node metastasis"
    },
    
    // THYROID STATUS (8 marks)
    {
      id: "C23",
      category: "Systemic",
      action: "Examines HANDS - tremor (outstretched hands with paper)",
      marks: 1,
      isCritical: true,
      expectedFindings: [
        "Fine tremor = thyrotoxicosis",
        "Coarse tremor = anxiety, withdrawal"
      ],
      teachingNote: "Place paper on outstretched hands to detect fine tremor"
    },
    {
      id: "C24",
      category: "Systemic",
      action: "Examines HANDS - warmth, sweating, palmar erythema",
      marks: 1,
      isCritical: false,
      expectedFindings: [
        "Warm, moist = hyperthyroid",
        "Cold, dry = hypothyroid"
      ]
    },
    {
      id: "C25",
      category: "Systemic",
      action: "Examines HANDS - thyroid acropachy, onycholysis (Plummer's nails)",
      marks: 1,
      isCritical: false,
      expectedFindings: [
        "Acropachy = Graves' (rare)",
        "Onycholysis = separation of nail from bed"
      ]
    },
    {
      id: "C26",
      category: "Systemic",
      action: "Checks PULSE - rate, rhythm, character",
      marks: 1,
      isCritical: true,
      expectedFindings: [
        "Tachycardia/AF = hyperthyroidism",
        "Bradycardia = hypothyroidism"
      ]
    },
    {
      id: "C27",
      category: "Systemic",
      action: "Examines EYES - proptosis, lid lag, lid retraction, exophthalmos",
      marks: 2,
      isCritical: true,
      expectedFindings: [
        "Proptosis = Graves' ophthalmopathy",
        "Lid lag (von Graefe's sign) = hyperthyroidism",
        "Lid retraction = visible sclera above iris"
      ],
      teachingNote: "Eye signs specific to Graves' (autoimmune), not just any hyperthyroidism"
    },
    {
      id: "C28",
      category: "Systemic",
      action: "Checks REFLEXES - ankle jerk for hung-up reflex",
      marks: 1,
      isCritical: false,
      expectedFindings: [
        "Brisk = hyperthyroidism",
        "Hung-up (delayed relaxation) = hypothyroidism"
      ],
      teachingNote: "Delayed relaxation phase classic for myxedema"
    },
    {
      id: "C29",
      category: "Systemic",
      action: "Examines LEGS - pretibial myxedema (Graves')",
      marks: 1,
      isCritical: false,
      expectedFindings: [
        "Non-pitting edema, 'orange peel' skin over shins = Graves' dermopathy"
      ]
    },
    
    // CONCLUSION (4 marks)
    {
      id: "C30",
      category: "Conclusion",
      action: "Thanks patient, helps them dress, washes hands",
      marks: 1,
      isCritical: false
    },
    {
      id: "C31",
      category: "Conclusion",
      action: "Presents findings in organized manner",
      marks: 1,
      isCritical: true,
      teachingNote: "Structure: swelling description → thyroid status → clinical diagnosis"
    },
    {
      id: "C32",
      category: "Conclusion",
      action: "States DIFFERENTIAL DIAGNOSIS (2-3 reasonable options)",
      marks: 1,
      isCritical: true,
      expectedFindings: [
        "Solitary toxic nodule",
        "Dominant nodule in MNG with hyperthyroidism",
        "Follicular adenoma/carcinoma",
        "Papillary carcinoma"
      ]
    },
    {
      id: "C33",
      category: "Conclusion",
      action: "Suggests appropriate INVESTIGATIONS",
      marks: 1,
      isCritical: true,
      expectedFindings: [
        "TSH, Free T4, Free T3",
        "Thyroid USG",
        "FNAC (Bethesda classification)",
        "Thyroid scan if hyperthyroid (hot/cold nodule)"
      ]
    }
  ],
  
  scoringCriteria: [
    {
      category: "Introduction & Communication",
      maxMarks: 4,
      passingMarks: 3,
      items: ["Greeting", "Consent", "Hand hygiene", "Exposure"]
    },
    {
      category: "Inspection",
      maxMarks: 5,
      passingMarks: 4,
      items: ["Visual inspection", "Movement with swallowing", "Movement with tongue protrusion"]
    },
    {
      category: "Palpation",
      maxMarks: 10,
      passingMarks: 7,
      items: ["Technique", "Lobes & isthmus", "Character", "Mobility", "Lower border"]
    },
    {
      category: "Percussion & Auscultation",
      maxMarks: 4,
      passingMarks: 2,
      items: ["Manubrium percussion", "Thyroid bruit"]
    },
    {
      category: "Special Tests",
      maxMarks: 6,
      passingMarks: 4,
      items: ["Tracheal position", "Pemberton's sign", "Lymph nodes"]
    },
    {
      category: "Thyroid Status",
      maxMarks: 8,
      passingMarks: 5,
      items: ["Hands", "Pulse", "Eyes", "Reflexes"]
    },
    {
      category: "Conclusion",
      maxMarks: 4,
      passingMarks: 3,
      items: ["Presentation", "Differential", "Investigations"]
    }
  ],
  
  totalMarks: 41,
  passingMarks: 28,
  distinctionMarks: 36,
  
  modelAnswers: [
    {
      section: "Introduction",
      approach: "Professional, patient-centered",
      verbalScript: `"Good morning. I am Dr. [Name], a final year medical student. 
May I confirm your name? Mrs. Sharma? 
I've been asked to examine your neck swelling. 
This will involve me looking at your neck, feeling the swelling, and checking a few other things.
Is that alright with you?
I'll wash my hands first, and please let me know if anything is uncomfortable."`,
      keyPoints: [
        "Introduce yourself",
        "Confirm patient identity",
        "Explain procedure",
        "Obtain consent"
      ]
    },
    {
      section: "Inspection",
      approach: "Systematic, front view first, then maneuvers",
      verbalScript: `"I'm going to stand in front of you and observe your neck. 
I can see a visible swelling in the front of your neck, more prominent on the right side.
The skin over it appears normal with no obvious scars or discoloration.
There are no visible dilated veins.

Now, I'm going to give you a glass of water. Please take a sip and swallow when I ask.
[Patient swallows]
I can see the swelling moves upward when you swallow - this is consistent with a thyroid origin.

Now, could you please stick your tongue out and keep it out for a moment?
[Patient protrudes tongue]
The swelling does NOT move with tongue protrusion.
This confirms it is thyroid in origin and NOT a thyroglossal cyst."`,
      keyPoints: [
        "Describe what you see",
        "Comment on swallowing - moves up = thyroid",
        "Comment on tongue protrusion - no movement = NOT thyroglossal"
      ]
    },
    {
      section: "Palpation",
      approach: "From behind, systematic, with swallowing",
      verbalScript: `"Now I'm going to feel the swelling from behind you. 
Could you please relax your neck muscles and tilt your chin slightly down?

[Standing behind patient]
I'm using both hands to palpate the thyroid gland.
I can feel the right lobe which is enlarged - approximately 4 cm in size.
The surface is smooth, the consistency is firm.
There is a distinct nodule within the right lobe.
The left lobe feels normal.
I can palpate the isthmus which appears normal.

Please swallow again while I feel the gland.
[Patient swallows]
Yes, I can confirm the swelling moves upward with swallowing.

The swelling is mobile in all directions and not fixed.
I can get my fingers below the lower pole of the swelling, 
which suggests there is no retrosternal extension.
The swelling is non-tender."`,
      keyPoints: [
        "Examine from behind",
        "Describe size, surface, consistency",
        "Check both lobes and isthmus",
        "Confirm movement with swallowing",
        "Check for fixity",
        "Check lower border (retrosternal)"
      ]
    },
    {
      section: "Percussion & Auscultation",
      approach: "Quick but important",
      verbalScript: `"I'm going to tap over your upper chest.
[Percusses manubrium]
The percussion note is resonant - no evidence of retrosternal extension.

Now I'm going to listen over the swelling with my stethoscope.
Could you hold your breath for a moment?
[Auscultates]
There is no bruit audible over the thyroid gland."`,
      keyPoints: [
        "Percuss manubrium for retrosternal goiter",
        "Auscultate for bruit (breath-holding)",
        "Bruit suggests Graves'"
      ]
    },
    {
      section: "Special Tests & Thyroid Status",
      approach: "Check for complications and thyroid function status",
      verbalScript: `"I'm going to check a few more things.

The trachea is central - not deviated.

Could you raise both arms above your head and hold them there?
[After 1 minute]
There is no facial plethora or congestion - Pemberton's sign is negative.

Let me check the lymph nodes in your neck.
[Palpates cervical nodes]
I don't feel any enlarged lymph nodes.

Now I'll check your thyroid status:

HANDS:
Please hold your arms straight out with fingers spread.
[Places paper on hands]
I can see a fine tremor present.
Your palms are warm and moist.
No palmar erythema or thyroid acropachy.

PULSE:
Your pulse is 92 per minute, regular rhythm.

EYES:
I don't see any proptosis or lid lag.
No chemosis or ophthalmoplegia.

[If time]
REFLEXES:
Your ankle jerks are brisk with normal relaxation.

Clinically, this patient appears MILDLY HYPERTHYROID."`,
      keyPoints: [
        "Tracheal deviation",
        "Pemberton's sign",
        "Lymphadenopathy",
        "Thyroid status - hands, pulse, eyes"
      ]
    },
    {
      section: "Conclusion",
      approach: "Organized summary with differentials",
      verbalScript: `"Thank you. You can lower your arms and relax now.

To summarize my findings:

This is a 35-year-old lady with a visible swelling in the right side of her neck 
that moves with deglutition but not with tongue protrusion.

On palpation, there is a 4 cm, firm, smooth, mobile nodule in the right lobe 
of the thyroid gland. The left lobe and isthmus are normal.
There is no retrosternal extension and no cervical lymphadenopathy.

The patient has clinical features suggestive of mild hyperthyroidism - 
fine tremor and tachycardia.

My differential diagnosis would be:
1. Solitary toxic nodule (autonomous functioning nodule)
2. Dominant nodule in a multinodular goiter with hyperthyroidism
3. Follicular adenoma or carcinoma (less likely given hyperthyroid features)

I would like to confirm with:
1. Thyroid function tests - TSH, Free T4, Free T3
2. Ultrasound of the thyroid
3. Thyroid scan to determine if this is a 'hot' or 'cold' nodule
4. FNAC if indicated based on the above"`,
      keyPoints: [
        "Summarize findings systematically",
        "State thyroid status",
        "Give 2-3 differentials",
        "Suggest investigations"
      ]
    }
  ],
  
  keyDifferentials: [
    "Solitary thyroid nodule (adenoma)",
    "Toxic adenoma (Plummer's disease)",
    "Dominant nodule in multinodular goiter",
    "Papillary thyroid carcinoma",
    "Follicular thyroid carcinoma",
    "Thyroid cyst",
    "Thyroglossal cyst (if moves with tongue - ruled out in this case)"
  ],
  
  redFlags: [
    "🚩 Hard, fixed nodule = malignancy until proven otherwise",
    "🚩 Cervical lymphadenopathy = metastatic papillary carcinoma",
    "🚩 Hoarseness/voice change = recurrent laryngeal nerve involvement",
    "🚩 Rapid growth = anaplastic carcinoma or hemorrhage into nodule",
    "🚩 Stridor = tracheal compression",
    "🚩 Pemberton's positive = thoracic inlet obstruction",
    "🚩 Berry's sign (absent carotid) = carotid encasement by tumor"
  ],
  
  commonMistakes: [
    "❌ Forgetting to examine from BEHIND - cardinal rule of thyroid examination",
    "❌ Not asking to swallow - misses key diagnostic maneuver",
    "❌ Forgetting tongue protrusion test - can't differentiate thyroglossal cyst",
    "❌ Examining only the swelling, ignoring thyroid status",
    "❌ Not checking lymph nodes - misses malignancy",
    "❌ Forgetting Pemberton's sign - misses retrosternal extension",
    "❌ Not auscultating for bruit - misses Graves' disease clue",
    "❌ Rushing through without organized presentation",
    "❌ Not stating differentials and investigations at the end"
  ],
  
  tips: [
    "✅ Always stand BEHIND for palpation (stand in front = fail)",
    "✅ Carry water in your pocket for the swallowing test",
    "✅ Use a paper on outstretched hands to demonstrate fine tremor",
    "✅ Talk as you examine - examiners want to hear your findings",
    "✅ Structure your conclusion: Description → Thyroid status → Differentials → Investigations",
    "✅ If hyperthyroid features present, think: Graves', toxic MNG, toxic adenoma",
    "✅ Check eyes LAST - saves time and finishes with dramatic findings if present",
    "✅ Practice time management - don't spend too long on one component"
  ],
  
  references: [
    "Bailey & Love Chapter 50: The Thyroid Gland (pp. 805-836)",
    "Macleod's Clinical Examination, 14th Ed - Chapter 6: Endocrine System",
    "Browse's Introduction to Clinical Surgery - Thyroid Examination",
    "Hutchison's Clinical Methods - Chapter 13: The Endocrine System",
    "MRCS Part B OSCE Revision Guide - Lumps & Bumps Stations"
  ],
  
  lastUpdated: "2024-12-15",
  author: "NucleuX Academy"
};

// ============== HELPER FUNCTIONS ==============

export function calculateOSCEScore(
  checkedItems: string[]
): {
  score: number;
  percentage: number;
  grade: 'Distinction' | 'Pass' | 'Borderline' | 'Fail';
  feedback: string;
  missedCritical: string[];
} {
  const station = thyroidExaminationOSCE;
  let score = 0;
  const missedCritical: string[] = [];
  
  for (const item of station.checklist) {
    if (checkedItems.includes(item.id)) {
      score += item.marks;
    } else if (item.isCritical) {
      missedCritical.push(item.action);
    }
  }
  
  const percentage = Math.round((score / station.totalMarks) * 100);
  
  let grade: 'Distinction' | 'Pass' | 'Borderline' | 'Fail';
  let feedback: string;
  
  if (missedCritical.length >= 3) {
    grade = 'Fail';
    feedback = `Critical actions missed: ${missedCritical.join(', ')}. These are essential components of the examination.`;
  } else if (score >= station.distinctionMarks) {
    grade = 'Distinction';
    feedback = 'Excellent systematic examination with comprehensive thyroid status assessment.';
  } else if (score >= station.passingMarks) {
    grade = 'Pass';
    feedback = 'Competent examination. Review missed areas for improvement.';
  } else if (score >= station.passingMarks - 4) {
    grade = 'Borderline';
    feedback = 'Nearly passing. Focus on the areas you missed, especially critical actions.';
  } else {
    grade = 'Fail';
    feedback = 'Needs significant improvement. Practice the systematic approach and ensure all components are covered.';
  }
  
  return { score, percentage, grade, feedback, missedCritical };
}

export function getTimingGuide(): {
  phase: string;
  suggestedTime: string;
  actions: string[];
}[] {
  return [
    {
      phase: "Introduction",
      suggestedTime: "0:00 - 0:30",
      actions: ["Greet", "Consent", "Hand hygiene", "Expose"]
    },
    {
      phase: "Inspection",
      suggestedTime: "0:30 - 1:30",
      actions: ["Visual inspection", "Swallowing test", "Tongue protrusion test"]
    },
    {
      phase: "Palpation",
      suggestedTime: "1:30 - 3:30",
      actions: ["From behind", "Both lobes + isthmus", "Character", "Mobility", "Lower border"]
    },
    {
      phase: "Percussion & Auscultation",
      suggestedTime: "3:30 - 4:00",
      actions: ["Manubrium percussion", "Bruit auscultation"]
    },
    {
      phase: "Special Tests",
      suggestedTime: "4:00 - 5:00",
      actions: ["Trachea", "Pemberton's", "Lymph nodes"]
    },
    {
      phase: "Thyroid Status",
      suggestedTime: "5:00 - 6:30",
      actions: ["Hands", "Pulse", "Eyes", "(Reflexes if time)"]
    },
    {
      phase: "Conclusion",
      suggestedTime: "6:30 - 8:00",
      actions: ["Thank patient", "Present findings", "Differentials", "Investigations"]
    }
  ];
}

export default thyroidExaminationOSCE;
