#!/usr/bin/env python3
"""Generate explorer.md, exam-prep.md, and _meta.yaml for medicine topics."""
import os

BASE = "/Users/adityachandrabhatla/nucleux-academy/content/medicine"

# Topics that already have GOOD content (>100 lines) - skip these
SKIP_EXPLORER = {
    "endocrinology/diabetes-mellitus-type-1",
    "endocrinology/diabetes-mellitus-type-2",
    "endocrinology/diabetes-mellitus",
    "endocrinology/diabetic-ketoacidosis",
    "endocrinology/adrenal-disorders",
}
SKIP_EXAM = {
    "endocrinology/diabetes-mellitus-type-1",
    "endocrinology/diabetes-mellitus-type-2",
    "endocrinology/diabetes-mellitus",
    "endocrinology/diabetic-ketoacidosis",
    "endocrinology/adrenal-disorders",
}
SKIP_META = {
    "endocrinology/diabetes-mellitus-type-1",
    "endocrinology/diabetes-mellitus-type-2",
    "endocrinology/diabetes-mellitus",
    "endocrinology/diabetic-ketoacidosis",
}

def write_file(subpath, filename, content):
    path = os.path.join(BASE, subpath, filename)
    with open(path, 'w') as f:
        f.write(content)
    print(f"  Wrote {subpath}/{filename} ({len(content.splitlines())} lines)")

# All topic data
TOPICS = {}

###############################################################################
# ENDOCRINOLOGY
###############################################################################

TOPICS["endocrinology/calcium-disorders"] = {
    "meta": """title: "Calcium Disorders"
slug: calcium-disorders
depth: "UG"
highYield: true
nmc_codes:
  - "IM12.3"
  - "IM12.4"
prerequisites:
  - "renal-physiology"
related_topics:
  - "paget-disease-bone"
  - "thyroid-nodule-evaluation"
""",
    "explorer": r"""# Calcium Disorders — Explorer

## Overview

**Calcium homeostasis** is maintained by PTH, vitamin D, and calcitonin acting on bone, kidney, and gut. Disorders include **hypercalcemia** (most commonly primary hyperparathyroidism or malignancy) and **hypocalcemia** (most commonly hypoparathyroidism or vitamin D deficiency). Normal serum calcium: 8.5–10.5 mg/dL (2.1–2.6 mmol/L).

## Key Points

- **Primary hyperparathyroidism**: MC cause of hypercalcemia in outpatients
- **Malignancy**: MC cause of hypercalcemia in hospitalized patients
- Hypercalcemia symptoms: "**Stones, Bones, Groans, Moans, Psychiatric Overtones**"
- Hypocalcemia signs: **Chvostek** (facial twitch) and **Trousseau** (carpopedal spasm)
- **Corrected calcium** = measured Ca + 0.8 × (4 − albumin)
- **Hungry bone syndrome**: post-parathyroidectomy hypocalcemia
- ECG: Hypercalcemia = **short QT**; Hypocalcemia = **prolonged QT**

## Definition & Classification

### Hypercalcemia (>10.5 mg/dL)
- **Mild**: 10.5–12 mg/dL (often asymptomatic)
- **Moderate**: 12–14 mg/dL
- **Severe/Crisis**: >14 mg/dL (medical emergency)

### Causes by PTH Level

| PTH Level | Causes |
|-----------|--------|
| **↑ PTH** | Primary hyperparathyroidism, tertiary hyperPTH, FHH |
| **↓ PTH** | Malignancy (PTHrP, bone mets, myeloma), Vit D excess, Sarcoidosis, Thyrotoxicosis, Milk-alkali |

### Hypocalcemia (<8.5 mg/dL)
- **Hypoparathyroidism** (post-surgical MC)
- **Vitamin D deficiency** (nutritional, CKD)
- **Pseudohypoparathyroidism** (PTH resistance — Albright hereditary osteodystrophy)
- Acute pancreatitis, massive transfusion (citrate), hyperphosphatemia

## Etiology & Pathophysiology

### Primary Hyperparathyroidism
- **Single adenoma (85%)**, hyperplasia (10%), carcinoma (<1%)
- ↑PTH → ↑bone resorption + ↑renal Ca reabsorption + ↑1,25-vit D → ↑gut Ca absorption
- Labs: ↑Ca, ↓PO4, ↑ALP, ↑urinary cAMP

### Malignancy-Related Hypercalcemia
- **PTHrP secretion** (squamous cell CA, renal, breast) — most common mechanism
- **Osteolytic metastases** (breast, myeloma)
- **1,25-vitamin D** production (lymphoma)

### Vitamin D Deficiency → Hypocalcemia
- Inadequate sun/diet → ↓25-OH-vit D → ↓intestinal Ca absorption
- ↑PTH (secondary hyperparathyroidism) → bone resorption → osteomalacia/rickets
- CKD → ↓1,25-vit D (↓1α-hydroxylase) → renal osteodystrophy

## Clinical Features

### Hypercalcemia — "Stones, Bones, Groans, Moans"
- **Stones**: renal calculi (calcium oxalate/phosphate), nephrocalcinosis
- **Bones**: bone pain, osteoporosis, osteitis fibrosa cystica (brown tumors — subperiosteal resorption, salt-and-pepper skull)
- **Groans**: abdominal pain, constipation, pancreatitis, PUD
- **Moans**: fatigue, depression, confusion, psychosis
- **Others**: polyuria/polydipsia, short QT, band keratopathy (calcium deposits in cornea)

### Hypocalcemia
- **Neuromuscular excitability**: tetany, carpopedal spasm, laryngospasm, seizures
- **Chvostek sign**: tap facial nerve (anterior to ear) → ipsilateral facial twitch
- **Trousseau sign**: BP cuff >SBP for 3 min → carpopedal spasm (more specific)
- **Prolonged QT** → risk of torsades de pointes
- Chronic: cataracts, basal ganglia calcification (Fahr syndrome), dental abnormalities

## Diagnosis

### Hypercalcemia Workup
1. **Confirm**: corrected calcium or ionized calcium
2. **PTH level**: ↑PTH = hyperparathyroidism; ↓PTH = non-PTH mediated
3. **PTHrP**: if malignancy suspected
4. **Vitamin D levels**: 25-OH-D and 1,25-(OH)₂-D
5. **SPEP/UPEP**: rule out myeloma
6. **24h urinary calcium**: FHH vs PHPT — FHH: Ca/Cr clearance ratio <0.01
7. **Imaging**: Sestamibi scan (parathyroid adenoma localization)

### Hypocalcemia Workup
1. PTH, phosphate, magnesium, vitamin D, ALP, albumin
2. **↓PTH + ↑PO4**: hypoparathyroidism
3. **↑PTH + ↓PO4**: vitamin D deficiency (secondary hyperPTH)
4. **↑PTH + ↑PO4**: pseudohypoparathyroidism or CKD
5. **Always check magnesium** — hypoMg causes functional hypoPTH (refractory hypoCa)

## Management

### Acute Hypercalcemia (Severe >14 mg/dL)
1. **IV Normal Saline** (200–300 mL/hr) — FIRST step, restore volume
2. **IV Furosemide** — only AFTER adequate hydration (calciuresis)
3. **IV Bisphosphonate** (zoledronic acid 4mg) — takes 2–4 days; best for malignancy
4. **Calcitonin** (4 IU/kg SC/IM q12h) — rapid onset but tachyphylaxis in 48h
5. **Denosumab** — bisphosphonate-refractory cases
6. **Glucocorticoids** — granulomatous disease (sarcoid), lymphoma, vit D intoxication
7. **Dialysis** — refractory or renal failure

### Primary Hyperparathyroidism
- **Parathyroidectomy**: definitive treatment
- Surgical indications: symptomatic, Ca >1 mg/dL above ULN, age <50, T-score <−2.5, eGFR <60, renal stones
- **Cinacalcet** (calcimimetic): medical option if surgery contraindicated
- **Preop localization**: sestamibi scan + ultrasound (4D-CT if discordant)

### Hypocalcemia
- **Acute symptomatic**: IV calcium gluconate (10 mL 10% over 10 min, cardiac monitor)
  - Calcium gluconate preferred over CaCl₂ (less tissue necrosis if extravasation)
- **Chronic**: oral calcium 1–2 g/day + calcitriol (active vit D)
- **Correct magnesium FIRST** if low — PTH won't work without Mg²⁺
- **Hypoparathyroidism**: calcium + calcitriol ± recombinant PTH (Natpara)

## Complications

- **Hypercalcemic crisis**: cardiac arrest, coma, acute renal failure — mortality 50% if untreated
- **Severe hypocalcemia**: laryngospasm → asphyxia, seizures, cardiac arrest (prolonged QT/TdP)
- **Hungry bone syndrome**: severe hypoCa post-parathyroidectomy — bones avidly absorb Ca/PO4/Mg
- **Brown tumors**: osteitis fibrosa cystica in severe hyperPTH (osteoclastic lesions, NOT neoplastic)
- **Nephrocalcinosis**: chronic hypercalciuria → renal impairment
- **Renal osteodystrophy**: CKD-related bone disease from disordered Ca/PO4/vit D metabolism
""",
    "exam": r"""# Calcium Disorders — Exam Prep

## Quick Summary

Hypercalcemia: outpatient = primary hyperPTH, inpatient = malignancy. Symptoms: stones, bones, groans, moans. Treat: IV NS → furosemide → bisphosphonate. Hypocalcemia: Chvostek + Trousseau signs, prolonged QT. Treat acute with IV calcium gluconate. Always check magnesium.

## High Yield Points ★

- ★ **Corrected Ca** = measured Ca + 0.8 × (4 − albumin)
- ★ **Primary hyperPTH**: ↑Ca, ↓PO4, ↑PTH, ↑ALP — single adenoma in 85%
- ★ **FHH vs PHPT**: Ca/Cr clearance ratio <0.01 = FHH (benign, no surgery needed)
- ★ **PTHrP** = most common mechanism of malignancy-related hypercalcemia
- ★ **Trousseau sign** more specific than Chvostek for hypocalcemia
- ★ **ECG**: HyperCa = short QT; HypoCa = prolonged QT
- ★ **IV Normal Saline FIRST** in acute hypercalcemia — NOT furosemide
- ★ **Hungry bone syndrome**: post-parathyroidectomy hypoCa (↓Ca, ↓PO4, ↓Mg)
- ★ **PseudohypoPTH**: ↑PTH + ↑PO4 + ↓Ca — Albright hereditary osteodystrophy (short stature, short 4th metacarpal, round face)
- ★ **Always check Mg²⁺** — hypoMg causes refractory hypocalcemia (blocks PTH secretion)
- ★ **Brown tumors** = osteoclastic lesions (NOT neoplastic) — may mimic malignancy on imaging

## Mnemonics

- **Hypercalcemia**: "Stones, Bones, Groans, Moans, Psychiatric Overtones"
- **Hypocalcemia**: "CATs go Numb" — Convulsions, Arrhythmias, Tetany, Numbness
- **FHH clue**: "Family History Hypercalcemia — Friendly, Harmless, Familial"
- **PseudohypoPTH**: "AHO = A Hundred Oddities" (short stature, round face, brachydactyly)

## Common MCQ Topics

1. Corrected calcium calculation
2. PHPT vs FHH differentiation (Ca/Cr clearance ratio)
3. First step in acute hypercalcemia (IV NS, NOT furosemide)
4. Chvostek vs Trousseau — which is more specific?
5. Causes of hypocalcemia with ↑PTH vs ↓PTH
6. Hungry bone syndrome post-parathyroidectomy
7. Sestamibi scan — what does it localize?
"""
}

