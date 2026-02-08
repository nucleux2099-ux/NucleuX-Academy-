/**
 * Normal Labor & Delivery - Full OBG Content
 * 
 * Comprehensive content covering:
 * - Physiology of labor
 * - Stages and mechanisms
 * - Management protocols
 * - Based on Williams Obstetrics (26th Ed)
 */

export const NORMAL_LABOR_CONTENT = {
  id: 'obg-labor-normal',
  name: 'Normal Labor & Delivery',
  
  concepts: [
    {
      id: 'definition-physiology',
      title: 'Definition & Physiology',
      depth: 'mbbs',
      icon: '🤰',
      content: `
## Definition

**Labor** is the process by which regular, painful uterine contractions bring about effacement and dilatation of the cervix, leading to expulsion of the fetus and placenta.

### Term Labor
- Occurs between **37-42 weeks** of gestation
- Before 37 weeks = Preterm labor
- After 42 weeks = Post-term pregnancy

---

## Initiation of Labor

The exact trigger remains unclear, but involves:

### Hormonal Changes

| Hormone | Change | Effect |
|---------|--------|--------|
| **Progesterone** | ↓ Functional withdrawal | Loss of myometrial quiescence |
| **Estrogen** | ↑ Ratio E:P | Increases oxytocin receptors |
| **Prostaglandins** | ↑ PGE2, PGF2α | Cervical ripening, contractions |
| **Oxytocin** | ↑ Receptors | Stimulates contractions |
| **CRH** | ↑ (fetal origin) | "Placental clock" |

> 💎 **Clinical Pearl**: Fetal cortisol surge → ↑ placental CRH → initiates labor cascade

### The "Progesterone Withdrawal" Concept

\`\`\`
Fetal HPA axis maturation
        ↓
↑ Fetal cortisol production
        ↓
↑ Placental CRH and estrogen synthesis
        ↓
Functional progesterone withdrawal
        ↓
↑ Prostaglandin synthesis
        ↓
Cervical ripening + Uterine contractions
\`\`\`

---

## Uterine Contractions

### Characteristics of True Labor Contractions

| Feature | True Labor | False Labor (Braxton Hicks) |
|---------|------------|----------------------------|
| **Regularity** | Regular | Irregular |
| **Interval** | Decreasing | Variable |
| **Intensity** | Increasing | Static or decreasing |
| **Location** | Fundal, radiates down | Variable |
| **Effect of walking** | Intensifies | May stop |
| **Cervical change** | Progressive | None |

### Contraction Physiology

- **Origin**: Pacemaker in fundus (near cornua)
- **Direction**: Fundal dominance → downward propagation
- **Duration**: 45-60 seconds at peak
- **Frequency**: Every 2-3 minutes in active labor
- **Intensity**: 40-60 mmHg above resting tone

> 📝 **Exam Tip**: Resting uterine tone = 8-12 mmHg. Contractions must exceed 25 mmHg to be palpable.

---

## Cervical Changes

### Effacement
- Shortening and thinning of the cervix
- Measured in percentage (0-100%)
- Primigravida: Effacement before dilatation
- Multigravida: Simultaneous

### Dilatation
- Opening of the cervical os
- Measured in centimeters (0-10 cm)
- Full dilatation = 10 cm

### Bishop Score

| Parameter | 0 | 1 | 2 | 3 |
|-----------|---|---|---|---|
| **Dilatation (cm)** | 0 | 1-2 | 3-4 | 5-6 |
| **Effacement (%)** | 0-30 | 40-50 | 60-70 | 80+ |
| **Station** | -3 | -2 | -1, 0 | +1, +2 |
| **Consistency** | Firm | Medium | Soft | - |
| **Position** | Posterior | Mid | Anterior | - |

> 💎 **Clinical Pearl**: Bishop score ≥8 indicates favorable cervix; induction likely to succeed
`
    },
    {
      id: 'stages-of-labor',
      title: 'Stages of Labor',
      depth: 'mbbs',
      icon: '⏱️',
      content: `
## Overview of Stages

| Stage | Definition | Duration (Primi) | Duration (Multi) |
|-------|------------|------------------|------------------|
| **First** | Onset to full dilatation | 10-12 hours | 6-8 hours |
| **Second** | Full dilatation to delivery | 1-2 hours | 30-60 min |
| **Third** | Delivery to placental expulsion | 15-30 min | 5-15 min |
| **Fourth** | First 1-2 hours postpartum | Observation period |

---

## First Stage of Labor

### Latent Phase

- **From**: Onset of regular contractions
- **To**: 3-4 cm dilatation (old) / 6 cm (modern)
- **Duration**: 8-10 hours (primi), 4-6 hours (multi)
- **Cervical dilatation**: <1.2 cm/hour (primi), <1.5 cm/hour (multi)

**Characteristics**:
- Contractions every 5-10 minutes
- Mild to moderate intensity
- Cervical effacement predominates

### Active Phase

- **From**: 4-6 cm dilatation
- **To**: Full dilatation (10 cm)
- **Duration**: 4-6 hours (primi), 2-4 hours (multi)

**Friedman's Criteria** (Classic):
| Parameter | Primigravida | Multigravida |
|-----------|--------------|--------------|
| Minimum dilatation rate | 1.2 cm/hr | 1.5 cm/hr |
| Minimum descent rate | 1 cm/hr | 2 cm/hr |

> ⚠️ **Modern Update**: ACOG now defines active labor from 6 cm, not 4 cm

### Active Phase Subdivisions (Friedman)

\`\`\`
Active Phase
    ├── Acceleration phase (4-5 cm)
    ├── Phase of maximum slope (5-9 cm) ← Most rapid dilatation
    └── Deceleration phase (9-10 cm)
\`\`\`

---

## Second Stage of Labor

### Definition
From complete cervical dilatation to delivery of the baby.

### Phases

| Phase | Description |
|-------|-------------|
| **Passive/Latent** | Full dilatation but no urge to push |
| **Active/Expulsive** | Maternal bearing down efforts |

### Duration Limits

| Category | Primigravida | Multigravida |
|----------|--------------|--------------|
| Without epidural | 2 hours | 1 hour |
| With epidural | 3 hours | 2 hours |

> 📝 **Exam Tip**: Prolonged second stage increases risk of: operative delivery, 3rd/4th degree tears, postpartum hemorrhage, neonatal morbidity

### Maternal Efforts

- **Urge to push**: Ferguson reflex (pressure on pelvic floor)
- **Technique**: Closed glottis pushing (Valsalva) vs Open glottis
- **Position**: Lithotomy, squatting, lateral, all-fours

---

## Third Stage of Labor

### Definition
From delivery of baby to expulsion of placenta and membranes.

### Signs of Placental Separation

| Sign | Description |
|------|-------------|
| **Gush of blood** | Retroplacental hematoma |
| **Cord lengthening** | Placenta descends into lower segment |
| **Uterine fundus rises** | Becomes globular, firm |
| **Suprapubic bulge** | Placenta in lower segment |

### Mechanisms of Separation

1. **Schultze mechanism** (80%): Central separation, fetal surface first ("shiny Schultze")
2. **Duncan mechanism** (20%): Marginal separation, maternal surface first ("dirty Duncan")

### Management

| Approach | Components |
|----------|------------|
| **Active management (AMTSL)** | Oxytocin, CCT, uterine massage |
| **Expectant management** | Physiological, no interventions |

> 💎 **Clinical Pearl**: Active management reduces PPH by 60% - recommended for all deliveries (WHO)

---

## Fourth Stage of Labor

### Definition
First 1-2 hours after placental delivery.

### Importance
- Highest risk period for **primary PPH**
- Vital signs monitored every 15 minutes
- Uterine tone checked frequently
- Blood loss estimated

### Monitoring Checklist

\`\`\`
✓ Uterine fundus - firm, at umbilicus
✓ Vaginal bleeding - amount and character
✓ Vital signs - BP, pulse, respiratory rate
✓ Bladder - not distended
✓ Perineum - intact or repaired
✓ Maternal comfort - pain control
\`\`\`
`
    },
    {
      id: 'mechanism-of-labor',
      title: 'Mechanism of Labor',
      depth: 'mbbs',
      icon: '👶',
      content: `
## Cardinal Movements

The fetus undergoes a series of movements to navigate the birth canal. These are the **7 cardinal movements**:

### Mnemonic: "Every Darn Fool In Egypt Eats Eggs"

| Movement | Description |
|----------|-------------|
| **E**ngagement | Biparietal diameter enters pelvic inlet |
| **D**escent | Continuous throughout labor |
| **F**lexion | Chin on chest (smallest diameter presents) |
| **I**nternal rotation | Occiput rotates to pubic symphysis |
| **E**xtension | Head extends under symphysis |
| **E**xternal rotation (Restitution) | Head aligns with shoulders |
| **E**xpulsion | Delivery of shoulders and body |

---

## Detailed Mechanism (LOA Position)

### 1. Engagement

- **Definition**: When the largest transverse diameter of the presenting part passes through the pelvic inlet
- **Vertex**: Biparietal diameter (9.5 cm) at inlet
- **Station**: 0 station = engaged

**Timing**:
- Primigravida: 2-3 weeks before labor
- Multigravida: During labor

> 💎 **Clinical Pearl**: Floating head at onset of labor in primigravida → suspect CPD or malpresentation

### 2. Descent

- Occurs throughout labor
- Due to: Uterine contractions, maternal pushing, gravity
- Measured by station (-5 to +5)

### 3. Flexion

**Purpose**: Present the smallest diameter

| Presentation | Diameter | Measurement |
|--------------|----------|-------------|
| Vertex (well-flexed) | Suboccipitobregmatic | 9.5 cm |
| Vertex (deflexed) | Suboccipitofrontal | 10 cm |
| Brow | Mentovertical | 13.5 cm |
| Face | Submentobregmatic | 9.5 cm |

### 4. Internal Rotation

- Occiput rotates from transverse to anterior (OA)
- Rotation: 45° if LOA/ROA, 90° if LOT/ROT
- Occurs at pelvic floor (levator ani)
- Aligns longest diameter with longest pelvic diameter

\`\`\`
At inlet: Transverse diameter longest (13 cm)
At outlet: AP diameter longest (9.5-11.5 cm)
→ Head must rotate for optimal fit
\`\`\`

### 5. Extension

- Head extends as it passes under the symphysis pubis
- Occiput pivots under symphysis
- Face, brow, and vertex deliver by extension
- **Crowning**: When the widest diameter is at vulva

### 6. External Rotation (Restitution)

- Head returns to original position relative to shoulders
- Shoulders now enter pelvis in transverse
- Head turns 45° to align with back

### 7. Expulsion

- Anterior shoulder delivers under symphysis
- Posterior shoulder delivered by lateral flexion
- Rest of body follows quickly

---

## Fetal Skull Diameters

### Anteroposterior Diameters

| Diameter | Landmarks | Measurement | Presentation |
|----------|-----------|-------------|--------------|
| **Suboccipitobregmatic** | Below occiput to bregma | 9.5 cm | Vertex (flexed) |
| **Suboccipitofrontal** | Below occiput to frontal | 10 cm | Vertex (deflexed) |
| **Occipitofrontal** | Occiput to frontal | 11.5 cm | Military |
| **Mentovertical** | Chin to vertex | 13.5 cm | Brow |
| **Submentobregmatic** | Below chin to bregma | 9.5 cm | Face |
| **Submentovertical** | Below chin to vertex | 11.5 cm | Face (ext) |

### Transverse Diameters

| Diameter | Landmarks | Measurement |
|----------|-----------|-------------|
| **Biparietal** | Between parietal eminences | 9.5 cm |
| **Bitemporal** | Between temporal bones | 8 cm |
| **Bimastoid** | Between mastoid processes | 7.5 cm |

> 📝 **Exam Tip**: The smallest presenting diameter = Suboccipitobregmatic (9.5 cm) in well-flexed vertex
`
    },
    {
      id: 'partogram',
      title: 'Partogram & Monitoring',
      depth: 'mbbs',
      icon: '📊',
      content: `
## The Partogram (Partograph)

A graphical record of labor progress and maternal-fetal condition.

### WHO Partograph Components

\`\`\`
1. Fetal condition
   - Fetal heart rate
   - Membranes and liquor
   - Moulding
   
2. Progress of labor
   - Cervical dilatation
   - Descent of head
   - Uterine contractions
   
3. Maternal condition
   - Vital signs
   - Urine (volume, protein, acetone)
   - Drugs and IV fluids
\`\`\`

---

## Alert and Action Lines

### Alert Line
- Starts at 4 cm dilatation
- Rate: 1 cm/hour
- Crossing = Warning sign

### Action Line
- Parallel to alert line, 4 hours to the right
- Crossing = Intervention needed

> 💎 **Clinical Pearl**: If cervical dilatation crosses the action line → evaluate for CPD, malpresentation, or augmentation need

---

## Fetal Heart Rate Monitoring

### Intermittent Auscultation (Low Risk)

| Stage | Frequency | Duration |
|-------|-----------|----------|
| Latent phase | Every 30-60 min | 60 seconds |
| Active phase | Every 15-30 min | 60 seconds |
| Second stage | Every 5 min or after each contraction | 60 seconds |

### Normal FHR Parameters

| Parameter | Normal Range |
|-----------|--------------|
| **Baseline** | 110-160 bpm |
| **Variability** | 6-25 bpm |
| **Accelerations** | ≥15 bpm for ≥15 sec |
| **Decelerations** | Early acceptable, Variable concerning |

### CTG Interpretation (DR C BRAVADO)

| Letter | Parameter | Assessment |
|--------|-----------|------------|
| **DR** | Define Risk | High/Low risk pregnancy |
| **C** | Contractions | Frequency, duration |
| **BR** | Baseline Rate | 110-160 normal |
| **A** | Accelerations | Reassuring |
| **V** | Variability | 6-25 bpm normal |
| **A** | Activity | Fetal movements |
| **D** | Decelerations | Type and pattern |
| **O** | Overall | Category I, II, or III |

---

## Monitoring Checklist During Labor

### First Stage

\`\`\`
Every 30 minutes:
  □ FHR (or continuous CTG if high-risk)
  □ Contraction pattern
  
Every 4 hours:
  □ Vaginal examination (cervix, station)
  □ Vital signs
  □ Urine output
  
Continuously:
  □ Pain management
  □ Hydration
  □ Maternal comfort
\`\`\`

### Second Stage

\`\`\`
Every 5 minutes:
  □ FHR after contractions
  
Every 15-30 minutes:
  □ Maternal vital signs
  
Continuously:
  □ Descent and position
  □ Maternal pushing efforts
  □ Perineal distension
\`\`\`

---

## Vaginal Examination Findings

### Assessment Components

| Component | What to Note |
|-----------|--------------|
| **Cervix** | Dilatation, effacement, consistency, position |
| **Station** | Relation to ischial spines (-5 to +5) |
| **Position** | Occiput location (OA, OP, LOT, etc.) |
| **Membranes** | Intact or ruptured |
| **Presenting part** | Vertex, breech, etc. |
| **Pelvis** | Adequacy (if in doubt) |

### Station of Presenting Part

\`\`\`
Station    Level
  -5       At pelvic inlet
  -3       Above ischial spines
   0       At ischial spines (ENGAGED)
  +3       Below ischial spines
  +5       At perineum (CROWNING)
\`\`\`
`
    },
    {
      id: 'management',
      title: 'Management of Normal Labor',
      depth: 'mbbs',
      icon: '💊',
      content: `
## Admission Assessment

### History
- Onset and nature of contractions
- Membrane status (SROM?)
- Fetal movements
- Pregnancy complications
- Previous obstetric history

### Examination
- General condition, vital signs
- Abdominal: Fundal height, lie, presentation, engagement
- FHR auscultation
- Vaginal examination (if indicated)

---

## First Stage Management

### General Care

| Aspect | Recommendation |
|--------|----------------|
| **Mobility** | Encouraged, upright positions |
| **Oral intake** | Light fluids, low-residue food |
| **Hydration** | IV if prolonged or high-risk |
| **Bladder** | Empty every 2-3 hours |
| **Support** | Continuous companion, emotional support |

### Pain Management

| Method | Type | Notes |
|--------|------|-------|
| **Non-pharmacological** | Position, massage, water | First-line |
| **Entonox (N2O)** | Inhalational | Patient-controlled |
| **Pethidine/Morphine** | Parenteral opioid | Crosses placenta |
| **Epidural** | Regional | Gold standard for pain relief |

### Epidural Analgesia

**Indications**:
- Maternal request (most common)
- Prolonged labor
- Hypertensive disorders
- Anticipated operative delivery

**Contraindications**:
- Patient refusal
- Coagulopathy
- Local infection
- Hypovolemia

> 💎 **Clinical Pearl**: Epidural does NOT increase cesarean rate (COMET study)

---

## Second Stage Management

### Preparation

\`\`\`
□ Delivery set ready
□ Neonatal resuscitation equipment
□ Oxytocin drawn up
□ Pediatrician alert (if needed)
□ Clear communication with patient
\`\`\`

### Pushing Technique

| Approach | Description |
|----------|-------------|
| **Directed pushing** | Coached Valsalva with contractions |
| **Spontaneous pushing** | Mother follows urge |
| **Delayed pushing** | Wait 1-2 hours if no urge (with epidural) |

### Perineal Management

- **Warm compresses**: Reduce severe tears
- **Manual perineal support**: Controversial
- **Episiotomy**: Not routine, selective use

### Episiotomy Indications

- Fetal distress requiring expedited delivery
- Operative vaginal delivery (often)
- Shoulder dystocia
- Rigid perineum preventing delivery

> 📝 **Exam Tip**: Routine episiotomy is NOT recommended (increases posterior perineal trauma)

---

## Delivery of the Head

### Ritgen Maneuver (Modified)

\`\`\`
1. Dominant hand controls delivery of head
2. Non-dominant hand applies pressure on perineum
3. Extension of head is controlled
4. Slow delivery prevents perineal trauma
\`\`\`

### After Head Delivery

1. Check for nuchal cord → reduce or clamp/cut
2. Wait for external rotation
3. Suction NOT routine (only if meconium)
4. Deliver shoulders with next contraction

### Shoulder Delivery

- **Anterior shoulder**: Gentle downward traction
- **Posterior shoulder**: Upward traction
- Support body as it delivers

---

## Third Stage Management

### Active Management (AMTSL)

| Component | Details |
|-----------|---------|
| **Uterotonic** | Oxytocin 10 IU IM within 1 minute |
| **Controlled cord traction** | Brandt-Andrews maneuver |
| **Uterine massage** | After placental delivery |

### Delayed Cord Clamping

- **WHO recommendation**: 1-3 minutes after birth
- **Benefits**: 
  - ↑ Iron stores
  - ↑ Hemoglobin at 24-48 hours
  - Better neurodevelopmental outcomes

### Placental Examination

\`\`\`
Check:
□ Membranes complete (2 layers: amnion, chorion)
□ Cotyledons complete (maternal surface)
□ Umbilical cord (2 arteries, 1 vein)
□ Any abnormalities (infarcts, calcifications)
\`\`\`

---

## Immediate Postpartum Care

### First Hour

- Skin-to-skin contact
- Early breastfeeding initiation
- Uterine tone monitoring
- Vital signs every 15 minutes
- Perineal inspection and repair

### Blood Loss Estimation

| Method | Description |
|--------|-------------|
| **Visual** | Often underestimated |
| **Weighing** | Drapes, pads (1 gm = 1 mL) |
| **Calibrated drape** | Most accurate in clinical setting |

> 💎 **Clinical Pearl**: Normal blood loss = <500 mL (vaginal), <1000 mL (cesarean)
`
    },
    {
      id: 'abnormal-labor',
      title: 'Abnormal Labor Patterns',
      depth: 'pg',
      icon: '⚠️',
      content: `
## Classification of Abnormal Labor

### The 3 P's

| Factor | Components | Assessment |
|--------|------------|------------|
| **Powers** | Contraction frequency, intensity, duration | Tocodynamometry, palpation |
| **Passenger** | Size, position, attitude, presentation | Ultrasound, VE |
| **Passage** | Bony pelvis, soft tissues | Clinical pelvimetry |

---

## First Stage Abnormalities

### Prolonged Latent Phase

| Definition | Primigravida | Multigravida |
|------------|--------------|--------------|
| Duration | >20 hours | >14 hours |

**Causes**: Unripe cervix, false labor, sedation

**Management**:
- Therapeutic rest (morphine sleep)
- Reassess in 4-6 hours
- Consider oxytocin if true labor

### Protracted Active Phase

| Type | Primigravida | Multigravida |
|------|--------------|--------------|
| Protracted dilatation | <1.2 cm/hr | <1.5 cm/hr |
| Protracted descent | <1 cm/hr | <2 cm/hr |

**Causes**: CPD, malposition, inadequate contractions

### Arrest Disorders

| Type | Definition |
|------|------------|
| **Arrest of dilatation** | No progress for ≥4 hours with adequate contractions |
| **Arrest of descent** | No descent for ≥2 hours (primi) or 1 hour (multi) |

> 📝 **Exam Tip**: Adequate contractions = >200 Montevideo units (frequency × intensity in mmHg)

---

## Second Stage Abnormalities

### Prolonged Second Stage

| Category | With Epidural | Without Epidural |
|----------|---------------|------------------|
| Primigravida | >3 hours | >2 hours |
| Multigravida | >2 hours | >1 hour |

### Management Options

1. **Continue** if progress and reassuring FHR
2. **Augment** with oxytocin if inadequate contractions
3. **Operative vaginal delivery** (vacuum/forceps)
4. **Cesarean section** if above fail

---

## Obstructed Labor

### Definition
Failure of descent despite strong uterine contractions due to mechanical obstruction.

### Causes

| Category | Examples |
|----------|----------|
| **Fetal** | Macrosomia, hydrocephalus, malpresentation |
| **Maternal** | Contracted pelvis, pelvic tumor, cervical stenosis |

### Warning Signs (Impending Rupture)

\`\`\`
□ Bandl's ring (pathological retraction ring)
□ Maternal tachycardia, fever
□ Prolonged labor with no progress
□ Constant lower abdominal pain
□ Hematuria
□ Fetal distress
\`\`\`

### Complications

- **Maternal**: Uterine rupture, PPH, fistula, sepsis
- **Fetal**: Asphyxia, trauma, death

---

## Precipitate Labor

### Definition
Total labor duration <3 hours (cervical dilatation >5 cm/hour).

### Risks

| Maternal | Fetal |
|----------|-------|
| Cervical/vaginal lacerations | Rapid decompression injuries |
| Uterine rupture | Hypoxia |
| PPH | Trauma |

### Management
- Avoid oxytocin
- Tocolysis if necessary
- Controlled delivery
- Prepare for PPH

---

## Shoulder Dystocia

### Definition
Need for additional obstetric maneuvers after delivery of head because shoulders fail to deliver with normal traction.

### Risk Factors

| Antepartum | Intrapartum |
|------------|-------------|
| Macrosomia >4.5 kg | Prolonged first/second stage |
| Diabetes | Assisted vaginal delivery |
| Previous shoulder dystocia | Precipitate labor |
| Maternal obesity | Epidural anesthesia |

### HELPERR Mnemonic

| Letter | Maneuver | Success Rate |
|--------|----------|--------------|
| **H** | Call for **Help** | - |
| **E** | **Episiotomy** (evaluate) | - |
| **L** | **Legs** (McRoberts) | 42% |
| **P** | **Pressure** (suprapubic) | +16% with McRoberts |
| **E** | **Enter** (Rubin II, Wood's screw) | 72% |
| **R** | **Remove** posterior arm | 84% |
| **R** | **Roll** (Gaskin maneuver - all fours) | 83% |

### Complications

| Fetal | Maternal |
|-------|----------|
| Brachial plexus injury (Erb's) | PPH |
| Clavicle/humerus fracture | 3rd/4th degree tears |
| HIE/Death | Uterine rupture |

> ⚠️ **Never**: Apply fundal pressure, excessive traction, or twist the head
`
    },
    {
      id: 'advanced-topics',
      title: 'Advanced Concepts',
      depth: 'superSpecialty',
      icon: '🎓',
      content: `
## Molecular Basis of Labor

### Myometrial Activation

\`\`\`
Progesterone withdrawal (functional)
        ↓
↑ Oxytocin receptors
↑ Prostaglandin receptors
↑ Gap junctions (connexin 43)
        ↓
Coordinated contractility
\`\`\`

### Key Signaling Pathways

| Pathway | Effect |
|---------|--------|
| **Oxytocin-OTR** | Gq → PLC → IP3 → Ca²⁺ release → contraction |
| **Prostaglandin-FP** | Similar to oxytocin |
| **β2-adrenergic** | Gs → cAMP → relaxation (tocolysis) |
| **Nitric oxide** | cGMP → relaxation |

---

## Cervical Ripening Mechanisms

### Structural Changes

| Component | Change |
|-----------|--------|
| **Collagen** | Decreased cross-linking, increased solubility |
| **Glycosaminoglycans** | Increased hyaluronic acid, decreased dermatan sulfate |
| **Water content** | Increased (tissue edema) |
| **Inflammatory cells** | Infiltration of neutrophils, macrophages |

### Mediators

- **PGE2**: Primary cervical ripening agent
- **IL-8**: Neutrophil chemotaxis
- **MMP-8, MMP-9**: Collagen degradation
- **Nitric oxide**: Smooth muscle relaxation

---

## Evidence-Based Labor Management

### ARRIVE Trial (2018)

| Finding | Implication |
|---------|-------------|
| Elective induction at 39 weeks vs expectant | ↓ Cesarean rate in induction group |
| Low-risk nulliparas | 18.6% vs 22.2% cesarean |

### Epidural and Labor

| Study | Finding |
|-------|---------|
| COMET | Low-dose epidural does not increase cesarean |
| Meta-analyses | ↑ Instrumental delivery, no ↑ cesarean |

### Active vs Expectant Management

| Third Stage | PPH Rate |
|-------------|----------|
| Active (AMTSL) | 5% |
| Expectant | 13% |

---

## Intrapartum Fetal Assessment

### STAN (ST Analysis)

- Combines CTG with ST segment analysis
- T/QRS ratio and ST events
- Improves specificity of fetal distress detection

### Fetal Scalp Blood Sampling

| pH | Interpretation | Action |
|----|----------------|--------|
| >7.25 | Normal | Continue monitoring |
| 7.20-7.25 | Pre-acidosis | Repeat in 30 min |
| <7.20 | Acidosis | Expedite delivery |

### Fetal Scalp Lactate

- Quicker than pH
- <4.2 mmol/L: Normal
- 4.2-4.8: Borderline
- >4.8: Abnormal

---

## Simulation Training

### PROMPT Course (UK)

- Practical Obstetric Multi-Professional Training
- Team-based simulation
- Shown to reduce neonatal injury in shoulder dystocia

### Documentation After Shoulder Dystocia

\`\`\`
Essential elements:
□ Time of head delivery
□ Time of body delivery
□ Head-to-body interval
□ Maneuvers used (in order)
□ Personnel present
□ Neonatal condition
□ Cord gases
\`\`\`

---

## Global Perspectives

### WHO Recommendations (2018)

| Recommendation | Evidence |
|----------------|----------|
| Companion during labor | Strong |
| Upright positions | Conditional |
| No routine episiotomy | Strong |
| Delayed cord clamping | Strong |
| AMTSL for all | Strong |
| Continuous CTG only for high-risk | Conditional |

### Reducing Maternal Mortality

- Skilled birth attendant
- Access to emergency obstetric care
- Active management of third stage
- Early detection of complications
`
    }
  ],

  keyPoints: [
    "Labor = regular painful contractions causing cervical change",
    "First stage: Latent (to 6 cm) + Active (to 10 cm)",
    "7 Cardinal movements: Engagement, Descent, Flexion, Internal rotation, Extension, External rotation, Expulsion",
    "Active management of 3rd stage reduces PPH by 60%",
    "Bishop score ≥8 = favorable cervix for induction",
    "Partogram: Alert line at 1 cm/hr, Action line 4 hours right",
  ],

  mnemonics: [
    {
      title: "Cardinal Movements",
      content: `**E**very **D**arn **F**ool **I**n **E**gypt **E**ats **E**ggs

**E**ngagement
**D**escent
**F**lexion
**I**nternal rotation
**E**xtension
**E**xternal rotation (Restitution)
**E**xpulsion`,
    },
    {
      title: "BISHOP Score",
      content: `**D**ilatation
**E**ffacement
**S**tation
**C**onsistency
**P**osition

*"DESCP" or remember: "Dilate, Efface, Station, Consistency, Position"*`,
    },
    {
      title: "HELPERR (Shoulder Dystocia)",
      content: `**H**elp - call for assistance
**E**pisiotomy - evaluate need
**L**egs - McRoberts position
**P**ressure - suprapubic
**E**nter - internal maneuvers
**R**emove - posterior arm
**R**oll - all fours (Gaskin)`,
    },
    {
      title: "3 P's of Labor",
      content: `**P**owers - Contractions
**P**assenger - Fetus
**P**assage - Pelvis

*If labor abnormal, evaluate all 3 P's*`,
    },
  ],

  clinicalPearls: [
    "Pain BEFORE vomiting in labor = reassuring; consistent with labor progression",
    "Floating head at term in primigravida = suspect CPD or malpresentation",
    "Active labor now defined from 6 cm (not 4 cm) per ACOG",
    "Epidural does NOT increase cesarean rate (COMET study)",
    "Routine episiotomy increases perineal trauma - use selectively",
    "Active management of 3rd stage reduces PPH from 13% to 5%",
    "Nuchal cord occurs in 20-30% of deliveries - usually innocuous",
    "Delayed cord clamping (1-3 min) improves neonatal iron stores",
  ],

  examTips: [
    "Suboccipitobregmatic (9.5 cm) = smallest AP diameter in flexed vertex",
    "Station 0 = head at ischial spines = ENGAGED",
    "Montevideo units = frequency × intensity; >200 = adequate",
    "Prolonged latent phase: >20 hrs (primi), >14 hrs (multi)",
    "Arrest of dilatation = no progress for ≥4 hours with adequate contractions",
    "Third stage >30 minutes = retained placenta",
    "McRoberts + suprapubic pressure resolves 58% of shoulder dystocia",
    "Never use fundal pressure in shoulder dystocia",
  ],
};
