/**
 * Preeclampsia & Eclampsia - Full OBG Content
 * 
 * Comprehensive content covering:
 * - Pathophysiology and diagnosis
 * - Management and emergencies
 * - Based on Williams Obstetrics (26th Ed), ACOG Guidelines
 */

export const PREECLAMPSIA_CONTENT = {
  id: 'obg-htn-preeclampsia',
  name: 'Preeclampsia & Eclampsia',
  
  concepts: [
    {
      id: 'classification',
      title: 'Classification & Definitions',
      depth: 'mbbs',
      icon: '📋',
      content: `
## Hypertensive Disorders of Pregnancy

### Classification (ACOG 2020)

| Disorder | Definition |
|----------|------------|
| **Chronic HTN** | HTN before 20 weeks or persisting >12 weeks postpartum |
| **Gestational HTN** | HTN after 20 weeks without proteinuria or end-organ damage |
| **Preeclampsia** | HTN after 20 weeks WITH proteinuria OR end-organ dysfunction |
| **Eclampsia** | Preeclampsia + seizures |
| **HELLP Syndrome** | Hemolysis, Elevated Liver enzymes, Low Platelets |
| **Superimposed preeclampsia** | Chronic HTN + new preeclampsia features |

---

## Blood Pressure Thresholds

### Hypertension in Pregnancy

| Category | Systolic | Diastolic |
|----------|----------|-----------|
| **Hypertension** | ≥140 mmHg | ≥90 mmHg |
| **Severe hypertension** | ≥160 mmHg | ≥110 mmHg |

> 📝 **Exam Tip**: BP must be elevated on **2 occasions at least 4 hours apart** (or severe once)

### Blood Pressure Measurement

- Patient seated, arm at heart level
- Appropriate cuff size (bladder encircles 80% of arm)
- Korotkoff V for diastolic (disappearance)

---

## Preeclampsia Criteria

### Diagnosis requires:

\`\`\`
Hypertension (≥140/90) after 20 weeks
        +
Proteinuria ≥300 mg/24 hours
        OR
Protein/Creatinine ratio ≥0.3
        OR
Dipstick ≥2+ (if quantitative unavailable)
\`\`\`

### OR Hypertension with ANY of:

| System | Feature |
|--------|---------|
| **Renal** | Creatinine >1.1 mg/dL or doubling |
| **Hepatic** | Transaminases >2× normal |
| **Neurological** | Headache, visual disturbances, seizures |
| **Hematological** | Platelets <100,000/µL |
| **Pulmonary** | Pulmonary edema |
| **Fetal** | IUGR, oligohydramnios |

> 💎 **Clinical Pearl**: Proteinuria is NO LONGER required for diagnosis if end-organ dysfunction is present

---

## Preeclampsia with Severe Features

### Criteria (ANY of the following):

| Criterion | Value |
|-----------|-------|
| **Severe HTN** | ≥160/110 mmHg on 2 occasions |
| **Thrombocytopenia** | <100,000/µL |
| **Liver dysfunction** | AST/ALT >2× normal |
| **Renal insufficiency** | Creatinine >1.1 mg/dL or doubling |
| **Pulmonary edema** | Present |
| **Cerebral symptoms** | New-onset headache, visual disturbances |

### Eclampsia

**Definition**: New-onset generalized tonic-clonic seizures in a woman with preeclampsia, not attributable to other causes.

**Timing**:
- Antepartum: 38-53%
- Intrapartum: 18-36%
- Postpartum: 11-44% (up to 4 weeks)

---

## HELLP Syndrome

### Diagnostic Criteria

| Component | Criterion |
|-----------|-----------|
| **H**emolysis | LDH >600 IU/L, ↑ bilirubin, schistocytes |
| **E**levated **L**iver enzymes | AST >70 IU/L |
| **L**ow **P**latelets | <100,000/µL |

### Tennessee Classification

| Class | Platelets |
|-------|-----------|
| Class 1 | <50,000/µL |
| Class 2 | 50,000-100,000/µL |
| Class 3 | 100,000-150,000/µL |

> ⚠️ **Warning**: HELLP can occur without hypertension or proteinuria in 15-20% of cases
`
    },
    {
      id: 'pathophysiology',
      title: 'Pathophysiology',
      depth: 'mbbs',
      icon: '🔬',
      content: `
## The Two-Stage Model

### Stage 1: Abnormal Placentation (Before 20 weeks)

\`\`\`
Defective trophoblast invasion
        ↓
Incomplete spiral artery remodeling
        ↓
Retained muscular and elastic tissue
        ↓
High-resistance uteroplacental circulation
        ↓
Placental hypoxia/ischemia
\`\`\`

**Normal spiral artery remodeling**:
- Trophoblast replaces endothelium and media
- Converts from muscular to wide, low-resistance vessels
- Complete by 18-20 weeks

**In preeclampsia**:
- Shallow trophoblast invasion
- Only decidual portion remodeled
- Myometrial segments remain high-resistance

### Stage 2: Maternal Syndrome (After 20 weeks)

\`\`\`
Placental ischemia
        ↓
Release of anti-angiogenic factors
(sFlt-1, sEng)
        ↓
Endothelial dysfunction
        ↓
Systemic manifestations:
  • Hypertension
  • Proteinuria
  • End-organ damage
\`\`\`

---

## Key Pathogenic Factors

### Angiogenic Imbalance

| Factor | Change | Effect |
|--------|--------|--------|
| **sFlt-1** (soluble FMS-like tyrosine kinase) | ↑↑ | Binds and neutralizes VEGF, PlGF |
| **sEng** (soluble endoglin) | ↑↑ | Blocks TGF-β signaling |
| **VEGF** | ↓ (functionally) | Endothelial dysfunction |
| **PlGF** | ↓↓ | Marker of placental dysfunction |

> 💎 **Clinical Pearl**: sFlt-1/PlGF ratio is emerging as a biomarker for preeclampsia prediction

### Endothelial Dysfunction

| Consequence | Manifestation |
|-------------|---------------|
| ↓ Nitric oxide | Vasoconstriction → HTN |
| ↑ Endothelin | Vasoconstriction |
| ↑ Vascular permeability | Edema, proteinuria |
| Activation of coagulation | Thrombocytopenia, DIC |
| Hepatic involvement | ↑ Transaminases |

---

## Organ System Pathology

### Kidney - Glomerular Endotheliosis

- Swelling of glomerular endothelial cells
- Narrowed capillary lumens
- Subendothelial fibrin deposits
- **Pathognomonic lesion** of preeclampsia

### Liver

| Lesion | Description |
|--------|-------------|
| **Periportal hemorrhage** | Hepatic tenderness, ↑ transaminases |
| **Subcapsular hematoma** | Risk of rupture (rare, catastrophic) |
| **Hepatic infarction** | In severe cases |

### Brain

- Vasogenic edema (PRES - Posterior Reversible Encephalopathy Syndrome)
- Cerebral hemorrhage (cause of death)
- Microinfarcts

### Coagulation

- ↓ Platelets (consumption)
- ↑ Fibrin degradation products
- DIC in severe cases

---

## Risk Factors

### High Risk (Screen and Offer Aspirin)

| Factor | Relative Risk |
|--------|---------------|
| Previous preeclampsia | 7× |
| Chronic hypertension | 5× |
| Pregestational diabetes | 3.5× |
| Multiple gestation | 3× |
| Chronic kidney disease | 2× |
| Autoimmune disease (SLE, APS) | 9× |

### Moderate Risk (≥2 = Offer Aspirin)

| Factor | Relative Risk |
|--------|---------------|
| Nulliparity | 2.5× |
| Age >35 years | 1.5× |
| BMI >30 | 2× |
| Family history | 2× |
| Interpregnancy interval >10 years | 2× |

### Protective Factors

- Smoking (paradoxically)
- Previous uncomplicated term pregnancy
- Long sexual cohabitation before pregnancy
`
    },
    {
      id: 'clinical-features',
      title: 'Clinical Features',
      depth: 'mbbs',
      icon: '🩺',
      content: `
## Symptoms

### Common Presenting Features

| Symptom | Significance |
|---------|--------------|
| **Headache** | Frontal/occipital, persistent, severe |
| **Visual disturbances** | Blurring, scotomata, photophobia |
| **Epigastric/RUQ pain** | Liver capsule distension, HELLP |
| **Nausea/vomiting** | Late pregnancy = concerning |
| **Facial/peripheral edema** | Non-specific but may be rapid-onset |
| **Decreased urine output** | Renal involvement |

> ⚠️ **Warning Signs for Eclampsia**:
> - Severe persistent headache
> - Visual changes
> - Hyperreflexia with clonus
> - Epigastric/RUQ pain

### Symptoms of Severe Disease

\`\`\`
Neurological:
  □ Severe headache not relieved by analgesics
  □ Visual scotomata, blurring, blindness
  □ Altered mental status
  □ Hyperreflexia with clonus

Hepatic:
  □ RUQ/epigastric pain
  □ Nausea, vomiting

Pulmonary:
  □ Dyspnea
  □ Orthopnea
  □ Chest pain
\`\`\`

---

## Signs

### Blood Pressure

- Elevated on 2 occasions, 4 hours apart
- ≥140/90 = hypertension
- ≥160/110 = severe (treat within 30-60 min)

### Edema

| Type | Significance |
|------|--------------|
| Dependent edema | Common in normal pregnancy |
| **Facial edema** | More concerning |
| **Rapid weight gain** | >1 kg/week |
| Pulmonary edema | Severe disease |

> 📝 **Note**: Edema is no longer part of diagnostic criteria

### Neurological Signs

| Sign | Significance |
|------|--------------|
| **Hyperreflexia** | 80% of preeclamptic women |
| **Clonus** | Imminent eclampsia |
| **Papilledema** | Rare, indicates severe disease |

### Abdominal Examination

- RUQ tenderness: Liver involvement
- IUGR: Placental insufficiency
- Oligohydramnios: Fetal renal effects

---

## Laboratory Findings

### Essential Investigations

| Test | Finding | Significance |
|------|---------|--------------|
| **Urinalysis** | Protein ≥2+ | Screening |
| **24h urine protein** | ≥300 mg | Diagnostic |
| **Protein/Cr ratio** | ≥0.3 mg/mg | Alternative to 24h |
| **Hemoglobin** | ↑ (hemoconcentration) | Severity marker |
| **Platelets** | <100,000 | Severe feature |
| **Creatinine** | >1.1 mg/dL | Renal impairment |
| **AST/ALT** | >2× ULN | Hepatic involvement |
| **LDH** | >600 IU/L | Hemolysis (HELLP) |
| **Uric acid** | >6 mg/dL | Poor prognostic marker |

### Peripheral Smear in HELLP

- Schistocytes (fragmented RBCs)
- Burr cells
- Signs of microangiopathic hemolytic anemia

---

## Fetal Assessment

### Ultrasound Findings

| Parameter | Abnormality |
|-----------|-------------|
| **EFW** | <10th percentile (IUGR) |
| **AFI** | <5 cm (oligohydramnios) |
| **Doppler** | Absent/reversed end-diastolic flow (umbilical artery) |

### Non-stress Test

- May show: Decreased variability, late decelerations
- Biophysical profile for comprehensive assessment

### Fetal Complications

- IUGR (25-30%)
- Oligohydramnios
- Placental abruption (1-4%)
- Prematurity (iatrogenic)
- Stillbirth
`
    },
    {
      id: 'management',
      title: 'Management',
      depth: 'mbbs',
      icon: '💊',
      content: `
## Management Principles

### Goals of Treatment

1. **Prevent maternal seizures** (MgSO4)
2. **Control severe hypertension** (antihypertensives)
3. **Optimize timing of delivery** (definitive treatment)
4. **Monitor for complications** (serial assessments)

> 💎 **Clinical Pearl**: Delivery is the ONLY definitive treatment for preeclampsia

---

## Antihypertensive Therapy

### When to Treat

- Severe hypertension (≥160/110) requires **urgent treatment**
- Goal: Reduce BP to <160/110 (not normalize)
- Treat within **30-60 minutes** to prevent stroke

### First-Line Agents

| Drug | Dose | Mechanism | Notes |
|------|------|-----------|-------|
| **Labetalol** | 20mg IV, then 40-80mg q10min | α + β blocker | Max 300mg; avoid in asthma |
| **Hydralazine** | 5mg IV, then 5-10mg q20min | Vasodilator | Max 20mg; causes reflex tachycardia |
| **Nifedipine** | 10-20mg PO q20min | CCB | Max 50mg; rapid onset |

### Step-wise Protocol

\`\`\`
Step 1: Labetalol 20mg IV over 2 min
        ↓
        Wait 10 min, recheck BP
        ↓
Step 2: Labetalol 40mg IV if still elevated
        ↓
        Wait 10 min, recheck BP
        ↓
Step 3: Labetalol 80mg IV
        ↓
        Wait 10 min
        ↓
Step 4: If still elevated → Hydralazine 10mg IV
        OR Nifedipine 20mg PO
\`\`\`

### Maintenance Therapy

| Drug | Dose | Safety |
|------|------|--------|
| Labetalol | 100-400mg PO q8-12h | Safe |
| Nifedipine XL | 30-120mg PO daily | Safe |
| Methyldopa | 250-500mg PO q8h | Safe, old standard |

> ⚠️ **Contraindicated**: ACE inhibitors, ARBs, atenolol (fetal effects)

---

## Magnesium Sulfate (MgSO4)

### Indications

1. **Eclampsia** - Treatment and prevention of recurrence
2. **Preeclampsia with severe features** - Seizure prophylaxis

### Pritchard Regimen (IM)

| Phase | Dose | Route |
|-------|------|-------|
| **Loading** | 4g IV over 15-20 min + 10g IM (5g each buttock) | IV + IM |
| **Maintenance** | 5g IM every 4 hours | IM |

### Zuspan Regimen (IV)

| Phase | Dose | Route |
|-------|------|-------|
| **Loading** | 4-6g IV over 15-20 min | IV |
| **Maintenance** | 1-2g/hour continuous infusion | IV |

### Therapeutic Range

- **Target level**: 4-7 mEq/L (4.8-8.4 mg/dL)
- Continue for **24-48 hours postpartum**

### Monitoring for Toxicity

| Parameter | Safe Value | Toxic Sign |
|-----------|------------|------------|
| **Urine output** | >30 mL/hr | Oliguria → accumulation |
| **Respiratory rate** | >12/min | <12 = toxicity |
| **Deep tendon reflexes** | Present | Absent = toxicity |
| **Magnesium level** | <7 mEq/L | >7 = loss of reflexes |

### Signs of Toxicity (Increasing Mg levels)

\`\`\`
4-7 mEq/L  → Therapeutic
7-10 mEq/L → Loss of patellar reflexes
10-13 mEq/L → Respiratory depression
>15 mEq/L  → Cardiac arrest
\`\`\`

### Antidote

**Calcium gluconate 1g IV over 3-5 minutes**

---

## Timing of Delivery

### Preeclampsia WITHOUT Severe Features

| Gestational Age | Management |
|-----------------|------------|
| <37 weeks | Expectant management with close monitoring |
| ≥37 weeks | Delivery recommended |

### Preeclampsia WITH Severe Features

| Gestational Age | Management |
|-----------------|------------|
| <24 weeks | Counsel on risks, consider termination |
| 24-34 weeks | Steroids + consider expectant if stable |
| ≥34 weeks | Delivery after stabilization |
| Any GA with uncontrollable HTN, eclampsia, HELLP, fetal distress | Immediate delivery |

### Indications for Immediate Delivery

\`\`\`
□ Uncontrolled severe hypertension despite treatment
□ Eclampsia
□ Pulmonary edema
□ Placental abruption
□ DIC
□ Non-reassuring fetal status
□ HELLP with worsening labs
\`\`\`

---

## Mode of Delivery

### Vaginal Delivery Preferred If:
- Favorable cervix (Bishop ≥6)
- No contraindications
- Expectation of delivery within 24-48 hours

### Cesarean Indicated For:
- Usual obstetric indications
- Unfavorable cervix with unstable condition
- Fetal distress
`
    },
    {
      id: 'eclampsia-management',
      title: 'Eclampsia Management',
      depth: 'pg',
      icon: '⚡',
      content: `
## Eclampsia

### Definition
New-onset tonic-clonic seizures in a woman with preeclampsia, not attributable to other causes.

### Timing of Seizures

| Period | Frequency |
|--------|-----------|
| Antepartum | 38-53% |
| Intrapartum | 18-36% |
| Postpartum (≤48h) | 7-39% |
| Late postpartum (>48h to 4 weeks) | 5-17% |

---

## Immediate Management

### ABC + Seizure Control

\`\`\`
1. Call for help
2. Position: Left lateral, protect airway
3. Prevent injury (padded side rails)
4. Oxygen 10L/min via mask
5. IV access (if not present)
6. Magnesium sulfate - FIRST LINE
   - Loading: 4-6g IV over 15-20 min
   - Maintenance: 1-2g/hour
7. Monitor vitals, FHR
8. Foley catheter
9. Labs: CBC, LFT, RFT, coagulation
\`\`\`

### If Seizure Continues (>2 min)

- Additional MgSO4 2g IV over 3-5 min
- If still seizing: Diazepam 5-10mg IV or Lorazepam 4mg IV
- Intubation if needed for airway protection

### Post-Seizure Care

| Action | Details |
|--------|---------|
| **Blood pressure** | Treat if ≥160/110 (labetalol, hydralazine) |
| **Fetal monitoring** | CTG - expect transient bradycardia |
| **Imaging** | CT/MRI if atypical presentation or prolonged coma |
| **Preparation** | For delivery after stabilization |

---

## Posterior Reversible Encephalopathy Syndrome (PRES)

### Features
- Vasogenic cerebral edema
- Parieto-occipital predominance
- Usually reversible with treatment

### MRI Findings
- T2/FLAIR hyperintensity
- Posterior > anterior
- Gray and white matter involved

### Treatment
- Blood pressure control
- Magnesium sulfate
- Seizure control

---

## Delivery After Eclampsia

### Timing
- Delivery after maternal stabilization (usually within 24-48 hours)
- NOT immediate cesarean (unless obstetric indication)

### FHR Changes During/After Seizure

| Finding | Significance |
|---------|--------------|
| Bradycardia | Common, usually recovers in 3-5 min |
| Prolonged deceleration | May last 10-15 min post-seizure |
| Recovery | Reassuring if normal pattern returns |

> 💎 **Clinical Pearl**: Transient fetal bradycardia after eclamptic seizure is expected. Don't rush to emergency cesarean - wait for recovery.

---

## Recurrent Seizures

### Management

\`\`\`
1. Ensure adequate Mg level (check serum level)
2. Additional MgSO4 2g IV bolus
3. If continues despite Mg:
   - Diazepam 5-10mg IV
   - OR Lorazepam 2-4mg IV
   - OR Phenytoin 1g IV over 20 min
4. Consider intubation if:
   - Status epilepticus
   - Aspiration risk
   - Unable to protect airway
5. CT head to rule out ICH
\`\`\`

### Status Eclamptics (Rare)
- Continuous or recurrent seizures without recovery
- Thiopental or propofol infusion
- ICU admission
- Consider ICH or CVT

---

## Differential Diagnosis of Seizures

| Condition | Distinguishing Features |
|-----------|------------------------|
| **Epilepsy** | History, normal BP, normal labs |
| **Cerebral venous thrombosis** | Headache, focal signs, CT/MRI |
| **Intracranial hemorrhage** | Sudden severe headache, focal signs |
| **Meningitis/Encephalitis** | Fever, meningism, CSF analysis |
| **Metabolic** | Hypoglycemia, hyponatremia, uremia |
| **Drug toxicity** | History, toxicology screen |

---

## Complications of Eclampsia

### Maternal

| Complication | Incidence |
|--------------|-----------|
| Placental abruption | 7-10% |
| DIC | 7-11% |
| Pulmonary edema | 3-5% |
| Acute renal failure | 5-9% |
| HELLP syndrome | 10-15% |
| Aspiration pneumonia | 2-3% |
| Maternal death | 1-2% |

### Fetal/Neonatal

| Complication | Details |
|--------------|---------|
| Transient bradycardia | During/after seizure |
| Hypoxia | If prolonged seizure |
| Prematurity | Iatrogenic delivery |
| IUGR | From preeclampsia |
| Stillbirth | 2-5% |
`
    },
    {
      id: 'hellp-syndrome',
      title: 'HELLP Syndrome',
      depth: 'pg',
      icon: '🩸',
      content: `
## Definition & Diagnosis

### HELLP Syndrome
**H**emolysis, **E**levated **L**iver enzymes, **L**ow **P**latelets

### Diagnostic Criteria

| Component | Criterion |
|-----------|-----------|
| **Hemolysis** | Abnormal peripheral smear (schistocytes), LDH >600 IU/L, Bilirubin >1.2 mg/dL |
| **Elevated liver enzymes** | AST ≥70 IU/L (>2× ULN) |
| **Low platelets** | <100,000/µL |

### Mississippi Classification (Severity)

| Class | Platelet Count | Prognosis |
|-------|----------------|-----------|
| Class 1 | <50,000/µL | Severe |
| Class 2 | 50,000-100,000/µL | Moderate |
| Class 3 | 100,000-150,000/µL | Mild |

---

## Clinical Presentation

### Symptoms

| Symptom | Frequency |
|---------|-----------|
| RUQ/epigastric pain | 40-90% |
| Nausea/vomiting | 30-50% |
| Malaise | 90% |
| Headache | 30-60% |
| Visual changes | 10-20% |

### Signs

| Sign | Significance |
|------|--------------|
| Hypertension | 80% (can be absent!) |
| Proteinuria | 85% |
| Hepatic tenderness | Liver involvement |
| Jaundice | Rare, severe disease |
| Bleeding | DIC |

> ⚠️ **Warning**: 15-20% of HELLP patients have NO hypertension or proteinuria

---

## Differential Diagnosis

### Critical DDx

| Condition | Key Differentiating Features |
|-----------|----------------------------|
| **Acute fatty liver of pregnancy** | Hypoglycemia, coagulopathy (low fibrinogen), may have DIC without MAHA |
| **TTP** | Severe thrombocytopenia, neurological symptoms, ADAMTS13 <10% |
| **HUS** | Severe renal failure, less neurological |
| **Viral hepatitis** | Viral markers positive, very high transaminases |
| **Cholecystitis** | RUQ pain, ultrasound findings |

### HELLP vs AFLP

| Feature | HELLP | AFLP |
|---------|-------|------|
| Platelets | <100,000 | Variable |
| Hemolysis | Present | Absent/mild |
| Fibrinogen | Normal | Low |
| Glucose | Normal | **Low** |
| Ammonia | Normal | **Elevated** |

---

## Management

### Principles

1. **Stabilize** mother
2. **Correct** coagulopathy
3. **Deliver** - definitive treatment
4. **Monitor** for complications

### Blood Product Transfusion

| Product | Indication |
|---------|------------|
| **Platelets** | <20,000/µL (or <50,000 for cesarean) |
| **FFP** | Coagulopathy, DIC |
| **PRBCs** | Symptomatic anemia, active bleeding |

### Corticosteroids

| Role | Details |
|------|---------|
| **Fetal lung maturity** | Betamethasone 12mg IM × 2 doses (24h apart) |
| **HELLP treatment** | Dexamethasone - controversial, may speed platelet recovery |

### Timing of Delivery

| Gestational Age | Approach |
|-----------------|----------|
| <24 weeks | Counsel on risks, consider termination |
| 24-34 weeks | Steroids, deliver after stabilization (24-48h) |
| ≥34 weeks | Deliver after stabilization |
| Unstable | Immediate delivery after resuscitation |

---

## Complications

### Maternal Complications

| Complication | Incidence |
|--------------|-----------|
| DIC | 15-20% |
| Placental abruption | 9-20% |
| Acute renal failure | 7-8% |
| Pulmonary edema | 6-8% |
| Subcapsular liver hematoma | 1-2% |
| Retinal detachment | 1% |
| Stroke | 1% |
| Maternal death | 1-3% |

### Hepatic Complications

| Complication | Management |
|--------------|------------|
| Subcapsular hematoma | CT diagnosis, conservative if contained |
| Hepatic rupture | Surgical emergency - packing, embolization |

> 💎 **Clinical Pearl**: If sudden severe RUQ pain + hypotension = suspect hepatic rupture. CALL SURGEON!

### Postpartum Course

- Labs typically worsen for 24-48 hours postpartum before improving
- Platelet nadir usually 24-48 hours postpartum
- Recovery within 3-7 days
- If no improvement → consider TTP, HUS, other diagnoses
`
    },
    {
      id: 'prevention',
      title: 'Prevention & Prognosis',
      depth: 'pg',
      icon: '🛡️',
      content: `
## Primary Prevention

### Low-Dose Aspirin

**ACOG/USPSTF Recommendation**:
Aspirin 81mg daily starting at **12-16 weeks** (ideally before 16 weeks)

### Indications

**One HIGH-RISK factor**:
| Factor |
|--------|
| Previous preeclampsia |
| Multifetal pregnancy |
| Chronic hypertension |
| Type 1 or 2 diabetes |
| Chronic kidney disease |
| Autoimmune disease (SLE, APS) |

**OR Two MODERATE-RISK factors**:
| Factor |
|--------|
| Nulliparity |
| Age ≥35 years |
| BMI >30 |
| Family history of preeclampsia |
| Personal history of SGA/adverse outcome |
| Interpregnancy interval >10 years |

### Evidence

| Study | Finding |
|-------|---------|
| **ASPRE Trial** | 62% reduction in preterm preeclampsia |
| **Meta-analyses** | 10-20% overall reduction |

---

## Calcium Supplementation

### WHO Recommendation
- Calcium 1.5-2g daily in areas of **low dietary calcium** intake
- Reduces preeclampsia risk by ~50%

---

## Prediction Models

### First Trimester Screening

| Marker | In Preeclampsia |
|--------|-----------------|
| **PAPP-A** | Decreased |
| **PlGF** | Decreased |
| **sFlt-1/PlGF ratio** | Elevated |
| **Mean arterial pressure** | Elevated |
| **Uterine artery Doppler** | Increased PI, notching |

### FMF Algorithm
- Combines maternal factors + MAP + uterine artery Doppler + PAPP-A + PlGF
- Identifies high-risk women for aspirin prophylaxis
- Detection rate: 75-90% for early preeclampsia

---

## Postpartum Considerations

### Immediate Postpartum

| Time | Management |
|------|------------|
| 0-24h | Continue MgSO4 (24-48h total) |
| 0-72h | Peak time for postpartum eclampsia |
| Daily | Monitor BP, symptoms, labs |

### Postpartum Blood Pressure

- May worsen in first 3-5 days postpartum
- Diuresis often triggers resolution
- Continue antihypertensives as needed

### Discharge Considerations

\`\`\`
□ BP <140/90 on oral medication
□ No symptoms of severe disease
□ Platelets recovering
□ Creatinine improving
□ Clear follow-up plan (BP check in 3-5 days)
□ Red flag education provided
\`\`\`

---

## Long-Term Prognosis

### Recurrence Risk

| Situation | Recurrence Rate |
|-----------|-----------------|
| Preeclampsia (any) | 15-20% |
| Early-onset preeclampsia (<34 weeks) | 25-40% |
| HELLP syndrome | 5-20% |
| Eclampsia | 2-15% |

### Long-Term Cardiovascular Risk

| Outcome | Relative Risk |
|---------|---------------|
| Chronic hypertension | 4× |
| Ischemic heart disease | 2× |
| Stroke | 1.8× |
| VTE | 1.8× |
| End-stage renal disease | 4.5× |
| Cardiovascular death | 2× |

> 💎 **Clinical Pearl**: Preeclampsia is a "stress test" for future cardiovascular disease. Counsel on lifestyle modification and regular screening.

### Counseling Points

\`\`\`
For future pregnancy:
□ Start aspirin at 12-16 weeks
□ Close monitoring (early pregnancy booking)
□ Serial BP, urinalysis, growth scans

For long-term health:
□ Annual BP monitoring
□ Lifestyle: Exercise, healthy diet, weight control
□ Cardiovascular risk factor modification
□ May consider lipid panel, glucose screening
\`\`\`
`
    },
    {
      id: 'advanced-topics',
      title: 'Advanced Concepts',
      depth: 'superSpecialty',
      icon: '🎓',
      content: `
## Molecular Pathogenesis

### The sFlt-1 Story

\`\`\`
Placental hypoxia
      ↓
HIF-1α activation
      ↓
↑ sFlt-1 (soluble VEGF receptor-1)
      ↓
Binds free VEGF and PlGF
      ↓
Endothelial dysfunction
      ↓
Preeclampsia syndrome
\`\`\`

### Therapeutic Implications

| Approach | Status |
|----------|--------|
| **Apheresis** (remove sFlt-1) | Investigational |
| **VEGF administration** | Too risky (tumor angiogenesis) |
| **PlGF** | Diagnostic marker, therapy studied |
| **Pravastatin** | Investigational, promising |

---

## Biomarkers

### Established Markers

| Marker | Interpretation |
|--------|----------------|
| **sFlt-1/PlGF ratio** | <38 rules out preeclampsia for 1 week |
| **PlGF** | <100 pg/mL concerning |
| **Uric acid** | Poor specificity, but correlates with severity |

### Emerging Markers

- Copeptin
- PP-13 (placental protein 13)
- ADAM12
- Cell-free fetal DNA

---

## Special Situations

### Superimposed Preeclampsia

\`\`\`
Chronic HTN + any of:
□ New-onset proteinuria (if none before)
□ Sudden increase in proteinuria
□ Sudden increase in BP
□ New end-organ dysfunction
□ Thrombocytopenia <100,000
\`\`\`

### Atypical Preeclampsia

- Early-onset (<20 weeks): Consider molar pregnancy, APS
- Postpartum preeclampsia: Up to 4-6 weeks postpartum
- Preeclampsia without hypertension: Rare, diagnosis of exclusion

---

## Current Controversies

### Expectant Management in Early Severe Preeclampsia

| Argument For | Argument Against |
|--------------|------------------|
| ↓ Neonatal morbidity | ↑ Maternal risk |
| Each day gained = improved survival | Progressive deterioration |
| 24-34 weeks window | HELLP, eclampsia risk |

### Dexamethasone for HELLP

| ACOG Position | Evidence |
|---------------|----------|
| Not routinely recommended | Speeds recovery but no outcome benefit |
| May use for platelet <50,000 | Cochrane review: Insufficient evidence |

### sFlt-1/PlGF Testing

| Region | Status |
|--------|--------|
| Europe (UK, Germany) | Integrated into guidelines |
| USA | Not yet standard of care |
| Emerging economies | Accessibility issues |

---

## Future Directions

### Therapeutic Targets

1. **Anti-sFlt-1 strategies**
2. **Placental-specific drug delivery**
3. **Stem cell therapy for placental repair**
4. **RNA interference**

### Prediction and Prevention

1. **Multi-marker algorithms** (cfDNA, proteomics)
2. **Artificial intelligence** for risk prediction
3. **Personalized aspirin dosing**

---

## Key Exam Points Summary

| Topic | Key Point |
|-------|-----------|
| Definition | HTN ≥140/90 after 20 weeks + proteinuria OR end-organ damage |
| Proteinuria threshold | ≥300 mg/24h or P/C ≥0.3 |
| Severe HTN | ≥160/110 - treat within 30-60 min |
| First-line seizure prophylaxis | Magnesium sulfate |
| MgSO4 antidote | Calcium gluconate |
| Definitive treatment | Delivery |
| Aspirin prophylaxis | 81mg daily from 12-16 weeks in high-risk |
| HELLP triad | Hemolysis + ↑LFT + ↓Platelets |
| Eclampsia timing | Can occur up to 4 weeks postpartum |
`
    }
  ],

  keyPoints: [
    "Preeclampsia = HTN ≥140/90 after 20 weeks + proteinuria OR end-organ damage",
    "Proteinuria no longer required if end-organ dysfunction present",
    "Severe features: BP ≥160/110, platelets <100K, elevated LFT, creatinine >1.1",
    "MgSO4 is first-line for seizure prophylaxis AND eclampsia treatment",
    "Calcium gluconate is the antidote for MgSO4 toxicity",
    "Delivery is the ONLY definitive treatment",
    "Aspirin 81mg from 12-16 weeks for high-risk women",
  ],

  mnemonics: [
    {
      title: "HELLP Syndrome",
      content: `**H**emolysis (schistocytes, ↑LDH, ↑bilirubin)
**E**levated **L**iver enzymes (AST/ALT >2× ULN)
**L**ow **P**latelets (<100,000/µL)

*Remember: Can occur WITHOUT hypertension in 15-20%!*`,
    },
    {
      title: "MgSO4 Toxicity Progression",
      content: `**4-7**: Therapeutic level
**7-10**: Loss of reflexes (**R**eflexes go at **7**)
**10-13**: Respiratory depression
**>15**: Cardiac arrest

*"Reflex, Respiration, Cardiac" - in order of magnesium*`,
    },
    {
      title: "MgSO4 Monitoring",
      content: `**RUM** before each dose:
**R**eflexes present
**U**rine output >30 mL/hr
**M**agnesium level <7 mEq/L (if checking)

*"RUM keeps you safe from Mag toxicity"*`,
    },
    {
      title: "Severe Preeclampsia Features",
      content: `**HELP BP**:
**H**eadache/vision changes
**E**levated creatinine (>1.1)
**L**iver enzymes elevated (>2×)
**P**latelets low (<100,000)
**B**P severe (≥160/110)
**P**ulmonary edema`,
    },
  ],

  clinicalPearls: [
    "Proteinuria is NO LONGER required for preeclampsia diagnosis if end-organ dysfunction present",
    "15-20% of HELLP cases have NO hypertension or proteinuria",
    "MgSO4 prevents seizures better than phenytoin or diazepam (Magpie Trial)",
    "Transient fetal bradycardia after eclamptic seizure is expected - don't rush to cesarean",
    "Preeclampsia can present up to 4-6 weeks postpartum",
    "HELLP labs typically worsen for 24-48 hours postpartum before improving",
    "sFlt-1/PlGF ratio <38 effectively rules out preeclampsia for 1 week",
    "Preeclampsia is a cardiovascular risk factor - counsel about long-term monitoring",
  ],

  examTips: [
    "Severe HTN (≥160/110) must be treated within 30-60 minutes",
    "MgSO4 loading dose: 4-6g IV over 15-20 min (Zuspan) or 4g IV + 10g IM (Pritchard)",
    "MgSO4 maintenance: 1-2g/hr IV (Zuspan) or 5g IM q4h (Pritchard)",
    "Calcium gluconate 1g IV is the antidote for MgSO4 toxicity",
    "Aspirin prophylaxis should START before 16 weeks for maximum benefit",
    "HELLP Class 1 = platelets <50,000 (worst prognosis)",
    "Eclampsia: 38-53% antepartum, 18-36% intrapartum, rest postpartum",
    "After preeclampsia: 4× risk of future hypertension, 2× cardiovascular disease",
  ],
};