TOPICS["endocrinology/diabetes-insipidus"] = {
    "meta": """title: "Diabetes Insipidus"
slug: diabetes-insipidus
depth: "UG"
highYield: true
nmc_codes:
  - "IM10.3"
prerequisites:
  - "pituitary-disorders"
related_topics:
  - "calcium-disorders"
""",
    "explorer": r"""# Diabetes Insipidus — Explorer

## Overview

**Diabetes insipidus (DI)** is characterized by excretion of large volumes of **dilute urine** (polyuria >3 L/day) due to either **deficient ADH secretion** (central DI) or **renal resistance to ADH** (nephrogenic DI). It must be distinguished from primary polydipsia and osmotic diuresis.

## Key Points

- **Central DI**: deficient ADH production/secretion (pituitary/hypothalamic pathology)
- **Nephrogenic DI**: renal resistance to ADH (lithium = MC drug cause)
- Hallmark: **dilute urine** (osmolality <300 mOsm/kg) with **concentrated plasma** (>290 mOsm/kg)
- **Water deprivation test**: gold standard for diagnosis
- Central DI responds to **desmopressin (DDAVP)**; nephrogenic does NOT
- Untreated → severe dehydration, hypernatremia

## Definition & Classification

| Type | Mechanism | ADH Level | Response to DDAVP |
|------|-----------|-----------|-------------------|
| **Central DI** | ↓ADH secretion | Low | Yes — urine concentrates |
| **Nephrogenic DI** | Renal ADH resistance | High | No |
| **Primary polydipsia** | Excessive water intake | Suppressed | N/A (concentrates with deprivation) |
| **Gestational DI** | Placental vasopressinase | Low | Yes |

## Etiology & Pathophysiology

### Central DI — Causes
- **Idiopathic** (~30%) — likely autoimmune destruction of ADH-producing neurons
- **Pituitary surgery/trauma** — most common identifiable cause
- **Tumors**: craniopharyngioma (MC in children), metastases (lung, breast), germinoma
- **Infiltrative**: sarcoidosis, Langerhans cell histiocytosis (histiocytosis X)
- **Infections**: meningitis, encephalitis
- **Genetic**: autosomal dominant (rare — AVP-neurophysin II mutations)
- **Sheehan syndrome**: postpartum pituitary necrosis (anterior > posterior)

### Nephrogenic DI — Causes
- **Lithium** — most common drug cause (damages collecting duct principal cells)
- **Hypercalcemia** — interferes with AQP2 expression
- **Hypokalemia** — impairs concentrating ability
- **CKD, sickle cell disease**, amyloidosis, Sjögren syndrome
- **Genetic**: X-linked (V2 receptor mutation — 90% of hereditary), AR (AQP2 mutation)
- **Drugs**: demeclocycline, amphotericin B, foscarnet

### Pathophysiology
- ADH (vasopressin) binds **V2 receptors** on collecting duct basolateral membrane
- → Gαs → cAMP → insertion of **aquaporin-2 (AQP2)** channels on apical membrane
- → Water reabsorption from tubular lumen → concentrated urine
- Without ADH effect: collecting duct remains impermeable → dilute polyuria
- If water intake inadequate → free water loss → hypernatremia → CNS dehydration

### Triphasic Response (Post-Neurosurgical)
1. **Phase 1** (days 1–5): DI — axonal shock, ↓ADH release
2. **Phase 2** (days 5–10): SIADH — uncontrolled ADH release from dying neurons
3. **Phase 3**: Permanent DI (if >80% neurons destroyed)

## Clinical Features

- **Polyuria**: >3 L/day, often 5–20 L/day; urine looks like water
- **Polydipsia**: intense, unrelenting thirst; strong preference for cold/iced water
- **Nocturia**: sleep disruption, significant QoL impact
- **Dehydration** (if water access limited): dry mucous membranes, tachycardia, poor skin turgor
- **Hypernatremia**: lethargy, confusion, irritability, seizures, coma
- Children: failure to thrive, irritability, unexplained fever, constipation

### Central vs Nephrogenic — Clinical Clues
- Central: often abrupt onset (post-surgical, post-traumatic); associated with other pituitary hormone deficiencies
- Nephrogenic: lithium use history, chronic hypercalcemia, family history (hereditary)

## Diagnosis

### Step 1: Confirm Polyuria + Dilute Urine
- 24h urine volume >3 L (or >50 mL/kg/day)
- Urine osmolality <300 mOsm/kg (often <100)
- Plasma osmolality >290 mOsm/kg
- Urine specific gravity <1.005

### Step 2: Water Deprivation Test (Miller-Moses Test)
1. Patient fasts (no fluids); monitor hourly: weight, urine output, urine osmolality, plasma osmolality
2. **Stop test** when: urine osmolality plateaus on 2 consecutive samples, OR weight loss >3%, OR plasma osmolality >295
3. Then administer **DDAVP 2 μg SC/IM**
4. Measure urine osmolality at 1h and 2h post-DDAVP

| Condition | After Deprivation | After DDAVP |
|-----------|-------------------|-------------|
| **Normal** | Urine >600 mOsm | Minimal further change |
| **Central DI** | Stays <300 (dilute) | >50% increase (concentrates >600) |
| **Nephrogenic DI** | Stays <300 (dilute) | <50% increase (stays dilute) |
| **Primary polydipsia** | Urine >500 (concentrates) | No further change |

### Step 3: Copeptin (Newer Test)
- Co-secreted with ADH; stable in plasma (ADH is unstable, hard to measure)
- **Hypertonic saline-stimulated copeptin**: distinguishes central DI from primary polydipsia (better than WDT)
- **Baseline copeptin**: high in nephrogenic DI, low in central DI

### Step 4: Identify Underlying Cause
- Central DI: **MRI pituitary/hypothalamus** — look for loss of posterior pituitary bright spot (T1 hyperintensity)
- Nephrogenic DI: lithium levels, serum Ca²⁺, K⁺, renal function, genetic testing

## Management

### Central DI
- **Desmopressin (DDAVP)**: synthetic ADH analog (selective V2 agonist)
  - Intranasal (10–20 μg bid), oral (0.1–0.4 mg bid), or SC
  - Titrate to control polyuria while avoiding hyponatremia (water intoxication)
  - Monitor serum sodium, urine output, weight regularly
- **Carbamazepine, chlorpropamide**: potentiate ADH effect (rarely used now)
- Treat underlying cause (tumor, infiltrative disease)

### Nephrogenic DI
- **Remove offending agent** (lithium — but discuss with psychiatrist; switch if possible)
- **Thiazide diuretics** — paradoxical antidiuresis: mild volume depletion → ↑proximal Na/water reabsorption → ↓distal delivery → ↓urine volume (30–50% reduction)
- **Amiloride** — blocks lithium entry via ENaC into collecting duct; preferred add-on with lithium
- **Low-salt, low-protein diet** — reduces obligatory solute excretion → ↓urine volume
- **NSAIDs** (indomethacin) — reduce prostaglandin-mediated ADH antagonism; adjunctive
- **Adequate free water access at ALL times** — critical to prevent hypernatremia

### Acute Hypernatremia
- **Free water replacement**: oral if mild; IV D5W or 0.45% NS if severe
- **Correction rate: <10 mEq/L per 24 hours** — rapid correction → cerebral edema
- Free water deficit = 0.6 × body weight (kg) × [(Na/140) − 1]
- Frequent sodium monitoring (q2–4h initially)

### Gestational DI
- DDAVP (safe in pregnancy — not degraded by vasopressinase)
- Usually resolves postpartum

## Complications

- **Severe hypernatremia**: CNS dehydration → intracranial hemorrhage, seizures, coma, death
- **Overly rapid correction of hypernatremia**: cerebral edema
- **DDAVP over-treatment**: dilutional hyponatremia → seizures, brain edema
- **Bladder distension, hydroureteronephrosis**: chronic massive polyuria
- **Growth failure, developmental delay**: in children if untreated
- **Dehydration-related mortality**: especially in obtunded/immobile patients without water access
""",
    "exam": r"""# Diabetes Insipidus — Exam Prep

## Quick Summary

DI = polyuria (>3 L/day) + dilute urine (<300 mOsm) + high plasma osmolality (>290). Central (↓ADH) vs Nephrogenic (ADH resistance). Water deprivation test differentiates. Central: responds to DDAVP. Nephrogenic: does NOT. Central → DDAVP. Nephrogenic → thiazides + amiloride + low-salt diet. Lithium = MC drug cause of nephrogenic DI.

## High Yield Points ★

- ★ **Water deprivation test** = classic diagnostic test for DI
- ★ **Central DI**: urine concentrates with DDAVP; **Nephrogenic**: does NOT respond
- ★ **Lithium** = most common drug cause of nephrogenic DI
- ★ **Thiazide paradox**: diuretic that REDUCES urine volume in nephrogenic DI (↑proximal reabsorption)
- ★ **MRI finding**: loss of posterior pituitary bright spot (T1) in central DI
- ★ **DDAVP** = treatment of choice for central DI (selective V2 agonist)
- ★ **Hypernatremia correction**: <10 mEq/L per 24h (avoid cerebral edema)
- ★ **Craniopharyngioma** = MC suprasellar tumor causing central DI in children
- ★ **Amiloride** = preferred for lithium-induced DI (blocks lithium entry via ENaC)
- ★ **Triphasic response** post-neurosurgery: DI → SIADH → permanent DI
- ★ **Copeptin** = newer biomarker (co-secreted with ADH, more stable)

## Mnemonics

- **DI vs DM**: "DI = Dilute Insipid (tasteless); DM = Dense Mellitus (sweet)"
- **Central vs Nephro**: "Central → Concentrates with DDAVP; Nephro → No response"
- **Nephrogenic causes "LITHIUM"**: Lithium, Inherited, Tubulointerstitial, Hypercalcemia, HypoK, Unknown, Medications
- **Thiazide paradox**: "Less in = Less out" (↑proximal reabsorption → less distal delivery)

## Common MCQ Topics

1. Water deprivation test interpretation (table format)
2. Central vs nephrogenic DI differentiation
3. Lithium-induced nephrogenic DI management
4. Thiazide paradox mechanism
5. Hypernatremia correction rate
6. Posterior pituitary bright spot on MRI
7. Triphasic response after pituitary surgery
"""
}

TOPICS["endocrinology/diabetic-nephropathy"] = {
    "meta": """title: "Diabetic Nephropathy"
slug: diabetic-nephropathy
depth: "UG"
highYield: true
nmc_codes:
  - "IM11.12"
prerequisites:
  - "diabetes-mellitus"
related_topics:
  - "diabetic-retinopathy"
  - "diabetes-mellitus-type-2"
""",
    "explorer": r"""# Diabetic Nephropathy — Explorer

## Overview

**Diabetic nephropathy (DN)** is the leading cause of **end-stage renal disease (ESRD)** worldwide. It is a microvascular complication affecting ~30–40% of diabetic patients, characterized by progressive albuminuria, declining GFR, and hypertension. Early detection through screening and aggressive risk factor management can delay or prevent progression.

## Key Points

- **Leading cause of ESRD** in developed countries
- Earliest clinical marker: **microalbuminuria** (UACR 30–300 mg/g)
- Pathognomonic histology: **Kimmelstiel-Wilson nodules** (nodular glomerulosclerosis)
- Screening: annual **urine albumin-to-creatinine ratio (UACR)** — T1DM: 5 years post-dx; T2DM: at diagnosis
- **ACE inhibitors/ARBs** = cornerstone (renoprotective even in normotensives)
- **SGLT2 inhibitors** = proven renal protection (CREDENCE, DAPA-CKD trials)
- **Finerenone** = non-steroidal MRA with renal + CV benefit (FIDELIO-DKD)

## Definition & Classification

### Mogensen Staging

| Stage | UACR (mg/g) | GFR | Clinical |
|-------|-------------|-----|----------|
| **1. Hyperfiltration** | Normal | ↑ (>140) | Enlarged kidneys, ↑renal blood flow |
| **2. Silent** | Normal | Normal | GBM thickening, mesangial expansion |
| **3. Incipient** | 30–300 | Normal/mildly ↓ | Microalbuminuria — earliest detectable |
| **4. Overt** | >300 | Progressively ↓ | Macroalbuminuria, nephrotic range possible |
| **5. ESRD** | Heavy | <15 | Dialysis/transplant required |

### Key Definitions
- **Microalbuminuria**: UACR 30–300 mg/g (also a cardiovascular risk marker)
- **Macroalbuminuria**: UACR >300 mg/g
- Confirm with 2 of 3 positive samples over 3–6 months (rule out false positives)

## Etiology & Pathophysiology

### Risk Factors
- **Duration of diabetes** (strongest predictor)
- Poor glycemic control (HbA1c), hypertension, dyslipidemia
- Genetic susceptibility (family history of DN), ethnicity (higher in African American, Hispanic, South Asian)
- Smoking, obesity

### Pathophysiology — Sequential Events
1. **Hyperglycemia** → AGEs (advanced glycation end products), sorbitol accumulation (polyol pathway), PKC activation
2. **Glomerular hyperfiltration** → intraglomerular hypertension → endothelial injury → mesangial expansion
3. **GBM thickening** → charge barrier loss → albuminuria
4. **Podocyte loss** → worsening proteinuria
5. **RAAS activation + TGF-β** → fibrosis (glomerulosclerosis + tubulointerstitial fibrosis)
6. Progressive nephron loss → declining GFR → ESRD

### Histopathology
- **Diffuse mesangial sclerosis** — most common pattern
- **Nodular glomerulosclerosis** (Kimmelstiel-Wilson nodules) — pathognomonic but less common
- **GBM thickening** — earliest histologic change
- **Arteriolar hyalinosis**: afferent AND efferent (unique to DM — other conditions affect afferent only)
- Tubular atrophy, interstitial fibrosis in late stages

## Clinical Features

- **Early (stages 1–2)**: completely asymptomatic — detected only by screening
- **Microalbuminuria (stage 3)**: no urinary symptoms; marker of endothelial dysfunction
- **Macroalbuminuria (stage 4)**: frothy urine, peripheral edema, hypertension
- **Nephrotic syndrome**: heavy proteinuria, hypoalbuminemia, anasarca, hyperlipidemia
- **Advanced CKD (stage 5)**: uremic symptoms — nausea, anorexia, pruritus, fatigue, neuropathy
- **Associated findings**: usually concurrent with diabetic retinopathy
  - **Absence of retinopathy in T1DM with nephropathy → suspect alternative diagnosis → renal biopsy**

### When to Suspect Non-Diabetic Kidney Disease
- No retinopathy (especially T1DM)
- Rapid GFR decline (>5 mL/min/year)
- Active urine sediment (RBC casts, dysmorphic RBCs)
- Onset <5 years after T1DM diagnosis
- Features of another systemic disease

## Diagnosis

### Screening Protocol
- **Test**: spot UACR (first morning void preferred) + serum creatinine/eGFR
- **T1DM**: start **5 years** after diagnosis, then annually
- **T2DM**: screen **at diagnosis** (may have had undiagnosed DM for years), then annually
- **Confirm**: 2 of 3 positive samples over 3–6 months

### False Positives for Microalbuminuria
- Exercise (within 24h), fever, UTI, heart failure, menstruation, uncontrolled HTN, very high BG

### Additional Workup
- Serum creatinine + eGFR (CKD-EPI formula)
- Urinalysis: rule out active sediment
- Renal ultrasound: kidneys may be enlarged early, then small in late stages
- Renal biopsy: only if atypical features suggest non-diabetic etiology

## Management

### Glycemic Control
- **HbA1c target <7%** (individualize — avoid hypoglycemia in advanced CKD)
- **SGLT2 inhibitors** (empagliflozin, dapagliflozin, canagliflozin): PROVEN renoprotective
  - Mechanism: ↑Na delivery to macula densa → TGF → afferent arteriolar constriction → ↓intraglomerular pressure
  - Benefits: ↓albuminuria, ↓ESRD progression, ↓CV death
  - Use down to eGFR 20 (newer data); avoid if eGFR <20

### Blood Pressure Control
- **Target <130/80 mmHg** (ADA/KDIGO guidelines)
- **ACEI or ARB** = FIRST-LINE (even if normotensive with microalbuminuria)
  - ↓intraglomerular pressure (dilate efferent > afferent arteriole)
  - ↓proteinuria by 30–40%
  - **Monitor K⁺ and creatinine**: acceptable ≤30% creatinine rise (if more → suspect renal artery stenosis)
  - **Do NOT combine ACEI + ARB** — ONTARGET trial: ↑hyperkalemia, ↑AKI, no benefit
- Add CCB (amlodipine), thiazide/loop diuretic as needed

### Newer Agents
- **Finerenone** (non-steroidal MRA): ↓albuminuria + ↓CV events + ↓CKD progression (FIDELIO-DKD, FIGARO-DKD)
- **GLP-1 receptor agonists** (semaglutide, liraglutide): secondary renal benefit via glucose/weight/BP reduction

### General Measures
- Smoking cessation, weight management, regular exercise
- **Statin therapy** — CV risk reduction (diabetic CKD = very high CV risk)
- **Dietary protein**: 0.8 g/kg/day in advanced CKD (avoid excessive protein)
- **Avoid nephrotoxins**: NSAIDs, iodinated contrast, aminoglycosides
- **Anemia management**: EPO-stimulating agents if Hb <10 (target 10–11.5)

### Referral & ESRD
- **Nephrology referral** when eGFR <30 or rapidly declining
- **Dialysis**: when eGFR <10–15 or uremic symptoms
- **Renal transplant**: best option for ESRD; simultaneous pancreas-kidney transplant in T1DM
- Advance care planning discussions early

## Complications

- **End-stage renal disease**: dialysis/transplant needed
- **Cardiovascular disease**: microalbuminuria is an independent CV risk marker (↑MI, stroke risk)
- **Accelerated hypertension** → further renal damage (vicious cycle)
- **Anemia**: ↓EPO production from damaged kidneys
- **Renal osteodystrophy**: disordered Ca/PO4/vit D/PTH metabolism
- **Hyperkalemia**: especially with RAAS blockade
- **Uremic complications**: pericarditis, encephalopathy, bleeding diathesis
""",
    "exam": r"""# Diabetic Nephropathy — Exam Prep

## Quick Summary

Leading cause of ESRD. Earliest marker: microalbuminuria (UACR 30–300). Pathognomonic: Kimmelstiel-Wilson nodules. Screen: T1DM at 5y, T2DM at diagnosis, then annually. Treatment pillars: ACEI/ARB + SGLT2i + glycemic control + BP <130/80. Never combine ACEI + ARB. No retinopathy + nephropathy in T1DM → suspect alternative diagnosis.

## High Yield Points ★

- ★ **Kimmelstiel-Wilson nodules** (nodular glomerulosclerosis) = pathognomonic of diabetic nephropathy
- ★ **Microalbuminuria (UACR 30–300)** = earliest clinical marker AND independent CV risk factor
- ★ **ACEI/ARB** = first-line renoprotective — start at microalbuminuria even if normotensive
- ★ **SGLT2 inhibitors** = proven renal protection (CREDENCE trial) — reduce intraglomerular pressure via TGF
- ★ **No retinopathy + nephropathy in T1DM** → suspect non-diabetic cause → renal biopsy
- ★ **Do NOT combine ACEI + ARB** (ONTARGET: ↑hyperkalemia, ↑AKI, no benefit)
- ★ **Afferent AND efferent arteriolar hyalinosis** = unique to diabetic nephropathy
- ★ **Finerenone**: non-steroidal MRA — ↓albuminuria + ↓CKD progression + ↓CV events
- ★ **GBM thickening** = earliest histologic change; **microalbuminuria** = earliest clinical change
- ★ **Screening**: "T1 = Five years; T2 = Today"
- ★ **Creatinine rise ≤30%** acceptable with ACEI/ARB; if >30% → suspect renal artery stenosis

## Mnemonics

- **Screening timing**: "T1 = Five years; T2 = Today (at diagnosis)"
- **Treatment "SAFE"**: SGLT2i, ACEI/ARB, Finerenone, Exercise/lifestyle
- **KW nodules**: "KW = Kidney Wrecking" (pathognomonic histology)
- **Mogensen stages**: "Hyper-Silent-Micro-Macro-End" (hyperfiltration → silent → micro → macro → ESRD)

## Common MCQ Topics

1. Screening intervals for DN (T1DM vs T2DM)
2. Kimmelstiel-Wilson nodules — pathognomonic finding
3. When to start ACEI/ARB (at microalbuminuria, even if normotensive)
4. SGLT2 inhibitor renal benefit mechanism (TGF, afferent arteriolar tone)
5. When to suspect non-diabetic kidney disease in a diabetic
6. ONTARGET trial — why NOT to combine ACEI + ARB
7. Acceptable creatinine rise with RAAS blockade (≤30%)
"""
}

