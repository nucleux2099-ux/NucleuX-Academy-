/**
 * NucleuX Academy - Cardiology Topics (Medicine)
 * Harrison's 22nd Edition Based Content
 * Complete with concepts, exam prep, retrieval cards, and cases
 */

import type { LibraryTopic, RetrievalCard, CaseScenario, TextbookReference } from '../../types/library';

// =============================================================================
// HEART FAILURE
// =============================================================================

const heartFailureTopic: LibraryTopic = {
  id: 'heart-failure',
  subjectId: 'medicine',
  subspecialtyId: 'medicine-cardiology',
  name: 'Heart Failure',
  slug: 'heart-failure',
  description: 'HFrEF vs HFpEF, staging, and guideline-directed medical therapy',
  content: {
    concept: `# Heart Failure

## Definition
Heart failure (HF) is a clinical syndrome resulting from structural or functional cardiac abnormalities that impair the ability of the ventricle to fill with or eject blood adequately to meet tissue metabolic demands.

## Classification by Ejection Fraction

| Type | EF | Key Features |
|------|-----|--------------|
| **HFrEF** | ≤40% | Systolic dysfunction, dilated LV |
| **HFmrEF** | 41-49% | "Gray zone," may respond to HFrEF therapy |
| **HFpEF** | ≥50% | Diastolic dysfunction, preserved systole |
| **HFimpEF** | Previously ≤40%, now >40% | Improved EF (still treat as HFrEF) |

## Etiology

### Common Causes
- **Ischemic Heart Disease** (65-70%): MI, chronic ischemia
- **Hypertension**: Long-standing, uncontrolled
- **Valvular Disease**: AS, AR, MR
- **Cardiomyopathies**: DCM, HCM, ARVC, restrictive
- **Toxic**: Alcohol, chemotherapy (anthracyclines), cocaine

### Less Common
- Viral myocarditis (Coxsackie B, Parvovirus B19)
- Peripartum cardiomyopathy
- Tachycardia-induced cardiomyopathy
- Infiltrative (amyloid, sarcoid, hemochromatosis)
- Thyroid disease (thyrotoxic heart disease)

## Pathophysiology

### Neurohormonal Activation
1. **RAAS Activation**
   - ↓ Cardiac output → ↓ Renal perfusion
   - Angiotensin II: Vasoconstriction, aldosterone release
   - Aldosterone: Na+/H2O retention, fibrosis

2. **Sympathetic Activation**
   - ↑ Catecholamines → Tachycardia, vasoconstriction
   - Myocardial toxicity with chronic activation
   - β-receptor downregulation

3. **Natriuretic Peptides** (Counter-regulatory)
   - BNP, ANP: Natriuresis, vasodilation
   - Released in response to wall stress
   - Overwhelmed in advanced HF

### Cardiac Remodeling
- **Eccentric hypertrophy** (volume overload): Sarcomeres in series
- **Concentric hypertrophy** (pressure overload): Sarcomeres in parallel
- Myocyte apoptosis and fibrosis
- Progressive dilation and sphericalization

## Clinical Features

### Symptoms
**Left-sided (backward failure)**
- Dyspnea on exertion (most common)
- Orthopnea (2-3 pillow orthopnea)
- Paroxysmal nocturnal dyspnea (PND)
- Nocturnal cough (cardiac asthma)

**Right-sided (backward failure)**
- Peripheral edema (ankle, presacral)
- Abdominal distension (ascites)
- Right upper quadrant pain (hepatic congestion)
- Early satiety, anorexia

**Low output (forward failure)**
- Fatigue, weakness
- Altered mental status
- Cool extremities
- Oliguria

### Signs
- **Inspection**: Elevated JVP (>8 cm), positive hepatojugular reflux
- **Palpation**: Displaced apex (beyond 5th ICS, MCL), RV heave
- **Auscultation**: S3 gallop (↑ filling pressure), S4 (stiff ventricle)
- **Lungs**: Bibasilar crackles, pleural effusion (R > L)
- **Abdomen**: Hepatomegaly, ascites, pulsatile liver (TR)
- **Extremities**: Pitting edema, cool peripheries

## Staging and Classification

### ACC/AHA Stages
| Stage | Description | Management |
|-------|-------------|------------|
| **A** | At risk (HTN, DM, CAD) | Risk factor modification |
| **B** | Structural disease, no symptoms | ACEI/ARB if HFrEF |
| **C** | Structural + symptoms | GDMT + devices |
| **D** | Refractory, end-stage | MCS, transplant, palliative |

### NYHA Functional Class
| Class | Symptoms | Exercise Tolerance |
|-------|----------|-------------------|
| I | None | Ordinary activity |
| II | Mild | Slight limitation |
| III | Moderate | Marked limitation |
| IV | Severe | Symptoms at rest |

## Diagnosis

### Initial Workup
- **BNP/NT-proBNP**: BNP >100 pg/mL, NT-proBNP >300 pg/mL suggestive
- **12-lead ECG**: Ischemia, LVH, BBB, AF
- **CXR**: Cardiomegaly, pulmonary venous congestion, Kerley B lines
- **Echocardiogram**: EF, wall motion, valve function, diastolic parameters
- **Labs**: CBC, BMP, LFTs, TSH, lipid panel, iron studies

### Causes of Elevated Natriuretic Peptides
- Heart failure (primary)
- ACS, myocarditis
- Pulmonary embolism
- Renal failure (reduced clearance)
- Advanced age
- Atrial fibrillation

### Causes of Low BNP Despite HF
- Obesity (peptide sequestration in adipose)
- Flash pulmonary edema (not yet released)
- HFpEF (may be lower than HFrEF)

## Guideline-Directed Medical Therapy (GDMT)

### Four Pillars for HFrEF (Class I)
1. **ARNI or ACEi/ARB**
   - Sacubitril-valsartan preferred over ACEi
   - Target: Maximum tolerated dose
   - Monitor: K+, creatinine (up to 30% rise acceptable)

2. **Beta-Blocker (Evidence-Based)**
   - Carvedilol, bisoprolol, or metoprolol succinate
   - Start low, titrate slowly (double q2 weeks)
   - Target: Resting HR 50-70 bpm

3. **MRA (Mineralocorticoid Receptor Antagonist)**
   - Spironolactone or eplerenone
   - For NYHA II-IV with EF ≤35%
   - Contraindicated if K+ >5.0, eGFR <30

4. **SGLT2 Inhibitor**
   - Dapagliflozin or empagliflozin
   - Independent of diabetes status
   - Benefits: ↓ HF hospitalization, ↓ CV death

### Additional Therapies
- **Diuretics**: Symptom relief (not mortality benefit)
- **Digoxin**: For rate control, ↓ hospitalization
- **Hydralazine + Isosorbide dinitrate**: African Americans, ACEi intolerant
- **Ivabradine**: Sinus rhythm, HR ≥70 on max BB

### Device Therapy
**ICD (Primary Prevention)**
- EF ≤35% despite 3 months GDMT
- NYHA II-III, life expectancy >1 year

**CRT (Cardiac Resynchronization)**
- EF ≤35%, LBBB, QRS ≥150 ms
- NYHA II-IV ambulatory, sinus rhythm

## Acute Decompensated Heart Failure (ADHF)

### Hemodynamic Profiles (Forrester Classification)
| Profile | CI | PCWP | Features |
|---------|-----|------|----------|
| Warm-Dry | ≥2.2 | ≤18 | Compensated |
| Warm-Wet | ≥2.2 | >18 | Congested, perfused |
| Cold-Dry | <2.2 | ≤18 | Low output |
| Cold-Wet | <2.2 | >18 | Cardiogenic shock |

### Management of ADHF
1. **Warm-Wet (most common)**
   - IV diuretics (furosemide 1-2x home dose)
   - Vasodilators if BP allows (nitroprusside, nitroglycerine)
   - Fluid restriction, Na+ restriction

2. **Cold-Wet (cardiogenic shock)**
   - Inotropes: Dobutamine, milrinone
   - Mechanical support: IABP, Impella, ECMO
   - Vasopressors if hypotensive (norepinephrine)

### Diuretic Resistance
- Increase dose, switch to IV continuous infusion
- Add metolazone (sequential nephron blockade)
- Consider ultrafiltration

## HFpEF Management
- **Primary**: Treat underlying cause (HTN, CAD, AF)
- **Diuretics**: For congestion
- **SGLT2i**: Now proven beneficial (EMPEROR-Preserved, DELIVER)
- **Weight loss**: If obese
- **MRA**: May reduce hospitalizations
- No proven mortality benefit for ACEI, ARB, BB

## Prognosis
- 5-year mortality: 50%
- MAGGIC risk score for prognosis
- Poor prognostic factors: Low EF, elevated BNP, renal dysfunction, hyponatremia

---

*"The heart failure syndrome represents the final common pathway of all forms of heart disease."* — Eugene Braunwald`,
    
    keyPoints: [
      'HFrEF (EF ≤40%) is systolic dysfunction; HFpEF (EF ≥50%) is diastolic dysfunction',
      'Four pillars of HFrEF therapy: ARNI/ACEi, BB, MRA, SGLT2i',
      'SGLT2 inhibitors now indicated for ALL types of HF (including HFpEF)',
      'S3 gallop indicates elevated filling pressures and is specific for HF',
      'NYHA class (symptoms) is dynamic; ACC/AHA stage (structure) never regresses',
      'BNP/NT-proBNP helps diagnose HF and guides prognosis (higher = worse)',
      'Obesity causes false-low BNP readings',
      'ICD for primary prevention when EF ≤35% after 3 months of GDMT',
      'CRT requires LBBB + QRS ≥150 ms for best response',
      'HFimpEF patients should continue HFrEF medications even if EF normalizes'
    ],
    
    examPrep: {
      summary: `**Heart Failure - High Yield Summary**

**Classification**: HFrEF (≤40%), HFmrEF (41-49%), HFpEF (≥50%)

**GDMT Four Pillars (HFrEF)**: 
1. ARNI (or ACEi/ARB) - Target max dose
2. Evidence-based BB (carvedilol, bisoprolol, metoprolol XL)
3. MRA (spironolactone/eplerenone) - if EF ≤35%
4. SGLT2i (dapa/empa) - regardless of DM

**Device Criteria**:
- ICD: EF ≤35%, 3mo GDMT, NYHA II-III
- CRT: EF ≤35%, LBBB, QRS ≥150ms

**ADHF Profiles**: Warm-wet (diuretics) > Cold-wet (inotropes) > Cold-dry > Warm-dry`,
      
      mnemonics: [
        'ABCD for HFrEF: ARNI, Beta-blocker, MRA (Counteracts aldosterone), DAPAGLIFLOZIN/empagliflozin',
        'S3 = "KEN-tucky" gallop, S4 = "TEN-nessee" gallop',
        'HFpEF causes: HALT-MAD (HTN, Aortic stenosis, LVH, Tachycardia, Myocardial ischemia, Amyloid, Diabetes)',
        'Diuretic resistance: "Metolazone before furosemide"'
      ],
      
      highYield: [
        'ARNI superior to ACEi (PARADIGM-HF) - 20% reduction in CV death/HF hospitalization',
        'Do not combine ARNI with ACEi - 36 hour washout required (angioedema risk)',
        'SGLT2i works in HF even without diabetes (DAPA-HF, EMPEROR-Reduced)',
        'African Americans: Add hydralazine-nitrates even on full GDMT (A-HeFT trial)',
        'BB should NOT be started during acute decompensation but should NOT be stopped',
        'Digoxin reduces hospitalization but NOT mortality',
        'Up to 30% creatinine rise is acceptable when starting ACEi/ARNI',
        'Cardiogenic shock: Cold-wet profile, CI <2.2, PCWP >18'
      ],
      
      commonMCQs: [
        'Most common cause of right heart failure: Left heart failure',
        'Drug contraindicated in acute decompensation: Beta-blockers (do not initiate)',
        'First-line for African Americans with HFrEF: Hydralazine + ISDN',
        'CRT responder criteria: LBBB morphology, QRS ≥150ms, EF ≤35%',
        'Drug causing hyperkalemia in HF: Spironolactone (MRA)'
      ]
    },
    
    textbookRefs: [
      { textbook: "Harrison's Principles of Internal Medicine", edition: '22nd', chapter: 'Ch 198', chapterTitle: 'Heart Failure: Pathophysiology and Diagnosis', pages: '1984-1995' },
      { textbook: "Harrison's Principles of Internal Medicine", edition: '22nd', chapter: 'Ch 199', chapterTitle: 'Heart Failure: Management', pages: '1995-2010' }
    ],
    
    retrievalCards: [
      {
        id: 'hf-1',
        question: 'What are the four pillars of guideline-directed medical therapy for HFrEF?',
        answer: '1. ARNI (or ACEi/ARB)\n2. Evidence-based beta-blocker (carvedilol, bisoprolol, metoprolol succinate)\n3. MRA (spironolactone or eplerenone)\n4. SGLT2 inhibitor (dapagliflozin or empagliflozin)',
        difficulty: 2,
        tags: ['HFrEF', 'treatment']
      },
      {
        id: 'hf-2',
        question: 'What is the washout period required when switching from ACEi to ARNI?',
        answer: '36 hours - to prevent angioedema from combined neprilysin and ACE inhibition',
        difficulty: 3,
        tags: ['ARNI', 'safety']
      },
      {
        id: 'hf-3',
        question: 'What are the criteria for ICD implantation for primary prevention in HFrEF?',
        answer: 'EF ≤35% despite at least 3 months of optimal GDMT, NYHA class II-III, life expectancy >1 year',
        difficulty: 3,
        tags: ['devices', 'ICD']
      },
      {
        id: 'hf-4',
        question: 'Why does obesity cause false-low BNP levels?',
        answer: 'BNP is sequestered in adipose tissue, leading to lower circulating levels. Obesity also upregulates neprilysin, which degrades natriuretic peptides.',
        difficulty: 4,
        tags: ['BNP', 'diagnostics']
      },
      {
        id: 'hf-5',
        question: 'What defines a "Cold-Wet" hemodynamic profile in acute HF?',
        answer: 'Cardiac index <2.2 L/min/m² AND PCWP >18 mmHg. Clinically: cool extremities + congestion. This represents cardiogenic shock.',
        difficulty: 3,
        tags: ['ADHF', 'hemodynamics']
      },
      {
        id: 'hf-6',
        question: 'Which beta-blockers have mortality benefit in HFrEF?',
        answer: 'Only 3 "evidence-based" beta-blockers:\n1. Carvedilol\n2. Bisoprolol\n3. Metoprolol succinate (extended-release)\n\nMetoprolol tartrate does NOT have this evidence.',
        difficulty: 2,
        tags: ['beta-blocker', 'HFrEF']
      },
      {
        id: 'hf-7',
        question: 'What is HFimpEF and how should it be managed?',
        answer: 'HFimpEF = HF with improved EF (previously ≤40%, now >40%). Continue all HFrEF medications as stopping them leads to relapse. The underlying cardiomyopathy persists.',
        difficulty: 4,
        tags: ['classification', 'prognosis']
      },
      {
        id: 'hf-8',
        question: 'What is the mechanism of benefit of SGLT2 inhibitors in HF?',
        answer: 'Multifactorial:\n1. Osmotic diuresis (reduces preload)\n2. Improved myocardial energetics (shifts metabolism to ketones)\n3. Reduced inflammation and fibrosis\n4. Natriuresis\n5. Glycemic benefit is NOT the primary mechanism',
        difficulty: 4,
        tags: ['SGLT2i', 'mechanism']
      }
    ],
    
    cases: [
      {
        id: 'hf-case-1',
        title: 'New-Onset Heart Failure After MI',
        presentation: 'A 62-year-old man presents with progressive dyspnea and bilateral leg swelling 6 weeks after anterior STEMI. He sleeps on 3 pillows and wakes up gasping at night. BP 110/70, HR 88, JVP elevated at 12 cm, S3 gallop present, bibasilar crackles. Echo shows EF 30%, anterior wall akinesis.',
        questions: [
          {
            question: 'What is the diagnosis and ACC/AHA stage?',
            answer: 'Ischemic cardiomyopathy with HFrEF (EF 30%). ACC/AHA Stage C (structural heart disease with symptoms). NYHA Class III (marked limitation).'
          },
          {
            question: 'What medications should be initiated?',
            answer: 'Initiate the four pillars of GDMT:\n1. ARNI (sacubitril-valsartan) - start low, uptitrate\n2. Beta-blocker (carvedilol) - start 3.125 mg BID\n3. MRA (spironolactone 25mg) - check K+ and creatinine\n4. SGLT2i (dapagliflozin 10mg)\n+ Loop diuretic for congestion (furosemide)'
          },
          {
            question: 'When should he be reassessed for device therapy?',
            answer: 'Reassess EF after 3 months of optimal GDMT. If EF remains ≤35%, consider ICD for primary prevention. If LBBB with QRS ≥150ms, CRT-D would be preferred.'
          }
        ],
        keyLearning: [
          'Post-MI HF is ischemic cardiomyopathy until proven otherwise',
          'Start all four GDMT pillars early but uptitrate slowly',
          'Wait 3 months on GDMT before deciding on ICD (EF may improve)',
          'S3 gallop = elevated filling pressure, specific for systolic HF'
        ],
        difficulty: 3
      },
      {
        id: 'hf-case-2',
        title: 'ADHF with Cardiogenic Shock',
        presentation: 'A 55-year-old woman with known DCM (EF 20%) presents confused with severe dyspnea. BP 78/50, HR 112, cool mottled extremities, JVP 16 cm, lungs with diffuse crackles, minimal urine output. Lactate 4.5 mmol/L.',
        questions: [
          {
            question: 'What is the hemodynamic profile?',
            answer: 'Cold-Wet profile (cardiogenic shock). Evidence: hypoperfusion (confusion, cool extremities, oliguria, elevated lactate) + congestion (elevated JVP, crackles).'
          },
          {
            question: 'What is the immediate management?',
            answer: '1. ICU admission\n2. Inotrope support: Dobutamine (5-10 mcg/kg/min) to improve cardiac output\n3. Vasopressor if needed: Norepinephrine (to maintain MAP >65)\n4. Cautious diuresis after stabilization\n5. Consider mechanical support (IABP/Impella) if refractory\n6. Evaluate for urgent transplant/MCS candidacy'
          },
          {
            question: 'Should her beta-blocker be continued?',
            answer: 'Do NOT initiate new beta-blocker in acute decompensation. If she was on BB at home, it should be HELD or reduced (not stopped completely if possible, as abrupt withdrawal can worsen outcomes). Restart once stabilized.'
          }
        ],
        keyLearning: [
          'Cold-Wet = cardiogenic shock, worst prognosis',
          'Inotropes are bridge therapies, not destination',
          'Hold but do not abruptly stop beta-blockers in ADHF',
          'Lactate elevation indicates tissue hypoperfusion'
        ],
        difficulty: 4
      }
    ]
  },
  prerequisites: ['cardiac-examination', 'ecg-basics'],
  relatedTopics: ['acute-heart-failure', 'cardiomyopathy', 'acute-coronary-syndrome'],
  difficulty: 4,
  highYield: true,
  examTags: ['NEET_PG', 'USMLE', 'MRCP'],
  estimatedMinutes: 60,
  hasContent: { concept: true, examPrep: true, textbook: true, retrievalCards: true, cases: true, grindeMap: false },
  createdAt: '2025-02-09',
  updatedAt: '2025-02-09'
};

