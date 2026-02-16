#!/bin/bash
set -euo pipefail
cd /Users/adityachandrabhatla/nucleux-academy

# Function to write files only if missing
write_if_missing() {
  local dir="$1" file="$2" content="$3"
  if [ ! -f "$dir/$file" ]; then
    echo "$content" > "$dir/$file"
    echo "  Created $dir/$file"
  else
    echo "  SKIP $dir/$file (exists)"
  fi
}

write_meta() {
  local dir="$1" content="$2"
  echo "$content" > "$dir/_meta.yaml"
  echo "  Updated $dir/_meta.yaml"
}

BASE="content/medicine"

###############################################################################
# ENDOCRINOLOGY — remaining topics
###############################################################################
echo "=== ENDOCRINOLOGY ==="

# adrenal-disorders
DIR="$BASE/endocrinology/adrenal-disorders"
write_meta "$DIR" 'title: "Adrenal Disorders"
slug: adrenal-disorders
depth: "UG"
highYield: true
nmc_codes:
  - "IM12.1"
  - "IM12.2"
prerequisites:
  - "pituitary-disorders"
related_topics:
  - "metabolic-syndrome"
  - "calcium-disorders"'

write_if_missing "$DIR" "explorer.md" '# Adrenal Disorders — Explorer

## Overview

**Adrenal disorders** encompass conditions of **excess** or **deficiency** of adrenal hormones — cortisol (Cushing/Addison), aldosterone (Conn/hypoaldosteronism), and catecholamines (pheochromocytoma). The adrenal gland has a **cortex** (zona glomerulosa → aldosterone, zona fasciculata → cortisol, zona reticularis → androgens) and **medulla** (catecholamines).

## Key Points

