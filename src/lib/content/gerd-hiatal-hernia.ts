/**
 * GERD & Hiatal Hernia - Full Medical Content
 * 
 * Comprehensive content covering:
 * - GERD pathophysiology and management
 * - Hiatal hernia types and treatment
 * - Anti-reflux surgery
 */

export const GERD_HIATAL_HERNIA_CONTENT = {
  id: 'surg-gi-gerd',
  name: 'GERD & Hiatal Hernia',
  
  concepts: [
    {
      id: 'pathophysiology',
      title: 'GERD Pathophysiology',
      depth: 'mbbs',
      icon: '🔬',
      content: `
## Definition

**Gastroesophageal Reflux Disease (GERD)** is the retrograde movement of gastric contents into the esophagus causing symptoms and/or mucosal damage.

> 💎 **Key Point**: Occasional reflux is physiological. GERD is diagnosed when reflux causes symptoms ≥2 times/week or complications.

---

## Anti-Reflux Mechanisms

The **lower esophageal sphincter (LES)** is a physiological (not anatomical) sphincter.

### Components of the Anti-Reflux Barrier

| Component | Contribution |
|-----------|--------------|
| **Intrinsic LES tone** | 15-30 mmHg resting pressure |
| **Crural diaphragm** | External compression during inspiration |
| **Intra-abdominal esophagus** | Positive pressure transmission |
| **Angle of His** | Acute angle creates flap valve |
| **Phrenoesophageal ligament** | Anchors esophagus to diaphragm |
| **Mucosal rosette** | Creates mucosal seal |

---

## Pathophysiology

### Primary Mechanisms of GERD

\`\`\`
1. Transient LES Relaxations (TLESRs) - MOST COMMON (65-70%)
   ↓
   Not associated with swallowing
   Triggered by gastric distension
   Duration: 10-60 seconds

2. Low Resting LES Pressure (<10 mmHg)
   ↓
   Seen in severe GERD, scleroderma

3. Anatomic Disruption (Hiatal Hernia)
   ↓
   LES displaced above diaphragm
   Loss of crural support
\`\`\`

> 📝 **EXAM TIP**: TLESRs (NOT low LES pressure) are the main mechanism of GERD

### Factors Affecting LES Pressure

| ↓ LES Pressure (Promote Reflux) | ↑ LES Pressure (Protective) |
|---------------------------------|-----------------------------|
| Chocolate, coffee, alcohol | Protein meal |
| Fat, mint, smoking | Gastrin |
| Secretin, CCK, VIP, glucagon | Motilin |
| Nitrates, CCBs, anticholinergics | Metoclopramide |
| Pregnancy, obesity | Alpha-agonists |

---

## Risk Factors

| Factor | Mechanism |
|--------|-----------|
| **Obesity** | Increased intra-abdominal pressure, hiatal hernia |
| **Pregnancy** | Hormonal + mechanical |
| **Hiatal hernia** | Loss of LES support |
| **Smoking** | Reduces LES pressure, reduces salivation |
| **Delayed gastric emptying** | Prolonged acid exposure |
| **Connective tissue disorders** | Scleroderma, CREST |

---

## Mucosal Defense Mechanisms

### Pre-epithelial
- Mucus layer
- Bicarbonate secretion
- Salivary neutralization (7 mL/min)

### Epithelial
- Tight junctions
- Cell membrane impermeability
- Intracellular buffers

### Post-epithelial
- Blood flow (removes H+)
- Tissue buffers

> 💎 **Clinical Pearl**: Reduced salivation (xerostomia, sleep) worsens nocturnal reflux
`
    },
    {
      id: 'clinical-features',
      title: 'Clinical Presentation',
      depth: 'mbbs',
      icon: '🩺',
      content: `
## Typical Symptoms

### Classic Triad
1. **Heartburn** (pyrosis) - Retrosternal burning, worse after meals
2. **Regurgitation** - Effortless return of gastric contents
3. **Dysphagia** - Suggests complication (stricture, cancer)

> 📝 **EXAM TIP**: Heartburn + regurgitation = 90% specific for GERD

### Symptom Characteristics

| Symptom | Features |
|---------|----------|
| **Heartburn** | Postprandial, worse lying down, relieved by antacids |
| **Regurgitation** | Bitter/sour taste, especially at night |
| **Dysphagia** | Progressive = stricture; Intermittent = ring |
| **Odynophagia** | Pain on swallowing = severe esophagitis |
| **Water brash** | Sudden salivation (reflex response to acid) |

---

## Atypical/Extra-esophageal Symptoms

### Respiratory (Pulmonary GERD)
- Chronic cough (especially nocturnal)
- Asthma (reflux-induced bronchospasm)
- Recurrent pneumonia (aspiration)
- Pulmonary fibrosis

### ENT (Laryngopharyngeal Reflux - LPR)
- Hoarseness
- Chronic laryngitis
- Globus sensation
- Throat clearing

### Dental
- Dental erosions (posterior teeth)
- Halitosis

### Cardiac-like
- Non-cardiac chest pain
- May mimic angina

> ⚠️ **Warning**: Always rule out cardiac causes before attributing chest pain to GERD

---

## Alarm Features (Red Flags)

Immediate investigation required:

| Alarm Feature | Concern |
|---------------|---------|
| **Dysphagia** | Stricture, malignancy |
| **Weight loss** | Malignancy |
| **GI bleeding/Anemia** | Erosive disease, Barrett's, cancer |
| **Age >55 with new symptoms** | Higher cancer risk |
| **Odynophagia** | Severe esophagitis, ulceration |
| **Persistent vomiting** | Obstruction |
| **Palpable mass** | Malignancy |

> 💎 **Clinical Pearl**: Any alarm feature = urgent endoscopy (do not start PPI first)

---

## GERD Phenotypes

| Phenotype | Features | Management |
|-----------|----------|------------|
| **NERD** (Non-erosive) | Symptoms, normal EGD | PPI, lifestyle |
| **ERD** (Erosive) | Mucosal breaks on EGD | PPI, may need maintenance |
| **Barrett's** | Intestinal metaplasia | Surveillance, ablation if dysplasia |
| **Stricture** | Progressive dysphagia | Dilation + PPI |

---

## Montreal Classification

### Esophageal Syndromes

**Symptomatic:**
- Typical reflux syndrome
- Reflux chest pain syndrome

**With injury:**
- Reflux esophagitis
- Reflux stricture
- Barrett's esophagus
- Adenocarcinoma

### Extra-esophageal Syndromes

**Established association:**
- Reflux cough
- Reflux laryngitis
- Reflux asthma
- Reflux dental erosions

**Proposed association:**
- Pharyngitis
- Sinusitis
- Idiopathic pulmonary fibrosis
- Recurrent otitis media
`
    },
    {
      id: 'diagnosis',
      title: 'Diagnosis',
      depth: 'mbbs',
      icon: '🔍',
      content: `
## Diagnostic Approach

### Clinical Diagnosis

GERD can be diagnosed clinically if:
- Typical symptoms (heartburn + regurgitation)
- No alarm features
- Response to PPI trial (80% sensitive)

---

## Investigations

### 1. Upper GI Endoscopy (EGD)

**Indications:**
- Alarm features
- Failure of PPI therapy
- Long-standing symptoms (>5 years)
- Age >55 with new symptoms
- Barrett's surveillance

**Findings:**

| Grade | Los Angeles Classification |
|-------|---------------------------|
| **A** | Mucosal breaks <5 mm, not extending between folds |
| **B** | Mucosal breaks >5 mm, not extending between folds |
| **C** | Mucosal breaks extending between folds, <75% circumference |
| **D** | Mucosal breaks involving >75% circumference |

> 📝 **EXAM TIP**: LA Grade A/B = Mild; LA Grade C/D = Severe (need long-term PPI)

### 2. Ambulatory pH Monitoring (24-hour)

**Gold standard** for diagnosing acid reflux

| Parameter | Abnormal |
|-----------|----------|
| **Total acid exposure time** | >4.2% of 24 hours |
| **DeMeester score** | >14.72 |
| **Number of reflux episodes** | >50/24 hours |
| **Longest reflux episode** | >9.2 minutes |

**Indications:**
- Normal EGD with persistent symptoms
- Pre-operative evaluation for surgery
- Refractory GERD
- Atypical symptoms

### 3. pH-Impedance Monitoring

- Detects **both acid and non-acid reflux**
- Useful when on PPI therapy
- Measures bolus movement

### 4. Esophageal Manometry (High Resolution)

**Role in GERD:**
- Exclude motility disorders (achalasia)
- Pre-operative assessment before fundoplication
- Evaluate failed anti-reflux surgery

> ⚠️ **Note**: Manometry diagnoses motility disorders, NOT GERD

### 5. Barium Swallow

- Shows hiatal hernia
- Demonstrates reflux (if fluoroscopy used)
- Detects strictures
- Not first-line for GERD diagnosis

---

## Diagnostic Algorithm

\`\`\`
Typical GERD symptoms
        ↓
Alarm features present?
        ↓
   YES → Urgent EGD
   NO  → PPI trial (4-8 weeks)
             ↓
        Response?
             ↓
        YES → GERD confirmed, continue/step down
        NO  → EGD + pH monitoring
                    ↓
              Normal pH?
                    ↓
              YES → Functional heartburn
              NO  → Refractory GERD
\`\`\`

---

## PPI Test

- **Dose**: Omeprazole 40 mg or equivalent
- **Duration**: 2-4 weeks
- **Interpretation**: >50% symptom improvement = positive
- **Sensitivity**: 80%
- **Specificity**: 74%

> 💎 **Clinical Pearl**: A negative PPI test makes GERD unlikely but doesn't rule it out completely
`
    },
    {
      id: 'hiatal-hernia',
      title: 'Hiatal Hernia',
      depth: 'mbbs',
      icon: '🫀',
      content: `
## Definition

**Hiatal hernia** is the herniation of abdominal contents (usually stomach) through the esophageal hiatus of the diaphragm into the thorax.

---

## Types of Hiatal Hernia

### Type I - Sliding (95%)

\`\`\`
           ┌─────────────────┐
           │    THORAX       │
           │   ┌─────────┐   │
           │   │ Cardia  │   │  ← GE junction slides up
           │   └─────────┘   │
═══════════════════════════════════ Diaphragm
           │   ┌─────────┐   │
           │   │ Stomach │   │
           │   └─────────┘   │
           └─────────────────┘
\`\`\`

**Features:**
- GE junction above diaphragm
- Most common type
- Associated with GERD
- Usually asymptomatic

### Type II - Paraesophageal/Rolling (Pure)

\`\`\`
           ┌─────────────────┐
           │    THORAX       │
           │   ┌─────────┐   │
           │   │ Fundus  │   │  ← Fundus herniates
           │   └─────────┘   │
═══════════════════════════════════ Diaphragm
      GEJ normal position
\`\`\`

**Features:**
- GE junction remains in normal position
- Fundus herniates alongside esophagus
- Risk of incarceration/strangulation
- Less GERD, more mechanical symptoms

### Type III - Mixed (Most Paraesophageal)

- Combination of Types I and II
- Both GE junction and fundus displaced
- Most common "paraesophageal" in practice

### Type IV - Large Defect

- Contains other organs (colon, spleen, omentum)
- Rare, risk of complications

---

## Clinical Features

### Sliding Hiatal Hernia
- Often asymptomatic
- GERD symptoms (heartburn, regurgitation)
- May cause anemia (Cameron ulcers)

### Paraesophageal Hernia
| Symptom | Mechanism |
|---------|-----------|
| **Dysphagia** | Mechanical compression |
| **Chest pain** | Distension, incarceration |
| **Early satiety** | Reduced stomach capacity |
| **Postprandial fullness** | Gastric stasis |
| **Dyspnea** | Thoracic compression |
| **Anemia** | Cameron lesions (linear erosions) |

### Complications of Paraesophageal Hernia

> ⚠️ **Emergencies requiring urgent surgery:**

| Complication | Features |
|--------------|----------|
| **Incarceration** | Acute chest pain, dysphagia, cannot pass NG tube |
| **Strangulation** | Ischemia → gangrene, sepsis |
| **Volvulus** | Organoaxial rotation → obstruction |
| **Gastric perforation** | Peritonitis, mediastinitis |

---

## Diagnosis

### Imaging

| Modality | Findings |
|----------|----------|
| **Chest X-ray** | Retrocardiac air-fluid level, gastric bubble in chest |
| **Barium swallow** | Best for classification, shows anatomical detail |
| **CT scan** | Defines hernia contents, complications |
| **EGD** | Visualizes GE junction, Cameron lesions |

### Barium Swallow Findings

- **Sliding**: GE junction above B-ring
- **Schatzki ring**: Mucosal ring at squamocolumnar junction
- **B-ring**: Junction of esophagus and stomach

---

## Natural History

**Sliding hernia:**
- Usually stable
- May enlarge slowly
- GERD may worsen

**Paraesophageal hernia:**
- Progressive enlargement
- 30% risk of emergency presentation
- 5-year mortality if emergent surgery needed: 17%

> 💎 **Clinical Pearl**: All symptomatic paraesophageal hernias should be repaired electively to avoid emergency surgery
`
    },
    {
      id: 'management',
      title: 'Medical Management',
      depth: 'mbbs',
      icon: '💊',
      content: `
## Treatment Goals

1. Relieve symptoms
2. Heal esophagitis
3. Prevent complications
4. Maintain remission

---

## Lifestyle Modifications

### Dietary Changes
- Avoid trigger foods (fatty, spicy, acidic)
- Reduce chocolate, coffee, alcohol, mint
- Small frequent meals
- No eating 3 hours before bed

### Positional
- Elevate head of bed (6-8 inches)
- Left lateral position (faster gastric emptying)
- Avoid lying down after meals

### Weight & Habits
- Weight loss (if overweight)
- Smoking cessation
- Avoid tight clothing
- Avoid NSAIDs

> 📝 **EXAM TIP**: Head elevation should be by blocks under bed, NOT extra pillows (causes bending at waist)

---

## Pharmacological Therapy

### Step-Up vs Step-Down Approach

| Approach | Strategy |
|----------|----------|
| **Step-up** | Start with lifestyle + antacids → H2RA → PPI |
| **Step-down** | Start with PPI → reduce to maintenance/on-demand |

Modern practice favors **step-down** for faster symptom relief.

---

### 1. Proton Pump Inhibitors (Gold Standard)

**Mechanism**: Irreversibly inhibit H+/K+-ATPase (proton pump)

| Drug | Dose | Notes |
|------|------|-------|
| **Omeprazole** | 20-40 mg OD | Standard |
| **Esomeprazole** | 20-40 mg OD | S-isomer, slightly better |
| **Pantoprazole** | 40 mg OD | Fewer drug interactions |
| **Rabeprazole** | 20 mg OD | Fastest onset |
| **Lansoprazole** | 30 mg OD | |

**Administration:**
- Take 30-60 minutes before breakfast
- On empty stomach for maximum efficacy

**Duration:**
- Initial: 4-8 weeks
- Maintenance: Long-term if LA Grade C/D or complications

**Side Effects:**
| Short-term | Long-term |
|------------|-----------|
| Headache | Vitamin B12 deficiency |
| Diarrhea | Hypomagnesemia |
| Nausea | Osteoporosis/fractures |
| | C. difficile infection |
| | Pneumonia |
| | Fundic gland polyps |

### 2. H2 Receptor Antagonists

- **Role**: Nocturnal acid control, step-down therapy
- **Examples**: Ranitidine (withdrawn), Famotidine
- **Less effective** than PPIs for healing esophagitis

### 3. Antacids & Alginates

- **Quick symptom relief**
- **Examples**: Gaviscon (alginate), Mg/Al hydroxide
- Adjunct therapy, not maintenance

### 4. Prokinetics

- **Metoclopramide**: D2 antagonist, increases LES pressure
- **Domperidone**: Fewer CNS effects
- **Limited efficacy** as monotherapy

---

## Refractory GERD

**Definition**: Symptoms despite 8 weeks of twice-daily PPI

### Causes of Refractory GERD

| True GERD | Not GERD |
|-----------|----------|
| Non-compliance | Functional heartburn |
| Inadequate dosing | Eosinophilic esophagitis |
| Nocturnal acid breakthrough | Achalasia |
| Weak acid/non-acid reflux | Pill esophagitis |
| Bile reflux | Gastroparesis |

### Management Approach

\`\`\`
Confirm PPI compliance
        ↓
Optimize PPI (30 min before meal, twice daily)
        ↓
EGD + biopsies (rule out EoE, Barrett's)
        ↓
pH-impedance monitoring (off PPI)
        ↓
Abnormal → Consider surgery
Normal → Functional heartburn → Neuromodulators
\`\`\`
`
    },
    {
      id: 'surgery',
      title: 'Surgical Management',
      depth: 'pg',
      icon: '🔪',
      content: `
## Indications for Anti-Reflux Surgery

### Absolute Indications
- Failed medical therapy
- Medication intolerance
- Non-compliance with medications
- Volume regurgitation
- Recurrent aspiration pneumonia
- Large hiatal hernia

### Relative Indications
- Young patient preferring surgery over lifelong PPI
- Alkaline (bile) reflux
- Persistent symptoms despite good acid control
- Barrett's esophagus (controversial)

---

## Pre-operative Evaluation

| Test | Purpose |
|------|---------|
| **EGD** | Confirm GERD, rule out Barrett's, assess esophagitis |
| **Manometry** | Rule out achalasia, assess peristalsis |
| **pH monitoring** | Confirm acid exposure if symptoms atypical |
| **Barium swallow** | Define anatomy, hernia size |
| **Gastric emptying** | If gastroparesis suspected |

> ⚠️ **Contraindication**: Severe esophageal dysmotility (ineffective esophageal motility) → partial fundoplication

---

## Fundoplication

### Nissen Fundoplication (360°) - Gold Standard

**Technique:**
1. Reduce hiatal hernia
2. Crural repair (posterior)
3. Mobilize fundus (short gastrics divided)
4. Wrap fundus 360° around esophagus
5. "Floppy" wrap (over bougie 52-60 Fr)

**Key Points:**
- Wrap should be 2-3 cm long
- Should accommodate one finger alongside esophagus
- "Shoe-shine" maneuver to prevent wrap slippage

### Partial Fundoplications

| Type | Degree | Indication |
|------|--------|------------|
| **Toupet** | 270° posterior | Poor motility, revision |
| **Dor** | 180-200° anterior | After Heller myotomy |
| **Watson** | 120° anterior | Alternative partial wrap |

---

## Laparoscopic vs Open

| Parameter | Laparoscopic | Open |
|-----------|--------------|------|
| **Hospital stay** | 1-2 days | 5-7 days |
| **Recovery** | 2 weeks | 6 weeks |
| **Complications** | Fewer | More |
| **Outcomes** | Equivalent | Equivalent |
| **Conversion rate** | 2-5% | - |

> 💎 **Clinical Pearl**: Laparoscopic Nissen fundoplication is the **gold standard** for anti-reflux surgery

---

## Outcomes

| Parameter | Results |
|-----------|---------|
| **Symptom relief** | 85-95% at 5 years |
| **PPI independence** | 80-90% |
| **Patient satisfaction** | >90% |
| **Durability** | 90% at 10 years |

---

## Complications

### Early

| Complication | Incidence | Management |
|--------------|-----------|------------|
| **Dysphagia** | 10-50% (transient) | Usually resolves in 6 weeks |
| **Gas bloat** | 5-10% | Unable to belch/vomit |
| **Injury (esophagus, spleen, vagus)** | <1% | |
| **Wrap herniation** | <2% | Reoperation |

### Late

| Complication | Features |
|--------------|----------|
| **Wrap failure** | Recurrent reflux |
| **Wrap slippage** | "Slipped Nissen" - dysphagia |
| **Wrap too tight** | Persistent dysphagia |
| **Paraesophageal herniation** | Fundus herniates through hiatus |

---

## Failed Fundoplication

### Causes
- Wrap disruption (45%)
- Herniated wrap (25%)
- Slipped wrap (15%)
- Misplaced wrap (10%)
- Wrong diagnosis (5%)

### Management
- EGD, barium swallow, manometry, pH study
- Reoperation if anatomically correctable
- Consider conversion to partial wrap or RYGB
`
    },
    {
      id: 'complications',
      title: 'Complications of GERD',
      depth: 'pg',
      icon: '⚠️',
      content: `
## Spectrum of GERD Complications

\`\`\`
Reflux Esophagitis
        ↓
Peptic Stricture ← → Barrett's Esophagus
        ↓                     ↓
  Dysphagia           Adenocarcinoma
\`\`\`

---

## 1. Reflux Esophagitis

### Grading (Los Angeles Classification)

| Grade | Description | Prevalence |
|-------|-------------|------------|
| **A** | Mucosal breaks ≤5 mm | 50% |
| **B** | Mucosal breaks >5 mm | 30% |
| **C** | Breaks between folds, <75% | 15% |
| **D** | Breaks >75% circumference | 5% |

### Healing Rates with PPI

| Grade | 8-week healing |
|-------|----------------|
| A-B | 90-95% |
| C-D | 80-85% |

---

## 2. Peptic Stricture

### Features
- Progressive solid food dysphagia
- Usually at GE junction
- Associated with severe reflux, poor PPI compliance
- Length usually <3 cm

### Diagnosis
- Barium swallow: Smooth tapering stricture
- EGD: Pale, fibrous stricture; biopsy to rule out malignancy

### Management

| Treatment | Details |
|-----------|---------|
| **Dilation** | Savary-Gilliard or balloon dilators |
| **PPI** | High-dose, long-term |
| **Repeat dilation** | May need 3-4 sessions |
| **Surgery** | Refractory cases, fundoplication |

> ⚠️ **Always biopsy strictures** to rule out malignancy

---

## 3. Barrett's Esophagus

### Definition
Replacement of normal squamous epithelium with **intestinal-type columnar epithelium** (intestinal metaplasia).

### Diagnostic Criteria
1. Endoscopic evidence of columnar-lined esophagus (CLE)
2. Histologic confirmation of intestinal metaplasia (goblet cells)

### Prague Classification

\`\`\`
C (Circumferential) = Circumferential extent
M (Maximum) = Maximum extent including tongues

Example: C3M5 = 3 cm circumferential, 5 cm maximum
\`\`\`

### Risk of Adenocarcinoma

| Stage | Annual Cancer Risk |
|-------|-------------------|
| No dysplasia | 0.2-0.5% |
| Low-grade dysplasia | 0.5-1% |
| High-grade dysplasia | 6-19% |

### Surveillance

| Finding | Interval |
|---------|----------|
| No dysplasia, <3 cm | Every 5 years |
| No dysplasia, ≥3 cm | Every 3 years |
| Low-grade dysplasia | Every 6-12 months |
| High-grade dysplasia | Endoscopic therapy |

### Treatment of Dysplasia

| Modality | Indication |
|----------|------------|
| **Radiofrequency ablation (RFA)** | Flat dysplasia, standard |
| **Endoscopic mucosal resection (EMR)** | Visible lesions |
| **Cryotherapy** | Alternative ablation |
| **Esophagectomy** | Invasive cancer, failed endotherapy |

---

## 4. Esophageal Adenocarcinoma

### Risk Factors
- Barrett's esophagus (30-40x risk)
- Chronic GERD
- Obesity
- Smoking
- Male sex
- Caucasian

### Clinical Features
- Progressive dysphagia
- Weight loss
- GI bleeding
- Chest pain

### Prognosis
- 5-year survival: 15-20% overall
- Early (T1a): 90% with endoscopic therapy
- Advanced: Poor despite surgery

> 💎 **Clinical Pearl**: Barrett's surveillance aims to detect dysplasia early, when endoscopic therapy can be curative

---

## 5. Extra-esophageal Complications

### Respiratory
| Condition | Association |
|-----------|-------------|
| Chronic cough | Most common |
| Asthma | 50-80% of asthmatics have GERD |
| Aspiration pneumonia | Recurrent episodes |
| Pulmonary fibrosis | Possible link |

### ENT
- Posterior laryngitis
- Vocal cord granulomas
- Subglottic stenosis
- Chronic sinusitis

### Dental
- Erosion of posterior teeth (palatal surfaces)
- Increased caries
`
    },
    {
      id: 'special-topics',
      title: 'Advanced Topics',
      depth: 'superSpecialty',
      icon: '🎓',
      content: `
## Newer Therapies

### Magnetic Sphincter Augmentation (LINX)

**Device**: Ring of magnetic beads placed around LES

**Mechanism**: Augments LES, allows food passage but prevents reflux

**Advantages:**
- Preserves anatomy
- Reversible
- Allows vomiting/belching

**Outcomes:**
- 80-90% symptom improvement
- 50-70% PPI independence

**Complications:**
- Dysphagia (5-10%)
- Device erosion (rare)
- MRI incompatibility (newer devices MRI-conditional)

### Transoral Incisionless Fundoplication (TIF)

**Technique**: Endoscopic creation of wrap using EsophyX device

**Indications:**
- Small hiatal hernia (<2 cm)
- Mild-moderate GERD
- Not suitable for large hernias

**Outcomes:**
- 60-70% PPI reduction
- Less durable than surgical fundoplication

### Stretta Procedure

**Technique**: Radiofrequency energy to LES (increases thickness)

**Limited evidence**, not widely recommended

---

## GERD and Obesity

### Pathophysiology
- Increased intra-abdominal pressure
- Higher incidence of hiatal hernia
- Dietary factors
- Altered esophageal motility

### Surgical Options

| BMI | Recommended Procedure |
|-----|----------------------|
| <35 | Fundoplication ± crural repair |
| 35-40 | Consider RYGB if comorbidities |
| >40 | Roux-en-Y gastric bypass (RYGB) |

> 💎 **Clinical Pearl**: RYGB is the most effective anti-reflux procedure in morbidly obese patients

---

## Large Paraesophageal Hernia Repair

### Surgical Principles

1. **Complete hernia reduction**
2. **Hernia sac excision** (reduces recurrence)
3. **Crural repair** (primary ± mesh)
4. **Fundoplication** (most add Nissen)
5. **Gastropexy** (prevents re-herniation)

### Mesh in Hiatal Hernia Repair

**Indications:**
- Large hernia (>5 cm)
- Weak crura
- Recurrent hernia

**Types:**
- Biologic (preferred at hiatus - lower erosion risk)
- Synthetic (higher recurrence with biologic)

**Controversy**: Mesh erosion into esophagus reported

---

## Endoscopic Management of Refractory Strictures

### Options

| Modality | Indication |
|----------|------------|
| **Serial dilation** | Standard approach |
| **Intralesional steroids** | Refractory to dilation |
| **Mitomycin C** | Prevent re-stenosis |
| **Temporary stents** | Bridge to definitive therapy |
| **Incisional therapy** | Schatzki rings |

---

## Short Esophagus

### Definition
Esophagus shortened due to chronic inflammation, preventing tension-free reduction.

### Recognition
- GE junction >5 cm above hiatus after mobilization
- Suspected if: Large hernia, severe esophagitis, prior surgery

### Management

| Procedure | Technique |
|-----------|-----------|
| **Collis gastroplasty** | Creates neo-esophagus from cardia |
| **Collis-Nissen** | Gastroplasty + fundoplication |
| | Adds 3-4 cm of "esophagus" |

---

## Key Exam Points Summary

| Topic | High-Yield Fact |
|-------|-----------------|
| Main GERD mechanism | TLESRs (not low LES pressure) |
| Gold standard diagnosis | 24-hour pH monitoring |
| Gold standard imaging | EGD (for complications) |
| Gold standard surgery | Laparoscopic Nissen fundoplication |
| Barrett's definition | Intestinal metaplasia with goblet cells |
| Sliding vs Paraesophageal | Sliding = GEJ above; Paraesophageal = fundus alongside |
| Dysmotility + GERD | Partial wrap (Toupet) |
| Obesity + GERD | Consider RYGB if BMI >35-40 |
`
    }
  ],

  keyPoints: [
    "TLESRs (not low LES pressure) are the main mechanism of GERD",
    "Heartburn + regurgitation = 90% specific for GERD",
    "Alarm features warrant urgent endoscopy",
    "PPIs are gold standard; take 30-60 min before meals",
    "Sliding hiatal hernia (95%) vs Paraesophageal (5%)",
    "Barrett's = intestinal metaplasia with goblet cells",
    "Laparoscopic Nissen fundoplication is gold standard surgery",
  ],

  mnemonics: [
    {
      title: "LES Pressure Reducers",
      content: `**"CHOCOLATE makes you FAT and RELAXED"**

- **C**hocolate
- **H**ot/spicy food
- **O**range juice (citrus)
- **C**offee
- **O**nions
- **L**ate meals
- **A**lcohol
- **T**omatoes
- **E**mpty stomach (fasting)

**FAT**: Fatty foods
**RELAXED**: CCBs, nitrates relax LES`,
    },
    {
      title: "GERD Alarm Features",
      content: `**"DWAVOP"**

- **D**ysphagia
- **W**eight loss
- **A**nemia/bleeding
- **V**omiting (persistent)
- **O**dynophagia
- **P**alpable mass

*Any of these = urgent endoscopy*`,
    },
    {
      title: "Hiatal Hernia Types",
      content: `**"1-2-3-4 Rule"**

- **Type 1**: Sliding (GEJ slides up)
- **Type 2**: Rolling/Paraesophageal (fundus rolls up)
- **Type 3**: Mixed (1 + 2)
- **Type 4**: Multi-organ (stomach + colon/spleen)

*"Type 1 = 1 thing moves (GEJ)"*
*"Type 2 = 2 things present (GEJ normal + fundus up)"*`,
    },
  ],

  clinicalPearls: [
    "Nocturnal symptoms suggest more severe GERD (loss of gravity + salivation)",
    "PPI non-response? Check compliance first, then timing (before meals)",
    "All paraesophageal hernias should be repaired electively to avoid emergency",
    "Barrett's surveillance: biopsy 4 quadrants every 2 cm (Seattle protocol)",
    "Dysmotility on manometry → partial fundoplication (not Nissen)",
    "Obese patient with GERD → consider RYGB over fundoplication if BMI >35",
  ],

  examTips: [
    "TLESRs, NOT low LES pressure = main GERD mechanism",
    "LA Grade C/D requires long-term PPI maintenance",
    "Barrett's = intestinal metaplasia (goblet cells), NOT gastric metaplasia",
    "Always biopsy esophageal strictures to rule out cancer",
    "Manometry before fundoplication to rule out achalasia",
    "Paraesophageal hernia emergency = incarceration/strangulation/volvulus",
  ],
};