TOPICS["endocrinology/diabetic-retinopathy"] = {
    "meta": """title: "Diabetic Retinopathy"
slug: diabetic-retinopathy
depth: "UG"
highYield: true
nmc_codes:
  - "IM11.13"
prerequisites:
  - "diabetes-mellitus"
related_topics:
  - "diabetic-nephropathy"
  - "diabetes-mellitus-type-2"
""",
    "explorer": r"""# Diabetic Retinopathy — Explorer

## Overview

**Diabetic retinopathy (DR)** is the leading cause of **preventable blindness** in working-age adults (20–74 years). It is a microvascular complication affecting retinal blood vessels, progressing from non-proliferative changes to sight-threatening proliferative disease and macular edema. Nearly all T1DM and >60% T2DM develop some DR within 20 years.

## Key Points

- **Leading cause of preventable blindness** in 20–74 age group
- Classified: **Non-proliferative (NPDR)** and **Proliferative (PDR)**
- NPDR: microaneurysms (earliest sign) → hemorrhages → hard exudates → cotton wool spots
- PDR hallmark: **neovascularization** — risk of vitreous hemorrhage, tractional retinal detachment
- **Diabetic macular edema (DME)**: MC cause of vision loss; can occur at any DR stage
- Screening: annual dilated fundoscopy (T1DM: 5 years post-dx; T2DM: at diagnosis)
- Treatment: anti-VEGF for DME, PRP for PDR

## Definition & Classification

### Non-Proliferative DR (NPDR)

| Severity | Fundoscopic Features |
|----------|---------------------|
| **Mild** | Microaneurysms only |
| **Moderate** | Microaneurysms + dot/blot hemorrhages + hard exudates + cotton wool spots |
| **Severe** | **4-2-1 rule**: hemorrhages in **4** quadrants, OR venous beading in **2** quadrants, OR IRMA in **1** quadrant |
| **Very Severe** | 2 or more severe NPDR criteria |

### Proliferative DR (PDR)
- **Neovascularization** of disc (NVD) or elsewhere (NVE) — hallmark
- High-risk PDR: NVD >1/3 disc area, any NVD with vitreous hemorrhage, NVE with vitreous hemorrhage
- New vessels are fragile → vitreous hemorrhage → fibrovascular proliferation → tractional retinal detachment

### Diabetic Macular Edema (DME)
- Retinal thickening/edema at or near macula from vascular leakage
- Can occur at ANY stage of DR (even mild NPDR)
- **Most common cause of visual impairment** in diabetic patients overall

## Etiology & Pathophysiology

### Risk Factors
- **Duration of DM** — strongest risk factor
- **Glycemic control** (HbA1c) — DCCT/UKPDS: tight control delays onset and progression
- **Hypertension** — accelerates progression (UKPDS)
- **Dyslipidemia** — fenofibrate shows benefit (FIELD, ACCORD-Eye)
- **Pregnancy** — may worsen DR (screen before conception/1st trimester)
- **Nephropathy** — coexistent microvascular disease marker
- **Smoking, anemia, rapid glycemic correction** (temporary worsening)

### Pathophysiology — Sequential Steps
1. **Chronic hyperglycemia** → pericyte loss (earliest cellular change) → capillary wall weakening
2. **Basement membrane thickening** → loss of pericyte:endothelial cell ratio
3. **Microaneurysm formation** (focal outpouchings) → leakage → hemorrhages, edema
4. **Hard exudates**: lipid and protein deposits from leaky vessels (often ring pattern around macula)
5. **Cotton wool spots**: nerve fiber layer infarcts (arteriolar occlusion) — "soft exudates"
6. **Capillary non-perfusion** → retinal ischemia → **VEGF release**
7. **VEGF-driven neovascularization** = transition to PDR
8. New vessels lack tight junctions → fragile → **vitreous hemorrhage**
9. **Fibrovascular proliferation** → **tractional retinal detachment** → blindness

## Clinical Features

- **Early NPDR**: usually asymptomatic — detected ONLY on screening
- **Advanced NPDR**: may notice mild blurring
- **PDR**: floaters, visual field defects, sudden painless vision loss (vitreous hemorrhage)
- **Vitreous hemorrhage**: sudden onset of dark floaters, "red haze," or complete vision loss
- **Tractional retinal detachment**: progressive visual field loss, "curtain" over vision
- **DME**: central vision loss, difficulty reading, metamorphopsia (distorted images)

### Fundoscopy Findings — Key Lesions

| Finding | Appearance | Significance |
|---------|------------|--------------|
| **Microaneurysms** | Small red dots | Earliest fundoscopic sign |
| **Dot hemorrhages** | Small, round, deep retinal | Intraretinal bleeding |
| **Blot hemorrhages** | Larger, irregular, deep | More severe NPDR |
| **Flame hemorrhages** | Superficial, follow nerve fibers | Also in HTN retinopathy |
| **Hard exudates** | Yellow, waxy, well-defined | Lipid/protein deposits; ring pattern around macula |
| **Cotton wool spots** | Fluffy white patches | Nerve fiber infarcts (ischemia) |
| **Venous beading** | Sausage-like veins | Severe NPDR marker |
| **IRMA** | Intraretinal microvascular anomalies | Severe NPDR; pre-proliferative |
| **Neovascularization** | Fine, irregular new vessels | PDR hallmark; arise from disc or retina |

## Diagnosis

### Screening Methods
- **Dilated fundoscopy**: gold standard screening — performed by ophthalmologist
- **Fundus photography**: digital retinal imaging; enables telemedicine screening
- **Mydriatic vs non-mydriatic** cameras available for screening programs

### Advanced Imaging
- **Fluorescein angiography (FFA)**: IV fluorescein → photographs; shows:
  - Microaneurysms (hyperfluorescent dots)
  - Capillary non-perfusion areas (dark/ischemic zones)
  - Neovascularization (leakage)
  - Macular leakage patterns
- **Optical coherence tomography (OCT)**: cross-sectional retinal imaging
  - Quantifies macular thickness — **essential for DME diagnosis and monitoring**
  - Non-invasive, highly reproducible
- **OCT angiography (OCTA)**: non-invasive vascular imaging (no dye needed)
- **Ultra-widefield imaging**: captures peripheral retina (detects peripheral ischemia/NVE)

### Screening Schedule
- T1DM: start **5 years** after diagnosis, then annually
- T2DM: **at diagnosis**, then annually
- **Pregnancy**: screen before conception or 1st trimester, then each trimester
- More frequent if DR already detected

## Management

### Prevention & Risk Factor Control
- **Glycemic control**: HbA1c <7% (DCCT: 76% reduction in DR progression)
- **BP control**: <130/80 mmHg (UKPDS: 34% risk reduction)
- **Lipid management**: statins ± fenofibrate (ACCORD-Eye: fenofibrate ↓DR progression)
- **Regular screening**: catch early, treat early

### Mild–Moderate NPDR
- **Observation** with regular follow-up (annually or more frequent)
- Optimize glycemia, BP, lipids
- No laser or anti-VEGF needed unless DME present

### Severe NPDR / PDR
- **Panretinal photocoagulation (PRP)**: scatter laser burns to ischemic peripheral retina
  - Destroys ischemic retina → ↓VEGF production → regression of neovascularization
  - Side effects: peripheral visual field loss, reduced night vision, macular edema
- **Anti-VEGF intravitreal injections**: ranibizumab, aflibercept, bevacizumab
  - DRCR.net Protocol S: anti-VEGF non-inferior to PRP for PDR (with less visual field loss)
  - Increasingly used as primary treatment for PDR

### Diabetic Macular Edema (DME)
- **Anti-VEGF intravitreal injections** = FIRST-LINE (RISE, RIDE, VIVID, VISTA, Protocol T trials)
  - Aflibercept superior for worse baseline VA; all similar for mild DME
  - Monthly injections initially → treat-and-extend protocol
- **Focal/grid laser photocoagulation**: if anti-VEGF unavailable, or as adjunct
  - ETDRS study: laser ↓moderate vision loss by 50%
- **Intravitreal steroids** (dexamethasone implant — Ozurdex, fluocinolone acetonide — Iluvien)
  - For pseudophakic patients or refractory to anti-VEGF
  - Side effects: cataract progression, glaucoma

### Vitreous Hemorrhage / Tractional Retinal Detachment
- **Pars plana vitrectomy (PPV)**: non-clearing vitreous hemorrhage (>1 month), tractional RD involving macula
- Urgent if: combined tractional-rhegmatogenous RD, dense vitreous hemorrhage obscuring NVD

## Complications

- **Blindness**: preventable with screening and timely treatment — tragedy if missed
- **Vitreous hemorrhage**: recurrent if NV untreated
- **Tractional retinal detachment**: progressive, irreversible without surgery
- **Neovascular glaucoma (NVG)**: new vessels on iris → fibrovascular membrane blocks trabecular meshwork → raised IOP → painful blindness
- **Rubeosis iridis**: neovascularization of iris (precursor to NVG)
- **Treatment-related**: PRP → peripheral field loss; anti-VEGF → endophthalmitis (rare)
""",
    "exam": r"""# Diabetic Retinopathy — Exam Prep

## Quick Summary

Leading cause of preventable blindness (20–74y). NPDR: microaneurysms (earliest) → hemorrhages → exudates → cotton wool spots. Severe NPDR: 4-2-1 rule. PDR: neovascularization → vitreous hemorrhage → tractional RD. DME = MC cause of vision loss (any DR stage). Anti-VEGF = 1st line for DME. PRP for PDR. Screen annually.

## High Yield Points ★

- ★ **Microaneurysms** = earliest fundoscopic finding
- ★ **4-2-1 rule** for severe NPDR: hemorrhages in 4 quadrants, venous beading in 2, IRMA in 1
- ★ **Neovascularization** = hallmark of PDR (VEGF-driven from retinal ischemia)
- ★ **DME** = MC cause of visual impairment in DM — can occur at ANY DR stage
- ★ **Anti-VEGF** = first-line for DME (ranibizumab, aflibercept, bevacizumab)
- ★ **PRP (panretinal photocoagulation)** = standard treatment for PDR
- ★ **Hard exudates** = lipid deposits; **Cotton wool spots** = nerve fiber infarcts
- ★ **Duration of DM** = strongest risk factor for DR
- ★ **DCCT/UKPDS**: tight glycemic + BP control reduces DR progression significantly
- ★ **Neovascular glaucoma** = dreaded complication (new vessels block aqueous outflow → raised IOP)
- ★ **Pericyte loss** = earliest cellular/histologic change

## Mnemonics

- **NPDR features**: "MHEC" — Microaneurysms, Hemorrhages, Exudates (hard), Cotton wool spots
- **4-2-1 rule**: "4 quadrants Hemorrhage, 2 quadrants Veins, 1 quadrant IRMA = Severe NPDR"
- **PDR = VEGF = Vision-Endangering Growth Factor**
- **Screening**: "T1 = Five, T2 = First visit"

## Common MCQ Topics

1. Earliest fundoscopic finding in DR (microaneurysms)
2. 4-2-1 rule — what is severe NPDR?
3. DME treatment — first-line is anti-VEGF (not laser)
4. When to do PRP vs anti-VEGF
5. Screening schedule — T1DM vs T2DM
6. Neovascular glaucoma — mechanism and presentation
7. Hard exudates vs cotton wool spots — what do they represent?
"""
}

