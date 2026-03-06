/**
 * NucleuX Academy - Carbohydrate Metabolism Topics
 * 
 * Comprehensive carbohydrate metabolism pathways and regulation
 * Sources: Harper's Illustrated Biochemistry 32nd Ed, Chapter 17-21, 31
 */

import type { LibraryTopic } from '../../types/library';

export const CARB_METABOLISM_TOPICS: LibraryTopic[] = [
  // =============================================================================
  // GLYCOLYSIS - GLUCOSE TO PYRUVATE
  // =============================================================================
  {
    id: 'glycolysis',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochemistry-carbohydrate',
    name: 'Glycolysis',
    slug: 'glycolysis',
    description: 'Embden-Meyerhof pathway: glucose → pyruvate with ATP generation',
    content: {
      concept: `# Glycolysis - The Central Pathway

## Overview

> **Glycolysis** is the **anaerobic** breakdown of glucose (or glycogen) to **pyruvate** with net production of **2 ATP** per glucose molecule.

**Location**: Cytoplasm  
**Oxygen**: Not required (anaerobic)  
**Net yield**: 2 ATP, 2 NADH, 2 Pyruvate per glucose

## The 10-Step Pathway

### Phase I: Investment Phase (Steps 1-5)
*Uses 2 ATP to activate glucose*

\`\`\`
Step 1: Glucose → Glucose-6-P
        ↳ Hexokinase (Glucokinase in liver)
        ↳ ATP → ADP

Step 2: Glucose-6-P → Fructose-6-P  
        ↳ Phosphoglucose isomerase

Step 3: Fructose-6-P → Fructose-1,6-bisP
        ↳ PFK-1 (RATE-LIMITING STEP)
        ↳ ATP → ADP

Step 4: Fructose-1,6-bisP → DHAP + G3P
        ↳ Aldolase

Step 5: DHAP ⇌ G3P
        ↳ Triose phosphate isomerase
\`\`\`

### Phase II: Payoff Phase (Steps 6-10)
*Generates 4 ATP (net 2 ATP)*

\`\`\`
Step 6: G3P → 1,3-BPG
        ↳ G3P dehydrogenase
        ↳ NAD+ → NADH (FIRST ATP equivalent)

Step 7: 1,3-BPG → 3-PG
        ↳ Phosphoglycerate kinase
        ↳ ADP → ATP (SUBSTRATE LEVEL)

Step 8: 3-PG → 2-PG
        ↳ Phosphoglycerate mutase

Step 9: 2-PG → PEP + H2O
        ↳ Enolase

Step 10: PEP → Pyruvate
         ↳ Pyruvate kinase
         ↳ ADP → ATP (SUBSTRATE LEVEL)
\`\`\`

## Key Regulatory Enzymes

### 1. Hexokinase/Glucokinase
| Enzyme | Km | Vmax | Inhibition | Tissue |
|--------|-----|------|------------|--------|
| **Hexokinase** | Low (0.1mM) | Low | G6P | Muscle, Brain |
| **Glucokinase** | High (10mM) | High | None | Liver, β-cells |

> 💎 **Glucokinase** acts as glucose sensor in liver and pancreas

### 2. PFK-1 (Rate-Limiting Step)
**Activators**:
- AMP, ADP (energy demand)
- Fructose-2,6-bisphosphate (fed state)
- Pi, NH3

**Inhibitors**:
- ATP, Citrate (energy abundance)
- H+ (acidosis)

### 3. Pyruvate Kinase
**Activators**: Fructose-1,6-bisP (feedforward)
**Inhibitors**: ATP, Alanine, Acetyl-CoA

## Metabolic Fates of Pyruvate

\`\`\`
PYRUVATE →
├── Lactate (Anaerobic conditions)
│   ↳ LDH: NADH → NAD+
├── Acetyl-CoA (Aerobic conditions)
│   ↳ PDH complex → TCA cycle
└── Alanine (Muscle protein catabolism)
    ↳ ALT: Uses amino groups
\`\`\`

## ATP Yield

| Step | Enzyme | ATP Yield |
|------|--------|-----------|
| **Investment** | HK, PFK-1 | **-2 ATP** |
| **Payoff** | PGK (×2) | **+2 ATP** |
| | PK (×2) | **+2 ATP** |
| **NADH** | G3PDH (×2) | **+6 ATP** (aerobic) |
| | | **+0 ATP** (anaerobic) |

> **Net yield**: 2 ATP (anaerobic), 8 ATP (aerobic)

## Clinical Correlations

### Pasteur Effect
- **Aerobic**: ↓ glucose consumption (efficient ATP)
- **Anaerobic**: ↑ glucose consumption (compensatory)

### Warburg Effect
- **Cancer cells**: Prefer glycolysis even with O2
- **Advantage**: Rapid ATP, biosynthetic intermediates

### Hereditary Defects
| Enzyme | Disease | Features |
|--------|---------|----------|
| **PK** | PK deficiency | Hemolytic anemia |
| **G3PDH** | Rare | Myopathy |
| **Enolase** | Enolase deficiency | Exercise intolerance |

> 🏥 **RBC** rely entirely on glycolysis (no mitochondria)`,

      keyPoints: [
        'Glycolysis is anaerobic pathway in cytoplasm producing 2 net ATP per glucose',
        'PFK-1 catalyzes rate-limiting step (F6P → F1,6BP), regulated by energy charge',
        'Investment phase uses 2 ATP, payoff phase generates 4 ATP and 2 NADH',
        'Pyruvate kinase is feedforward activated by F1,6BP',
        'Glucokinase in liver has high Km, acts as glucose sensor',
        'RBC, brain, lens depend on glycolysis; cancer cells prefer it (Warburg effect)',
        'NADH must be reoxidized: lactate (anaerobic) or ETC (aerobic)'
      ],

      examPrep: {
        mnemonics: [
          'Glycolysis 10 steps: "Good Girls Pick Fruit And Dig Gardens, Pretty Girls Play Piano" (Glucose, G6P, F6P, F1,6BP, DHAP+G3P, 1,3BPG, 3PG, 2PG, PEP, Pyruvate)',
          'PFK-1 regulation: "ATP Cuts, AMP Adds" - ATP inhibits, AMP activates',
          'Glucokinase vs Hexokinase: "High Km, High capacity, No inhibition" - Glucokinase features',
          'Pyruvate fates: "LAA" - Lactate (anaerobic), Acetyl-CoA (aerobic), Alanine',
          'ATP yield: "2-2-2-2" = 2 investment, 2 PGK, 2 PK, 2 NADH'
        ],
        highYield: [
          'PFK-1 is THE rate-limiting enzyme of glycolysis',
          'Fructose-2,6-bisphosphate is the most potent PFK-1 activator',
          'Glucokinase Km = 10mM (physiological glucose sensor)',
          'RBC survive on glycolysis alone (no mitochondria)',
          'Cancer cells prefer glycolysis even with O2 (Warburg effect)'
        ],
        clinicalPearls: [
          'Pyruvate kinase deficiency → hereditary hemolytic anemia',
          'Arsenic poisits G3PDH (inhibits glycolysis)',
          'Fluoride inhibits enolase (used in glucose tubes)',
          'Muscle lactate during exercise indicates anaerobic glycolysis'
        ]
      },

      textbookRefs: [
        { 
          textbook: "Harper's Illustrated Biochemistry", 
          edition: "32nd", 
          chapter: "Chapter 17 - Glycolysis & the Oxidation of Pyruvate", 
          pages: "173-187" 
        }
      ],

      retrievalCards: [
        {
          question: 'What is the rate-limiting enzyme of glycolysis and its key allosteric regulators?',
          answer: 'PFK-1 (phosphofructokinase-1). Activated by: AMP, ADP, F2,6BP, Pi. Inhibited by: ATP, citrate, H+'
        },
        {
          question: 'Compare Km values and regulation of hexokinase vs glucokinase',
          answer: 'Hexokinase: Km 0.1mM, inhibited by G6P, muscle/brain. Glucokinase: Km 10mM, no inhibition, liver/pancreas'
        },
        {
          question: 'What are the three major fates of pyruvate and their conditions?',
          answer: '1) Lactate (LDH, anaerobic), 2) Acetyl-CoA (PDH, aerobic), 3) Alanine (ALT, amino acid metabolism)'
        },
        {
          question: 'Net ATP yield from glycolysis under anaerobic vs aerobic conditions',
          answer: 'Anaerobic: 2 ATP net (4 produced - 2 invested). Aerobic: 8 ATP total (2 ATP + 6 from 2 NADH)'
        },
        {
          question: 'Which tissues depend primarily on glycolysis and why?',
          answer: 'RBC (no mitochondria), brain cortex (glucose-dependent), lens (avascular), cancer cells (Warburg effect)'
        }
      ],

      cases: [
        {
          title: 'Exercise-Induced Lactate Production',
          presentation: 'A 25-year-old athlete develops muscle cramping and elevated blood lactate after intense sprinting.',
          analysis: 'During high-intensity exercise, oxygen delivery cannot meet muscle demands. Pyruvate is reduced to lactate by LDH to regenerate NAD+ for continued glycolysis. The Pasteur effect shows increased glucose consumption under anaerobic conditions.',
          clinicalPearl: 'Lactate accumulation causes metabolic acidosis and muscle fatigue. Training improves oxygen delivery and lactate clearance.'
        },
        {
          title: 'Pyruvate Kinase Deficiency',
          presentation: 'A patient presents with chronic hemolytic anemia, splenomegaly, and family history of similar symptoms.',
          analysis: 'PK deficiency impairs ATP production in RBC, leading to membrane instability and hemolysis. RBC rely entirely on glycolysis for energy as they lack mitochondria.',
          clinicalPearl: 'Most common glycolytic enzyme deficiency. Diagnosed by PK activity assay and molecular testing.'
        }
      ]
    },
    prerequisites: ['glucose-metabolism-intro', 'atp-energy-systems'],
    relatedTopics: ['gluconeogenesis', 'tca-cycle', 'pentose-phosphate-pathway'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'PLAB'],
    estimatedMinutes: 45,
    hasContent: { 
      concept: true, 
      examPrep: true, 
      textbook: true, 
      retrievalCards: true, 
      cases: true, 
      grindeMap: false 
    },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09',
  },

  // =============================================================================
  // GLUCONEOGENESIS - GLUCOSE FROM NON-CARBS
  // =============================================================================
  {
    id: 'gluconeogenesis',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochemistry-carbohydrate',
    name: 'Gluconeogenesis',
    slug: 'gluconeogenesis',
    description: 'Glucose synthesis from non-carbohydrate precursors: bypass enzymes and regulation',
    content: {
      concept: `# Gluconeogenesis - Glucose from Non-Carbohydrates

## Definition

> **Gluconeogenesis** is the synthesis of **glucose** from **non-carbohydrate** precursors during fasting/starvation to maintain blood glucose.

**Location**: Liver (90%), Kidney, Muscle, Intestine  
**Timing**: Fasting >8-12 hours  
**Cost**: 6 ATP per glucose synthesized

## Substrates (Precursors)

\`\`\`
GLUCONEOGENESIS SUBSTRATES:
├── Lactate (40%) - Cori cycle
├── Amino acids (20%) - mainly Alanine
├── Glycerol (10%) - from lipolysis
├── Propionate - from odd-chain fatty acids
└── Other organic acids (oxaloacetate, α-KG)
\`\`\`

> 💎 **Alanine** is the major gluconeogenic amino acid from muscle

## The Pathway - Reverse Glycolysis

### Bypass Enzymes (Override Irreversible Steps)

| Glycolytic Enzyme | Gluconeogenic Bypass | Location |
|-------------------|---------------------|----------|
| **Pyruvate Kinase** | PC + PEPCK | Mito + Cyto |
| **PFK-1** | F1,6BPase | Cytoplasm |
| **Hexokinase** | G6Pase | ER |

### Step-by-Step Pathway

\`\`\`
Pyruvate → Glucose (Detailed):

1. Pyruvate → OAA (Pyruvate Carboxylase)
   ↳ ATP + CO2 → ADP + Pi
   ↳ Requires Acetyl-CoA (allosteric activator)

2. OAA → Malate (Mitochondrial)
   ↳ Malate dehydrogenase
   ↳ NADH → NAD+

3. Malate → OAA (Cytoplasmic)
   ↳ Malate dehydrogenase
   ↳ NAD+ → NADH

4. OAA → PEP (PEPCK)
   ↳ GTP → GDP + CO2
   ↳ Rate-limiting step

5-9. PEP → F1,6BP (Reverse glycolysis)

10. F1,6BP → F6P (F1,6BPase)
    ↳ Hydrolysis (bypass PFK-1)

11. F6P → G6P → Glucose (G6Pase)
    ↳ Hydrolysis (bypass hexokinase)
\`\`\`

## Key Regulatory Enzymes

### 1. Pyruvate Carboxylase (PC)
**Activator**: **Acetyl-CoA** (absolutely required)
- Ensures adequate TCA intermediates
- Connects fat oxidation to gluconeogenesis

### 2. PEPCK (Rate-Limiting)
**Induction**: 
- Glucagon, Cortisol (↑ transcription)
- Insulin (↓ transcription)

### 3. F1,6-Bisphosphatase
**Activators**: ATP, Citrate
**Inhibitors**: AMP, F2,6BP

### 4. G6Pase (Liver-specific)
- Final step releasing glucose
- Deficiency → Von Gierke disease

## Regulation - Reciprocal to Glycolysis

| State | Signal | Glycolysis | Gluconeogenesis |
|-------|--------|------------|-----------------|
| **Fed** | Insulin ↑ | **ACTIVE** | INACTIVE |
| **Fasted** | Glucagon ↑ | INACTIVE | **ACTIVE** |

### Hormonal Control

\`\`\`
FASTING HORMONES (↑ Gluconeogenesis):
├── Glucagon - ↑ cAMP → ↑ PEPCK
├── Cortisol - ↑ enzyme transcription
├── Epinephrine - rapid activation
└── Growth hormone - permissive

FED HORMONES (↓ Gluconeogenesis):
└── Insulin - ↓ PEPCK transcription
\`\`\`

## Important Cycles

### Cori Cycle (Lactate)
\`\`\`
Muscle: Glucose → Lactate (Glycolysis)
   ↓ Blood transport
Liver: Lactate → Glucose (Gluconeogenesis)
   ↓ Blood transport  
Muscle: Glucose (cycle continues)
\`\`\`

### Alanine Cycle
\`\`\`
Muscle: Protein → Amino acids → Alanine
   ↓ Blood transport
Liver: Alanine → Glucose + Urea
   ↓ Blood transport
Muscle: Glucose (feeds brain/RBC)
\`\`\`

## Energetics

**Cost per Glucose**:
- 4 ATP (2 from PC, 2 from gluconeogenesis)
- 2 GTP (2 from PEPCK)
- **Total: 6 ATP equivalents**

> Expensive process - only occurs when glucose is critically needed

## Clinical Significance

### Hypoglycemia Prevention
- **Brain**: Obligate glucose user (except ketosis)
- **RBC**: No mitochondria, requires glucose
- **Kidney medulla**: High glucose consumption

### Pathological States
| Condition | Effect | Mechanism |
|-----------|---------|-----------|
| **Type 1 DM** | Excessive GNG | No insulin inhibition |
| **Starvation** | Increased GNG | Protein catabolism |
| **Stress/Sepsis** | Enhanced GNG | Cortisol, catecholamines |

### Inborn Errors
| Enzyme | Disease | Features |
|--------|---------|----------|
| **G6Pase** | Von Gierke | Severe hypoglycemia |
| **F1,6BPase** | F1,6BPase def. | Lactic acidosis |
| **PC** | PC deficiency | Lactic acidosis |

> 🏥 G6Pase deficiency → cannot release free glucose`,

      keyPoints: [
        'Gluconeogenesis synthesizes glucose from lactate, amino acids, glycerol, and propionate',
        'Three bypass enzymes: PC+PEPCK (bypass PK), F1,6BPase (bypass PFK-1), G6Pase (bypass HK)',
        'PEPCK is rate-limiting enzyme, induced by glucagon and cortisol',
        'Costs 6 ATP per glucose molecule - energetically expensive process',
        'Cori cycle: muscle lactate → liver glucose; Alanine cycle: muscle protein → liver glucose',
        'Reciprocally regulated with glycolysis - insulin inhibits, glucagon activates',
        'G6Pase deficiency (Von Gierke disease) prevents glucose release'
      ],

      examPrep: {
        mnemonics: [
          'Gluconeogenic substrates: "LAG-P" - Lactate, Amino acids, Glycerol, Propionate',
          'Bypass enzymes: "PC-PEPCK, F1,6BPase, G6Pase" - Three enzymatic barriers',
          'Cori cycle: "Muscle Makes Lactate, Liver Likes Glucose"',
          'PEPCK regulation: "Glucagon Goes, Insulin Inhibits"',
          'Energy cost: "Six ATPs Synthesize" - 6 ATP per glucose'
        ],
        highYield: [
          'PEPCK is the rate-limiting enzyme of gluconeogenesis',
          'Acetyl-CoA is absolutely required activator of pyruvate carboxylase',
          'G6Pase is present only in liver, kidney, intestine (not muscle)',
          'Alanine is the major gluconeogenic amino acid',
          'F2,6BP inhibits F1,6BPase (same as activating PFK-1)'
        ],
        clinicalPearls: [
          'Von Gierke disease (G6Pase deficiency) → severe fasting hypoglycemia',
          'Metformin inhibits hepatic gluconeogenesis → lowers blood glucose',
          'Cortisol excess (Cushing) → excessive gluconeogenesis → diabetes',
          'Lactate/pyruvate ratio reflects cytoplasmic NADH/NAD+ ratio'
        ]
      },

      textbookRefs: [
        { 
          textbook: "Harper's Illustrated Biochemistry", 
          edition: "32nd", 
          chapter: "Chapter 19 - Gluconeogenesis & the Control of Blood Glucose", 
          pages: "200-213" 
        }
      ],

      retrievalCards: [
        {
          question: 'What are the three bypass enzyme systems in gluconeogenesis and what glycolytic enzymes do they bypass?',
          answer: '1) PC+PEPCK bypass pyruvate kinase, 2) F1,6-bisphosphatase bypasses PFK-1, 3) G6Pase bypasses hexokinase'
        },
        {
          question: 'Why is acetyl-CoA required for pyruvate carboxylase activation?',
          answer: 'Acetyl-CoA serves as allosteric activator, ensuring adequate fat oxidation before gluconeogenesis. Links β-oxidation to glucose synthesis'
        },
        {
          question: 'Compare the Cori cycle and alanine cycle in terms of substrates and purpose',
          answer: 'Cori: muscle lactate → liver glucose (energy). Alanine: muscle amino acids → liver glucose + urea (protein catabolism)'
        },
        {
          question: 'Why does gluconeogenesis cost 6 ATP per glucose molecule?',
          answer: '4 ATP (2 from PC + 2 net from pathway) + 2 GTP (from PEPCK) = 6 ATP equivalents. Reverse of glycolysis is not spontaneous'
        },
        {
          question: 'Which tissues can perform gluconeogenesis and which is most important?',
          answer: 'Liver (90%, most important), kidney, muscle, intestine. Only liver has G6Pase for glucose release'
        }
      ],

      cases: [
        {
          title: 'Prolonged Fasting Response',
          presentation: 'A healthy individual fasts for 24 hours. Blood glucose remains stable despite no food intake.',
          analysis: 'After glycogen depletion (~12-18h), liver activates gluconeogenesis. Glucagon rises, insulin falls. PEPCK transcription increases. Muscle protein provides alanine, fat breakdown provides glycerol. Brain glucose needs are met.',
          clinicalPearl: 'Normal adaptation prevents hypoglycemia during fasting through coordinated hormone and enzyme regulation.'
        },
        {
          title: 'Von Gierke Disease (GSD Type I)',
          presentation: 'Infant presents with severe fasting hypoglycemia, hepatomegaly, and lactic acidosis.',
          analysis: 'G6Pase deficiency prevents final step of gluconeogenesis (and glycogenolysis). G6P accumulates, diverted to lactate production. Liver cannot release free glucose despite normal gluconeogenic pathway.',
          clinicalPearl: 'Must avoid fasting; requires frequent feeding or continuous glucose infusion to prevent severe hypoglycemia.'
        }
      ]
    },
    prerequisites: ['glycolysis', 'tca-cycle'],
    relatedTopics: ['glycogen-metabolism', 'fatty-acid-oxidation', 'amino-acid-metabolism'],
    difficulty: 4,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'PLAB'],
    estimatedMinutes: 40,
    hasContent: { 
      concept: true, 
      examPrep: true, 
      textbook: true, 
      retrievalCards: true, 
      cases: true, 
      grindeMap: false 
    },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09',
  },

  // =============================================================================
  // GLYCOGEN METABOLISM
  // =============================================================================
  {
    id: 'glycogen-metabolism',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochemistry-carbohydrate',
    name: 'Glycogen Metabolism',
    slug: 'glycogen-metabolism',
    description: 'Glycogen synthesis and breakdown: enzymes, regulation, and storage diseases',
    content: {
      concept: `# Glycogen Metabolism - Glucose Storage & Release

## Overview

> **Glycogen** is the storage form of glucose in animals, providing rapid glucose mobilization during fasting.

**Structure**: Branched polymer of glucose with α(1→4) linear and α(1→6) branch bonds  
**Locations**: Liver (100-120g), Muscle (300-600g), Other tissues  
**Function**: Maintain blood glucose (liver), provide energy for muscle contraction

## Glycogen Structure

\`\`\`
GLYCOGEN STRUCTURE:
├── α(1→4) glycosidic bonds (linear chains)
├── α(1→6) glycosidic bonds (branch points)
├── Branch every 8-12 glucose residues
├── Non-reducing ends (many) - synthesis/degradation
└── Single reducing end - protein attachment point
\`\`\`

### Glycogenin Protein
- **Primer protein** for glycogen synthesis
- Self-glucosylates at Tyr194
- Creates initial 8-glucose chain
- Remains covalently attached to glycogen core

## Glycogen Synthesis (Glycogenesis)

### Pathway Steps
\`\`\`
1. Glucose → G6P (Hexokinase/Glucokinase)
   ↳ ATP → ADP

2. G6P → G1P (Phosphoglucomutase)
   ↳ Reversible isomerization

3. G1P + UTP → UDP-glucose (G1P uridylyltransferase)
   ↳ UTP → PPi (driving force)

4. UDP-glucose → Glycogen (Glycogen Synthase)
   ↳ Adds glucose to non-reducing ends
   ↳ Only makes α(1→4) bonds

5. Branching (Branching Enzyme)
   ↳ Transfers 7-glucose segments
   ↳ Creates α(1→6) branch points
\`\`\`

### Key Enzyme: Glycogen Synthase
**Active form**: Dephosphorylated (Synthase a)
**Inactive form**: Phosphorylated (Synthase b)

**Regulation**:
- **Activated**: Insulin (via PP1), G6P (allosteric)
- **Inactivated**: Glucagon, Epinephrine (via PKA)

## Glycogen Breakdown (Glycogenolysis)

### Pathway Steps
\`\`\`
1. Glycogen → G1P (Glycogen Phosphorylase)
   ↳ Phosphorylysis of α(1→4) bonds
   ↳ Pi → releases G1P (not glucose!)

2. Debranching (Two-step process):
   Step A: Transfer 3 glucoses from branch
   Step B: Remove single α(1→6) glucose
   ↳ Debranching enzyme (α-1,6-glucosidase)

3. G1P → G6P (Phosphoglucomutase)

4A. Liver: G6P → Glucose (G6Pase)
    ↳ Released to bloodstream

4B. Muscle: G6P → Glycolysis
    ↳ Used locally (no G6Pase)
\`\`\`

### Key Enzyme: Glycogen Phosphorylase
**Active form**: Phosphorylated (Phosphorylase a)
**Inactive form**: Dephosphorylated (Phosphorylase b)

**Regulation**:
- **Activated**: Glucagon, Epinephrine (via PKA), AMP
- **Inactivated**: Insulin (via PP1), ATP, G6P

## Hormonal Regulation - The Cascade

### Fed State (High Insulin)
\`\`\`
Insulin → ↑ PP1 activity
├── Glycogen Synthase: b → a (ACTIVE)
└── Glycogen Phosphorylase: a → b (INACTIVE)
Result: SYNTHESIS predominates
\`\`\`

### Fasting State (High Glucagon/Epinephrine)
\`\`\`
Glucagon/Epi → ↑ cAMP → ↑ PKA
├── Glycogen Synthase: a → b (INACTIVE)
└── Glycogen Phosphorylase: b → a (ACTIVE)
Result: BREAKDOWN predominates
\`\`\`

## Tissue Differences

| Aspect | Liver | Muscle |
|--------|-------|--------|
| **Purpose** | Blood glucose maintenance | Local energy |
| **G6Pase** | Present | Absent |
| **Glucose release** | YES | NO |
| **Regulation** | Hormonal (glucagon/insulin) | Energy charge (AMP/ATP) |
| **Capacity** | 100-120g | 300-600g |

> 💎 **Liver glycogen** maintains blood glucose; **muscle glycogen** powers muscle contraction

## Allosteric Regulation (Muscle)

### Phosphorylase b (Inactive form)
- **Activated by**: AMP (muscle contraction)
- **Inhibited by**: ATP, G6P (energy abundance)

### Glycogen Synthase
- **Activated by**: G6P (glucose abundance)

> This allows muscle to respond to **local energy needs**

## Glycogen Storage Diseases (GSDs)

| Type | Enzyme Defect | Primary Organ | Key Features |
|------|---------------|---------------|--------------|
| **I (von Gierke)** | G6Pase | Liver | Severe hypoglycemia, hepatomegaly |
| **II (Pompe)** | α-1,4-glucosidase | Muscle/Heart | Cardiomegaly, muscle weakness |
| **III (Cori)** | Debranching enzyme | Liver/Muscle | Mild hypoglycemia, hepatomegaly |
| **IV (Andersen)** | Branching enzyme | Liver | Cirrhosis, abnormal glycogen |
| **V (McArdle)** | Muscle phosphorylase | Muscle | Exercise intolerance, cramps |
| **VI (Hers)** | Liver phosphorylase | Liver | Mild hepatomegaly |

### High-Yield GSD Features

**Type I (Von Gierke)**:
- Most common hepatic GSD
- Cannot release glucose → severe hypoglycemia
- Lactic acidosis (G6P → lactate)

**Type V (McArdle)**:
- Cannot break down muscle glycogen
- "Second wind" phenomenon
- Exercise → muscle cramps, myoglobinuria

## Clinical Applications

### Liver Glycogen
- Depleted after 12-18 hours fasting
- Maintains blood glucose between meals
- Defects → hypoglycemia

### Muscle Glycogen
- Provides immediate energy for contraction
- Not released to blood
- Defects → exercise intolerance

### Athletic Performance
- "Carb loading" maximizes muscle glycogen
- Important for endurance activities`,

      keyPoints: [
        'Glycogen is branched glucose polymer with α(1→4) chains and α(1→6) branches every 8-12 residues',
        'Synthesis requires UDP-glucose and glycogen synthase (rate-limiting); breakdown uses phosphorylase',
        'Reciprocal regulation: insulin activates synthesis, glucagon/epinephrine activate breakdown',
        'Liver glycogen maintains blood glucose; muscle glycogen provides local energy',
        'Von Gierke disease (Type I GSD) - G6Pase deficiency causes severe hypoglycemia',
        'McArdle disease (Type V GSD) - muscle phosphorylase deficiency causes exercise intolerance',
        'Glycogenin serves as primer protein for glycogen synthesis initiation'
      ],

      examPrep: {
        mnemonics: [
          'Glycogen synthesis: "UDP-Goes into Glycogen" - UDP-glucose is activated donor',
          'GSD types: "Very Poor Carb Metabolism Hits Liver" (I-VI: Von Gierke, Pompe, Cori, McArdle, Hers, Liver)',
          'Phosphorylase states: "AMP Makes Active" - AMP activates phosphorylase b in muscle',
          'Branch vs Debranch: "Branch Builds, Debranch Destroys"',
          'Hormonal control: "Insulin Inactivates, Glucagon Goes" - opposite effects on enzymes'
        ],
        highYield: [
          'Glycogen synthase and phosphorylase are reciprocally regulated by covalent modification',
          'Muscle lacks G6Pase - cannot release glucose to blood',
          'AMP allosterically activates muscle phosphorylase b during exercise',
          'Branching enzyme creates α(1→6) bonds every 8-12 residues',
          'UDP-glucose is the activated form of glucose for glycogen synthesis'
        ],
        clinicalPearls: [
          'Von Gierke patients cannot fast - need continuous glucose supply',
          'McArdle patients get "second wind" - switch to fat oxidation',
          'Liver glycogen stores last 12-18 hours during fasting',
          'Pompe disease affects cardiac muscle - can cause cardiomegaly in infants'
        ]
      },

      textbookRefs: [
        { 
          textbook: "Harper's Illustrated Biochemistry", 
          edition: "32nd", 
          chapter: "Chapter 18 - Metabolism of Glycogen", 
          pages: "188-199" 
        }
      ],

      retrievalCards: [
        {
          question: 'Compare the active/inactive forms and regulation of glycogen synthase vs glycogen phosphorylase',
          answer: 'Synthase: Active when dephosphorylated (a), inactive when phosphorylated (b). Phosphorylase: Active when phosphorylated (a), inactive when dephosphorylated (b). Reciprocal regulation by insulin vs glucagon'
        },
        {
          question: 'Why can liver but not muscle release glucose from glycogen breakdown?',
          answer: 'Liver has G6Pase to convert G6P → glucose. Muscle lacks G6Pase, so G6P enters glycolysis for local ATP production'
        },
        {
          question: 'What is the role of UDP-glucose in glycogen synthesis and how is it formed?',
          answer: 'UDP-glucose is activated glucose donor. Formed by: G1P + UTP → UDP-glucose + PPi (by G1P uridylyltransferase). Provides energy for glycogen synthesis'
        },
        {
          question: 'Distinguish Von Gierke disease from McArdle disease in terms of enzyme, organ, and symptoms',
          answer: 'Von Gierke: G6Pase deficiency, liver, severe hypoglycemia. McArdle: muscle phosphorylase deficiency, muscle, exercise intolerance and cramps'
        },
        {
          question: 'How does AMP regulate muscle glycogen phosphorylase during exercise?',
          answer: 'AMP allosterically activates phosphorylase b (inactive form) in muscle, allowing glycogen breakdown despite low hormone levels. Local energy sensor'
        }
      ],

      cases: [
        {
          title: 'Von Gierke Disease Management',
          presentation: 'A 6-month-old infant presents with hepatomegaly, severe fasting hypoglycemia, and lactic acidosis. Genetic testing confirms G6Pase deficiency.',
          analysis: 'Type I GSD prevents glucose release from liver. G6P accumulates and is shunted to lactate production, causing acidosis. Glycogen and fat accumulate in liver causing hepatomegaly.',
          clinicalPearl: 'Management requires avoiding fasting, frequent glucose feeds, and cornstarch for sustained glucose release. Hypoglycemia can cause seizures and developmental delay.'
        },
        {
          title: 'Exercise Intolerance in McArdle Disease',
          presentation: 'A 20-year-old athlete experiences severe muscle cramps and fatigue within minutes of starting exercise, but notices improvement if he continues at lower intensity.',
          analysis: 'Muscle phosphorylase deficiency prevents glycogen breakdown. Initial exercise relies on stored ATP/creatine phosphate (quickly depleted). "Second wind" occurs when fat oxidation increases.',
          clinicalPearl: 'Patients learn to pace themselves. Glucose ingestion before exercise can provide alternative fuel and reduce symptoms.'
        }
      ]
    },
    prerequisites: ['glycolysis', 'glucose-metabolism'],
    relatedTopics: ['gluconeogenesis', 'diabetes-metabolism'],
    difficulty: 4,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'PLAB'],
    estimatedMinutes: 35,
    hasContent: { 
      concept: true, 
      examPrep: true, 
      textbook: true, 
      retrievalCards: true, 
      cases: true, 
      grindeMap: false 
    },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09',
  },

  // =============================================================================
  // TCA CYCLE - CITRIC ACID CYCLE
  // =============================================================================
  {
    id: 'tca-cycle',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochemistry-carbohydrate',
    name: 'TCA Cycle (Krebs Cycle)',
    slug: 'tca-cycle',
    description: 'Central metabolic pathway: oxidation of acetyl-CoA with ATP generation',
    content: {
      concept: `# TCA Cycle - The Central Metabolic Hub

## Overview

> The **TCA cycle** (Tricarboxylic Acid cycle) is the central metabolic pathway that oxidizes **acetyl-CoA** to **CO₂** and **H₂O**, generating reducing equivalents for ATP production.

**Location**: Mitochondrial matrix  
**Function**: Final common pathway for carb, fat, protein oxidation  
**Input**: Acetyl-CoA + 3NAD+ + FAD + GDP + Pi  
**Output**: 2CO₂ + 3NADH + FADH₂ + GTP + CoA

## The 8-Step Cycle

\`\`\`
Step 1: Acetyl-CoA + OAA → Citrate
        ↳ Citrate synthase (irreversible)

Step 2: Citrate → Isocitrate  
        ↳ Aconitase (via cis-aconitate)

Step 3: Isocitrate → α-KG + CO₂
        ↳ Isocitrate dehydrogenase
        ↳ NADH #1 produced

Step 4: α-KG → Succinyl-CoA + CO₂
        ↳ α-KG dehydrogenase complex
        ↳ NADH #2 produced

Step 5: Succinyl-CoA → Succinate
        ↳ Succinyl-CoA synthetase
        ↳ GTP produced (substrate level)

Step 6: Succinate → Fumarate
        ↳ Succinate dehydrogenase
        ↳ FADH₂ produced

Step 7: Fumarate → Malate
        ↳ Fumarase

Step 8: Malate → OAA
        ↳ Malate dehydrogenase  
        ↳ NADH #3 produced
\`\`\`

## Energetics

**Per acetyl-CoA**:
- **3 NADH** × 2.5 ATP = 7.5 ATP
- **1 FADH₂** × 1.5 ATP = 1.5 ATP  
- **1 GTP** = 1 ATP
- **Total: 10 ATP** per acetyl-CoA

**Per glucose (2 acetyl-CoA)**:
- **20 ATP** from TCA cycle
- **Plus 8 ATP** from glycolysis + PDH
- **Total: ~30 ATP** per glucose (aerobic)

## Regulation

### Rate-Limiting Enzymes (3)

**1. Citrate Synthase**
- **Inhibited**: ATP, NADH, Succinyl-CoA
- **Activated**: ADP (energy demand)

**2. Isocitrate Dehydrogenase** 
- **Inhibited**: ATP, NADH, GTP
- **Activated**: ADP, Ca²⁺

**3. α-Ketoglutarate Dehydrogenase**
- **Inhibited**: ATP, NADH, GTP, Succinyl-CoA
- **Activated**: Ca²⁺

> 💎 All three are inhibited by **ATP/NADH** (energy abundance) and activated by **ADP/Ca²⁺** (energy demand)

### Energy Charge Regulation
| High Energy (ATP/NADH ↑) | Low Energy (ADP ↑) |
|--------------------------|---------------------|
| TCA cycle ↓ | TCA cycle ↑ |
| Fat synthesis ↑ | Fat oxidation ↑ |
| Gluconeogenesis ↑ | Glycolysis ↑ |

## Anaplerotic Reactions

> **Anaplerotic** = "filling up" - reactions that replenish TCA intermediates

### Important Anaplerotic Enzymes

**1. Pyruvate Carboxylase**
\`\`\`
Pyruvate + CO₂ + ATP → OAA + ADP + Pi
↳ Activated by Acetyl-CoA
\`\`\`

**2. PEP Carboxykinase**
\`\`\`
PEP + CO₂ + GDP → OAA + GTP
↳ Important in gluconeogenesis
\`\`\`

**3. Glutamate Dehydrogenase**
\`\`\`
Glutamate → α-KG + NH₃
↳ Links amino acid and carb metabolism
\`\`\`

## Cataplerotic Reactions

> **Cataplerotic** = "emptying" - removal of TCA intermediates for biosynthesis

### Biosynthetic Uses
| Intermediate | Used for |
|--------------|----------|
| **Citrate** | Fatty acid synthesis (cytoplasm) |
| **α-KG** | Amino acid synthesis (glutamate) |
| **Succinyl-CoA** | Heme synthesis, ketone metabolism |
| **OAA** | Aspartate, asparagine synthesis |

## TCA Cycle Interconnections

### Central Hub Function
\`\`\`
INPUTS TO TCA:
├── Carbohydrates → Acetyl-CoA (PDH)
├── Fatty acids → Acetyl-CoA (β-oxidation)  
├── Amino acids → Various intermediates
└── Ethanol → Acetyl-CoA

OUTPUTS FROM TCA:
├── ATP production (major)
├── Biosynthetic precursors
├── NADPH (via isocitrate → citrate)
└── Neurotransmitter precursors
\`\`\`

## Clinical Correlations

### Vitamin Requirements
| Enzyme | Vitamin/Cofactor | Deficiency Disease |
|--------|------------------|-------------------|
| **PDH complex** | B1 (thiamine) | Beriberi, Wernicke |
| **α-KG DH** | B1, B2, B3, B5 | Multiple deficiencies |
| **Succinate DH** | FAD (B2) | Riboflavin deficiency |

### Inhibitors & Toxins
| Inhibitor | Target | Effect |
|-----------|---------|---------|
| **Fluoroacetate** | Aconitase | Lethal (rat poison) |
| **Arsenite** | α-KG DH | Lipoic acid binding |
| **Malonate** | Succinate DH | Competitive inhibition |

### Disease States

**Thiamine Deficiency**:
- ↓ PDH and α-KG DH activity
- ↑ Lactate and α-KG accumulation
- Neurological symptoms

**Cancer Metabolism**:
- ↑ Glutamine uptake → α-KG
- TCA cycle reprogramming
- Oncometabolites (fumarate, succinate)

## Regulation Summary

### Fed State
- ↑ Insulin → ↑ PDH (dephosphorylation)
- ↑ Citrate → fatty acid synthesis
- TCA intermediates for biosynthesis

### Fasting State  
- ↑ Glucagon → ↑ Gluconeogenesis
- ↓ Malonyl-CoA → ↑ β-oxidation
- ↑ Acetyl-CoA → ↑ TCA flux

> The TCA cycle adapts to nutritional state and energy demands`,

      keyPoints: [
        'TCA cycle is central pathway oxidizing acetyl-CoA to CO₂, generating 3 NADH + 1 FADH₂ + 1 GTP per turn',
        'Three rate-limiting enzymes: citrate synthase, isocitrate DH, α-KG DH - all inhibited by ATP/NADH',
        'Anaplerotic reactions (pyruvate carboxylase) replenish intermediates; cataplerotic reactions remove them for biosynthesis',
        'Located in mitochondrial matrix; requires transport systems for substrates',
        'Provides ~10 ATP per acetyl-CoA through oxidative phosphorylation',
        'Central hub connecting carbohydrate, fat, and protein metabolism',
        'Thiamine (B1) deficiency impairs PDH and α-KG DH complexes'
      ],

      examPrep: {
        mnemonics: [
          'TCA cycle intermediates: "Citrate Is Krebs\' Starting Substrate For Making Oxaloacetate" (Citrate, Isocitrate, α-KG, Succinyl-CoA, Succinate, Fumarate, Malate, OAA)',
          'Rate-limiting enzymes: "CIA" - Citrate synthase, Isocitrate DH, α-KG DH',
          'Energy yield: "3-1-1" - 3 NADH, 1 FADH₂, 1 GTP per cycle',
          'Anaplerotic enzymes: "Pyruvate Carboxylase Produces OAA"',
          'Regulation: "ATP/NADH Always Inhibit" - high energy inhibits all rate-limiting steps'
        ],
        highYield: [
          'Succinate dehydrogenase is Complex II of electron transport chain',
          'Citrate shuttle exports acetyl units to cytoplasm for fatty acid synthesis',
          'α-KG is connection point between TCA cycle and amino acid metabolism',
          'Fluoroacetate is metabolized to fluorocitrate (aconitase inhibitor) - lethal',
          'GTP from succinyl-CoA synthetase is equivalent to ATP'
        ],
        clinicalPearls: [
          'Thiamine deficiency → lactic acidosis (impaired PDH)',
          'Arsenic poisoning inhibits α-KG dehydrogenase complex',
          'Cancer cells often have mutated TCA enzymes (oncometabolites)',
          'Pyruvate carboxylase deficiency → lactic acidosis and developmental delay'
        ]
      },

      textbookRefs: [
        { 
          textbook: "Harper's Illustrated Biochemistry", 
          edition: "32nd", 
          chapter: "Chapter 17 - The Citric Acid Cycle", 
          pages: "173-187" 
        }
      ],

      retrievalCards: [
        {
          question: 'List the 8 enzymes of TCA cycle in order and identify which steps produce NADH, FADH₂, and GTP',
          answer: '1)Citrate synthase 2)Aconitase 3)Isocitrate DH→NADH 4)α-KG DH→NADH 5)Succinyl-CoA synthetase→GTP 6)Succinate DH→FADH₂ 7)Fumarase 8)Malate DH→NADH'
        },
        {
          question: 'What are the three rate-limiting enzymes of TCA cycle and their common regulation pattern?',
          answer: 'Citrate synthase, Isocitrate dehydrogenase, α-KG dehydrogenase. All inhibited by ATP, NADH, GTP (high energy) and activated by ADP, Ca²⁺ (low energy)'
        },
        {
          question: 'Why is pyruvate carboxylase important for TCA cycle function?',
          answer: 'Anaplerotic enzyme that replenishes OAA from pyruvate. Essential when TCA intermediates are removed for biosynthesis. Activated by acetyl-CoA'
        },
        {
          question: 'Calculate total ATP yield from complete glucose oxidation',
          answer: 'Glucose→2 pyruvate (2 ATP + 2 NADH = 7 ATP), 2 PDH (2 NADH = 5 ATP), 2 TCA cycles (20 ATP). Total: ~30-32 ATP per glucose'
        },
        {
          question: 'How does thiamine deficiency affect TCA cycle and what are the consequences?',
          answer: 'Thiamine (B1) cofactor for PDH and α-KG DH. Deficiency → decreased TCA flux → lactate accumulation → lactic acidosis → neurological symptoms (Wernicke-Korsakoff)'
        }
      ],

      cases: [
        {
          title: 'Thiamine Deficiency in Alcoholism',
          presentation: 'A chronic alcoholic presents with confusion, ataxia, and lactic acidosis. Blood thiamine levels are low.',
          analysis: 'Thiamine (B1) is cofactor for PDH and α-KG DH complexes. Deficiency impairs TCA cycle entry → pyruvate → lactate. Decreased ATP production affects brain function, causing Wernicke encephalopathy.',
          clinicalPearl: 'Always give thiamine BEFORE glucose in suspected alcoholics to prevent precipitating Wernicke encephalopathy. Alcohol impairs thiamine absorption and storage.'
        },
        {
          title: 'Pyruvate Carboxylase Deficiency',
          presentation: 'Newborn develops lactic acidosis, hypoglycemia, and delayed development. Enzyme studies show pyruvate carboxylase deficiency.',
          analysis: 'Cannot perform anaplerosis to replenish TCA intermediates. Impaired gluconeogenesis (cannot make OAA from pyruvate) and TCA cycle dysfunction lead to lactate accumulation and energy deficits.',
          clinicalPearl: 'Rare disorder with poor prognosis. Treatment is supportive with bicarbonate for acidosis and frequent feeding to prevent hypoglycemia.'
        }
      ]
    },
    prerequisites: ['glycolysis', 'pyruvate-metabolism'],
    relatedTopics: ['electron-transport-chain', 'gluconeogenesis', 'fatty-acid-oxidation'],
    difficulty: 4,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'PLAB'],
    estimatedMinutes: 40,
    hasContent: { 
      concept: true, 
      examPrep: true, 
      textbook: true, 
      retrievalCards: true, 
      cases: true, 
      grindeMap: false 
    },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09',
  },

  // =============================================================================
  // ELECTRON TRANSPORT CHAIN & OXIDATIVE PHOSPHORYLATION
  // =============================================================================
  {
    id: 'electron-transport-chain',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochemistry-carbohydrate',
    name: 'Electron Transport Chain & Oxidative Phosphorylation',
    slug: 'electron-transport-chain',
    description: 'Mitochondrial ATP synthesis via proton gradient and ATP synthase',
    content: {
      concept: `# Electron Transport Chain - The ATP Factory

## Overview

> The **electron transport chain** (ETC) transfers electrons from NADH/FADH₂ to oxygen, creating a **proton gradient** that drives **ATP synthesis**.

**Location**: Inner mitochondrial membrane  
**Function**: Convert reducing equivalents (NADH, FADH₂) to ATP  
**Mechanism**: Chemiosmotic coupling (proton-motive force)

## The Four Complexes

### Complex I (NADH Dehydrogenase)
\`\`\`
NADH + H+ + CoQ → NAD+ + CoQH₂
↳ Pumps 4 H+ from matrix → intermembrane space
↳ Contains FMN and iron-sulfur clusters
↳ Inhibitor: Rotenone, Barbiturates
\`\`\`

### Complex II (Succinate Dehydrogenase)
\`\`\`
Succinate + CoQ → Fumarate + CoQH₂
↳ Part of TCA cycle AND ETC
↳ Does NOT pump protons
↳ Contains FAD and iron-sulfur clusters
↳ Inhibitor: Malonate (competitive)
\`\`\`

### Complex III (Cytochrome bc₁)
\`\`\`
CoQH₂ + 2 Cyt c³+ → CoQ + 2 Cyt c²+ + 2H+
↳ Pumps 4 H+ from matrix → intermembrane space
↳ Q cycle mechanism
↳ Inhibitor: Antimycin A
\`\`\`

### Complex IV (Cytochrome Oxidase)
\`\`\`
4 Cyt c²+ + O₂ + 4H+ → 4 Cyt c³+ + 2H₂O
↳ Pumps 2 H+ from matrix → intermembrane space
↳ Contains heme a and heme a₃ + Cu
↳ Inhibitors: CN⁻, CO, H₂S
\`\`\`

## ATP Synthase (Complex V)

### Structure
\`\`\`
ATP SYNTHASE:
├── F₁ sector (matrix side)
│   ├── α₃β₃ hexamer (catalytic)
│   ├── γ shaft (rotates)
│   └── δε subunits
└── F₀ sector (membrane)
    └── c-ring (proton channel)
\`\`\`

### Mechanism - Rotational Catalysis
1. **Proton flow** through F₀ rotates c-ring
2. **γ shaft rotation** changes β-subunit conformation
3. **Three states**: OPEN → LOOSE → TIGHT → OPEN
4. **ATP synthesis**: ADP + Pi → ATP (TIGHT state)

> 💎 **3 H+** flow through ATP synthase to make **1 ATP**

## Proton-Motive Force

### Components
**Δp = Δψ + ΔpH**
- **Δψ**: Electrical gradient (inside negative)
- **ΔpH**: Chemical gradient (inside alkaline)

### H+ Stoichiometry
| Complex | H+ Pumped | ATP Equivalent |
|---------|-----------|----------------|
| **I** | 4 H+ | 1.33 ATP |
| **III** | 4 H+ | 1.33 ATP |
| **IV** | 2 H+ | 0.67 ATP |
| **Total** | 10 H+ | **3.33 ATP** |

> **NADH → 2.5 ATP** (through I, III, IV)  
> **FADH₂ → 1.5 ATP** (through II, III, IV)

## Shuttle Systems

### Malate-Aspartate Shuttle (Heart, Liver)
\`\`\`
Cytoplasm: NADH + OAA → NAD+ + Malate
          ↓ Malate carrier
Mitochondria: Malate + NAD+ → NADH + OAA
\`\`\`
**Yield**: 1 cytoplasmic NADH = 2.5 ATP

### Glycerol-3-Phosphate Shuttle (Muscle, Brain)
\`\`\`
Cytoplasm: NADH + DHAP → NAD+ + G3P
          ↓ G3P shuttle
Mitochondria: G3P + FAD → FADH₂ + DHAP
\`\`\`
**Yield**: 1 cytoplasmic NADH = 1.5 ATP

## Inhibitors & Uncouplers

### ETC Inhibitors
| Inhibitor | Site | Mechanism | Clinical Use |
|-----------|------|-----------|--------------|
| **Rotenone** | Complex I | Blocks electron flow | Insecticide |
| **Antimycin A** | Complex III | Blocks cytochrome b | Antibiotic |
| **Cyanide** | Complex IV | Binds cytochrome a₃ | Poison |
| **Carbon monoxide** | Complex IV | Competes with O₂ | Poisoning |

### Uncouplers
**Mechanism**: Allow H+ to flow back without ATP synthesis

| Uncoupler | Source | Effect |
|-----------|---------|---------|
| **DNP** (2,4-dinitrophenol) | Industrial | Hyperthermia |
| **Thermogenin** (UCP1) | Brown fat | Heat generation |
| **Aspirin** | Medication | Fever (high doses) |

> ⚠️ **Uncoupling** = electron transport continues but NO ATP made → energy as heat

## Brown Adipose Tissue

### Thermogenesis
\`\`\`
Brown Fat Mechanism:
├── Sympathetic stimulation
├── UCP1 (thermogenin) activation
├── Proton leak across membrane
└── Heat generation (no ATP)
\`\`\`

**Function**: Non-shivering thermogenesis in infants
**Regulation**: Cold exposure, norepinephrine

## Clinical Applications

### Hypoxia Effects
1. **Electron transport stops** (no final acceptor)
2. **NADH accumulates** → NAD+ depletion
3. **TCA cycle slows** → lactate production
4. **ATP depletion** → cellular damage

### Mitochondrial Diseases
| Disease | Defect | Symptoms |
|---------|--------|----------|
| **MELAS** | Complex I | Stroke-like episodes |
| **Leigh syndrome** | Multiple complexes | Neurodegeneration |
| **LHON** | Complex I | Optic neuropathy |

### Poisoning
**Cyanide Toxicity**:
- Blocks Complex IV
- Histotoxic hypoxia
- Cherry-red skin color
- Treatment: Hydroxocobalamin, nitrites

## Energy Calculations

### Complete Glucose Oxidation
\`\`\`
AEROBIC GLUCOSE METABOLISM:
├── Glycolysis: 2 ATP + 2 NADH = 7 ATP
├── PDH: 2 NADH = 5 ATP  
├── TCA: 6 NADH + 2 FADH₂ + 2 GTP = 20 ATP
└── Total: ~30-32 ATP per glucose
\`\`\`

### Efficiency
- **Chemical energy** of glucose: ~686 kcal/mol
- **ATP energy capture**: ~32 × 7.3 = 234 kcal/mol
- **Efficiency**: ~34% (rest as heat)`,

      keyPoints: [
        'ETC has 4 complexes: I (NADH DH), II (succinate DH), III (cytochrome bc₁), IV (cytochrome oxidase)',
        'Only Complexes I, III, IV pump protons; Complex II does not contribute to gradient',
        'ATP synthase uses proton gradient to drive rotational catalysis (3 H+ per ATP)',
        'NADH yields 2.5 ATP, FADH₂ yields 1.5 ATP through oxidative phosphorylation',
        'Inhibitors block electron flow; uncouplers allow proton leak without ATP synthesis',
        'Brown fat uses UCP1 for thermogenesis instead of ATP synthesis',
        'Cyanide poisoning blocks Complex IV, causing histotoxic hypoxia'
      ],

      examPrep: {
        mnemonics: [
          'ETC complexes: "NADH Succinates Cytochrome Cytochrome" (I-NADH DH, II-Succinate DH, III-Cytochrome bc₁, IV-Cytochrome oxidase)',
          'H+ pumping: "4-0-4-2" - Complexes I, II, III, IV pump this many protons',
          'ATP yields: "2.5 NADH, 1.5 FADH₂" - standard yields',
          'Complex IV inhibitors: "CN Can COmpletely Stop" - Cyanide, CO',
          'Uncouplers: "DNP Delivers No Product" - electron transport without ATP'
        ],
        highYield: [
          'Complex II is both TCA cycle enzyme and ETC component',
          'ATP synthase requires 3 H+ to make 1 ATP',
          'Brown fat UCP1 allows thermogenesis without ATP',
          'Cytoplasmic NADH yield depends on shuttle system',
          'Rotenone (Complex I) and antimycin A (Complex III) are classic inhibitors'
        ],
        clinicalPearls: [
          'Cyanide poisoning → cherry-red skin, normal O₂ saturation',
          'DNP uncoupling → hyperthermia (historically used for weight loss)',
          'Mitochondrial diseases often affect high-energy organs (brain, muscle)',
          'Aspirin can uncouple at high doses → fever'
        ]
      },

      textbookRefs: [
        { 
          textbook: "Harper's Illustrated Biochemistry", 
          edition: "32nd", 
          chapter: "Chapter 13 - Bioenergetics & Oxidative Phosphorylation", 
          pages: "134-148" 
        }
      ],

      retrievalCards: [
        {
          question: 'Which ETC complexes pump protons and how many H+ does each pump per electron pair?',
          answer: 'Complex I: 4 H+, Complex II: 0 H+, Complex III: 4 H+, Complex IV: 2 H+. Total 10 H+ per NADH (through I→III→IV)'
        },
        {
          question: 'Explain why FADH₂ yields less ATP than NADH in oxidative phosphorylation',
          answer: 'FADH₂ enters at Complex II (no H+ pumping), goes through III→IV only. NADH enters at Complex I, goes through I→III→IV. Less proton pumping = less ATP'
        },
        {
          question: 'Compare the mechanism and effects of ETC inhibitors vs uncouplers',
          answer: 'Inhibitors: Block electron flow → no O₂ consumption → no ATP → no heat. Uncouplers: Allow electron flow + O₂ consumption → no ATP → massive heat production'
        },
        {
          question: 'How does brown adipose tissue generate heat without shivering?',
          answer: 'UCP1 (thermogenin) allows protons to bypass ATP synthase. Electron transport continues, O₂ consumed, but energy released as heat instead of ATP'
        },
        {
          question: 'What are the signs and treatment approach for cyanide poisoning?',
          answer: 'Cherry-red skin, normal O₂ sat, metabolic acidosis. Blocks Complex IV. Treat with hydroxocobalamin (binds CN⁻) or nitrites (create methemoglobin CN⁻ binding)'
        }
      ],

      cases: [
        {
          title: 'Cyanide Poisoning Emergency',
          presentation: 'Patient found unconscious with cherry-red skin, rapid breathing, and normal pulse oximetry. Suspected cyanide exposure at industrial site.',
          analysis: 'Cyanide blocks Complex IV, preventing cellular oxygen utilization. Oxygen saturation remains normal (hemoglobin still binds O₂) but cells cannot use it. Results in histotoxic hypoxia and lactate production.',
          clinicalPearl: 'Key clue: normal O₂ saturation with severe metabolic acidosis. Immediate antidote needed: hydroxocobalamin or sodium thiosulfate to bind cyanide.'
        },
        {
          title: 'Mitochondrial Myopathy',
          presentation: 'A 30-year-old presents with exercise intolerance, muscle weakness, and elevated lactate after minimal exertion.',
          analysis: 'Mitochondrial ETC defects impair oxidative phosphorylation. Muscle relies on anaerobic glycolysis → lactate accumulation. High-energy demand tissues (muscle, brain) most affected.',
          clinicalPearl: 'Mitochondrial diseases show maternal inheritance (mitochondria from ovum). Muscle biopsy may show "ragged red fibers" with abnormal mitochondria.'
        }
      ]
    },
    prerequisites: ['tca-cycle', 'redox-reactions'],
    relatedTopics: ['glycolysis', 'fatty-acid-oxidation', 'mitochondrial-diseases'],
    difficulty: 4,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'PLAB'],
    estimatedMinutes: 45,
    hasContent: { 
      concept: true, 
      examPrep: true, 
      textbook: true, 
      retrievalCards: true, 
      cases: true, 
      grindeMap: false 
    },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09',
  },

  // =============================================================================
  // PENTOSE PHOSPHATE PATHWAY
  // =============================================================================
  {
    id: 'pentose-phosphate-pathway',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochemistry-carbohydrate',
    name: 'Pentose Phosphate Pathway',
    slug: 'pentose-phosphate-pathway',
    description: 'Hexose monophosphate shunt: NADPH generation and ribose synthesis',
    content: {
      concept: `# Pentose Phosphate Pathway - The NADPH Generator

## Overview

> The **Pentose Phosphate Pathway** (PPP) is an alternative glucose oxidation pathway that generates **NADPH** for biosynthesis and **ribose-5-phosphate** for nucleotide synthesis.

**Alternative names**: Hexose Monophosphate Shunt, Phosphogluconate Pathway  
**Location**: Cytoplasm  
**Main products**: NADPH, Ribose-5-P, CO₂

## Two Phases of PPP

### Oxidative Phase (Irreversible)
*Generates NADPH and CO₂*

\`\`\`
Step 1: G6P → 6-Phosphogluconolactone
        ↳ G6PDH (RATE-LIMITING)
        ↳ NADP+ → NADPH #1

Step 2: 6-Phosphogluconolactone → 6-Phosphogluconate  
        ↳ Lactonase (hydrolysis)

Step 3: 6-Phosphogluconate → Ribulose-5-P + CO₂
        ↳ 6-Phosphogluconate DH
        ↳ NADP+ → NADPH #2
\`\`\`

**Net result**: G6P + 2NADP+ → Ribulose-5-P + 2NADPH + CO₂

### Non-Oxidative Phase (Reversible)
*Interconverts pentoses and hexoses*

\`\`\`
Ribulose-5-P → Ribose-5-P (Ribose-5-P isomerase)
             → Xylulose-5-P (Ribulose-5-P epimerase)

Transaldolase reactions:
├── Sedoheptulose-7-P + G3P ⇌ F6P + Erythrose-4-P
└── Xylulose-5-P + Erythrose-4-P ⇌ F6P + G3P

Transketolase reactions:
├── Xylulose-5-P + Ribose-5-P ⇌ Sedoheptulose-7-P + G3P  
└── Xylulose-5-P + Ribose-5-P ⇌ F6P + G3P
\`\`\`

## Key Enzyme: G6PDH

### Regulation
**Inhibitor**: **NADPH** (product inhibition)
- When NADPH ↑ → G6PDH activity ↓
- When NADPH ↓ → G6PDH activity ↑

**Activator**: **NADP+** (substrate availability)

> 💎 **G6PDH** is regulated entirely by **substrate/product ratio**

### G6PDH Deficiency
**Most common enzyme deficiency worldwide** (~400 million affected)

**Genetics**:
- X-linked disorder
- Males more severely affected
- Common in Mediterranean, African, Middle Eastern populations

**Pathophysiology**:
- ↓ NADPH production → ↓ GSH regeneration
- ↑ Oxidative stress in RBCs
- Hemolytic anemia during stress

**Clinical Triggers**:
- **Drugs**: Antimalarials (primaquine), sulfonamides
- **Foods**: Fava beans (favism)
- **Infections**: Bacterial, viral
- **Diabetic ketoacidosis**

## Metabolic Functions of PPP

### 1. NADPH Generation (80% of cellular NADPH)
\`\`\`
NADPH USES:
├── Fatty acid synthesis
├── Cholesterol synthesis  
├── Antioxidant defense (GSH regeneration)
├── Drug detoxification (P450 systems)
├── Nucleotide synthesis (ribonucleotide reductase)
└── Nitric oxide synthesis
\`\`\`

### 2. Ribose-5-Phosphate Production
- **Nucleotide synthesis**: DNA, RNA, ATP, NADH
- **Histidine synthesis**: Purine ring formation
- **Tryptophan metabolism**: NAD+ synthesis

### 3. Antioxidant Defense
\`\`\`
GSH Regeneration:
GSSG + NADPH + H+ → 2GSH + NADP+
↳ Glutathione reductase
↳ Protects against H₂O₂, free radicals
\`\`\`

## Tissue Distribution & Activity

| Tissue | Activity | Primary Need |
|--------|----------|--------------|
| **Liver** | High | Fatty acid synthesis |
| **Adipose** | High | Lipogenesis |
| **RBC** | Moderate | Antioxidant defense |
| **Lens** | High | Antioxidant protection |
| **Cornea** | High | Transparency maintenance |
| **Muscle** | Low | Glucose oxidation preferred |

## PPP vs Glycolysis

| Aspect | PPP | Glycolysis |
|--------|-----|------------|
| **Purpose** | NADPH, Ribose-5-P | ATP |
| **Regulation** | NADPH/NADP+ | Energy charge |
| **O₂ requirement** | None | None |
| **End product** | Various sugars | Pyruvate |
| **Compartment** | Cytoplasm | Cytoplasm |

## Clinical Correlations

### Oxidative Stress Conditions
**High PPP activity needed**:
- Drug metabolism (liver)
- Phagocytosis (neutrophils) 
- Cataracts (lens oxidation)
- Diabetes complications

### Cancer Metabolism
- **Rapidly dividing cells** need ↑ NADPH for:
  - DNA synthesis (ribonucleotide reductase)
  - Fatty acid synthesis (membrane production)
- **G6PDH overexpression** common in tumors

### G6PDH Deficiency Management
**Prevention**:
- Avoid known triggers
- Screen family members
- Genetic counseling

**Acute hemolysis treatment**:
- Remove trigger
- Hydration
- Severe cases: blood transfusion

## Regulation Summary

### High NADPH demand
- ↑ PPP activity (G6PDH activation)
- Examples: lipogenesis, detoxification

### Low NADPH demand  
- ↓ PPP activity (NADPH inhibition)
- Glucose → glycolysis instead

### Ribose-5-P demand
- Non-oxidative phase activation
- F6P + G3P → ribose-5-P

> **Flexible pathway**: Can emphasize NADPH production OR sugar interconversion based on cellular needs

## Integration with Other Pathways

### Connection to Glycolysis
- **F6P and G3P** from PPP → glycolysis
- **G6P** from glycolysis → PPP

### Fatty Acid Synthesis Link
- **NADPH** from PPP → fatty acid synthesis
- **Citrate** from TCA → acetyl-CoA (cytoplasm)

### Nucleotide Synthesis
- **Ribose-5-P** → purine/pyrimidine synthesis
- **NADPH** → ribonucleotide reductase`,

      keyPoints: [
        'PPP generates NADPH (reductive biosynthesis) and ribose-5-P (nucleotide synthesis) from G6P',
        'G6PDH is rate-limiting enzyme, regulated by NADPH/NADP+ ratio (product inhibition)',
        'Oxidative phase produces 2 NADPH per G6P; non-oxidative phase interconverts sugars',
        'G6PDH deficiency is most common enzymopathy, causes hemolytic anemia with oxidative stress',
        'Essential for antioxidant defense through glutathione reduction and catalase function',
        'High activity in liver (lipogenesis), RBC (antioxidant), and rapidly dividing cells',
        'Transketolase requires thiamine cofactor; deficiency affects non-oxidative phase'
      ],

      examPrep: {
        mnemonics: [
          'PPP products: "NADPH Never Runs" - NADPH, ribose-5-P',
          'G6PDH triggers: "PAID" - Primaquine, Antimalarials, Infections, DKA',
          'Oxidative phase: "G6PDH Generates NADPH" - 2 NADPH per G6P',
          'PPP regulation: "Product Prevents Process" - NADPH inhibits G6PDH',
          'G6PDH deficiency inheritance: "X-linked Explains Male predominance"'
        ],
        highYield: [
          'G6PDH deficiency is X-linked, affects males more severely',
          'Fava beans can trigger hemolysis in G6PDH deficiency (favism)',
          'PPP provides 80% of cytoplasmic NADPH for biosynthesis',
          'Transketolase reactions require thiamine (B1) cofactor',
          'RBC depend on PPP for antioxidant defense (no mitochondria)'
        ],
        clinicalPearls: [
          'G6PDH deficiency protects against malaria (selective advantage)',
          'Primaquine (antimalarial) is classic trigger for hemolytic crisis',
          'Heinz bodies (denatured hemoglobin) seen in G6PDH deficiency',
          'Cancer cells upregulate PPP for NADPH and nucleotide synthesis'
        ]
      },

      textbookRefs: [
        { 
          textbook: "Harper's Illustrated Biochemistry", 
          edition: "32nd", 
          chapter: "Chapter 20 - The Pentose Phosphate Pathway", 
          pages: "214-223" 
        }
      ],

      retrievalCards: [
        {
          question: 'What are the two main products of PPP oxidative phase and their metabolic roles?',
          answer: '2 NADPH (fatty acid synthesis, antioxidant defense, drug metabolism) and ribose-5-phosphate (nucleotide synthesis, purine/pyrimidine production)'
        },
        {
          question: 'Why does G6PDH deficiency cause hemolytic anemia specifically during oxidative stress?',
          answer: 'G6PDH deficiency → ↓NADPH → cannot regenerate reduced glutathione → ↓antioxidant defense → RBC membrane damage → hemolysis during stress'
        },
        {
          question: 'List the classic triggers for hemolytic crisis in G6PDH deficiency',
          answer: 'Antimalarial drugs (primaquine), sulfonamides, fava beans (favism), infections, diabetic ketoacidosis, naphthalene (mothballs)'
        },
        {
          question: 'How is PPP activity regulated and why is this mechanism appropriate?',
          answer: 'G6PDH inhibited by NADPH (product inhibition). When NADPH depleted → PPP active. When NADPH abundant → PPP inactive. Matches NADPH supply to demand'
        },
        {
          question: 'Why do cancer cells and actively lipogenic tissues have high PPP activity?',
          answer: 'Cancer: need NADPH for DNA synthesis (ribonucleotide reductase) and fatty acids. Lipogenic tissue: need NADPH for fatty acid synthesis. Both require reducing power'
        }
      ],

      cases: [
        {
          title: 'G6PDH Deficiency Crisis',
          presentation: 'A 25-year-old Mediterranean male develops sudden onset of dark urine, jaundice, and fatigue after taking antimalarial medication for travel.',
          analysis: 'G6PDH deficiency triggered by primaquine. Oxidative stress overwhelms reduced antioxidant capacity (low NADPH → low GSH). RBC hemolysis causes hemoglobinuria (dark urine) and jaundice.',
          clinicalPearl: 'Screen for G6PDH deficiency before prescribing antimalarials. Family history and ethnicity are important clues. Hemolysis is self-limited once trigger removed.'
        },
        {
          title: 'Favism in Child',
          presentation: 'A 5-year-old boy from Greece develops acute anemia and dark urine 24 hours after eating fresh fava beans at a family gathering.',
          analysis: 'Favism - fava beans contain oxidants (vicine, convicine) that trigger hemolysis in G6PDH-deficient individuals. Common in Mediterranean populations where both fava beans and G6PDH deficiency are prevalent.',
          clinicalPearl: 'Cultural dietary practices intersect with genetic predisposition. Educate families about food triggers. Favism can be severe in children due to higher bean consumption per body weight.'
        }
      ]
    },
    prerequisites: ['glucose-metabolism', 'redox-biochemistry'],
    relatedTopics: ['glycolysis', 'fatty-acid-synthesis', 'antioxidant-systems'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'PLAB'],
    estimatedMinutes: 30,
    hasContent: { 
      concept: true, 
      examPrep: true, 
      textbook: true, 
      retrievalCards: true, 
      cases: true, 
      grindeMap: false 
    },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09',
  },

  // =============================================================================
  // PYRUVATE METABOLISM
  // =============================================================================
  {
    id: 'pyruvate-metabolism',
    subjectId: 'biochemistry',
    subspecialtyId: 'biochemistry-carbohydrate',
    name: 'Pyruvate Metabolism',
    slug: 'pyruvate-metabolism',
    description: 'Pyruvate dehydrogenase complex and metabolic fates of pyruvate',
    content: {
      concept: `# Pyruvate Metabolism - The Metabolic Crossroads

## Overview

> **Pyruvate** is the key metabolic intermediate connecting glycolysis to aerobic metabolism, with multiple possible fates depending on cellular conditions.

**Sources**: Glycolysis, amino acid catabolism (alanine, serine)  
**Fates**: Acetyl-CoA, lactate, alanine, oxaloacetate, fatty acids

## Pyruvate Dehydrogenase Complex (PDH)

### Structure & Components
\`\`\`
PDH COMPLEX (Multi-enzyme):
├── E1: Pyruvate dehydrogenase (TPP cofactor)
├── E2: Dihydrolipoyl transacetylase (Lipoic acid)
├── E3: Dihydrolipoyl dehydrogenase (FAD, NAD+)
├── E3BP: E3-binding protein (structural)
└── Regulatory enzymes (kinases, phosphatases)
\`\`\`

### Overall Reaction
\`\`\`
Pyruvate + NAD+ + CoA → Acetyl-CoA + NADH + CO₂
\`\`\`

### Cofactor Requirements (5 total)
1. **TPP** (Thiamine pyrophosphate) - B1
2. **Lipoic acid** (covalently bound to E2)
3. **CoA** (from Pantothenic acid) - B5
4. **FAD** (Riboflavin) - B2  
5. **NAD+** (Niacin) - B3

> 💎 **"Tender Loving Care For Nobody"** - TPP, Lipoic acid, CoA, FAD, NAD+

## PDH Regulation - Covalent Modification

### PDH Kinase (Inactivates PDH)
**Activators** (↓ PDH activity):
- **ATP, NADH, Acetyl-CoA** (energy abundance)
- **Citrate** (TCA cycle sufficiency) 
- **Fatty acids** (fat oxidation active)

**Inhibitors** (↑ PDH activity):
- **ADP, NAD+, CoA** (energy demand)
- **Pyruvate** (substrate availability)
- **Insulin** (fed state signal)

### PDH Phosphatase (Activates PDH)  
**Activators**:
- **Ca²⁺** (muscle contraction, neural activity)
- **Insulin** (promotes glucose oxidation)
- **Mg²⁺** (cofactor)

**Inhibitors**:
- **NADH, Acetyl-CoA** (feedback inhibition)

## Metabolic Fates of Pyruvate

### 1. Acetyl-CoA (Aerobic - PDH Complex)
\`\`\`
Pyruvate → Acetyl-CoA → TCA cycle → CO₂ + H₂O
Conditions: O₂ available, active PDH
Tissues: Heart, liver (fed state), muscle (aerobic)
\`\`\`

### 2. Lactate (Anaerobic - LDH)
\`\`\`
Pyruvate + NADH → Lactate + NAD+
Enzyme: Lactate dehydrogenase (LDH)
Conditions: Hypoxia, intense exercise
Tissues: Muscle, RBC, tumors
\`\`\`

### 3. Alanine (Transamination)
\`\`\`
Pyruvate + Glutamate → Alanine + α-KG  
Enzyme: Alanine aminotransferase (ALT)
Purpose: Transport amino groups to liver
Tissues: Muscle → liver (alanine cycle)
\`\`\`

### 4. Oxaloacetate (Anaplerosis)
\`\`\`
Pyruvate + CO₂ + ATP → OAA + ADP + Pi
Enzyme: Pyruvate carboxylase (biotin cofactor)
Purpose: Replenish TCA intermediates
Conditions: Low TCA intermediates
\`\`\`

### 5. Fatty Acids (via Acetyl-CoA)
\`\`\`
Pyruvate → Acetyl-CoA → Malonyl-CoA → Fatty acids
Conditions: Fed state, high insulin
Tissues: Liver, adipose tissue
\`\`\`

## Tissue-Specific Pyruvate Metabolism

### Heart Muscle
- **Primarily aerobic**: Pyruvate → Acetyl-CoA
- **High PDH activity**: Continuous glucose oxidation
- **Backup fuels**: Fatty acids, lactate

### Skeletal Muscle  
- **Rest**: Pyruvate → Acetyl-CoA (aerobic)
- **Exercise**: Pyruvate → Lactate (anaerobic)
- **Recovery**: Lactate → Pyruvate → glucose (Cori cycle)

### Brain
- **Obligate glucose user** (normal conditions)
- **Pyruvate → Acetyl-CoA** exclusively
- **High PDH activity**: Cannot afford shutdown

### Liver
- **Fed state**: Pyruvate → Acetyl-CoA → fatty acids
- **Fasting**: Lactate → Pyruvate → glucose
- **Flexible PDH regulation**: Responds to nutritional state

### RBC
- **Pyruvate → Lactate** only
- **No mitochondria**: Cannot use PDH
- **Lactate export**: To liver for gluconeogenesis

## Clinical Correlations

### PDH Deficiency
**Genetics**: X-linked (mostly males affected)
**Biochemistry**: ↓ Acetyl-CoA production → ↑ lactate
**Symptoms**: 
- Lactic acidosis
- Neurological defects
- Growth retardation

**Treatment**: 
- **Thiamine** (high doses)
- **Ketogenic diet** (bypass glucose dependence)
- **Dichloroacetate** (PDH kinase inhibitor)

### Thiamine (B1) Deficiency
**Affects**: PDH and α-KG DH complexes
**Consequences**:
- ↓ Glucose oxidation → ↑ lactate
- ↓ TCA cycle activity → energy deficit
- **Beriberi**: Cardiac and neurologic symptoms
- **Wernicke-Korsakoff**: In alcoholics

### Arsenic Poisoning
**Mechanism**: Binds to **lipoic acid** sulfhydryl groups
**Effect**: Inhibits PDH and α-KG DH
**Symptoms**: Similar to thiamine deficiency

### Lactic Acidosis
**Type A** (Tissue hypoxia):
- Shock, sepsis, cardiac arrest
- ↑ Pyruvate → lactate (hypoxic conditions)

**Type B** (Normal oxygenation):
- Metformin, phenformin
- PDH deficiency, thiamine deficiency
- ↓ Pyruvate oxidation

## Integration with Energy Metabolism

### Fed State
\`\`\`
High Insulin:
├── ↑ PDH activity (dephosphorylation)
├── Pyruvate → Acetyl-CoA → TCA
├── Excess Acetyl-CoA → fatty acid synthesis
└── Energy storage mode
\`\`\`

### Fasting State
\`\`\`
Low Insulin, High Glucagon:
├── ↓ PDH activity (phosphorylation) 
├── ↑ Fatty acid oxidation (Randle cycle)
├── Pyruvate → OAA (gluconeogenesis)
└── Glucose production mode
\`\`\`

### Exercise
\`\`\`
Muscle contraction:
├── ↑ Ca²⁺ → ↑ PDH phosphatase
├── ↑ ADP, ↓ ATP → ↑ PDH activity
├── Aerobic: Pyruvate → Acetyl-CoA
└── Anaerobic: Pyruvate → Lactate
\`\`\``,

      keyPoints: [
        'PDH complex converts pyruvate to acetyl-CoA, requiring 5 cofactors (TPP, lipoic acid, CoA, FAD, NAD+)',
        'PDH regulated by phosphorylation: kinase inactivates (energy abundance), phosphatase activates (energy demand)',
        'Pyruvate has 5 major fates: acetyl-CoA, lactate, alanine, oxaloacetate, fatty acids',
        'Thiamine (B1) deficiency affects PDH → lactic acidosis and neurological symptoms',
        'Randle cycle: fatty acid oxidation inhibits PDH (metabolic competition)',
        'PDH deficiency is X-linked disorder causing lactic acidosis and developmental delay',
        'Insulin promotes PDH activity; glucagon and fatty acids inhibit it'
      ],

      examPrep: {
        mnemonics: [
          'PDH cofactors: "Tender Loving Care For Nobody" - TPP, Lipoic acid, CoA, FAD, NAD+',
          'PDH kinase activators: "ANACF" - ATP, NADH, Acetyl-CoA, Citrate, Fatty acids',
          'Pyruvate fates: "AALOF" - Acetyl-CoA, Alanine, Lactate, OAA, Fatty acids',
          'PDH regulation: "Phosphorylation Prevents, Ca²⁺ Catalyzes"',
          'B1 deficiency triad: "BAD" - Beriberi, Acidosis (lactic), Dementia'
        ],
        highYield: [
          'PDH is irreversibly committed step from carbs to fat synthesis',
          'Arsenic poisoning mimics thiamine deficiency (binds lipoic acid)',
          'Dichloroacetate inhibits PDH kinase (treats lactic acidosis)',
          'Ca²⁺ activates PDH phosphatase during muscle contraction',
          'Metformin can cause lactic acidosis by inhibiting Complex I'
        ],
        clinicalPearls: [
          'Always give thiamine BEFORE glucose in alcoholics (prevent Wernicke)',
          'Ketogenic diet can bypass PDH deficiency',
          'Lactic acidosis + neurological symptoms = think thiamine deficiency',
          'PDH deficiency more common in males (X-linked inheritance)'
        ]
      },

      textbookRefs: [
        { 
          textbook: "Harper's Illustrated Biochemistry", 
          edition: "32nd", 
          chapter: "Chapter 17 - Glycolysis & Oxidation of Pyruvate", 
          pages: "173-187" 
        }
      ],

      retrievalCards: [
        {
          question: 'List the 5 cofactors required by PDH complex and their vitamin sources',
          answer: '1) TPP (thiamine/B1), 2) Lipoic acid (synthesized), 3) CoA (pantothenate/B5), 4) FAD (riboflavin/B2), 5) NAD+ (niacin/B3)'
        },
        {
          question: 'How does PDH kinase regulate PDH activity and what signals control the kinase?',
          answer: 'PDH kinase phosphorylates and inactivates PDH. Activated by ATP, NADH, acetyl-CoA, citrate (energy abundance). Inhibited by ADP, NAD+, CoA, pyruvate, insulin'
        },
        {
          question: 'Why does thiamine deficiency cause lactic acidosis and neurological symptoms?',
          answer: 'Thiamine (TPP) cofactor for PDH. Deficiency → impaired pyruvate oxidation → pyruvate → lactate. Brain depends on glucose → neurological dysfunction when glucose oxidation impaired'
        },
        {
          question: 'Compare Type A vs Type B lactic acidosis in terms of mechanism and examples',
          answer: 'Type A: tissue hypoxia → anaerobic glycolysis (shock, sepsis). Type B: normal O₂ but impaired pyruvate oxidation (metformin, PDH deficiency, thiamine deficiency)'
        },
        {
          question: 'How does the Randle cycle affect pyruvate metabolism?',
          answer: 'Fatty acid oxidation → acetyl-CoA + citrate + ATP → inhibit PDH kinase → inactivate PDH. Spares glucose when fat is available (glucose-fatty acid cycle)'
        }
      ],

      cases: [
        {
          title: 'Wernicke Encephalopathy in Alcoholic',
          presentation: 'Chronic alcoholic brought to ED confused and ataxic. Given IV glucose, develops worsening confusion and ophthalmoplegia.',
          analysis: 'Chronic alcohol impairs thiamine absorption/storage. IV glucose without thiamine precipitates Wernicke encephalopathy. Increased glucose metabolism depletes remaining thiamine stores, worsening PDH dysfunction.',
          clinicalPearl: 'ALWAYS give thiamine before or with glucose in malnourished/alcoholic patients. Thiamine deficiency affects brain areas with high glucose metabolism (mammillary bodies, thalamus).'
        },
        {
          title: 'PDH Deficiency in Newborn',
          presentation: 'Male newborn presents with severe lactic acidosis, hypotonia, and developmental delay. Family history of affected males.',
          analysis: 'X-linked PDH deficiency impairs glucose oxidation → lactic acidosis. Brain most affected due to glucose dependence. Carrier testing for mother and genetic counseling needed.',
          clinicalPearl: 'Consider ketogenic diet to bypass glucose metabolism. Dichloroacetate may help by inhibiting PDH kinase. Prognosis varies with residual enzyme activity.'
        }
      ]
    },
    prerequisites: ['glycolysis', 'tca-cycle'],
    relatedTopics: ['gluconeogenesis', 'fatty-acid-metabolism', 'amino-acid-metabolism'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'PLAB'],
    estimatedMinutes: 35,
    hasContent: { 
      concept: true, 
      examPrep: true, 
      textbook: true, 
      retrievalCards: true, 
      cases: true, 
      grindeMap: false 
    },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09',
  }

];