// =============================================================================
// ISCHEMIC HEART DISEASE
// =============================================================================

const ischemicHeartDiseaseTopic: LibraryTopic = {
  id: 'ischemic-heart-disease',
  subjectId: 'medicine',
  subspecialtyId: 'medicine-cardiology',
  name: 'Ischemic Heart Disease',
  slug: 'ischemic-heart-disease',
  description: 'Stable angina, chronic coronary syndromes, and risk stratification',
  content: {
    concept: `# Ischemic Heart Disease

## Definition
Ischemic heart disease (IHD) encompasses conditions where myocardial oxygen demand exceeds supply, primarily due to coronary artery disease (CAD). The spectrum includes stable angina, silent ischemia, and acute coronary syndromes.

## Pathophysiology

### Atherosclerosis: The Foundation
1. **Endothelial injury** → LDL infiltration
2. **Fatty streak** → Macrophage foam cells
3. **Fibrous plaque** → Smooth muscle migration, collagen cap
4. **Vulnerable plaque** → Thin cap, lipid-rich core, inflammation
5. **Plaque rupture/erosion** → Thrombosis → ACS

### Determinants of Myocardial Oxygen Balance

**Oxygen Demand (MVO₂)** - Increased by:
- Heart rate (most important modifiable factor)
- Contractility
- Wall tension (preload and afterload)

**Oxygen Supply** - Determined by:
- Coronary blood flow (occurs in diastole!)
- Oxygen-carrying capacity (Hb, SaO₂)
- Coronary artery diameter

### Why Angina Occurs
- At rest: Coronary flow reserve compensates for stenosis
- With exertion: Demand exceeds maximal dilatory capacity
- Threshold effect: Symptoms at reproducible workload

## Clinical Presentation

### Typical Angina (All 3 criteria)
1. Substernal chest discomfort
2. Provoked by exertion or emotional stress
3. Relieved by rest or nitroglycerin within 5 minutes

### Atypical Angina
- 2 of 3 criteria
- More common in women, elderly, diabetics

### Non-cardiac Chest Pain
- ≤1 of 3 criteria
- Consider GI, musculoskeletal, pulmonary causes

### Anginal Equivalents
- Dyspnea on exertion
- Fatigue
- Diaphoresis
- Nausea

### CCS Angina Classification
| Class | Description |
|-------|-------------|
| I | Angina only with strenuous activity |
| II | Slight limitation; angina walking >2 blocks, >1 flight stairs |
| III | Marked limitation; angina walking <2 blocks, <1 flight |
| IV | Unable to do any activity without angina; may occur at rest |

## Risk Factors

### Non-modifiable
- Age (M >45, F >55)
- Male sex
- Family history of premature CAD (1st degree: M <55, F <65)

### Modifiable
- **Dyslipidemia** (elevated LDL, low HDL)
- **Hypertension**
- **Diabetes mellitus**
- **Smoking** (most modifiable)
- **Obesity**
- **Sedentary lifestyle**

### Emerging Risk Factors
- Lipoprotein(a)
- hs-CRP
- Coronary artery calcium score

## Diagnosis

### Pre-test Probability (Updated 2019 ESC)
Based on age, sex, and symptom characteristics:
- Low (<15%): Unlikely CAD
- Intermediate (15-85%): Testing indicated
- High (>85%): Assume CAD, proceed to angiography

### Stress Testing

**Exercise ECG** (if baseline ECG normal)
- First-line if patient can exercise
- Positive: ≥1 mm horizontal/downsloping ST depression
- Duke Treadmill Score for prognosis

**Stress Imaging** (preferred over exercise ECG)
- Exercise or pharmacological (adenosine, dobutamine)
- Modalities: Stress echo, nuclear (SPECT/PET), CMR
- Provides anatomical AND functional data

**When to use pharmacological stress:**
- Cannot exercise adequately
- LBBB, paced rhythm (use vasodilator, not dobutamine)
- Pre-excitation (WPW)

### Anatomical Testing

**Coronary CT Angiography (CCTA)**
- High NPV (rules out CAD)
- Good for low-intermediate probability
- CAC score: Prognostic, not diagnostic

**Invasive Coronary Angiography**
- Gold standard for anatomy
- Indicated if high probability or positive stress test
- Allows simultaneous intervention (PCI)

### Fractional Flow Reserve (FFR)
- FFR ≤0.80 = hemodynamically significant stenosis
- Guides revascularization decisions for intermediate lesions (50-70%)

## Management

### Lifestyle Modification
- Smoking cessation (reduces risk by 50% within 1 year)
- Mediterranean diet
- Exercise: 30-60 min moderate activity most days
- Weight management (BMI <25)

### Medical Therapy

**Anti-ischemic Therapy**
1. **Beta-blockers** (first-line)
   - ↓ HR, contractility, BP
   - Target HR 55-60 bpm
   
2. **Nitrates**
   - Sublingual NTG for acute relief
   - Long-acting for prophylaxis
   - Nitrate-free interval (10-12 hours) to prevent tolerance

3. **Calcium Channel Blockers**
   - Dihydropyridines (amlodipine): Add to BB
   - Non-dihydropyridines (diltiazem, verapamil): If BB contraindicated

4. **Ranolazine**
   - Inhibits late sodium current
   - No hemodynamic effects
   - Add-on for refractory angina

**Anti-atherosclerotic Therapy**
1. **Aspirin 75-100 mg daily**
   - Lifelong for established CAD
   
2. **High-intensity statin** (target LDL <70 mg/dL or 50% reduction)
   - Atorvastatin 40-80 mg or Rosuvastatin 20-40 mg
   
3. **ACE inhibitor** (if HTN, DM, LV dysfunction)

4. **Ezetimibe** (add if LDL not at goal)

5. **PCSK9 inhibitor** (evolocumab, alirocumab)
   - For very high risk, LDL not at goal on max statin + ezetimibe

### Revascularization

**PCI vs CABG: Decision Making**

| Factor | Favors PCI | Favors CABG |
|--------|-----------|-------------|
| Anatomy | 1-2 vessel, non-left main | 3-vessel, left main, diabetic |
| SYNTAX score | <22 | >32 |
| LV function | Preserved | Reduced |
| Diabetes | Simple lesion | Multivessel disease |
| Comorbidities | High surgical risk | Can tolerate surgery |

**Indications for Revascularization in Stable Angina**
- Refractory symptoms despite optimal medical therapy
- High-risk features on stress testing
- Left main disease >50%
- 3-vessel disease with LV dysfunction
- Proximal LAD disease with ischemia

### Prognosis
- Annual mortality: 1-2% for stable angina
- High-risk features: Left main, 3VD, LV dysfunction, large ischemic burden
- ISCHEMIA trial: No mortality benefit of routine invasive strategy in stable CAD

---

*"The goal in stable ischemic heart disease is to reduce ischemia and prevent cardiovascular events through aggressive risk factor modification and guideline-directed therapy."*`,
    
    keyPoints: [
      'Typical angina requires all 3 criteria: substernal, exertional, relieved by rest/NTG',
      'Beta-blockers are first-line anti-anginal therapy (target HR 55-60 bpm)',
      'Nitrate tolerance develops rapidly - need 10-12 hour nitrate-free interval',
      'FFR ≤0.80 indicates hemodynamically significant stenosis',
      'High-intensity statin for ALL patients with established CAD (LDL goal <70)',
      'CABG preferred over PCI for: left main, 3-vessel disease, diabetics with multivessel CAD',
      'ISCHEMIA trial: Stable CAD - no mortality benefit from routine invasive strategy',
      'Coronary flow occurs during DIASTOLE (important for tachycardia-induced ischemia)',
      'CAC score of 0 effectively rules out obstructive CAD in symptomatic patients',
      'Smoking cessation reduces cardiac risk by 50% within one year'
    ],
    
    examPrep: {
      summary: `**Ischemic Heart Disease - High Yield**

**Typical Angina = 3/3**: Substernal + Exertional + Relieved by rest/NTG

**Anti-ischemic Therapy**:
1. Beta-blocker (1st line) - HR target 55-60
2. Nitrates (PRN or prophylactic) - 10-12 hr free interval
3. CCB (add to BB or replace if CI)
4. Ranolazine (add-on for refractory)

**Secondary Prevention**:
- Aspirin + High-intensity statin (ALL patients)
- LDL goal: <70 mg/dL

**Revascularization (CABG > PCI)**:
- Left main >50%
- 3-vessel disease
- Diabetic with multivessel
- SYNTAX score >32`,
      
      mnemonics: [
        'Angina criteria: "SEaRch" - Substernal, Exertional, Relieved by rest/NTG',
        'CCS Class by blocks: I = unlimited, II = >2 blocks, III = <2 blocks, IV = at rest',
        'High-risk stress findings: "DISH" - Duke score ≤-11, Ischemia ≥10% myocardium, ST ↓ ≥2mm, Hypotension with exercise',
        'CABG preferred: "DM + LAD + 3VD + LM" (Diabetes, Left Anterior Descending, 3-Vessel Disease, Left Main)'
      ],
      
      highYield: [
        'ISCHEMIA trial (2020): No mortality difference between invasive vs conservative in stable CAD with moderate-severe ischemia',
        'FFR <0.80 = significant stenosis, defer if ≥0.80 (DEFER, FAME trials)',
        'COURAGE trial: PCI does NOT reduce death/MI vs medical therapy in stable CAD',
        'Exercise stress ECG is less accurate in women (more false positives)',
        'Duke Treadmill Score = Exercise time - (5 × ST depression) - (4 × angina index); ≤-11 is high risk',
        'Coronary CT angiography: excellent NPV (97-99%), rules out CAD'
      ],
      
      commonMCQs: [
        'Most important modifiable risk factor for CAD: Smoking',
        'When to use pharmacological stress over exercise: LBBB, paced rhythm, WPW',
        'First-line anti-anginal: Beta-blocker',
        'LDL target in established CAD: <70 mg/dL',
        'Nitrate tolerance prevention: 10-12 hour nitrate-free interval'
      ]
    },
    
    textbookRefs: [
      { textbook: "Harrison's Principles of Internal Medicine", edition: '22nd', chapter: 'Ch 195', chapterTitle: 'Ischemic Heart Disease', pages: '1950-1970' }
    ],
    
    retrievalCards: [
      {
        id: 'ihd-1',
        question: 'What are the 3 criteria for typical angina?',
        answer: '1. Substernal chest discomfort (pressure, squeezing)\n2. Provoked by exertion or emotional stress\n3. Relieved by rest or sublingual nitroglycerin within 5 minutes\n\nAtypical angina = 2 of 3; Non-cardiac = ≤1 of 3',
        difficulty: 1,
        tags: ['diagnosis', 'angina']
      },
      {
        id: 'ihd-2',
        question: 'Why is coronary blood flow predominantly diastolic?',
        answer: 'During systole, ventricular contraction compresses intramural coronary vessels, preventing flow. Blood flows during diastole when the ventricle relaxes. This is why tachycardia (shortened diastole) causes ischemia.',
        difficulty: 3,
        tags: ['physiology']
      },
      {
        id: 'ihd-3',
        question: 'What is the nitrate-free interval and why is it necessary?',
        answer: '10-12 hours without nitrate exposure (usually overnight). Continuous nitrate exposure leads to tolerance through:\n1. Depletion of sulfhydryl groups\n2. Neurohormonal activation\n3. Increased oxidative stress\nThis maintains nitrate efficacy for long-term use.',
        difficulty: 3,
        tags: ['pharmacology', 'nitrates']
      },
      {
        id: 'ihd-4',
        question: 'What FFR value indicates a hemodynamically significant coronary stenosis?',
        answer: 'FFR ≤0.80 indicates significant stenosis warranting revascularization.\nFFR >0.80 = safe to defer revascularization\nFFR = ratio of maximal flow in stenosed artery to flow in same artery if normal (during hyperemia)',
        difficulty: 2,
        tags: ['FFR', 'intervention']
      },
      {
        id: 'ihd-5',
        question: 'What are the high-risk features on stress testing?',
        answer: 'High-risk features:\n1. Duke Treadmill Score ≤-11\n2. Large ischemic burden (≥10% myocardium)\n3. ST depression ≥2 mm or in multiple leads\n4. Hypotension during exercise\n5. Poor exercise capacity (<5 METs)\n6. Ventricular arrhythmias\n7. Persistent ST changes during recovery',
        difficulty: 3,
        tags: ['stress testing', 'risk stratification']
      },
      {
        id: 'ihd-6',
        question: 'When is CABG preferred over PCI in stable CAD?',
        answer: 'CABG preferred when:\n1. Left main disease >50%\n2. Three-vessel disease\n3. Diabetes with multivessel disease\n4. Complex anatomy (SYNTAX score >32)\n5. LV dysfunction (EF <40%)\n6. Failed PCI or in-stent restenosis',
        difficulty: 3,
        tags: ['revascularization', 'CABG', 'PCI']
      }
    ],
    
    cases: [
      {
        id: 'ihd-case-1',
        title: 'Typical Stable Angina',
        presentation: 'A 58-year-old man with HTN, diabetes, and smoking history presents with 6-month history of chest tightness when climbing stairs, relieved by rest. No symptoms at rest. BP 145/90, HR 72, normal exam. Resting ECG shows nonspecific ST-T changes.',
        questions: [
          {
            question: 'How would you classify his chest pain?',
            answer: 'Typical angina (3/3 criteria): substernal tightness + provoked by exertion + relieved by rest. CCS Class II (slight limitation, symptoms with moderate activity like stairs).'
          },
          {
            question: 'What is the next diagnostic step?',
            answer: 'Stress testing with imaging (stress echo or nuclear perfusion). Given abnormal baseline ECG, exercise ECG alone would be uninterpretable. If he cannot exercise, pharmacological stress.'
          },
          {
            question: 'What medications should be started?',
            answer: 'Anti-ischemic: Beta-blocker (metoprolol, target HR 55-60) + sublingual NTG PRN\nSecondary prevention: Aspirin 81mg daily + High-intensity statin (atorvastatin 80mg) + ACEi (for HTN/DM)\nRisk factor modification: Smoking cessation, BP control, glycemic control'
          }
        ],
        keyLearning: [
          'Typical angina with risk factors = high probability of CAD',
          'Stress imaging preferred over exercise ECG when baseline ECG abnormal',
          'Start medical therapy before/alongside diagnostic workup',
          'Address all modifiable risk factors'
        ],
        difficulty: 2
      }
    ]
  },
  prerequisites: ['cardiac-examination', 'ecg-basics'],
  relatedTopics: ['acute-coronary-syndrome', 'cardiovascular-prevention'],
  difficulty: 3,
  highYield: true,
  examTags: ['NEET_PG', 'USMLE', 'MRCP'],
  estimatedMinutes: 50,
  hasContent: { concept: true, examPrep: true, textbook: true, retrievalCards: true, cases: true, grindeMap: false },
  createdAt: '2025-02-09',
  updatedAt: '2025-02-09'
};

