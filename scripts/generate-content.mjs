#!/usr/bin/env node
/**
 * Generate explorer.md and exam-prep.md for all medicine topics
 * Contains comprehensive medical knowledge database
 */

import { writeFileSync, existsSync, readdirSync, statSync, readFileSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

const CONTENT_DIR = join(import.meta.dirname, '..', 'content', 'medicine');

function getAllTopics() {
  const topics = [];
  const subs = readdirSync(CONTENT_DIR).filter(d => statSync(join(CONTENT_DIR, d)).isDirectory());
  for (const sub of subs) {
    const subDir = join(CONTENT_DIR, sub);
    const dirs = readdirSync(subDir).filter(d => statSync(join(subDir, d)).isDirectory());
    for (const slug of dirs) {
      const path = join(subDir, slug);
      let title = slug;
      try {
        const meta = YAML.parse(readFileSync(join(path, '_meta.yaml'), 'utf-8'));
        title = meta.title || slug;
      } catch(e) {}
      topics.push({ subspecialty: sub, slug, path, title });
    }
  }
  return topics;
}

// ============================================================================
// COMPREHENSIVE MEDICAL CONTENT DATABASE
// Each key is "subspecialty/slug"
// ============================================================================
const DB = {};

// Helper to register topics
function reg(key, data) { DB[key] = data; }

// ============================================================================
// CARDIOLOGY
// ============================================================================

reg('cardiology/hypertension', {
  explorer: `# Hypertension — Explorer

## Overview

**Hypertension (HTN)** is defined as sustained systolic BP ≥140 mmHg and/or diastolic BP ≥90 mmHg. It is the most common modifiable cardiovascular risk factor, affecting ~30% of adults worldwide. Primary (essential) HTN accounts for 90-95% of cases.

## Key Points

- Definition: SBP ≥140 and/or DBP ≥90 mmHg (ACC/AHA 2017: ≥130/80)
- 90-95% is primary (essential); 5-10% is secondary
- Silent killer — often asymptomatic until target organ damage
- Target organs: Heart (LVH, CAD, HF), Brain (stroke), Kidney (CKD), Eyes (retinopathy)
- First-line drugs: ACEi/ARBs, CCBs, Thiazide diuretics
- Keith-Wagener-Barker classification for hypertensive retinopathy (Grade I-IV)
- JNC/ACC-AHA target: <130/80 for most high-risk patients

## Definition & Classification

**JNC/ACC-AHA Classification:**

| Category | SBP (mmHg) | DBP (mmHg) |
|----------|-----------|------------|
| Normal | <120 | <80 |
| Elevated | 120-129 | <80 |
| Stage 1 HTN | 130-139 | 80-89 |
| Stage 2 HTN | ≥140 | ≥90 |
| Hypertensive Crisis | >180 | >120 |

**Types:**
- **Primary (Essential):** 90-95%, multifactorial, polygenic
- **Secondary:** 5-10%, identifiable cause (renal, endocrine, vascular)
- **White coat HTN:** Elevated in clinic, normal at home
- **Masked HTN:** Normal in clinic, elevated at home

## Etiology & Pathophysiology

**Primary HTN — Mechanisms:**
- Increased peripheral vascular resistance (main mechanism)
- RAAS activation
- Sympathetic nervous system overactivity
- Endothelial dysfunction (↓NO)
- Genetic factors (polygenic)

**Risk factors:** Age, obesity, high salt intake (>5g/day), alcohol, sedentary lifestyle, family history, smoking, chronic stress

**Pathological changes:**
- **Arterioles:** Hyaline arteriolosclerosis (benign HTN); Hyperplastic arteriolosclerosis with onion-skin appearance (malignant HTN)
- **Heart:** Concentric LVH → diastolic dysfunction → systolic dysfunction
- **Kidney:** Benign nephrosclerosis → CKD

## Clinical Features

**Usually asymptomatic** — detected on routine screening

**Symptoms when present:**
- Headache (occipital, early morning)
- Dizziness, visual disturbances
- Epistaxis
- Dyspnea on exertion (LVH)

**Target organ damage:**

| Organ | Manifestation |
|-------|--------------|
| Heart | LVH, CAD, HF, aortic dissection |
| Brain | Stroke, TIA, hypertensive encephalopathy, vascular dementia |
| Kidney | Proteinuria, elevated creatinine, CKD |
| Eyes | Keith-Wagener-Barker Retinopathy |
| Vessels | PAD, aortic aneurysm |

**Hypertensive Retinopathy (Keith-Wagener-Barker):**
- **Grade I:** Arteriolar narrowing (silver wiring)
- **Grade II:** AV nipping (arteriovenous crossing changes)
- **Grade III:** Flame hemorrhages, cotton wool spots, hard exudates
- **Grade IV:** Papilledema (= **malignant HTN**)

## Diagnosis

**Measurement technique:**
- Rest 5 min, seated, arm at heart level, appropriate cuff size
- Average of ≥2 readings on ≥2 separate occasions
- **ABPM (24-hour ambulatory):** Gold standard for diagnosis
- **HBPM:** Home blood pressure monitoring

**Investigations:**
- **Basic:** CBC, RFT (creatinine, BUN), electrolytes, fasting glucose, HbA1c, lipid profile, urinalysis, ECG
- **Target organ assessment:** Echocardiography (LVH), fundoscopy, urine albumin-creatinine ratio (ACR)
- **If secondary suspected:** Renal Doppler, aldosterone/renin ratio, 24-hr urine catecholamines

## Management

**Lifestyle modifications (ALL patients):**
- **DASH diet** (fruits, vegetables, low-fat dairy, reduced saturated fat)
- Salt restriction (<5 g/day)
- Weight loss (BMI <25)
- Regular aerobic exercise (30 min/day, 5 days/week)
- Limit alcohol (≤2 drinks/day men, ≤1 women)
- Smoking cessation

**Pharmacotherapy:**

| Drug Class | Preferred In | Avoid In |
|-----------|-------------|----------|
| ACEi/ARB | DM, CKD, proteinuria, HF, post-MI | Pregnancy, bilateral RAS, hyperkalemia |
| CCB (Amlodipine) | Elderly, ISH, CAD | HFrEF (verapamil/diltiazem) |
| Thiazide | Elderly, osteoporosis, ISH | Gout, severe hypokalemia |
| Beta-blocker | Post-MI, HFrEF, tachycardia | Asthma, bradycardia, PVD |

**BP Targets:**
- General: <130/80 mmHg (ACC/AHA) or <140/90 (JNC 8)
- Diabetes/CKD: <130/80
- Elderly (>65): <130 SBP if tolerated

**Resistant HTN:** Uncontrolled on 3 drugs (including diuretic) at optimal doses → add **spironolactone** (PATHWAY-2 trial)

## Complications & Prognosis

**Complications of uncontrolled HTN:**
- Cardiac: LVH, CAD/MI, HF, aortic dissection
- Cerebral: Ischemic/hemorrhagic stroke, TIA, vascular dementia
- Renal: Hypertensive nephrosclerosis, CKD/ESRD
- Vascular: PAD, aortic aneurysm/dissection
- Ocular: Hypertensive retinopathy, retinal vein occlusion

**Prognosis:**
- Every 20 mmHg ↑SBP or 10 mmHg ↑DBP → **doubles** CV mortality
- Well-controlled HTN reduces: Stroke by 35-40%, MI by 20-25%, HF by 50%
`,
  examPrep: `# Hypertension — Exam Prep

## Quick Summary

Hypertension (≥140/90 or ≥130/80 ACC-AHA) is the commonest modifiable CV risk factor. 90-95% is essential. Target organ damage affects heart, brain, kidney, eyes. First-line: ACEi/ARB, CCB, or thiazide diuretic.

## High Yield Points

- ★ JNC: Normal <120/80, Elevated 120-129/<80, Stage 1 130-139/80-89, Stage 2 ≥140/≥90
- ★ Most common cause of LVH: **Hypertension**
- ★ Hyaline arteriolosclerosis → Benign HTN; Hyperplastic (onion-skin) → **Malignant HTN**
- ★ Keith-Wagener Grade IV: **Papilledema** = malignant hypertension
- ★ ACEi/ARB: First choice in DM + HTN, proteinuria, post-MI, HFrEF
- ★ ABPM is **gold standard** for HTN diagnosis
- ★ Every 20/10 mmHg rise → doubles CV mortality
- ★ Resistant HTN → add **spironolactone** (PATHWAY-2 trial)
- ★ ACEi/ARB **contraindicated** in pregnancy (use labetalol, methyldopa, nifedipine)

## Mnemonics

- **ABCDE of HTN drugs:** ACEi/ARB, Beta-blocker, CCB, Diuretic, Everything else
- **HTN in pregnancy drugs:** "Ladies Make Nifty" — Labetalol, Methyldopa, Nifedipine

## Common MCQ Topics

1. Classification of HTN (JNC/ACC-AHA thresholds)
2. First-line drug for HTN with diabetes/CKD
3. Keith-Wagener-Barker grading of retinopathy
4. Target BP in different populations
5. Drug contraindications (ACEi in pregnancy, BB in asthma)
6. Hyaline vs hyperplastic arteriolosclerosis
7. Resistant HTN management

## Differential Diagnosis

- White coat hypertension
- Masked hypertension
- Secondary hypertension
- Pseudohypertension (calcified arteries — Osler sign positive)
- Anxiety/pain-related elevation
`,
});

reg('cardiology/secondary-hypertension', {
  explorer: `# Secondary Hypertension — Explorer

## Overview

**Secondary hypertension** accounts for 5-10% of all HTN cases and is caused by an identifiable underlying condition. Unlike essential HTN, it is potentially **curable** if the cause is addressed. It should be suspected in young patients, resistant HTN, or those with specific clinical clues.

## Key Points

- Accounts for 5-10% of all hypertension
- Most common cause: **Renal parenchymal disease** (CKD)
- Most common surgically curable: **Renal artery stenosis** (renovascular HTN)
- Most common endocrine cause: **Primary aldosteronism** (Conn syndrome)
- Suspect when: Age <30 or >55, resistant HTN, sudden onset, hypokalemia
- Pheochromocytoma: Paroxysmal HTN + triad (headache, sweating, palpitations)
- Screening: Renal function, electrolytes, aldosterone/renin ratio, catecholamines

## Definition & Classification

| Category | Examples |
|----------|----------|
| **Renal parenchymal** | CKD, glomerulonephritis, polycystic kidney disease |
| **Renovascular** | Atherosclerotic RAS, fibromuscular dysplasia (FMD) |
| **Endocrine** | Primary aldosteronism, pheochromocytoma, Cushing syndrome, thyroid disorders, acromegaly |
| **Vascular** | Coarctation of aorta |
| **Drug-induced** | NSAIDs, OCPs, corticosteroids, erythropoietin, cyclosporine |
| **Others** | Obstructive sleep apnea, pregnancy (pre-eclampsia) |

## Etiology & Pathophysiology

**Renal parenchymal disease:** Volume overload + RAAS activation → most common cause overall

**Renovascular HTN:**
- Renal artery stenosis → ↓renal perfusion → RAAS activation → HTN
- Young females: **Fibromuscular dysplasia** (string-of-beads on angiography)
- Elderly males: **Atherosclerotic** renal artery stenosis

**Primary aldosteronism (Conn syndrome):**
- Autonomous aldosterone secretion → Na⁺ retention + K⁺ wasting
- HTN + **hypokalemia** + metabolic alkalosis
- Types: Adrenal adenoma (60-70%), bilateral hyperplasia (30-40%)

**Pheochromocytoma:**
- Catecholamine-secreting tumor of adrenal medulla
- Rule of 10s: 10% bilateral, 10% malignant, 10% extra-adrenal (paraganglioma), 10% familial
- Paroxysmal/sustained HTN with triad

**Coarctation of aorta:**
- Upper limb HTN + lower limb hypotension
- Radio-femoral delay, rib notching on CXR

## Clinical Features

**Clues suggesting secondary HTN:**
- Age of onset <30 or >55 years
- Sudden onset or worsening of previously controlled HTN
- **Resistant hypertension** (uncontrolled on ≥3 drugs including diuretic)
- Hypokalemia without diuretics → think aldosteronism
- Paroxysmal symptoms (headache, sweating, palpitations) → pheochromocytoma
- Abdominal bruit → renal artery stenosis
- Radio-femoral delay → coarctation
- Cushingoid features → Cushing syndrome
- Snoring, daytime somnolence, obesity → OSA

## Diagnosis

**Systematic screening approach:**

| Suspicion | Screening Test | Confirmatory |
|-----------|---------------|-------------|
| Renal parenchymal | Creatinine, urinalysis, renal USG | Renal biopsy |
| Renovascular | Duplex USG renal arteries | CT/MR angiography, renal angiography (gold standard) |
| Primary aldosteronism | **Aldosterone/Renin Ratio (ARR >30)** | Saline infusion test, CT adrenals |
| Pheochromocytoma | 24-hr urine metanephrines/catecholamines | CT/MRI abdomen, MIBG scan |
| Cushing syndrome | Overnight dexamethasone suppression test | 24-hr urinary cortisol, IPSS |
| Coarctation | BP in all 4 limbs, Echo | CT aortography |
| Thyroid | TFTs | — |
| OSA | Epworth sleepiness scale | Polysomnography |

## Management

**Principle: Treat the underlying cause**

| Condition | Treatment |
|-----------|-----------|
| Renovascular (FMD) | **Angioplasty** ± stenting (high cure rate) |
| Renovascular (atherosclerotic) | Medical therapy preferred (ASTRAL, CORAL trials) |
| Primary aldosteronism (adenoma) | **Adrenalectomy** (laparoscopic) |
| Primary aldosteronism (hyperplasia) | **Spironolactone** (drug of choice) |
| Pheochromocytoma | **Alpha-blockade first** (phenoxybenzamine) → Beta-blockade → Surgery |
| Cushing | Surgery for underlying cause |
| Coarctation | Surgical repair or balloon angioplasty |
| Drug-induced | Discontinue offending agent |

> ⚠️ **Critical:** In pheochromocytoma, ALWAYS give alpha-blocker BEFORE beta-blocker. Beta-blockade alone → unopposed alpha stimulation → hypertensive crisis.

## Complications & Prognosis

- Untreated: Accelerated target organ damage
- FMD: Excellent prognosis with angioplasty (cure 50-70%)
- Primary aldosteronism: Good if detected early; long-standing → cardiac/renal damage
- Pheochromocytoma: Crisis during surgery if undiagnosed → fatal
- Many causes are **curable** with appropriate treatment
`,
  examPrep: `# Secondary Hypertension — Exam Prep

## Quick Summary

Secondary HTN (5-10% of cases) has an identifiable cause. Most common: renal parenchymal disease. Most common surgically curable: renovascular HTN. Most common endocrine: primary aldosteronism. Diagnosis requires targeted screening based on clinical clues.

## High Yield Points

- ★ Most common cause: **Renal parenchymal disease**
- ★ Most common surgically curable: **Renal artery stenosis**
- ★ Most common endocrine cause: **Primary aldosteronism** (Conn syndrome)
- ★ Pheochromocytoma rule of 10s: 10% bilateral, 10% malignant, 10% extra-adrenal, 10% familial
- ★ **Alpha-blockade BEFORE beta-blockade** in pheochromocytoma
- ★ ARR (Aldosterone/Renin Ratio) >30 with aldosterone >15 ng/dL → primary aldosteronism
- ★ FMD: Young female + string-of-beads on angiography
- ★ Coarctation: Upper limb HTN + radio-femoral delay + rib notching

## Mnemonics

- **SECONDARY:** Sleep apnea, Endocrine, Coarctation, OCP/drugs, Nephro (renal), Drug abuse, Aldosteronism, Renovascular, pheochromocYtoma

## Common MCQ Topics

1. Most common cause of secondary HTN
2. Investigation of choice for renovascular HTN
3. Drug to give FIRST in pheochromocytoma (alpha-blocker)
4. Screening test for primary aldosteronism (ARR)
5. Coarctation of aorta — classical signs and CXR findings
6. FMD — demographics and angiographic appearance
7. Why beta-blockers alone are dangerous in pheochromocytoma

## Differential Diagnosis

- Essential (primary) hypertension
- White coat hypertension
- Medication non-compliance
- Pseudoresistance (improper BP measurement)
`,
});

reg('cardiology/atrial-fibrillation', {
  explorer: `# Atrial Fibrillation — Explorer

## Overview

**Atrial fibrillation (AF)** is the most common sustained cardiac arrhythmia, characterized by rapid, irregular atrial activation (350-600/min) with an irregularly irregular ventricular response. It affects ~2% of the population and is a major risk factor for **stroke** (5x increased risk) and heart failure.

## Key Points

- Most common sustained cardiac arrhythmia
- ECG: **Absent P waves + irregularly irregular RR intervals** + fibrillatory baseline
- Major risk: Thromboembolism/stroke (5x increased)
- **CHA₂DS₂-VASc** score guides anticoagulation
- Rate control: Beta-blockers, diltiazem/verapamil, digoxin
- Rhythm control: Amiodarone, flecainide, cardioversion, catheter ablation
- Anticoagulation: DOACs preferred over warfarin (except valvular AF)
- Most common cause: **Hypertension**; Most common valvular: **Mitral stenosis**

## Definition & Classification

| Type | Definition |
|------|-----------|
| **Paroxysmal** | Self-terminating within 7 days |
| **Persistent** | >7 days, requires cardioversion |
| **Long-standing persistent** | >12 months, rhythm control still attempted |
| **Permanent** | Accepted; no rhythm control attempted |

**Valvular AF:** Mitral stenosis or mechanical prosthetic valve → requires warfarin
**Non-valvular AF:** All other causes → DOACs preferred

## Etiology & Pathophysiology

**Causes — PIRATES:**
- **P**ulmonary: PE, COPD, pneumonia
- **I**schemic heart disease
- **R**heumatic heart disease (mitral stenosis)
- **A**lcohol (holiday heart syndrome)
- **T**hyrotoxicosis
- **E**lectrolytes, Elderly
- **S**epsis, Surgery (post-cardiac)

**Pathophysiology:**
- Multiple re-entrant wavelets in atria
- Pulmonary vein foci (common trigger — target for ablation)
- Atrial remodeling: **"AF begets AF"** (electrical and structural)
- Loss of atrial kick → ↓cardiac output by 15-25%
- Blood stasis in **left atrial appendage (LAA)** → thrombus → embolism → stroke

## Clinical Features

**Symptoms:**
- Palpitations (irregular, rapid)
- Dyspnea on exertion
- Fatigue, dizziness, exercise intolerance
- Syncope (rare)
- Stroke/TIA (may be first presentation)
- Heart failure (tachycardia-mediated cardiomyopathy)

**Examination:**
- **Irregularly irregular pulse** (hallmark)
- **Pulse deficit** (apical rate > radial rate)
- Variable intensity of S1
- Signs of underlying cause (mitral stenosis murmur, thyroid signs)

## Diagnosis

**ECG (diagnostic):**
- **No P waves** (replaced by fibrillatory f waves)
- **Irregularly irregular** RR intervals
- Narrow QRS (unless aberrant conduction/BBB)
- Rate: Usually 100-180 bpm (untreated)

**Investigations:**
- TFTs (exclude thyrotoxicosis — mandatory)
- Echocardiography: LA size, LV function, valvular disease
- TEE: Detect LA/LAA thrombus (before cardioversion)
- CBC, RFT, electrolytes, coagulation
- Holter monitor (paroxysmal AF)

**Risk Scores:**
- **CHA₂DS₂-VASc** (stroke risk): CHF(1), HTN(1), Age≥75(2), DM(1), Stroke/TIA(2), Vascular disease(1), Age 65-74(1), Sex-female(1)
- **HAS-BLED** (bleeding risk): HTN, Abnormal renal/liver, Stroke, Bleeding, Labile INR, Elderly, Drugs/alcohol

## Management

**1. Rate Control (preferred in most patients):**
- Target: HR <110 bpm (lenient) or <80 bpm (strict)
- **Beta-blockers** (metoprolol, bisoprolol) — first-line
- **Non-DHP CCBs** (diltiazem, verapamil) — avoid in HFrEF
- **Digoxin** — if sedentary, HF, or adjunct

**2. Rhythm Control (selected patients):**
- Young, symptomatic, first episode, HF
- **Cardioversion:** Electrical (more effective) or pharmacological
  - If AF **>48 hours:** Anticoagulate ≥3 weeks before OR TEE to exclude thrombus
  - If AF <48 hours: Cardiovert directly with anticoagulation cover
- **Antiarrhythmic drugs:**
  - Structural heart disease: **Amiodarone** (most effective but toxic)
  - No structural disease: Flecainide, propafenone
- **Catheter ablation:** Pulmonary vein isolation — increasingly first-line in paroxysmal AF

**3. Anticoagulation (stroke prevention):**
- CHA₂DS₂-VASc ≥2 (men) or ≥3 (women): **Anticoagulate**
- CHA₂DS₂-VASc 1 (men) or 2 (women): Consider anticoagulation
- CHA₂DS₂-VASc 0 (men) or 1 (women): No anticoagulation
- **Non-valvular AF:** DOACs preferred (rivaroxaban, apixaban, dabigatran, edoxaban)
- **Valvular AF (MS/mechanical valve):** **Warfarin** (INR 2-3) — DOACs contraindicated
- **LAA occlusion** (Watchman device): If anticoagulation contraindicated

## Complications & Prognosis

- **Stroke:** 5x increased risk; accounts for 15-20% of all strokes
- **Heart failure:** Tachycardia-mediated cardiomyopathy (reversible with rate control)
- **Systemic embolism:** Mesenteric, limb, renal
- **Mortality:** 1.5-2x increased
- **Anticoagulation complications:** Major bleeding, ICH

With proper rate control and anticoagulation, long-term prognosis is good.
`,
  examPrep: `# Atrial Fibrillation — Exam Prep

## Quick Summary

AF is the most common sustained arrhythmia. ECG shows absent P waves + irregularly irregular RR. 5x stroke risk. CHA₂DS₂-VASc guides anticoagulation. Rate control (BB/CCB/digoxin) or rhythm control (cardioversion/ablation). DOACs preferred over warfarin except in valvular AF.

## High Yield Points

- ★ ECG: **No P waves + irregularly irregular RR intervals**
- ★ Most common cause: **Hypertension**; Most common valvular: **Mitral stenosis**
- ★ CHA₂DS₂-VASc: CHF(1), HTN(1), Age≥75(**2**), DM(1), Stroke/TIA(**2**), Vascular(1), Age 65-74(1), Sex-female(1)
- ★ AF >48 hours → anticoagulate **3 weeks** before cardioversion OR do **TEE**
- ★ Valvular AF (MS/prosthetic valve) → **Warfarin only** (DOACs contraindicated)
- ★ Holiday heart syndrome: AF after **acute alcohol binge**
- ★ Pulse deficit = Apical rate > Radial rate
- ★ AF begets AF: Atrial remodeling makes AF self-perpetuating

## Mnemonics

- **PIRATES** for AF causes: Pulmonary, Ischemia, Rheumatic, Alcohol, Thyroid, Electrolytes, Sepsis/Surgery
- **CHA₂DS₂-VASc** — the numbers 2 are Age≥75 and Stroke/TIA (highest risk factors)

## Common MCQ Topics

1. ECG findings in AF
2. CHA₂DS₂-VASc scoring and when to anticoagulate
3. When to anticoagulate before cardioversion (48-hour rule)
4. Rate vs rhythm control — indications for each
5. Drug of choice in AF with HF (digoxin + beta-blocker; avoid verapamil)
6. Valvular vs non-valvular AF — anticoagulation choice
7. Amiodarone toxicities (thyroid, lung, liver, cornea, skin)

## Differential Diagnosis

- Atrial flutter (sawtooth pattern, regular)
- Multifocal atrial tachycardia (MAT) — ≥3 P wave morphologies
- Frequent atrial premature complexes
- Sinus tachycardia with frequent PACs
`,
});

reg('cardiology/dvt-pe-medical', {
  explorer: `# DVT & Pulmonary Embolism — Explorer

## Overview

**Deep vein thrombosis (DVT)** and **pulmonary embolism (PE)** are manifestations of venous thromboembolism (VTE). DVT most commonly affects deep veins of the lower limbs. PE occurs when thrombus embolizes to pulmonary vasculature and can be life-threatening. Together they represent a major cause of preventable hospital deaths.

## Key Points

- DVT + PE = **Venous thromboembolism (VTE)**
- **Virchow triad:** Stasis, endothelial injury, hypercoagulability
- DVT diagnosis: **Compression ultrasonography** (first-line)
- PE diagnosis: **CT Pulmonary Angiography (CTPA)** — investigation of choice
- **D-dimer:** High sensitivity, low specificity — use to **rule OUT** (if negative)
- Massive PE with hemodynamic instability → **Thrombolysis** (alteplase)
- Anticoagulation: LMWH → Warfarin/DOACs for 3-6+ months
- **Wells score** for clinical probability assessment

## Definition & Classification

**DVT:** Thrombus in deep venous system — most commonly iliofemoral and popliteal veins

**PE Classification:**

| Type | Hemodynamics | RV Dysfunction | Management |
|------|-------------|---------------|------------|
| **Massive** | Hypotension/shock (SBP <90) | Yes | Thrombolysis/embolectomy |
| **Submassive** | Normotensive | Yes (echo/BNP/troponin) | Anticoagulation ± thrombolysis |
| **Low-risk** | Normotensive | No | Anticoagulation |

## Etiology & Pathophysiology

**Virchow Triad:**
1. **Stasis:** Immobilization, long travel, surgery, heart failure, pregnancy
2. **Endothelial injury:** Trauma, surgery, central venous catheter
3. **Hypercoagulability:**
   - Inherited: Factor V Leiden (most common), Prothrombin mutation, Protein C/S deficiency, Antithrombin III deficiency
   - Acquired: Malignancy, OCP, pregnancy, antiphospholipid syndrome, nephrotic syndrome

**Major risk factors:** Recent surgery (especially orthopedic), malignancy, immobilization, previous VTE, pregnancy/postpartum, OCP/HRT, obesity

## Clinical Features

**DVT:**
- Unilateral leg swelling, pain, warmth, erythema
- Pitting edema, distended superficial veins
- Calf tenderness (positive Homan sign — unreliable)
- Phlegmasia alba dolens: Painful white leg (venous occlusion)
- **Phlegmasia cerulea dolens:** Painful blue leg (massive venous occlusion → risk of gangrene)

**PE:**
- **Sudden onset dyspnea** (most common symptom)
- Pleuritic chest pain
- Hemoptysis
- Tachycardia, tachypnea
- **Massive PE:** Hypotension, syncope, cardiac arrest, raised JVP
- **CXR findings:** Often normal; Hampton hump (wedge opacity), Westermark sign (oligemia), Fleischner sign (dilated pulmonary artery)

## Diagnosis

**DVT:**
- **Compression USG:** First-line — sensitivity >95% for proximal DVT
- D-dimer: High NPV — negative D-dimer rules out DVT
- Venography: Gold standard (rarely used)
- Wells score for DVT: Guides need for imaging vs D-dimer

**PE:**
- **CTPA:** Investigation of choice — sensitivity >95%
- D-dimer: Normal excludes PE in low-probability patients
- **ECG:** Sinus tachycardia (most common); S₁Q₃T₃ (classic but uncommon ~10-20%); right axis deviation, RBBB
- **ABG:** Hypoxemia + hypocapnia + respiratory alkalosis
- **Echo:** RV dilatation/dysfunction, McConnell sign (RV free wall akinesis with apical sparing)
- **V/Q scan:** If CTPA contraindicated (contrast allergy, CKD)
- **Pulmonary angiography:** Gold standard (invasive, rarely needed)

## Management

**Anticoagulation (cornerstone):**
- **Acute:** LMWH (enoxaparin 1mg/kg BD) or UFH (for massive PE or renal failure)
- **Long-term:** Warfarin (INR 2-3) or DOACs (rivaroxaban, apixaban — no LMWH bridging needed)
- **Duration:**
  - Provoked (surgery/travel): **3 months**
  - Unprovoked: **≥6 months**, consider indefinite
  - Cancer-associated: **LMWH or DOAC indefinitely** (until cancer resolved)

**Massive PE:**
- **Systemic thrombolysis:** Alteplase (tPA) — reduces mortality
- **Surgical embolectomy:** If thrombolysis contraindicated or failed
- **Catheter-directed therapy:** Emerging alternative

**IVC filter:** If anticoagulation absolutely contraindicated or recurrent PE despite anticoagulation

**VTE Prophylaxis:** LMWH ± graduated compression stockings in all hospitalized at-risk patients

## Complications & Prognosis

- **PE:** Most feared complication of DVT (mortality 30% if untreated → <5% with treatment)
- **Post-thrombotic syndrome (PTS):** Chronic venous insufficiency after DVT — occurs in 30-50%
  - Features: Chronic leg swelling, pain, skin changes, venous ulcers
- **CTEPH (Chronic Thromboembolic Pulmonary Hypertension):** After recurrent PE (2-4%)
- **Phlegmasia cerulea dolens:** Venous gangrene from massive DVT
- **Recurrence:** 30% within 10 years if unprovoked
- **HIT (Heparin-Induced Thrombocytopenia):** Paradoxical thrombosis with heparin use
`,
  examPrep: `# DVT & Pulmonary Embolism — Exam Prep

## Quick Summary

VTE = DVT + PE. Virchow triad: stasis, endothelial injury, hypercoagulability. DVT diagnosis: compression USG. PE diagnosis: CTPA. Treatment: anticoagulation (LMWH → warfarin/DOAC). Massive PE with shock → thrombolysis.

## High Yield Points

- ★ Virchow triad: **Stasis, endothelial injury, hypercoagulability**
- ★ Most common inherited thrombophilia: **Factor V Leiden**
- ★ Most common ECG finding in PE: **Sinus tachycardia** (NOT S₁Q₃T₃)
- ★ S₁Q₃T₃ is classic but seen in only **10-20%** of PE
- ★ **CTPA** is investigation of choice for PE diagnosis
- ★ D-dimer: Use to **RULE OUT** (high NPV), not rule in
- ★ Massive PE with shock → **Thrombolysis** (alteplase)
- ★ Cancer-associated VTE → **LMWH or DOAC** (not warfarin)
- ★ Post-thrombotic syndrome: Chronic complication in **30-50%** of DVT

## Mnemonics

- **Virchow Triad (SHE):** Stasis, Hypercoagulability, Endothelial injury
- **PE CXR signs:** Hampton Hump, Westermark sign, Fleischner sign
- **S₁Q₃T₃:** S in I, Q in III, inverted T in III

## Common MCQ Topics

1. Virchow triad components
2. Most common ECG finding in PE
3. Investigation of choice for DVT and PE
4. When to give thrombolysis vs anticoagulation
5. Duration of anticoagulation (provoked vs unprovoked)
6. Wells score interpretation
7. Complications of DVT (PTS, CTEPH)

## Differential Diagnosis

- Cellulitis, Baker cyst rupture, lymphedema (for DVT)
- Pneumonia, MI, aortic dissection, pneumothorax, GERD (for PE)
`,
});

// I'll now create a function to generate content for ALL remaining topics
// using medical knowledge templates organized by subspecialty

function generateTopicContent(subspecialty, slug, title) {
  // This is a comprehensive medical knowledge generator
  // Returns { explorer, examPrep } strings
  
  const key = `${subspecialty}/${slug}`;
  if (DB[key]) return DB[key];
  
  // Generate based on topic knowledge
  return generateFromKnowledge(subspecialty, slug, title);
}

function generateFromKnowledge(sub, slug, title) {
  // Comprehensive medical content generation
  // This produces medically accurate, exam-relevant content
  
  const content = TOPIC_KNOWLEDGE[`${sub}/${slug}`] || getDefaultContent(sub, slug, title);
  return content;
}

// ============================================================================
// MASSIVE TOPIC KNOWLEDGE DATABASE
// Organized by subspecialty — every topic gets unique, accurate content
// ============================================================================

const TOPIC_KNOWLEDGE = {};

function addTopic(key, overview, keyPts, definition, etiology, clinical, diagnosis, management, complications, summary, highYield, mnemonics, mcqs, diffs) {
  const parts = key.split('/');
  const title = parts[1].split('-').map(w => {
    const ab = { 'dvt':'DVT','pe':'PE','ihd':'IHD','copd':'COPD','acs':'ACS','gerd':'GERD','ibs':'IBS','ibd':'IBD','aki':'AKI','ckd':'CKD','dm':'DM','dka':'DKA','hf':'HF','gi':'GI','icu':'ICU','cpr':'CPR','acls':'ACLS','bls':'BLS','atls':'ATLS','hiv':'HIV','aids':'AIDS','sle':'SLE','ards':'ARDS','rta':'RTA','uti':'UTI','sjs':'SJS','ten':'TEN','gbs':'GBS','dic':'DIC','pcos':'PCOS','g6pd':'G6PD','niv':'NIV','em':'EM' };
    return ab[w] || w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');

  TOPIC_KNOWLEDGE[key] = {
    explorer: `# ${title} — Explorer

## Overview

${overview}

## Key Points

${keyPts.map(p => `- ${p}`).join('\n')}

## Definition & Classification

${definition}

## Etiology & Pathophysiology

${etiology}

## Clinical Features

${clinical}

## Diagnosis

${diagnosis}

## Management

${management}

## Complications & Prognosis

${complications}
`,
    examPrep: `# ${title} — Exam Prep

## Quick Summary

${summary}

## High Yield Points

${highYield.map(p => `- ★ ${p}`).join('\n')}

## Mnemonics

${mnemonics.map(m => `- ${m}`).join('\n')}

## Common MCQ Topics

${mcqs.map((t,i) => `${i+1}. ${t}`).join('\n')}

## Differential Diagnosis

${diffs.map(d => `- ${d}`).join('\n')}
`,
  };
}

// ============================================================================
// CARDIOLOGY TOPICS
// ============================================================================

addTopic('cardiology/hypertensive-emergency',
  '**Hypertensive emergency** is severe hypertension (usually SBP >180 and/or DBP >120 mmHg) with evidence of **acute target organ damage**. It requires immediate BP reduction with IV antihypertensives in an ICU setting. Distinguished from hypertensive urgency (severe HTN without organ damage).',
  ['Hypertensive emergency = Severe HTN + **acute target organ damage**', 'Hypertensive urgency = Severe HTN WITHOUT target organ damage', 'Target organs: Brain (encephalopathy, stroke), Heart (MI, HF, dissection), Kidney (AKI), Eyes (papilledema)', 'IV drugs: Labetalol, nitroprusside, nitroglycerin, nicardipine', 'Goal: Reduce MAP by **25% in first hour**, then 160/100 over 2-6 hours', 'Do NOT lower BP too rapidly → watershed infarction risk', 'Aortic dissection: Target SBP <120 in 20 min (esmolol)'],
  '**Hypertensive Emergency:** BP >180/120 mmHg WITH acute target organ damage\n**Hypertensive Urgency:** BP >180/120 mmHg WITHOUT target organ damage\n\n**Target organ damage includes:**\n- Hypertensive encephalopathy\n- Acute MI/unstable angina\n- Acute pulmonary edema\n- Aortic dissection\n- Eclampsia\n- Acute renal failure\n- Grade III-IV retinopathy (flame hemorrhages, papilledema)',
  '**Common precipitants:**\n- Non-compliance with medications (most common)\n- Renovascular disease, pheochromocytoma crisis\n- Pre-eclampsia/eclampsia\n- Drug interactions (MAOi + tyramine), cocaine/amphetamine abuse\n- Renal parenchymal disease\n\n**Pathophysiology:**\nSevere BP elevation → failure of cerebral/renal autoregulation → fibrinoid necrosis of arterioles → end-organ ischemia and damage',
  '**Neurological:** Headache, confusion, visual disturbance, seizures, focal deficits (encephalopathy/stroke)\n**Cardiac:** Chest pain (MI/dissection), dyspnea (pulmonary edema), tearing back pain (dissection)\n**Renal:** Oliguria, hematuria, rising creatinine\n**Ophthalmological:** Blurred vision, papilledema, flame hemorrhages\n\n**Red flags:**\n- Altered sensorium\n- Chest pain with unequal pulses → dissection\n- Seizures\n- Acute pulmonary edema\n- New focal neurological deficit',
  '**Essential investigations:**\n- BP in both arms (asymmetry → dissection)\n- **Fundoscopy:** Grade III/IV retinopathy\n- ECG: LVH, ischemic changes, arrhythmias\n- CBC, RFT, electrolytes, urinalysis\n- CT head (if neurological symptoms)\n- CXR: Cardiomegaly, pulmonary edema, wide mediastinum (dissection)\n- Troponin (if chest pain)\n- CT aorta (if dissection suspected)\n- Urine drug screen (cocaine, amphetamines)',
  '**General Principles:**\n- ICU admission with continuous BP monitoring\n- IV antihypertensives\n- Reduce MAP by **25% in first hour**\n- Then to 160/100 over **2-6 hours**\n- Then gradually to normal over **24-48 hours**\n\n**Drug Selection by Scenario:**\n\n| Scenario | Drug of Choice |\n|----------|----------------|\n| General | **IV Labetalol** or Nicardipine |\n| Aortic dissection | **IV Esmolol** + Nitroprusside (SBP <120 in 20 min) |\n| Acute pulmonary edema | **IV Nitroglycerin** + Furosemide |\n| Eclampsia | **IV MgSO₄** + Labetalol/Hydralazine |\n| Pheochromocytoma | **IV Phentolamine** |\n| ACS | **IV Nitroglycerin** + Esmolol |\n| Renal failure | Fenoldopam, Clevidipine |\n\n> ⚠️ **AVOID** sublingual nifedipine — unpredictable BP drop → stroke/MI',
  '- Stroke (ischemic or hemorrhagic)\n- Myocardial infarction/aortic dissection\n- Acute renal failure\n- PRES (Posterior Reversible Encephalopathy Syndrome)\n- Retinal hemorrhage/detachment\n- **Iatrogenic:** Excessive BP lowering → watershed infarction\n\n**Prognosis:** Without treatment: 1-year mortality >90%. With appropriate management: significantly improved outcomes.',
  'Hypertensive emergency = BP >180/120 with target organ damage (brain, heart, kidney, eyes). Treat with IV drugs in ICU. Reduce MAP by 25% in first hour. Do NOT lower too rapidly. Different drugs for different scenarios.',
  ['Emergency vs Urgency: **Target organ damage** is the differentiator', 'Reduce MAP by **25% in first hour**, then 160/100 over 2-6 hours', 'Aortic dissection: Fastest target — SBP **<120 within 20 minutes**', 'Eclampsia: Drug of choice is **MgSO₄** (not antihypertensive)', 'Sublingual nifedipine is **CONTRAINDICATED** — unpredictable BP drop', 'Nitroprusside prolonged use: **Cyanide toxicity** (treat with sodium thiosulfate)', 'Labetalol: Combined alpha + beta blocker — most versatile IV agent'],
  ['**TARGET organs:** T-TIA/stroke, A-Aortic dissection, R-Renal failure, G-Grade IV retinopathy, E-Encephalopathy, T-cardiac damage'],
  ['Difference between emergency and urgency', 'Rate of BP lowering', 'Drug of choice in aortic dissection (esmolol)', 'Drug of choice in eclampsia (MgSO₄)', 'Why sublingual nifedipine is contraindicated', 'Nitroprusside toxicity'],
  ['Hypertensive urgency', 'Anxiety/panic attack', 'Pain-induced hypertension', 'Thyroid storm', 'Pheochromocytoma crisis']
);

addTopic('cardiology/heart-failure',
  '**Heart failure (HF)** is a clinical syndrome from structural/functional cardiac impairment resulting in inability to fill or eject blood adequately. Classified as HFrEF (EF ≤40%), HFmrEF (EF 41-49%), and HFpEF (EF ≥50%). It is the final common pathway of most cardiac diseases.',
  ['HFrEF (≤40%): Systolic dysfunction — dilated, weak ventricle', 'HFpEF (≥50%): Diastolic dysfunction — stiff, non-compliant ventricle', 'Most common cause: **Ischemic heart disease**', 'NYHA I-IV classification for functional capacity', 'Diagnosis: **BNP/NT-proBNP + Echocardiography**', 'HFrEF drugs with mortality benefit: ACEi/ARNI + BB + MRA + SGLT2i (Fantastic Four)', 'Diuretics: Symptom relief only — NO mortality benefit', 'Device: ICD (EF≤35%), CRT (EF≤35% + LBBB + QRS>150ms)'],
  '**By Ejection Fraction:**\n\n| Type | EF | Mechanism |\n|------|-----|----------|\n| HFrEF | ≤40% | Systolic dysfunction |\n| HFmrEF | 41-49% | Borderline |\n| HFpEF | ≥50% | Diastolic dysfunction |\n\n**NYHA Functional Classification:**\n\n| Class | Description |\n|-------|-------------|\n| I | No limitation |\n| II | Slight limitation — symptoms with ordinary activity |\n| III | Marked limitation — symptoms with less than ordinary activity |\n| IV | Symptoms at rest |\n\n**Framingham Criteria:** 2 major or 1 major + 2 minor for diagnosis',
  '**HFrEF Causes:** IHD (most common), dilated cardiomyopathy, valvular disease, HTN (late), myocarditis\n**HFpEF Causes:** HTN (most common), HCM, restrictive cardiomyopathy, aortic stenosis, aging\n\n**Precipitating factors — FAILURE:**\n- **F**orgot medication (non-compliance)\n- **A**rrhythmia (AF) / Anemia\n- **I**nfection (pneumonia, UTI)\n- **L**ifestyle (salt/fluid excess)\n- **U**pregulators (thyroid, pregnancy)\n- **R**enal failure\n- **E**mbolism (PE)\n\n**Pathophysiology:** ↓CO → neurohormonal activation (RAAS, SNS) → Na/water retention, vasoconstriction → ↑preload + afterload → worsening HF (vicious cycle)',
  '**Left heart failure (backward failure → lungs):**\n- Dyspnea (exertional → orthopnea → PND → rest)\n- Cough, pink frothy sputum (acute pulmonary edema)\n- Bilateral basal crepitations\n- **S3 gallop** (volume overload — best predictor of elevated filling pressure)\n- S4 (diastolic dysfunction/stiff ventricle)\n\n**Right heart failure (backward failure → systemic):**\n- Pedal edema, ascites, anasarca\n- Raised JVP\n- Hepatomegaly (tender, pulsatile in TR)\n- Hepatojugular reflux\n\n**Examination:** Displaced apex (cardiomegaly), S3/S4, functional MR murmur, bilateral crepitations, raised JVP, pedal edema',
  '**Biomarkers:**\n- **BNP >100 pg/mL** or **NT-proBNP >300 pg/mL** → HF likely\n- Normal BNP **rules out** HF (high NPV)\n- Levels correlate with severity and prognosis\n\n**Echocardiography (key investigation):**\n- EF measurement (Simpson biplane method)\n- Chamber sizes, wall motion abnormalities\n- Valvular function, diastolic parameters (E/A, E/e\')\n\n**CXR (classic findings):**\n- Cardiomegaly (CTR >50%)\n- Upper lobe pulmonary venous distension (cephalization)\n- Kerley B lines (interstitial edema)\n- Bilateral pleural effusions (R > L)\n- Bat-wing/butterfly pattern (alveolar edema)\n\n**Other:** ECG (LVH, ischemia, AF), CBC, RFT, LFT, TFTs, iron studies, BNP, coronary angiography if ischemic',
  '**Pharmacotherapy for HFrEF — "Fantastic Four" (all reduce mortality):**\n1. **ACEi/ARB** (or ARNI — sacubitril/valsartan): Blocks RAAS\n2. **Beta-blocker** (bisoprolol, carvedilol, metoprolol succinate): Blocks SNS\n3. **MRA** (spironolactone, eplerenone): Blocks aldosterone\n4. **SGLT2 inhibitor** (dapagliflozin, empagliflozin): CV + renal protection\n\n**Symptom relief (no mortality benefit):**\n- **Diuretics** (furosemide): Volume overload/congestion\n- **Digoxin:** Reduces hospitalizations, improves symptoms\n\n**Special situations:**\n- If intolerant to ACEi/ARB: Hydralazine + Isosorbide dinitrate (A-HeFT, especially African Americans)\n- If HR >70 despite max BB: Add **Ivabradine**\n- ARNI (sacubitril/valsartan): Superior to ACEi (PARADIGM-HF trial)\n\n**Device therapy:**\n- **ICD:** EF ≤35% (primary prevention of sudden cardiac death)\n- **CRT (cardiac resynchronization):** EF ≤35% + LBBB + QRS >150ms + NYHA II-IV\n\n**HFpEF:** Diuretics for congestion, BP control, treat AF, SGLT2 inhibitors (EMPEROR-Preserved)\n\n**Acute HF:**\n- Sit upright, high-flow O₂\n- IV furosemide (40-80mg)\n- IV nitrates (nitroglycerin) if SBP >90\n- NIV (CPAP/BiPAP) for pulmonary edema\n- Inotropes (dobutamine) if cardiogenic shock',
  '- Arrhythmias (AF most common; VT/VF → sudden death)\n- Cardiogenic shock\n- Pulmonary edema\n- Cardiorenal syndrome\n- Cardiac cachexia\n- Thromboembolic events\n- Hepatic congestion (cardiac cirrhosis)\n\n**Prognosis:** 5-year mortality ~50% for HFrEF. Better with guideline-directed medical therapy. NYHA IV: 1-year mortality 50%.',
  'HF = impaired ventricular function. HFrEF (EF≤40%): ACEi/ARNI + BB + MRA + SGLT2i (Fantastic Four). Most common cause: IHD. Diagnosis: BNP + Echo. NYHA I-IV. Diuretics for symptoms only.',
  ['Most common cause of HF: **Ischemic heart disease**', 'HFrEF mortality drugs: **ACEi/ARNI + BB + MRA + SGLT2i** (Fantastic Four)', 'BNP/NT-proBNP: Normal level **rules out** HF', 'S3 gallop → **Volume overload** (systolic HF); S4 → Stiff ventricle (diastolic HF)', 'Diuretics: Symptom relief ONLY — **no mortality benefit**', 'ARNI superior to ACEi alone (PARADIGM-HF trial)', 'CRT indication: EF ≤35% + LBBB + QRS >150ms + NYHA II-IV'],
  ['**FAILURE** precipitants: Forgot meds, Arrhythmia/Anemia, Infection, Lifestyle, Upregulators, Renal failure, Embolism', '**Fantastic Four for HFrEF:** ACEi/ARNI, Beta-blocker, MRA, SGLT2i'],
  ['NYHA classification of HF', 'Drugs with mortality benefit in HFrEF', 'BNP levels and interpretation', 'CXR findings in HF (Kerley B lines, cephalization)', 'Indications for CRT and ICD', 'Acute HF management', 'PARADIGM-HF trial (ARNI vs ACEi)'],
  ['COPD exacerbation', 'Pneumonia', 'PE', 'Nephrotic syndrome (edema)', 'Liver cirrhosis (ascites)', 'Pericardial effusion']
);

addTopic('cardiology/heart-block',
  '**Heart block (AV block)** refers to impaired conduction from atria to ventricles through the AV node/His-Purkinje system. It ranges from first-degree (PR prolongation) to third-degree (complete AV dissociation) and may require permanent pacemaker implantation.',
  ['1st degree: PR >200ms, all P waves conducted — benign', '2nd degree Mobitz I (Wenckebach): Progressive PR prolongation → dropped beat — usually benign', '2nd degree Mobitz II: Constant PR with sudden dropped QRS — **dangerous, needs pacemaker**', '3rd degree (Complete): P waves and QRS completely dissociated — **needs pacemaker**', 'Most common cause: **Idiopathic fibrosis** (Lenegre/Lev disease)', 'Inferior MI → AV nodal block (transient, good prognosis)', 'Anterior MI → Infranodal block (poor prognosis, needs pacing)', 'Congenital CHB: Associated with maternal **anti-Ro/SSA** antibodies'],
  '**AV Block Classification:**\n\n| Degree | ECG | Block Level | Prognosis |\n|--------|-----|------------|----------|\n| 1st | PR >200ms, all conducted | AV node | Benign |\n| 2nd Mobitz I | Progressive PR → dropped beat | AV node | Usually benign |\n| 2nd Mobitz II | Fixed PR + sudden dropped QRS | Below AV node (His/bundle) | Dangerous |\n| 3rd (Complete) | Complete AV dissociation | Variable | Emergency |',
  '**Causes:**\n- **Idiopathic fibrosis:** Lenegre disease (conduction system), Lev disease (calcification of surrounding structures)\n- **Ischemic:** Inferior MI → AV nodal; Anterior MI → infranodal\n- **Drugs:** Beta-blockers, CCBs (verapamil/diltiazem), digoxin, amiodarone\n- **Infections:** Lyme disease (spirochete → heart block), endocarditis, myocarditis\n- **Infiltrative:** Sarcoidosis, amyloidosis\n- **Post-surgical:** Valve replacement, septal myectomy\n- **Congenital:** Neonatal lupus (maternal anti-Ro/SSA antibodies)',
  '**1st degree:** Asymptomatic\n**Mobitz I:** Usually asymptomatic, may notice irregular pulse\n**Mobitz II & Complete block:**\n- **Syncope** (Stokes-Adams attacks — transient asystole)\n- Dizziness, fatigue, exercise intolerance\n- **Cannon A waves** in JVP (atria contract against closed tricuspid valve)\n- **Variable S1 intensity** (variable PR interval in CHB)\n- Bradycardia with wide pulse pressure\n- Heart failure symptoms if prolonged',
  '**ECG (primary diagnostic tool):**\n- **1st degree:** PR >200ms, every P followed by QRS\n- **Mobitz I:** Progressive PR lengthening → dropped QRS (grouped beating)\n- **Mobitz II:** Fixed PR with intermittent dropped QRS (no progressive PR change)\n- **3rd degree:** P-P regular, R-R regular, but NO relationship between P and QRS\n  - Narrow QRS escape → junctional (40-60 bpm)\n  - Wide QRS escape → ventricular (20-40 bpm) — worse prognosis\n\n**Additional:**\n- Electrophysiology study: Localize block level (AH vs HV interval)\n- Echo: Structural heart disease\n- Lyme serology, thyroid function',
  '**1st degree:** No treatment, monitor\n**Mobitz I:** Usually no treatment; IV atropine if symptomatic/hemodynamically unstable\n**Mobitz II:** **Permanent pacemaker** (high risk of progression to complete block)\n**3rd degree (Complete):**\n- **Temporary pacing** if acute/unstable (transcutaneous or transvenous)\n- **Permanent pacemaker** — definitive treatment\n- **Atropine** (temporizing for AV nodal block only — ineffective for infranodal)\n- **Isoprenaline (isoproterenol)** infusion as bridge to pacing\n\n**In acute MI:**\n- Inferior MI + heart block: Usually resolves in days; temporary pacing if symptomatic\n- Anterior MI + heart block: Poor prognosis → early permanent pacemaker',
  '- Stokes-Adams attacks (syncope from asystole)\n- Sudden cardiac death\n- Heart failure (chronic severe bradycardia)\n- Torsades de Pointes (if associated long QT from bradycardia)\n- Pacemaker complications: Lead displacement, infection, pocket hematoma, pacemaker syndrome',
  'AV block: 1st degree (benign), Mobitz I (usually benign), Mobitz II (dangerous — pacemaker), 3rd degree (complete — pacemaker). Inferior MI causes transient AV nodal block. Anterior MI causes infranodal block with poor prognosis. Congenital CHB linked to maternal anti-Ro antibodies.',
  ['1st degree: PR >200ms — benign, no treatment', 'Mobitz I (Wenckebach): PR gets longer until dropped beat', 'Mobitz II: Fixed PR + dropped QRS → **needs pacemaker**', '3rd degree: Complete AV dissociation → **needs pacemaker**', 'Inferior MI: AV nodal block → usually **transient** (good prognosis)', 'Anterior MI: Infranodal block → **poor prognosis** (needs permanent pacemaker)', 'Congenital CHB: Maternal **anti-Ro/SSA** antibodies (neonatal lupus)', 'Lyme disease: Most common infectious cause of heart block'],
  ['**Wenck-LONG-er:** PR gets LONGER until a beat drops (Wenckebach)', '**Mobitz II = Mobitz TOO** dangerous → needs pacemaker'],
  ['ECG interpretation of heart block types', 'Which blocks need pacemaker (Mobitz II + Complete)', 'Heart block in inferior vs anterior MI', 'Congenital heart block — associated antibodies', 'Drug-induced heart block (digoxin, BB, CCB)', 'Lyme disease and heart block'],
  ['Sinus bradycardia', 'Sick sinus syndrome', 'Junctional rhythm', 'Drug effect (digoxin, beta-blockers, CCBs)']
);

addTopic('cardiology/cardiac-tamponade',
  '**Cardiac tamponade** is a life-threatening condition caused by fluid accumulation in the pericardial space compressing the heart and impairing diastolic filling. It is a medical emergency requiring urgent **pericardiocentesis**.',
  ['**Beck triad:** Hypotension, raised JVP, muffled heart sounds', '**Pulsus paradoxus:** >10 mmHg SBP drop during inspiration', 'Diagnosis: **Echocardiography** (RA/RV diastolic collapse)', 'ECG: Low voltage QRS + **electrical alternans**', 'Treatment: Emergency **pericardiocentesis** (subxiphoid approach)', 'Avoid diuretics and vasodilators (worsen hemodynamics)', 'Acute tamponade: Even 100-200 mL can be fatal (rapid accumulation)'],
  '**Cardiac tamponade** = Hemodynamic compromise from pericardial fluid causing equalization of intracardiac diastolic pressures.\n\n- **Acute:** Rapid accumulation (trauma, dissection) — 100-200 mL can be fatal\n- **Subacute/Chronic:** Gradual accumulation (malignancy, TB) — may tolerate >1-2L',
  '**Causes:**\n- **Malignancy:** Most common cause of large effusions (lung, breast, lymphoma)\n- **Pericarditis:** Viral, TB, uremic, bacterial\n- **Trauma:** Penetrating chest injury, post-cardiac surgery\n- **Aortic dissection:** Type A → hemopericardium\n- **MI complication:** Free wall rupture\n- **Anticoagulant therapy:** Hemorrhagic effusion\n- **Connective tissue disease:** SLE',
  '**Beck Triad (classic for acute):**\n1. **Hypotension** (low cardiac output)\n2. **Raised JVP** (distended neck veins)\n3. **Muffled/distant heart sounds**\n\n**Pulsus paradoxus:** Exaggerated drop in SBP >10 mmHg during inspiration\n- Normally: Slight ↓SBP with inspiration\n- Tamponade: Exaggerated because RV filling compromises LV (interventricular dependence)\n\n**Other signs:** Tachycardia, tachypnea, cool extremities, Ewart sign (dullness at left infra-scapular area)\n\n**Note:** Kussmaul sign is typically ABSENT in tamponade (present in constrictive pericarditis)',
  '**Echocardiography (investigation of choice):**\n- Pericardial effusion\n- **RA diastolic collapse** (earliest sign)\n- **RV diastolic collapse** (more specific)\n- IVC dilatation without inspiratory collapse\n- Respiratory variation in mitral/tricuspid inflow (>25%)\n\n**ECG:**\n- Low voltage QRS complexes\n- **Electrical alternans** (alternating QRS amplitude — swinging heart)\n- Sinus tachycardia\n\n**CXR:** Water-bottle/flask-shaped heart (if >200 mL)\n\n**Cardiac catheterization:** Equalization of diastolic pressures (RA ≈ RV diastolic ≈ PCWP ≈ PA diastolic)',
  '**Emergency management:**\n- **Pericardiocentesis** — definitive treatment\n  - Subxiphoid (Marfan) approach, echo-guided\n  - Send fluid: Cytology, culture, biochemistry, AFB, ADA\n- **IV fluid bolus** — increase preload (temporizing)\n- **AVOID:** Diuretics, vasodilators, positive pressure ventilation (all reduce preload/worsen tamponade)\n\n**Surgical options:**\n- Pericardial window: Recurrent effusions (malignancy)\n- Pericardiectomy: If constrictive component\n\n**Treat underlying cause:** TB → ATT, Malignancy → chemo/sclerotherapy, Uremic → dialysis',
  '- Cardiac arrest (if untreated)\n- Recurrence\n- Constrictive pericarditis (late)\n- Procedure complications: Myocardial puncture, pneumothorax, arrhythmia',
  'Cardiac tamponade = pericardial fluid → cardiac compression. Beck triad: hypotension + raised JVP + muffled sounds. Pulsus paradoxus >10mmHg. Echo: RA/RV diastolic collapse. Emergency pericardiocentesis. Avoid diuretics.',
  ['Beck triad: **Hypotension + raised JVP + muffled heart sounds**', 'Pulsus paradoxus: **>10 mmHg** SBP drop with inspiration', '**Electrical alternans** on ECG — nearly pathognomonic', 'Earliest echo sign: **RA diastolic collapse**', 'Acute tamponade: Even **100-200 mL** can be fatal (rapid accumulation)', 'Treatment: **Pericardiocentesis** (subxiphoid, echo-guided)', '**Avoid diuretics** — reduce preload, worsen tamponade', 'Kussmaul sign: ABSENT in tamponade, PRESENT in constrictive pericarditis'],
  ['**Beck Triad = 3 Ds:** Distant heart sounds, Distended neck veins, Decreased BP'],
  ['Beck triad components', 'Pulsus paradoxus — definition and mechanism', 'ECG finding pathognomonic for tamponade', 'Investigation of choice for tamponade', 'Emergency management', 'Difference between tamponade and constrictive pericarditis', 'Why diuretics are contraindicated'],
  ['Constrictive pericarditis', 'Tension pneumothorax', 'Massive PE', 'Cardiogenic shock', 'Right heart failure']
);

// Continue with more cardiology topics...
addTopic('cardiology/pericarditis-acute',
  '**Acute pericarditis** is inflammation of the pericardium, most commonly idiopathic/viral. It presents with sharp pleuritic chest pain **relieved by sitting forward**, pericardial friction rub, and characteristic ECG changes. Usually self-limiting but may cause effusion/tamponade or progress to constrictive pericarditis.',
  ['Most common cause: **Idiopathic/Viral** (Coxsackie B, Echovirus)', 'Chest pain: Sharp, pleuritic, worse lying down, **relieved by sitting forward**', '**Pericardial friction rub:** Pathognomonic (scratchy, 3-component)', 'ECG: Diffuse concave-up ST elevation + **PR depression** (Stage 1)', 'Diagnosis: 2 of 4 criteria (pain, rub, ECG, effusion)', 'Treatment: **NSAIDs + Colchicine** (colchicine reduces recurrence by 50%)', 'Avoid anticoagulants (risk of hemopericardium)'],
  '**Diagnostic criteria (≥2 of 4):**\n1. Typical chest pain (sharp, pleuritic, positional)\n2. Pericardial friction rub\n3. ECG changes (diffuse ST elevation, PR depression)\n4. New/worsening pericardial effusion on echo\n\n**Types by duration:**\n- Acute: <4-6 weeks\n- Incessant: >4-6 weeks without remission\n- Recurrent: Recurrence after symptom-free interval',
  '| Category | Examples |\n|----------|----------|\n| **Idiopathic/Viral** | Most common: Coxsackie B, Echovirus, CMV, EBV |\n| **TB** | Important in endemic areas — constrictive pericarditis risk |\n| **Autoimmune** | SLE, RA, scleroderma, Dressler syndrome |\n| **Post-MI** | Early (fibrinous, days 1-3) or Dressler (autoimmune, 2-10 weeks) |\n| **Uremic** | CKD/ESRD — responds to dialysis |\n| **Neoplastic** | Lung, breast, lymphoma |\n| **Drug-induced** | Hydralazine, isoniazid, procainamide |\n| **Post-cardiac surgery** | Postpericardiotomy syndrome |',
  '**Chest pain (cardinal feature):**\n- Sharp, stabbing, pleuritic\n- Retrosternal or left precordial\n- Worse lying supine, deep breathing, coughing, swallowing\n- **Relieved by sitting up and leaning forward**\n- May radiate to trapezius ridge (pathognomonic radiation)\n\n**Pericardial friction rub:**\n- Pathognomonic sign\n- High-pitched, scratchy, superficial (like leather rubbing)\n- Best heard: Left sternal border, end-expiration, patient leaning forward\n- **3 components:** Atrial systole, ventricular systole, ventricular diastole\n- Evanescent — may come and go\n\n**Other:** Low-grade fever, malaise, myalgia',
  '**ECG (4 evolutionary stages):**\n\n| Stage | Timing | Findings |\n|-------|--------|----------|\n| 1 | Acute | Diffuse concave-up ST elevation + **PR depression** (except aVR: ST↓, PR↑) |\n| 2 | Days | ST normalization, T flattening |\n| 3 | Weeks | Diffuse T wave inversion |\n| 4 | Weeks-months | Normalization |\n\n**Key ECG difference from STEMI:**\n- Pericarditis: **Diffuse**, concave-up, PR depression, NO reciprocal changes, no Q waves\n- STEMI: **Regional**, convex-up, reciprocal changes, Q waves evolve\n\n**Blood tests:** CRP/ESR (elevated), Troponin (mild elevation = myopericarditis)\n**Echo:** Pericardial effusion (may be absent)\n**CXR:** Usually normal; flask-shaped if large effusion',
  '**First-line:**\n- **NSAIDs:** Ibuprofen 600mg TDS or Aspirin 750-1000mg TDS (preferred post-MI)\n- **Colchicine:** 0.5mg BD for **3 months** — reduces recurrence by ~50% (COPE, CORP trials)\n- Activity restriction until CRP normalizes and symptoms resolve\n\n**Second-line:**\n- **Corticosteroids:** ONLY if NSAIDs/colchicine contraindicated or autoimmune cause\n- ⚠️ Steroids paradoxically **increase recurrence** if used first-line\n\n**AVOID:** Anticoagulants (risk of hemopericardium → tamponade)\n\n**Specific causes:**\n- TB: ATT + corticosteroids (reduce constrictive risk)\n- Uremic: Intensify dialysis\n- Bacterial (purulent): IV antibiotics + surgical drainage\n- Post-MI (Dressler): Aspirin + colchicine\n\n**Recurrent pericarditis:** Long-term colchicine, anakinra (IL-1 receptor antagonist), pericardiectomy (last resort)',
  '- **Pericardial effusion** → tamponade (5-10%)\n- **Constrictive pericarditis** (especially TB, radiation, post-surgical)\n- **Recurrence:** ~30% without colchicine; ~15% with colchicine\n- **Myopericarditis:** Pericarditis + myocardial involvement (elevated troponin, wall motion abnormalities)',
  'Acute pericarditis = pericardial inflammation, usually viral/idiopathic. Sharp chest pain relieved by sitting forward + friction rub + diffuse ST elevation + PR depression. Treat: NSAIDs + colchicine (reduces recurrence). Avoid anticoagulants.',
  ['Pain relieved by **sitting forward** (distinguishes from MI)', 'ECG: Diffuse concave-up ST elevation + **PR depression** (Stage 1)', 'aVR: **ST depression + PR elevation** (mirror image)', 'Pericardial friction rub has **3 components**', 'Colchicine reduces recurrence by **~50%** (COPE trial)', 'Dressler syndrome: Post-MI pericarditis at **2-10 weeks** (autoimmune)', '**Avoid anticoagulants** — risk of hemorrhagic tamponade', 'Steroids paradoxically **increase recurrence** if used first-line'],
  ['**ECG stages 1-4:** ST↑ → Normalize → T↓ → Normal'],
  ['ECG differences between pericarditis and STEMI', 'Treatment: NSAIDs + colchicine', 'Most common cause (idiopathic/viral)', 'Dressler syndrome timing (2-10 weeks)', 'Why avoid anticoagulants', 'Pericardial friction rub characteristics', 'When to use steroids (autoimmune, NSAID-intolerant)'],
  ['STEMI', 'PE', 'Aortic dissection', 'Musculoskeletal pain', 'Pleuritis', 'GERD']
);

addTopic('cardiology/stable-angina',
  '**Stable angina** is predictable, reproducible chest discomfort triggered by exertion or stress, caused by fixed coronary stenosis (usually >70%). It is relieved by rest or sublingual nitroglycerin within 5 minutes. It represents chronic stable ischemic heart disease.',
  ['Fixed coronary stenosis **>70%** causes demand-supply mismatch', 'Predictable chest pain on exertion, relieved by rest/NTG in <5 min', 'Diagnosis: **TMT** (first-line screening); **Coronary angiography** (gold standard)', 'Anti-anginal: **Beta-blockers** (first-line), nitrates, CCBs', 'Secondary prevention: **Aspirin + Statin + ACEi** + lifestyle', 'Revascularization: PCI (1-2 vessel) or CABG (left main, 3-vessel, DM)', 'Prinzmetal (variant) angina: Vasospasm → ST elevation at rest → treat with CCBs'],
  '**CCS (Canadian Cardiovascular Society) Grading:**\n\n| Class | Activity Level |\n|-------|---------------|\n| I | Angina with strenuous/prolonged exertion |\n| II | Slight limitation — angina walking >2 blocks or climbing stairs |\n| III | Marked limitation — angina walking <2 blocks |\n| IV | Angina at rest |\n\n**Typical angina (3 features):**\n1. Substernal chest discomfort\n2. Provoked by exertion or emotional stress\n3. Relieved by rest or NTG within 5 min\n\n2 of 3 = atypical angina; ≤1 = non-cardiac chest pain',
  '**Primary cause:** Fixed atherosclerotic stenosis >70% → oxygen demand exceeds supply during exertion (supply-demand mismatch)\n\n**Factors ↑demand:** Exercise, tachycardia, HTN, fever, anemia, aortic stenosis, thyrotoxicosis\n**Factors ↓supply:** Anemia, hypoxia, coronary vasospasm, severe AS\n\n**Special variant — Prinzmetal (Vasospastic) Angina:**\n- Coronary artery vasospasm (no fixed stenosis needed)\n- Occurs at **rest**, often early morning\n- **ST elevation** during pain (unlike typical angina → ST depression)\n- Treat with **CCBs + nitrates** (beta-blockers relatively contraindicated)',
  '**Typical presentation:**\n- Central/retrosternal pressure, tightness, heaviness, or squeezing\n- Precipitated by exertion, cold weather, heavy meals, emotional stress\n- Relieved by rest within 2-5 minutes or sublingual NTG\n- Duration: 2-10 minutes\n- Radiation: Left arm, jaw, neck, back, epigastrium\n\n**Atypical features:** More common in women, elderly, diabetics — dyspnea, fatigue, nausea\n\n**Examination:** Usually **normal** at rest; may reveal:\n- S4 (LV stiffness during ischemia)\n- Transient MR murmur (papillary muscle ischemia)\n- Signs of risk factors (xanthelasma, arcus senilis)',
  '**Non-invasive testing:**\n- **Exercise ECG (TMT):** First-line screening\n  - Positive: ≥1mm horizontal/downsloping ST depression\n  - Duke Treadmill Score for risk stratification\n- **Stress echocardiography:** Better specificity, detects wall motion abnormalities\n- **Myocardial perfusion imaging (MPI):** Nuclear (SPECT/PET)\n- **Pharmacological stress test:** Dobutamine/adenosine (if cannot exercise)\n- **CT coronary angiography:** Non-invasive anatomy assessment, high NPV\n- **CT calcium scoring:** Risk stratification (score 0 = very low CAD risk)\n\n**Invasive:**\n- **Coronary angiography:** Gold standard for coronary anatomy\n- **FFR (Fractional Flow Reserve):** <0.80 = functionally significant stenosis',
  '**Lifestyle:** Smoking cessation, regular exercise, Mediterranean diet, weight management\n\n**Anti-anginal drugs (symptom relief):**\n- **Beta-blockers:** First-line — reduce HR, contractility, O₂ demand\n- **Nitrates:** Sublingual NTG for acute relief; long-acting for prophylaxis\n  - Nitrate-free interval of **10-12 hours** to prevent tolerance\n- **CCBs:** Amlodipine (if BB contraindicated); verapamil/diltiazem (rate-limiting)\n- **Newer:** Ranolazine, nicorandil, trimetazidine, ivabradine\n\n**Secondary prevention (prognostic benefit):**\n- **Aspirin** 75mg daily (or clopidogrel if aspirin-intolerant)\n- **High-intensity statin** (atorvastatin 40-80mg, target LDL <70)\n- **ACEi** (especially if DM, HTN, LV dysfunction)\n\n**Revascularization:**\n\n| PCI (percutaneous) | CABG (surgery) |\n|-------------------|----------------|\n| 1-2 vessel disease | **Left main** disease |\n| Low SYNTAX score | **Triple vessel** disease |\n| — | DM + multivessel |\n| — | Low EF + multivessel |\n\n**LIMA graft:** >90% patency at 10 years (used to LAD)',
  '- Progression to acute coronary syndrome (plaque rupture)\n- Heart failure (ischemic cardiomyopathy)\n- Arrhythmias\n- Sudden cardiac death\n- Stent restenosis/thrombosis (post-PCI)\n- Graft failure (post-CABG)',
  'Stable angina = predictable exertional chest pain from fixed stenosis >70%. TMT first-line, angiography gold standard. Treat: BB + NTG (symptoms) + aspirin + statin (prevention). CABG preferred for left main/3-vessel/DM.',
  ['Stenosis **>70%** needed for stable angina (vs ACS = plaque rupture at any stenosis)', 'TMT positive: **≥1mm ST depression** (horizontal/downsloping)', 'Beta-blockers: **First-line** anti-anginal', 'Nitrate-free interval of **10-12 hours** to prevent tolerance', 'CABG > PCI for: **Left main, triple vessel, DM + multivessel**', 'LIMA graft: **>90% patency at 10 years**', 'Prinzmetal angina: Vasospasm, ST **elevation** at rest, treat with **CCBs**', 'CT calcium score 0 = very low CAD risk'],
  ['**ABCDE of stable angina:** Aspirin/ACEi, Beta-blocker, Cigarette cessation/CCB, Diet/DM control, Exercise/Education'],
  ['CCS grading of angina', 'First-line investigation and treatment', 'When PCI vs CABG', 'Nitrate tolerance prevention', 'Prinzmetal angina features and treatment', 'LIMA graft patency'],
  ['GERD', 'Musculoskeletal pain (costochondritis)', 'Anxiety/panic attack', 'PE', 'Aortic dissection', 'Esophageal spasm']
);

addTopic('cardiology/acute-coronary-syndrome',
  '**Acute coronary syndrome (ACS)** encompasses unstable angina (UA), NSTEMI, and STEMI — all resulting from acute coronary plaque rupture and thrombosis. STEMI involves complete coronary occlusion requiring emergent reperfusion therapy (primary PCI or thrombolysis).',
  ['ACS = UA + NSTEMI + STEMI from plaque rupture + thrombosis', 'UA vs NSTEMI: Differentiated by **troponin** (positive in NSTEMI)', 'STEMI: ST elevation + troponin positive → **urgent PCI** (door-to-balloon <90 min)', 'MONA: Morphine, Oxygen (if SpO₂<90%), Nitrates, Aspirin 300mg', 'Dual antiplatelet: Aspirin + Ticagrelor (preferred over clopidogrel)', 'Most common cause of death in first 24h: **Ventricular fibrillation**', 'Killip classification: I (no HF) to IV (cardiogenic shock)'],
  '**ACS Spectrum:**\n\n| Type | Pain | ECG | Troponin |\n|------|------|-----|----------|\n| UA | Rest/crescendo | ST↓/T↓/normal | **Negative** |\n| NSTEMI | Prolonged rest | ST↓/T↓ | **Positive** |\n| STEMI | Severe, prolonged | **ST elevation** | **Positive** |\n\n**Killip Classification:**\n\n| Class | Features | Mortality |\n|-------|----------|----------|\n| I | No HF | ~6% |\n| II | Mild HF (crepitations, S3) | ~17% |\n| III | Pulmonary edema | ~38% |\n| IV | Cardiogenic shock | ~80% |',
  '**Pathogenesis:** Atherosclerotic plaque rupture/erosion → platelet adhesion/activation → thrombus → coronary occlusion\n- **STEMI:** Complete occlusion by red (fibrin-rich) thrombus → transmural infarction\n- **NSTEMI/UA:** Partial/intermittent occlusion by white (platelet-rich) thrombus → subendocardial ischemia/infarction',
  '**Chest pain:**\n- Severe, crushing, retrosternal, >20 minutes\n- NOT relieved by rest or NTG\n- Radiation: Left arm, jaw, neck, back, epigastrium\n- Associated: Profuse sweating, nausea/vomiting, breathlessness, sense of impending doom\n\n**Atypical presentations (especially diabetics, elderly, women):**\n- Epigastric pain, dyspnea, fatigue, syncope\n- "Silent MI" in diabetics (autonomic neuropathy)\n\n**Examination:** Diaphoresis, pallor, tachycardia, S4, new MR murmur, signs of HF',
  '**ECG (within 10 minutes of presentation):**\n- **STEMI:** ST elevation in ≥2 contiguous leads (≥2mm chest, ≥1mm limb)\n  - Anterior (LAD): V1-V4\n  - Inferior (RCA): II, III, aVF\n  - Lateral (LCx): I, aVL, V5-V6\n  - Posterior: ST depression V1-V3 (reciprocal), tall R waves V1-V2\n- **NSTEMI/UA:** ST depression, T inversion, or normal\n- **New LBBB** with symptoms = STEMI equivalent\n\n**Biomarkers:**\n- **hs-Troponin I/T:** Most sensitive and specific; rises 3-4 hours, peaks 12-24 hours\n- CK-MB: Rises 4-6 hours, useful for **re-infarction** (returns to baseline faster)\n\n**Risk scores:** TIMI, GRACE (mortality prediction), HEART (ED chest pain)',
  '**Immediate management (all ACS):**\n- **Aspirin 300mg** (chew) + **P2Y12 inhibitor** (ticagrelor 180mg or clopidogrel 600mg)\n- **Anticoagulation:** UFH or LMWH (enoxaparin)\n- **Nitrates** — IV/sublingual (avoid if SBP<90, RV infarction, recent PDE5 inhibitor)\n- **Morphine** (if pain persists)\n- **Oxygen** (ONLY if SpO₂ <90%)\n\n**STEMI reperfusion:**\n- **Primary PCI:** Preferred — door-to-balloon **<90 minutes**\n- **Thrombolysis:** If PCI unavailable within 120 min — door-to-needle **<30 minutes**\n  - Agents: Tenecteplase (preferred), Alteplase, Streptokinase\n  - Streptokinase: Cannot repeat after **5 days** (antibodies form)\n  - Absolute CI: Active bleeding, stroke <3 months, aortic dissection, intracranial neoplasm\n\n**NSTEMI/UA:**\n- Antiplatelet + anticoagulation + anti-ischemic therapy\n- Risk stratification: High-risk → early invasive (angiography <24h)\n\n**Post-MI secondary prevention (ABCDE):**\n- Antiplatelet (DAPT 12 months), ACEi, Beta-blocker, Statin, Lifestyle',
  '**Early (hours-days):**\n- **VF:** Most common cause of death in first 24h\n- Cardiogenic shock (Killip IV)\n- **Mechanical:** Free wall rupture (day 3-5, PEA→tamponade), VSD (new pansystolic murmur + step-up in O₂), Papillary muscle rupture (acute severe MR)\n\n**Late (weeks-months):**\n- **Dressler syndrome:** Autoimmune pericarditis at 2-10 weeks\n- LV aneurysm (persistent ST elevation)\n- Mural thrombus → systemic embolization\n- Heart failure\n\n**Papillary muscle rupture:** Posteromedial > anterolateral (posteromedial has single blood supply from posterior descending artery)',
  'ACS = plaque rupture + thrombosis causing UA/NSTEMI/STEMI. STEMI: PCI <90 min or thrombolysis <30 min. All get aspirin + P2Y12 + anticoagulation. Troponin distinguishes NSTEMI from UA. VF is top killer in first 24h.',
  ['Door-to-balloon **<90 min** (PCI) or door-to-needle **<30 min** (thrombolysis)', 'New LBBB + chest pain = **STEMI equivalent**', 'Most common death in first 24h: **Ventricular fibrillation**', 'RV infarction (inferior STEMI): **Avoid nitrates/diuretics** → give IV fluids', 'Free wall rupture: Days **3-5** post-MI → PEA, tamponade', 'VSD post-MI: New pansystolic murmur + **step-up in O₂** at RV level', 'Papillary muscle rupture: **Posteromedial** > anterolateral', 'Streptokinase cannot be repeated after **5 days** (antibody formation)', 'Troponin rises at **3-4 hours**, peaks **12-24 hours**'],
  ['**MONA:** Morphine, Oxygen, Nitrates, Aspirin', '**STEMI territories:** LAD=Anterior(V1-V4), RCA=Inferior(II,III,aVF), LCx=Lateral(I,aVL,V5-V6)'],
  ['STEMI vs NSTEMI vs UA differentiation', 'Door-to-balloon and door-to-needle times', 'ECG localization of MI', 'Mechanical complications and timing', 'Contraindications to thrombolysis', 'RV infarction management', 'Killip classification'],
  ['Aortic dissection', 'PE', 'Pericarditis', 'GERD', 'Pneumothorax', 'Musculoskeletal pain']
);

addTopic('cardiology/rheumatic-heart-disease',
  '**Rheumatic heart disease (RHD)** is the chronic sequela of acute rheumatic fever (ARF) causing permanent valvular damage. It remains the most common acquired heart disease in developing countries. **Mitral valve** is most commonly affected, and mitral stenosis is the hallmark lesion.',
  ['Sequel of **Acute Rheumatic Fever** (Group A Streptococcus pharyngitis)', 'Most commonly affected valve: **Mitral valve**', 'Most common lesion: **Mitral stenosis** (MS)', 'Aschoff bodies: Pathognomonic histological finding', 'Jones criteria: Major + minor criteria for ARF diagnosis', 'Prophylaxis: **Benzathine penicillin G** IM every 3-4 weeks', 'Modified Jones criteria: 2 major OR 1 major + 2 minor + evidence of streptococcal infection'],
  '**Acute Rheumatic Fever (ARF):**\n- Autoimmune reaction to Group A β-hemolytic Streptococcus (GAS) pharyngitis\n- Molecular mimicry: Streptococcal M protein cross-reacts with cardiac myosin\n- Occurs 2-4 weeks after pharyngitis\n\n**Rheumatic Heart Disease (RHD):**\n- Chronic valvular damage from recurrent ARF episodes\n- Valve involvement (frequency): Mitral > Aortic > Tricuspid > Pulmonary\n\n**Pathology:**\n- **Aschoff bodies:** Pathognomonic — granulomatous lesions with Anitschkow cells (owl-eye nuclei)\n- **MacCallum patch:** Endocardial thickening in LA\n- Valve: Commissural fusion, leaflet thickening, chordal shortening → stenosis',
  '**ARF — Jones Criteria (requires evidence of prior GAS infection):**\n\n**Major criteria — JONES:**\n- **J**oint involvement (migratory polyarthritis — most common, large joints)\n- **O** (Carditis — pancarditis, most serious)\n- **N**odules (subcutaneous, painless, over bony prominences)\n- **E**rythema marginatum (evanescent pink rings on trunk, never on face)\n- **S**ydenham chorea (involuntary movements, appears months later)\n\n**Minor criteria:**\n- Fever, arthralgia\n- ↑ESR/CRP, prolonged PR interval\n- Previous ARF/RHD\n\n**Evidence of streptococcal infection:** ↑ASO titer, positive throat culture, rapid strep test',
  '**ARF:** Migratory polyarthritis, carditis (pericardial rub, new murmur, HF), chorea, erythema marginatum, subcutaneous nodules\n\n**RHD (chronic):**\n- **Mitral stenosis:** Most common RHD lesion\n  - Low-pitched rumbling mid-diastolic murmur at apex (best with bell, left lateral decubitus)\n  - Opening snap\n  - Dyspnea, orthopnea, hemoptysis\n  - AF is the most common arrhythmia\n  - Malar flush ("mitral facies")\n- **Mitral regurgitation:** Pansystolic murmur at apex, radiating to axilla\n- **Aortic stenosis/regurgitation**\n\n**Complications of MS:** AF, systemic embolism (stroke), pulmonary HTN, RHF, infective endocarditis',
  '**ARF diagnosis:** Modified Jones criteria (2 major OR 1 major + 2 minor + GAS evidence)\n\n**Investigations:**\n- **ASO titer** (elevated) — evidence of recent streptococcal infection\n- Throat culture/rapid strep test\n- ESR/CRP: Elevated\n- ECG: Prolonged PR interval\n- **Echocardiography:** Valvular involvement, vegetations (verrucae along valve closure line)\n- CXR: Cardiomegaly, LA enlargement, pulmonary congestion\n\n**RHD assessment:** Echo for valve morphology, severity, suitability for intervention',
  '**ARF Treatment:**\n- Eradicate streptococcus: **Penicillin** (or erythromycin if allergic)\n- Anti-inflammatory: Aspirin (arthritis), corticosteroids (severe carditis)\n- Chorea: Haloperidol or valproate\n- Bed rest, supportive care\n\n**Secondary prophylaxis (prevent recurrence):**\n- **Benzathine Penicillin G** 1.2 MU IM every **3-4 weeks**\n- Duration: Until age 40 or 10 years after last episode (whichever is longer)\n- If carditis with residual RHD: Until age 40 (lifelong if severe)\n\n**RHD management:**\n- Medical: Diuretics, rate control for AF, anticoagulation (warfarin for MS + AF)\n- **Balloon mitral valvotomy (BMV):** For symptomatic MS with favorable valve morphology (Wilkins score ≤8)\n- Surgery: Valve repair or replacement (mechanical → lifelong warfarin, bioprosthetic)',
  '- Progressive valve disease with each ARF recurrence\n- Atrial fibrillation (most common complication of MS)\n- Systemic thromboembolism/stroke\n- Pulmonary hypertension, right heart failure\n- Infective endocarditis\n- Pregnancy complications in MS (↑blood volume → pulmonary edema)',
  'RHD = chronic valvular damage from ARF (GAS pharyngitis → molecular mimicry). Mitral valve most affected. MS = hallmark. Jones criteria for ARF diagnosis. Prophylaxis: benzathine penicillin IM q3-4 weeks.',
  ['Most common valve in RHD: **Mitral**; Most common lesion: **Mitral stenosis**', 'Aschoff body: **Pathognomonic** histological finding of ARF', 'Jones criteria: **2 major OR 1 major + 2 minor** + strep evidence', 'Erythema marginatum: **Never on face** (distinguishing feature)', 'Sydenham chorea: May appear **months after** pharyngitis', 'Benzathine Penicillin G: **Every 3-4 weeks** for secondary prophylaxis', 'MS + AF → **Warfarin** anticoagulation (DOACs not indicated)', 'BMV (balloon valvotomy) for MS: **Wilkins score ≤8**'],
  ['**JONES criteria:** Joint, O (carditis), Nodules, Erythema marginatum, Sydenham chorea', '**MS complications:** AF, Embolism, Pulmonary HTN, Hemoptysis'],
  ['Jones criteria — major and minor', 'Most common valve involved in RHD', 'Aschoff body histology', 'Duration of penicillin prophylaxis', 'Murmur of mitral stenosis', 'Indications for BMV vs surgery', 'Erythema marginatum — where it does NOT appear'],
  ['Infective endocarditis', 'Mitral valve prolapse', 'Degenerative valve disease', 'SLE (Libman-Sacks)']
);

addTopic('cardiology/pericardial-effusion',
  '**Pericardial effusion** is accumulation of fluid in the pericardial space beyond the normal 15-50 mL. It may be serous, hemorrhagic, or purulent. Clinical significance depends on the **rate** of accumulation — rapid accumulation causes tamponade, while chronic effusions may tolerate large volumes.',
  ['Normal pericardial fluid: **15-50 mL**', 'Most common cause of large effusions: **Malignancy**', 'Rate of accumulation matters more than volume', 'Acute: 100-200 mL → tamponade; Chronic: >1-2L may be tolerated', 'Diagnosis: **Echocardiography** (investigation of choice)', 'CXR: Water-bottle heart (needs >200 mL)', 'ECG: Low voltage QRS, electrical alternans (large effusions)', 'ADA >40 U/L in fluid → TB'],
  '**Classification:**\n\n| By Size | Echo Measurement |\n|---------|------------------|\n| Small | <10 mm |\n| Moderate | 10-20 mm |\n| Large | >20 mm |\n\n**By fluid type:** Transudative (HF, hypothyroid, nephrotic), Exudative (infection, malignancy, autoimmune), Hemorrhagic (trauma, malignancy, anticoagulation)',
  '**Common causes:**\n- **Idiopathic/Viral** (most common in developed countries)\n- **TB** (most common in endemic areas — India)\n- **Malignancy:** Lung, breast, lymphoma (most common cause of LARGE effusions)\n- **Uremia** (CKD/ESRD)\n- **Autoimmune:** SLE, RA\n- **Hypothyroidism** (myxedema — transudative)\n- **Post-MI:** Dressler syndrome, free wall rupture\n- **Post-cardiac surgery:** Postpericardiotomy syndrome\n- **Bacterial:** Purulent pericarditis\n- **Trauma, radiation**',
  '**Small effusions:** Asymptomatic\n**Large effusions:**\n- Dyspnea (bronchial/lung compression)\n- Chest discomfort, chest fullness\n- Cough, hiccups (phrenic nerve)\n- Dysphagia (esophageal compression)\n- Hoarseness (recurrent laryngeal nerve compression)\n- **Ewart sign:** Dullness + bronchial breathing at left infra-scapular area (compressed left lower lobe)\n\n**If tamponade develops:** Beck triad, pulsus paradoxus, shock',
  '**Echocardiography (investigation of choice):**\n- Echo-free space around heart\n- Quantify size and location\n- Detect hemodynamic compromise (RA/RV collapse)\n- Guide pericardiocentesis\n\n**ECG:** Low voltage QRS, electrical alternans (swinging heart), sinus tachycardia\n**CXR:** Water-bottle/flask-shaped silhouette (needs >200 mL)\n**CT/MRI:** Loculated effusions, pericardial thickening, masses\n\n**Pericardial fluid analysis:**\n- Biochemistry: Protein, LDH, glucose (Light criteria for transudate/exudate)\n- Cytology: Malignant cells\n- Culture: Bacterial, AFB\n- **ADA:** >40 U/L suggests TB\n- Cell count, Gram stain',
  '**Observation:** Small, asymptomatic, idiopathic/viral → monitor with serial echo\n**NSAIDs + Colchicine:** If inflammatory/pericarditis component\n\n**Pericardiocentesis — indications:**\n- Cardiac tamponade (emergency)\n- Large symptomatic effusion\n- Diagnostic (suspected TB, malignancy, bacterial)\n- Echo-guided, subxiphoid approach\n\n**Pericardial window:** Recurrent effusions (malignant — preferred for ongoing drainage)\n**Pericardiectomy:** Constrictive pericarditis\n\n**Treat underlying cause:** TB→ATT, Malignancy→chemo/sclerotherapy, Hypothyroid→levothyroxine, Uremic→dialysis',
  '- **Cardiac tamponade** (most dangerous)\n- Constrictive pericarditis (TB, radiation)\n- Recurrence\n- Infection of stagnant fluid',
  'Pericardial effusion = fluid in pericardial sac. Rate of accumulation matters more than volume (acute small = dangerous, chronic large = tolerated). Echo diagnostic. Water-bottle heart on CXR. Pericardiocentesis for tamponade/diagnostic.',
  ['Normal pericardial fluid: **15-50 mL**', 'Rapid 100-200 mL → tamponade; slow >1-2L may be tolerated', 'Water-bottle heart on CXR: Needs **>200 mL**', 'Electrical alternans = **swinging heart** in large effusion', 'ADA >40 U/L in pericardial fluid → **TB**', 'Ewart sign: Dullness at left infrascapular area', 'Most common cause of large effusions: **Malignancy**'],
  ['**VITAMIN-C causes:** Viral, Idiopathic, TB, Autoimmune, Malignancy, Injury, Neoplastic, CKD'],
  ['Investigation of choice', 'CXR finding and minimum volume', 'Pericardial fluid ADA in TB', 'Acute vs chronic effusion hemodynamic tolerance', 'Indications for pericardiocentesis'],
  ['Cardiomegaly (dilated cardiomyopathy)', 'Pleural effusion', 'Cardiac tamponade', 'Constrictive pericarditis']
);

addTopic('cardiology/resistant-hypertension',
  '**Resistant hypertension** is defined as BP remaining above goal despite concurrent use of 3 optimally-dosed antihypertensives of different classes, one being a diuretic. True resistance must be distinguished from pseudoresistance (non-compliance, white coat effect, improper measurement).',
  ['Definition: Uncontrolled BP on **≥3 optimal-dose drugs including a diuretic**', 'Prevalence: 10-15% of treated hypertensives', 'First step: Rule out **pseudoresistance** (non-compliance, white coat, improper measurement)', 'Most common secondary cause: **Obstructive sleep apnea** (OSA)', 'Fourth drug of choice: **Spironolactone** (PATHWAY-2 trial)', 'Renal denervation: Emerging interventional option', 'Screen for secondary causes in all resistant HTN patients'],
  '**Resistant HTN:** BP >goal on ≥3 drugs (including diuretic) at optimal doses\n**Controlled resistant HTN:** BP at goal on ≥4 drugs\n**Refractory HTN:** Uncontrolled on ≥5 drugs (rare, <5% of resistant HTN)\n\n**Pseudoresistance causes:**\n- Non-compliance (most common)\n- White coat effect\n- Improper BP measurement (wrong cuff size)\n- Suboptimal drug doses\n- Drug interactions (NSAIDs, OCPs)',
  '**Secondary causes to screen for:**\n- **OSA** (most common modifiable cause — 60-70% of resistant HTN have OSA)\n- Primary aldosteronism (more common than previously thought — up to 20%)\n- Renal artery stenosis\n- CKD\n- Pheochromocytoma\n- Cushing syndrome\n\n**Contributing factors:**\n- Excess dietary sodium\n- Obesity\n- Excessive alcohol\n- Drug interactions: NSAIDs, decongestants, OCPs, steroids, erythropoietin',
  '**Suspect resistant HTN when:**\n- BP uncontrolled despite 3 drugs at optimal doses\n- Need for ≥4 drugs to achieve control\n- Frequent medication adjustments needed\n\n**Assessment:**\n- Detailed drug history (compliance, doses, timing)\n- Dietary sodium assessment\n- Screen for OSA (Epworth scale, STOP-BANG)\n- Look for signs of secondary causes',
  '**Step 1: Confirm true resistance**\n- ABPM or HBPM (exclude white coat effect)\n- Assess compliance (pill counts, serum drug levels)\n- Review medications for interactions\n\n**Step 2: Screen for secondary causes**\n- Renal function, electrolytes\n- Aldosterone/renin ratio\n- Overnight oximetry/polysomnography (OSA)\n- Renal artery imaging\n- 24-hr urine catecholamines (if clinical suspicion)\n\n**Step 3: Assess target organ damage**\n- Echo, fundoscopy, urine ACR',
  '**Optimize current therapy:**\n- Ensure adherence (simplify regimen, combination pills)\n- Maximize diuretic (chlorthalidone preferred over HCTZ — longer acting)\n- Reduce dietary sodium (<5g/day)\n\n**Fourth drug: Spironolactone 25-50mg** (PATHWAY-2 trial — most effective add-on)\n- Especially effective because subclinical aldosterone excess is common\n- Monitor potassium and renal function\n\n**Alternative fourth drugs:** Amiloride, doxazosin, bisoprolol, clonidine\n\n**Treat secondary causes:** CPAP for OSA, surgery for aldosteronoma, etc.\n\n**Interventional:** Renal denervation (catheter-based sympathetic ablation — emerging evidence)',
  '- All complications of uncontrolled HTN (stroke, MI, CKD, HF)\n- Higher cardiovascular event rate than controlled HTN\n- Spironolactone side effects: Hyperkalemia, gynecomastia\n- Renal function deterioration',
  'Resistant HTN = uncontrolled on ≥3 drugs including diuretic. First exclude pseudoresistance (non-compliance, white coat). Screen for secondary causes (OSA most common). Add spironolactone as fourth drug (PATHWAY-2).',
  ['Definition: Uncontrolled on **≥3 drugs including diuretic** at optimal doses', 'Most common modifiable cause: **OSA** (60-70% of resistant HTN)', 'Fourth drug of choice: **Spironolactone** (PATHWAY-2 trial)', 'Primary aldosteronism: Found in up to **20%** of resistant HTN', 'Chlorthalidone preferred over HCTZ (longer acting, better outcome data)', 'Always exclude **pseudoresistance** first (non-compliance most common)'],
  ['**Resistant HTN workup:** Confirm (ABPM) → Comply (check adherence) → Cause (secondary) → Add spironolactone'],
  ['Definition of resistant HTN', 'Most common secondary cause (OSA)', 'Fourth drug of choice (spironolactone)', 'Pseudoresistance causes', 'Screening for primary aldosteronism'],
  ['Pseudoresistant HTN', 'White coat HTN', 'Non-compliance', 'Drug-induced HTN']
);

addTopic('cardiology/peripheral-vascular-disease-medical',
  '**Peripheral arterial disease (PAD)** is atherosclerotic narrowing of peripheral arteries, most commonly affecting the lower extremities. It is a marker of systemic atherosclerosis and associated with high cardiovascular mortality. Intermittent claudication is the hallmark symptom.',
  ['Atherosclerotic narrowing of peripheral arteries (most common: lower limbs)', 'Hallmark symptom: **Intermittent claudication** (calf pain on walking, relieved by rest)', '**Ankle-Brachial Index (ABI)** <0.9 = diagnostic', 'Leriche syndrome: Aortoiliac disease → buttock claudication + impotence + absent femoral pulses', 'Risk factors same as CAD: Smoking (strongest modifiable), DM, HTN, dyslipidemia', 'Critical limb ischemia: Rest pain, ulcers, gangrene (ABI <0.4)', 'Management: Smoking cessation + supervised exercise + antiplatelet + statin ± revascularization'],
  '**Fontaine Classification:**\n\n| Stage | Clinical Features | ABI |\n|-------|-------------------|-----|\n| I | Asymptomatic | 0.9-1.0 |\n| II | Intermittent claudication | 0.5-0.9 |\n| IIa | Claudication >200m | — |\n| IIb | Claudication <200m | — |\n| III | Rest pain | 0.3-0.5 |\n| IV | Ulceration/gangrene | <0.3 |\n\n**Rutherford classification:** Alternative 7-category system used in vascular surgery',
  '**Pathology:** Atherosclerosis of peripheral arteries\n- Most common site: **Superficial femoral artery** (at adductor canal/Hunter canal)\n- Aortoiliac disease → Leriche syndrome\n\n**Risk factors:**\n- **Smoking** (strongest modifiable risk factor — 4x risk)\n- Diabetes mellitus\n- Hypertension, dyslipidemia\n- Age >50, male sex\n- CKD\n\n**Associated with:** CAD (50%), cerebrovascular disease (30%) — PAD is a marker of systemic atherosclerosis',
  '**Intermittent claudication:**\n- Cramping pain in calf/thigh/buttock during walking\n- Predictable walking distance\n- Relieved by rest within minutes (NOT by standing still — vs spinal stenosis)\n- Location indicates level of disease:\n  - Calf → SFA disease\n  - Thigh/buttock → aortoiliac (Leriche)\n\n**Critical limb ischemia (CLI):**\n- **Rest pain** (especially at night, hangs leg off bed for relief)\n- Non-healing ulcers (painful, punched-out, toes/heel)\n- Gangrene\n- Absent pulses, pallor, cool limb\n\n**Leriche syndrome:** Aortoiliac occlusion → bilateral buttock claudication + erectile dysfunction + absent femoral pulses\n\n**Examination — 6 Ps of acute ischemia:** Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia (cold)',
  '**ABI (Ankle-Brachial Index):**\n- Normal: 1.0-1.3\n- PAD: **<0.9** (diagnostic)\n- Severe PAD: <0.4\n- Non-compressible (calcified): >1.3 (unreliable — use TBI or waveform analysis)\n\n**Imaging:**\n- **Duplex USG:** First-line imaging (stenosis location and severity)\n- **CT angiography:** Pre-operative planning\n- **MR angiography:** Alternative to CTA\n- **Digital subtraction angiography (DSA):** Gold standard (invasive, therapeutic)\n\n**Other:** Lipid profile, HbA1c, renal function, ECG/Echo (assess coexistent CAD)',
  '**All patients:**\n- **Smoking cessation** (most important intervention)\n- **Supervised exercise program:** Walking 30-45 min, 3x/week for ≥12 weeks → ↑claudication distance by 150%\n- **Antiplatelet:** Aspirin or clopidogrel\n- **Statin:** High-intensity (reduce CV events)\n- **ACEi:** CV protection\n- DM and HTN control\n\n**Pharmacotherapy for claudication:**\n- **Cilostazol:** PDE3 inhibitor — improves walking distance by 50% (contraindicated in HF)\n- Pentoxifylline: Limited evidence\n\n**Revascularization (CLI or severe claudication refractory to medical therapy):**\n- Endovascular: Angioplasty ± stenting\n- Surgical: Bypass grafting (aortobifemoral, femoropopliteal)\n- **Amputation:** Last resort for irreversible gangrene/unsalvageable limb',
  '- Acute limb ischemia (thrombotic or embolic)\n- Critical limb ischemia → amputation\n- Non-healing ulcers, gangrene\n- Cardiovascular events (MI, stroke) — leading cause of death in PAD patients\n- Post-revascularization: Restenosis, graft failure',
  'PAD = peripheral atherosclerosis, most commonly lower limbs. Intermittent claudication is hallmark. ABI <0.9 = diagnostic. Smoking cessation + exercise + antiplatelet + statin. Revascularize for critical limb ischemia.',
  ['Most common site: **Superficial femoral artery** (adductor canal)', 'ABI **<0.9** = PAD; ABI **<0.4** = critical limb ischemia', 'Leriche syndrome: Buttock claudication + impotence + absent femoral pulses', '**Smoking cessation** is the most important intervention', 'Supervised exercise: Increases walking distance by **150%**', 'Cilostazol: Improves claudication but **contraindicated in HF**', 'PAD patients: 50% have **coexistent CAD**'],
  ['**6 Ps of acute ischemia:** Pain, Pallor, Pulselessness, Paresthesia, Paralysis, Poikilothermia', '**Leriche triad:** Claudication, impotence, absent femoral pulses'],
  ['ABI interpretation', 'Fontaine classification', 'Leriche syndrome triad', 'Most important intervention (smoking cessation)', 'Differentiate claudication from neurogenic (spinal stenosis)'],
  ['Neurogenic claudication (spinal stenosis — relieved by sitting, NOT standing)', 'DVT', 'Chronic compartment syndrome', 'Peripheral neuropathy (DM)', 'Buerger disease (thromboangiitis obliterans)']
);

addTopic('cardiology/ischemic-heart-disease',
  '**Ischemic heart disease (IHD)** results from imbalance between myocardial oxygen supply and demand, most commonly from coronary atherosclerosis. It encompasses stable angina, acute coronary syndromes (UA, NSTEMI, STEMI), ischemic cardiomyopathy, and sudden cardiac death. It is the leading cause of mortality worldwide.',
  ['Leading cause of death worldwide', 'Pathogenesis: Coronary atherosclerosis → plaque rupture → thrombosis', 'Spectrum: Stable angina → ACS (UA, NSTEMI, STEMI) → Sudden cardiac death', 'Troponin: Most sensitive and specific cardiac biomarker', 'Risk factors: HTN, DM, smoking, dyslipidemia, family history', 'Vulnerable plaque (thin cap, large lipid core) causes ACS — NOT most stenotic lesion', 'Secondary prevention: Aspirin + Statin + ACEi/ARB + BB + lifestyle'],
  '**IHD Spectrum:**\n\n| Condition | Mechanism | Key Feature |\n|-----------|----------|-------------|\n| Stable angina | Fixed stenosis >70% | Exertional pain, relieved by rest |\n| Unstable angina | Plaque rupture, partial occlusion | Rest pain, negative troponin |\n| NSTEMI | Partial occlusion | Positive troponin, ST depression |\n| STEMI | Complete occlusion | ST elevation + positive troponin |\n| Sudden cardiac death | Plaque rupture → VF | — |',
  '**Atherosclerosis progression:**\n1. Endothelial injury (HTN, smoking, DM, turbulent flow)\n2. LDL accumulation and oxidation in subintimal space\n3. Monocyte/macrophage infiltration → foam cells → fatty streak\n4. Smooth muscle migration → fibrous cap formation\n5. **Stable plaque:** Thick fibrous cap, small lipid core → stable angina\n6. **Vulnerable plaque:** Thin cap, large lipid core, inflammation → rupture → ACS\n\n> **Key concept:** It is the VULNERABLE plaque that ruptures, not necessarily the most stenotic lesion.\n\n**Risk factors:** Non-modifiable (age, sex, family Hx) + Modifiable (smoking, HTN, DM, dyslipidemia, obesity, sedentary)',
  '**Stable angina:** Predictable exertional chest pain, relieved by rest/NTG\n**ACS:** Severe prolonged chest pain, diaphoresis, nausea, dyspnea\n**Heart failure:** Dyspnea, orthopnea, edema (ischemic cardiomyopathy)\n**Sudden cardiac death:** VF/VT from acute ischemia\n\n**Atypical presentations:** Diabetics (silent ischemia), elderly (dyspnea, confusion), women (fatigue, nausea, jaw pain)',
  '**Non-invasive:**\n- ECG (resting, stress TMT)\n- Echocardiography (wall motion, EF)\n- Stress imaging (stress echo, MPI)\n- CT calcium scoring, CT coronary angiography\n\n**Invasive:**\n- **Coronary angiography:** Gold standard for anatomy\n- **FFR:** Functional significance (<0.80 = significant)\n- IVUS/OCT: Plaque characterization\n\n**Biomarkers:** Troponin (hs-TnI/T), CK-MB, BNP',
  '**Lifestyle:** Smoking cessation, exercise, Mediterranean diet, weight loss\n\n**Medical therapy:**\n- Anti-ischemic: Beta-blockers, nitrates, CCBs\n- Antiplatelets: Aspirin ± P2Y12 inhibitor\n- Statins: High-intensity (LDL target <70)\n- ACEi/ARB: If DM, HTN, LV dysfunction\n\n**Revascularization:**\n- PCI: 1-2 vessel disease, low-risk anatomy\n- CABG: Left main, 3-vessel, DM + multivessel, low EF\n- LIMA to LAD: >90% patency at 10 years\n\n**STEMI-specific:** Primary PCI (door-to-balloon <90 min) or thrombolysis (door-to-needle <30 min)',
  '**Early MI complications:** VF, cardiogenic shock, mechanical (free wall rupture day 3-5, VSD, papillary muscle rupture)\n**Late:** Dressler syndrome (2-10 wk), LV aneurysm, mural thrombus, ischemic cardiomyopathy\n\n**Prognosis:** Depends on EF, vessel involvement, comorbidities. Well-controlled IHD with secondary prevention has good long-term outcomes.',
  'IHD = coronary atherosclerosis causing ischemia. Spectrum: stable angina → ACS → sudden death. Vulnerable plaque causes ACS. Troponin is key biomarker. Treatment: medical therapy + revascularization. Secondary prevention: aspirin, statin, ACEi, BB.',
  ['Leading cause of death worldwide', '**Vulnerable plaque** (thin cap + large lipid core) causes ACS, NOT most stenotic', 'Troponin rises **3-4 hours** post-MI, peaks **12-24 hours**', 'LIMA to LAD graft: **>90% patency at 10 years**', 'Dressler syndrome: **2-10 weeks** post-MI', 'VF: Most common cause of death in **first 24h** of MI', 'Free wall rupture: **Day 3-5** post-MI'],
  ['**Atherosclerosis steps:** Injury → LDL → Foam cells → Fatty streak → Fibrous cap → Plaque'],
  ['Atherosclerosis pathogenesis', 'Stable vs vulnerable plaque', 'STEMI territories on ECG', 'PCI vs CABG indications', 'MI complications and timing', 'Troponin timeline'],
  ['Aortic dissection', 'PE', 'Pericarditis', 'GERD', 'Musculoskeletal', 'Vasospastic angina']
);

addTopic('cardiology/cardiac-transplant',
  '**Cardiac transplantation** is the definitive treatment for end-stage heart failure refractory to optimal medical and device therapy. It involves orthotopic replacement of the failing heart with a donor heart. Immunosuppression, rejection surveillance, and management of graft vasculopathy are lifelong requirements.',
  ['Indication: End-stage HF (NYHA III-IV) refractory to optimal therapy', 'Most common indications: **Ischemic cardiomyopathy** and **dilated cardiomyopathy**', 'Contraindications: Active malignancy, irreversible pulmonary HTN (PVR>5), active infection', 'Triple immunosuppression: Calcineurin inhibitor + antimetabolite + steroid', 'Acute rejection detection: **Endomyocardial biopsy** (gold standard)', 'Chronic rejection: **Cardiac allograft vasculopathy (CAV)**', 'Median survival: **10-13 years** post-transplant'],
  '**Types:** Orthotopic (standard — replaces native heart) vs Heterotopic (rare — alongside native heart)\n\n**Selection criteria:**\n- End-stage HF (EF<25%, NYHA III-IV) despite optimal medical therapy + CRT/LVAD\n- VO₂