TOPICS["endocrinology/graves-disease"] = {
    "meta": """title: "Graves Disease"
slug: graves-disease
depth: "UG"
highYield: true
nmc_codes:
  - "IM10.7"
prerequisites:
  - "hyperthyroidism"
related_topics:
  - "thyroid-storm"
  - "hypothyroidism"
""",
    "explorer": r"""# Graves Disease — Explorer

## Overview

**Graves disease** is the most common cause of **hyperthyroidism** (60–80% of cases). It is an autoimmune disorder caused by **thyroid-stimulating immunoglobulins (TSI/TRAb)** that activate the TSH receptor, resulting in diffuse thyroid hyperplasia and excess thyroid hormone production. Peak incidence: women aged 20–40 years; F:M = 5–10:1.

## Key Points

- **Most common cause of hyperthyroidism** overall
- Autoimmune: TSH receptor-stimulating antibodies (TSI/TRAb)
- Classic triad: **hyperthyroidism + diffuse goiter + ophthalmopathy**
- Unique Graves features: **ophthalmopathy, pretibial myxedema, thyroid acropachy**
- RAIU scan: **diffusely increased uptake** (differentiates from thyroiditis, toxic nodule)
- Treatment options: antithyroid drugs (ATDs), radioactive iodine (RAI), surgery

## Definition & Classification

### Features Unique to Graves (vs general hyperthyroidism)

| Feature | Graves-Specific? |
|---------|-----------------|
| Diffuse goiter with bruit | Relatively specific |
| **Ophthalmopathy** | YES — unique to Graves |
| **Pretibial myxedema** | YES — unique to Graves |
| **Thyroid acropachy** | YES — unique to Graves (rarest) |
| Weight loss, tachycardia, tremor | Any cause of hyperthyroidism |

## Etiology & Pathophysiology

### Autoimmune Mechanism
- **TSI (thyroid-stimulating immunoglobulins)** = IgG antibodies that bind and activate TSH receptor
- → Continuous stimulation → diffuse thyroid hyperplasia + excess T3/T4 synthesis
- → TSH suppressed by negative feedback (but TSI is TSH-independent)
- **Genetic**: HLA-DR3, HLA-B8 association; polygenic susceptibility
- **Environmental triggers**: stress, infection, smoking, postpartum, high iodine

### Risk Factors
- Female sex (5–10× higher risk)
- Age 20–40 years
- Family history of autoimmune thyroid disease
- Other autoimmune conditions: T1DM, vitiligo, pernicious anemia, myasthenia gravis, celiac disease
- **Smoking**: especially worsens ophthalmopathy (strongest modifiable risk factor for GO)
- Postpartum period, psychological stress, high iodine intake (Jod-Basedow effect)

### Ophthalmopathy — Pathogenesis
- TSH receptors expressed on orbital fibroblasts and adipocytes
- TSI/TRAb activate these → inflammation → GAG (glycosaminoglycan) deposition → water retention
- → **Extraocular muscle enlargement** (especially inferior and medial recti)
- → **Orbital fat expansion** → increased orbital pressure
- → Proptosis, diplopia, optic nerve compression (sight-threatening)
- Can occur before, during, or AFTER treatment of hyperthyroidism
- **Active vs inactive phase**: treatment differs (anti-inflammatory in active; surgical in inactive)

### Pretibial Myxedema
- GAG deposition in dermis of pretibial skin
- Non-pitting, raised, waxy, orange-peel textured plaques
- Occurs in ~5% of Graves patients; usually with severe ophthalmopathy

## Clinical Features

### Hyperthyroidism Symptoms (present in all causes)
- Weight loss despite increased appetite, heat intolerance, excessive sweating
- Tremor (fine resting tremor of outstretched hands), anxiety, irritability, insomnia
- Palpitations, tachycardia, atrial fibrillation (especially elderly)
- Increased bowel frequency, diarrhea
- Menstrual irregularity (oligomenorrhea, amenorrhea)
- Proximal myopathy, hyperreflexia (brisk relaxation)
- Lid retraction, lid lag (thyroid hormone effect on Müller muscle — can occur in ANY hyperthyroidism)

### Graves-Specific Features
- **Diffuse, non-tender goiter** — smooth, symmetrical, often with audible **thyroid bruit** (increased vascularity)
- **Graves ophthalmopathy (GO)** — in ~50% clinically; subclinical in most
  - Lid retraction (Dalrymple sign) — most common eye sign
  - Lid lag on downward gaze (von Graefe sign)
  - **Proptosis/exophthalmos** — measured by Hertel exophthalmometer
  - Periorbital edema, chemosis (conjunctival edema)
  - Diplopia (extraocular muscle restriction — inferior > medial > superior > lateral rectus)
  - Exposure keratopathy (incomplete lid closure → corneal drying)
  - **Compressive optic neuropathy** — EMERGENCY (color vision loss, afferent pupillary defect, visual field defect)
  - **Clinical Activity Score (CAS)**: ≥3/7 = active disease (pain, redness, swelling, impaired function)
- **Pretibial myxedema (dermopathy)**: raised, non-pitting, skin-colored to pink-brown plaques on shins
- **Thyroid acropachy**: digital clubbing + periosteal new bone formation (extremely rare; most specific)
- **Onycholysis** (Plummer nails): separation of nail from nail bed

### Eye Signs Summary
- **Dalrymple sign**: upper lid retraction (sclera visible above iris)
- **Von Graefe sign**: lid lag on downward gaze
- **Stellwag sign**: infrequent blinking
- **Joffroy sign**: absent forehead wrinkling on upward gaze
- **Möbius sign**: poor convergence
- **NO SPECS classification**: Werner classification of severity

## Diagnosis

### Laboratory Tests
- **TSH**: suppressed (<0.1 mIU/L) — most sensitive screening test
- **Free T4**: elevated; free T3 may be elevated disproportionately (T3 thyrotoxicosis)
- **TSH receptor antibodies (TRAb/TSI)**: positive in >95% — diagnostic
  - TRAb includes both stimulating (TSI) and blocking antibodies
  - Useful for: diagnosis, predicting relapse, managing pregnancy, assessing neonatal risk
- **Anti-TPO antibodies**: often positive but not Graves-specific (also in Hashimoto)
- Other labs: mild normocytic anemia, ↓cholesterol, ↑ALP (bone), ↑calcium (mild)

### Imaging
- **Radioactive iodine uptake (RAIU) scan**: **diffusely increased uptake** (>35%)
  - Differentiates from: thyroiditis (low uptake), toxic multinodular goiter (patchy), toxic adenoma (focal hot nodule)
  - Not needed if classic presentation + positive TRAb
- **Thyroid ultrasound**: diffusely enlarged, hypoechoic, markedly increased vascularity
  - "**Thyroid inferno**" on color Doppler — characteristic of Graves
- **CT/MRI orbits**: for ophthalmopathy assessment
  - Extraocular muscle enlargement (muscle belly enlarged, tendon spared — vs orbital pseudotumor where tendon is involved)
  - Inferior and medial recti most commonly affected
  - Apical crowding → optic nerve compression

### Diagnosis — Putting It Together
- **Clinical**: hyperthyroidism + diffuse goiter + ophthalmopathy → Graves virtually certain
- **Confirm**: ↓TSH, ↑FT4, +TRAb
- **RAIU scan**: mainly when diagnosis unclear (differentiate from thyroiditis)

## Management

### Antithyroid Drugs (ATDs)
- **Methimazole (carbimazole)**: first-line in most situations
  - Longer half-life, once-daily dosing, fewer hepatotoxicity issues
  - Starting dose: 15–30 mg/day → titrate to maintain euthyroidism
  - **Titration regimen** (preferred) or **block-and-replace** (ATD + levothyroxine)
- **Propylthiouracil (PTU)**: preferred in:
  - **1st trimester pregnancy** (methimazole → aplasia cutis, choanal atresia)
  - **Thyroid storm** (also blocks peripheral T4 → T3 conversion)
- **Duration**: 12–18 months; remission rate ~50% (higher if: small goiter, mild disease, ↓TRAb)
- **Monitoring**: TFTs every 4–6 weeks initially, then every 3 months

### Side Effects of ATDs
- **Minor** (common): rash, urticaria, arthralgias, GI upset
- **Agranulocytosis** (0.2–0.5%): MOST SERIOUS — sore throat + fever → STOP drug → check WBC
  - Usually in first 3 months; cross-reactivity between MMI and PTU is rare
  - Warn all patients: seek medical attention immediately for sore throat/fever
- **Hepatotoxicity**: PTU → hepatocellular injury (worse); MMI → cholestatic (milder)
- **ANCA-positive vasculitis**: rare, with PTU

### Radioactive Iodine (RAI — I-131)
- **Definitive treatment**: most common approach in USA; single oral dose
- Destruction of thyroid tissue → hypothyroidism (desired outcome — then lifelong levothyroxine)
- **Contraindications**: pregnancy/breastfeeding, severe active ophthalmopathy, inability to follow radiation safety
- **Worsens ophthalmopathy** → give glucocorticoid prophylaxis if moderate GO (prednisone 0.3–0.5 mg/kg starting 1–3 days after RAI, taper over 3 months)
- Pre-treat with ATDs if severe hyperthyroidism (stop 3–7 days before RAI)

### Surgery (Total/Near-Total Thyroidectomy)
- **Indications**: large goiter with compressive symptoms, suspicious nodule, severe/active ophthalmopathy, ATD failure/adverse effects, patient preference (rapid cure), coexisting hyperparathyroidism
- **Pre-operative preparation**:
  - Euthyroid with ATDs first
  - Beta-blocker for rate control
  - **Lugol iodine or SSKI** (potassium iodide) for 7–10 days pre-op → ↓thyroid vascularity (Wolff-Chaikoff effect)
- **Complications**: recurrent laryngeal nerve injury (hoarseness), hypoparathyroidism (transient or permanent), bleeding/hematoma (airway emergency), hypothyroidism (expected)

### Beta-Blockers (Adjunctive)
- **Propranolol**: preferred — blocks β-adrenergic symptoms + inhibits peripheral T4 → T3 conversion
- Rapid symptomatic relief: ↓tachycardia, tremor, anxiety, sweating
- NOT a definitive treatment — use while awaiting ATD/RAI/surgery effect
- Alternatives: atenolol, metoprolol (if propranolol contraindicated)

### Ophthalmopathy Management
- **All patients**: smoking cessation (critical), artificial tears, sunglasses, elevate head of bed
- **Mild/inactive GO**: observation, lubricants
- **Moderate-severe ACTIVE GO** (CAS ≥3):
  - **IV methylprednisolone pulses** (500 mg weekly × 6, then 250 mg weekly × 6) — EUGOGO protocol
  - **Teprotumumab** (anti-IGF-1R monoclonal antibody) — FDA approved; reduces proptosis and diplopia
  - **Mycophenolate mofetil**: steroid-sparing option
  - **Orbital radiotherapy**: adjunct to steroids in refractory cases
- **Sight-threatening GO** (compressive optic neuropathy):
  - **EMERGENCY**: IV methylprednisolone → urgent surgical orbital decompression if no response in 1–2 weeks
- **Stable INACTIVE GO**: rehabilitative surgery (sequence: decompression → strabismus → lid)

## Complications

- **Thyroid storm** — life-threatening thyrotoxic crisis (see thyroid-storm topic)
- **Atrial fibrillation** — especially in elderly; may be sole presentation
- **Osteoporosis** — chronic thyrotoxicosis accelerates bone turnover
- **Heart failure** — high-output initially; dilated cardiomyopathy if prolonged
- **Ophthalmopathy** — corneal ulceration, optic neuropathy, blindness
- **Agranulocytosis** from ATDs — can be fatal if missed
- **Neonatal thyrotoxicosis** — TRAb crosses placenta → fetal/neonatal hyperthyroidism
- **Thyroid dermopathy complications** — cosmetic, rarely functional
""",
    "exam": r"""# Graves Disease — Exam Prep

## Quick Summary

MC cause of hyperthyroidism. Autoimmune — TSI/TRAb activates TSH receptor. Triad: hyperthyroidism + diffuse goiter + ophthalmopathy. Unique features: ophthalmopathy, pretibial myxedema, acropachy. Dx: ↓TSH, ↑FT4, +TRAb, diffuse RAIU uptake. Tx: methimazole (1st line), RAI (definitive), or surgery. PTU in 1st trimester + thyroid storm.

## High Yield Points ★

- ★ **TSI/TRAb** = diagnostic antibody — stimulates TSH receptor (>95% sensitive)
- ★ **Ophthalmopathy** = unique to Graves (not other hyperthyroidism causes)
- ★ **Methimazole** = first-line ATD; **PTU** = 1st trimester pregnancy + thyroid storm
- ★ **Agranulocytosis** (0.2–0.5%) = most serious ATD side effect — sore throat + fever → STOP drug, check WBC
- ★ **RAI worsens ophthalmopathy** → glucocorticoid cover if moderate GO
- ★ **RAIU scan patterns**: Graves = diffuse ↑; Thyroiditis = ↓; Toxic adenoma = focal hot; TMG = patchy
- ★ **Smoking** = strongest modifiable risk factor for Graves ophthalmopathy
- ★ **Inferior rectus** = most commonly affected extraocular muscle in GO
- ★ **Teprotumumab** (anti-IGF-1R) = newer treatment for moderate-severe GO
- ★ **Thyroid inferno** on Doppler = characteristic of Graves (↑vascularity)
- ★ **Pretibial myxedema**: non-pitting, waxy lesion on shins — GAG deposition

## Mnemonics

- **Graves triad**: "GOT" — Goiter, Ophthalmopathy, Thyrotoxicosis
- **Eye signs "DVS"**: Dalrymple (lid retraction), Von Graefe (lid lag), Stellwag (no blink)
- **PTU in Pregnancy**: "PTU = Pregnancy Trimester Uno"
- **Graves-only features "POA"**: Pretibial myxedema, Ophthalmopathy, Acropachy
- **ATD remission predictors**: "Small Mild Dropping" — Small goiter, Mild disease, Dropping TRAb

## Common MCQ Topics

1. Most common cause of hyperthyroidism (Graves)
2. RAIU scan patterns in different thyroid conditions
3. ATD choice in pregnancy (PTU 1st trimester → switch to MMI in 2nd)
4. Agranulocytosis — presentation, immediate management
5. Ophthalmopathy treatment — when steroids vs teprotumumab vs surgery
6. Thyroid storm management (PTU, iodine, steroids, beta-blocker)
7. TRAb utility — diagnosis, pregnancy monitoring, neonatal risk
"""
}

