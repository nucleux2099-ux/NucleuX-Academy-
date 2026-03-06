/**
 * Cirrhosis & Complications - Full Medical Content
 * 
 * Comprehensive content covering:
 * - Pathophysiology of cirrhosis
 * - Portal hypertension and its complications
 * - Ascites, Variceal bleeding, HE, HRS, SBP
 * - Depth-stratified for MBBS/PG/Super Specialty
 * 
 * Sources: Sleisenger 11th Ed, Harrison's 22nd Ed
 */

export const CIRRHOSIS_CONTENT = {
  id: 'med-gi-cirrhosis',
  name: 'Cirrhosis & Complications',
  
  concepts: [
    {
      id: 'overview',
      title: 'Cirrhosis: Overview & Etiology',
      depth: 'mbbs',
      icon: '📊',
      content: `
## Definition

**Cirrhosis** is the end-stage of chronic liver disease characterized by:
1. **Diffuse fibrosis** - Replacement of normal architecture with fibrous tissue
2. **Regenerative nodules** - Islands of hepatocytes surrounded by fibrosis
3. **Vascular distortion** - Altered hepatic blood flow

> 📚 **Source:** Sleisenger 11th Ed, Ch.74: Hepatic Fibrosis and Cirrhosis

---

## Etiology

### Common Causes (Mnemonic: "HEPATIC")

| Letter | Cause | Prevalence |
|--------|-------|------------|
| **H** | Hepatitis B & C | 25-30% |
| **E** | EtOH (Alcohol) | 25-30% |
| **P** | Primary biliary cholangitis | 5% |
| **A** | Autoimmune hepatitis | 5% |
| **T** | Toxins & drugs | Variable |
| **I** | Iron (Hemochromatosis) | 5% |
| **C** | Cryptogenic/MASH | 10-20% |

### Detailed Etiologies

#### Viral
- **Hepatitis B** - With or without HDV
- **Hepatitis C** - Most common cause in many regions
- **Hepatitis D** - Only with HBV co-infection

#### Metabolic
- **MASLD/MASH** - Metabolic dysfunction-associated steatotic liver disease
- **Hemochromatosis** - Iron overload
- **Wilson disease** - Copper overload
- **Alpha-1 antitrypsin deficiency**
- **Glycogen storage diseases**

#### Autoimmune
- **Autoimmune hepatitis**
- **Primary biliary cholangitis (PBC)**
- **Primary sclerosing cholangitis (PSC)**

#### Vascular
- **Budd-Chiari syndrome**
- **Cardiac cirrhosis** (chronic right heart failure)
- **Veno-occlusive disease**

#### Others
- **Alcohol-associated liver disease**
- **Drug-induced** (methotrexate, amiodarone)
- **Cryptogenic** (unknown cause)

---

## Pathogenesis

### Mechanism of Fibrosis

\`\`\`
Chronic Liver Injury (virus, alcohol, etc.)
        ↓
Hepatocyte Death (necrosis/apoptosis)
        ↓
Kupffer Cell Activation
        ↓
Release of Cytokines (TGF-β, PDGF, TNF-α)
        ↓
Hepatic Stellate Cell Activation
        ↓
Myofibroblast Transformation
        ↓
Collagen Deposition (Types I and III)
        ↓
Fibrosis → Cirrhosis
\`\`\`

> 💎 **Clinical Pearl**: Hepatic stellate cells are the KEY fibrogenic cells. They normally store vitamin A but transform into collagen-producing myofibroblasts

### Consequences of Cirrhosis

| Consequence | Mechanism |
|-------------|-----------|
| **Portal hypertension** | Increased intrahepatic resistance |
| **Hepatic insufficiency** | Reduced functional hepatocyte mass |
| **Hepatocellular carcinoma** | Chronic inflammation, regeneration |

---

## Classification

### Morphological Classification

| Type | Nodule Size | Common Causes |
|------|-------------|---------------|
| **Micronodular** | <3 mm | Alcohol, hemochromatosis, biliary |
| **Macronodular** | >3 mm | Viral hepatitis, AIH |
| **Mixed** | Both sizes | Progression of micronodular |

### Functional Classification

**Compensated Cirrhosis:**
- Liver maintains function
- No major complications
- Median survival: >12 years

**Decompensated Cirrhosis:**
- Evidence of complications
- Ascites, variceal bleeding, HE, jaundice
- Median survival: ~2 years without transplant

---

## Clinical Features

### Symptoms

\`\`\`
Early (often asymptomatic):
  - Fatigue, weakness
  - Anorexia, weight loss
  - Abdominal discomfort

Late (decompensated):
  - Abdominal distension (ascites)
  - Jaundice
  - Confusion (encephalopathy)
  - GI bleeding (varices)
\`\`\`

### Physical Signs

| System | Signs |
|--------|-------|
| **General** | Muscle wasting, cachexia |
| **Skin** | Jaundice, spider angiomata, palmar erythema |
| **Hands** | Clubbing, Dupuytren's, leukonychia |
| **Chest** | Gynecomastia, loss of axillary hair |
| **Abdomen** | Hepatomegaly (early)/small liver, splenomegaly, ascites, caput medusae |
| **Genitalia** | Testicular atrophy |
| **Neurological** | Asterixis, confusion |

### Stigmata of Chronic Liver Disease

> **Mnemonic: "ABCDEFGHIJ"**
> - **A**sterixes
> - **B**ruising
> - **C**lubbing, Caput medusae
> - **D**upuytren's contracture
> - **E**ncephalopathy, Edema
> - **F**etor hepaticus
> - **G**ynecomastia
> - **H**epatomegaly
> - **I**cterus (jaundice)
> - **J**aundice
`
    },
    {
      id: 'portal-hypertension',
      title: 'Portal Hypertension',
      depth: 'mbbs',
      icon: '🩸',
      content: `
## Definition

**Portal Hypertension** = Portal venous pressure gradient (HVPG) **>5 mmHg**

- **Clinically significant**: HVPG ≥10 mmHg (risk of varices, decompensation)
- **Variceal bleeding risk**: HVPG ≥12 mmHg

> 📚 **Source:** Sleisenger 11th Ed, Ch.92: Portal Hypertension and Variceal Bleeding

---

## Classification

### By Site of Obstruction

| Type | Site | Causes |
|------|------|--------|
| **Pre-hepatic** | Portal/splenic vein | Portal vein thrombosis, splenic vein thrombosis |
| **Intrahepatic - Presinusoidal** | Portal tracts | Schistosomiasis, PBC, sarcoidosis |
| **Intrahepatic - Sinusoidal** | Sinusoids | Cirrhosis (most common) |
| **Intrahepatic - Postsinusoidal** | Central veins | Veno-occlusive disease |
| **Post-hepatic** | Hepatic veins/IVC | Budd-Chiari, cardiac |

> 💎 **Clinical Pearl**: Cirrhosis causes primarily SINUSOIDAL portal hypertension - the most common type worldwide

---

## Pathophysiology

### Hemodynamic Changes

\`\`\`
Cirrhosis
    ↓
↑ Intrahepatic Resistance (structural + dynamic)
    ↓
Portal Hypertension
    ↓
Splanchnic Vasodilation (NO↑)
    ↓
Systemic Vasodilation
    ↓
↓ Effective Arterial Blood Volume
    ↓
Activation of RAAS, SNS, ADH
    ↓
Sodium and Water Retention
    ↓
Ascites, Edema
\`\`\`

### Components of Increased Resistance

| Component | Contribution | Modifiable? |
|-----------|--------------|-------------|
| **Structural** | 70% | No (fibrosis, nodules) |
| **Dynamic** | 30% | Yes (stellate cell contraction) |

> 📝 **Exam Tip**: The dynamic component is targeted by NON-SELECTIVE beta-blockers (reduce portal pressure by ~20%)

---

## Consequences of Portal Hypertension

### Porto-Systemic Collaterals

| Location | Collateral | Clinical Manifestation |
|----------|------------|------------------------|
| **Esophagus** | Left gastric → Azygos | Esophageal varices |
| **Stomach** | Short gastrics → Azygos | Gastric varices |
| **Rectum** | Superior → Inferior hemorrhoidal | Anorectal varices |
| **Umbilicus** | Paraumbilical → Abdominal wall | Caput medusae |
| **Retroperitoneum** | Splenic/renal → Left renal | Splenorenal shunt |

### Other Consequences

- **Splenomegaly** → Hypersplenism
- **Ascites** → Hypoalbuminemia + portal HTN
- **Hepatic encephalopathy** → Shunting of ammonia
- **Hepatorenal syndrome** → Severe vasoconstriction

---

## Esophageal Varices

### Pathophysiology

\`\`\`
Portal Hypertension (HVPG >10 mmHg)
        ↓
Collateral Formation
        ↓
Variceal Growth (increased wall tension)
        ↓
Risk of Rupture (HVPG >12 mmHg)
        ↓
Variceal Hemorrhage
\`\`\`

### Risk Factors for Bleeding

| Factor | Higher Risk |
|--------|-------------|
| **Variceal size** | Large (>5mm) |
| **Red wale marks** | Present |
| **Cherry red spots** | Present |
| **Child-Pugh class** | C > B > A |
| **HVPG** | >12 mmHg |
| **Continued alcohol** | Active drinking |

### Surveillance

\`\`\`
Compensated cirrhosis:
  - EGD at diagnosis
  - If no varices: Repeat in 2-3 years
  - If small varices: Repeat in 1-2 years

With liver stiffness + platelet criteria (Baveno VII):
  - LSM <20 kPa AND platelets >150,000 → Can avoid EGD
\`\`\`

---

## Management of Varices

### Primary Prophylaxis (Never bled)

| Variceal Size | Treatment |
|---------------|-----------|
| **No varices** | Treat underlying cause, surveillance |
| **Small varices** | NSBBs (especially if high-risk stigmata) |
| **Medium/Large** | NSBBs OR EVL |

**Non-selective Beta-Blockers (NSBBs):**
- Propranolol: 20-40mg BID, titrate to HR 55-60
- Nadolol: 40mg daily
- Carvedilol: 6.25-12.5mg daily (may be more effective)

### Acute Variceal Bleeding

**Immediate Management:**

\`\`\`
1. Resuscitation
   - 2 large bore IVs
   - Restrictive transfusion (Hb target 7-8 g/dL)
   - Avoid over-resuscitation

2. Vasoactive drugs (start immediately)
   - Octreotide: 50 μg bolus, then 50 μg/hr
   - Or Terlipressin: 2mg IV q4h

3. Antibiotics (critical!)
   - Ceftriaxone 1g IV daily × 7 days

4. Endoscopy (within 12 hours)
   - Endoscopic variceal ligation (EVL)
   - Consider PPI for ulcers

5. If uncontrolled:
   - Balloon tamponade (bridge)
   - TIPS (definitive)
\`\`\`

> 💎 **Clinical Pearl**: Antibiotics reduce mortality in variceal bleeding - as important as endoscopy!

### Secondary Prophylaxis (After bleeding)

- **EVL** + **NSBBs** combined (most effective)
- EVL every 2-4 weeks until eradication
- Then surveillance EGD every 6-12 months
- TIPS if recurrent despite optimal therapy
`
    },
    {
      id: 'ascites',
      title: 'Ascites',
      depth: 'mbbs',
      icon: '💧',
      content: `
## Definition

**Ascites** = Pathological accumulation of fluid in the peritoneal cavity

> Most common complication of cirrhosis - 60% develop within 10 years

---

## Pathophysiology

### "Underfill" Theory (Current understanding)

\`\`\`
Portal Hypertension
        ↓
Splanchnic Vasodilation (NO↑)
        ↓
Systemic Arterial Vasodilation
        ↓
↓ Effective Arterial Blood Volume
        ↓
Activation of RAAS + SNS + ADH
        ↓
Sodium & Water Retention
        ↓
Ascites Formation
\`\`\`

### Contributing Factors

| Factor | Mechanism |
|--------|-----------|
| **Portal hypertension** | ↑ Hydrostatic pressure |
| **Hypoalbuminemia** | ↓ Oncotic pressure |
| **Sodium retention** | RAAS activation |
| **Water retention** | ADH (hyponatremia) |
| **Lymphatic overflow** | Exceeds drainage capacity |

---

## Diagnosis

### Clinical Examination

| Sign | Technique | Detects |
|------|-----------|---------|
| **Shifting dullness** | Percussion in lateral decubitus | >1500 mL |
| **Fluid thrill** | Assistant's hand blocks wave | Large volume |
| **Bulging flanks** | Inspection | Moderate-large |
| **Puddle sign** | Auscultatory percussion | Small volume |

### Diagnostic Paracentesis

**Always perform paracentesis in:**
- New onset ascites
- Hospital admission with ascites
- Suspected SBP (fever, abdominal pain, encephalopathy)

### Ascitic Fluid Analysis

| Test | Purpose |
|------|---------|
| **Cell count + differential** | SBP screening |
| **Albumin** | Calculate SAAG |
| **Total protein** | Low (<2.5) = cirrhosis |
| **Culture** | In blood culture bottles |
| **Glucose, LDH, amylase** | If secondary peritonitis suspected |
| **Cytology** | If malignancy suspected |

---

## SAAG (Serum-Ascites Albumin Gradient)

> **SAAG = Serum albumin - Ascitic albumin**

| SAAG | Interpretation | Causes |
|------|----------------|--------|
| **≥1.1 g/dL** | Portal hypertension | Cirrhosis, cardiac, Budd-Chiari |
| **<1.1 g/dL** | Non-portal hypertension | Malignancy, TB, nephrotic, pancreatitis |

> 💎 **Clinical Pearl**: SAAG ≥1.1 indicates portal hypertension with 97% accuracy - better than transudative/exudative classification!

### High SAAG Differential

| Condition | Protein | Other |
|-----------|---------|-------|
| **Cirrhosis** | Low (<2.5) | Most common |
| **Cardiac ascites** | High (>2.5) | JVP elevated |
| **Budd-Chiari** | High (>2.5) | Hepatic vein thrombus |
| **Portal vein thrombosis** | Low | Normal liver |

---

## Management

### Grade Classification

| Grade | Description | Treatment |
|-------|-------------|-----------|
| **Grade 1** | Mild, only on ultrasound | Sodium restriction |
| **Grade 2** | Moderate, visible distension | + Diuretics |
| **Grade 3** | Large, tense | + Large volume paracentesis |

### Sodium Restriction

- **Target**: 2g sodium/day (88 mmol)
- Educate patient on hidden sodium
- Monitor 24-hour urine sodium (goal >78 mmol/day)

### Diuretic Therapy

**Start with combination therapy:**

| Drug | Dose | Ratio | Mechanism |
|------|------|-------|-----------|
| **Spironolactone** | 100mg daily | 100:40 | Aldosterone antagonist |
| **Furosemide** | 40mg daily | | Loop diuretic |

**Titration:**
- Maintain 100:40 ratio
- Maximum: Spironolactone 400mg + Furosemide 160mg
- Target weight loss: 0.5 kg/day (no edema) or 1 kg/day (with edema)

**Monitoring:**
- Daily weights
- Serum creatinine, electrolytes
- Watch for hyponatremia, hyperkalemia, AKI

---

## Refractory Ascites

### Definition

- Diuretic-resistant: No response to max diuretics + sodium restriction
- Diuretic-intractable: Cannot use diuretics due to complications

### Management Options

| Option | Description |
|--------|-------------|
| **Serial LVP** | Every 2-4 weeks + albumin replacement |
| **TIPS** | Reduces portal pressure, may worsen HE |
| **Liver transplant** | Definitive treatment |

### Large Volume Paracentesis (LVP)

**Technique:**
- Ultrasound guidance recommended
- Left lower quadrant preferred (avoids liver, spleen)
- Use 15-17 gauge needle or catheter

**Albumin replacement:**
- If >5L removed: Give **6-8g albumin per liter** removed
- Prevents post-paracentesis circulatory dysfunction

> 📝 **Exam Tip**: Albumin replacement is ESSENTIAL after removing >5L of ascites - reduces renal impairment and mortality
`
    },
    {
      id: 'sbp',
      title: 'Spontaneous Bacterial Peritonitis',
      depth: 'mbbs',
      icon: '🦠',
      content: `
## Definition

**SBP** = Infection of ascitic fluid WITHOUT a surgically treatable intra-abdominal source

> Medical emergency - mortality 30-50% if untreated

---

## Pathophysiology

\`\`\`
Gut Bacteria (usually gram-negative)
        ↓
Bacterial Translocation (impaired gut barrier)
        ↓
Bacteremia
        ↓
Colonization of Ascitic Fluid
        ↓
SBP
\`\`\`

### Risk Factors

| Factor | Mechanism |
|--------|-----------|
| **Low ascitic protein (<1.5 g/dL)** | Poor opsonization |
| **Prior SBP episode** | Recurrence rate 70%/year |
| **GI bleeding** | Increased translocation |
| **Advanced cirrhosis** | Impaired immunity |
| **PPI use** | May increase risk |

---

## Microbiology

### Common Organisms

| Organism | Frequency |
|----------|-----------|
| **E. coli** | 40% |
| **Klebsiella** | 15% |
| **Streptococcus pneumoniae** | 10% |
| **Other streptococci** | 10% |
| **Enterococcus** | 5% |

> 💎 **Clinical Pearl**: SBP is usually MONOMICROBIAL. Polymicrobial infection suggests secondary peritonitis (surgical cause)

---

## Clinical Features

### Presentation

\`\`\`
Classic:
  - Fever
  - Abdominal pain/tenderness
  - Altered mental status (HE)

Often subtle:
  - Worsening ascites
  - Unexplained renal failure
  - New or worsening encephalopathy
  - Ileus
\`\`\`

> ⚠️ **Warning**: Absence of fever/pain does NOT exclude SBP - have low threshold for paracentesis!

---

## Diagnosis

### Diagnostic Criteria

> **Ascitic fluid PMN count ≥250 cells/mm³** = SBP (treat empirically)

### Ascitic Fluid Analysis

| Finding | Interpretation |
|---------|----------------|
| **PMN ≥250/mm³** | SBP - treat! |
| **Positive culture + PMN <250** | Bacterascites (may resolve or progress) |
| **PMN ≥250 + Negative culture** | Culture-negative neutrocytic ascites (treat as SBP) |

### Differentiating SBP from Secondary Peritonitis

| Parameter | SBP | Secondary Peritonitis |
|-----------|-----|----------------------|
| **Organisms** | Monomicrobial | Polymicrobial |
| **Glucose** | >50 mg/dL | <50 mg/dL |
| **Protein** | <1 g/dL | >1 g/dL |
| **LDH** | <ULN serum | >ULN serum |

**Runyon's Criteria for Secondary Peritonitis:**
At least 2 of:
- Total protein >1 g/dL
- Glucose <50 mg/dL
- LDH > upper limit of serum normal

> If secondary peritonitis suspected → CT scan, surgical consultation

---

## Management

### Empiric Antibiotic Therapy

**First-line:**
- **Cefotaxime 2g IV q8h** (or Ceftriaxone 1-2g daily)
- Duration: **5 days**

**Alternatives:**
- Fluoroquinolone (if not on prophylaxis)
- Piperacillin-tazobactam (if nosocomial)

### Albumin Administration

**Give IV albumin:**
- 1.5 g/kg on Day 1
- 1 g/kg on Day 3

> 💎 **Clinical Pearl**: Albumin reduces hepatorenal syndrome and mortality in SBP - this is level 1A evidence!

### Follow-up Paracentesis

- Repeat at 48 hours if:
  - Atypical organism
  - Not improving clinically
  - Secondary peritonitis concern
- Expect ≥25% decrease in PMN count

---

## Prophylaxis

### Indications for SBP Prophylaxis

| Indication | Regimen | Duration |
|------------|---------|----------|
| **Prior SBP** | Norfloxacin 400mg daily or TMP-SMX | Lifelong |
| **GI bleeding** | Ceftriaxone 1g IV × 7 days | During bleed |
| **Low protein ascites (<1.5) + high risk** | Norfloxacin 400mg daily | Long-term |

**High-risk for primary prophylaxis:**
- Ascitic protein <1.5 g/dL PLUS
- Child-Pugh ≥9 with bilirubin ≥3 OR
- Creatinine ≥1.2, BUN ≥25, or Na ≤130

> 📝 **Exam Tip**: Prophylaxis after GI bleeding is mandatory - Ceftriaxone 1g daily × 7 days reduces infections by 50%
`
    },
    {
      id: 'hepatic-encephalopathy',
      title: 'Hepatic Encephalopathy',
      depth: 'mbbs',
      icon: '🧠',
      content: `
## Definition

**Hepatic Encephalopathy (HE)** = Spectrum of neuropsychiatric abnormalities in patients with liver dysfunction

> 📚 **Source:** Sleisenger 11th Ed, Ch.94: Hepatic Encephalopathy

---

## Classification

### By Underlying Disease

| Type | Description |
|------|-------------|
| **Type A** | Acute liver failure |
| **Type B** | Porto-systemic Bypass (shunts without liver disease) |
| **Type C** | Cirrhosis ± porto-systemic shunts |

### By Clinical Course

| Category | Description |
|----------|-------------|
| **Episodic** | Single or recurrent episodes |
| **Persistent** | Continuous neurological deficits |
| **Minimal (Covert)** | Abnormal psychometric tests, normal exam |

---

## Pathophysiology

### Ammonia Hypothesis

\`\`\`
Protein metabolism / GI bleeding / Constipation
        ↓
↑ Gut Ammonia Production
        ↓
Impaired Hepatic Metabolism (liver failure)
        +
Porto-systemic Shunting
        ↓
↑ Systemic Ammonia
        ↓
Crosses Blood-Brain Barrier
        ↓
Astrocyte Swelling (osmotic stress)
        ↓
Cerebral Edema + Neurological Dysfunction
\`\`\`

### Other Contributing Factors

| Factor | Mechanism |
|--------|-----------|
| **Manganese** | Deposits in basal ganglia |
| **Inflammation** | Cytokines impair BBB |
| **GABAergic tone** | Increased inhibition |
| **Benzodiazepine-like compounds** | Endogenous sedation |
| **Oxidative stress** | Neuronal damage |

---

## Precipitating Factors

### Mnemonic: "HEPATICS"

| Letter | Factor |
|--------|--------|
| **H** | Hemorrhage (GI bleeding) |
| **E** | Electrolyte imbalance (hypokalemia, hyponatremia) |
| **P** | Protein excess (dietary) |
| **A** | Azotemia (renal failure) |
| **T** | Tranquilizers/sedatives |
| **I** | Infection (SBP, UTI, pneumonia) |
| **C** | Constipation |
| **S** | Surgery, shunts (TIPS) |

> 💎 **Clinical Pearl**: Always search for a precipitant - treating it is key to managing the episode!

---

## Clinical Features

### West Haven Criteria

| Grade | Consciousness | Cognition | Behavior | Asterixis |
|-------|--------------|-----------|----------|-----------|
| **0 (Minimal)** | Normal | Abnormal psychometrics | Normal | Absent |
| **1** | Mild confusion | Shortened attention | Euphoria/anxiety | Mild |
| **2** | Lethargy | Disorientation to time | Personality changes | Present |
| **3** | Somnolent but arousable | Disorientation to place | Bizarre behavior | Present |
| **4** | Coma | None | None | Absent |

### Clinical Signs

| Sign | Description |
|------|-------------|
| **Asterixis** | "Flapping tremor" - extended wrists |
| **Fetor hepaticus** | Sweet, musty breath odor |
| **Hyperreflexia** | Early; later hyporeflexia |
| **Rigidity** | Cogwheel or paratonic |
| **Babinski sign** | May be positive |

> 📝 **Exam Tip**: Asterixis is NOT specific to HE - also seen in uremia, CO2 narcosis

---

## Diagnosis

### Clinical Diagnosis

- Based on clinical features + liver disease + exclusion of other causes
- No single diagnostic test

### Tests

| Test | Purpose |
|------|---------|
| **Ammonia level** | Supportive but not required for diagnosis |
| **Psychometric tests** | Minimal HE (PHES, Stroop) |
| **EEG** | Triphasic waves (non-specific) |
| **CT/MRI brain** | Exclude other causes |

### Ammonia Interpretation

> ⚠️ **Warning**: Ammonia correlates poorly with grade. Do NOT rely solely on ammonia!

- Sample on ice, analyze immediately
- Elevated in most HE but normal doesn't exclude
- Serial levels not recommended

---

## Management

### Acute Episode

\`\`\`
1. Identify and treat precipitant
   - Infection (cultures, antibiotics)
   - GI bleeding (endoscopy)
   - Electrolytes (correct)
   - Constipation (lactulose)

2. Start lactulose
   - 25-30 mL q1-2h until bowel movement
   - Then titrate to 2-3 soft stools/day

3. If no improvement in 48h:
   - Add rifaximin 550mg BID

4. Supportive care
   - Protect airway (Grade 3-4)
   - Nutrition (adequate protein!)
   - Avoid sedatives
\`\`\`

### Lactulose

**Mechanism:**
- Osmotic laxative → traps NH4+ in gut
- Acidifies colonic content
- Alters gut flora

**Dosing:**
- 25 mL (15-30 mL) q1-2h until bowel movement
- Maintenance: 15-30 mL 2-3× daily
- Target: 2-3 soft stools/day
- Can give rectally if unable to take oral

### Rifaximin

**Mechanism:**
- Non-absorbable antibiotic
- Reduces ammonia-producing bacteria

**Dosing:**
- 550 mg BID

**Indication:**
- Add to lactulose for recurrent HE (≥2 episodes)
- Reduces recurrence by 50%

---

## Prevention

### Secondary Prophylaxis

| Therapy | Dose | Notes |
|---------|------|-------|
| **Lactulose** | 15-30 mL 2-3×/day | First-line |
| **Rifaximin** | 550 mg BID | Add for recurrent HE |

### Nutrition

- **Do NOT restrict protein** (causes sarcopenia, worsens outcomes)
- Target: 1.2-1.5 g/kg/day protein
- Small, frequent meals
- Consider branched-chain amino acids if intolerant

> 💎 **Clinical Pearl**: Protein restriction is HARMFUL and outdated - sarcopenia is a major problem in cirrhosis!
`
    },
    {
      id: 'hrs',
      title: 'Hepatorenal Syndrome',
      depth: 'pg',
      icon: '🫘',
      content: `
## Definition

**Hepatorenal Syndrome (HRS)** = Functional renal failure in advanced cirrhosis, in the ABSENCE of intrinsic kidney disease

> Most severe manifestation of circulatory dysfunction in cirrhosis

---

## Pathophysiology

\`\`\`
Advanced Cirrhosis + Portal Hypertension
        ↓
Splanchnic Vasodilation (NO, other vasodilators)
        ↓
↓ Effective Arterial Blood Volume
        ↓
Maximal Activation of:
  - Renin-Angiotensin-Aldosterone System
  - Sympathetic Nervous System
  - ADH
        ↓
Renal Vasoconstriction (despite high systemic vasoconstriction)
        ↓
↓ Renal Blood Flow → ↓ GFR
        ↓
HRS
\`\`\`

> 💎 **Clinical Pearl**: The kidneys are structurally normal - HRS reverses with liver transplant!

---

## Classification (Updated 2023)

### HRS-AKI (formerly Type 1)

- Acute deterioration in renal function
- Often precipitated by SBP, bleeding, other insult
- Criteria: AKI (creatinine ↑ ≥0.3 mg/dL within 48h OR ≥50% within 7 days)
- Poor prognosis without treatment

### HRS-NAKI (formerly Type 2)

- Stable or slowly progressive renal dysfunction
- Typically with refractory ascites
- eGFR <60 mL/min/1.73m² for ≥3 months
- Better short-term prognosis

---

## Diagnosis

### Diagnostic Criteria (ICA-AKI)

\`\`\`
1. Cirrhosis with ascites

2. AKI according to ICA-AKI criteria:
   - ↑ Creatinine ≥0.3 mg/dL within 48 hours, OR
   - ↑ Creatinine ≥50% from baseline within 7 days

3. No response to:
   - Diuretic withdrawal (48 hours)
   - Albumin challenge (1 g/kg × 2 days)

4. Absence of:
   - Shock
   - Nephrotoxic drugs
   - Structural kidney disease (proteinuria <500 mg/d, normal ultrasound)
\`\`\`

### Differential Diagnosis of AKI in Cirrhosis

| Type | Cause | Features |
|------|-------|----------|
| **Pre-renal** | Hypovolemia, over-diuresis | Responds to fluids |
| **HRS** | Functional vasoconstriction | No response to albumin |
| **ATN** | Sepsis, prolonged hypotension | Granular casts, slow recovery |
| **Drug-induced** | NSAIDs, aminoglycosides | History, timing |
| **GN** | HBV/HCV-associated | Proteinuria, active sediment |

---

## Management

### Initial Steps (All AKI in Cirrhosis)

\`\`\`
1. Stop diuretics and nephrotoxins

2. Expand volume:
   - Albumin 1 g/kg/day × 2 days (max 100g/day)

3. Assess response at 48 hours:
   - If creatinine improves → Pre-renal
   - If no improvement → Likely HRS
\`\`\`

### Specific HRS-AKI Treatment

**First-line: Vasoconstrictors + Albumin**

| Regimen | Drug | Dose |
|---------|------|------|
| **Preferred** | Terlipressin | 1 mg IV q4-6h, may increase to 2 mg q4-6h |
| **Alternative** | Norepinephrine | 0.5-3 mg/hr (requires ICU) |
| **Alternative** | Midodrine + Octreotide | Midodrine 7.5-15mg TID + Octreotide 100-200μg TID |

**Plus:**
- Albumin 20-40g/day throughout treatment

**Goal:**
- Creatinine decrease to <1.5 mg/dL
- Treatment for up to 14 days

> 💎 **Clinical Pearl**: Terlipressin was FDA-approved in 2022 - first proven therapy for HRS-AKI!

### TIPS

- May be considered in selected patients
- Improves renal function in some
- Risk of worsening HE

### Liver Transplantation

- **ONLY definitive treatment**
- HRS reverses after transplant
- Consider simultaneous liver-kidney transplant if:
  - Dialysis >4 weeks
  - eGFR ≤25 for ≥4 weeks
  - Sustained AKI ≥4 weeks

---

## Prognosis

| Type | Median Survival (Untreated) |
|------|----------------------------|
| **HRS-AKI** | ~2 weeks |
| **HRS-NAKI** | ~6 months |

### Predictors of Poor Outcome

- Higher baseline creatinine
- Lack of response to vasoconstrictors
- Higher MELD score
- Presence of infection
`
    },
    {
      id: 'prognosis-scoring',
      title: 'Prognosis & Scoring Systems',
      depth: 'pg',
      icon: '📊',
      content: `
## Child-Pugh Score

### Components (Mnemonic: "ABCDE")

| Parameter | 1 Point | 2 Points | 3 Points |
|-----------|---------|----------|----------|
| **A**lbumin (g/dL) | >3.5 | 2.8-3.5 | <2.8 |
| **B**ilirubin (mg/dL) | <2 | 2-3 | >3 |
| **C**oagulation (INR) | <1.7 | 1.7-2.3 | >2.3 |
| **D**istension (Ascites) | None | Mild | Moderate-severe |
| **E**ncephalopathy | None | Grade 1-2 | Grade 3-4 |

### Classification

| Class | Score | 1-Year Survival | 2-Year Survival |
|-------|-------|-----------------|-----------------|
| **A** | 5-6 | 100% | 85% |
| **B** | 7-9 | 80% | 60% |
| **C** | 10-15 | 45% | 35% |

> 💎 **Clinical Pearl**: Child-Pugh used for surgical risk assessment and general prognosis

---

## MELD Score

### Formula

\`\`\`
MELD = 3.78 × ln(Bilirubin mg/dL) + 11.2 × ln(INR) + 9.57 × ln(Creatinine mg/dL) + 6.43
\`\`\`

(Maximum Cr = 4.0; if on dialysis, Cr = 4.0; minimum values = 1)

### MELD-Na

\`\`\`
MELD-Na = MELD + 1.32 × (137 - Na) - 0.033 × MELD × (137 - Na)
\`\`\`

(Na limits: 125-137 mEq/L)

### 3-Month Mortality

| MELD Score | Mortality |
|------------|-----------|
| <9 | 1.9% |
| 10-19 | 6% |
| 20-29 | 20% |
| 30-39 | 53% |
| ≥40 | 71% |

> 📝 **Exam Tip**: MELD is used for liver transplant allocation - higher score = higher priority

---

## MELD 3.0 (2022 Update)

### New Variables

- Includes **sex** (female = 1.33 points)
- Includes **albumin** (capped at 1.5-3.5)
- Better predicts mortality, especially in women

### Formula

\`\`\`
MELD 3.0 = 1.33 (if female) + 4.56 × ln(Bilirubin) + 0.82 × (137 - Na)
           - 0.24 × (137 - Na) × ln(Bilirubin) + 9.09 × ln(INR)
           + 11.14 × ln(Creatinine) + 1.85 × (3.5 - Albumin)
           - 1.83 × (3.5 - Albumin) × ln(Creatinine) + 7.33
\`\`\`

---

## CLIF-SOFA Score (for ACLF)

### Acute-on-Chronic Liver Failure (ACLF)

**Definition:** Acute deterioration of liver function in chronic liver disease with organ failure(s)

### CLIF-SOFA Assesses 6 Organ Systems

| Organ | Parameters |
|-------|------------|
| **Liver** | Bilirubin |
| **Kidney** | Creatinine |
| **Brain** | Encephalopathy grade |
| **Coagulation** | INR |
| **Circulation** | MAP, vasopressors |
| **Respiratory** | PaO2/FiO2 or SpO2/FiO2 |

### ACLF Grades

| Grade | Organ Failures | 28-Day Mortality |
|-------|----------------|------------------|
| **No ACLF** | 0 (or 1 non-kidney) | 5% |
| **ACLF-1** | Single kidney OR other + mild renal | 22% |
| **ACLF-2** | 2 organ failures | 32% |
| **ACLF-3** | ≥3 organ failures | 77% |

---

## Liver Transplant Indications

### Acute Liver Failure

- King's College Criteria
- Clichy Criteria

### Chronic Liver Disease

- Decompensation (ascites, variceal bleeding, HE, HRS)
- MELD ≥15 (consider listing)
- HCC within Milan criteria
- Severe quality of life impairment

### Milan Criteria (for HCC)

| Parameter | Criteria |
|-----------|----------|
| **Single tumor** | ≤5 cm |
| **Multiple tumors** | ≤3 tumors, each ≤3 cm |
| **No vascular invasion** | Required |
| **No extrahepatic spread** | Required |

> 💎 **Clinical Pearl**: Within Milan = eligible for transplant; 5-year survival ~70%
`
    },
    {
      id: 'advanced-topics',
      title: 'Advanced Topics',
      depth: 'superSpecialty',
      icon: '🎓',
      content: `
## Hepatopulmonary Syndrome (HPS)

### Definition

Triad of:
1. Chronic liver disease
2. Intrapulmonary vascular dilatation
3. Impaired oxygenation (A-a gradient ≥15 mmHg)

### Pathophysiology

\`\`\`
Cirrhosis → ↑ Pulmonary NO
        ↓
Pulmonary Vasodilation
        ↓
Right-to-Left Shunting
        ↓
V/Q Mismatch, Hypoxemia
\`\`\`

### Clinical Features

- Dyspnea (especially upright - platypnea)
- Hypoxemia worse when upright (orthodeoxia)
- Spider angiomata, clubbing, cyanosis

### Diagnosis

- **Contrast echocardiography** (agitated saline)
- Delayed appearance of bubbles in left heart (>3 cardiac cycles)

### Treatment

- **Liver transplantation** (only effective treatment)
- Supplemental oxygen
- HPS typically improves/resolves after transplant

---

## Portopulmonary Hypertension (POPH)

### Definition

- Mean pulmonary arterial pressure (mPAP) >20 mmHg
- Pulmonary vascular resistance (PVR) >3 Wood units
- In the setting of portal hypertension

### Difference from HPS

| Feature | HPS | POPH |
|---------|-----|------|
| **Problem** | Vasodilation | Vasoconstriction |
| **Shunting** | Right-to-left | None |
| **Echo** | Bubble passage | Elevated PA pressure |
| **Treatment** | Transplant | Pulmonary vasodilators |

### Transplant Considerations

| mPAP | Transplant Eligibility |
|------|------------------------|
| <35 mmHg | Eligible |
| 35-50 mmHg | Eligible with treatment if PVR normalized |
| >50 mmHg | Contraindicated |

---

## Sarcopenia in Cirrhosis

### Importance

- Present in 40-70% of cirrhotics
- Independent predictor of mortality
- Associated with worse HE, infections, outcomes

### Assessment

- CT at L3 level (skeletal muscle index)
- Handgrip strength
- Chair stand test

### Management

- Adequate protein (1.2-1.5 g/kg/day)
- BCAA supplementation
- Exercise (resistance training)
- Late evening snack

---

## Hepatocellular Carcinoma Surveillance

### Who to Screen

- All cirrhosis patients
- Chronic HBV (even without cirrhosis if high risk)

### Screening Protocol

- **Ultrasound every 6 months**
- With or without AFP
- CT/MRI for follow-up of suspicious lesions

### LI-RADS Classification

| Category | Description | Management |
|----------|-------------|------------|
| **LR-1** | Definitely benign | Routine surveillance |
| **LR-2** | Probably benign | Continue surveillance |
| **LR-3** | Intermediate | Follow-up imaging |
| **LR-4** | Probably HCC | Multidisciplinary discussion |
| **LR-5** | Definitely HCC | Treat |
| **LR-M** | Probably malignant, not HCC-specific | Biopsy |

---

## Key Exam Points Summary

| Topic | Key Point |
|-------|-----------|
| **HVPG** | ≥10 = Clinically significant, ≥12 = Bleeding risk |
| **NSBBs** | Reduce portal pressure ~20%, first-line prophylaxis |
| **SAAG** | ≥1.1 = Portal hypertension (97% accuracy) |
| **SBP** | PMN ≥250 = Treat; Albumin reduces mortality |
| **HE treatment** | Lactulose + find precipitant |
| **Protein** | Do NOT restrict - 1.2-1.5 g/kg/day |
| **HRS** | Terlipressin + albumin; transplant is cure |
| **Child-Pugh** | ABCDE mnemonic; surgical risk |
| **MELD** | Transplant allocation; 3 variables |
| **HCC screening** | US every 6 months in all cirrhotics |
`
    }
  ],

  keyPoints: [
    "Cirrhosis = diffuse fibrosis + regenerative nodules + vascular distortion",
    "Portal HTN is clinically significant at HVPG ≥10 mmHg, bleeding risk at ≥12 mmHg",
    "SAAG ≥1.1 indicates portal hypertension with 97% accuracy",
    "SBP: PMN ≥250/mm³ = treat empirically; albumin reduces mortality",
    "HE: Always find precipitant; lactulose first-line; do NOT restrict protein",
    "HRS: Terlipressin + albumin; liver transplant is the only cure",
    "Child-Pugh (ABCDE) for prognosis; MELD for transplant allocation",
  ],

  mnemonics: [
    {
      title: "Cirrhosis Causes: HEPATIC",
      content: `**H** - Hepatitis B & C
**E** - EtOH (Alcohol)
**P** - Primary biliary cholangitis
**A** - Autoimmune hepatitis
**T** - Toxins & drugs
**I** - Iron (Hemochromatosis)
**C** - Cryptogenic / MASH`,
    },
    {
      title: "Child-Pugh Score: ABCDE",
      content: `**A** - Albumin
**B** - Bilirubin
**C** - Coagulation (INR)
**D** - Distension (Ascites)
**E** - Encephalopathy

*Each scored 1-3; Total 5-15*`,
    },
    {
      title: "HE Precipitants: HEPATICS",
      content: `**H** - Hemorrhage (GI bleeding)
**E** - Electrolyte imbalance
**P** - Protein excess
**A** - Azotemia (renal failure)
**T** - Tranquilizers/sedatives
**I** - Infection (SBP, UTI)
**C** - Constipation
**S** - Surgery, Shunts (TIPS)`,
    },
    {
      title: "Stigmata of CLD: ABCDEFGHIJ",
      content: `**A** - Asterixis
**B** - Bruising
**C** - Clubbing, Caput medusae
**D** - Dupuytren's
**E** - Encephalopathy, Edema
**F** - Fetor hepaticus
**G** - Gynecomastia
**H** - Hepatomegaly
**I** - Icterus
**J** - Jaundice`,
    },
  ],

  clinicalPearls: [
    "Antibiotics in variceal bleeding reduce mortality - as important as endoscopy!",
    "Albumin replacement after LVP >5L prevents circulatory dysfunction and reduces mortality",
    "Always look for SBP in cirrhosis with fever, pain, encephalopathy, or unexplained deterioration",
    "Albumin in SBP (1.5 g/kg day 1, 1 g/kg day 3) reduces HRS and mortality",
    "Protein restriction in HE is HARMFUL - causes sarcopenia, worsens outcomes",
    "Terlipressin was FDA-approved in 2022 - first proven therapy for HRS",
    "MELD 3.0 includes sex and albumin - better predicts mortality, especially in women",
  ],

  examTips: [
    "SAAG ≥1.1 = portal hypertension (replaces transudate/exudate classification)",
    "SBP is monomicrobial; polymicrobial = suspect secondary (surgical) peritonitis",
    "Ammonia levels correlate poorly with HE grade - don't rely on them for diagnosis",
    "Lactulose target: 2-3 soft stools/day (not loose stools!)",
    "Rifaximin added to lactulose for RECURRENT HE (≥2 episodes)",
    "Child-Pugh is for surgical risk; MELD is for transplant listing",
    "Milan criteria for HCC transplant: Single ≤5cm OR up to 3 nodules each ≤3cm",
  ],
};
