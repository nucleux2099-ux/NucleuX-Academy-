/**
 * Postpartum Hemorrhage (PPH) - Full OBG Content
 * 
 * Comprehensive content covering:
 * - Classification and causes
 * - Management and emergencies
 * - Based on Williams Obstetrics (26th Ed), WHO Guidelines
 */

export const PPH_CONTENT = {
  id: 'obg-emergency-pph',
  name: 'Postpartum Hemorrhage',
  
  concepts: [
    {
      id: 'definition-classification',
      title: 'Definition & Classification',
      depth: 'mbbs',
      icon: '🩸',
      content: `
## Definition

### Traditional Definition

| Type | Definition |
|------|------------|
| **Primary PPH** | Blood loss ≥500 mL (vaginal) or ≥1000 mL (cesarean) within 24 hours of delivery |
| **Secondary PPH** | Abnormal bleeding from 24 hours to 12 weeks postpartum |

### WHO Definition (2017)

**Blood loss ≥500 mL within 24 hours after birth**

### Severe PPH

- Blood loss ≥1000 mL regardless of mode of delivery
- OR any blood loss causing hemodynamic instability

> 💎 **Clinical Pearl**: Blood loss is often underestimated by 30-50%. Clinical signs may not appear until 15-25% blood volume lost.

---

## Incidence and Impact

### Global Statistics

| Statistic | Value |
|-----------|-------|
| Incidence of PPH | 5-10% of all deliveries |
| Severe PPH | 1-2% |
| PPH-related maternal deaths | 25% of all maternal deaths |
| Most common cause | Uterine atony (70-80%) |

> ⚠️ **Important**: PPH is the leading cause of maternal mortality worldwide, causing ~70,000 deaths annually

---

## Classification by Timing

### Primary (Early) PPH

- Within 24 hours of delivery
- Usually due to uterine atony, trauma, retained tissue

### Secondary (Late) PPH

- 24 hours to 12 weeks postpartum
- Usually due to:
  - Subinvolution of placental site
  - Retained products of conception
  - Endometritis
  - Inherited coagulopathy

---

## The 4 T's of PPH

### Mnemonic for Causes

| T | Cause | Frequency | Examples |
|---|-------|-----------|----------|
| **Tone** | Uterine atony | 70-80% | Overdistended uterus, prolonged labor |
| **Trauma** | Genital tract injury | 10-20% | Lacerations, hematoma, uterine rupture |
| **Tissue** | Retained tissue | 5-10% | Retained placenta, placenta accreta |
| **Thrombin** | Coagulopathy | 1-2% | DIC, inherited disorders, anticoagulants |

---

## Risk Factors

### Antepartum Risk Factors

| Risk Factor | Mechanism |
|-------------|-----------|
| Previous PPH | History predicts |
| Multiple gestation | Uterine overdistension |
| Polyhydramnios | Uterine overdistension |
| Macrosomia | Uterine overdistension |
| Grand multiparity | Poor uterine contractility |
| Uterine fibroids | Impaired contraction |
| Placenta previa | Abnormal placentation |
| Placenta accreta spectrum | Abnormal invasion |
| Pre-eclampsia/HELLP | Coagulopathy |
| Bleeding disorder | Impaired hemostasis |

### Intrapartum Risk Factors

| Risk Factor | Mechanism |
|-------------|-----------|
| Prolonged labor | Uterine exhaustion |
| Augmented labor | Oxytocin desensitization |
| Precipitate labor | Rapid delivery, trauma |
| Operative vaginal delivery | Genital tract trauma |
| Cesarean section | Surgical bleeding |
| Chorioamnionitis | Uterine infection |
| General anesthesia | Uterine relaxation |

### Scoring System - ACOG Risk Categories

| Risk Level | Examples |
|------------|----------|
| **Low** | No previous surgery, singleton, <4 prior deliveries |
| **Medium** | Prior cesarean, multiple gestation, >4 prior deliveries, chorioamnionitis |
| **High** | Active bleeding, placenta previa/accreta, coagulopathy, previous PPH |

> 📝 **Exam Tip**: All women should be risk-assessed for PPH at admission and throughout labor
`
    },
    {
      id: 'causes-tone',
      title: 'Causes - Tone (Atony)',
      depth: 'mbbs',
      icon: '💪',
      content: `
## Uterine Atony

### Definition
Failure of the uterus to contract adequately after delivery.

### Mechanism

Normal hemostasis after placental delivery:
\`\`\`
Placental separation
      ↓
Myometrial contraction
      ↓
"Physiological ligatures" compress spiral arteries
      ↓
Hemostasis achieved
\`\`\`

In atony:
\`\`\`
Poor myometrial contraction
      ↓
Spiral arteries remain open
      ↓
Continuous bleeding from placental site
\`\`\`

---

## Risk Factors for Atony

### Uterine Overdistension

| Condition | Mechanism |
|-----------|-----------|
| Multiple gestation | Stretched myometrium |
| Polyhydramnios | Stretched myometrium |
| Macrosomia (>4 kg) | Stretched myometrium |
| Grand multiparity | Poor contractile fibers |

### Uterine Exhaustion

| Condition | Mechanism |
|-----------|-----------|
| Prolonged labor | Fatigued myometrium |
| Prolonged oxytocin use | Receptor desensitization |
| Precipitate labor | Rapid delivery, no adaptation |

### Intrinsic Uterine Problems

| Condition | Mechanism |
|-----------|-----------|
| Uterine fibroids | Impaired contraction |
| Uterine anomalies | Abnormal muscle arrangement |
| Chorioamnionitis | Inflamed, dysfunctional myometrium |

### Anesthesia/Drugs

| Agent | Mechanism |
|-------|-----------|
| Halogenated anesthetics | Direct myometrial relaxation |
| Tocolytics (recent use) | β-agonist effect |
| Magnesium sulfate | Myometrial relaxation |
| Nifedipine | Smooth muscle relaxation |

---

## Clinical Assessment

### Signs of Atony

| Finding | Description |
|---------|-------------|
| Boggy uterus | Soft, poorly contracted fundus |
| High fundus | Above umbilicus |
| Continuous bleeding | Despite massage |
| Blood pooling | Vaginally or in uterine cavity |

### Examination

\`\`\`
1. Palpate fundus through abdomen
   - Normal: Firm, contracted, at or below umbilicus
   - Atony: Soft, boggy, above umbilicus

2. Check vaginal bleeding
   - Continuous, steady flow
   - No discrete trauma visible

3. Bimanual examination
   - Assess uterine size and tone
   - Rule out retained products
\`\`\`

---

## Prevention

### Active Management of Third Stage (AMTSL)

| Component | Details |
|-----------|---------|
| **Uterotonic** | Oxytocin 10 IU IM within 1 min of delivery |
| **Controlled cord traction** | Gentle traction with counter-pressure |
| **Uterine massage** | After placental delivery |

### Evidence for AMTSL

| Outcome | Active vs Expectant |
|---------|---------------------|
| PPH >500 mL | 5% vs 13% |
| PPH >1000 mL | 2% vs 3% |
| Blood transfusion | Reduced by 50% |

> 💎 **Clinical Pearl**: AMTSL reduces PPH by ~60% and is recommended for ALL vaginal deliveries (WHO)

### Prophylactic Uterotonic Options

| Drug | Dose | Route | Notes |
|------|------|-------|-------|
| **Oxytocin** | 10 IU | IM or IV | First choice |
| **Carbetocin** | 100 µg | IM or IV | Long-acting, single dose |
| **Ergometrine** | 0.2 mg | IM | Avoid in HTN |
| **Misoprostol** | 600 µg | Oral/SL | Low-resource settings |
`
    },
    {
      id: 'causes-trauma-tissue',
      title: 'Causes - Trauma & Tissue',
      depth: 'mbbs',
      icon: '🩹',
      content: `
## Genital Tract Trauma

### Types of Trauma

| Site | Injury Types |
|------|--------------|
| **Uterus** | Rupture, extension of cesarean incision |
| **Cervix** | Lacerations (often at 3 and 9 o'clock) |
| **Vagina** | Lacerations, sulcus tears, hematoma |
| **Perineum** | 1st-4th degree tears, episiotomy extension |

### Perineal Tears Classification

| Degree | Structures Involved |
|--------|---------------------|
| **1st** | Perineal skin and vaginal mucosa only |
| **2nd** | Perineal muscles (not anal sphincter) |
| **3rd** | Anal sphincter complex |
| **3a** | <50% external anal sphincter |
| **3b** | >50% external anal sphincter |
| **3c** | Internal anal sphincter involved |
| **4th** | Anal sphincter + rectal mucosa |

### Risk Factors for Trauma

| Factor | Type of Injury |
|--------|----------------|
| Operative vaginal delivery | All types |
| Macrosomia | Perineal tears, shoulder dystocia |
| Precipitate delivery | Lacerations |
| Episiotomy (especially midline) | Extension to 3rd/4th degree |
| First vaginal delivery | Perineal tears |
| Prolonged second stage | Tissue devitalization |

### Cervical Laceration

\`\`\`
Risk factors:
- Pushing before full dilatation
- Operative vaginal delivery
- Rapid cervical dilatation
- Cervical cerclage

Diagnosis:
- Visualize cervix with sponge forceps
- Most common at 3 and 9 o'clock

Treatment:
- Continuous locking suture
- Start above apex
\`\`\`

---

## Uterine Inversion

### Definition
The uterine fundus collapses into the endometrial cavity, potentially protruding through the cervix.

### Classification

| Degree | Description |
|--------|-------------|
| **1st** | Fundus to internal os |
| **2nd** | Fundus through cervix into vagina |
| **3rd** | Complete - uterus outside introitus |

### Risk Factors

- Fundal placenta
- Excessive cord traction
- Short umbilical cord
- Uterine atony
- Placenta accreta

### Clinical Features

\`\`\`
Symptoms:
- Sudden hemorrhage
- Severe lower abdominal pain
- Shock (out of proportion to blood loss - neurogenic)

Signs:
- Mass in vagina (complete)
- Absent fundus on abdominal palpation
- "Dimpling" of fundus (incomplete)
\`\`\`

---

## Retained Products of Conception

### Types

| Type | Description |
|------|-------------|
| **Retained placenta** | Placenta not delivered within 30-60 minutes |
| **Placenta accreta spectrum** | Abnormal placental invasion |
| **Retained cotyledon/fragments** | Incomplete placenta on inspection |
| **Retained membranes** | Less significant bleeding |

### Placenta Accreta Spectrum

| Type | Invasion Depth | Description |
|------|----------------|-------------|
| **Accreta** | To myometrium | Superficial invasion |
| **Increta** | Into myometrium | Deep invasion |
| **Percreta** | Through serosa | Complete invasion, may involve bladder |

### Risk Factors for Accreta

| Factor | Relative Risk |
|--------|---------------|
| Placenta previa + 1 prior CS | 3% |
| Placenta previa + 2 prior CS | 11% |
| Placenta previa + 3 prior CS | 40% |
| Placenta previa + 4+ prior CS | 61% |

> ⚠️ **High-Yield**: Previous cesarean + placenta previa = high suspicion for placenta accreta spectrum

### Management of Retained Placenta

\`\`\`
Conservative (if no hemorrhage):
- Wait up to 30-60 minutes
- Continued oxytocin
- Breastfeeding (endogenous oxytocin)
- Controlled cord traction

Active (if hemorrhage or >60 min):
- Manual removal under anesthesia
- Ensure empty cavity
- Prophylactic antibiotics
\`\`\`
`
    },
    {
      id: 'causes-thrombin',
      title: 'Causes - Thrombin (Coagulopathy)',
      depth: 'pg',
      icon: '🧬',
      content: `
## Coagulation Disorders

### Acquired Coagulopathies

| Condition | Mechanism |
|-----------|-----------|
| **DIC** | Consumption of clotting factors |
| **Dilutional coagulopathy** | Massive transfusion, fluid resuscitation |
| **HELLP syndrome** | Microangiopathic hemolysis, consumption |
| **Amniotic fluid embolism** | Triggers DIC |
| **Placental abruption** | Tissue factor release, DIC |
| **Sepsis** | Inflammatory coagulopathy |
| **IUFD (prolonged)** | Thromboplastin release |

### Inherited Coagulopathies

| Condition | Prevalence | Feature |
|-----------|------------|---------|
| **von Willebrand disease** | 1% | Most common inherited |
| **Factor XI deficiency** | Rare | Ashkenazi Jewish |
| **Hemophilia A carrier** | Variable | May have reduced factor VIII |
| **Platelet function disorders** | Rare | Variable presentation |

---

## Disseminated Intravascular Coagulation (DIC)

### Pathophysiology

\`\`\`
Trigger (abruption, sepsis, AFE)
        ↓
Tissue factor release
        ↓
Activation of coagulation cascade
        ↓
Widespread microthrombi formation
        ↓
Consumption of platelets and clotting factors
        ↓
Paradoxical bleeding (consumption coagulopathy)
\`\`\`

### Obstetric Causes of DIC

| Cause | Mechanism |
|-------|-----------|
| Placental abruption | Tissue factor, hypoxia |
| Amniotic fluid embolism | Phospholipids, tissue factor |
| HELLP syndrome | Microangiopathy |
| Sepsis | Inflammatory cytokines |
| IUFD (prolonged) | Fetal tissue thromboplastins |
| Massive hemorrhage | Dilution, hypothermia |

### Laboratory Findings

| Test | Finding |
|------|---------|
| Platelets | ↓↓ |
| PT/INR | ↑↑ |
| aPTT | ↑↑ |
| Fibrinogen | ↓↓ (<200 mg/dL concerning) |
| D-dimer/FDP | ↑↑ |
| Peripheral smear | Schistocytes |

### DIC Management

\`\`\`
1. Treat underlying cause (delivery, antibiotics)
2. Transfusion:
   - PRBCs for Hb <7-8 g/dL
   - FFP for PT/aPTT >1.5× normal
   - Platelets for <50,000/µL with bleeding
   - Cryoprecipitate for fibrinogen <100-150
3. Massive transfusion protocol if needed
\`\`\`

---

## Transfusion in PPH

### Targets During Hemorrhage

| Parameter | Target |
|-----------|--------|
| Hemoglobin | >7-8 g/dL |
| Platelets | >50,000/µL (>75,000 if ongoing bleeding) |
| Fibrinogen | >150-200 mg/dL |
| PT/aPTT | <1.5× normal |

### Massive Transfusion Protocol (MTP)

\`\`\`
Activation criteria:
- Estimated blood loss >1500 mL
- Ongoing hemorrhage
- Clinical signs of shock

Transfusion ratio (balanced):
- PRBC : FFP : Platelets = 1:1:1

Components per "pack":
- 6 units PRBCs
- 6 units FFP
- 1 apheresis platelet
- Consider cryoprecipitate
\`\`\`

### Tranexamic Acid (TXA)

**WOMAN Trial Finding**: TXA reduces death from bleeding if given within 3 hours

| Parameter | Recommendation |
|-----------|----------------|
| Dose | 1g IV over 10 minutes |
| Timing | Within 3 hours of delivery (ideally within 1 hour) |
| Repeat | 1g if bleeding continues after 30 min |
| Mechanism | Inhibits plasminogen → reduces fibrinolysis |

> 💎 **Clinical Pearl**: TXA should be given EARLY in PPH (within 3 hours) - no benefit if delayed
`
    },
    {
      id: 'management',
      title: 'Management of PPH',
      depth: 'mbbs',
      icon: '💊',
      content: `
## Initial Assessment and Resuscitation

### Call for Help

\`\`\`
Immediate actions:
□ Call for help (obstetric team, anesthesia)
□ Assign roles (leader, recorder, medications, IV)
□ Communicate blood loss estimates clearly
\`\`\`

### ABC Assessment

| Component | Action |
|-----------|--------|
| **Airway** | Ensure patent, supplemental O2 |
| **Breathing** | Assess rate, oxygen saturation |
| **Circulation** | Large bore IV ×2, fluid resuscitation |

### Shock Index

| Shock Index (HR/SBP) | Interpretation |
|---------------------|----------------|
| <0.9 | Normal |
| 0.9-1.7 | Blood transfusion likely |
| >1.7 | Massive transfusion needed |

> 📝 **Exam Tip**: Shock Index is more sensitive than vital signs alone for detecting hemorrhage

---

## Stepwise Management

### First-Line: Uterotonics

| Drug | Dose | Route | Frequency | Contraindications |
|------|------|-------|-----------|-------------------|
| **Oxytocin** | 10-40 IU | IV infusion | Continuous | None |
| **Ergometrine** | 0.2-0.5 mg | IM/IV | Repeat in 15 min | Hypertension |
| **Carboprost (PGF2α)** | 250 µg | IM | q15-90 min, max 8 doses | Asthma |
| **Misoprostol** | 600-800 µg | SL/rectal | Once | Caution in asthma |
| **Carbetocin** | 100 µg | IV/IM | Single dose | None |

### Protocol

\`\`\`
Step 1: Oxytocin 10 IU IV (if not already given)
        ↓
        + Oxytocin 20-40 IU in 500mL IV over 4 hours
        ↓
Step 2: If atony persists
        - Ergometrine 0.2mg IM (if no HTN)
        - OR Carboprost 250µg IM (if no asthma)
        ↓
Step 3: If still bleeding
        - Misoprostol 800µg SL/rectally
        - Repeat Carboprost q15min (max 8 doses)
        ↓
Step 4: Mechanical/Surgical interventions
\`\`\`

---

## Second-Line: Mechanical Interventions

### Uterine Massage

- Bimanual compression
- Maintain until uterus contracts firmly
- First intervention for atony

### Uterine Tamponade

| Method | Details |
|--------|---------|
| **Bakri balloon** | Purpose-designed, up to 500mL |
| **Condom catheter** | Low-resource alternative |
| **Gauze packing** | Less preferred, risk of concealed hemorrhage |

**Tamponade Test**: If bleeding stops with balloon = positive test, continue tamponade

### Bimanual Compression

\`\`\`
Technique:
1. One hand (fist) in anterior vaginal fornix
2. Other hand on abdomen grasping fundus
3. Compress uterus between hands
4. Maintain until uterotonics take effect
\`\`\`

### Aortic Compression

\`\`\`
Indication: Temporary measure during resuscitation

Technique:
1. Apply pressure with fist above umbilicus
2. Compress aorta against spine
3. Check femoral pulse to confirm compression
4. Temporary - buys time for other interventions
\`\`\`

---

## Third-Line: Surgical Interventions

### Uterine Compression Sutures

| Suture | Technique |
|--------|-----------|
| **B-Lynch** | Vertical brace suture |
| **Hayman** | Modified, simpler |
| **Cho square** | Multiple square sutures |
| **Pereira** | Transverse and longitudinal |

### Vascular Ligation

| Vessel | Success Rate | Notes |
|--------|--------------|-------|
| **Uterine artery** | 80-90% | First choice |
| **Utero-ovarian anastomosis** | Additional | Combined with uterine |
| **Internal iliac artery** | 40-50% | Technically difficult |

### Interventional Radiology

- Uterine artery embolization (UAE)
- Internal iliac artery embolization
- Requires hemodynamic stability
- Preserves fertility

### Hysterectomy

**Indications for peripartum hysterectomy**:
\`\`\`
□ Failure of all conservative measures
□ Uncontrollable hemorrhage
□ Uterine rupture (unrepairable)
□ Placenta accreta spectrum
□ Severe infection
\`\`\`

> 💎 **Clinical Pearl**: "A live mother without a uterus is better than a dead mother with one." Don't delay hysterectomy if indicated.
`
    },
    {
      id: 'special-situations',
      title: 'Special Situations',
      depth: 'pg',
      icon: '⚠️',
      content: `
## Uterine Inversion Management

### Recognition

\`\`\`
Clinical features:
- Sudden hemorrhage
- Severe pain
- Shock out of proportion to visible blood loss
- Absent fundus on palpation
- Mass in vagina or at introitus
\`\`\`

### Immediate Management

\`\`\`
1. Call for help
2. DO NOT attempt placental removal (increases bleeding)
3. Stop oxytocin
4. Replace uterus immediately (Johnson maneuver)
5. IV access, fluid resuscitation
\`\`\`

### Johnson Maneuver

\`\`\`
Technique:
1. Grasp inverted fundus with palm
2. Push fundus toward umbilicus (not just into vagina)
3. Push through cervix
4. Maintain pressure for several minutes
5. Once replaced, give oxytocin
6. Keep hand in place until uterus contracts
\`\`\`

### If Manual Reduction Fails

| Intervention | Details |
|--------------|---------|
| **Uterine relaxation** | Terbutaline, nitroglycerin, halothane |
| **Hydrostatic reduction** | O'Sullivan technique - fill vagina with warm saline |
| **Surgical reduction** | Huntington (abdominal), Haultain (posterior colpotomy) |

---

## Placenta Accreta Spectrum

### Preoperative Planning

\`\`\`
For suspected accreta:
□ Multidisciplinary team (OB, GYN-Onc, urology, anesthesia, blood bank)
□ Planned cesarean hysterectomy
□ Blood products ready (massive transfusion)
□ Interventional radiology standby
□ Cell salvage
□ ICU bed reserved
\`\`\`

### Surgical Approach

| Strategy | Details |
|----------|---------|
| **Cesarean hysterectomy** | Gold standard for known accreta |
| **Leave placenta in situ** | Consider if fertility desired, close surveillance needed |
| **Methotrexate** | Adjunct if placenta left in situ (controversial) |

### Resuscitation Considerations

- Expect massive hemorrhage (>5000 mL possible)
- Warm blood products
- Calcium replacement with massive transfusion
- Arterial line for monitoring
- Consider TXA early

---

## Secondary PPH

### Definition
Abnormal bleeding from 24 hours to 12 weeks postpartum.

### Causes

| Cause | Frequency |
|-------|-----------|
| Subinvolution of placental site | Most common |
| Retained products of conception | 30-40% |
| Endometritis | Common |
| Coagulopathy (inherited) | Consider if recurrent |

### Investigation

\`\`\`
□ Clinical assessment (vital signs, bleeding amount)
□ Complete blood count
□ Coagulation screen
□ Pelvic ultrasound (retained products)
□ HCG (if GTD suspected)
□ Endometrial sampling (if suspicious)
\`\`\`

### Management

| Etiology | Treatment |
|----------|-----------|
| **Subinvolution** | Uterotonics, antibiotics |
| **Retained products** | Surgical evacuation |
| **Endometritis** | IV antibiotics |
| **Coagulopathy** | Correct underlying cause |

---

## Amniotic Fluid Embolism (AFE)

### Clinical Features

\`\`\`
Classic triad:
1. Sudden cardiovascular collapse
2. Respiratory distress
3. DIC

Timeline:
- Usually during labor or immediately postpartum
- Sudden, catastrophic
- Mortality 20-60%
\`\`\`

### Management

\`\`\`
Supportive:
□ CPR if cardiac arrest
□ Intubation and ventilation
□ Vasopressors/inotropes
□ Aggressive transfusion (DIC)
□ Delivery if undelivered

There is no specific treatment - supportive only
\`\`\`
`
    },
    {
      id: 'prevention-algorithms',
      title: 'Prevention & Algorithms',
      depth: 'pg',
      icon: '📋',
      content: `
## Prevention Strategies

### Universal Precautions (All Deliveries)

| Intervention | Evidence |
|--------------|----------|
| Active management of 3rd stage | Strong |
| Prophylactic oxytocin | Strong |
| Risk assessment | Moderate |
| IV access | Good practice |
| Blood type and screen | Standard |

### High-Risk Precautions

\`\`\`
For high-risk patients:
□ Blood type and crossmatch
□ Large bore IV access ×2
□ Active warming
□ Blood products available
□ PPH cart at bedside
□ Early anesthesia involvement
□ Consider TXA prophylaxis (research ongoing)
\`\`\`

---

## PPH Bundle

### California Maternal Quality Care Collaborative (CMQCC) Bundle

\`\`\`
READINESS:
□ Hemorrhage cart with supplies
□ Medication kit readily available
□ Blood bank communication
□ Massive transfusion protocol

RECOGNITION:
□ Quantitative blood loss measurement
□ Vital signs and shock index
□ Stage-based assessment

RESPONSE:
□ Stage-based treatment algorithm
□ Team communication
□ Timely escalation

REPORTING:
□ Debriefing after events
□ System-level review
□ Quality improvement
\`\`\`

---

## Staged Algorithm

### Stage 0: Every Delivery

\`\`\`
□ Risk assessment
□ AMTSL
□ Quantitative blood loss
□ Vital signs monitoring
\`\`\`

### Stage 1: Blood Loss >500mL (vaginal) or >1000mL (CS)

\`\`\`
□ Fundal massage
□ Oxytocin infusion (20-40 IU in 500mL)
□ Empty bladder
□ Examine for trauma
□ Vital signs q5min
□ Second IV access
□ Notify team
\`\`\`

### Stage 2: Continued Bleeding, Blood Loss >1000mL

\`\`\`
□ Second uterotonic (ergometrine, carboprost, misoprostol)
□ TXA 1g IV
□ Activate MTP
□ Call for help
□ Warm fluids
□ Consider cause (4 T's)
□ Prepare for tamponade/surgery
\`\`\`

### Stage 3: Blood Loss >1500mL or DIC or Hemodynamic Instability

\`\`\`
□ Massive transfusion protocol
□ Tamponade balloon
□ Move to OR
□ Compression sutures
□ Consider hysterectomy
□ Arterial line
□ ICU notification
\`\`\`

---

## Quantitative Blood Loss (QBL)

### Methods

| Method | Description |
|--------|-------------|
| **Gravimetric** | Weigh all blood-soaked materials (1g = 1mL) |
| **Calibrated drapes** | Collect and measure |
| **Visual estimation** | LEAST accurate |

### Visual Estimation Guide

| Item | Blood Volume |
|------|--------------|
| Saturated laparotomy sponge | 100-150 mL |
| Saturated peripad | 50-100 mL |
| Blood clot (fist-sized) | 500 mL |

> ⚠️ **Important**: Visual estimation underestimates by 30-50%. Use quantitative methods!

---

## Key Lab Values and Thresholds

| Parameter | Threshold | Action |
|-----------|-----------|--------|
| Hemoglobin | <7-8 g/dL | Transfuse PRBCs |
| Platelets | <50,000/µL | Transfuse platelets |
| Fibrinogen | <150-200 mg/dL | Cryoprecipitate or fibrinogen concentrate |
| PT/aPTT | >1.5× normal | FFP |
| Shock index | >1.0 | Aggressive resuscitation |
`
    },
    {
      id: 'advanced-topics',
      title: 'Advanced Concepts',
      depth: 'superSpecialty',
      icon: '🎓',
      content: `
## Damage Control Resuscitation

### Principles

\`\`\`
1. Permissive hypotension (SBP 80-90) until bleeding controlled
2. Limit crystalloids (avoid dilutional coagulopathy)
3. Balanced transfusion (1:1:1 ratio)
4. Early TXA
5. Prevent hypothermia
6. Correct acidosis
7. Goal-directed therapy with TEG/ROTEM
\`\`\`

### TEG/ROTEM in PPH

| Parameter | Measures | Treatment if Abnormal |
|-----------|----------|----------------------|
| R time (TEG) / CT (ROTEM) | Clot initiation | FFP |
| K time / CFT | Clot formation | FFP, cryoprecipitate |
| Alpha angle | Fibrinogen function | Fibrinogen, cryoprecipitate |
| MA / MCF | Platelet function | Platelets |
| LY30 / ML | Fibrinolysis | TXA |

---

## Fibrinogen Concentrate

### Advantages over Cryoprecipitate

| Feature | Fibrinogen Concentrate | Cryoprecipitate |
|---------|------------------------|-----------------|
| Standardized dose | Yes | Variable |
| Viral inactivation | Yes | No |
| Thawing time | None | 20-30 min |
| Volume | Low | Higher |

### Dosing

\`\`\`
Target fibrinogen: 200-250 mg/dL

Dose calculation:
Dose (g) = [Target - Current] × 0.07 × weight(kg) / 100

Typical dose: 2-4 g IV
\`\`\`

---

## Interventional Radiology

### Uterine Artery Embolization (UAE)

\`\`\`
Indications:
- Hemodynamically stable patient
- Ongoing bleeding despite medical management
- Desire for fertility preservation
- Prior to hysterectomy for accreta (prophylactic)

Contraindications:
- Hemodynamic instability
- Active DIC
- Unstable patient who cannot wait

Success rate: 80-90%
\`\`\`

### Balloon Occlusion Catheters

- Placed in internal iliac arteries preoperatively
- Inflated during surgery to reduce bleeding
- Used for planned accreta surgery
- Reduces intraoperative blood loss

---

## Prognosis and Long-Term Outcomes

### Immediate Outcomes

| Outcome | Association |
|---------|-------------|
| Sheehan syndrome | Severe PPH → pituitary necrosis |
| Transfusion reactions | Multiple transfusions |
| Infection | Surgery, blood products |
| VTE | Immobility, surgery |
| ARDS | Massive transfusion |

### Sheehan Syndrome

\`\`\`
Pathophysiology:
- Pituitary enlarges in pregnancy
- Vulnerable to ischemia
- Severe PPH → infarction

Features:
- Failure to lactate
- Amenorrhea
- Fatigue
- Hypotension
- Hypothyroidism
- Adrenal insufficiency

Diagnosis:
- Low pituitary hormones
- MRI shows empty sella

Treatment:
- Hormone replacement (lifelong)
\`\`\`

### Recurrence Risk

| Scenario | Recurrence |
|----------|------------|
| Previous PPH | 15-20% |
| Previous atony | Higher risk |
| Previous accreta | Counseling for future pregnancies |

---

## Key Points Summary

| Topic | Key Point |
|-------|-----------|
| Definition | ≥500 mL (vaginal), ≥1000 mL (CS), or hemodynamic instability |
| Most common cause | Uterine atony (70-80%) |
| 4 T's | Tone, Trauma, Tissue, Thrombin |
| Prevention | AMTSL (oxytocin, CCT, uterine massage) |
| First-line drugs | Oxytocin, ergometrine, carboprost, misoprostol |
| TXA timing | Within 3 hours, ideally within 1 hour |
| Tamponade test | Bleeding stops with balloon = continue tamponade |
| Fibrinogen target | >150-200 mg/dL |
| Transfusion ratio | 1:1:1 (PRBC:FFP:Platelets) in massive hemorrhage |
| Hysterectomy | Life-saving, don't delay if indicated |
`
    }
  ],

  keyPoints: [
    "PPH = Blood loss ≥500mL (vaginal) or ≥1000mL (cesarean)",
    "4 T's: Tone (70-80%), Trauma, Tissue, Thrombin",
    "AMTSL reduces PPH by 60%: Oxytocin + CCT + Uterine massage",
    "TXA 1g IV within 3 hours reduces bleeding mortality (WOMAN trial)",
    "Shock index (HR/SBP) >1.0 indicates significant hemorrhage",
    "Balanced transfusion: PRBC:FFP:Platelets = 1:1:1",
    "Fibrinogen target: >150-200 mg/dL",
    "Don't delay hysterectomy if conservative measures fail",
  ],

  mnemonics: [
    {
      title: "4 T's of PPH",
      content: `**T**one - Uterine atony (70-80%)
**T**rauma - Lacerations, rupture (10-20%)
**T**issue - Retained products (5-10%)
**T**hrombin - Coagulopathy (1-2%)

*Most common = Tone (atony)*`,
    },
    {
      title: "Uterotonics Order",
      content: `**O**xytocin - First line, always
**E**rgometrine - Second line (avoid in HTN)
**C**arboprost (PGF2α) - Third line (avoid in asthma)
**M**isoprostol - Adjunct or low-resource

*"OEM" - like the original equipment*`,
    },
    {
      title: "HEMOSTASIS Protocol",
      content: `**H**elp - Call for assistance
**E**valuate - 4 T's
**M**assage - Bimanual compression
**O**xytocin - First-line drug
**S**hift to second-line uterotonics
**T**amponade - Balloon/packing
**A**pply compression sutures
**S**ystemic pelvic devascularization
**I**nterventional radiology
**S**ubtotal/total hysterectomy`,
    },
    {
      title: "Perineal Tears (Degrees)",
      content: `**1**st: **S**kin only (vaginal and perineal)
**2**nd: **M**uscles (perineal body)
**3**rd: **S**phincter (anal sphincter)
**4**th: **R**ectum (rectal mucosa)

*"Skin, Muscle, Sphincter, Rectum"*`,
    },
  ],

  clinicalPearls: [
    "Visual estimation underestimates blood loss by 30-50% - use quantitative methods",
    "Shock index (HR/SBP) >1.0 is more sensitive than vital signs alone",
    "TXA must be given within 3 hours to be effective - no benefit if delayed",
    "Ergometrine is contraindicated in hypertension (causes vasoconstriction)",
    "Carboprost (PGF2α) is contraindicated in asthma (bronchoconstriction)",
    "Positive tamponade test = bleeding stops with balloon = continue conservative",
    "Sheehan syndrome: failure to lactate after severe PPH = pituitary necrosis",
    "Placenta previa + previous cesarean = high risk for placenta accreta",
  ],

  examTips: [
    "Most common cause of PPH = Uterine atony (70-80%)",
    "AMTSL reduces PPH from 13% to 5% - recommended for ALL deliveries",
    "Carboprost dose: 250µg IM q15-90min, max 8 doses (2mg total)",
    "Fibrinogen <200 mg/dL is concerning - give cryoprecipitate",
    "For massive transfusion: 1:1:1 ratio of PRBC:FFP:Platelets",
    "B-Lynch suture is for uterine atony - compression suture",
    "In uterine inversion: DO NOT remove placenta before replacing uterus",
    "Secondary PPH: Think retained products, subinvolution, endometritis",
  ],
};