TOPICS["endocrinology/hyperthyroidism"] = {
    "meta": """title: "Hyperthyroidism"
slug: hyperthyroidism
depth: "UG"
highYield: true
nmc_codes:
  - "IM10.5"
  - "IM10.6"
prerequisites:
  - "thyroid-physiology"
related_topics:
  - "graves-disease"
  - "thyroid-storm"
  - "hypothyroidism"
""",
    "explorer": r"""# Hyperthyroidism — Explorer

## Overview

**Hyperthyroidism** refers to excess thyroid hormone production by the thyroid gland, while **thyrotoxicosis** is the clinical syndrome of excess circulating thyroid hormones (from any source). Graves disease is the most common cause overall. It affects ~1.3% of the population, with a strong female predominance (F:M = 5–10:1).

## Key Points

- **Graves disease** = MC cause of hyperthyroidism (60–80%)
- **Toxic multinodular goiter** = MC cause in elderly/iodine-deficient areas
- Key labs: **↓TSH** (most sensitive) + **↑FT4** (± ↑FT3)
- RAIU scan differentiates: Graves (diffuse ↑), toxic adenoma (focal ↑), thyroiditis (↓)
- Treatment: antithyroid drugs, radioactive iodine, surgery, beta-blockers (symptomatic)
- **Thyroid storm** = life-threatening complication (see separate topic)

## Definition & Classification

### Hyperthyroidism vs Thyrotoxicosis
- **Hyperthyroidism**: thyroid gland actively produces excess hormone (↑synthesis)
- **Thyrotoxicosis**: clinical syndrome from any excess thyroid hormone (includes exogenous/thyroiditis)
- All hyperthyroidism causes thyrotoxicosis, but not all thyrotoxicosis is from hyperthyroidism

### Causes — By RAIU Pattern

| RAIU Pattern | Causes |
|-------------|--------|
| **↑ Diffuse** | Graves disease, TSH-secreting pituitary adenoma, hCG-mediated (molar pregnancy) |
| **↑ Focal/Patchy** | Toxic adenoma (single hot nodule), Toxic multinodular goiter |
| **↓ or Absent** | Subacute thyroiditis (de Quervain), painless/postpartum thyroiditis, factitious, struma ovarii, amiodarone type 2 |

### Subclinical Hyperthyroidism
- ↓TSH with normal FT4 and FT3
- May progress to overt; associated with AF and osteoporosis (especially if TSH <0.1)

## Etiology & Pathophysiology

### Graves Disease (60–80%)
- Autoimmune: TSI/TRAb stimulates TSH receptor → diffuse hyperplasia → ↑T4/T3
- See dedicated topic: graves-disease

### Toxic Multinodular Goiter (Plummer Disease)
- Autonomously functioning nodules — independent of TSH
- MC cause in elderly and iodine-deficient regions
- Gradual onset; less likely to have ophthalmopathy

### Toxic Adenoma (Single Hot Nodule)
- Somatic activating mutation of TSH receptor
- Autonomous T4/T3 production; suppresses surrounding thyroid tissue
- RAIU: focal uptake in nodule, suppressed surrounding gland

### Thyroiditis (Destructive Thyrotoxicosis)
- **Subacute (de Quervain)**: viral prodrome → painful tender thyroid → transient thyrotoxicosis → hypothyroid → recovery
- **Painless/silent**: autoimmune; similar biphasic course but NO pain
- **Postpartum thyroiditis**: within 12 months of delivery; painless; anti-TPO+
- Mechanism: thyroid follicular destruction → preformed hormone release (NOT new synthesis)
- RAIU: LOW (gland is not making new hormone; just releasing stored hormone)
- Treatment: beta-blockers only (ATDs useless — no new synthesis occurring)

### Other Causes
- **Amiodarone-induced thyrotoxicosis**: Type 1 (excess synthesis — underlying thyroid disease + iodine load) vs Type 2 (destructive thyroiditis)
- **Factitious thyrotoxicosis**: exogenous T4/T3 ingestion; thyroglobulin LOW
- **Struma ovarii**: ovarian teratoma with ectopic thyroid tissue secreting T4
- **TSH-secreting pituitary adenoma**: rare; ↑TSH + ↑FT4 (inappropriate TSH)
- **hCG-mediated**: hyperemesis gravidarum, hydatidiform mole, choriocarcinoma (hCG cross-reacts with TSH receptor)

## Clinical Features

### Symptoms (hypermetabolic state)
- **Weight loss** despite increased appetite (rarely weight gain — hyperphagia exceeds metabolic rate)
- **Heat intolerance**, excessive sweating, warm moist skin
- **Tremor**: fine resting tremor of outstretched hands
- **Anxiety**, irritability, emotional lability, insomnia, poor concentration
- **Palpitations**, tachycardia, **atrial fibrillation** (10–15%, especially elderly)
- **Increased bowel frequency** (not true diarrhea usually)
- **Menstrual irregularity**: oligomenorrhea, infertility
- **Dyspnea**: on exertion (due to respiratory muscle weakness)
- **Fatigue**, proximal muscle weakness

### Signs
- **Tachycardia**, wide pulse pressure, systolic hypertension
- **AF**: irregularly irregular pulse (may be sole presentation in elderly — "apathetic thyrotoxicosis")
- **Goiter**: diffuse (Graves), multinodular, or single nodule
- **Eye signs**: lid retraction, lid lag (both can occur in ANY hyperthyroidism — sympathetic stimulation of Müller muscle)
- **Skin**: warm, moist, smooth; palmar erythema, onycholysis
- **Hair**: fine, thin hair; diffuse hair loss
- **Reflexes**: hyperreflexia with rapid relaxation phase
- **Proximal myopathy**: difficulty rising from chair, climbing stairs

### Special Populations
- **Elderly**: "apathetic thyrotoxicosis" — AF, weight loss, depression, CCF without classic hyperadrenergic symptoms
- **Children**: hyperactivity, poor school performance, behavioral changes, accelerated growth

## Diagnosis

### Step 1: Serum TSH (Most Sensitive Screening Test)
- **TSH suppressed** (<0.1 mIU/L) in overt hyperthyroidism
- If TSH low → measure FT4 and FT3

### Step 2: Free T4 and Free T3
- **↑FT4**: overt hyperthyroidism
- **Normal FT4 + ↑FT3**: T3 thyrotoxicosis (seen in early Graves, toxic adenoma)
- **↓TSH + normal FT4 + normal FT3**: subclinical hyperthyroidism

### Step 3: Determine Etiology
- **TRAb/TSI**: positive in Graves
- **Anti-TPO**: positive in autoimmune thyroiditis and some Graves
- **ESR/CRP**: elevated in subacute thyroiditis
- **Thyroglobulin**: suppressed in factitious thyrotoxicosis (patient taking T4/T3)

### Step 4: RAIU Scan (when etiology unclear)
- **Diffuse ↑ uptake**: Graves
- **Focal hot nodule with cold surrounding**: toxic adenoma
- **Patchy uptake**: toxic MNG
- **Low/absent uptake**: thyroiditis, factitious, struma ovarii

### Additional Tests
- **CBC**: mild normocytic anemia, neutropenia (in Graves)
- **LFTs**: elevated ALP (bone), mild transaminitis
- **Cholesterol**: ↓ total cholesterol
- **Calcium**: mild hypercalcemia (↑bone turnover)
- **ECG**: sinus tachycardia, AF

## Management

### General Principles
1. **Beta-blocker** for immediate symptom relief (all patients)
2. **Determine etiology** (guides definitive treatment)
3. **Definitive treatment**: ATDs, RAI, or surgery (based on cause, patient factors)
4. **Monitor and treat complications** (AF, osteoporosis, ophthalmopathy)

### Beta-Blockers
- **Propranolol** preferred: non-selective β-blocker + inhibits T4 → T3 conversion
- Dose: 20–40 mg q6–8h; titrate to HR <90 bpm
- Alternatives: atenolol 50–100 mg/day; diltiazem if beta-blocker contraindicated
- Continue until euthyroid on definitive therapy

### Antithyroid Drugs (for Graves — primary hyperthyroidism)
- **Methimazole**: first-line (except 1st trimester pregnancy)
- **PTU**: 1st trimester, thyroid storm
- Mechanism: inhibit thyroid peroxidase (TPO) → ↓organification + coupling → ↓T4/T3 synthesis
- PTU additionally: inhibits peripheral T4 → T3 conversion (deiodinase)
- Duration: 12–18 months; ~50% long-term remission
- Side effects: rash (common), agranulocytosis (rare, serious), hepatotoxicity

### Radioactive Iodine (I-131)
- Definitive for Graves, toxic MNG, toxic adenoma
- Contraindicated: pregnancy, breastfeeding, severe active ophthalmopathy
- Results in hypothyroidism (expected) → lifelong levothyroxine

### Surgery
- Total thyroidectomy: Graves (large goiter, suspicious nodule, severe GO, failed ATD)
- Hemithyroidectomy: toxic adenoma (may preserve contralateral lobe)
- Subtotal thyroidectomy: toxic MNG
- Risks: RLN injury, hypoparathyroidism, bleeding

### Thyroiditis Management
- **NO antithyroid drugs** (not making new hormone; just releasing stored)
- Beta-blockers for symptom control during thyrotoxic phase
- **Subacute thyroiditis**: NSAIDs for pain; prednisolone if severe
- Monitor: thyrotoxic → hypothyroid (may need temporary levothyroxine) → recovery

### Special Situations
- **Amiodarone-induced**: Type 1 → ATDs ± perchlorate; Type 2 → steroids; Mixed → both
- **Pregnancy**: PTU 1st trimester → switch to methimazole 2nd trimester; lowest effective dose; monitor TRAb (neonatal risk)
- **Subclinical hyperthyroidism**: treat if TSH <0.1 + age >65 or CV risk factors

## Complications

- **Thyroid storm**: life-threatening (mortality 20–30%) — see thyroid-storm topic
- **Atrial fibrillation**: thromboembolism risk → anticoagulate per CHA₂DS₂-VASc
- **Heart failure**: high-output → dilated cardiomyopathy
- **Osteoporosis**: chronic thyrotoxicosis → ↑bone resorption → fracture risk
- **Thyrotoxic periodic paralysis**: sudden hypokalemia + paralysis (more common in Asian males)
- **Ophthalmopathy**: Graves-specific; sight-threatening in severe cases
- **Myxedema coma**: if overcorrected → iatrogenic hypothyroidism
""",
    "exam": r"""# Hyperthyroidism — Exam Prep

## Quick Summary

Excess thyroid hormone — Graves MC cause (60–80%). Labs: ↓TSH + ↑FT4/FT3. RAIU differentiates: Graves (diffuse ↑), toxic adenoma (focal), thyroiditis (↓). Treat: beta-blockers (symptoms) + definitive (ATDs/RAI/surgery). Thyroiditis: NO ATDs (just releasing stored hormone). Thyroid storm = emergency.

## High Yield Points ★

- ★ **TSH** = most sensitive screening test for hyperthyroidism
- ★ **Graves** = MC cause; **toxic MNG** = MC in elderly/iodine deficiency
- ★ **RAIU scan**: Graves = diffuse ↑; thyroiditis = ↓; toxic adenoma = focal hot + cold surrounding
- ★ **Thyroiditis**: do NOT give ATDs — no new synthesis occurring; beta-blockers only
- ★ **Methimazole** first-line; **PTU** = 1st trimester + thyroid storm
- ★ **Agranulocytosis**: sore throat + fever on ATDs → STOP drug, check WBC immediately
- ★ **Propranolol** preferred beta-blocker — also inhibits T4 → T3 conversion
- ★ **T3 thyrotoxicosis**: normal FT4 but ↑FT3 (early Graves, toxic adenoma)
- ★ **Factitious thyrotoxicosis**: ↓thyroglobulin (patient taking T4) + ↓RAIU
- ★ **Apathetic thyrotoxicosis in elderly**: AF, weight loss, depression — no classic hyperadrenergic symptoms
- ★ **Amiodarone**: Type 1 (synthesis ↑) vs Type 2 (destructive) — different treatment

## Mnemonics

- **Causes "GIST"**: Graves, Inflammation (thyroiditis), Single toxic adenoma, Toxic MNG
- **Symptoms "THYROID"**: Tremor, Heart racing, Yelling (anxiety), Restless, Intolerant (heat), Overactive bowel, Decreased weight
- **RAIU patterns**: "Graves Goes Up, Thyroiditis Goes Down"
- **ATD side effects**: "ARG" — Agranulocytosis, Rash, GI upset

## Common MCQ Topics

1. MC cause of hyperthyroidism (Graves)
2. RAIU scan interpretation (3 patterns)
3. Thyroiditis management (why NO ATDs)
4. ATD choice in pregnancy
5. Apathetic thyrotoxicosis in elderly
6. Factitious thyrotoxicosis clues (↓thyroglobulin, ↓RAIU)
7. Amiodarone thyrotoxicosis — Type 1 vs Type 2
8. Subclinical hyperthyroidism — when to treat
"""
}