// =============================================================================
// ATRIAL FIBRILLATION
// =============================================================================

const atrialFibrillationTopic: LibraryTopic = {
  id: 'atrial-fibrillation',
  subjectId: 'medicine',
  subspecialtyId: 'medicine-cardiology',
  name: 'Atrial Fibrillation',
  slug: 'atrial-fibrillation',
  description: 'Rate vs rhythm control, anticoagulation decision-making, and CHA₂DS₂-VASc',
  content: {
    concept: `# Atrial Fibrillation

## Definition
Atrial fibrillation (AF) is a supraventricular tachyarrhythmia characterized by:
- Disorganized atrial electrical activity (350-600 impulses/min)
- Irregularly irregular ventricular response
- Absence of coordinated atrial contraction ("loss of atrial kick")

## Epidemiology
- Most common sustained arrhythmia
- Prevalence: 1-2% general population, 10% in age >80
- Lifetime risk: 25%
- 5× increased risk of stroke

## Classification

| Type | Duration | Characteristics |
|------|----------|-----------------|
| **Paroxysmal** | <7 days | Self-terminating |
| **Persistent** | ≥7 days | Requires intervention to terminate |
| **Long-standing persistent** | >12 months | Rhythm control still attempted |
| **Permanent** | Indefinite | Rate control accepted, no rhythm attempts |

## Etiology

### Cardiac Causes
- Hypertensive heart disease (most common)
- Valvular disease (especially mitral)
- Heart failure
- Coronary artery disease
- Cardiomyopathy (HCM, DCM)
- Pericarditis
- Congenital heart disease

### Non-cardiac Causes
- **Thyrotoxicosis** (check TSH in all new AF)
- Pulmonary disease (COPD, PE, OSA)
- Alcohol ("holiday heart syndrome")
- Surgery (especially cardiac, thoracic)
- Obesity
- Electrolyte disturbances
- Autonomic: vagally-mediated (nocturnal) or adrenergically-mediated

### Lone AF
- Age <60, no structural heart disease, no HTN
- Rare (<5% of AF)

## Pathophysiology

### Mechanisms
1. **Triggers**: Focal ectopic firing (usually from pulmonary veins)
2. **Substrate**: Atrial remodeling (fibrosis, dilation)
3. **Perpetuation**: Multiple wavelet reentry

### "AF Begets AF"
- Electrical remodeling: ↓ refractoriness, ↓ conduction velocity
- Structural remodeling: Fibrosis, chamber dilation
- Makes cardioversion less likely to succeed over time

### Hemodynamic Consequences
- Loss of atrial contraction: ↓ CO by 15-25%
- Rapid ventricular rate: ↓ diastolic filling, tachycardia-mediated cardiomyopathy
- Stasis in LAA: Thrombus formation → Stroke

## Clinical Presentation

### Symptoms (Variable)
- Palpitations, irregular heartbeat
- Dyspnea, fatigue, exercise intolerance
- Chest discomfort
- Dizziness, presyncope
- Polyuria (ANP release)
- Asymptomatic (20-30%)

### Signs
- Irregularly irregular pulse
- Variable S1 intensity
- Pulse deficit (apical rate > radial rate)
- Signs of underlying cause (thyroid, heart failure)

## Diagnosis

### 12-Lead ECG
- Absent P waves, fibrillatory waves ("f" waves)
- Irregularly irregular R-R intervals
- Usually narrow QRS (unless aberrancy or pre-existing BBB)

### Additional Workup
- **TSH**: All patients (hyperthyroidism in 2-5%)
- **Echocardiogram**: LV function, valves, LA size
- **BNP**: If HF suspected
- **Electrolytes, renal function**: Baseline for drugs
- **Sleep study**: If OSA suspected

### Long-term Monitoring
- If paroxysmal: Holter (24-48h), event monitor, implantable loop recorder
- Assess rate control and AF burden

## Management Overview

**Three Pillars:**
1. **Rate control** (or rhythm control)
2. **Stroke prevention** (anticoagulation)
3. **Treat underlying cause**

## Stroke Risk Assessment: CHA₂DS₂-VASc Score

| Risk Factor | Points |
|-------------|--------|
| CHF / LV dysfunction | 1 |
| Hypertension | 1 |
| Age ≥75 | 2 |
| Diabetes | 1 |
| Stroke/TIA/Thromboembolism | 2 |
| Vascular disease (MI, PAD, aortic plaque) | 1 |
| Age 65-74 | 1 |
| Sex category (female) | 1 |

### Anticoagulation Decision

| Score | Annual Stroke Risk | Recommendation |
|-------|-------------------|----------------|
| 0 (male) / 1 (female) | ~0-1% | No anticoagulation |
| 1 (male) | ~1.3% | Consider OAC |
| ≥2 | ≥2.2%/year | Anticoagulation recommended |

### Anticoagulation Options

**DOACs (Preferred)**
- Dabigatran (direct thrombin inhibitor)
- Rivaroxaban, Apixaban, Edoxaban (Factor Xa inhibitors)
- Benefits: Fixed dosing, no monitoring, fewer interactions

**Warfarin**
- Still used: Mechanical valves, moderate-severe mitral stenosis
- Target INR 2.0-3.0
- TTR should be >70% for efficacy

**Contraindications to DOACs**
- Mechanical heart valve (use warfarin only)
- Moderate-severe mitral stenosis
- Severe CKD (eGFR <15-30, drug-specific)
- Pregnancy

### Bleeding Risk: HAS-BLED Score
- Hypertension, Abnormal renal/liver, Stroke, Bleeding, Labile INR, Elderly, Drugs/alcohol
- Score ≥3: High bleeding risk
- Does NOT contraindicate OAC; prompts modifiable risk factor management

### Left Atrial Appendage Occlusion
- WATCHMAN device
- For patients who cannot tolerate long-term anticoagulation
- Non-inferior to warfarin for stroke prevention

## Rate Control

### Target
- Lenient: Resting HR <110 bpm (RACE II trial)
- Strict: HR <80 (reserve for symptomatic despite lenient control)

### Agents

**Beta-blockers (First-line)**
- Metoprolol, atenolol, carvedilol
- Contraindicated: Decompensated HF, severe asthma

**Non-DHP Calcium Channel Blockers**
- Diltiazem, verapamil
- Contraindicated: HFrEF (negative inotropy)

**Digoxin**
- Vagotonic, slows AV node
- Add-on if not controlled with above
- Less effective during activity
- Narrow therapeutic window

**Amiodarone**
- For rate control when others fail
- Not first-line (toxicity)

### Rate Control in Specific Situations
- **Acute setting**: IV metoprolol or diltiazem (avoid if hypotensive)
- **WPW + AF**: Avoid AV nodal blockers! Use procainamide, cardioversion
- **HFrEF**: Beta-blocker (once compensated) or digoxin

## Rhythm Control

### Who Benefits Most?
- Symptomatic despite rate control
- Young patients
- Tachycardia-mediated cardiomyopathy
- Early in AF course (recent onset)
- EARLY-AF, EAST-AFNET 4 trials: Early rhythm control improves outcomes

### Cardioversion

**Electrical Cardioversion**
- Synchronized DC shock
- Success rate 80-90%
- Requires sedation

**Pharmacological Cardioversion**
- Class IC: Flecainide, propafenone (no structural heart disease)
- Class III: Amiodarone, ibutilide, dofetilide

### Anticoagulation Around Cardioversion
- AF ≥48h or unknown duration: 
  - 3 weeks therapeutic anticoagulation before cardioversion, OR
  - TEE-guided approach (rule out LAA thrombus)
- Continue anticoagulation 4 weeks post-cardioversion (all patients)
- Long-term OAC based on CHA₂DS₂-VASc (regardless of sinus rhythm)

### Antiarrhythmic Drugs for Maintenance

| Drug | Structure | Notes |
|------|-----------|-------|
| Flecainide/Propafenone | No structural HD | "Pill-in-pocket" option |
| Sotalol | Mild LVH | QT prolongation risk |
| Dofetilide | Any | Requires inpatient initiation (QT) |
| Dronedarone | No HF (NYHA III-IV), permanent AF | Less effective than amiodarone |
| Amiodarone | Any including HF | Most effective, most toxic |

### Catheter Ablation

**Pulmonary Vein Isolation (PVI)**
- Targets triggers from pulmonary veins
- Superior to antiarrhythmic drugs for rhythm control
- First-line option in paroxysmal AF (CABANA, EARLY-AF)

**Success Rates**
- Paroxysmal: 70-80% freedom from AF at 1 year
- Persistent: 50-60% (may need repeat procedures)

**Indications**
- Symptomatic AF refractory/intolerant to AAD
- Patient preference (even as first-line)
- Tachycardia-mediated cardiomyopathy

## Special Situations

### AF with RVR and Hemodynamic Instability
- Synchronized cardioversion (not rate control)
- If hypotensive, altered, chest pain, pulmonary edema

### AF in WPW
- **Avoid**: Digoxin, CCB, beta-blockers, adenosine
- **Use**: Procainamide, ibutilide, or cardioversion
- Rationale: AV nodal blockade enhances conduction through accessory pathway → VF

### AF in Hyperthyroidism
- Rate control with beta-blockers
- Treat hyperthyroidism
- AF often resolves when euthyroid (cardioversion after 3-4 months)

---

*"Atrial fibrillation management is a three-pillar approach: control the rate (or rhythm), prevent stroke, and treat the underlying cause."*`,
    
    keyPoints: [
      'AF is irregularly irregular with absent P waves and fibrillatory waves',
      'CHA₂DS₂-VASc ≥2 (male) or ≥3 (female) = anticoagulate',
      'DOACs preferred over warfarin except for mechanical valves or mitral stenosis',
      'Check TSH in ALL new-onset AF (hyperthyroidism is treatable cause)',
      'Rate control target: HR <110 bpm is acceptable (lenient control - RACE II)',
      'Cardioversion requires 3 weeks pre- and 4 weeks post-anticoagulation',
      'Long-term anticoagulation based on CHA₂DS₂-VASc, NOT on rhythm',
      'In WPW with AF: AVOID AV nodal blockers (can cause VF)',
      'Catheter ablation (PVI) is first-line option for paroxysmal AF',
      'HAS-BLED score is for risk awareness, not to withhold anticoagulation'
    ],
    
    examPrep: {
      summary: `**Atrial Fibrillation - High Yield**

**Diagnosis**: Irregularly irregular rhythm, no P waves, f waves

**CHA₂DS₂-VASc**: CHF(1), HTN(1), Age≥75(2), DM(1), Stroke(2), Vasc(1), Age65-74(1), Sex-female(1)
- Score ≥2 (men) / ≥3 (women) = Anticoagulate

**DOACs > Warfarin** (except mechanical valve, MS)

**Rate Control**: BB or CCB (lenient HR <110)
**Rhythm Control**: Cardioversion, AADs, ablation

**Cardioversion Protocol**: 
- AF ≥48h → 3 weeks OAC before OR TEE to rule out thrombus
- 4 weeks OAC after (all patients)

**WPW + AF**: NO AV blockers! Use procainamide or cardiovert`,
      
      mnemonics: [
        'CHA₂DS₂-VASc: "CHF, HTN, Age≥75(2), DM, Stroke(2), Vascular, Age 65-74, Sc (sex category)"',
        'HAS-BLED: "HTN, Abnormal liver/renal, Stroke, Bleeding history, Labile INR, Elderly, Drugs/alcohol"',
        'WPW + AF = "AVOID" (AV nodal blockers cause Ventricular fibrillation, Only procainamide, Immediate cardioversion, Dangerous drugs: digoxin/diltiazem/BB)'
      ],
      
      highYield: [
        'Female sex only scores if another risk factor present',
        'EAST-AFNET 4 trial: Early rhythm control reduces CV events',
        'DOAC dose reduction for renal impairment and age',
        'Ibutilide for pharmacological cardioversion has highest efficacy but causes Torsades',
        'Dronedarone contraindicated in NYHA III-IV HF (ANDROMEDA trial)',
        'Amiodarone is safest in structural heart disease but has most toxicity',
        'WATCHMAN device: Alternative to OAC if contraindicated'
      ],
      
      commonMCQs: [
        'Most common cause of AF: Hypertension',
        'Drug contraindicated in WPW with AF: Digoxin (and all AV nodal blockers)',
        'First test in new AF: TSH',
        'Rate control agent in HFrEF: Beta-blocker (after compensation) or digoxin',
        'Anticoagulation after cardioversion: 4 weeks minimum (all patients)'
      ]
    },
    
    textbookRefs: [
      { textbook: "Harrison's Principles of Internal Medicine", edition: '22nd', chapter: 'Ch 203', chapterTitle: 'The Bradyarrhythmias: Disorders of Sinus and AV Node', pages: '2050-2065' },
      { textbook: "Harrison's Principles of Internal Medicine", edition: '22nd', chapter: 'Ch 204', chapterTitle: 'The Tachyarrhythmias: Ectopic Rhythms and Tachycardias', pages: '2065-2085' }
    ],
    
    retrievalCards: [
      {
        id: 'af-1',
        question: 'What is the CHA₂DS₂-VASc score and when should you anticoagulate?',
        answer: 'CHA₂DS₂-VASc:\nC - CHF (1)\nH - HTN (1)\nA₂ - Age ≥75 (2)\nD - Diabetes (1)\nS₂ - Stroke/TIA (2)\nV - Vascular disease (1)\nA - Age 65-74 (1)\nSc - Sex category female (1)\n\nAnticoagulate if score ≥2 (men) or ≥3 (women)',
        difficulty: 2,
        tags: ['anticoagulation', 'stroke prevention']
      },
      {
        id: 'af-2',
        question: 'Why are AV nodal blockers contraindicated in WPW with AF?',
        answer: 'AV nodal blockers (digoxin, CCB, BB, adenosine) preferentially block the AV node, causing more impulses to conduct through the accessory pathway. Since the accessory pathway has no decremental conduction, rapid 1:1 conduction to ventricles can occur, causing ventricular fibrillation.',
        difficulty: 4,
        tags: ['WPW', 'emergency']
      },
      {
        id: 'af-3',
        question: 'What is the anticoagulation protocol around cardioversion?',
        answer: 'If AF duration ≥48 hours or unknown:\n1. Therapeutic anticoagulation for 3 weeks BEFORE cardioversion, OR\n2. TEE to rule out LAA thrombus → can cardiovert immediately if no thrombus\n\nAfter cardioversion: Continue anticoagulation for at least 4 weeks (atrial stunning)\n\nLong-term: Based on CHA₂DS₂-VASc, regardless of successful cardioversion',
        difficulty: 3,
        tags: ['cardioversion', 'anticoagulation']
      },
      {
        id: 'af-4',
        question: 'When is warfarin preferred over DOACs in AF?',
        answer: 'Warfarin preferred in:\n1. Mechanical heart valves (DOACs contraindicated)\n2. Moderate-severe mitral stenosis (DOACs not studied)\n3. Severe renal impairment (eGFR <15-30)\n4. Patient on interacting medications where DOAC levels unpredictable\n5. Antiphospholipid syndrome (DOACs less effective)',
        difficulty: 3,
        tags: ['anticoagulation', 'DOACs']
      },
      {
        id: 'af-5',
        question: 'What are the contraindications to dronedarone?',
        answer: 'Dronedarone contraindicated in:\n1. NYHA Class III-IV heart failure (ANDROMEDA - increased mortality)\n2. Permanent AF (PALLAS - increased CV events)\n3. Severe hepatic impairment\n4. QTc >500ms\n5. Concomitant strong CYP3A4 inhibitors',
        difficulty: 4,
        tags: ['antiarrhythmic', 'contraindications']
      },
      {
        id: 'af-6',
        question: 'What defines tachycardia-mediated cardiomyopathy and how is it managed?',
        answer: 'Definition: LV dysfunction caused by persistent tachycardia (usually sustained HR >100-110 for weeks-months)\n\nFeatures:\n- May be subtle - patients adapt\n- EF can be severely reduced\n\nManagement:\n- Aggressive rate or rhythm control\n- EF often recovers completely with rate control\n- If rate control insufficient, catheter ablation\n- May need AVN ablation + pacemaker if refractory',
        difficulty: 4,
        tags: ['cardiomyopathy', 'rate control']
      }
    ],
    
    cases: [
      {
        id: 'af-case-1',
        title: 'New-Onset AF with Fast Ventricular Response',
        presentation: 'A 68-year-old man with HTN and diabetes presents with palpitations and dyspnea for 3 days. BP 130/80, HR 142 irregular. ECG shows AF with RVR. He is alert and has no chest pain. Echo shows EF 50%, mild LVH, normal valves.',
        questions: [
          {
            question: 'What is his CHA₂DS₂-VASc score and anticoagulation recommendation?',
            answer: 'CHA₂DS₂-VASc = 3 (HTN=1, Age 65-74=1, DM=1). Score ≥2 in men → Anticoagulation indicated. Start DOAC (apixaban, rivaroxaban, or dabigatran) as first-line.'
          },
          {
            question: 'How should you manage his rapid rate?',
            answer: 'Rate control with IV beta-blocker (metoprolol 5mg IV q5min x3) or diltiazem (0.25 mg/kg IV). Target HR <110 initially. Once controlled, transition to oral agents. Avoid digoxin alone for initial rate control (slow onset).'
          },
          {
            question: 'Should you attempt cardioversion now?',
            answer: 'No immediate cardioversion unless hemodynamically unstable. AF >48 hours → need 3 weeks anticoagulation OR TEE first. Start anticoagulation, rate control, and plan elective cardioversion if desired after adequate anticoagulation.'
          }
        ],
        keyLearning: [
          'Calculate CHA₂DS₂-VASc for all AF patients',
          'DOACs are first-line anticoagulation',
          'Rate control first, then decide on rhythm control strategy',
          'Cardioversion after 48 hours requires anticoagulation protocol'
        ],
        difficulty: 2
      },
      {
        id: 'af-case-2',
        title: 'AF in WPW Syndrome',
        presentation: 'A 25-year-old man collapses at a concert. Paramedics find him conscious but with wide-complex irregular tachycardia at 220 bpm. BP 90/60. Baseline ECG from prior visit shows short PR and delta wave.',
        questions: [
          {
            question: 'What is the diagnosis?',
            answer: 'Pre-excited atrial fibrillation (AF in WPW syndrome). The wide QRS is due to conduction through the accessory pathway. The irregular, rapid rate distinguishes this from VT.'
          },
          {
            question: 'What is the immediate management?',
            answer: 'This is hemodynamically unstable (hypotension) → immediate synchronized DC cardioversion under sedation. If stable, IV procainamide is the drug of choice.'
          },
          {
            question: 'What drugs are contraindicated and why?',
            answer: 'AV nodal blockers are CONTRAINDICATED:\n- Digoxin\n- Beta-blockers\n- Calcium channel blockers (diltiazem, verapamil)\n- Adenosine\n\nThese block the AV node, forcing more impulses through the accessory pathway, potentially causing VF.'
          }
        ],
        keyLearning: [
          'WPW + AF is life-threatening emergency',
          'Wide-complex irregular tachycardia = think WPW + AF',
          'Cardioversion is first-line if unstable',
          'NEVER give AV nodal blockers in pre-excited AF'
        ],
        difficulty: 4
      }
    ]
  },
  prerequisites: ['ecg-basics'],
  relatedTopics: ['supraventricular-tachycardia', 'deep-vein-thrombosis', 'heart-failure'],
  difficulty: 3,
  highYield: true,
  examTags: ['NEET_PG', 'USMLE', 'MRCP'],
  estimatedMinutes: 55,
  hasContent: { concept: true, examPrep: true, textbook: true, retrievalCards: true, cases: true, grindeMap: false },
  createdAt: '2025-02-09',
  updatedAt: '2025-02-09'
};

