/**
 * Esophagus - Anatomy & Physiology
 * 
 * Comprehensive content covering:
 * - Embryology, anatomy, histology
 * - Physiology of swallowing
 * - Clinical correlations
 * - Depth-stratified for MBBS/PG/Super Specialty
 */

export const ESOPHAGUS_ANATOMY_CONTENT = {
  id: 'surg-gi-esophagus-anatomy',
  name: 'Esophagus - Anatomy & Physiology',
  
  concepts: [
    {
      id: 'embryology',
      title: 'Embryology',
      depth: 'mbbs',
      icon: '🧬',
      content: `
## Development

The esophagus develops from the **foregut** during the **4th week** of gestation.

### Timeline of Development

| Week | Event |
|------|-------|
| 4th | Foregut differentiates; respiratory diverticulum appears |
| 4th-5th | Tracheoesophageal septum separates trachea from esophagus |
| 7th-8th | Esophageal epithelium proliferates, lumen obliterates |
| 8th-10th | Recanalization occurs |

> **Clinical Pearl**: Failure of tracheoesophageal septum formation → **Tracheoesophageal fistula (TEF)**

### Congenital Anomalies

| Anomaly | Incidence | Associations |
|---------|-----------|--------------|
| **Esophageal atresia + distal TEF** | 85% of cases | VACTERL association |
| **Isolated esophageal atresia** | 8% | Polyhydramnios |
| **H-type TEF (isolated)** | 4% | Recurrent pneumonia |
| **Esophageal stenosis** | Rare | Tracheobronchial remnants |

### VACTERL Association

\`\`\`
V - Vertebral anomalies
A - Anal atresia
C - Cardiac defects
TE - Tracheoesophageal fistula
R - Renal anomalies
L - Limb defects
\`\`\`

> 💎 **High Yield**: The most common type of esophageal atresia is **proximal atresia with distal TEF** (Type C - Gross classification)
`
    },
    {
      id: 'anatomy',
      title: 'Gross Anatomy',
      depth: 'mbbs',
      icon: '🫀',
      content: `
## Overview

The esophagus is a **muscular tube** extending from the pharynx to the stomach.

### Dimensions

| Parameter | Value |
|-----------|-------|
| **Length** | 25 cm (10 inches) |
| **Cervical** | 5 cm (C6 to T1) |
| **Thoracic** | 20 cm (T1 to T10) |
| **Abdominal** | 1-2 cm (below diaphragm) |
| **Diameter** | 2 cm (collapsed when empty) |

### Beginning & End

- **Begins**: At the lower border of **cricoid cartilage** (C6 vertebra)
- **Ends**: At the **cardia** of stomach (T11 vertebra)

> 📝 **Exam Tip**: Distance from incisor teeth to important landmarks:
> - Cricopharyngeus: **15 cm**
> - Aortic arch: **22 cm**
> - Left main bronchus: **27 cm**
> - Diaphragm: **38 cm**
> - Cardia: **40 cm**

---

## Anatomical Constrictions

The esophagus has **4 anatomical constrictions** - important for foreign body impaction and stricture sites:

| Constriction | Level | Distance from Incisors | Cause |
|--------------|-------|------------------------|-------|
| **1. Cricopharyngeal** | C6 | 15 cm | Cricopharyngeus muscle (UES) |
| **2. Aortic** | T4 | 22 cm | Aortic arch |
| **3. Bronchial** | T5 | 27 cm | Left main bronchus |
| **4. Diaphragmatic** | T10 | 38-40 cm | Diaphragmatic hiatus (LES) |

> 💎 **Clinical Pearl**: Most common site of foreign body impaction = **Cricopharyngeal constriction** (15 cm from incisors)

### Mnemonic: "ABCD"
- **A**t cricopharyngeus (15 cm)
- **B**ronchus - left main (27 cm)
- **C**rossed by aorta (22 cm)
- **D**iaphragm (40 cm)

---

## Course & Relations

### Cervical Esophagus (C6-T1)

| Relation | Structure |
|----------|-----------|
| **Anterior** | Trachea, recurrent laryngeal nerves |
| **Posterior** | Prevertebral fascia, vertebral bodies |
| **Lateral** | Carotid sheath, thyroid lobes |

> ⚠️ **Surgical Note**: Left-sided approach preferred for cervical esophagus (recurrent laryngeal nerve less at risk)

### Thoracic Esophagus

**Superior Mediastinum:**
- Lies between trachea (anterior) and vertebral column (posterior)
- Left recurrent laryngeal nerve in tracheoesophageal groove

**Posterior Mediastinum:**
- Passes behind and to the right of aortic arch
- Descends behind left main bronchus and left atrium
- Crosses from right to left at T7 (behind aorta)

| Level | Anterior Relation | Posterior Relation |
|-------|-------------------|-------------------|
| T4 | Tracheal bifurcation | Thoracic duct |
| T5 | Left main bronchus | Descending aorta |
| T8 | Left atrium | Thoracic duct, azygos vein |

> 💎 **Clinical Pearl**: Left atrial enlargement causes **dysphagia** (posterior impression on barium swallow)

### Abdominal Esophagus

- Passes through **esophageal hiatus** at T10
- Covered by peritoneum anteriorly and on left
- Related to left lobe of liver, left crus of diaphragm

---

## Blood Supply

### Arterial Supply (Segmental)

| Segment | Artery | Origin |
|---------|--------|--------|
| **Cervical** | Inferior thyroid artery | Thyrocervical trunk |
| **Upper thoracic** | Bronchial arteries | Aorta |
| **Lower thoracic** | Esophageal branches | Aorta directly (4-6 branches) |
| **Abdominal** | Left gastric + Left inferior phrenic | Celiac trunk |

> 📝 **Exam Tip**: The esophagus has a **segmental blood supply** with poor anastomoses → vulnerable to ischemia during surgery

### Venous Drainage

| Segment | Vein | Drains To |
|---------|------|-----------|
| **Cervical** | Inferior thyroid veins | Brachiocephalic veins |
| **Thoracic** | Azygos and hemiazygos | SVC (systemic) |
| **Abdominal** | Left gastric vein | Portal vein |

> 💎 **High Yield**: **Porto-systemic anastomosis** at lower esophagus → **Esophageal varices** in portal hypertension

---

## Lymphatic Drainage

The lymphatic drainage is **longitudinal** - cancer can spread far from the primary site.

| Segment | Lymph Nodes |
|---------|-------------|
| **Upper 1/3** | Deep cervical nodes |
| **Middle 1/3** | Posterior mediastinal, tracheobronchial |
| **Lower 1/3** | Left gastric, celiac nodes |

> ⚠️ **Oncologic Importance**: Skip metastases are common - extensive lymphadenectomy needed for esophageal cancer

---

## Nerve Supply

### Extrinsic Innervation

| Component | Origin | Function |
|-----------|--------|----------|
| **Parasympathetic** | Vagus nerve (X) | Motor to muscle, secretomotor |
| **Sympathetic** | T1-T5 via sympathetic chain | Vasoconstriction |

### Vagal Anatomy

\`\`\`
Above carina:
  - Right and left vagus alongside esophagus

Below carina:
  - Form esophageal plexus

At diaphragm:
  - Left vagus → Anterior vagal trunk (anterior surface)
  - Right vagus → Posterior vagal trunk (posterior surface)
\`\`\`

> 📝 **Mnemonic**: "**LARP**" - Left vagus Anterior, Right vagus Posterior

### Intrinsic Innervation (Enteric Nervous System)

- **Auerbach's plexus** (myenteric) - between muscle layers → motility
- **Meissner's plexus** (submucosal) - secretion, blood flow

> 💎 **Clinical Pearl**: Destruction of Auerbach's plexus → **Achalasia**
`
    },
    {
      id: 'histology',
      title: 'Histology',
      depth: 'mbbs',
      icon: '🔬',
      content: `
## Wall Layers

The esophagus has the **typical GI tract layers** but with important differences:

| Layer | Composition | Special Features |
|-------|-------------|------------------|
| **Mucosa** | Stratified squamous epithelium | Non-keratinized, protective |
| **Submucosa** | Loose connective tissue | Esophageal glands (mucus) |
| **Muscularis propria** | Inner circular, outer longitudinal | Striated → Smooth transition |
| **Adventitia** | Connective tissue | NO SEROSA (except abdominal) |

> ⚠️ **High Yield**: The esophagus has **NO SEROSA** in the thorax → early tumor spread, anastomotic leaks more common

---

## Epithelium

### Stratified Squamous Epithelium

- **Non-keratinized** (moist surface)
- **Function**: Protection against abrasion
- **Thickness**: 15-25 cell layers
- **Turnover**: 2-3 weeks

### Z-line (Ora Serrata)

The **squamocolumnar junction** (SCJ) where squamous epithelium meets gastric columnar epithelium.

- **Normal location**: At or just above the gastroesophageal junction
- **Barrett's esophagus**: SCJ migrates proximally (intestinal metaplasia)

> 💎 **Clinical Pearl**: Barrett's esophagus = squamous epithelium replaced by **intestinal-type columnar epithelium** (metaplasia) → premalignant

---

## Muscularis Propria

The muscle composition changes along the length:

| Level | Muscle Type |
|-------|-------------|
| **Upper 1/3** | Striated (skeletal) muscle only |
| **Middle 1/3** | Mixed striated and smooth muscle |
| **Lower 1/3** | Smooth muscle only |

> 📝 **Exam Tip**: This transition explains why swallowing is initially voluntary (striated) then involuntary (smooth)

---

## Glands

### Esophageal Glands Proper (in submucosa)
- **Location**: Throughout esophagus, concentrated in upper and lower parts
- **Type**: Compound tubuloalveolar, mucous
- **Function**: Lubrication, protection

### Esophageal Cardiac Glands (in lamina propria)
- **Location**: Near upper and lower ends
- **Similar to**: Cardiac glands of stomach
- **Function**: Mucus secretion

---

## Microscopic Identification

### Key Features for Histology Exam

\`\`\`
✓ Stratified squamous epithelium (non-keratinized)
✓ Prominent muscularis mucosae
✓ Submucosal glands (esophageal glands proper)
✓ Inner circular + outer longitudinal muscle
✓ NO SEROSA (adventitia instead)
\`\`\`
`
    },
    {
      id: 'sphincters',
      title: 'Esophageal Sphincters',
      depth: 'mbbs',
      icon: '🚪',
      content: `
## Upper Esophageal Sphincter (UES)

### Anatomy

The UES is formed by the **cricopharyngeus muscle** (part of inferior pharyngeal constrictor).

| Property | Details |
|----------|---------|
| **Location** | C5-C6 level |
| **Length** | 2-4 cm |
| **Pressure** | 40-80 mmHg (at rest) |
| **Muscle type** | Striated (skeletal) |
| **Innervation** | Vagus nerve (pharyngeal plexus) |

### Function

- **Tonically contracted** at rest
- Prevents air from entering esophagus
- Prevents reflux into pharynx

### Relaxation

- Relaxes during swallowing
- Opens 0.5-1 second during food passage
- Coordinated with pharyngeal contraction

> 💎 **Clinical Pearl**: **Zenker's diverticulum** (pharyngeal pouch) occurs at **Killian's dehiscence** - a weak area between cricopharyngeus and inferior constrictor

---

## Lower Esophageal Sphincter (LES)

### Anatomy

The LES is a **physiological sphincter** (no distinct anatomical structure).

| Property | Details |
|----------|---------|
| **Location** | T10-T11, at diaphragmatic hiatus |
| **Length** | 2-4 cm |
| **Pressure** | 15-30 mmHg (at rest) |
| **Muscle type** | Smooth muscle |
| **Innervation** | Vagus (excitatory and inhibitory) |

### Components of Anti-reflux Barrier

\`\`\`
1. Intrinsic LES pressure (smooth muscle tone)
2. Diaphragmatic crura (external compression)
3. Intra-abdominal esophagus (positive pressure)
4. Angle of His (acute angle at GE junction)
5. Phrenoesophageal ligament
6. Mucosal rosette (mucosal folds)
\`\`\`

### LES Pressure Modulation

| Increases LES Pressure | Decreases LES Pressure |
|------------------------|------------------------|
| Protein meal | Fat, chocolate, alcohol |
| Gastrin | Secretin, CCK |
| Motilin | Glucagon, VIP |
| Alpha-agonists | Beta-agonists |
| Metoclopramide | Nitrates, CCBs |
| Raised intra-abdominal pressure | Smoking |

> 📝 **Exam Tip**: Factors that decrease LES pressure → predispose to GERD

---

## Hiatal Anatomy

### Esophageal Hiatus

- **Location**: T10 vertebral level
- **Formed by**: Right crus of diaphragm (mainly)
- **Contents**: Esophagus, vagal trunks, esophageal branches of left gastric vessels

### Phrenoesophageal Ligament

- Extension of transversalis fascia
- Attaches esophagus to diaphragm
- Allows esophageal movement during swallowing

> 💎 **Clinical Pearl**: Weakness of phrenoesophageal ligament → **Hiatal hernia**
`
    },
    {
      id: 'physiology',
      title: 'Physiology of Swallowing',
      depth: 'mbbs',
      icon: '🔄',
      content: `
## Deglutition (Swallowing)

Swallowing is a complex process involving **3 phases**:

### Overview

| Phase | Location | Control | Duration |
|-------|----------|---------|----------|
| **Oral** | Mouth | Voluntary | 1 second |
| **Pharyngeal** | Pharynx | Involuntary (reflex) | 1 second |
| **Esophageal** | Esophagus | Involuntary | 8-10 seconds |

---

## Phase 1: Oral Phase (Voluntary)

### Steps

1. **Preparation**: Food masticated, mixed with saliva
2. **Bolus formation**: Tongue shapes food into bolus
3. **Propulsion**: Tongue pushes bolus to pharynx

### Mechanism

\`\`\`
Tongue tip → hard palate
    ↓
Tongue body elevates sequentially
    ↓
Bolus propelled posteriorly
    ↓
Reaches faucial pillars → triggers pharyngeal phase
\`\`\`

> 📝 **Note**: This phase is under voluntary control (cortical)

---

## Phase 2: Pharyngeal Phase (Involuntary)

### Swallowing Reflex

**Triggered by**: Bolus touching posterior pharyngeal wall, faucial pillars, soft palate

**Afferent**: CN IX (glossopharyngeal)
**Center**: Swallowing center in medulla (nucleus ambiguus, nucleus tractus solitarius)
**Efferent**: CN IX, X, XII

### Sequence of Events

\`\`\`
1. Soft palate elevates → closes nasopharynx
2. Palatopharyngeal folds approximate → forms slit
3. Vocal cords adduct → protects airway
4. Larynx elevates → epiglottis covers laryngeal inlet
5. UES relaxes (0.5-1 sec)
6. Pharyngeal constrictor muscles contract sequentially
7. Bolus propelled into esophagus
8. UES contracts (returns to rest)
\`\`\`

> ⚠️ **Clinical Note**: Respiration halts during this phase (deglutition apnea)

### Airway Protection

Multiple mechanisms prevent aspiration:
- Soft palate elevation
- Laryngeal elevation
- Epiglottis deflection
- Vocal cord closure
- Cessation of breathing

---

## Phase 3: Esophageal Phase (Involuntary)

### Primary Peristalsis

- **Initiated by**: Swallowing reflex
- **Nature**: Progressive contraction wave
- **Speed**: 2-4 cm/second
- **Pressure**: 30-120 mmHg
- **Duration**: 8-10 seconds for bolus to reach stomach

### Secondary Peristalsis

- **Initiated by**: Local distension of esophagus
- **Purpose**: Clear residual food or refluxed material
- **Does NOT require**: Pharyngeal swallow initiation

### Tertiary Contractions

- **Non-propulsive**, simultaneous contractions
- Seen in elderly, esophageal motility disorders
- Pathological if excessive

---

## LES Function During Swallowing

### Receptive Relaxation

\`\`\`
Swallow initiated
    ↓
LES relaxes within 2 seconds
    ↓
Remains relaxed during esophageal peristalsis
    ↓
Contracts after bolus passes
\`\`\`

### Neurotransmitters

| Action | Neurotransmitter |
|--------|------------------|
| **Contraction** | Acetylcholine, Substance P |
| **Relaxation** | VIP, NO (nitric oxide) |

> 💎 **Clinical Pearl**: Loss of inhibitory neurons (VIP, NO) → **Achalasia** (LES fails to relax)

---

## Transient LES Relaxations (TLESRs)

- **Not preceded** by pharyngeal swallowing
- **Duration**: 10-60 seconds (longer than swallow-induced)
- **Mechanism**: Vagal reflex triggered by gastric distension
- **Significance**: Main mechanism of physiological and pathological reflux

> 📝 **Exam Tip**: TLESRs (not low resting LES pressure) are the main cause of GERD
`
    },
    {
      id: 'investigations',
      title: 'Clinical Investigations',
      depth: 'pg',
      icon: '🔍',
      content: `
## Imaging Studies

### Barium Swallow

**Indications**: Dysphagia, suspected stricture, motility disorders

| Finding | Condition |
|---------|-----------|
| Bird-beak appearance | Achalasia |
| Corkscrew esophagus | Diffuse esophageal spasm |
| Rat-tail narrowing | Carcinoma |
| Smooth stricture | Peptic stricture |
| Filling defect | Tumor, foreign body |
| Diverticulum | Zenker's, epiphrenic |

### CT Scan

- Wall thickness assessment
- Staging of esophageal cancer
- Detection of perforations
- Evaluation of mediastinal structures

### Endoscopic Ultrasound (EUS)

- **Gold standard** for T-staging of esophageal cancer
- Differentiates mucosal from submucosal lesions
- Guides FNA of lymph nodes

---

## Endoscopy

### Upper GI Endoscopy (EGD)

**Most important investigation** for esophageal pathology

| Indication | Findings |
|------------|----------|
| **GERD** | Esophagitis, Barrett's |
| **Dysphagia** | Stricture, mass, ring |
| **GI bleeding** | Varices, ulcers |
| **Screening** | Barrett's surveillance |

### Narrow Band Imaging (NBI)

- Enhanced visualization of mucosal patterns
- Detection of early neoplasia
- Barrett's surveillance

---

## Manometry

### High-Resolution Manometry (HRM)

**Gold standard for motility assessment**

| Parameter | Normal Value |
|-----------|--------------|
| LES resting pressure | 15-30 mmHg |
| LES relaxation | >90% |
| Peristaltic amplitude | 30-180 mmHg |
| Peristaltic sequence | Progressive |

### Chicago Classification (Motility Disorders)

| Disorder | Findings |
|----------|----------|
| **Type I Achalasia** | No pressurization, failed peristalsis |
| **Type II Achalasia** | Panesophageal pressurization |
| **Type III Achalasia** | Spastic contractions |
| **DES** | Premature contractions >20% |
| **Jackhammer** | Hypercontractile (DCI >8000) |
| **Absent peristalsis** | 100% failed swallows |

---

## pH Monitoring

### 24-hour pH Monitoring

**Gold standard for GERD diagnosis**

| Parameter | Abnormal |
|-----------|----------|
| **Total acid exposure** | >4.2% of time |
| **DeMeester score** | >14.72 |
| **Number of reflux episodes** | >50/24h |

### pH-Impedance

- Detects both acid and non-acid reflux
- Useful in patients on PPI therapy
- Evaluates bolus transit

---

## Functional Testing

### Barium Swallow with Video Fluoroscopy

- Dynamic assessment of swallowing
- Oral and pharyngeal phase analysis
- Aspiration detection

### Esophageal Transit Scintigraphy

- Quantitative measurement of transit time
- Useful in motility disorders
`
    },
    {
      id: 'clinical-correlations',
      title: 'Clinical Correlations',
      depth: 'pg',
      icon: '🩺',
      content: `
## Anatomical Basis of Disease

### GERD (Gastroesophageal Reflux Disease)

**Anatomical factors**:
- Weak LES
- Hiatal hernia
- Short intra-abdominal esophagus
- Loss of angle of His

**Complications**:
- Esophagitis → Stricture
- Barrett's esophagus → Adenocarcinoma

---

### Achalasia

**Pathophysiology**:
- Loss of myenteric ganglion cells
- Loss of inhibitory neurons (VIP, NO)
- Failure of LES relaxation
- Absent peristalsis

**Clinical Features**:
- Dysphagia to solids AND liquids
- Regurgitation of undigested food
- Weight loss
- Chest pain

---

### Esophageal Varices

**Anatomical basis**:
- Portal-systemic anastomosis at lower esophagus
- Left gastric vein (portal) ↔ Azygos vein (systemic)

**Clinical significance**:
- Portal hypertension → varices
- Life-threatening hemorrhage

---

### Zenker's Diverticulum

**Anatomical basis**:
- Killian's dehiscence (weak area)
- Between cricopharyngeus and inferior constrictor
- Posterior wall

**Features**:
- Dysphagia, regurgitation
- Halitosis
- Gurgling in neck

---

### Esophageal Cancer

**Squamous Cell Carcinoma**:
- Upper and middle third
- Risk factors: Smoking, alcohol, achalasia

**Adenocarcinoma**:
- Lower third (GE junction)
- Risk factors: GERD, Barrett's, obesity

**Anatomical considerations**:
- No serosa → early spread
- Longitudinal lymphatics → skip metastases

---

## Surgical Anatomy Points

### Approaches

| Approach | Indication |
|----------|------------|
| **Left cervical** | Upper esophagus (avoids RLN) |
| **Right thoracotomy** | Middle esophagus |
| **Left thoracoabdominal** | Lower esophagus |
| **Transhiatal** | Minimally invasive, avoids thoracotomy |

### Key Surgical Relations

- **Thoracic duct**: Crosses from right to left at T5
- **Azygos vein**: Arches over right main bronchus
- **Recurrent laryngeal nerves**: In tracheoesophageal groove
- **Aorta**: Crosses behind esophagus at T7
`
    },
    {
      id: 'advanced-topics',
      title: 'Advanced Concepts',
      depth: 'superSpecialty',
      icon: '🎓',
      content: `
## Molecular Physiology

### Smooth Muscle Contraction

\`\`\`
ACh released from myenteric neurons
    ↓
M3 receptor activation
    ↓
IP3/DAG pathway
    ↓
Ca²⁺ release from SR
    ↓
Ca²⁺-Calmodulin activates MLCK
    ↓
Myosin phosphorylation → Contraction
\`\`\`

### Smooth Muscle Relaxation

\`\`\`
NO/VIP released
    ↓
Guanylate cyclase activation
    ↓
cGMP ↑
    ↓
PKG activation
    ↓
MLCP activation → Relaxation
\`\`\`

---

## Esophageal Motility Disorders

### Chicago Classification v4.0

**Disorders of EGJ Outflow**:
1. Achalasia (Types I, II, III)
2. EGJ outflow obstruction

**Major Disorders of Peristalsis**:
1. Absent contractility
2. Distal esophageal spasm
3. Jackhammer esophagus

**Minor Disorders**:
1. Ineffective esophageal motility
2. Fragmented peristalsis

---

## Barrett's Esophagus

### Molecular Pathway

\`\`\`
Chronic GERD
    ↓
Squamous epithelium damage
    ↓
Intestinal metaplasia (CDX2 upregulation)
    ↓
Low-grade dysplasia (p53 mutation)
    ↓
High-grade dysplasia (p16, APC loss)
    ↓
Adenocarcinoma (additional mutations)
\`\`\`

### Management

| Finding | Management |
|---------|------------|
| Non-dysplastic Barrett's | EGD every 3-5 years |
| Low-grade dysplasia | EGD every 6-12 months or ablation |
| High-grade dysplasia | Endoscopic therapy (RFA, EMR) |
| Intramucosal carcinoma | Endoscopic resection |

---

## Esophageal Microbiome

Recent research shows:
- Healthy esophagus dominated by *Streptococcus*
- GERD shifts to gram-negative bacteria
- Barrett's: *Campylobacter* enrichment
- Possible role in carcinogenesis

---

## Future Directions

1. **Endoscopic therapies**: POEM for achalasia
2. **Immunotherapy**: PD-1 inhibitors for esophageal cancer
3. **Liquid biopsy**: ctDNA for cancer monitoring
4. **Stem cell therapy**: Barrett's regeneration
5. **AI endoscopy**: Automated dysplasia detection
`
    }
  ],

  keyPoints: [
    "Esophagus is 25 cm long, begins at C6 (cricopharyngeus)",
    "4 constrictions: Cricopharyngeus (15cm), Aorta (22cm), Bronchus (27cm), Diaphragm (40cm)",
    "NO SEROSA in thorax - important for cancer spread and surgical leaks",
    "Upper 1/3 striated, middle mixed, lower 1/3 smooth muscle",
    "LES is physiological, not anatomical sphincter",
    "LARP: Left vagus Anterior, Right vagus Posterior",
  ],

  mnemonics: [
    {
      title: "Esophageal Constrictions (ABCD)",
      content: `**A**t cricopharyngeus - 15 cm
**B**ronchus (left main) - 27 cm  
**C**rossed by aorta - 22 cm
**D**iaphragm - 40 cm

*Remember: Most common FB impaction = cricopharyngeus (15 cm)*`,
    },
    {
      title: "LARP (Vagal Trunks)",
      content: `At the diaphragm:
**L**eft vagus → **A**nterior trunk
**R**ight vagus → **P**osterior trunk

*"The Left goes to the front, Right stays behind"*`,
    },
    {
      title: "VACTERL Association",
      content: `**V**ertebral anomalies
**A**nal atresia
**C**ardiac defects
**T**racheo-**E**sophageal fistula
**R**enal anomalies
**L**imb defects`,
    },
    {
      title: "Swallowing Phases",
      content: `**O**ral - **O**ne second, v**O**luntary
**P**haryngeal - reflex
**E**sophageal - 8-10 seconds

*"OPE-n your mouth to swallow"*`,
    },
  ],

  clinicalPearls: [
    "Most common site of FB impaction = Cricopharyngeus (15 cm from incisors)",
    "No serosa → early tumor spread and anastomotic leak risk",
    "Left atrial enlargement causes dysphagia (posterior compression)",
    "Zenker's diverticulum occurs at Killian's dehiscence (posterior wall)",
    "TLESRs (not low LES pressure) are the main mechanism of GERD",
    "Type II achalasia has best response to treatment (90%)",
  ],

  examTips: [
    "Distance from incisors: Cricopharyngeus 15cm, Aorta 22cm, Bronchus 27cm, Diaphragm 40cm",
    "Upper 1/3 striated, middle mixed, lower 1/3 smooth muscle",
    "Porto-systemic anastomosis at lower esophagus → esophageal varices",
    "Achalasia = loss of ganglion cells (NO/VIP neurons)",
    "Barrett's = intestinal metaplasia, NOT gastric metaplasia",
    "Most common TEF type = proximal atresia with distal fistula (Type C)",
  ],
};
