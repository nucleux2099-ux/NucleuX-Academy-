/**
 * Guided Learning Module Template
 * Topic: Hernia Basics
 * 
 * Step-by-step concept mastery with pre/post testing
 */

// ============== TYPE DEFINITIONS ==============

export interface LearningObjective {
  id: string;
  objective: string;
  bloomLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  assessedBy: string[];
}

export interface PrePostMCQ {
  id: string;
  question: string;
  options: { a: string; b: string; c: string; d: string };
  correctAnswer: 'a' | 'b' | 'c' | 'd';
  explanation: string;
  conceptTested: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface AtomicConcept {
  id: string;
  title: string;
  order: number;
  estimatedMinutes: number;
  
  // Content Sections
  keyPoint: string;
  explanation: string;
  visualAid?: {
    type: 'diagram' | 'table' | 'flowchart' | 'mnemonic' | 'image';
    content: string;
    caption?: string;
  };
  
  // Learning Aids
  mnemonic?: string;
  clinicalPearl?: string;
  examTip?: string;
  
  // Active Learning
  checkQuestion?: {
    question: string;
    answer: string;
  };
  
  // Links
  relatedConcepts?: string[];
  textbookRef?: string;
}

export interface ClinicalCorrelation {
  scenario: string;
  connection: string;
  conceptIds: string[];
}

export interface SpacedRepetitionSchedule {
  day: number;
  action: string;
  focus: string;
}

export interface GuidedLearningModule {
  id: string;
  title: string;
  subject: string;
  topic: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  
  // Metadata
  estimatedTime: number; // minutes
  targetAudience: string[];
  prerequisites: string[];
  lastUpdated: string;
  version: string;
  
  // Learning Structure
  learningObjectives: LearningObjective[];
  preTest: PrePostMCQ[];
  concepts: AtomicConcept[];
  clinicalCorrelations: ClinicalCorrelation[];
  postTest: PrePostMCQ[];
  
  // Consolidation
  summaryPoints: string[];
  spacedRepetition: SpacedRepetitionSchedule[];
  
  // References
  textbookReferences: {
    book: string;
    chapter: string;
    pages: string;
  }[];
  additionalResources: string[];
  