TOPICS["endocrinology/hypothyroidism"] = {
    "meta": """title: "Hypothyroidism"
slug: hypothyroidism
depth: "UG"
highYield: true
nmc_codes:
  - "IM10.8"
  - "IM10.9"
prerequisites:
  - "thyroid-physiology"
related_topics:
  - "hyperthyroidism"
  - "graves-disease"
""",
    "explorer": r"""# Hypothyroidism — Explorer

## Overview

**Hypothyroidism** is the most common thyroid disorder, characterized by insufficient thyroid hormone production or action. **Hashimoto thyroiditis** (chronic autoimmune thyroiditis) is the MC cause in iodine-sufficient areas, while **iodine deficiency** remains the MC cause worldwide. Prevalence: ~5% overt, ~10% subclinical; F:M = 5–8:1.

## Key Points

- **Hashimoto thyroiditis** = MC cause in iodine-sufficient regions (anti-TPO, anti-thyroglobulin antibodies)
- **Iodine deficiency** = MC cause worldwide
- Labs: **↑TSH** (most sensitive) + **↓FT4**
- Treatment: **levothyroxine** (synthetic T4) — lifelong replacement
- **Myxedema coma** = life-threatening emergency (severe hypothyroidism + precipitant)
- **Subclinical hypothyroidism**: ↑TSH + normal FT4 — treat if TSH >10 or symptomatic
- Screen in: pregnancy, women >60, Down/Turner syndrome, post-RAI/surgery

## Definition & Classification

### Primary vs Secondary vs Tertiary

| Type | Level | TSH | FT4 | Cause |
|------|-------|-----|-----|-------|
| **Primary** (95%) | Thyroid | ↑ | ↓ | Hashimoto, iodine deficiency, post-RAI, post-surgery |
| **Secondary** | Pituitary | ↓/normal | ↓ | Pituitary tumor, Sheehan, surgery |
| **Tertiary** | Hypothalamus | ↓/normal | ↓ | Hypothalamic lesion |
| **Peripheral** | Tissue | Variable | Variable | Consumptive (hemangioma — ↑type 3 deiodinase) |

### Subclinical Hypothyroidism
- ↑TSH (4.5–10 mIU/L) with normal FT4
- ~2–5% annual progression to overt hypothyroidism (higher if anti-TPO+)
- Associated with dyslipidemia, CV risk (controversial at lower TSH elevations)

## Etiology & Pathophysiology

### Primary Hypothyroidism — Causes
- **Hashimoto thyroiditis** (chronic lymphocytic thyroiditis)
  - Autoimmune destruction of thyroid follicular cells
  - **Anti-TPO** (most sensitive) and **anti-thyroglobulin** antibodies
  - Histology: lymphocytic infiltration, germinal centers, Hürthle cell metaplasia
  - ↑Risk of thyroid lymphoma (MALT lymphoma)
  - Association: other autoimmune diseases (T1DM, Addison, vitiligo, pernicious anemia)
- **Iodine deficiency**: worldwide MC cause; endemic goiter, cretinism (neonates)
- **Post-RAI**: expected outcome of radioactive iodine treatment for Graves
- **Post-thyroidectomy**: depends on extent of surgery
- **Medications**: lithium (inhibits T4 release), amiodarone (iodine excess — Wolff-Chaikoff effect + direct toxicity), interferon-α, tyrosine kinase inhibitors, checkpoint inhibitors
- **Subacute thyroiditis**: transient hypothyroid phase (after thyrotoxic phase)
- **Congenital hypothyroidism**: thyroid dysgenesis (MC: ectopic sublingual thyroid), dyshormonogenesis

### Pathophysiology
- ↓T4/T3 → ↓metabolic rate → accumulation of glycosaminoglycans (GAGs) in tissues → myxedema
- ↑TSH (loss of negative feedback) — distinguishing feature of primary hypothyroidism
- ↓T4 → ↑TRH → ↑prolactin (TRH stimulates prolactin) → galactorrhea, menstrual irregularity
- ↓metabolic rate → ↓LDL receptor expression → hypercholesterolemia

## Clinical Features

### Symptoms (insidious onset — often missed)
- **Fatigue**, lethargy, excessive sleepiness, weakness
- **Cold intolerance**, decreased sweating
- **Weight gain** (modest — 5–10 kg; mostly fluid, not fat)
- **Constipation**
- **Dry skin**, brittle nails, hair loss (lateral 1/3 eyebrow loss — "Queen Anne sign")
- **Menstrual irregularity**: menorrhagia (early), oligomenorrhea (severe), infertility
- **Depression**, cognitive slowing, poor memory, "brain fog"
- **Hoarseness** (vocal cord edema)
- **Myalgias**, arthralgias, carpal tunnel syndrome
- **Decreased libido**

### Signs
- **Bradycardia**, diastolic hypertension (↑SVR), narrow pulse pressure
- **Periorbital edema**, puffy face ("myxedematous facies")
- **Non-pitting edema** (myxedema — GAG deposition, not fluid overload)
- **Dry, cool, rough skin**; yellow tinge (carotenemia — ↓conversion of carotene to vitamin A)
- **Hair**: coarse, brittle, diffuse thinning; loss of outer 1/3 of eyebrows
- **Goiter**: present in Hashimoto (may be absent in atrophic thyroiditis)
- **Delayed relaxation of deep tendon reflexes** ("hung-up" reflexes) — classic exam finding
- **Tongue enlargement** (macroglossia)
- **Pericardial effusion**: low voltage on ECG, enlarged cardiac silhouette

### Special Populations
- **Neonates/infants (cretinism)**: intellectual disability, short stature, coarse facies, umbilical hernia, delayed fontanelle closure, feeding difficulties → screen with neonatal TSH
- **Elderly**: cognitive decline may mimic dementia → always check TSH
- **Pregnancy**: ↑miscarriage, preeclampsia, placental abruption, low birth weight; fetal neurological impairment

## Diagnosis

### Primary Workup
- **TSH**: elevated (most sensitive test for PRIMARY hypothyroidism)
- **Free T4**: low (overt) or normal (subclinical)
- **Anti-TPO antibodies**: positive in Hashimoto (>90%) — confirms autoimmune etiology
- **Anti-thyroglobulin antibodies**: less sensitive; may be sole positive antibody in some

### Additional Labs
- **Lipid panel**: ↑total cholesterol, ↑LDL (↓LDL receptor expression)
- **CBC**: normocytic anemia (or macrocytic if concurrent B12 deficiency — autoimmune polyglandular)
- **CK**: elevated (hypothyroid myopathy)
- **Prolactin**: may be mildly elevated (↑TRH stimulates prolactin)
- **Hyponatremia**: dilutional (↓free water clearance — ↑ADH)
- **ECG**: bradycardia, low voltage, T wave changes, prolonged QT

### Central Hypothyroidism (Secondary/Tertiary)
- **TSH normal or LOW** with **low FT4** → suspect pituitary/hypothalamic cause
- **Do NOT rely on TSH alone** — will miss central hypothyroidism
- MRI pituitary/hypothalamus, anterior pituitary function panel
- **Rule out adrenal insufficiency BEFORE starting levothyroxine** (T4 increases cortisol metabolism → adrenal crisis if underlying Addison)

### Imaging
- **Ultrasound**: heterogeneous, hypoechoic gland in Hashimoto; atrophic in end-stage
- **RAIU scan**: generally not needed for hypothyroidism diagnosis

## Management

### Levothyroxine (Synthetic T4) — Mainstay
- **Dose**: 1.6 μg/kg/day (adults); start lower in elderly/cardiac disease (25–50 μg/day)
- **Administration**: empty stomach, 30–60 min before breakfast; avoid co-administration with calcium, iron, PPIs, cholestyramine, soy (↓absorption)
- **Monitoring**: TSH at 6–8 weeks after initiation/dose change → adjust dose
- **Target TSH**: 0.5–2.5 mIU/L (lower half of normal range for most)
- **Pregnancy**: ↑dose by ~30% (↑TBG, ↑volume of distribution); target TSH <2.5 (1st trimester), <3.0 (2nd/3rd)
- **Lifelong therapy** in most cases (Hashimoto, post-RAI, post-surgery)
- **Over-replacement risks**: AF, osteoporosis (especially postmenopausal women)

### Subclinical Hypothyroidism — When to Treat
- **TSH >10 mIU/L**: treat all
- **TSH 4.5–10**: treat if — symptomatic, anti-TPO+, pregnancy/planning pregnancy, dyslipidemia, goiter
- **Monitoring**: if not treating, recheck TSH in 6–12 months

### Myxedema Coma — Emergency Management
- **IV levothyroxine** loading dose (200–400 μg) → then 50–100 μg/day IV
- ± **IV liothyronine (T3)** 5–20 μg q8h (faster onset)
- **IV hydrocortisone 100 mg q8h** (rule out concurrent adrenal insufficiency)
- **Supportive**: passive rewarming (NOT active — causes vasodilation → shock), IV fluids, ventilatory support, correct hyponatremia, glucose
- ICU admission, cardiac monitoring
- **Precipitants**: infection (MC), surgery, cold exposure, sedatives, CVA, trauma

### Special Situations
- **Central hypothyroidism**: dose levothyroxine by FT4 levels (not TSH); check cortisol first
- **Post-thyroidectomy**: start levothyroxine immediately post-op
- **Drug-induced**: lithium → check TFTs regularly; may need levothyroxine while continuing lithium

## Complications

- **Myxedema coma**: life-threatening — hypothermia, altered consciousness, hypotension, hyponatremia, hypoglycemia; mortality 30–60%
- **Cardiovascular**: accelerated atherosclerosis (↑LDL), pericardial effusion, diastolic heart failure
- **Infertility, recurrent miscarriage**: untreated hypothyroidism in women
- **Cretinism**: iodine deficiency/congenital hypothyroidism → irreversible intellectual disability
- **Obstructive sleep apnea**: due to macroglossia, soft tissue edema
- **Hashimoto → thyroid lymphoma**: rare; primary thyroid MALT lymphoma (suspect if rapidly enlarging goiter in Hashimoto)
- **Rhabdomyolysis**: severe hypothyroid myopathy (rare)
- **Adrenal crisis**: if levothyroxine started without ruling out/treating concurrent adrenal insufficiency
""",
    "exam": r"""# Hypothyroidism — Exam Prep

## Quick Summary

MC thyroid disorder. Hashimoto = MC cause (iodine-sufficient); iodine deficiency = MC worldwide. Labs: ↑TSH + ↓FT4 (primary). Treatment: levothyroxine (lifelong). Myxedema coma = emergency → IV T4 + T3 + hydrocortisone + supportive. Anti-TPO = most sensitive Hashimoto antibody. Always rule out adrenal insufficiency before starting T4 in central hypothyroidism.

## High Yield Points ★

- ★ **TSH** = most sensitive test for PRIMARY hypothyroidism (↑TSH)
- ★ **Anti-TPO** = most sensitive antibody for Hashimoto (>90%)
- ★ **Hashimoto histology**: lymphocytic infiltration + germinal centers + Hürthle cells
- ★ **Delayed relaxation of DTRs** = classic exam finding
- ★ **Lateral 1/3 eyebrow loss** (Queen Anne sign) — specific for hypothyroidism
- ★ **Levothyroxine**: empty stomach, avoid calcium/iron/PPIs; monitor TSH at 6–8 weeks
- ★ **Myxedema coma**: IV T4 + IV hydrocortisone + passive rewarming + ICU
- ★ **Subclinical**: treat if TSH >10, or symptomatic/anti-TPO+/pregnant
- ★ **Central hypothyroidism**: normal/↓TSH + ↓FT4 — monitor by FT4 (not TSH)
- ★ **Rule out adrenal insufficiency** before starting T4 (cortisol cleared faster → crisis)
- ★ **Hashimoto → MALT lymphoma**: rapidly enlarging goiter in long-standing Hashimoto
- ★ **Pregnancy**: ↑T4 dose ~30%; target TSH <2.5 (1st trimester)

## Mnemonics

- **Hypothyroid symptoms "SLUGGISH"**: Sleepiness, Loss of hair, Unusually dry skin, Gained weight, Goiter, Intolerance to cold, Slow HR, Hung-up reflexes
- **Myxedema coma treatment**: "THAWS" — Thyroid hormone IV, Hydrocortisone, Active monitoring (ICU), Warmth (passive), Supportive care
- **Hashimoto associations**: "Type 1-2-3" — T1DM, Addison, Pernicious anemia (autoimmune polyglandular)

## Common MCQ Topics

1. MC cause of hypothyroidism (Hashimoto vs iodine deficiency — depends on region)
2. Anti-TPO antibody significance
3. Levothyroxine dosing and drug interactions
4. Myxedema coma — precipitants and management
5. Subclinical hypothyroidism — when to treat
6. Central vs primary hypothyroidism differentiation
7. Hypothyroidism in pregnancy — target TSH, dose adjustment
8. Why check cortisol before starting T4 in panhypopituitarism
"""
}

