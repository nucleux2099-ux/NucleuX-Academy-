/**
 * Ectopic Pregnancy - Full OBG Content
 * 
 * Comprehensive content covering:
 * - Diagnosis and types
 * - Medical and surgical management
 * - Based on Williams Obstetrics (26th Ed), ACOG Guidelines
 */

export const ECTOPIC_PREGNANCY_CONTENT = {
  id: 'obg-early-ectopic',
  name: 'Ectopic Pregnancy',
  
  concepts: [
    {
      id: 'definition-types',
      title: 'Definition & Types',
      depth: 'mbbs',
      icon: '📍',
      content: `
## Definition

**Ectopic pregnancy** is the implantation of a fertilized ovum outside the uterine cavity.

### Epidemiology

| Statistic | Value |
|-----------|-------|
| Incidence | 1-2% of all pregnancies |
| Maternal mortality | 4-10% of pregnancy-related deaths |
| Trend | Increasing (IVF, PID prevalence) |

> ⚠️ **Important**: Ectopic pregnancy is the leading cause of maternal mortality in the first trimester

---

## Sites of Implantation

### Distribution by Location

| Site | Frequency | Notes |
|------|-----------|-------|
| **Tubal (total)** | 95-97% | Most common |
| - Ampulla | 70% | Most common tubal site |
| - Isthmus | 12% | Narrowest, ruptures earliest |
| - Fimbria | 11% | May become abdominal |
| - Interstitial/Cornual | 2-4% | Most dangerous, late rupture |
| **Ovarian** | 1-3% | Rare, diagnosed at surgery |
| **Cervical** | <1% | Hemorrhage risk |
| **Abdominal** | 1-1.5% | Primary or secondary |
| **Cesarean scar** | Increasing | Due to ↑ cesarean rates |
| **Heterotopic** | 1:30,000 (natural), 1:100 (IVF) | IUP + ectopic |

---

## Tubal Anatomy Review

### Segments (Medial to Lateral)

\`\`\`
Interstitial → Isthmus → Ampulla → Infundibulum → Fimbria

Interstitial:
  - Within myometrium
  - 1 cm long
  - Late rupture (10-12 weeks)
  - Most dangerous

Isthmus:
  - Narrowest (2-3 mm)
  - Thin wall
  - Early rupture (6-8 weeks)

Ampulla:
  - Widest (5-8 mm)
  - Most common site
  - Rupture at 8-12 weeks

Infundibulum/Fimbria:
  - Opens to peritoneum
  - May result in tubal abortion
\`\`\`

### Why Ampulla is Most Common

| Factor | Explanation |
|--------|-------------|
| Longest segment | Larger surface area |
| Fertilization site | Egg and sperm meet here |
| Transport dysfunction | Ciliary damage from PID |

---

## Special Types

### Interstitial (Cornual) Pregnancy

| Feature | Details |
|---------|---------|
| Location | Tubal portion within myometrium |
| Rupture time | 10-16 weeks (myometrium distensible) |
| Danger | Massive hemorrhage when ruptures |
| Mortality | 2-2.5% (highest of tubal) |

### Cesarean Scar Pregnancy

\`\`\`
Rising incidence due to ↑ cesarean rates

Risk: Placenta accreta spectrum development

Types:
  1. Toward cavity (may continue to term with risk)
  2. Toward bladder (high risk, cannot continue)

Treatment: MTX, UAE, surgery
\`\`\`

### Heterotopic Pregnancy

| Feature | Natural | Assisted Reproduction |
|---------|---------|----------------------|
| Incidence | 1:30,000 | 1:100 to 1:500 |
| Risk | Low | High (ovulation induction) |

> 💎 **Clinical Pearl**: In IVF patients, presence of IUP does NOT rule out ectopic - always consider heterotopic

### Abdominal Pregnancy

| Type | Description |
|------|-------------|
| Primary | Implants directly in abdomen |
| Secondary | Tubal abortion/rupture → reimplants |

Can rarely progress to viability (high morbidity)

---

## Natural History

### Outcomes Without Treatment

\`\`\`
Tubal ectopic pregnancy:
      ├── Tubal rupture (40-50%)
      │     └── Hemorrhage → shock
      │
      ├── Tubal abortion (30%)
      │     └── Expulsion through fimbria
      │
      ├── Chronic ectopic (10%)
      │     └── Pelvic mass, adhesions
      │
      └── Resolution (rare)
            └── Very early, low βhCG
\`\`\`

### Risk of Rupture

| Factor | Higher Risk |
|--------|-------------|
| Location | Isthmus > Ampulla |
| βhCG level | Higher = higher risk |
| Fetal cardiac activity | Present = higher risk |
| Gestational age | Older = higher risk |
`
    },
    {
      id: 'risk-factors',
      title: 'Risk Factors & Pathophysiology',
      depth: 'mbbs',
      icon: '⚠️',
      content: `
## Risk Factors

### High-Risk Factors

| Factor | Relative Risk |
|--------|---------------|
| **Previous ectopic** | 7-13× |
| **Tubal surgery** | 6-9× |
| **Documented tubal pathology** | 4× |
| **In-utero DES exposure** | 5× |
| **Current IUD use** | 5× (if pregnancy occurs) |

### Moderate Risk Factors

| Factor | Relative Risk |
|--------|---------------|
| **Previous PID** | 3× |
| **Infertility** | 3× |
| **Multiple sexual partners** | 2.5× |
| **Age >35** | 2× |
| **Smoking** | 2× |
| **Previous pelvic/abdominal surgery** | 2× |

### Low/Questionable Risk

| Factor | Notes |
|--------|-------|
| **Assisted reproduction** | IVF: 2-5% ectopic rate |
| **Prior cesarean section** | Cesarean scar pregnancy |
| **Previous abortions** | Controversial |

---

## Pathophysiology

### Normal Tubal Function

\`\`\`
Fertilization in ampulla
      ↓
Ciliary action + muscular contractions
      ↓
Transport to uterus (3-4 days)
      ↓
Implantation in endometrium (day 6-7)
\`\`\`

### Mechanisms of Ectopic Implantation

| Mechanism | Examples |
|-----------|----------|
| **Impaired ciliary function** | Smoking, PID damage |
| **Tubal distortion** | Surgery, adhesions, tumors |
| **Abnormal embryo** | Chromosomal abnormalities |
| **Transmigration** | Ovum crosses to opposite tube |
| **Altered tubal motility** | Hormonal factors, IUD |

### PID and Tubal Damage

\`\`\`
Chlamydia/Gonorrhea infection
      ↓
Salpingitis
      ↓
Destruction of ciliated epithelium
      ↓
Tubal scarring and adhesions
      ↓
Impaired ovum transport
      ↓
Ectopic implantation
\`\`\`

> 💎 **Clinical Pearl**: Chlamydia can cause "silent" PID with minimal symptoms but significant tubal damage

---

## IUD and Ectopic Pregnancy

### Important Clarification

| Statement | Explanation |
|-----------|-------------|
| IUD **prevents** ectopic | IUD prevents ALL pregnancies, including ectopic |
| IUD **increases risk** if pregnant | IF conception occurs with IUD, higher proportion are ectopic |

**Rate comparison**:
- Without IUD: 2% of pregnancies are ectopic
- With IUD (if pregnant): Up to 50% may be ectopic

> 📝 **Exam Tip**: IUD REDUCES overall ectopic risk by preventing pregnancy. But IF pregnancy occurs, suspect ectopic.

---

## Histopathology

### Tubal Response to Implantation

\`\`\`
Unlike uterus, tube cannot adequately support pregnancy:
  - No decidualization
  - Thin muscular wall
  - Limited distensibility
  - Poor vasculature for placentation
\`\`\`

### Trophoblastic Invasion

- Invades through mucosa into muscularis
- Can erode into blood vessels → hemorrhage
- Stretches tubal wall → rupture

### Chronic Ectopic

- Organized hematoma
- Trophoblastic tissue may persist
- Can form pelvic mass
- Adhesions to adjacent structures
`
    },
    {
      id: 'clinical-features',
      title: 'Clinical Features',
      depth: 'mbbs',
      icon: '🩺',
      content: `
## Classic Presentation

### Triad (Present in ~50%)

| Symptom | Frequency |
|---------|-----------|
| **Amenorrhea** | 75-95% |
| **Abdominal pain** | 90-100% |
| **Vaginal bleeding** | 50-80% |

> 📝 **Note**: The classic triad is present in only about 50% of cases. Have high index of suspicion!

---

## Symptoms

### Amenorrhea

- Usually 6-8 weeks (range: 4-12 weeks)
- May have history of irregular cycles
- Patient may not realize she's pregnant

### Abdominal Pain

| Stage | Character |
|-------|-----------|
| **Unruptured** | Dull, unilateral, constant or intermittent |
| **Rupturing** | Sharp, severe, may radiate to shoulder |
| **Ruptured** | Diffuse abdominal pain, shoulder tip pain |

**Shoulder Tip Pain**: 
- Indicates hemoperitoneum
- Diaphragmatic irritation by blood
- Referred via phrenic nerve (C3-5)

### Vaginal Bleeding

- Usually light, dark ("prune juice")
- Due to decidual breakdown
- Less than normal period typically
- May pass decidual cast (rare)

### Other Symptoms

| Symptom | Significance |
|---------|--------------|
| Syncopal episodes | Hypovolemia |
| Dizziness | Anemia, hypotension |
| Urge to defecate | Blood in pouch of Douglas |
| Nausea/vomiting | Pregnancy or shock |

---

## Signs

### Vital Signs

| Stage | Findings |
|-------|----------|
| Unruptured | Usually normal |
| Ruptured | Tachycardia, hypotension, pallor |

### Abdominal Examination

| Finding | Interpretation |
|---------|----------------|
| Tenderness | Unilateral (usually) |
| Guarding/rebound | Peritoneal irritation |
| Distension | Hemoperitoneum |
| Decreased bowel sounds | Ileus from blood |

### Pelvic Examination

| Finding | Significance |
|---------|--------------|
| **Cervical motion tenderness** | Chandelier sign - peritoneal irritation |
| **Adnexal tenderness** | Affected tube |
| **Adnexal mass** | Present in 50% (may be on opposite side) |
| **Uterine size** | Smaller than dates |
| **Cervical os** | Closed |
| **Cul-de-sac fullness** | Blood in pouch of Douglas |

---

## Presentation Patterns

### Unruptured Ectopic

\`\`\`