// =============================================================================
// VALVULAR HEART DISEASE
// =============================================================================

const valvularHeartDiseaseTopic: LibraryTopic = {
  id: 'valvular-heart-disease',
  subjectId: 'medicine',
  subspecialtyId: 'medicine-cardiology',
  name: 'Valvular Heart Disease',
  slug: 'valvular-heart-disease',
  description: 'Aortic and mitral valve disease - pathophysiology, diagnosis, and intervention timing',
  content: {
    concept: `# Valvular Heart Disease

## Overview
Valvular heart disease involves stenosis (obstruction to flow) or regurgitation (backflow) of cardiac valves. Understanding hemodynamic consequences is key to timing of intervention.

---

## Aortic Stenosis (AS)

### Etiology
1. **Degenerative/Calcific** (most common in elderly, >70 years)
   - Progressive calcification of trileaflet valve
   - Risk factors: Age, HTN, hyperlipidemia, CKD

2. **Bicuspid Aortic Valve** (most common in <70 years)
   - Present in 1-2% of population
   - Accelerated degeneration
   - Associated with aortic root dilation, coarctation

3. **Rheumatic Heart Disease**
   - Commissural fusion
   - Almost always with mitral valve involvement
   - Declining in developed countries

### Pathophysiology
- **Pressure overload** → Concentric LV hypertrophy
- Compensated → Eventually decompensates
- Fixed cardiac output → Symptoms with exertion

**Triad of symptoms (once present, mortality rises sharply)**:
1. Angina (5-year survival without surgery)
2. Syncope (3-year survival)
3. Heart failure (2-year survival)

### Physical Examination
- **Pulse**: Pulsus parvus et tardus (weak, delayed upstroke)
- **Apex**: Sustained, non-displaced (concentric hypertrophy)
- **Murmur**: Crescendo-decrescendo systolic at RUSB, radiates to carotids
- **Severity signs**: Late-peaking murmur, absent A2, paradoxical S2 split, S4

### Diagnosis

**Echocardiography (Diagnostic Standard)**

| Parameter | Mild | Moderate | Severe |
|-----------|------|----------|--------|
| Jet velocity | <3.0 m/s | 3.0-4.0 m/s | ≥4.0 m/s |
| Mean gradient | <20 mmHg | 20-40 mmHg | ≥40 mmHg |
| AVA | >1.5 cm² | 1.0-1.5 cm² | <1.0 cm² |

**Low-flow, Low-gradient AS**
- Severe AS with EF <50% and low gradient (<40 mmHg)
- Dobutamine stress echo to differentiate true severe AS from pseudo-severe

### Management

**Medical Therapy**
- No medical therapy alters progression
- Avoid excessive afterload reduction (may cause hypotension)
- Treat comorbidities (HTN, CAD)

**Surgical Aortic Valve Replacement (SAVR)**
- Gold standard, especially for younger patients
- Mechanical (younger, lifelong anticoagulation) vs bioprosthetic (>65, limited durability)

**Transcatheter Aortic Valve Replacement (TAVR)**
- Initially for prohibitive/high surgical risk
- Now approved for low-risk patients (PARTNER 3, Evolut Low Risk)
- Preferred if age >80 or high surgical risk

**Indications for Intervention (Class I)**
- Severe AS + symptoms
- Severe AS + EF <50%
- Severe AS undergoing other cardiac surgery

---

## Aortic Regurgitation (AR)

### Etiology

**Valvular**
- Bicuspid aortic valve
- Infective endocarditis
- Rheumatic heart disease
- Degenerative

**Aortic Root Dilation**
- Marfan syndrome, Ehlers-Danlos
- Aortic dissection
- Syphilitic aortitis (historical)
- Ankylosing spondylitis

### Pathophysiology
- **Acute AR**: Sudden volume overload → Pulmonary edema, cardiogenic shock
- **Chronic AR**: Gradual dilation → Eccentric hypertrophy → Eventually decompensation

### Clinical Features

**Acute AR**
- Sudden dyspnea, pulmonary edema
- Tachycardia, hypotension
- Soft or absent murmur (equilibration of pressures)
- Medical emergency!

**Chronic AR**
- May be asymptomatic for years
- Exertional dyspnea, fatigue
- Palpitations (hyperdynamic circulation)

### Physical Examination (Chronic AR)

**Peripheral Signs (Wide Pulse Pressure)**
- **De Musset sign**: Head bobbing
- **Quincke pulse**: Nailbed pulsations
- **Corrigan pulse**: Water-hammer pulse
- **Traube sign**: Pistol-shot femorals
- **Duroziez sign**: Femoral to-and-fro murmur
- **Hill sign**: BP legs > arms by >40 mmHg

**Cardiac Findings**
- Displaced, hyperdynamic apex
- High-pitched, blowing, early diastolic decrescendo murmur (LLSB, patient leaning forward)
- Austin Flint murmur: Low-pitched diastolic rumble (severe AR)

### Diagnosis (Echo)
- Severity based on: Jet width, vena contracta, regurgitant volume/fraction
- LV dimensions: LVESD >50mm or LVEDD >65mm = LV dilation

### Management

**Medical Therapy**
- Vasodilators (ACEi, ARB, dihydropyridine CCB) if hypertension
- No proven benefit in normotensive patients to delay surgery

**Surgical Indications (Class I)**
- Severe AR + symptoms
- Severe AR + EF ≤55%
- Severe AR + severe LV dilation (LVESD >50mm or LVEDD >65mm)
- Severe AR undergoing other cardiac surgery

---

## Mitral Stenosis (MS)

### Etiology
- **Rheumatic Heart Disease** (>95% of cases)
- Degenerative calcification
- Congenital
- Carcinoid (rare)

### Pathophysiology
- Obstruction to LV filling → ↑ LA pressure → Pulmonary venous congestion
- LA dilation → Atrial fibrillation → Stasis → Thromboembolism
- Pulmonary hypertension (reactive) → RV failure

### Clinical Features
- Dyspnea (most common), especially with exertion, pregnancy, AF with RVR
- Hemoptysis (pulmonary venous hypertension, bronchial vein rupture)
- Hoarseness (Ortner syndrome: LA compresses recurrent laryngeal nerve)
- Systemic embolism (stroke, especially if AF)

### Physical Examination
- **Facies mitrale**: Malar flush (low cardiac output + pulmonary HTN)
- **Loud S1** (mobile leaflets snapping closed)
- **Opening snap** (mobile leaflets; absent if severely calcified)
- **Low-pitched diastolic rumble** at apex (best with bell, left lateral decubitus)
- Presystolic accentuation (if in sinus rhythm)

**Severity Indicators**:
- Shorter A2-OS interval = Severe (higher LA pressure opens valve earlier)
- Longer diastolic murmur = Severe

### Diagnosis

| Severity | MVA | Mean Gradient |
|----------|-----|---------------|
| Mild | >1.5 cm² | <5 mmHg |
| Moderate | 1.0-1.5 cm² | 5-10 mmHg |
| Severe | <1.0 cm² | >10 mmHg |

### Management

**Medical Therapy**
- Rate control (beta-blockers, CCB) - prolongs diastolic filling
- Diuretics for congestion
- **Anticoagulation**: If AF, prior embolism, or LA thrombus

**Interventional**
- **Percutaneous Mitral Balloon Commissurotomy (PMBC)**
  - Preferred if favorable valve morphology (Wilkins score ≤8)
  - No or mild MR, no LA thrombus
  
- **Surgery** (repair or replacement)
  - Unfavorable anatomy, significant MR, failed PMBC

---

## Mitral Regurgitation (MR)

### Classification
- **Primary (Organic)**: Intrinsic valve disease
- **Secondary (Functional)**: Valve structurally normal, LV dysfunction/dilation

### Etiology

**Primary MR**
- Mitral valve prolapse (most common in developed countries)
- Rheumatic heart disease
- Infective endocarditis
- Papillary muscle rupture (post-MI)
- Connective tissue disorders

**Secondary MR**
- Ischemic cardiomyopathy (tethering)
- Dilated cardiomyopathy
- HFrEF of any cause

### Pathophysiology
- **Acute MR**: Sudden volume overload to non-dilated LA → Pulmonary edema, cardiogenic shock
- **Chronic MR**: Gradual LA and LV dilation → Volume overload → Eventual LV dysfunction

### Clinical Features

**Acute Severe MR**
- Sudden pulmonary edema
- Hypotension, shock
- May have minimal murmur (rapid equilibration)

**Chronic MR**
- Often asymptomatic for years
- Dyspnea, fatigue, palpitations
- Eventually HF symptoms

### Physical Examination
- Displaced, hyperdynamic apex
- Holosystolic, blowing murmur at apex radiating to axilla
- S3 (volume overload)
- Soft S1 (severe MR)

**MVP-specific**: Mid-systolic click, late systolic murmur

### Diagnosis (Echo)
- Severity based on: Vena contracta, regurgitant volume, EROA
- LV function: EF may be "supra-normal" initially; EF <60% indicates dysfunction

### Management

**Primary MR**
- Medical therapy does not alter progression
- Surgical repair preferred over replacement when feasible

**Indications for Surgery (Primary MR)**
- Severe MR + symptoms
- Severe MR + EF ≤60% OR LVESD ≥40mm
- Severe MR + new AF or pulmonary HTN

**Secondary MR**
- Optimize GDMT for HF (reduces MR by reverse remodeling)
- MitraClip (transcatheter edge-to-edge repair) if remains severe despite GDMT
- COAPT trial: MitraClip reduced mortality in selected HFrEF patients

---

## Tricuspid Regurgitation (TR)

### Etiology
- **Functional** (most common): RV dilation from pulmonary HTN, left heart disease
- **Primary**: Infective endocarditis (IVDU), Ebstein anomaly, carcinoid, pacemaker leads

### Physical Findings
- Prominent v wave in JVP
- Pulsatile liver (hepatomegaly)
- Holosystolic murmur at LLSB, increases with inspiration (Carvallo sign)

### Management
- Treat underlying cause
- Diuretics for congestion
- Consider TV repair/replacement if severe and symptomatic

---

*"In valvular heart disease, timing of intervention is everything—too early wastes valve durability, too late means irreversible damage."*`,
    
    keyPoints: [
      'AS triad: Angina (5yr), Syncope (3yr), HF (2yr) - survival without surgery',
      'Severe AS: Jet velocity ≥4 m/s, Mean gradient ≥40 mmHg, AVA <1.0 cm²',
      'Pulsus parvus et tardus is classic for AS (weak and delayed pulse)',
      'AR causes wide pulse pressure with numerous peripheral signs',
      'Austin Flint murmur: Diastolic rumble in severe AR mimicking MS',
      'MS: Rheumatic in >95% of cases; LA dilation causes AF and embolism',
      'Short A2-OS interval = severe MS (high LA pressure)',
      'MR: Primary (valve problem) vs Secondary (LV problem)',
      'In chronic MR, EF <60% already indicates LV dysfunction',
      'TAVR now approved even for low-risk patients with severe AS'
    ],
    
    examPrep: {
      summary: `**Valvular Heart Disease - High Yield**

**Aortic Stenosis**:
- Severe: Vmax ≥4 m/s, Gradient ≥40, AVA <1.0 cm²
- Symptoms triad: Angina, Syncope, HF
- Intervene: Symptoms OR EF<50%
- TAVR vs SAVR based on age/risk

**Aortic Regurgitation**:
- Wide pulse pressure, peripheral signs
- Austin Flint murmur = severe
- Intervene: Symptoms OR EF≤55% OR LV dilation

**Mitral Stenosis**:
- Rheumatic >95%
- Diastolic rumble, opening snap
- Short A2-OS = severe
- PMBC if favorable anatomy

**Mitral Regurgitation**:
- Primary: Valve repair preferred
- Secondary: Treat HF first, MitraClip if refractory`,
      
      mnemonics: [
        'AS symptoms survival: "5-3-2" (Angina 5yr, Syncope 3yr, HF 2yr)',
        'AR peripheral signs: "ABCD" (Austin Flint, Bisferiens pulse, Corrigan/Quincke, De Musset/Duroziez)',
        'MS causes: "Really Must See Calcification" (Rheumatic, Mitral annular calcification, SLE, Carcinoid)',
        'Systolic murmurs: "MARS" (MR, AR if severe, AS, PS) - think of the planet'
      ],
      
      highYield: [
        'Bicuspid AV is most common congenital heart defect (1-2%)',
        'Low-flow, low-gradient AS: Use dobutamine stress to differentiate true vs pseudo-severe',
        'Acute AR: Emergency surgery (medical therapy fails rapidly)',
        'MS in pregnancy: Increased blood volume precipitates symptoms',
        'MVP: Most common cause of primary MR in developed world',
        'Secondary MR: EF often preserved initially - not a sign of good function',
        'Carvallo sign: TR murmur increases with inspiration'
      ],
      
      commonMCQs: [
        'Most common cause of AS in elderly: Degenerative/calcific',
        'Most common cause of MS: Rheumatic heart disease',
        'Murmur that increases with inspiration: Tricuspid regurgitation',
        'Finding in severe AR: Austin Flint murmur',
        'Indication for surgery in asymptomatic severe MR: EF ≤60% or LVESD ≥40mm'
      ]
    },
    
    textbookRefs: [
      { textbook: "Harrison's Principles of Internal Medicine", edition: '22nd', chapter: 'Ch 190', chapterTitle: 'Aortic Valve Disease', pages: '1920-1935' },
      { textbook: "Harrison's Principles of Internal Medicine", edition: '22nd', chapter: 'Ch 191', chapterTitle: 'Mitral Valve Disease', pages: '1935-1950' }
    ],
    
    retrievalCards: [
      {
        id: 'vhd-1',
        question: 'What are the echocardiographic criteria for severe aortic stenosis?',
        answer: 'Severe AS:\n• Aortic jet velocity ≥4.0 m/s\n• Mean pressure gradient ≥40 mmHg\n• Aortic valve area (AVA) <1.0 cm² (or <0.6 cm²/m² indexed)\n\nAll parameters should be concordant. If discordant, consider low-flow states.',
        difficulty: 2,
        tags: ['AS', 'echo']
      },
      {
        id: 'vhd-2',
        question: 'What is the significance of a short A2-OS interval in mitral stenosis?',
        answer: 'A short A2-OS (S2 to opening snap) interval indicates severe MS:\n• High LA pressure opens the stenotic valve earlier in diastole\n• Normal: 80-120 ms\n• Severe MS: <70 ms\n\nThe higher the LA pressure, the shorter the interval.',
        difficulty: 3,
        tags: ['MS', 'physical exam']
      },
      {
        id: 'vhd-3',
        question: 'What is the Austin Flint murmur and what does it indicate?',
        answer: 'Austin Flint murmur:\n• Low-pitched, mid-diastolic rumble at the apex\n• Mimics mitral stenosis murmur\n• Caused by severe AR: Regurgitant jet impinges on anterior mitral leaflet, causing functional MS\n\nDifferentiated from MS by absence of opening snap and presence of AR signs.',
        difficulty: 4,
        tags: ['AR', 'physical exam']
      },
      {
        id: 'vhd-4',
        question: 'Why does EF ≤60% indicate LV dysfunction in chronic severe MR?',
        answer: 'In chronic MR, the LV is volume overloaded with a "low impedance" ejection (blood goes to low-pressure LA). This should result in SUPRANORMAL EF (65-75%).\n\nAn EF of 60% or lower indicates that contractile function is already impaired, despite appearing "normal." This is an indication for surgery even without symptoms.',
        difficulty: 4,
        tags: ['MR', 'pathophysiology']
      },
      {
        id: 'vhd-5',
        question: 'What is the Wilkins score and when is it used?',
        answer: 'Wilkins score assesses mitral valve anatomy for PMBC (percutaneous mitral balloon commissurotomy) in MS.\n\nScores 1-4 for each:\n• Leaflet mobility\n• Leaflet thickening\n• Subvalvular thickening\n• Calcification\n\nTotal score 4-16:\n• ≤8: Favorable for PMBC\n• >8: Less favorable, consider surgery',
        difficulty: 3,
        tags: ['MS', 'intervention']
      },
      {
        id: 'vhd-6',
        question: 'When is TAVR vs SAVR preferred for severe AS?',
        answer: 'TAVR preferred:\n• Age >80 years\n• High/prohibitive surgical risk (STS score)\n• Unfavorable surgical anatomy\n• Now approved for ALL risk categories\n\nSAVR preferred:\n• Younger patients (durability concerns)\n• Concurrent CABG or other cardiac surgery needed\n• Bicuspid valve with complex anatomy\n• Small annulus or unfavorable TAVR anatomy',
        difficulty: 3,
        tags: ['AS', 'intervention']
      }
    ],
    
    cases: [
      {
        id: 'vhd-case-1',
        title: 'Symptomatic Severe Aortic Stenosis',
        presentation: 'A 78-year-old man with HTN presents with exertional dyspnea and one syncopal episode while climbing stairs. Exam reveals BP 130/80, crescendo-decrescendo systolic murmur at RUSB radiating to carotids, delayed carotid upstroke, and S4. Echo: Aortic jet velocity 4.5 m/s, mean gradient 48 mmHg, AVA 0.7 cm², EF 55%.',
        questions: [
          {
            question: 'What is the diagnosis and severity?',
            answer: 'Severe calcific/degenerative aortic stenosis with symptoms (syncope, dyspnea). Echo criteria: Vmax 4.5 m/s (≥4.0), gradient 48 mmHg (≥40), AVA 0.7 cm² (<1.0) - all concordant for severe AS.'
          },
          {
            question: 'What is the prognosis without intervention?',
            answer: 'Very poor. Symptomatic severe AS has ~50% 2-year mortality without valve replacement. Syncope historically predicts 3-year average survival, HF symptoms 2-year survival. Intervention is urgently indicated.'
          },
          {
            question: 'What intervention would you recommend?',
            answer: 'Aortic valve replacement is indicated (Class I). Given age 78 and reasonable surgical risk, both TAVR and SAVR are options. Current trials show TAVR non-inferior/superior in older patients. Would consider TAVR if no contraindication (bicuspid valve, CABG needed, etc).'
          }
        ],
        keyLearning: [
          'Symptomatic severe AS requires intervention (poor prognosis without)',
          'Delayed carotid upstroke (parvus et tardus) is classic finding',
          'TAVR is now standard for elderly patients with severe AS',
          'Syncope indicates hemodynamic instability and urgent need for AVR'
        ],
        difficulty: 3
      }
    ]
  },
  prerequisites: ['cardiac-examination'],
  relatedTopics: ['infective-endocarditis', 'rheumatic-heart-disease', 'heart-failure'],
  difficulty: 4,
  highYield: true,
  examTags: ['NEET_PG', 'USMLE', 'MRCP'],
  estimatedMinutes: 60,
  hasContent: { concept: true, examPrep: true, textbook: true, retrievalCards: true, cases: true, grindeMap: false },
  createdAt: '2025-02-09',
  updatedAt: '2025-02-09'
};