TOPICS["endocrinology/insulin-therapy"] = {
    "meta": """title: "Insulin Therapy"
slug: insulin-therapy
depth: "UG"
highYield: true
nmc_codes:
  - "IM11.8"
  - "IM11.9"
prerequisites:
  - "diabetes-mellitus"
  - "diabetes-mellitus-type-1"
related_topics:
  - "diabetic-ketoacidosis"
  - "diabetes-mellitus-type-2"
""",
    "explorer": r"""# Insulin Therapy — Explorer

## Overview

**Insulin** is the cornerstone of T1DM management and an important component in T2DM when oral agents fail. Understanding insulin types, regimens, dosing, and complications is essential for clinical practice. Modern insulin therapy aims to mimic physiological insulin secretion through basal-bolus regimens.

## Key Points

- **Absolutely required in T1DM** (no endogenous insulin production)
- **T2DM**: added when OHAs fail to achieve glycemic targets (HbA1c >9% or symptomatic hyperglycemia)
- Insulin types: rapid-acting, short-acting, intermediate-acting, long-acting, premixed
- **Basal-bolus regimen**: best mimics physiology (basal = long-acting + bolus = rapid at meals)
- **Hypoglycemia** = most common and dangerous complication of insulin therapy
- **Lipodystrophy**: lipohypertrophy at injection sites — rotate sites
- Total daily dose: ~0.5–1.0 U/kg/day (T1DM: ~0.5; T2DM: 0.5–1.0+)

## Definition & Classification

### Insulin Types

| Type | Examples | Onset | Peak | Duration | Appearance |
|------|---------|-------|------|----------|------------|
| **Rapid-acting** | Lispro, Aspart, Glulisine | 5–15 min | 1–2 h | 3–5 h | Clear |
| **Short-acting** | Regular (soluble) | 30–60 min | 2–3 h | 6–8 h | Clear |
| **Intermediate** | NPH (isophane) | 2–4 h | 4–10 h | 12–18 h | Cloudy |
| **Long-acting** | Glargine, Detemir | 1–2 h | Minimal/no peak | 18–24+ h | Clear |
| **Ultra-long** | Degludec | 1 h | No peak | >42 h | Clear |
| **Premixed** | 70/30, 50/50, NovoMix | Biphasic | Biphasic | Variable | Cloudy |

### Key Distinctions
- **Clear vs cloudy**: ALL clear EXCEPT NPH and premixed (contain protamine — cloudy)
- **Peakless**: glargine, detemir, degludec — lower hypoglycemia risk (especially nocturnal)
- **Regular insulin**: only insulin given IV (for DKA, perioperative, insulin infusions)

## Etiology & Pathophysiology

### Physiological Insulin Secretion
- **Basal secretion**: continuous low-level secretion (suppresses hepatic glucose production) — ~50% of daily insulin
- **Bolus/prandial secretion**: meal-stimulated spike (promotes glucose uptake) — ~50% of daily insulin
- **First phase**: rapid spike within 5–10 min (preformed insulin granules)
- **Second phase**: sustained release over 1–2 h (newly synthesized insulin)

### Insulin Mechanism of Action
- Binds insulin receptor (tyrosine kinase) → autophosphorylation → IRS → PI3K pathway
- ↑GLUT4 translocation (muscle, adipose) → ↑glucose uptake
- ↑Glycogenesis, ↑lipogenesis, ↑protein synthesis
- ↓Gluconeogenesis, ↓glycogenolysis, ↓lipolysis, ↓proteolysis

### Why T1DM Needs Insulin
- Autoimmune β-cell destruction → absolute insulin deficiency
- Without insulin: lipolysis → FFA → ketogenesis → DKA
- **CANNOT survive without exogenous insulin**

### When T2DM Needs Insulin
- Progressive β-cell failure over time ("glucotoxicity")
- HbA1c >9% at diagnosis with symptoms (may start insulin initially, then step down)
- Failure of triple OHA therapy
- Acute illness, surgery, pregnancy (GDM not controlled with metformin)

## Clinical Features

### Indications for Insulin

| Setting | Indication |
|---------|-----------|
| **T1DM** | Always — from diagnosis |
| **T2DM** | OHA failure, HbA1c >9% with symptoms, acute illness, perioperative |
| **DKA/HHS** | IV regular insulin infusion |
| **Gestational DM** | When diet + metformin fail |
| **Pregnancy (pre-existing DM)** | Switch all OHAs to insulin (except metformin — context-dependent) |
| **Steroid-induced hyperglycemia** | Often needs NPH (matches steroid action profile) |
| **Hospitalized patients** | Basal-bolus + correction (NO sliding scale alone) |

## Diagnosis

### Monitoring on Insulin
- **SMBG** (self-monitoring of blood glucose): fingerstick glucose
  - T1DM: 4–6 times/day (before meals, bedtime, ± 2h post-meal)
  - T2DM on insulin: variable (fasting daily + periodic pre-meal/post-meal)
- **Continuous glucose monitoring (CGM)**: Libre, Dexcom — gold standard for T1DM
  - Real-time trends, alarms for hypo/hyperglycemia
  - **Time in range (TIR)**: target >70% time between 70–180 mg/dL
- **HbA1c**: every 3 months; target <7% (individualized)
- **C-peptide**: measures endogenous insulin production (low in T1DM; variable in T2DM)

## Management

### Insulin Regimens

#### 1. Basal-Bolus (Intensive/MDI — Multiple Daily Injections)
- **Basal**: glargine or detemir once/twice daily (or degludec once daily)
- **Bolus**: rapid-acting (lispro/aspart/glulisine) before each meal
- **Correction factor**: additional rapid insulin for high pre-meal glucose
- **Most physiological**; gold standard for T1DM
- Requires carbohydrate counting and insulin-to-carb ratio (ICR)

#### 2. Continuous Subcutaneous Insulin Infusion (CSII — Insulin Pump)
- Delivers rapid-acting insulin continuously (basal rate) + patient-activated boluses
- Most precise; reduces hypoglycemia; flexible lifestyle
- Hybrid closed-loop systems ("artificial pancreas"): CGM + algorithm + pump

#### 3. Conventional/Split-Mixed (Less Physiological)
- **Twice-daily premixed insulin** (e.g., 70/30 NPH/regular): before breakfast + before dinner
- Simpler but less flexible; higher hypoglycemia risk; suitable for T2DM, compliance issues

#### 4. Basal Insulin Only (T2DM — Add to OHAs)
- Add basal insulin (glargine/detemir/degludec) to metformin ± other OHAs
- Start: 10 U or 0.1–0.2 U/kg at bedtime
- Titrate: increase by 2 U every 3 days until fasting glucose 70–130

### Insulin Dosing — Practical
- **Total daily dose (TDD)**: 0.5 U/kg (T1DM); 0.5–1.0 U/kg (T2DM, may be higher with insulin resistance)
- **Basal:bolus split**: ~50:50
- **ICR (insulin-to-carb ratio)**: 500/TDD = grams of carb covered by 1 unit of rapid insulin
- **ISF (insulin sensitivity factor/correction factor)**: 1800/TDD = mg/dL drop per 1 unit of rapid insulin

### Injection Technique
- **Sites**: abdomen (fastest absorption), thighs, buttocks, upper arms — ROTATE sites
- **Rotate within regions** to prevent lipodystrophy
- **Angle**: 90° with skin pinch (short needles) or 45° (longer needles)
- **Storage**: unopened — refrigerate (2–8°C); opened — room temperature (up to 28 days)
- **Never freeze insulin**

### Hypoglycemia Management (Most Important Complication)
- **Mild** (BG 54–70, symptomatic but self-treatable): 15–20 g fast-acting carbs → recheck in 15 min → repeat if needed ("Rule of 15")
- **Severe** (needs assistance, BG <54): IV dextrose (D50) or IM glucagon (1 mg)
- **Prevention**: education, regular meals, SMBG/CGM, appropriate dose titration, bedtime snack
- **Hypoglycemia unawareness**: loss of autonomic warning symptoms (recurrent hypos → blunted counter-regulatory response) — ↑target glucose for 2–3 weeks to restore awareness

### Sick Day Rules
- **Never stop insulin** (even if not eating — may need MORE due to stress hormones)
- Monitor glucose more frequently (every 2–4 h)
- Check ketones (urine/blood) if T1DM + glucose >250
- Maintain hydration, treat underlying illness
- Adjust doses based on readings (may need correction insulin more frequently)

## Complications

- **Hypoglycemia**: most common and most dangerous (see above)
- **Weight gain**: anabolic effect (2–4 kg in first year)
- **Lipodystrophy**:
  - **Lipohypertrophy**: rubbery lumps at injection sites → erratic absorption → rotate sites
  - **Lipoatrophy**: rare with modern insulins (immune-mediated with older animal insulins)
- **Insulin allergy**: rare; local (redness, itching) or systemic (anaphylaxis); mostly historical
- **Insulin edema**: sodium retention on insulin initiation → transient peripheral edema
- **Somogyi effect**: rebound hyperglycemia after nocturnal hypoglycemia (treat: ↓bedtime insulin)
- **Dawn phenomenon**: early morning hyperglycemia due to counter-regulatory hormone surge (treat: ↑bedtime insulin or adjust timing)
""",
    "exam": r"""# Insulin Therapy — Exam Prep

## Quick Summary

Essential in T1DM, used in T2DM when OHAs fail. Types: rapid (lispro/aspart — meals), short (regular — IV only), intermediate (NPH — cloudy), long (glargine/detemir — basal). Basal-bolus = gold standard. Hypoglycemia = MC complication. Rule of 15. Lipohypertrophy — rotate sites. Never stop insulin on sick days.

## High Yield Points ★

- ★ **Regular insulin** = only insulin given IV (DKA, perioperative)
- ★ **NPH + premixed** = only CLOUDY insulins; all others are CLEAR
- ★ **Glargine/detemir** = peakless → less nocturnal hypoglycemia vs NPH
- ★ **Basal-bolus** = most physiological regimen (50% basal + 50% bolus)
- ★ **Hypoglycemia** = most common complication — "Rule of 15" for mild; IV D50/IM glucagon for severe
- ★ **Lipohypertrophy**: MC at injection sites → erratic absorption → ROTATE injection sites
- ★ **Somogyi effect**: nocturnal hypo → morning hyperglycemia (↓bedtime dose)
- ★ **Dawn phenomenon**: morning hyperglycemia from counter-regulatory hormones (↑bedtime dose)
- ★ **Sick day rules**: NEVER stop insulin; may need MORE during illness
- ★ **ICR = 500/TDD**; **ISF = 1800/TDD** (practical calculations)
- ★ **Hypoglycemia unawareness**: blunted symptoms from recurrent hypos → raise target temporarily

## Mnemonics

- **Insulin onset order**: "Rapid Really Needs Longer" — Rapid > Regular > NPH > Long-acting
- **Cloudy insulins**: "NP = Not Pure (cloudy)" — NPH, Premixed only
- **Dawn vs Somogyi**: "Dawn = starts high, Somogyi = starts low (rebounds high)"
- **Rule of 15**: 15g carbs → wait 15 min → recheck

## Common MCQ Topics

1. Which insulin can be given IV? (Regular only)
2. Dawn phenomenon vs Somogyi effect — differentiation and management
3. Insulin regimen in DKA (regular insulin infusion)
4. Lipohypertrophy — cause, prevention
5. Sick day rules for T1DM
6. Insulin in pregnancy (which to use, which to avoid)
7. Basal insulin initiation in T2DM (dose, titration)
"""
}