  // Assessment
  passingScore: number;
  masteryScore: number;
}

// ============== SAMPLE CONTENT ==============

export const herniaBasicsModule: GuidedLearningModule = {
  id: "GLM-SURG-HERNIA-001",
  title: "Hernia Basics: From Anatomy to Clinical Examination",
  subject: "General Surgery",
  topic: "Abdominal Wall Hernias",
  difficulty: "Basic",
  
  estimatedTime: 45,
  targetAudience: ["MBBS 3rd Year", "Final Year", "Internship", "NEET-PG Foundation"],
  prerequisites: ["Basic anatomy of abdominal wall", "Clinical examination skills"],
  lastUpdated: "2024-12-15",
  version: "1.0",
  
  learningObjectives: [
    {
      id: "LO1",
      objective: "Define hernia and describe its anatomical components",
      bloomLevel: "Remember",
      assessedBy: ["Pre-test Q1", "Concept 1"]
    },
    {
      id: "LO2",
      objective: "Differentiate between types of hernias based on anatomical location",
      bloomLevel: "Understand",
      assessedBy: ["Pre-test Q2", "Concept 2-5"]
    },
    {
      id: "LO3",
      objective: "Apply anatomical knowledge to differentiate direct from indirect inguinal hernia",
      bloomLevel: "Apply",
      assessedBy: ["Pre-test Q3", "Concept 6-7", "Post-test Q3-4"]
    },
    {
      id: "LO4",
      objective: "Describe the clinical examination technique for groin hernias",
      bloomLevel: "Apply",
      assessedBy: ["Concept 8", "Post-test Q5"]
    },
    {
      id: "LO5",
      objective: "Recognize clinical features of complications (obstruction, strangulation)",
      bloomLevel: "Analyze",
      assessedBy: ["Post-test Q4-5", "Clinical Correlations"]
    }
  ],
  
  preTest: [
    {
      id: "PRE-1",
      question: "Which of the following is NOT a component of a hernia?",
      options: {
        a: "Sac",
        b: "Coverings",
        c: "Contents",
        d: "Fascia transversalis"
      },
      correctAnswer: "d",
      explanation: "A hernia has three components: SAC (peritoneum), COVERINGS (layers of abdominal wall), and CONTENTS (viscera). Fascia transversalis is part of the abdominal wall, not a hernia component - though its weakness contributes to hernia formation.",
      conceptTested: "Definition and components of hernia",
      difficulty: "Easy"
    },
    {
      id: "PRE-2",
      question: "An inguinal hernia that lies MEDIAL to the inferior epigastric artery is:",
      options: {
        a: "Indirect inguinal hernia",
        b: "Direct inguinal hernia",
        c: "Femoral hernia",
        d: "Obturator hernia"
      },
      correctAnswer: "b",
      explanation: "Direct inguinal hernia passes through Hesselbach's triangle, which is MEDIAL to the inferior epigastric artery. Indirect hernia enters through the deep ring, LATERAL to the artery. Remember: 'MDs lie' = Medial = Direct.",
      conceptTested: "Anatomical differentiation of groin hernias",
      difficulty: "Medium"
    },
    {
      id: "PRE-3",
      question: "The boundaries of Hesselbach's triangle include all EXCEPT:",
      options: {
        a: "Inguinal ligament inferiorly",
        b: "Lateral border of rectus abdominis medially",
        c: "Internal oblique muscle superiorly",
        d: "Inferior epigastric artery laterally"
      },
      correctAnswer: "c",
      explanation: "Hesselbach's triangle boundaries: Inferior = Inguinal ligament, Medial = Lateral border of rectus abdominis, Lateral = Inferior epigastric artery. The floor is fascia transversalis. Internal oblique is NOT a boundary.",
      conceptTested: "Hesselbach's triangle anatomy",
      difficulty: "Medium"
    }
  ],
  
  concepts: [
    // CONCEPT 1: Definition
    {
      id: "C1",
      title: "What is a Hernia?",
      order: 1,
      estimatedMinutes: 3,
      
      keyPoint: "A hernia is the abnormal protrusion of a viscus or part of a viscus through an opening in the wall of the cavity containing it.",
      
      explanation: `**Etymology:** From Greek "hernos" = bud, offshoot

**Key Components of Every Hernia (3 Cs + S):**
1. **Sac** - Peritoneum pushed out
2. **Coverings** - Layers of abdominal wall
3. **Contents** - What's inside (bowel, omentum, etc.)

**Note:** Some add a 4th: **Site/Ring** - the defect through which it protrudes

**Types by Reducibility:**
- **Reducible** - Contents return to abdomen
- **Irreducible/Incarcerated** - Contents stuck, but viable
- **Obstructed** - Bowel contents blocked
- **Strangulated** - Blood supply cut off (EMERGENCY!)`,

      visualAid: {
        type: "diagram",
        content: `
┌─────────────────────────────────────────────────┐
│           HERNIA ANATOMY                        │
│                                                 │
│    Skin ───────────────────────────────         │
│    Subcutaneous fat ───────────────────         │
│    External oblique ────────────────── ╮        │
│    Internal oblique ────────────────── │ COVERINGS
│    Transversus abdominis ────────────  │        │
│    Fascia transversalis ─────────────  ╯        │
│    Peritoneum (SAC) ─────────────────  ╮        │
│         ↓                              │        │
│    ┌─────────────────┐                 │        │
│    │  ○ ○ ○ ○ ○      │ ←── CONTENTS   ╯        │
│    │  (Bowel loops)  │     (omentum, bowel)    │
│    └─────────────────┘                         │
│         ↑                                      │
│    DEFECT/RING ──── Weak point in wall         │
└─────────────────────────────────────────────────┘`,
        caption: "Basic anatomy of a hernia showing sac, coverings, and contents"
      },
      
      mnemonic: "**S-C-C**: Sac-Coverings-Contents (like SCC carcinoma!)",
      
      clinicalPearl: "The sac is ALWAYS peritoneum. If you open a hernia sac, you're entering the peritoneal cavity!",
      
      checkQuestion: {
        question: "A patient has a lump in the groin that goes back when he lies down. What type of hernia is this by reducibility?",
        answer: "Reducible hernia - contents return to the abdominal cavity spontaneously or with gentle pressure."
      },
      
      textbookRef: "Bailey & Love Chapter 60, p.1024"
    },
    
    // CONCEPT 2: Classification
    {
      id: "C2",
      title: "Types of Hernias by Location",
      order: 2,
      estimatedMinutes: 4,
      
      keyPoint: "Hernias are classified by their anatomical location, with inguinal hernias being the most common (75%).",
      
      explanation: `**Classification by Location:**

| Type | Frequency | Key Feature |
|------|-----------|-------------|
| **Inguinal** | 75% | Through inguinal canal |
| **Femoral** | 5% | Through femoral canal |
| **Umbilical** | 10% | Through umbilical ring |
| **Incisional** | 10% | Through surgical scar |
| **Epigastric** | <1% | Linea alba above umbilicus |
| **Spigelian** | Rare | Semilunar line |
| **Lumbar** | Rare | Superior/Inferior triangles |
| **Obturator** | Rare | Obturator foramen |
| **Sciatic** | Very rare | Sciatic foramina |

**By Cause:**
- **Congenital** - Patent processus vaginalis (indirect inguinal)
- **Acquired** - Weakness develops over time (direct inguinal, incisional)

**By Anatomy:**
- **External** - Protrude outside abdominal cavity
- **Internal** - Within peritoneal cavity (paraduodenal, etc.)`,

      visualAid: {
        type: "diagram",
        content: `
┌────────────────────────────────────────────────┐
│         ANTERIOR ABDOMINAL WALL                │
│                                                │
│            ┌──────────┐                        │
│            │ Epigastric│ (linea alba)          │
│            └────┬─────┘                        │
│                 │                              │
│         ────────●──────── (Umbilical)          │
│                 │                              │
│    Spigelian →  │                              │
│    (semilunar)  │                              │
│                 │                              │
│        ┌───────┬┴┬───────┐                     │
│        │       │ │       │                     │
│     Inguinal  Femoral  Inguinal                │
│     (Left)   (Below)   (Right)                 │
│                                                │
│    GROIN HERNIAS = Most common!                │
└────────────────────────────────────────────────┘`,
        caption: "Common hernia locations on the anterior abdominal wall"
      },
      
      examTip: "When asked about 'most common hernia' - answer INGUINAL. Within inguinal, INDIRECT is more common than direct.",
      
      relatedConcepts: ["C3", "C4", "C5"],
      textbookRef: "Sabiston Chapter 44, p.1092"
    },
    
    // CONCEPT 3: Inguinal Canal Anatomy
    {
      id: "C3",
      title: "The Inguinal Canal - Anatomy Made Easy",
      order: 3,
      estimatedMinutes: 5,
      
      keyPoint: "The inguinal canal is a 4 cm oblique passage in the lower anterior abdominal wall, transmitting the spermatic cord in males and round ligament in females.",
      
      explanation: `**Inguinal Canal Basics:**
- Length: 4 cm (babies: 1-1.5 cm)
- Direction: Downward, forward, and medial
- Opens at: Deep ring (laterally) → Superficial ring (medially)

**WALLS OF INGUINAL CANAL:**

| Wall | Structure |
|------|-----------|
| **Anterior** | External oblique aponeurosis (entire), Internal oblique (lateral 1/3) |
| **Posterior** | Fascia transversalis (entire), Conjoint tendon (medial 1/3) |
| **Roof** | Arching fibers of internal oblique and transversus |
| **Floor** | Inguinal ligament, Lacunar ligament (medially) |

**RINGS:**
- **Deep Ring:** Opening in fascia transversalis, lateral to inferior epigastric artery
- **Superficial Ring:** Opening in external oblique aponeurosis, above pubic tubercle`,

      visualAid: {
        type: "mnemonic",
        content: `
**MALT** for WALLS:
┌─────────────────────────────────────────────────┐
│                                                 │
│  2 MALT BALLS - Muscle Anterior, Ligament Table │
│                                                 │
│  • Muscle Anterior    = Int. oblique + Ext. obl │
│  • Aponeurosis        = Conjoint tendon        │
│  • Ligament (floor)   = Inguinal ligament      │
│  • Transversalis      = Fascia transversalis   │
│                                                 │
│  ROOF = Arching fibers (Internal oblique +      │
│         Transversus abdominis)                  │
│                                                 │
│  Remember: What ENTERS lateral, EXITS medial    │
│  Deep ring → → → → → Superficial ring           │
│  (Lat to IEA)         (Above pubic tubercle)    │
│                                                 │
└─────────────────────────────────────────────────┘`,
        caption: "Mnemonic for inguinal canal walls"
      },
      
      clinicalPearl: "The DEEP RING is the site where indirect hernias enter. It's lateral to the inferior epigastric artery - this is the key anatomical landmark!",
      
      mnemonic: "**MALT** - Muscles form roof, Aponeurosis posterior, Ligament floor, Transversalis posterior",
      
      checkQuestion: {
        question: "What forms the anterior wall of the inguinal canal in its lateral 1/3?",
        answer: "External oblique aponeurosis PLUS internal oblique muscle. In the medial 2/3, it's only external oblique aponeurosis."
      },
      
      textbookRef: "Gray's Anatomy for Students, p.268-272"
    },
    
    // CONCEPT 4: Hesselbach's Triangle
    {
      id: "C4",
      title: "Hesselbach's Triangle - The Direct Hernia Site",
      order: 4,
      estimatedMinutes: 4,
      
      keyPoint: "Hesselbach's triangle is the weak area of the posterior wall of inguinal canal where DIRECT hernias emerge.",
      
      explanation: `**Hesselbach's Triangle (Inguinal Triangle):**

**Boundaries:**
- **Medial:** Lateral border of rectus abdominis
- **Lateral:** Inferior epigastric artery
- **Inferior:** Inguinal ligament (medial half)
- **Floor:** Fascia transversalis (WEAK AREA!)

**Clinical Significance:**
- Floor is only fascia transversalis (no muscle)
- Weakens with age and straining
- DIRECT hernias protrude through this triangle
- INDIRECT hernias are LATERAL to this triangle (through deep ring)`,

      visualAid: {
        type: "diagram",
        content: `
┌─────────────────────────────────────────────────┐
│                                                 │
│          HESSELBACH'S TRIANGLE                  │
│                                                 │
│     Rectus abdominis                            │
│            │                                    │
│            │       Inferior                     │
│            │       Epigastric                   │
│            │       Artery                       │
│            │         ╱                          │
│            │        ╱                           │
│            │  DIRECT ╱                          │
│            │  HERNIA╱                           │
│            │   ⭕  ╱                            │
│            │     ╱    🔵 INDIRECT               │
│            │    ╱     (Through deep ring)       │
│            │   ╱      (LATERAL to IEA)          │
│      ══════●══╱════════════════════════         │
│         Inguinal Ligament                       │
│                                                 │
│  ⭕ = Direct (MEDIAL to IEA)                   │
│  🔵 = Indirect (LATERAL to IEA)                │
│                                                 │
└─────────────────────────────────────────────────┘`,
        caption: "Hesselbach's triangle showing direct vs indirect hernia sites"
      },
      
      mnemonic: `**"MDs LIE"**
- **M**edial = **D**irect
- **L**ateral = **I**ndirect

The inferior **E**pigastric artery is the dividing landmark!`,
      
      examTip: "This is a VERY HIGH-YIELD exam concept. Remember: Direct = Medial to IEA, Indirect = Lateral to IEA. The IEA is your key landmark.",
      
      relatedConcepts: ["C3", "C5", "C6"],
      textbookRef: "Bailey & Love Chapter 60, p.1027"
    },
    
    // CONCEPT 5: Femoral Canal
    {
      id: "C5",
      title: "Femoral Canal and Femoral Hernia",
      order: 5,
      estimatedMinutes: 4,
      
      keyPoint: "Femoral hernia passes through the femoral canal, which is the medial compartment of the femoral sheath, BELOW and LATERAL to the pubic tubercle.",
      
      explanation: `**Femoral Canal:**
- Medial compartment of femoral sheath
- Length: 1.3 cm
- Contains: Fat and lymph node (Cloquet's/Rosenmuller's)

**Boundaries:**
| Border | Structure |
|--------|-----------|
| **Anterior** | Inguinal ligament |
| **Posterior** | Pectineal ligament (Cooper's) |
| **Lateral** | Femoral vein |
| **Medial** | Lacunar ligament (sharp edge!) |

**Femoral Ring** = Abdominal opening of femoral canal

**Clinical Features of Femoral Hernia:**
- More common in FEMALES (F/M = 4:1)
- Located BELOW and LATERAL to pubic tubercle
- Inguinal is ABOVE and MEDIAL to pubic tubercle
- HIGH RISK of strangulation (narrow neck, sharp lacunar ligament)`,

      visualAid: {
        type: "diagram",
        content: `
┌─────────────────────────────────────────────────┐
│                                                 │
│     GROIN ANATOMY - Surface View                │
│                                                 │
│          Inguinal ligament                      │
│     ─────────────────────────────               │
│              │                                  │
│         ⭕   │   🔵                              │
│      Inguinal│ Femoral                          │
│       Hernia │  Hernia                          │
│              │                                  │
│        ──────●────────                          │
│        Pubic tubercle                           │
│                                                 │
│   ⭕ Inguinal: ABOVE & MEDIAL to PT            │
│   🔵 Femoral: BELOW & LATERAL to PT            │
│                                                 │
│   ════════════════════════════════════          │
│                                                 │
│     FEMORAL SHEATH Contents (Lat → Med):        │
│     ┌─────┬─────┬─────────┐                     │
│     │  A  │  V  │ Canal   │                     │
│     │     │     │ (fat,   │                     │
│     │     │     │ lymph)  │                     │
│     └─────┴─────┴─────────┘                     │
│     Artery Vein   Femoral                       │
│                   Hernia                        │
│                   Site                          │
│                                                 │
└─────────────────────────────────────────────────┘`,
        caption: "Inguinal vs Femoral hernia location relative to pubic tubercle"
      },
      
      mnemonic: `**"NAVY"** for femoral sheath contents (lateral to medial):
- **N**erve (outside sheath, but adjacent)
- **A**rtery
- **V**ein
- **Y**? (Empty space = Canal = where hernia goes!)`,
      
      clinicalPearl: "Femoral hernias have the HIGHEST strangulation rate (15-20%) of all groin hernias because of the rigid boundaries (lacunar ligament is razor-sharp). Always repair urgently!",
      
      checkQuestion: {
        question: "A 60-year-old woman has a small, irreducible lump in the groin BELOW the inguinal ligament. What is the most likely diagnosis and why is it urgent?",
        answer: "Incarcerated FEMORAL hernia. Urgent because: 1) Femoral hernias have high strangulation risk (15-20%), 2) The lacunar ligament is sharp and rigid, 3) Narrow femoral ring."
      },
      
      textbookRef: "Bailey & Love Chapter 60, p.1034"
    },
    
    // CONCEPT 6: Direct vs Indirect
    {
      id: "C6",
      title: "Direct vs Indirect Inguinal Hernia - The Key Differences",
      order: 6,
      estimatedMinutes: 5,
      
      keyPoint: "Indirect inguinal hernia passes through the deep ring (lateral to IEA) and enters the spermatic cord. Direct hernia pushes through Hesselbach's triangle (medial to IEA) and is separate from the cord.",
      
      explanation: `**Comparison Table:**

| Feature | INDIRECT | DIRECT |
|---------|----------|--------|
| **Age** | Any age (including children) | Usually >40 years |
| **Cause** | Congenital (patent PV) | Acquired (weakness) |
| **Route** | Through DEEP RING | Through Hesselbach's |
| **Relation to IEA** | LATERAL | MEDIAL |
| **Relation to cord** | INSIDE cord | OUTSIDE cord |
| **Shape** | Oval/elongated | Globular/rounded |
| **Descent to scrotum** | CAN descend | Rarely descends |
| **Strangulation risk** | Higher | Lower |
| **Controlled by deep ring occlusion** | YES | NO |
| **Frequency** | 60% of inguinal | 40% of inguinal |

**Key Anatomical Difference:**
- Indirect: Sac is covered by all 3 coverings of spermatic cord
- Direct: Sac is behind the cord, only covered by external spermatic fascia`,

      visualAid: {
        type: "diagram",
        content: `
┌─────────────────────────────────────────────────┐
│                                                 │
│     DIRECT vs INDIRECT - Cross Section          │
│                                                 │
│     Inferior Epigastric Artery                  │
│              │                                  │
│              │                                  │
│    DIRECT    │    INDIRECT                      │
│      ⬇       │       ⬇                          │
│              │                                  │
│    ┌────┐    │    ╭─────╮                       │
│    │    │    │    │ ⚪  │ ← Hernia inside       │
│    │ ⚪ │    │    │     │   spermatic cord      │
│    │    │    │    ╰─────╯                       │
│    └────┘    │                                  │
│      ↓       │       ↓                          │
│   Behind     │    Within                        │
│    cord      │     cord                         │
│              │                                  │
│   (Medial)   │   (Lateral)                      │
│              │                                  │
│  MDs LIE: Medial=Direct, Lateral=Indirect       │
│                                                 │
└─────────────────────────────────────────────────┘`,
        caption: "Cross-sectional anatomy of direct vs indirect hernia"
      },
      
      mnemonic: `**"MDs LIE, Kids are INdirect"**
- **M**edial = **D**irect
- **L**ateral = **I**ndirect  
- **I**nfants have **IN**direct (congenital)`,
      
      examTip: "The DEEP RING OCCLUSION TEST: If you press over the deep ring (1 cm above midpoint of inguinal ligament) and the hernia is controlled → INDIRECT. If it still protrudes → DIRECT.",
      
      clinicalPearl: "An indirect hernia can become direct and vice versa? NO! But they can COEXIST as a 'PANTALOON' or 'SADDLE-BAG' hernia, straddling the inferior epigastric artery.",
      
      relatedConcepts: ["C3", "C4", "C7", "C8"],
      textbookRef: "Sabiston Chapter 44, p.1095-1098"
    },
    
    // CONCEPT 7: Other Important Hernias
    {
      id: "C7",
      title: "Umbilical and Incisional Hernias",
      order: 7,
      estimatedMinutes: 4,
      
      keyPoint: "Umbilical hernias are common in infants (usually resolve by age 3) and obese adults. Incisional hernias occur through surgical scars due to wound healing failure.",
      
      explanation: `**UMBILICAL HERNIA:**

**In Infants:**
- Failure of closure of umbilical ring
- 10-20% of newborns (higher in premature)
- Most close spontaneously by age 3-4
- Surgery if: persists >4 years, >2 cm, or complications

**In Adults:**
- Acquired, through stretched/weak umbilical scar
- Risk factors: Obesity, pregnancy, ascites, chronic cough
- Higher strangulation risk than pediatric type
- Always needs surgical repair

**INCISIONAL HERNIA:**
- Occurs through a previous surgical scar
- Incidence: 10-15% of laparotomies
- Risk factors:
  - Wound infection (biggest!)
  - Obesity, diabetes
  - Emergency surgery
  - Vertical midline incisions (highest risk)
  - Poor nutrition, steroids`,

      visualAid: {
        type: "table",
        content: `
┌──────────────────────────────────────────────────┐
│   COMPARISON OF UMBILICAL HERNIAS                │
├───────────────────┬──────────────────────────────┤
│    Feature        │  Pediatric  │    Adult      │
├───────────────────┼─────────────┼───────────────┤
│ Cause             │ Congenital  │  Acquired     │
│ Self-resolution   │ Yes (by 3y) │  No           │
│ Strangulation     │ Rare        │  Common       │
│ Treatment         │ Wait (most) │  Always repair│
│ Urgency           │ Elective    │  Semi-urgent  │
└───────────────────┴─────────────┴───────────────┘`,
        caption: "Pediatric vs Adult umbilical hernias"
      },
      
      clinicalPearl: "In adults with umbilical hernia + ascites, ALWAYS address the ascites first (TIPS, medical management). Operating on a tense ascitic abdomen leads to recurrence and complications.",
      
      checkQuestion: {
        question: "What is the single biggest risk factor for incisional hernia?",
        answer: "Wound infection. It disrupts wound healing and leads to weak scar formation. Other factors include obesity, emergency surgery, and malnutrition."
      },
      
      textbookRef: "Bailey & Love Chapter 60, p.1038-1040"
    },
    
    // CONCEPT 8: Clinical Examination
    {
      id: "C8",
      title: "Clinical Examination of Groin Hernias",
      order: 8,
      estimatedMinutes: 5,
      
      keyPoint: "A systematic examination of groin hernias should determine: type (inguinal vs femoral), relation to pubic tubercle, reducibility, and presence of complications.",
      
      explanation: `**SYSTEMATIC APPROACH:**

**1. INSPECTION (standing):**
- Visible swelling? Ask patient to cough
- Skin changes (erythema = strangulation?)
- Bilateral comparison

**2. PALPATION:**
- Locate pubic tubercle (KEY LANDMARK)
- Inguinal: Above & medial to PT
- Femoral: Below & lateral to PT
- Feel for cough impulse
- Check reducibility
- Feel for neck of sac

**3. SPECIFIC TESTS:**

**A. Reducibility Test:**
- Lie patient supine, reduce hernia
- If irreducible → incarcerated
- If tender + irreducible → strangulated?

**B. Deep Ring Occlusion Test:**
- Reduce hernia, patient supine
- Press over DEEP RING (midpoint of inguinal ligament + 1 cm above)
- Ask patient to cough or stand
- Controlled = INDIRECT
- Not controlled = DIRECT

**C. Finger Invagination Test:**
- Invaginate scrotal skin toward superficial ring
- Ask patient to cough
- INDIRECT: Impulse felt at FINGERTIP (from lateral)
- DIRECT: Impulse felt at PULP of finger (from behind)

**4. CHECK OTHER SIDE**
- Bilateral hernias common (especially direct)`,

      visualAid: {
        type: "flowchart",
        content: `
┌─────────────────────────────────────────────────┐
│                                                 │
│     GROIN HERNIA EXAMINATION ALGORITHM          │
│                                                 │
│              Groin Swelling                     │
│                   │                             │
│                   ▼                             │
│         ┌─────────────────┐                     │
│         │ Locate Pubic    │                     │
│         │ Tubercle        │                     │
│         └────────┬────────┘                     │
│                  │                              │
│        ┌─────────┴─────────┐                    │
│        ▼                   ▼                    │
│  ABOVE & MEDIAL      BELOW & LATERAL            │
│        │                   │                    │
│        ▼                   ▼                    │
│   INGUINAL            FEMORAL                   │
│        │                                        │
│        ▼                                        │
│  Deep Ring Test                                 │
│        │                                        │
│    ┌───┴───┐                                    │
│    ▼       ▼                                    │
│ Controlled  Not                                 │
│     │     Controlled                            │
│     ▼       ▼                                   │
│ INDIRECT  DIRECT                                │
│                                                 │
└─────────────────────────────────────────────────┘`,
        caption: "Algorithm for differentiating groin hernias clinically"
      },
      
      mnemonic: `**"PT" Tells All:**
- Pubic Tubercle is the KEY landmark
- Inguinal = Superior (above) = Supra-PT
- Femoral = Inferior (below) = Infra-PT`,
      
      examTip: "In OSCE: Always start by locating the pubic tubercle. Say it out loud: 'I am now palpating the pubic tubercle. The swelling is above and medial to it, suggesting an inguinal hernia.'",
      
      clinicalPearl: "The Zieman's classification uses finger invagination: 1 finger = small, 2 fingers = medium, 3 fingers = large. But more importantly, check if it descends into the scrotum (complete) or not (incomplete/bubonocele).",
      
      relatedConcepts: ["C5", "C6"],
      textbookRef: "Browse's Introduction to Clinical Surgery, p.345-350"
    }
  ],
  
  clinicalCorrelations: [
    {
      scenario: "A 65-year-old man with chronic cough (COPD) presents with a gradually enlarging, reducible groin swelling that increases on coughing. It is above and medial to the pubic tubercle.",
      connection: "Chronic cough increases intra-abdominal pressure → weakens posterior wall → DIRECT inguinal hernia. Being medial to PT confirms inguinal (not femoral). The deep ring occlusion test would NOT control this hernia.",
      conceptIds: ["C4", "C6", "C8"]
    },
    {
      scenario: "A 2-year-old boy is brought with a right groin swelling noticed during crying. The swelling extends into the scrotum and is reducible.",
      connection: "Congenital indirect inguinal hernia due to patent processus vaginalis. In children, inguinal hernias are almost always INDIRECT. Scrotal descent is typical of indirect hernias following the course of the spermatic cord.",
      conceptIds: ["C2", "C3", "C6"]
    },
    {
      scenario: "A 55-year-old obese woman presents with a small, tender, non-reducible lump in the groin. It is below and lateral to the pubic tubercle. She has nausea and vomiting.",
      connection: "STRANGULATED FEMORAL HERNIA - surgical emergency! Location (below/lateral to PT) = femoral. Non-reducible + tender + vomiting = obstruction/strangulation. Femoral hernias have highest strangulation rate due to rigid lacunar ligament.",
      conceptIds: ["C5", "C1"]
    },
    {
      scenario: "A patient who had laparotomy 6 months ago for perforated appendicitis (wound was infected) now has a bulge at the surgical site.",
      connection: "INCISIONAL HERNIA. Risk factors present: emergency surgery, wound infection. The infected wound healing was compromised, leading to weak scar. This requires mesh repair.",
      conceptIds: ["C7"]
    }
  ],
  
  postTest: [
    {
      id: "POST-1",
      question: "A hernia sac is derived from which structure?",
      options: {
        a: "Fascia transversalis",
        b: "Peritoneum",
        c: "External oblique aponeurosis",
        d: "Internal oblique muscle"
      },
      correctAnswer: "b",
      explanation: "The SAC of every hernia is formed by peritoneum that is pushed out through the defect. The coverings are derived from the layers of the abdominal wall that the hernia traverses.",
      conceptTested: "Components of hernia",
      difficulty: "Easy"
    },
    {
      id: "POST-2",
      question: "Which of the following is TRUE about the deep inguinal ring?",
      options: {
        a: "It is an opening in the external oblique aponeurosis",
        b: "It lies medial to the inferior epigastric artery",
        c: "It lies lateral to the inferior epigastric artery",
        d: "It is located above the pubic tubercle"
      },
      correctAnswer: "c",
      explanation: "The deep inguinal ring is an opening in the FASCIA TRANSVERSALIS (not external oblique - that's the superficial ring). It lies LATERAL to the inferior epigastric artery. This is why indirect hernias, which enter through the deep ring, are lateral to the IEA.",
      conceptTested: "Inguinal canal anatomy",
      difficulty: "Medium"
    },
    {
      id: "POST-3",
      question: "On clinical examination, a groin hernia is controlled when pressure is applied 1 cm above the midpoint of the inguinal ligament. This hernia is most likely:",
      options: {
        a: "Direct inguinal hernia",
        b: "Indirect inguinal hernia",
        c: "Femoral hernia",
        d: "Obturator hernia"
      },
      correctAnswer: "b",
      explanation: "This describes the DEEP RING OCCLUSION TEST. The deep ring is located 1 cm above the midpoint of the inguinal ligament (midinguinal point). If pressure here controls the hernia, it means the hernia is entering through the deep ring = INDIRECT hernia. Direct hernias protrude through Hesselbach's triangle and are NOT controlled by deep ring pressure.",
      conceptTested: "Clinical differentiation of inguinal hernias",
      difficulty: "Medium"
    },
    {
      id: "POST-4",
      question: "A 60-year-old woman has an irreducible, tender groin swelling located BELOW and LATERAL to the pubic tubercle with signs of intestinal obstruction. The MOST LIKELY diagnosis is:",
      options: {
        a: "Strangulated indirect inguinal hernia",
        b: "Strangulated direct inguinal hernia",
        c: "Strangulated femoral hernia",
        d: "Incarcerated obturator hernia"
      },
      correctAnswer: "c",
      explanation: "Location is KEY: Below and lateral to pubic tubercle = FEMORAL hernia (inguinal is above and medial). Irreducible + tender + obstruction = strangulation. Femoral hernias have the highest strangulation rate (15-20%) and are more common in women. This is a SURGICAL EMERGENCY.",
      conceptTested: "Femoral hernia and complications",
      difficulty: "Medium"
    },
    {
      id: "POST-5",
      question: "In an indirect inguinal hernia, the hernial sac lies:",
      options: {
        a: "Behind the spermatic cord",
        b: "Medial to the inferior epigastric artery",
        c: "Within the coverings of the spermatic cord",
        d: "Outside the inguinal canal"
      },
      correctAnswer: "c",
      explanation: "Indirect inguinal hernia enters through the deep ring and travels WITHIN the spermatic cord (inside its coverings). It receives all three coverings: internal spermatic fascia, cremasteric muscle, and external spermatic fascia. In contrast, a DIRECT hernia is behind/separate from the cord and only receives external spermatic fascia.",
      conceptTested: "Direct vs Indirect anatomy",
      difficulty: "Hard"
    }
  ],
  
  summaryPoints: [
    "🔹 Hernia = protrusion of viscus through an abnormal opening; has SAC + COVERINGS + CONTENTS",
    "🔹 Inguinal hernias are most common (75%); within these, indirect > direct",
    "🔹 Deep ring (indirect) is LATERAL to inferior epigastric artery; Hesselbach's (direct) is MEDIAL",
    "🔹 Remember 'MDs LIE': Medial = Direct, Lateral = Indirect",
    "🔹 Femoral hernia: Below & lateral to pubic tubercle, highest strangulation risk, common in women",
    "🔹 Deep ring occlusion test: Controls indirect, NOT direct",
    "🔹 Pubic tubercle is the KEY landmark to differentiate inguinal from femoral",
    "🔹 Strangulation = EMERGENCY - irreducible + tender + signs of obstruction/ischemia"
  ],
  
  spacedRepetition: [
    {
      day: 1,
      action: "Initial learning + Pre-test",
      focus: "Complete the module, understand all concepts"
    },
    {
      day: 2,
      action: "Review diagrams + Post-test",
      focus: "Visual reinforcement of anatomy (Hesselbach's, inguinal canal)"
    },
    {
      day: 4,
      action: "Active recall - draw and label",
      focus: "Draw inguinal canal walls, Hesselbach's triangle from memory"
    },
    {
      day: 7,
      action: "Clinical scenario practice",
      focus: "Work through the clinical correlations without looking at answers"
    },
    {
      day: 14,
      action: "Mixed MCQ practice",
      focus: "Attempt 10 random hernia MCQs from question bank"
    },
    {
      day: 30,
      action: "Comprehensive review",
      focus: "Re-attempt pre and post-test; identify any gaps"
    }
  ],
  
  textbookReferences: [
    {
      book: "Bailey & Love's Short Practice of Surgery",
      chapter: "Chapter 60: Hernias and Abdominal Wall",
      pages: "1024-1048"
    },
    {
      book: "Sabiston Textbook of Surgery",
      chapter: "Chapter 44: Hernias",
      pages: "1092-1118"
    },
    {
      book: "Schwartz's Principles of Surgery",
      chapter: "Chapter 37: Inguinal Hernias",
      pages: "1495-1525"
    },
    {
      book: "Maingot's Abdominal Operations",
      chapter: "Chapter 5-8: Hernia Repairs",
      pages: "123-198"
    }
  ],
  
  additionalResources: [
    "Netter's Atlas - Plate 259-262 (Inguinal Region)",
    "Gray's Anatomy for Students - Inguinal Canal section",
    "Surgical Anatomy podcasts - Hernia episode",
    "YouTube: Armando Hasudungan - Inguinal Hernia Anatomy",
    "NEJM Videos in Clinical Medicine - Inguinal Hernia Repair"
  ],
  
  passingScore: 60,
  masteryScore: 85
};

// ============== HELPER FUNCTIONS ==============

export function evaluatePreTest(answers: Record<string, 'a' | 'b' | 'c' | 'd'>): {
  score: number;
  percentage: number;
  weakAreas: string[];
  recommendation: string;
} {
  const learningModule = herniaBasicsModule;
  let correct = 0;
  const weakAreas: string[] = [];
  
  for (const q of learningModule.preTest) {
    if (answers[q.id] === q.correctAnswer) {
      correct++;
    } else {
      weakAreas.push(q.conceptTested);
    }
  }
  
  const percentage = Math.round((correct / learningModule.preTest.length) * 100);
  
  let recommendation: string;
  if (percentage >= 80) {
    recommendation = "Good baseline knowledge! Focus on advanced concepts and clinical applications.";
  } else if (percentage >= 50) {
    recommendation = "Moderate understanding. Work through all concepts carefully, especially the weak areas identified.";
  } else {
    recommendation = "Foundational gaps present. Study each concept thoroughly before proceeding. Don't skip the visual aids!";
  }
  
  return { score: correct, percentage, weakAreas, recommendation };
}

export function evaluatePostTest(answers: Record<string, 'a' | 'b' | 'c' | 'd'>): {
  score: number;
  percentage: number;
  passed: boolean;
  mastered: boolean;
  feedback: string;
  areasToReview: string[];
} {
  const learningModule = herniaBasicsModule;
  let correct = 0;
  const areasToReview: string[] = [];
  
  for (const q of learningModule.postTest) {
    if (answers[q.id] === q.correctAnswer) {
      correct++;
    } else {
      areasToReview.push(q.conceptTested);
    }
  }
  
  const percentage = Math.round((correct / learningModule.postTest.length) * 100);
  const passed = percentage >= learningModule.passingScore;
  const mastered = percentage >= learningModule.masteryScore;
  
  let feedback: string;
  if (mastered) {
    feedback = "🎉 Excellent! You've mastered Hernia Basics. Proceed to advanced topics like hernia repairs (Lichtenstein, TAPP, TEP).";
  } else if (passed) {
    feedback = "✅ Passed! Review the weak areas and attempt again in a few days for mastery.";
  } else {
    feedback = "📚 Not quite there yet. Re-read the concepts you missed and try again. Focus on the visual aids and mnemonics.";
  }
  
  return { score: correct, percentage, passed, mastered, feedback, areasToReview };
}

export function getNextSpacedRepetitionTask(daysSinceStart: number): SpacedRepetitionSchedule | null {
  const schedule = herniaBasicsModule.spacedRepetition;
  
  for (const task of schedule) {
    if (task.day === daysSinceStart) {
      return task;
    }
  }
  
  // Find the next upcoming task
  const upcoming = schedule.filter(t => t.day > daysSinceStart);
  if (upcoming.length > 0) {
    const next = upcoming[0];
    return { ...next, action: `(Upcoming in ${next.day - daysSinceStart} days) ${next.action}` };
  }
  
  return null;
}

export default herniaBasicsModule;
