/**
 * NucleuX Academy - Nephrology Topics
 * 
 * Created by Narasimha
 */

import type { LibraryTopic } from '../../types/library';

export const NEPHROLOGY_TOPICS: LibraryTopic[] = [
  {
    id: 'nephrology-aki',
    subjectId: 'medicine',
    subspecialtyId: 'medicine-nephrology',
    name: 'Acute Kidney Injury',
    slug: 'acute-kidney-injury',
    description: 'KDIGO staging, prerenal vs intrinsic vs postrenal, FENa, dialysis indications',
    highYield: true,
    content: {
      concept: `# Acute Kidney Injury

> 📚 **Sources:** Harrison's 22nd Ed Ch. 310, KDIGO Guidelines 2012

## Core Concept

Acute Kidney Injury (AKI) is an abrupt decline in kidney function occurring over hours to days. Defined by KDIGO as:
- ↑Creatinine ≥0.3 mg/dL in 48h, OR
- ↑Creatinine ≥1.5× baseline in 7 days, OR
- Urine <0.5 mL/kg/hr × 6h

## Classification

| Type | Cause | FENa |
|------|-------|------|
| **Pre-renal (60-70%)** | ↓Perfusion (hypovolemia, CHF, sepsis) | <1% |
| **Intrinsic (25-40%)** | ATN, GN, AIN, vascular | >2% |
| **Post-renal (5-10%)** | Obstruction (BPH, stones, tumor) | Variable |

## KDIGO Staging

| Stage | Creatinine | Urine Output |
|-------|------------|--------------|
| **1** | 1.5-1.9× baseline | <0.5 mL/kg/hr × 6-12h |
| **2** | 2.0-2.9× baseline | <0.5 mL/kg/hr × ≥12h |
| **3** | ≥3× baseline or ≥4 mg/dL | <0.3 mL/kg/hr × ≥24h |

## Differentiating Pre-renal vs ATN

| Parameter | Pre-renal | ATN |
|-----------|-----------|-----|
| FENa | <1% | >2% |
| Urine Na | <20 | >40 |
| BUN:Cr | >20:1 | <15:1 |
| Urine sediment | Bland | Muddy brown casts |

## Dialysis Indications (AEIOU)

- **A**cidosis (refractory)
- **E**lectrolytes (K >6.5)
- **I**ntoxication
- **O**verload (pulmonary edema)
- **U**remia (encephalopathy, pericarditis)
`,
    },
    hasContent: { concept: true, examPrep: false, textbook: false, retrievalCards: false, cases: false, grindeMap: false },
  },
  {
    id: 'nephrology-ckd',
    subjectId: 'medicine',
    subspecialtyId: 'medicine-nephrology',
    name: 'Chronic Kidney Disease',
    slug: 'chronic-kidney-disease',
    description: 'GFR staging, CKD-MBD, anemia management, SGLT2i renoprotection',
    highYield: true,
    content: {
      concept: `# Chronic Kidney Disease

> 📚 **Sources:** Harrison's 22nd Ed Ch. 311, KDIGO CKD Guidelines 2012

## Core Concept

CKD is progressive, irreversible decline in kidney function for ≥3 months. Leading causes: Diabetes (40%), Hypertension (25%), Glomerulonephritis (10%).

## GFR Staging

| Stage | GFR | Description |
|-------|-----|-------------|
| G1 | ≥90 | Normal (with damage) |
| G2 | 60-89 | Mild |
| G3a | 45-59 | Mild-Moderate |
| G3b | 30-44 | Moderate-Severe |
| G4 | 15-29 | Severe |
| G5 | <15 | ESKD |

## Albuminuria Categories

| Category | UACR (mg/g) |
|----------|-------------|
| A1 | <30 (normal) |
| A2 | 30-300 (microalbuminuria) |
| A3 | >300 (macroalbuminuria) |

## CKD-MBD Pathophysiology

1. ↓GFR → ↓Phosphate excretion → Hyperphosphatemia
2. ↓1,25-OH Vitamin D → Hypocalcemia
3. → Secondary hyperparathyroidism → Bone disease

## Treatment Cornerstones

| Intervention | Target |
|--------------|--------|
| ACEi/ARB | First-line, especially if proteinuria |
| SGLT2i | Dapagliflozin, empagliflozin (even non-diabetics!) |
| BP | <130/80 |
| HbA1c | <7% |
| Anemia | ESAs + Iron, target Hb 10-11.5 |
`,
    },
    hasContent: { concept: true, examPrep: false, textbook: false, retrievalCards: false, cases: false, grindeMap: false },
  },
  {
    id: 'nephrology-gn',
    subjectId: 'medicine',
    subspecialtyId: 'medicine-nephrology',
    name: 'Glomerulonephritis',
    slug: 'glomerulonephritis',
    description: 'IgA, PIGN, RPGN types, serologic clues, biopsy findings',
    highYield: true,
    content: {
      concept: `# Glomerulonephritis

> 📚 **Sources:** Harrison's 22nd Ed Ch. 313

## Clinical Syndromes

| Syndrome | Features |
|----------|----------|
| **Nephritic** | Hematuria (RBC casts), mild proteinuria, HTN, oliguria |
| **Nephrotic** | Heavy proteinuria (>3.5g), hypoalbuminemia, edema, hyperlipidemia |
| **RPGN** | Rapid GFR decline, crescents on biopsy |

## Major Types

### IgA Nephropathy (Berger's)
- Most common GN worldwide
- Synpharyngitic hematuria (coincides with URI)
- Mesangial IgA deposits

### Post-Infectious GN
- 2-4 weeks after strep pharyngitis
- Low C3, elevated ASO
- "Lumpy-bumpy" deposits
- Self-limited in children

### Membranous
- Most common nephrotic cause in adults
- Anti-PLA2R antibodies (primary)
- Rule out malignancy!

## RPGN Classification

| Type | Mechanism | IF Pattern |
|------|-----------|------------|
| I | Anti-GBM | Linear IgG |
| II | Immune complex | Granular |
| III | Pauci-immune (ANCA) | Minimal deposits |

## Serologic Clues

| Finding | Suggests |
|---------|----------|
| Low C3, normal C4 | PIGN, MPGN |
| Low C3 and C4 | Lupus, cryo |
| c-ANCA (PR3) | GPA |
| p-ANCA (MPO) | MPA, EGPA |
| Anti-GBM | Goodpasture |
`,
    },
    hasContent: { concept: true, examPrep: false, textbook: false, retrievalCards: false, cases: false, grindeMap: false },
  },
  {
    id: 'nephrology-nephrotic',
    subjectId: 'medicine',
    subspecialtyId: 'medicine-nephrology',
    name: 'Nephrotic Syndrome',
    slug: 'nephrotic-syndrome',
    description: 'MCD, membranous, FSGS, thrombosis risk, treatment',
    highYield: true,
    content: {
      concept: `# Nephrotic Syndrome

> 📚 **Sources:** Harrison's 22nd Ed Ch. 313

## Tetrad

1. **Proteinuria** >3.5 g/day
2. **Hypoalbuminemia** <3 g/dL
3. **Edema**
4. **Hyperlipidemia**

## Causes by Age

### Children
- **Minimal Change Disease (80%)** — excellent steroid response
- FSGS (10%)

### Adults
- Diabetic nephropathy (most common overall)
- **Membranous** (most common primary) — anti-PLA2R, rule out malignancy
- FSGS (common in African Americans)

## Complications

| Complication | Mechanism |
|--------------|-----------|
| **Thromboembolism** | Loss of AT-III, ↑clotting factors |
| **Infection** | Loss of immunoglobulins |
| **AKI** | Intravascular depletion |

## Treatment

- ACEi/ARBs for all
- Steroids for MCD
- Anticoagulation if albumin <2.0 (especially membranous)
- Statin therapy
`,
    },
    hasContent: { concept: true, examPrep: false, textbook: false, retrievalCards: false, cases: false, grindeMap: false },
  },
  {
    id: 'nephrology-diabetic',
    subjectId: 'medicine',
    subspecialtyId: 'medicine-nephrology',
    name: 'Diabetic Nephropathy',
    slug: 'diabetic-nephropathy',
    description: 'Natural history, Kimmelstiel-Wilson, ACEi/ARB + SGLT2i therapy',
    highYield: true,
    content: {
      concept: `# Diabetic Nephropathy

> 📚 **Sources:** Harrison's 22nd Ed Ch. 418, KDIGO 2020

## Core Concept

Leading cause of ESKD worldwide (45% of dialysis patients). Develops in 20-40% of diabetics after 10-20 years.

## Natural History

| Stage | Timeline | Features |
|-------|----------|----------|
| 1 | At diagnosis | Hyperfiltration, ↑GFR |
| 2 | 2-5 years | Silent, GBM thickening |
| 3 | 5-15 years | Microalbuminuria (30-300 mg/day) |
| 4 | 15-25 years | Macroalbuminuria, ↓GFR |
| 5 | 20-30 years | ESKD |

## Pathology

- **Kimmelstiel-Wilson nodules** — pathognomonic nodular glomerulosclerosis
- **Afferent + Efferent arteriolar hyalinosis** — characteristic (only efferent in HTN)
- GBM thickening

## When to Suspect Alternative Diagnosis

- No retinopathy + proteinuria (Type 1)
- Rapid GFR decline
- Active sediment
- Duration <5 years

## Treatment Algorithm

\`\`\`
ACEi or ARB (first-line)
       ↓
Add SGLT2i (if eGFR ≥20)
       ↓
Consider Finerenone
       ↓
BP <130/80, HbA1c <7%
\`\`\`

## Key Points

- **SGLT2i** = standard of care (benefit beyond glucose!)
- ACEi/ARB + SGLT2i = good combination
- Cr rise up to 30% with ACEi is acceptable
`,
    },
    hasContent: { concept: true, examPrep: false, textbook: false, retrievalCards: false, cases: false, grindeMap: false },
  },
];