TOPICS["endocrinology/metabolic-syndrome"] = {
    "meta": """title: "Metabolic Syndrome"
slug: metabolic-syndrome
depth: "UG"
highYield: true
nmc_codes:
  - "IM11.1"
prerequisites:
  - "diabetes-mellitus-type-2"
related_topics:
  - "obesity-medical"
  - "insulin-therapy"
""",
    "explorer": r"""# Metabolic Syndrome — Explorer

## Overview

**Metabolic syndrome (MetS)** is a cluster of interconnected metabolic abnormalities that significantly increase the risk of **cardiovascular disease (CVD)**, **type 2 diabetes**, and **stroke**. Central obesity and insulin resistance are the core pathophysiological drivers. Prevalence: ~25–35% of adults globally; increasing with obesity epidemic.

## Key Points

- **Cluster of 5 criteria**: central obesity, hypertriglyceridemia, low HDL, hypertension, hyperglycemia
- Need **≥3 of 5** criteria for diagnosis (NCEP ATP III)
- Core mechanism: **insulin resistance** + **visceral adiposity**
- ↑Risk: 2× cardiovascular disease, 5× type 2 diabetes
- **Lifestyle modification** = cornerstone of treatment (weight loss 7–10%, exercise 150 min/week)
- Each component managed individually (statins, antihypertensives, metformin)
- No single drug treats "the syndrome" — address each risk factor

## Definition & Classification

### NCEP ATP III Criteria (Most Widely Used) — ≥3 of 5

| Criterion | Cut-off |
|-----------|---------|
| **Waist circumference** | Men >102 cm (>90 cm for South Asians); Women >88 cm (>80 cm South Asians) |
| **Triglycerides** | ≥150 mg/dL (or on Rx) |
| **HDL cholesterol** | Men <40 mg/dL; Women <50 mg/dL (or on Rx) |
| **Blood pressure** | ≥130/85 mmHg (or on Rx) |
| **Fasting glucose** | ≥100 mg/dL (or T2DM or on Rx) |

### IDF Criteria (2005)
- **Mandatory**: central obesity (waist circumference ethnicity-specific)
- Plus ≥2 of: ↑TG, ↓HDL, ↑BP, ↑fasting glucose

### WHO Criteria
- **Mandatory**: insulin resistance (hyperinsulinemic-euglycemic clamp or impaired glucose tolerance)
- Plus ≥2 of: obesity (BMI >30 or waist-hip ratio), dyslipidemia, HTN, microalbuminuria

## Etiology & Pathophysiology

### Central/Core Mechanism — Insulin Resistance
1. **Visceral adiposity** → ↑free fatty acids (FFAs) → hepatic insulin resistance
2. ↑FFAs → ↑hepatic VLDL synthesis → ↑triglycerides + ↓HDL (via CETP exchange)
3. **Insulin resistance** → ↑hepatic gluconeogenesis + ↓peripheral glucose uptake → hyperglycemia
4. Compensatory **hyperinsulinemia** → Na⁺ retention + sympathetic activation → hypertension
5. **Adipokine imbalance**: ↑leptin, ↑resistin, ↑TNF-α, ↑IL-6; ↓adiponectin
6. **Chronic low-grade inflammation** + **prothrombotic state** (↑PAI-1, ↑fibrinogen)

### Risk Factors
- **Obesity** (central/visceral > subcutaneous)
- Sedentary lifestyle, unhealthy diet (high refined carbs, saturated fat)
- Genetic predisposition (strong familial clustering)
- Aging, South Asian/Hispanic ethnicity (higher risk at lower BMI)
- Polycystic ovary syndrome (PCOS), non-alcoholic fatty liver disease (NAFLD)
- Medications: atypical antipsychotics, steroids, protease inhibitors

### Associated Conditions
- **NAFLD/NASH**: hepatic manifestation of insulin resistance (70% MetS patients have NAFLD)
- **PCOS**: reproductive manifestation of insulin resistance
- **Obstructive sleep apnea**: bidirectional relationship with MetS
- **Hyperuricemia/gout**: insulin resistance reduces renal urate excretion
- **Chronic kidney disease**: microalbuminuria as part of endothelial dysfunction

## Clinical Features

- **Central obesity**: large waist circumference; apple-shaped body habitus
- **Acanthosis nigricans**: velvety, dark skin thickening (axillae, neck, groin) — marker of insulin resistance
- **Skin tags** (acrochordons): associated with insulin resistance
- **Xanthomas, xanthelasma**: if dyslipidemia prominent
- **Hepatomegaly**: NAFLD/NASH
- **Hypertension**: often primary presentation
- Often **asymptomatic** — diagnosed through routine screening or during evaluation of individual components

### Red Flags for Screening
- Family history of T2DM, premature CVD
- BMI >25 (>23 for South Asians)
- PCOS, gestational DM history
- Acanthosis nigricans
- South Asian, Hispanic, African American ethnicity

## Diagnosis

### Step 1: Measure Components
- **Waist circumference** (standardized: at iliac crest, end of normal expiration)
- **Fasting lipid panel**: TG, HDL-C, LDL-C, total cholesterol
- **Fasting glucose** or HbA1c (≥5.7% suggests prediabetes)
- **Blood pressure**: ≥2 seated readings

### Step 2: Apply Criteria
- NCEP ATP III: ≥3 of 5 criteria (most practical for clinical use)
- IDF: central obesity + ≥2 others
- Either set is acceptable; be ethnicity-aware for waist circumference cut-offs

### Additional Assessments
- **OGTT**: if fasting glucose 100–125 (impaired fasting glucose — confirm glucose tolerance)
- **Liver enzymes + ultrasound**: screen for NAFLD
- **Uric acid**: often elevated
- **hsCRP**: marker of chronic inflammation (prognostic)
- **Framingham risk score or ASCVD risk calculator**: 10-year CV risk assessment

## Management

### 1. Lifestyle Modification — CORNERSTONE
- **Weight loss**: 7–10% of body weight → significant improvement in ALL components
- **Diet**: Mediterranean diet or DASH diet; ↓refined carbs, ↓saturated fat, ↑fiber, ↑fruits/vegetables
- **Exercise**: ≥150 min/week moderate-intensity aerobic + resistance training
- **Smoking cessation**: synergistic CV risk reduction
- **Alcohol**: moderate or avoid (excess worsens TG and BP)

### 2. Pharmacological — Treat Each Component

#### Dyslipidemia
- **Statin**: first-line for ↑LDL and overall CV risk reduction
- **Fibrate** (fenofibrate): if TG >500 mg/dL (pancreatitis risk) or persistent ↑TG despite statin
- **Omega-3 fatty acids** (icosapent ethyl — REDUCE-IT trial): TG 150–499 with CV risk → reduces CV events
- **Ezetimibe, PCSK9 inhibitors**: LDL not at goal despite statin

#### Hypertension
- **Target <130/80 mmHg**
- ACEI/ARB preferred (especially if diabetic or proteinuric)
- CCB, thiazide as alternatives/add-ons

#### Hyperglycemia
- **Prediabetes**: lifestyle modification ± metformin (if high risk — age <60, BMI >35, history GDM)
- **T2DM**: metformin first-line; SGLT2i or GLP-1 RA preferred add-ons (CV benefit)

#### Obesity-Specific
- **GLP-1 receptor agonists** (semaglutide, liraglutide): weight loss + glycemic control + CV benefit
- **Bariatric surgery**: BMI ≥40, or ≥35 with comorbidities — resolves MetS in majority

### 3. Monitoring
- Lipid panel, fasting glucose/HbA1c, BP — every 3–6 months
- Liver function (if NAFLD), uric acid
- Reassess CV risk annually

## Complications

- **Cardiovascular disease**: 2× increased risk (MI, stroke, PAD) — #1 cause of death
- **Type 2 diabetes mellitus**: 5× increased risk
- **NAFLD → NASH → cirrhosis → hepatocellular carcinoma**
- **Chronic kidney disease**: from HTN + DM + endothelial dysfunction
- **Stroke**: especially if AF develops from HTN/obesity
- **Polycystic ovary syndrome**: infertility, hirsutism, acne
- **Obstructive sleep apnea**: ↑CV risk further
- **Gout**: hyperuricemia from insulin resistance
""",
    "exam": r"""# Metabolic Syndrome — Exam Prep

## Quick Summary

Cluster of ≥3/5: central obesity, ↑TG, ↓HDL, ↑BP, ↑fasting glucose (ATP III). Core: insulin resistance + visceral adiposity. ↑2× CVD, ↑5× T2DM risk. Treatment: lifestyle first (7–10% weight loss, 150 min/week exercise), then treat each component (statin, ACEI, metformin). No single "MetS drug."

## High Yield Points ★

- ★ **ATP III criteria**: ≥3 of 5 — waist, TG, HDL, BP, fasting glucose
- ★ **South Asian cut-offs LOWER**: waist >90 cm (M), >80 cm (F)
- ★ **Insulin resistance** = core pathophysiology; visceral fat = driving force
- ★ **Acanthosis nigricans** = clinical marker of insulin resistance
- ★ **NAFLD** = hepatic manifestation (70% of MetS patients)
- ★ **Lifestyle modification** = cornerstone (7–10% weight loss improves ALL components)
- ★ **No single drug** treats metabolic syndrome — address each component
- ★ **GLP-1 RAs** (semaglutide): address obesity + glucose + CV risk simultaneously
- ★ **2× CVD risk, 5× T2DM risk** — key statistics

## Mnemonics

- **MetS criteria "ABCDE"**: Abdominal obesity, BP elevated, Cholesterol (HDL low), Diabetes (glucose ↑), Elevated TG
- **Core mechanism**: "IR + VF" — Insulin Resistance + Visceral Fat
- **NAFLD link**: "MetS Liver = Fatty Liver"

## Common MCQ Topics

1. ATP III diagnostic criteria (know all 5 + cut-offs)
2. Ethnicity-specific waist circumference cut-offs
3. Core pathophysiology (insulin resistance)
4. NAFLD association with metabolic syndrome
5. First-line management (lifestyle, NOT drugs)
6. Acanthosis nigricans significance
7. CV risk increase with MetS
"""
}

TOPICS["endocrinology/obesity-medical"] = {
    "meta": """title: "Obesity (Medical Management)"
slug: obesity-medical
depth: "UG"
highYield: true
nmc_codes:
  - "IM10.1"
prerequisites:
  - "metabolic-syndrome"
related_topics:
  - "diabetes-mellitus-type-2"
  - "pcos"
""",
    "explorer": r"""# Obesity (Medical Management) — Explorer

## Overview

**Obesity** is a chronic, relapsing, multifactorial disease characterized by excess adiposity that impairs health. It is defined by **BMI ≥30 kg/m²** (≥25 for Asians). Globally, obesity affects >650 million adults and is a major driver of cardiovascular disease, T2DM, certain cancers, and premature mortality. Treatment involves lifestyle modification, pharmacotherapy, and bariatric surgery.

## Key Points

- **BMI ≥30** = obese (WHO); ≥25 for Asian populations
- Central/visceral obesity more metabolically harmful than subcutaneous
- **Waist circumference** better predictor of metabolic risk than BMI alone
- Complications: T2DM, CVD, NAFLD, OSA, cancers, OA, infertility
- **Lifestyle modification** = foundation (diet + exercise + behavioral therapy)
- **Pharmacotherapy**: GLP-1 RAs (semaglutide — most effective), orlistat, phentermine-topiramate
- **Bariatric surgery**: most effective long-term treatment (BMI ≥40, or ≥35 with comorbidities)

## Definition & Classification

### BMI Classification (WHO)

| Category | BMI (kg/m²) | Asian BMI |
|----------|------------|-----------|
| Underweight | <18.5 | <18.5 |
| Normal | 18.5–24.9 | 18.5–22.9 |
| Overweight | 25–29.9 | 23–24.9 |
| **Obese Class I** | 30–34.9 | 25–29.9 |
| **Obese Class II** | 35–39.9 | 30–34.9 |
| **Obese Class III** (morbid) | ≥40 | ≥35 |

### Limitations of BMI
- Does not distinguish fat vs muscle mass (may overestimate in muscular individuals)
- Does not capture fat distribution (central vs peripheral)
- **Waist circumference** and **waist-hip ratio** add metabolic risk assessment

## Etiology & Pathophysiology

### Energy Balance
- Obesity = chronic positive energy balance (intake > expenditure)
- But it is NOT simply "eat less, move more" — complex neuroendocrine regulation

### Neuroendocrine Regulation of Appetite
- **Hypothalamus** = appetite control center (arcuate nucleus)
- **Orexigenic signals** (↑appetite): ghrelin (stomach), NPY, AgRP
- **Anorexigenic signals** (↓appetite): leptin (adipose), insulin, GLP-1, PYY, POMC/CART
- **Leptin resistance**: high leptin levels in obesity but reduced central response → persistent hunger

### Causes/Contributors
- **Primary (polyg