- **Cushing syndrome**: excess cortisol; most common cause = exogenous steroids
- **Addison disease**: primary adrenal insufficiency; autoimmune (#1 in developed countries), TB (#1 worldwide)
- **Conn syndrome**: primary hyperaldosteronism — HTN + hypokalemia + metabolic alkalosis
- **Pheochromocytoma**: catecholamine-secreting tumor; rule of 10s
- **Adrenal crisis**: life-threatening; treat with IV hydrocortisone immediately
- **Congenital adrenal hyperplasia (CAH)**: 21-hydroxylase deficiency most common

## Definition & Classification

### By Hormone

| Hormone | Excess | Deficiency |
|---------|--------|------------|
| **Cortisol** | Cushing syndrome | Addison disease |
| **Aldosterone** | Conn syndrome | Hypoaldosteronism |
| **Catecholamines** | Pheochromocytoma | — |
| **Androgens** | CAH, adrenal tumors | Adrenal insufficiency |

### Cushing Syndrome — Causes
- **ACTH-dependent (80%)**: Pituitary adenoma (Cushing disease, 70%), Ectopic ACTH (small cell lung CA)
- **ACTH-independent (20%)**: Adrenal adenoma, carcinoma, exogenous steroids

## Etiology & Pathophysiology

### Addison Disease
- **Autoimmune** adrenalitis (most common in developed world)
- **TB** (most common worldwide)
- Other: fungal, HIV, metastases, Waterhouse-Friderichsen (meningococcal)
- Loss of all 3 zones → ↓cortisol, ↓aldosterone, ↓androgens
- ↑ACTH (loss of negative feedback) → **hyperpigmentation**

### Cushing Syndrome
- Chronic cortisol excess → protein catabolism, gluconeogenesis, fat redistribution
- Central obesity, moon face, buffalo hump, striae, thin skin, proximal myopathy

### Pheochromocytoma
- Chromaffin cell tumor; 90% adrenal, 10% extra-adrenal (paraganglioma)
- Rule of 10s: 10% bilateral, 10% malignant, 10% extra-adrenal, 10% familial
- Associated: MEN2A/2B, VHL, NF1, SDH mutations

### Conn Syndrome
- Autonomous aldosterone secretion → Na⁺ retention, K⁺ wasting, H⁺ wasting
- Aldosterone-producing adenoma (65%) or bilateral adrenal hyperplasia (35%)

## Clinical Features

### Cushing Syndrome
- **Central obesity**, moon face, buffalo hump, supraclavicular fat pads
- **Purple striae** (>1cm wide), thin skin, easy bruising
- **Proximal myopathy**, osteoporosis
- **HTN, hyperglycemia**, hirsutism, acne
- Menstrual irregularity, psychiatric disturbances

### Addison Disease
- **Hyperpigmentation** (skin creases, buccal mucosa, scars)
- **Fatigue**, weakness, weight loss, anorexia
- **Hypotension**, postural dizziness
- Salt craving, GI symptoms (nausea, vomiting)
- **Adrenal crisis**: shock, altered consciousness, abdominal pain

### Pheochromocytoma
- **Paroxysmal HTN** (or sustained)
- Classic triad: **Headache + Sweating + Palpitations**
- Anxiety, tremor, pallor, weight loss
- Hypertensive crisis with anesthesia/surgery if undiagnosed

### Conn Syndrome
- **Resistant HTN** (often asymptomatic)
- Hypokalemia → muscle weakness, cramps, polyuria
- Metabolic alkalosis

## Diagnosis

### Cushing Syndrome — Screening
1. **24-hour urinary free cortisol** (elevated)
2. **Overnight dexamethasone suppression test** (1mg at 11PM → 8AM cortisol >1.8 = positive)
3. **Late-night salivary cortisol** (elevated)

### Cushing — Localization
- **ACTH level**: Low = adrenal; High = pituitary/ectopic
- **High-dose dexamethasone suppression**: Suppresses = pituitary; No suppression = ectopic
- **Inferior petrosal sinus sampling**: Gold standard for pituitary vs ectopic

### Addison Disease
- **Short Synacthen test** (ACTH stimulation test): Gold standard
- Give 250μg synthetic ACTH → measure cortisol at 30/60 min
- Normal: cortisol >500 nmol/L (18 μg/dL); Addison: no rise
- **Morning cortisol <3 μg/dL** strongly suggestive
- **↑ACTH** (primary), ↑renin, ↓aldosterone, hyponatremia, hyperkalemia

### Pheochromocytoma
- **24-hour urinary metanephrines/catecholamines** or **plasma free metanephrines**
- Imaging: CT/MRI abdomen → MIBG scan for localization

### Conn Syndrome
- **Aldosterone-to-renin ratio (ARR)** > 30 (screening)
- Confirmatory: saline infusion test, fludrocortisone suppression test
- CT adrenal; adrenal venous sampling if bilateral

## Management

### Cushing Syndrome
- **Exogenous**: taper steroids
- **Pituitary adenoma**: transsphenoidal surgery
- **Adrenal tumor**: adrenalectomy
- **Ectopic ACTH**: treat underlying tumor
- Medical: ketoconazole, metyrapone, osilodrostat

### Addison Disease
- **Lifelong replacement**: hydrocortisone (cortisol) + fludrocortisone (aldosterone)
- **Sick day rules**: double/triple steroid dose during illness
- **Adrenal crisis**: IV hydrocortisone 100mg bolus + IV NS immediately
- **MedicAlert bracelet**
- Do NOT wait for investigations if crisis suspected

### Pheochromocytoma
- **Alpha-blocker FIRST** (phenoxybenzamine) for 10-14 days
- **Then beta-blocker** (propranolol) — NEVER beta before alpha (unopposed alpha → crisis)
- **Surgery**: laparoscopic adrenalectomy after adequate blockade
- Preop volume expansion with IV fluids

### Conn Syndrome
- **Unilateral adenoma**: laparoscopic adrenalectomy (curative)
- **Bilateral hyperplasia**: spironolactone or eplerenone (lifelong)

## Complications

### Cushing
- Osteoporosis, fractures, diabetes, infections, cardiovascular disease
- Nelson syndrome (post-bilateral adrenalectomy → pituitary enlargement + hyperpigmentation)

### Addison
- **Adrenal crisis** (most dangerous) — triggered by stress, infection, surgery, steroid withdrawal
- Osteoporosis (over-replacement)

### Pheochromocytoma
- Hypertensive crisis, stroke, MI, cardiomyopathy
- Intraoperative hemodynamic instability

### Conn Syndrome
- Cardiovascular damage (LVH, stroke, renal damage)
- Hypokalemic nephropathy'

write_if_missing "$DIR" "exam-prep.md" '# Adrenal Disorders — Exam Prep

## Quick Summary

Cushing = cortisol excess (exogenous steroids MC cause). Addison = adrenal insufficiency (autoimmune/TB). Conn = primary hyperaldosteronism (HTN + hypoK + met alkalosis). Pheochromocytoma = catecholamine tumor (HTN + headache + sweating + palpitations). Adrenal crisis = IV hydrocortisone STAT.

## High Yield Points ★

- ★ **Overnight DST** = screening for Cushing; **IPSS** = gold standard for localization
- ★ **Short Synacthen test** = gold standard for Addison disease
- ★ **Hyperpigmentation** = ↑ACTH in primary adrenal insufficiency (not secondary)
- ★ **Adrenal crisis**: IV hydrocortisone 100mg bolus — do NOT delay for tests
- ★ **Pheochromocytoma**: Alpha-blocker FIRST, then beta — NEVER beta alone
- ★ **Rule of 10s** in pheochromocytoma (10% bilateral, malignant, extra-adrenal, familial)
- ★ **Conn syndrome screening**: Aldosterone-to-Renin Ratio (ARR)
- ★ **Nelson syndrome**: post-bilateral adrenalectomy → ↑ACTH → pituitary enlargement
- ★ **MEN2A**: Pheochromocytoma + Medullary thyroid CA + Hyperparathyroidism
- ★ **21-hydroxylase deficiency** = MC cause of CAH (salt-wasting + virilization)

## Mnemonics

- **Cushing features "CUSHING"**: Central obesity, Ulcers (striae), Skin thin, HTN/Hyperglycemia, Infections, Neuro-psych, Growth retardation
- **Addison "3 Hypos + 1 Hyper"**: Hypotension, Hypoglycemia, Hyponatremia + Hyperkalemia
- **Pheo triad**: "HSP" — Headache, Sweating, Palpitations
- **Conn**: "HTN + HypoK + Alkalosis = think aldosterone"

## Common MCQ Topics

1. Screening test for Cushing syndrome (overnight DST)
2. Addison vs secondary adrenal insufficiency (pigmentation, aldosterone)
3. Alpha before beta in pheochromocytoma — why?
4. Conn syndrome: ARR screening, confirmatory tests
5. CAH: 21-hydroxylase deficiency presentation
6. Adrenal crisis management protocol'

# calcium-disorders
DIR="$BASE/endocrinology/calcium-disorders"
write_meta "$DIR" 'title: "Calcium Disorders"
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
  - "thyroid-nodule-evaluation"'

write_if_missing "$DIR" "explorer.md" '# Calcium Disorders — Explorer

## Overview

**Calcium homeostasis** is maintained by PTH, vitamin D, and calcitonin acting on bone, kidney, and gut. Disorders include **hypercalcemia** (most commonly primary hyperparathyroidism or malignancy) and **hypocalcemia** (most commonly hypoparathyroidism or vitamin D deficiency). Normal serum calcium: 8.5-10.5 mg/dL.

## Key Points

- **Primary hyperparathyroidism**: MC cause of hypercalcemia in outpatients
- **Malignancy**: MC cause of hypercalcemia in hospitalized patients
- Hypercalcemia symptoms: "**Stones, Bones, Groans, Moans, Psychiatric Overtones**"
- Hypocalcemia signs: **Chvostek** (facial twitch) and **Trousseau** (carpopedal spasm)
- **Corrected calcium** = measured Ca + 0.8 × (4 - albumin)
- **Hungry bone syndrome**: post-parathyroidectomy hypocalcemia
- ECG: Hypercalcemia = **short QT**; Hypocalcemia = **prolonged QT**

## Definition & Classification

### Hypercalcemia (>10.5 mg/dL)
- **Mild**: 10.5-12 mg/dL (often asymptomatic)
- **Moderate**: 12-14 mg/dL
- **Severe/Crisis**: >14 mg/dL (medical emergency)

### Causes by PTH Level
| PTH Level | Causes |
|-----------|--------|
| **↑ PTH** | Primary hyperparathyroidism, tertiary hyperparathyroidism, FHH |
| **↓ PTH** | Malignancy (PTHrP, bone mets, myeloma), Vitamin D excess, Sarcoidosis, Thyrotoxicosis, Milk-alkali |

### Hypocalcemia (<8.5 mg/dL)
- **Hypoparathyroidism** (post-surgical MC)
- **Vitamin D deficiency** (nutritional, CKD)
- **Pseudohypoparathyroidism** (PTH resistance)
- Acute pancreatitis, massive transfusion (citrate), hyperphosphatemia

## Etiology & Pathophysiology

### Primary Hyperparathyroidism
- **Single adenoma (85%)**, hyperplasia (10%), carcinoma (<1%)
- ↑PTH → ↑bone resorption + ↑renal Ca reabsorption + ↑1,25-vit D → ↑gut absorption
- ↑Ca, ↓PO4, ↑ALP, ↑urinary cAMP

### Malignancy-Related Hypercalcemia
- **PTHrP secretion** (squamous cell CA, renal, breast) — most common mechanism
- **Osteolytic metastases** (breast, myeloma)
- **1,25-vitamin D production** (lymphoma)

### Vitamin D Deficiency
- Inadequate sun/diet → ↓25-OH-vit D → ↓intestinal Ca absorption
- ↑PTH (secondary hyperparathyroidism) → bone resorption → osteomalacia/rickets
- CKD → ↓1,25-vit D (↓1α-hydroxylase) → renal osteodystrophy

## Clinical Features

### Hypercalcemia — "Stones, Bones, Groans, Moans"
- **Stones**: renal calculi (calcium oxalate/phosphate), nephrocalcinosis
- **Bones**: bone pain, osteoporosis, osteitis fibrosa cystica (brown tumors)
- **Groans**: abdominal pain, constipation, pancreatitis, PUD
- **Moans**: fatigue, depression, confusion, psychosis
- **Others**: polyuria, polydipsia, short QT, band keratopathy

### Hypocalcemia
- **Neuromuscular excitability**: tetany, carpopedal spasm, laryngospasm, seizures
- **Chvostek sign**: tapping facial nerve → ipsilateral facial twitch
- **Trousseau sign**: BP cuff inflated >SBP for 3 min → carpopedal spasm (more specific)
- **Prolonged QT** → arrhythmias
- Chronic: cataracts, basal ganglia calcification, dry skin, dental abnormalities

## Diagnosis

### Hypercalcemia Workup
1. **Confirm**: corrected calcium or ionized calcium
2. **PTH level**: ↑PTH = hyperparathyroidism; ↓PTH = non-PTH mediated
3. **PTHrP**: if malignancy suspected
4. **Vitamin D levels**: 25-OH-D and 1,25-(OH)2-D
5. **Serum/urine protein electrophoresis**: myeloma
6. **24-hour urinary calcium**: distinguishes PHPT from FHH (FHH: Ca/Cr clearance ratio <0.01)

### Hypocalcemia Workup
1. PTH, phosphate, magnesium, vitamin D, ALP
2. **↓PTH + ↑PO4**: hypoparathyroidism
3. **↑PTH + ↓PO4**: vitamin D deficiency
4. **↑PTH + ↑PO4**: pseudohypoparathyroidism or CKD
5. Always check **magnesium** (hypoMg causes functional hypoPTH)

## Management

### Hypercalcemia (Acute/Severe)
1. **IV Normal Saline** (aggressive hydration: 200-300 mL/hr) — first step
2. **IV Furosemide** (only after adequate hydration) — calciuresis
3. **IV Bisphosphonate** (zoledronic acid) — takes 2-4 days; best for malignancy
4. **Calcitonin** — rapid but transient effect (tachyphylaxis in 48h)
5. **Denosumab** — if bisphosphonate-resistant
6. **Glucocorticoids** — for granulomatous disease, lymphoma, vitamin D excess
7. **Dialysis** — refractory or renal failure

### Primary Hyperparathyroidism
- **Surgery** (parathyroidectomy): definitive treatment
- Indications: symptomatic, Ca >1mg above ULN, age <50, T-score <-2.5, eGFR <60, renal stones
- Medical (if surgery not possible): cinacalcet (calcimimetic)

### Hypocalcemia
- **Acute symptomatic**: IV calcium gluconate (10mL 10% over 10 min) — cardiac monitoring
- **Chronic**: oral calcium + vitamin D supplementation
- **Correct magnesium** if low (PTH won't work without Mg)
- **Hypoparathyroidism**: calcium + calcitriol (active vitamin D)

## Complications

- **Hypercalcemic crisis**: cardiac arrest, coma, renal failure
- **Severe hypocalcemia**: laryngospasm, seizures, cardiac arrest (prolonged QT)
- **Hungry bone syndrome**: severe hypocalcemia after parathyroidectomy (bones avidly take up calcium)
- **Renal osteodystrophy** in CKD
- **Brown tumors** in severe hyperparathyroidism (osteitis fibrosa cystica)'

write_if_missing "$DIR" "exam-prep.md" '# Calcium Disorders — Exam Prep

## Quick Summary

Hypercalcemia: outpatient = primary hyperparathyroidism, inpatient = malignancy. Symptoms: stones, bones, groans, moans. Treatment: IV NS → furosemide → bisphosphonate. Hypocalcemia: Chvostek + Trousseau signs, prolonged QT. Treat acute with IV calcium gluconate. Always check magnesium.

## High Yield Points ★

- ★ **Corrected Ca** = measured Ca + 0.8 × (4 - albumin)
- ★ **Primary hyperparathyroidism**: ↑Ca, ↓PO4, ↑PTH, ↑ALP
- ★ **FHH vs PHPT**: Ca/Cr clearance ratio <0.01 = FHH (benign, no surgery)
- ★ **PTHrP** = most common mechanism of malignancy-related hypercalcemia
- ★ **Trousseau sign** more specific than Chvostek for hypocalcemia
- ★ **ECG**: HyperCa = short QT; HypoCa = prolonged QT
- ★ **IV saline FIRST** in acute hypercalcemia, NOT furosemide
- ★ **Hungry bone syndrome**: post-parathyroidectomy hypocalcemia
- ★ **Pseudohypoparathyroidism**: ↑PTH, ↑PO4, ↓Ca (PTH resistance) — Albright hereditary osteodystrophy
- ★ **Always check magnesium** — hypoMg causes refractory hypocalcemia

## Mnemonics

- **Hypercalcemia**: "Stones, Bones, Groans, Moans, Psychiatric Overtones"
- **Hypocalcemia signs**: "CATs go Numb" — Convulsions, Arrhythmias, Tetany, Numbness
- **FHH clue**: "Family History of Hypercalcemia — Friendly, Harmless, Familial"

## Common MCQ Topics

1. Corrected calcium calculation
2. PHPT vs FHH differentiation
3. First step in acute hypercalcemia management
4. Chvostek vs Trousseau sign
5. Causes of hypocalcemia with ↑PTH vs ↓PTH
6. Hungry bone syndrome'

# diabetes-insipidus
DIR="$BASE/endocrinology/diabetes-insipidus"
write_meta "$DIR" 'title: "Diabetes Insipidus"
slug: diabetes-insipidus
depth: "UG"
highYield: true
nmc_codes:
  - "IM10.3"
prerequisites:
  - "pituitary-disorders"
related_topics:
  - "calcium-disorders"'

write_if_missing "$DIR" "explorer.md" '# Diabetes Insipidus — Explorer

## Overview

**Diabetes insipidus (DI)** is characterized by excretion of large volumes of **dilute urine** (polyuria >3L/day) due to either **deficient ADH secretion** (central DI) or **renal resistance to ADH** (nephrogenic DI). It must be distinguished from primary polydipsia and osmotic diuresis.

## Key Points

- **Central DI**: deficient ADH production/secretion (pituitary/hypothalamic pathology)
- **Nephrogenic DI**: renal resistance to ADH (lithium = MC drug cause)
- Hallmark: **dilute urine** (osmolality <300) with **concentrated plasma** (osmolality >290)
- **Water deprivation test**: gold standard for diagnosis
- Central DI responds to **desmopressin (DDAVP)**; nephrogenic does NOT
- Untreated → severe dehydration, hypernatremia

## Definition & Classification

| Type | Mechanism | ADH Level | Response to DDAVP |
|------|-----------|-----------|-------------------|
| **Central DI** | ↓ADH secretion | Low | Yes (urine concentrates) |
| **Nephrogenic DI** | Renal ADH resistance | High | No |
| **Primary polydipsia** | Excessive water intake | Suppressed | N/A (urine concentrates with deprivation) |
| **Gestational DI** | Placental vasopressinase | Low | Yes |

## Etiology & Pathophysiology

### Central DI
- **Idiopathic** (30%) — autoimmune destruction of ADH neurons
- **Pituitary surgery/trauma** (most common identifiable cause)
- Tumors: craniopharyngioma, metastases, germinoma
- Infiltrative: sarcoidosis, histiocytosis X (Langerhans cell)
- Infections: meningitis, encephalitis
- Genetic: autosomal dominant (rare)

### Nephrogenic DI
- **Lithium** (most common drug cause — damages collecting ducts)
- **Hypercalcemia**, hypokalemia
- CKD, sickle cell disease, amyloidosis
- Genetic: X-linked (V2 receptor mutation), autosomal recessive (AQP2 mutation)

### Pathophysiology
- ADH acts on **V2 receptors** → insertion of **aquaporin-2** channels in collecting duct
- Without ADH effect → water not reabsorbed → dilute polyuria → compensatory polydipsia
- If water intake inadequate → hypernatremia → CNS dysfunction

## Clinical Features

- **Polyuria**: >3L/day, can be >10-20L/day
- **Polydipsia**: intense thirst, preference for cold water
- **Nocturia**: disrupted sleep
- **Dehydration** if water access limited: dry mucous membranes, tachycardia, hypotension
- **Hypernatremia**: confusion, lethargy, seizures, coma
- Children: failure to thrive, irritability, fever

### Central vs Nephrogenic Clues
- Central: often abrupt onset (post-surgery/trauma)
- Nephrogenic: lithium use, hypercalcemia history
- Both: polyuria + polydipsia + dilute urine

## Diagnosis

### Step 1: Confirm Polyuria
- 24-hour urine volume >3L (or >50 mL/kg/day)
- Urine osmolality <300 mOsm/kg (often <200)
- Plasma osmolality >290 mOsm/kg

### Step 2: Water Deprivation Test (Miller-Moses Test)
1. Withhold fluids, monitor weight, urine output, urine osmolality hourly
2. Stop when: urine osmolality plateaus, or weight loss >3%, or plasma osmolality >295
3. Then give **DDAVP (desmopressin)**

| Result | After Deprivation | After DDAVP |
|--------|-------------------|-------------|
| **Normal** | Urine concentrates (>600) | No further change |
| **Central DI** | Urine stays dilute (<300) | Concentrates >50% increase |
| **Nephrogenic DI** | Urine stays dilute | Stays dilute (<50% increase) |
| **Primary polydipsia** | Urine concentrates (>500) | No further change |

### Step 3: Identify Cause
- Central: MRI pituitary/hypothalamus (loss of posterior pituitary bright spot)
- Nephrogenic: check lithium levels, calcium, potassium, renal function

## Management

### Central DI
- **Desmopressin (DDAVP)**: intranasal, oral, or SC — mainstay
- Titrate to control polyuria while avoiding hyponatremia
- Monitor serum sodium regularly
- Treat underlying cause (tumor, infiltrative disease)

### Nephrogenic DI
- **Remove offending agent** (lithium if possible)
- **Thiazide diuretics** (paradoxical antidiuresis — reduce urine volume by 30-50%)
- **Amiloride** (blocks lithium entry into collecting duct — preferred with lithium)
- **Low-salt, low-protein diet** (reduces solute load)
- **NSAIDs** (indomethacin — reduce prostaglandin-mediated ADH antagonism)
- Adequate water access at all times

### Acute Hypernatremia
- **Free water replacement** (oral or IV D5W)
- Correct sodium slowly: **<10 mEq/L per 24 hours** (risk of cerebral edema)
- Calculate free water deficit: 0.6 × weight × (Na/140 - 1)

## Complications

- **Severe hypernatremia**: cerebral dehydration, intracranial hemorrhage, seizures
- **Rapid correction**: cerebral edema
- **Desmopressin over-treatment**: dilutional hyponatremia, water intoxication
- **Hydroureteronephrosis**: chronic polyuria → bladder/ureter dilation
- **Growth failure** in children'

write_if_missing "$DIR" "exam-prep.md" '# Diabetes Insipidus — Exam Prep

## Quick Summary

DI = polyuria (>3L/day) + dilute urine + concentrated plasma. Central (↓ADH) vs Nephrogenic (ADH resistance). Water deprivation test differentiates. Central responds to DDAVP, nephrogenic does not. Central: DDAVP treatment. Nephrogenic: thiazides + amiloride + low salt diet. Lithium = MC drug cause of nephrogenic DI.

## High Yield Points ★

- ★ **Water deprivation test** = gold standard for DI diagnosis
- ★ **Central DI**: urine concentrates with DDAVP; **Nephrogenic**: does NOT
- ★ **Lithium** = most common drug cause of nephrogenic DI
- ★ **Thiazide paradox**: diuretic that REDUCES urine volume in nephrogenic DI
- ★ **MRI finding**: loss of posterior pituitary bright spot in central DI
- ★ **DDAVP** = treatment of choice for central DI
- ★ **Hypernatremia correction**: <10 mEq/L per 24h (avoid cerebral edema)
- ★ **Craniopharyngioma** = MC suprasellar tumor causing DI in children
- ★ **Amiloride** = preferred add-on in lithium-induced DI (blocks lithium uptake)

## Mnemonics

- **DI vs DM**: "DI = Dilute & Insipid (tasteless); DM = Dense & Mellitus (sweet)"
- **Central vs Nephrogenic**: "Central = DDAVP works; Nephrogenic = No response"
- **Nephrogenic causes**: "LITHIUM" — Lithium, Infections, Tubulointerstitial, Hypercalcemia, Hypokalemia, Inherited, Unknown, Medications

## Common MCQ Topics

1. Water deprivation test interpretation
2. Central vs nephrogenic DI differentiation
3. Lithium-induced DI management
4. Thiazide paradox mechanism
5. Hypernatremia correction rate'

# diabetic-nephropathy
DIR="$BASE/endocrinology/diabetic-nephropathy"
write_meta "$DIR" 'title: "Diabetic Nephropathy"
slug: diabetic-nephropathy
depth: "UG"
highYield: true
nmc_codes:
  - "IM11.12"
prerequisites:
  - "diabetes-mellitus"
related_topics:
  - "diabetic-retinopathy"
  - "diabetes-mellitus-type-2"'

write_if_missing "$DIR" "explorer.md" '# Diabetic Nephropathy — Explorer

## Overview

**Diabetic nephropathy (DN)** is the leading cause of **end-stage renal disease (ESRD)** worldwide. It is a microvascular complication of diabetes characterized by progressive albuminuria, declining GFR, and hypertension. It affects ~30-40% of diabetic patients over their lifetime.

## Key Points

- **Leading cause of ESRD** in developed countries
- Earliest sign: **microalbuminuria** (30-300 mg/day)
- Pathology: **Kimmelstiel-Wilson nodules** (nodular glomerulosclerosis) — pathognomonic
- Screening: annual **urine albumin-to-creatinine ratio (UACR)** starting 5 years after T1DM diagnosis or at T2DM diagnosis
- **ACE inhibitors/ARBs** = cornerstone of treatment (renoprotective)
- **SGLT2 inhibitors** = proven renal protection (CREDENCE, DAPA-CKD trials)
- **Finerenone** (non-steroidal MRA) = newer agent with renal + CV benefit

## Definition & Classification

### Stages of Diabetic Nephropathy

| Stage | UACR (mg/g) | GFR | Features |
|-------|-------------|-----|----------|
| **1. Hyperfiltration** | Normal | ↑ (>140) | Enlarged kidneys |
| **2. Silent** | Normal | Normal | Basement membrane thickening |
| **3. Microalbuminuria** | 30-300 | Normal/↓ | Earliest clinical marker |
| **4. Macroalbuminuria** | >300 | ↓ | Progressive decline |
| **5. ESRD** | ↑↑ | <15 | Dialysis/transplant needed |

## Etiology & Pathophysiology

### Risk Factors
- Duration of diabetes (strongest predictor)
- Poor glycemic control (HbA1c)
- Hypertension, dyslipidemia
- Genetic susceptibility, family history of DN
- Smoking, obesity

### Pathophysiology
1. **Hyperglycemia** → advanced glycation end products (AGEs) → mesangial expansion
2. **Glomerular hyperfiltration** → intraglomerular hypertension → endothelial damage
3. **Activation of RAAS, PKC pathway, polyol pathway, oxidative stress**
4. **Progressive fibrosis** → nodular glomerulosclerosis (KW nodules)
5. **GBM thickening + podocyte loss** → proteinuria → tubulointerstitial fibrosis → ESRD

### Histopathology
- **Diffuse mesangial sclerosis** (most common pattern)
- **Nodular glomerulosclerosis** (Kimmelstiel-Wilson nodules) — pathognomonic but less common
- GBM thickening, arteriolar hyalinosis (afferent AND efferent)

## Clinical Features

- **Early**: asymptomatic; detected only by screening
- **Microalbuminuria**: no symptoms; marker of endothelial dysfunction (also cardiovascular risk marker)
- **Progressive proteinuria**: frothy urine, edema
- **Hypertension**: often concurrent, worsens nephropathy
- **Nephrotic syndrome**: heavy proteinuria, hypoalbuminemia, edema
- **Advanced CKD**: uremic symptoms, anemia, bone disease
- Usually accompanied by **diabetic retinopathy** (absence of retinopathy in T1DM with nephropathy → consider alternative diagnosis)

## Diagnosis

### Screening
- **UACR** on spot urine (preferred) — need 2 of 3 positive samples over 3-6 months
- **eGFR** (CKD-EPI formula)
- T1DM: start screening **5 years** after diagnosis
- T2DM: screen **at diagnosis** (may have had undiagnosed DM for years)

### Diagnostic Criteria
- **Microalbuminuria**: UACR 30-300 mg/g
- **Macroalbuminuria**: UACR >300 mg/g
- **False positives**: exercise, fever, UTI, heart failure, menstruation

### When to Suspect Non-Diabetic Kidney Disease
- Absence of diabetic retinopathy (especially T1DM)
- Rapidly declining GFR
- Active urine sediment (RBC casts)
- Onset <5 years of T1DM diagnosis
- → Consider renal biopsy

## Management

### Glycemic Control
- **HbA1c target <7%** (individualized)
- **SGLT2 inhibitors** (empagliflozin, dapagliflozin): proven renoprotective — reduce ESRD, CV death
  - Mechanism: reduce intraglomerular pressure via tubuloglomerular feedback
  - Avoid if eGFR <20

### Blood Pressure Control
- **Target <130/80 mmHg**
- **ACE inhibitor or ARB** = first-line (reduce intraglomerular pressure, reduce proteinuria)
  - Start at microalbuminuria stage even if normotensive
  - Monitor K⁺ and creatinine (acceptable: ≤30% rise in creatinine)
  - Do NOT combine ACEI + ARB (↑hyperkalemia, no benefit — ONTARGET trial)
- Add CCB, thiazide/loop diuretic as needed

### Newer Agents
- **Finerenone** (non-steroidal MRA): reduces albuminuria + CV events (FIDELIO-DKD, FIGARO-DKD)
- **GLP-1 receptor agonists**: secondary renal benefit

### General Measures
- Smoking cessation, weight management
- Statin therapy (CV risk reduction)
- Dietary protein restriction (0.8 g/kg/day in advanced CKD)
- Avoid nephrotoxins (NSAIDs, contrast dye, aminoglycosides)

### ESRD
- **Dialysis** or **renal transplant** (simultaneous pancreas-kidney transplant in T1DM)
- Refer to nephrology when eGFR <30

## Complications

- **End-stage renal disease** requiring dialysis/transplant
- **Cardiovascular disease** (microalbuminuria = CV risk marker)
- **Hypertension** → further renal damage (vicious cycle)
- **Anemia** (↓EPO production)
- **Renal osteodystrophy**
- **Hyperkalemia** (especially with RAAS blockade)'

write_if_missing "$DIR" "exam-prep.md" '# Diabetic Nephropathy — Exam Prep

## Quick Summary

Leading cause of ESRD. Earliest marker: microalbuminuria (UACR 30-300). Pathognomonic: Kimmelstiel-Wilson nodules. Screen annually (T1DM: 5y post-dx; T2DM: at dx). Treatment: ACEI/ARB + SGLT2i + glycemic control + BP <130/80. Finerenone = newer MRA. Never combine ACEI+ARB.

## High Yield Points ★

- ★ **Kimmelstiel-Wilson nodules** = pathognomonic of diabetic nephropathy
- ★ **Microalbuminuria** = earliest clinical marker (UACR 30-300 mg/g)
- ★ **ACEI/ARB** = first-line renoprotective agent — start at microalbuminuria
- ★ **SGLT2 inhibitors** = proven to reduce ESRD progression (CREDENCE trial)
- ★ **No retinopathy + nephropathy in T1DM** → think alternative diagnosis → biopsy
- ★ **Do NOT combine ACEI + ARB** (ONTARGET: no benefit, more harm)
- ★ **Finerenone**: non-steroidal MRA, reduces albuminuria + CV events
- ★ **Afferent AND efferent arteriolar hyalinosis** = unique to DM (other conditions: afferent only)
- ★ **Initial ↑GFR (hyperfiltration)** → eventual decline = natural history

## Mnemonics

- **Screening timing**: "T1 = Five years; T2 = Today"
- **Treatment pillars**: "SAFE" — SGLT2i, ACEI/ARB, Finerenone, Exercise/lifestyle
- **KW nodules**: "KW = Kidney Wrecking" (pathognomonic)

## Common MCQ Topics

1. Screening intervals for diabetic nephropathy
2. Kimmelstiel-Wilson nodules — pathognomonic finding
3. ACEI/ARB — when to start, when to suspect renal artery stenosis
4. SGLT2 inhibitor renal benefit mechanism
5. When to suspect non-diabetic kidney disease in a diabetic'

# diabetic-retinopathy
DIR="$BASE/endocrinology/diabetic-retinopathy"
write_meta "$DIR" 'title: "Diabetic Retinopathy"
slug: diabetic-retinopathy
depth: "UG"
highYield: true
nmc_codes:
  - "IM11.13"
prerequisites:
  - "diabetes-mellitus"
related_topics:
  - "diabetic-nephropathy"
  - "diabetes-mellitus-type-2"'

write_if_missing "$DIR" "explorer.md" '# Diabetic Retinopathy — Explorer

## Overview

**Diabetic retinopathy (DR)** is the leading cause of **preventable blindness** in working-age adults (20-74 years). It is a microvascular complication affecting retinal blood vessels. Risk increases with duration of DM and poor glycemic control. Nearly all T1DM and >60% T2DM patients develop some DR within 20 years.

## Key Points

- **Leading cause of blindness** in 20-74 age group
- Classified: **Non-proliferative (NPDR)** and **Proliferative (PDR)**
- NPDR features: microaneurysms (earliest), dot/blot hemorrhages, hard exudates, cotton wool spots
- PDR features: **neovascularization** (hallmark) — risk of vitreous hemorrhage, retinal detachment
- **Macular edema** can occur at any stage — MC cause of vision loss in DR
- Screening: annual dilated fundoscopy (T1DM: 5 years post-dx; T2DM: at diagnosis)
- Treatment: laser photocoagulation, anti-VEGF (ranibizumab, aflibercept, bevacizumab)

## Definition & Classification

### Non-Proliferative DR (NPDR)

| Severity | Features |
|----------|----------|
| **Mild** | Microaneurysms only |
| **Moderate** | Microaneurysms + dot/blot hemorrhages + hard exudates |
| **Severe** | 4-2-1 rule: hemorrhages in 4 quadrants, OR venous beading in 2 quadrants, OR IRMA in 1 quadrant |
| **Very Severe** | 2 or more of severe NPDR criteria |

### Proliferative DR (PDR)
- **Neovascularization** of disc (NVD) or elsewhere (NVE)
- High-risk: NVD >1/3 disc area, any NVD with vitreous hemorrhage, NVE >1/2 disc area with vitreous hemorrhage

### Diabetic Macular Edema (DME)
- Thickening/edema of macula due to vascular leakage
- Can occur at any stage of DR
- **Most common cause of visual impairment** in diabetic patients

## Etiology & Pathophysiology

### Risk Factors
- **Duration of DM** (strongest risk factor)
- Poor glycemic control (HbA1c)
- Hypertension, dyslipidemia
- Pregnancy (may worsen DR)
- Nephropathy (marker of microvascular disease)

### Pathophysiology
1. **Chronic hyperglycemia** → pericyte loss, basement membrane thickening
2. **Capillary occlusion** → retinal ischemia
3. **Microaneurysm formation** → leakage → hemorrhages, edema, hard exudates
4. **Cotton wool spots** = nerve fiber layer infarcts (soft exudates)
5. **Ischemia** → **VEGF release** → **neovascularization** (PDR)
6. New vessels are fragile → **vitreous hemorrhage**, fibrovascular proliferation → **tractional retinal detachment**

## Clinical Features

- **Early NPDR**: usually asymptomatic — detected on screening
- **Advanced NPDR/PDR**: blurred vision, floaters, visual field defects
- **Vitreous hemorrhage**: sudden painless loss of vision, floaters, "red haze"
- **Tractional retinal detachment**: progressive visual field loss, curtain-like vision loss
- **Macular edema**: central vision loss, difficulty reading, distorted vision

### Fundoscopy Findings
- **Microaneurysms**: small red dots (earliest sign)
- **Dot and blot hemorrhages**: deeper retinal hemorrhages
- **Hard exudates**: yellow, waxy deposits (lipid leakage) — often ring-shaped around macula
- **Cotton wool spots**: fluffy white patches (nerve fiber infarcts)
- **Venous beading, IRMA**: severe NPDR indicators
- **Neovascularization**: fine, irregular new vessels (PDR hallmark)
- **Vitreous hemorrhage**: obscured fundus view

## Diagnosis

- **Dilated fundoscopy**: gold standard screening method
- **Fundus photography**: documentation, telemedicine screening
- **Fluorescein angiography (FFA)**: shows microaneurysms, capillary non-perfusion, neovascularization, leakage
- **Optical coherence tomography (OCT)**: quantifies macular edema thickness — essential for DME diagnosis
- **Ultra-widefield imaging**: peripheral retinal assessment

### Screening Schedule
- T1DM: annually starting **5 years** after diagnosis
- T2DM: **at diagnosis**, then annually
- Pregnancy: before conception or 1st trimester, then each trimester
- More frequent if DR detected

## Management

### Prevention
- **Tight glycemic control**: HbA1c <7% (DCCT/UKPDS trials)
- **Blood pressure control**: <130/80 mmHg
- **Lipid management**: statins, fenofibrate (FIELD, ACCORD-Eye)
- **Regular screening**: as per schedule

### Mild-Moderate NPDR
- Observation with regular follow-up
- Optimize glycemia, BP, lipids

### Severe NPDR / PDR
- **Panretinal photocoagulation (PRP)**: scatter laser to ischemic retina → regresses neovascularization
- **Anti-VEGF injections**: ranibizumab, aflibercept, bevacizumab — can be used instead of/with PRP
- Protocol S: anti-VEGF non-inferior to PRP for PDR

### Diabetic Macular Edema
- **Anti-VEGF intravitreal injections** = first-line (RISE, RIDE, VIVID, VISTA trials)
- **Focal/grid laser photocoagulation**: if anti-VEGF unavailable or as adjunct
- **Intravitreal steroids** (dexamethasone implant, fluocinolone): pseudophakic/refractory cases

### Vitreous Hemorrhage / Retinal Detachment
- **Pars plana vitrectomy**: non-clearing vitreous hemorrhage, tractional retinal detachment involving macula

## Complications

- **Blindness**: preventable with screening and treatment
- **Vitreous hemorrhage**: sudden vision loss
- **Tractional retinal detachment**: progressive, requires surgery
- **Neovascular glaucoma**: new vessels obstruct aqueous drainage → raised IOP
- **Laser complications**: peripheral visual field loss, night vision issues (PRP)
- **Anti-VEGF risks**: endophthalmitis, retinal detachment (rare)'

write_if_missing "$DIR" "exam-prep.md" '# Diabetic Retinopathy — Exam Prep

## Quick Summary

Leading cause of preventable blindness (20-74y). NPDR: microaneurysms → hemorrhages → exudates. PDR: neovascularization → vitreous hemorrhage → retinal detachment. DME = MC cause of vision loss. Screen annually. Treatment: PRP for PDR, anti-VEGF for DME. 4-2-1 rule for severe NPDR.

## High Yield Points ★

- ★ **Microaneurysms** = earliest fundoscopic finding in DR
- ★ **4-2-1 rule** for severe NPDR (hemorrhages in 4, beading in 2, IRMA in 1 quadrant)
- ★ **Neovascularization** = hallmark of proliferative DR (VEGF-driven)
- ★ **DME** = most common cause of visual impairment in DM (can occur at any DR stage)
- ★ **Anti-VEGF** = first-line for DME
- ★ **PRP (panretinal photocoagulation)** = standard for PDR
- ★ **Hard exudates** = lipid deposits; **Cotton wool spots** = nerve fiber infarcts
- ★ **Duration of DM** = strongest risk factor
- ★ **DCCT/UKPDS**: tight glycemic control reduces DR progression
- ★ **Neovascular glaucoma** = dreaded complication of PDR

## Mnemonics

- **NPDR progression**: "Mike Hates Eating Cotton" — Microaneurysms, Hemorrhages, Exudates, Cotton wool spots
- **4-2-1 rule**: "4 Hemorrhages, 2 Veins, 1 IRMA = Severe NPDR"
- **PDR = VEGF = Vision-Endangering Growth Factor**

## Common MCQ Topics

1. Earliest fundoscopic finding (microaneurysms)
2. 4-2-1 rule classification
3. DME treatment (anti-VEGF first-line)
4. When to do PRP vs anti-VEGF
5. Screening schedule (T1 vs T2DM)
6. Neovascular glaucoma mechanism'

# graves-disease
DIR="$BASE/endocrinology/graves-disease"
write_meta "$DIR" 'title: "Graves Disease"
slug: graves-disease
depth: "UG"
highYield: true
nmc_codes:
  - "IM10.7"
prerequisites:
  - "hyperthyroidism"
related_topics:
  - "thyroid-storm"
  - "hypothyroidism"'

write_if_missing "$DIR" "explorer.md" '# Graves Disease — Explorer

## Overview

**Graves disease** is the most common cause of **hyperthyroidism** (60-80% of cases). It is an **autoimmune** disorder caused by **thyroid-stimulating immunoglobulins (TSI)** that activate the TSH receptor, leading to diffuse thyroid hyperplasia and excess thyroid hormone production. Peak incidence: women aged 20-40.

## Key Points

- **Most common cause of hyperthyroidism** overall
- **Autoimmune**: TSH receptor-stimulating antibodies (TSI/TRAb)
- Classic triad: **hyperthyroidism + diffuse goiter + ophthalmopathy**
- Unique features: **Graves ophthalmopathy**, **pretibial myxedema**, **thyroid acropachy**
- Diffusely increased uptake on **radioactive iodine uptake (RAIU) scan**
- Treatment: **antithyroid drugs (ATDs)**, radioactive iodine (RAI), surgery

## Definition & Classification

### Graves Disease Features (unique vs general hyperthyroidism)

| Feature | Graves-Specific? |
|---------|-----------------|
| Diffuse goiter with bruit | Relatively specific |
| **Ophthalmopathy** | YES — unique to Graves |
| **Pretibial myxedema** | YES — unique to Graves |
| **Thyroid acropachy** | YES — unique to Graves |
| Tachycardia, tremor, weight loss | General hyperthyroidism |

## Etiology & Pathophysiology

### Autoimmune Mechanism
- **TSI (thyroid-stimulating immunoglobulins)** bind and activate TSH receptor
- → Continuous stimulation → thyroid hyperplasia + excess T3/T4
- → Independent of TSH (TSH is suppressed by negative feedback)
- **HLA-DR3** association, female predominance (F:M = 5-10:1)

### Risk Factors
- Female sex, age 20-40
- Family history of autoimmune thyroid disease
- Other autoimmune conditions (T1DM, vitiligo, pernicious anemia, myasthenia gravis)
- Smoking (especially for ophthalmopathy)
- Stress, postpartum period
- High iodine intake (Jod-Basedow phenomenon)

### Ophthalmopathy Pathogenesis
- TSH receptors on orbital fibroblasts → inflammation, GAG deposition
- → Extraocular muscle enlargement, orbital fat expansion
- → Proptosis, diplopia, optic nerve compression
- Can occur before, during, or after hyperthyroidism treatment
- **Smoking** strongly worsens ophthalmopathy

## Clinical Features

### Hyperthyroidism Symptoms
- Weight loss despite increased appetite
- Heat intolerance, excessive sweating
- Tremor, anxiety, irritability, insomnia
- Palpitations, tachycardia (AF in elderly)
- Diarrhea, increased bowel frequency
- Menstrual irregularity (oligomenorrhea)
- Proximal myopathy

### Graves-Specific Features
- **Diffuse, non-tender goiter** with thyroid bruit
- **Graves ophthalmopathy (GO)**: lid lag, lid retraction, proptosis (exophthalmos), periorbital edema, diplopia, optic neuropathy
  - **CAS (Clinical Activity Score)** to assess activity
  - Severe: exposure keratopathy, compressive optic neuropathy (emergency)
- **Pretibial myxedema** (dermopathy): raised, waxy, orange-peel lesion on shins
- **Thyroid acropachy**: digital clubbing (rare, associated with severe disease)
- **Onycholysis** (Plummer nails)

### Eye Signs
- **Dalrymple sign**: lid retraction (white sclera visible above iris)
- **Von Graefe sign**: lid lag on downward gaze
- **Stellwag sign**: infrequent blinking
- **Joffroy sign**: absent forehead wrinkling on upward gaze
- **Möbius sign**: poor convergence

## Diagnosis

### Labs
- **TSH**: suppressed (<0.1 mIU/L)
- **Free T4**: elevated (free T3 may be elevated alone in T3 thyrotoxicosis)
- **TSH receptor antibodies (TRAb/TSI)**: positive (diagnostic, >95% sensitive)
- **Anti-TPO antibodies**: may be positive (less specific)

### Imaging
- **Radioactive iodine uptake (RAIU)**: diffusely increased uptake (vs. patchy in toxic MNG, focal in toxic adenoma, low in thyroiditis)
- **Thyroid ultrasound**: diffusely enlarged, increased vascularity ("thyroid inferno" on Doppler)
- **CT/MRI orbits**: for ophthalmopathy — extraocular muscle enlargement (inferior and medial recti most commonly affected)

### Diagnosis usually clinical + lab
- Hyperthyroidism + diffuse goiter + ophthalmopathy + positive TRAb → diagnosis confirmed
- RAIU scan mainly to differentiate from thyroiditis or toxic nodule

## Management

### Antithyroid Drugs (ATDs)
- **Methimazole (carbimazole)**: first-line (except 1st trimester pregnancy)
  - Longer half-life, once-daily dosing, fewer side effects
- **Propylthiouracil (PTU)**: preferred in 1st trimester (methimazole teratogenic — aplasia cutis, choanal atresia)
  - Also preferred in thyroid storm (blocks T4→T3 conversion)
- **Side effects**: agranulocytosis (both; 0.2-0.5%), hepatotoxicity (PTU worse), rash
- **Duration**: 12-18 months; ~50% remission rate
- Monitor TRAb — decreasing levels predict remission

### Radioactive Iodine (RAI — I-131)
- **Definitive treatment**: most common in USA
- Contraindicated: pregnancy, breastfeeding, severe active ophthalmopathy
- Usually causes hypothyroidism (desired outcome → lifelong levothyroxine)
- May worsen ophthalmopathy — give steroid prophylaxis if moderate GO

### Surgery (Total/Near-Total Thyroidectomy)
- Indications: large goiter, suspicious nodule, severe ophthalmopathy, patient preference, ATD failure
- Prepare with ATDs + beta-blocker + potassium iodide (Lugol) 7-10 days pre-op
- Risks: recurrent laryngeal nerve injury, hypoparathyroidism, bleeding

### Adjunct
- **Beta-blockers** (propranolol): symptomatic relief — blocks adrenergic symptoms + inhibits T4→T3
- Not a definitive treatment

### Ophthalmopathy Management
- **Mild**: lubricating eye drops, sunglasses, elevate head of bed
- **Moderate-Severe active**: IV methylprednisolone pulses, teprotumumab (anti-IGF1R — FDA approved)
- **Sight-threatening**: urgent surgical decompression
- **Stable inactive**: rehabilitative surgery (strabismus, lid, decompression)
- **Smoking cessation** — critical

## Complications

- **Thyroid storm** (life-threatening — see thyroid-storm topic)
- **Atrial fibrillation** (especially elderly)
- **Osteoporosis** (chronic thyrotoxicosis)
- **Ophthalmopathy complications**: corneal ulceration, optic neuropathy, blindness
- **Heart failure** (high-output)
- **Agranulocytosis** from ATDs (sore throat + fever → stop drug, check WBC)'

write_if_missing "$DIR" "exam-prep.md" '# Graves Disease — Exam Prep

## Quick Summary

MC cause of hyperthyroidism. Autoimmune — TSI activates TSH receptor. Triad: hyperthyroidism + goiter + ophthalmopathy. Unique: ophthalmopathy, pretibial myxedema, acropachy. Dx: ↓TSH, ↑FT4, +TRAb, diffuse RAIU uptake. Tx: methimazole (1st line), RAI, or surgery. Propranolol for symptoms. PTU in 1st trimester and thyroid storm.

## High Yield Points ★

- ★ **TSI/TRAb** = diagnostic antibody (stimulates TSH receptor)
- ★ **Ophthalmopathy** = only in Graves (not other causes of hyperthyroidism)
- ★ **Methimazole**: first-line ATD; **PTU**: 1st trimester + thyroid storm
- ★ **Agranulocytosis**: rare but serious ATD side effect — stop drug if sore throat + fever
- ★ **RAI** worsens ophthalmopathy → give steroid cover in moderate GO
- ★ **RAIU scan**: diffuse uptake (Graves) vs low uptake (thyroiditis) vs focal (toxic adenoma)
- ★ **Smoking** strongly worsens Graves ophthalmopathy
- ★ **Inferior rectus** = most commonly affected extraocular muscle
- ★ **Pretibial myxedema**: non-pitting, raised, waxy lesion on shins (Graves-specific)

## Mnemonics

- **Graves triad**: "GOT" — Goiter, Ophthalmopathy, Thyrotoxicosis
- **Eye signs**: "DVSJ" — Dalrymple (lid retraction), Von Graefe (lid lag), Stellwag (no blink), Joffroy (no forehead wrinkle)
- **PTU in Pregnancy**: "PTU = Pregnancy Trimester Uno"
- **Graves-only features**: "POEM" — Pretibial myxedema, Ophthalmopathy, Exophthalmos, Myxedema

## Common MCQ Topics

1. Most common cause of hyperthyroidism (Graves)
2. RAIU pattern in different thyroid conditions
3. ATD choice in pregnancy (PTU 1st trimester)
4. Agranulocytosis management
5. Ophthalmopathy treatment algorithm
6. Thyroid storm management'

echo "=== First batch of endocrinology done ==="