// =============================================================================
// CARDIOMYOPATHY
// =============================================================================

const cardiomyopathyTopic: LibraryTopic = {
  id: 'cardiomyopathy',
  subjectId: 'medicine',
  subspecialtyId: 'medicine-cardiology',
  name: 'Cardiomyopathy',
  slug: 'cardiomyopathy',
  description: 'DCM, HCM, restrictive cardiomyopathy, and ARVC',
  content: {
    concept: `# Cardiomyopathy

## Definition
Cardiomyopathy is a heterogeneous group of diseases of the myocardium associated with mechanical and/or electrical dysfunction, usually with inappropriate ventricular hypertrophy or dilatation.

## Classification

| Type | Chamber | Wall Thickness | Systolic Function |
|------|---------|----------------|-------------------|
| **Dilated (DCM)** | Dilated | Normal/thin | ↓↓ |
| **Hypertrophic (HCM)** | Normal | ↑↑ (asymmetric) | Normal/↑ |
| **Restrictive (RCM)** | Normal/small | Normal/↑ | Normal |
| **ARVC** | RV dilated | RV thinning | RV ↓ |

---

## Dilated Cardiomyopathy (DCM)

### Definition
- LV (or biventricular) dilation with systolic dysfunction
- Not explained by abnormal loading conditions (HTN, valve disease) or CAD

### Etiology

**Genetic (30-50%)**
- TTN (titin) mutations most common
- Lamin A/C, MYH7, SCN5A
- X-linked: Dystrophin (Duchenne/Becker)

**Acquired**
- Idiopathic (diagnosis of exclusion)
- Viral myocarditis (Coxsackie B, Parvovirus B19, HIV)
- Alcoholic cardiomyopathy (reversible if abstinent)
- Peripartum cardiomyopathy
- Tachycardia-mediated cardiomyopathy
- Chemotherapy (anthracyclines, trastuzumab)
- Nutritional (thiamine, selenium deficiency)
- Endocrine (thyroid, pheochromocytoma)

### Clinical Features
- Heart failure symptoms (dyspnea, orthopnea, edema)
- Functional MR, TR (annular dilation)
- Arrhythmias (AF, VT, sudden death)
- Thromboembolism (LV thrombus)

### Diagnosis
- **Echo**: Dilated LV, global hypokinesis, reduced EF, functional MR
- **CMR**: Late gadolinium enhancement (mid-wall = poor prognosis)
- **Genetic testing**: If familial or young onset

### Management
- Standard HFrEF GDMT (ARNI, BB, MRA, SGLT2i)
- Anticoagulation if: AF, LV thrombus, prior embolism
- ICD for primary prevention (EF ≤35% after 3-9 months GDMT)
- CRT if LBBB, QRS ≥150 ms
- Cardiac transplant if refractory

---

## Hypertrophic Cardiomyopathy (HCM)

### Definition
- LV wall thickness ≥15 mm (or ≥13 mm with family history)
- NOT explained by loading conditions
- Most common genetic cardiac disease (1:500)

### Genetics
- Autosomal dominant, variable penetrance
- Sarcomeric protein mutations:
  - MYH7 (β-myosin heavy chain)
  - MYBPC3 (myosin-binding protein C) - most common

### Pathophysiology

**Diastolic Dysfunction**
- Thick, stiff ventricle
- Impaired relaxation and filling

**LVOT Obstruction (in ~70%)**
- Asymmetric septal hypertrophy
- Systolic anterior motion (SAM) of mitral valve
- Provocable by: Valsalva, standing, dehydration, vasodilators

**Mitral Regurgitation**
- Secondary to SAM

**Myocardial Ischemia**
- Small vessel disease, increased demand, compression

**Arrhythmias**
- AF (25%), NSVT, VT
- Leading cause of sudden cardiac death in young athletes

### Clinical Features
- Many asymptomatic, discovered incidentally
- Dyspnea on exertion (diastolic dysfunction)
- Chest pain (ischemia, increased demand)
- Syncope (arrhythmia, outflow obstruction)
- Palpitations

### Physical Examination
- Brisk, bifid carotid pulse ("spike and dome")
- Loud S4 (stiff ventricle)
- Systolic murmur at LLSB (LVOT obstruction)
  - ↑ with Valsalva, standing (decreased preload)
  - ↓ with squatting, leg raise (increased preload)
- Paradoxical split S2

### Diagnosis

**Echocardiography**
- LV wall thickness ≥15 mm (asymmetric septal hypertrophy)
- Systolic anterior motion (SAM) of mitral valve
- LVOT gradient at rest or with provocation
- Diastolic dysfunction

**CMR**
- Precise wall thickness measurement
- Late gadolinium enhancement (fibrosis) - risk marker

**Genetic Testing**
- For proband and family screening
- Pathogenic variant in 30-60%

### Sudden Cardiac Death Risk Stratification

**Major Risk Factors (ESC HCM Risk-SCD Calculator)**
- Family history of SCD
- Unexplained syncope
- Massive LVH (≥30 mm)
- NSVT on Holter
- Abnormal BP response to exercise
- Extensive LGE on CMR
- LV apical aneurysm

**ICD Indications**
- Prior cardiac arrest or sustained VT (secondary prevention)
- Estimated 5-year SCD risk ≥6% (primary prevention)

### Management

**Lifestyle**
- Avoid competitive sports (risk of SCD)
- Avoid dehydration, excessive alcohol
- Genetic counseling and family screening

**Medical Therapy**
- **Beta-blockers**: First-line for symptoms (↓ HR, ↓ contractility)
- **Verapamil/Diltiazem**: If BB intolerant (avoid with severe obstruction)
- **Disopyramide**: Add for refractory obstruction (negative inotrope)
- **Mavacamten**: Cardiac myosin inhibitor (FDA-approved 2022)
  - Reduces LVOT gradient and symptoms

**Avoid**
- Digoxin (increases contractility)
- Dihydropyridine CCBs (vasodilation worsens obstruction)
- High-dose diuretics (decreased preload worsens obstruction)
- Vasodilators (nitrates, PDE5 inhibitors)

**Septal Reduction Therapy** (if refractory to meds, LVOT gradient ≥50 mmHg)
- Surgical myectomy (gold standard)
- Alcohol septal ablation (for non-surgical candidates)

---

## Restrictive Cardiomyopathy (RCM)

### Definition
- Impaired ventricular filling with normal or decreased diastolic volumes
- Normal or near-normal systolic function
- Normal wall thickness (unless infiltrative)

### Etiology

**Myocardial (Infiltrative)**
- Amyloidosis (most common cause of RCM)
- Sarcoidosis
- Hemochromatosis
- Fabry disease

**Myocardial (Non-infiltrative)**
- Idiopathic
- Scleroderma
- Diabetic cardiomyopathy

**Endomyocardial**
- Endomyocardial fibrosis (tropical)
- Loeffler endocarditis (eosinophilic)
- Carcinoid heart disease
- Radiation

### Cardiac Amyloidosis (Focus)

**Types**
- **AL (Light Chain)**: Monoclonal gammopathy, plasma cell dyscrasia
- **ATTR (Transthyretin)**:
  - Wild-type (senile): Age >65, predominantly male
  - Hereditary (variant): Mutations (Val122Ile common in African descent)

**Clinical Features**
- RCM physiology + low-voltage ECG + thick walls = pathognomonic
- Conduction disease (heart block)
- AF
- Carpal tunnel syndrome (ATTR)
- Orthostatic hypotension (autonomic involvement)
- Nephrotic syndrome (AL)

**Diagnosis**
- Echo: Thick walls, "granular sparkling," diastolic dysfunction
- CMR: Diffuse subendocardial/transmural LGE
- Technetium pyrophosphate scan: Strongly positive in ATTR
- Biopsy: Congo red stain, apple-green birefringence

**Treatment**
- AL: Chemotherapy (bortezomib, daratumumab)
- ATTR: Tafamidis (stabilizes transthyretin), patisiran/inotersen (silencers)
- Supportive: Diuretics (careful - preload dependent)
- Avoid digoxin (binds to amyloid)
- Transplant for selected cases

### RCM vs Constrictive Pericarditis

| Feature | RCM | Constrictive Pericarditis |
|---------|-----|--------------------------|
| Kussmaul sign | Less common | Classic |
| Pericardial knock | Absent | Present |
| LV thickness | May be increased | Normal |
| Septal bounce | Absent | Present |
| Respiratory variation | <25% | >25% |
| BNP | Elevated | Normal/mildly elevated |

---

## Arrhythmogenic Right Ventricular Cardiomyopathy (ARVC)

### Definition
- Progressive fibrofatty replacement of RV myocardium
- RV dilation and dysfunction
- Ventricular arrhythmias (often LBBB morphology VT)

### Genetics
- Desmosomal mutations (plakophilin-2 most common)
- Autosomal dominant, variable penetrance

### Clinical Features
- Young adults, athletes
- Palpitations, syncope, sudden death
- VT with LBBB morphology (RV origin)

### Diagnosis (Task Force Criteria)
- Major: RV akinesia/dyskinesia, epsilon wave, desmosomal mutation
- Minor: T-wave inversions V1-V3, LBBB-VT, family history

**CMR**: RV dilation, fatty infiltration, dyskinesia

### Management
- ICD for high-risk patients
- Beta-blockers for arrhythmia
- Avoid competitive sports
- Antiarrhythmic drugs (sotalol, amiodarone)
- Catheter ablation for recurrent VT

---

*"Cardiomyopathies are diseases of the heart muscle—understanding the hemodynamic phenotype guides diagnosis and management."*`,
    
    keyPoints: [
      'DCM: Dilated LV + systolic dysfunction + no other cause; TTN mutations most common genetic cause',
      'HCM: LVH ≥15 mm without loading conditions; sarcomeric mutations (MYH7, MYBPC3)',
      'HCM murmur increases with Valsalva/standing (decreased preload worsens obstruction)',
      'Mavacamten is a novel cardiac myosin inhibitor for obstructive HCM',
      'HCM is the leading cause of sudden cardiac death in young athletes',
      'RCM: Low voltage + thick walls + diastolic dysfunction = think amyloidosis',
      'Technetium pyrophosphate scan is highly specific for ATTR amyloidosis',
      'Tafamidis is disease-modifying therapy for ATTR cardiac amyloidosis',
      'Avoid digoxin in amyloidosis (binds to amyloid fibrils)',
      'ARVC: RV fibrofatty replacement, LBBB-morphology VT, desmosomal mutations'
    ],
    
    examPrep: {
      summary: `**Cardiomyopathy - High Yield**

**DCM**: Dilated + ↓EF, treat as HFrEF, ICD if EF≤35%

**HCM**:
- LVH ≥15mm, asymmetric septal hypertrophy
- SAM of mitral valve → LVOT obstruction
- ↑ murmur with Valsalva (↓preload)
- Avoid: Digoxin, vasodilators, dehydration
- Rx: BB, verapamil, disopyramide, mavacamten
- ICD if high SCD risk

**RCM/Amyloidosis**:
- Low voltage + thick walls = pathognomonic
- ATTR: Tc-PYP scan positive, tafamidis
- AL: Chemotherapy
- Avoid digoxin

**ARVC**: RV fibrofatty replacement, LBBB-VT, avoid sports`,
      
      mnemonics: [
        'HCM murmur maneuvers: "SQUAT to QUIET, STAND to LOUDER"',
        'Avoid in HCM: "D-VINE" (Digoxin, Vasodilators, Inotropes, Nitrates, Extreme dehydration)',
        'Amyloid heart clues: "LOW voltage, THICK walls, STIFF heart"',
        'ARVC: "Fatty RV + LBBB-VT + Desmosome"'
      ],
      
      highYield: [
        'Peripartum cardiomyopathy: Last month of pregnancy to 5 months postpartum',
        'Alcoholic cardiomyopathy: Reversible with abstinence',
        'HCM ICD: 5-year SCD risk ≥6% (ESC calculator)',
        'Mavacamten: First targeted therapy for obstructive HCM',
        'ATTR wild-type: Consider in elderly with HFpEF and LVH',
        'Cardiac amyloid: Avoid CCBs (bind to amyloid)',
        'Epsilon wave on ECG is pathognomonic for ARVC'
      ],
      
      commonMCQs: [
        'Most common cause of sudden death in young athletes: HCM',
        'Murmur that increases with Valsalva: HCM (and MVP)',
        'Low voltage ECG + thick LV walls: Cardiac amyloidosis',
        'Cardiomyopathy associated with carpal tunnel syndrome: ATTR amyloidosis',
        'Gene mutation in ARVC: Desmosomal proteins (plakophilin-2)'
      ]
    },
    
    textbookRefs: [
      { textbook: "Harrison's Principles of Internal Medicine", edition: '22nd', chapter: 'Ch 197', chapterTitle: 'Cardiomyopathy and Myocarditis', pages: '1975-1990' }
    ],
    
    retrievalCards: [
      {
        id: 'cm-1',
        question: 'Why does the HCM murmur increase with Valsalva and standing?',
        answer: 'Both maneuvers decrease preload (venous return):\n\n1. Decreased LV cavity size brings septum and mitral valve closer\n2. Worsens LVOT obstruction and SAM\n3. Gradient increases → louder murmur\n\nConversely, squatting/leg raise increases preload, dilates LV, and quiets the murmur.',
        difficulty: 3,
        tags: ['HCM', 'physical exam']
      },
      {
        id: 'cm-2',
        question: 'What are the major causes of dilated cardiomyopathy?',
        answer: 'Genetic (30-50%):\n- TTN (titin) - most common\n- Lamin A/C, MYH7, SCN5A\n- Dystrophin (X-linked)\n\nAcquired:\n- Idiopathic\n- Viral myocarditis (Coxsackie B, Parvovirus B19)\n- Alcoholic (reversible)\n- Peripartum\n- Tachycardia-mediated\n- Chemotherapy (anthracyclines)\n- Thyroid disease',
        difficulty: 2,
        tags: ['DCM', 'etiology']
      },
      {
        id: 'cm-3',
        question: 'How do you differentiate AL from ATTR cardiac amyloidosis?',
        answer: 'AL (Light Chain):\n- Plasma cell dyscrasia (myeloma, MGUS)\n- Nephrotic syndrome, hepatomegaly\n- Rapidly progressive\n- Serum/urine free light chains abnormal\n- Biopsy for diagnosis\n\nATTR (Transthyretin):\n- Wild-type (senile) or hereditary\n- Carpal tunnel, spinal stenosis\n- Slower progression\n- Technetium pyrophosphate scan positive (Grade 2-3)\n- Can diagnose without biopsy if PYP+ and no monoclonal protein',
        difficulty: 4,
        tags: ['amyloidosis', 'RCM']
      },
      {
        id: 'cm-4',
        question: 'What is mavacamten and how does it work in HCM?',
        answer: 'Mavacamten is a first-in-class cardiac myosin inhibitor:\n\nMechanism:\n- Reduces excessive myosin-actin cross-bridge formation\n- Decreases hypercontractility\n- Reduces LVOT gradient\n\nIndication: Symptomatic obstructive HCM\n\nEffects:\n- Improves symptoms and exercise capacity\n- Reduces LVOT gradient\n- May reduce need for septal reduction therapy\n\nNote: Can cause reduced EF (must monitor)',
        difficulty: 4,
        tags: ['HCM', 'pharmacology']
      },
      {
        id: 'cm-5',
        question: 'What are the diagnostic features of ARVC?',
        answer: 'Task Force Criteria (2010) - need 2 major, 1 major + 2 minor, or 4 minor:\n\nMajor:\n- RV akinesia/dyskinesia/aneurysm on imaging\n- Epsilon wave on ECG\n- Pathogenic desmosomal mutation\n- Fibrofatty replacement on biopsy\n\nMinor:\n- T-wave inversions V1-V3 (age >14, no RBBB)\n- LBBB-morphology VT\n- Family history\n- >500 PVCs/24h',
        difficulty: 4,
        tags: ['ARVC', 'diagnosis']
      }
    ],
    
    cases: [
      {
        id: 'cm-case-1',
        title: 'Young Athlete with Syncope',
        presentation: 'An 18-year-old basketball player experiences syncope during practice. He had similar episodes during exertion before. Father died suddenly at age 42. Exam: Brisk carotid pulse, S4, III/VI systolic murmur at LLSB that increases with standing. Echo: Septal thickness 22 mm, SAM of mitral valve, LVOT gradient 45 mmHg.',
        questions: [
          {
            question: 'What is the diagnosis?',
            answer: 'Hypertrophic cardiomyopathy (HCM) with LVOT obstruction. Features: Asymmetric septal hypertrophy (22 mm), SAM, dynamic LVOT gradient, syncope with exertion, positive family history of sudden death.'
          },
          {
            question: 'What is his risk for sudden cardiac death?',
            answer: 'HIGH RISK. Risk factors present:\n1. Unexplained syncope\n2. Family history of SCD (father at 42)\n3. Massive LVH (22 mm)\n\nESC HCM Risk-SCD calculator would likely show ≥6% 5-year risk. Should undergo further evaluation including Holter, exercise test, and CMR for LGE.'
          },
          {
            question: 'What is the management?',
            answer: '1. Activity restriction: NO competitive sports\n2. Beta-blocker (first-line for symptoms and rate control)\n3. ICD for primary prevention (high SCD risk)\n4. Genetic testing and family screening\n5. If symptoms persist despite medical therapy and gradient remains high, consider septal reduction (myectomy vs alcohol ablation)'
          }
        ],
        keyLearning: [
          'HCM is the leading cause of SCD in young athletes',
          'Family history of SCD is a major risk factor',
          'Syncope during exertion in HCM is a red flag for arrhythmic SCD',
          'ICD is life-saving for high-risk HCM patients'
        ],
        difficulty: 4
      }
    ]
  },
  prerequisites: ['cardiac-examination', 'heart-failure'],
  relatedTopics: ['heart-failure', 'ventricular-arrhythmias'],
  difficulty: 4,
  highYield: true,
  examTags: ['NEET_PG', 'USMLE', 'MRCP'],
  estimatedMinutes: 55,
  hasContent: { concept: true, examPrep: true, textbook: true, retrievalCards: true, cases: true, grindeMap: false },
  createdAt: '2025-02-09',
  updatedAt: '2025-02-09'
};

// =============================================================================
// EXPORT ALL CARDIOLOGY TOPICS
// =============================================================================

export const CARDIOLOGY_TOPICS: LibraryTopic[] = [
  heartFailureTopic,
  ischemicHeartDiseaseTopic,
  atrialFibrillationTopic,
  valvularHeartDiseaseTopic,
  cardiomyopathyTopic,
];
