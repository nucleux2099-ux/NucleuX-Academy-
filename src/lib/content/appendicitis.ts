/**
 * Acute Appendicitis - Full Medical Content
 * 
 * Super dope markdown content with:
 * - Detailed medical information
 * - Tables, lists, callouts
 * - Mnemonics and clinical pearls
 * - Depth-stratified content
 */

export const APPENDICITIS_CONTENT = {
  // Topic metadata
  id: 'surg-gi-appendicitis',
  name: 'Acute Appendicitis',
  
  // Concept sections
  concepts: [
    {
      id: 'anatomy',
      title: 'Anatomy & Embryology',
      depth: 'mbbs',
      icon: '🫀',
      content: `
## Embryology

The appendix develops from the **midgut** along with the cecum during the **6th week** of gestation. It shares the blood supply of the cecum.

## Anatomy

The appendix is a **blind-ended tube** arising from the posteromedial wall of the cecum, approximately **2 cm below the ileocecal valve**.

### Dimensions
| Parameter | Value |
|-----------|-------|
| Length | 6-9 cm (range: 2-20 cm) |
| Diameter | 5-10 mm |
| Wall thickness | 1-2 mm |

### Blood Supply

> **Appendicular artery** - a branch of the ileocolic artery (from SMA). It is an **end artery** with no anastomoses, making the appendix vulnerable to ischemia.

### Position Variations

The position of the appendix is highly variable:

| Position | Frequency | Clinical Significance |
|----------|-----------|----------------------|
| **Retrocecal** | 65% | Most common. Pain may be less pronounced, psoas sign positive |
| **Pelvic** | 31% | May cause urinary symptoms, obturator sign positive |
| **Subcecal** | 2% | Standard presentation |
| **Pre-ileal** | 1% | May cause early vomiting |
| **Post-ileal** | 0.5% | May cause diarrhea |

### Surface Anatomy

**McBurney's Point**: Junction of the **lateral 1/3** and **medial 2/3** of the line joining the **right ASIS to the umbilicus**.

This is the surface marking of the **base** of the appendix (not the tip).

### Taenia Coli

The appendix can be located by following the **taenia coli** of the cecum - they converge at the base of the appendix.

---

## Histology

The appendix has all layers of the intestinal wall:

1. **Mucosa** - Columnar epithelium with abundant **lymphoid follicles** (peaks at 12-20 years)
2. **Submucosa** - Rich in lymphoid tissue (gut-associated lymphoid tissue - GALT)
3. **Muscularis** - Inner circular, outer longitudinal
4. **Serosa** - Visceral peritoneum

> The appendix is often called the "abdominal tonsil" due to its abundance of lymphoid tissue.
`
    },
    {
      id: 'pathophysiology',
      title: 'Pathophysiology',
      depth: 'mbbs',
      icon: '🔬',
      content: `
## Etiology

The fundamental event in acute appendicitis is **obstruction of the appendiceal lumen**.

### Causes of Obstruction

| Cause | Frequency | Notes |
|-------|-----------|-------|
| **Fecalith** | 35% | Hardened fecal matter, most common in adults |
| **Lymphoid hyperplasia** | 60% in children | Common after viral infections |
| **Parasites** | Varies | *Enterobius vermicularis* (pinworm), *Ascaris* |
| **Foreign bodies** | Rare | Fruit seeds, pins |
| **Tumors** | 1% | Carcinoid (most common), adenocarcinoma |
| **Stricture** | Rare | Post-inflammatory |

## Pathogenesis Sequence

\`\`\`
Luminal Obstruction
        ↓
Mucus Accumulation (appendix secretes 1-2 mL/day)
        ↓
Intraluminal Pressure ↑ (>85 mmHg)
        ↓
Venous Congestion → Mucosal Ischemia
        ↓
Bacterial Invasion of Wall
        ↓
Transmural Inflammation
        ↓
Gangrene → Perforation (24-72 hours)
\`\`\`

> **Critical pressure**: When intraluminal pressure exceeds **85 mmHg** (venous pressure), mucosal ischemia begins.

## Bacteriology

The infection is **polymicrobial**:

### Aerobic Bacteria
- *Escherichia coli* (most common)
- *Pseudomonas aeruginosa*
- *Klebsiella* species

### Anaerobic Bacteria
- *Bacteroides fragilis* (most important for abscess formation)
- *Peptostreptococcus*
- *Clostridium* species

---

## Stages of Appendicitis

| Stage | Duration | Pathology | Clinical Features |
|-------|----------|-----------|-------------------|
| **Catarrhal** | 0-12h | Mucosal inflammation | Periumbilical pain, anorexia |
| **Suppurative** | 12-24h | Transmural inflammation, pus | RIF pain, tenderness |
| **Gangrenous** | 24-48h | Necrosis, thrombosis | Severe pain, then relief (nerve death) |
| **Perforated** | >48h | Perforation | Generalized peritonitis, sepsis |

### Perforation Risk

> **Perforation occurs in 20-30% of cases** and is more common in:
> - Extremes of age (children, elderly)
> - Delayed presentation
> - Immunocompromised patients
`
    },
    {
      id: 'clinical-features',
      title: 'Clinical Features',
      depth: 'mbbs',
      icon: '🩺',
      content: `
## Classic Presentation

The **classic triad** of appendicitis (present in ~50% of cases):

1. **Periumbilical pain → migrates to RIF** (within 4-6 hours)
2. **Anorexia** (almost always present)
3. **Nausea/Vomiting** (after pain onset)

> 💎 **Clinical Pearl**: Pain BEFORE vomiting suggests a surgical abdomen. Vomiting BEFORE pain suggests gastroenteritis.

## Symptom Sequence

\`\`\`
Anorexia (earliest)
    ↓
Periumbilical Pain (visceral - T10)
    ↓
Nausea/Vomiting
    ↓
RIF Pain (somatic - localization)
    ↓
Low-grade Fever (37.5-38.5°C)
\`\`\`

## Pain Character

### Visceral Pain (Early)
- **Location**: Periumbilical (T10 dermatome)
- **Character**: Dull, diffuse, colicky
- **Mechanism**: Distension of appendiceal wall

### Somatic Pain (Late)
- **Location**: Right iliac fossa (McBurney's point)
- **Character**: Sharp, well-localized, constant
- **Mechanism**: Parietal peritoneum irritation

---

## Clinical Signs

### McBurney's Point Tenderness
Point tenderness at the junction of lateral 1/3 and medial 2/3 of the line from ASIS to umbilicus.

### Rebound Tenderness (Blumberg's Sign)
Pain on sudden release of pressure - indicates peritoneal irritation.

### Special Signs

| Sign | Technique | Positive Finding | Significance |
|------|-----------|------------------|--------------|
| **Rovsing's** | Press LIF | Pain in RIF | Peritoneal irritation |
| **Psoas** | Extend right hip | Pain in RIF | Retrocecal appendix |
| **Obturator** | Flex & internally rotate hip | Pain in RIF | Pelvic appendix |
| **Dunphy's** | Ask patient to cough | Increased RIF pain | Peritonitis |
| **Cope's Psoas** | Raise extended right leg against resistance | Pain | Retrocecal appendix |

### Examination Findings

| Finding | Significance |
|---------|--------------|
| **Guarding** | Voluntary → early; Involuntary → peritonitis |
| **Rigidity** | Board-like = generalized peritonitis |
| **Absent bowel sounds** | Paralytic ileus |
| **Tachycardia** | Systemic response |
| **Rovsing's sign** | Referred pain confirms peritoneal irritation |

---

## Atypical Presentations

### Retrocecal Appendix (65%)
- Less abdominal tenderness
- Positive psoas sign
- Flank pain possible
- May present late

### Pelvic Appendix (31%)
- Suprapubic pain
- Urinary symptoms (frequency, dysuria)
- Diarrhea, tenesmus
- Positive obturator sign
- DRE tenderness

### Pregnancy
| Trimester | Appendix Location | Notes |
|-----------|-------------------|-------|
| 1st | RIF | Normal position |
| 2nd | Right flank | Displaced by uterus |
| 3rd | RUQ | May mimic cholecystitis |

> ⚠️ **Warning**: Perforation rate in pregnancy is 43% (vs 4-19% in non-pregnant) due to delayed diagnosis.

### Elderly Patients
- Vague symptoms
- Less fever/leukocytosis
- Higher perforation rate (50-70%)
- Higher mortality

### Pediatric Patients
- Rapid progression
- Inability to localize pain
- Higher perforation rate (30-65%)
- Appendiceal mass common
`
    },
    {
      id: 'diagnosis',
      title: 'Diagnosis & Scoring',
      depth: 'mbbs',
      icon: '🔍',
      content: `
## Clinical Diagnosis

Appendicitis is primarily a **clinical diagnosis**. The diagnosis should be suspected when:
- RIF pain + fever + leukocytosis

> 🎯 **HIGH YIELD**: Negative appendectomy rate of 15-20% is acceptable to avoid missing appendicitis.

---

## Alvarado Score (MANTRELS)

The most widely used scoring system:

### Mnemonic: **MANTRELS**

| Component | Points |
|-----------|--------|
| **M**igration of pain to RIF | 1 |
| **A**norexia | 1 |
| **N**ausea/Vomiting | 1 |
| **T**enderness in RIF | 2 |
| **R**ebound tenderness | 1 |
| **E**levated temperature (>37.3°C) | 1 |
| **L**eukocytosis (>10,000) | 2 |
| **S**hift to left (>75% neutrophils) | 1 |
| **TOTAL** | **10** |

### Interpretation

| Score | Probability | Action |
|-------|-------------|--------|
| ≤4 | Unlikely | Discharge with advice |
| 5-6 | Possible | Observe, imaging |
| 7-8 | Probable | Surgery likely |
| ≥9 | Very probable | Operate |

---

## Laboratory Investigations

| Test | Finding | Notes |
|------|---------|-------|
| **WBC count** | 10,000-18,000/mm³ | >18,000 suggests perforation |
| **Neutrophilia** | >75% | Left shift |
| **CRP** | Elevated | Higher in complicated cases |
| **Urinalysis** | Few RBCs, WBCs | To rule out UTI (sterile pyuria possible) |
| **Pregnancy test** | Essential in females | Rule out ectopic |

> 📝 **EXAM TIP**: Normal WBC count does not rule out appendicitis. Up to 10% of patients have normal WBC.

---

## Imaging

### Ultrasonography
**First-line in children and pregnant women**

| Finding | Significance |
|---------|--------------|
| Aperistaltic, non-compressible tube | Diagnostic |
| Diameter >6 mm | Suggestive |
| Target sign (axial view) | Pathognomonic |
| Periappendiceal fluid | Complicated |
| Appendicolith | Supportive |

- Sensitivity: 75-90%
- Specificity: 85-95%
- Limitation: Operator-dependent, obesity, retrocecal position

### CT Scan (Gold Standard)
**Most accurate imaging modality**

| Finding | Significance |
|---------|--------------|
| Dilated appendix >6 mm | Suggestive |
| Wall enhancement | Inflammation |
| Periappendiceal fat stranding | Inflammation |
| Appendicolith | 25-30% of cases |
| Abscess | Complicated |

- **Sensitivity**: 94%
- **Specificity**: 95%
- **Accuracy**: 98%

> 💎 **Clinical Pearl**: CT can identify alternative diagnoses in 15% of cases (mesenteric adenitis, ovarian pathology, etc.)

### MRI
- Alternative in pregnancy (2nd/3rd trimester)
- No radiation exposure
- Sensitivity: 90-95%

---

## Differential Diagnosis

### Surgical
- Meckel's diverticulitis
- Mesenteric adenitis
- Intussusception
- Cecal diverticulitis
- Right-sided colonic cancer

### Gynecological
- Ruptured ovarian cyst
- Ovarian torsion
- Ectopic pregnancy
- PID/Salpingitis
- Mittelschmerz

### Urological
- Right ureteric colic
- UTI
- Pyelonephritis

### Medical
- Gastroenteritis
- Mesenteric ischemia
- Diabetic ketoacidosis
- Pneumonia (right lower lobe)
`
    },
    {
      id: 'management',
      title: 'Management',
      depth: 'mbbs',
      icon: '💊',
      content: `
## Principles

> **Appendectomy is the definitive treatment** for acute appendicitis.

The dictum "When in doubt, take it out" has evolved. With modern imaging, we aim for **diagnostic accuracy** before surgery.

---

## Preoperative Management

### Initial Resuscitation
1. **NPO** (Nil per oral)
2. **IV fluids** - Correction of dehydration
3. **Analgesia** - Does not mask signs (opioids acceptable)
4. **Antibiotics** - Start immediately

### Antibiotic Regimen

| Setting | Regimen |
|---------|---------|
| **Uncomplicated** | Single dose preop (Ceftriaxone + Metronidazole) |
| **Complicated** | Continue for 3-5 days postop |

Typical regimen:
- **Ceftriaxone** 2g IV + **Metronidazole** 500mg IV
- Alternative: Piperacillin-Tazobactam 4.5g IV

---

## Surgical Options

### 1. Laparoscopic Appendectomy (Gold Standard)

**Advantages:**
- ✅ Less postoperative pain
- ✅ Shorter hospital stay (1 day vs 3 days)
- ✅ Earlier return to work
- ✅ Better cosmesis
- ✅ Lower wound infection rate
- ✅ Diagnostic advantage (can visualize entire abdomen)

**Technique:**
- 3 ports (umbilical, suprapubic, LIF)
- Mesoappendix divided with clips/energy device
- Base divided with endoloop or stapler
- Appendix removed in bag

### 2. Open Appendectomy

**Indications:**
- Laparoscopy unavailable
- Appendicular mass (relative)
- Extensive adhesions
- Patient factors (cardiac disease, etc.)

**Incisions:**
| Incision | Description | Indication |
|----------|-------------|------------|
| **McBurney's** | Oblique, muscle-splitting | Standard |
| **Lanz** | Transverse, cosmetic | Standard, better cosmesis |
| **Rutherford-Morrison** | Extended, if needed | Difficult cases |
| **Midline** | Vertical | Diagnostic uncertainty |

---

## Complicated Appendicitis

### Appendicular Mass (Phlegmon)

**Ochsner-Sherren Regimen** (Conservative management):

\`\`\`
Day 1-3:
  - NPO, IV fluids
  - IV antibiotics
  - Mark mass edges daily
  - Monitor temperature, WBC

If improving (mass shrinking):
  - Continue conservative
  - Start liquids → solids

If not improving or deteriorating:
  - Surgery

After resolution:
  - Interval appendectomy at 6 weeks
\`\`\`

### Appendicular Abscess

1. **CT-guided percutaneous drainage**
2. IV antibiotics
3. Interval appendectomy at 6-8 weeks

> 💎 **Clinical Pearl**: Immediate surgery for abscess has higher complication rates. Drainage + interval appendectomy is preferred.

### Perforated Appendicitis

- **Emergency surgery** (laparoscopic preferred if stable)
- Copious peritoneal lavage
- Drain placement if needed
- Extended antibiotics (5-7 days)

---

## Postoperative Care

### Uncomplicated
- Early ambulation
- Oral fluids when tolerated
- Discharge day 1-2
- Follow-up in 2 weeks

### Complicated
- IV antibiotics until afebrile for 24h
- Drain removal when output <30 mL/day
- Discharge when tolerating diet, afebrile
- Follow-up with histopathology

---

## Special Situations

### Pregnancy

| Aspect | Recommendation |
|--------|----------------|
| **Preferred approach** | Laparoscopic (1st/2nd trimester) |
| **Timing** | Emergency surgery - don't delay |
| **Tocolytics** | Not routine, only if contractions |
| **Fetal monitoring** | Pre and post-operative |

> ⚠️ **Warning**: Appendicitis is the most common non-obstetric surgical emergency in pregnancy. Delay increases fetal loss.

### Pediatric
- Higher perforation rate
- Laparoscopic approach preferred
- Earlier antibiotic therapy

### Elderly
- Liberal use of CT scan
- Aggressive resuscitation
- Higher threshold for conservative management
`
    },
    {
      id: 'complications',
      title: 'Complications',
      depth: 'pg',
      icon: '⚠️',
      content: `
## Preoperative Complications

### 1. Perforation
- **Incidence**: 20-30% overall, higher in children/elderly
- **Timing**: Usually after 24-36 hours of symptoms
- **Features**: Transient relief (nerve death) → severe pain (peritonitis)

### 2. Appendicular Mass
- Walled-off inflammation by omentum and loops
- Presents day 3-5
- Palpable RIF mass
- Treatment: Conservative (Ochsner-Sherren)

### 3. Appendicular Abscess
- Localized collection of pus
- Features: Swinging fever, tender mass
- Diagnosis: CT scan
- Treatment: Drainage + interval appendectomy

### 4. Pylephlebitis (Portal Pyemia)
- **Rare but serious** - suppurative thrombophlebitis of portal vein
- Features: High fever, rigors, jaundice, hepatomegaly
- Diagnosis: CT with contrast (portal vein thrombosis)
- Treatment: Prolonged antibiotics, anticoagulation

---

## Postoperative Complications

### Early (<30 days)

| Complication | Incidence | Management |
|--------------|-----------|------------|
| **Wound infection** | 3-5% (open), 1-2% (lap) | Antibiotics, wound care |
| **Intra-abdominal abscess** | 2-3% | CT-guided drainage |
| **Ileus** | 5-10% | Conservative, NGT if needed |
| **Bleeding** | <1% | Re-exploration if significant |
| **Stump leak** | <1% | Re-exploration, drainage |

### Late (>30 days)

| Complication | Incidence | Management |
|--------------|-----------|------------|
| **Adhesive obstruction** | 2-5% | Conservative → surgery |
| **Incisional hernia** | 1-3% | Surgical repair |
| **Stump appendicitis** | Rare | Re-operation |
| **Infertility** | Controversial | Unknown significance |

---

## Stump Appendicitis

Inflammation of the residual appendiceal stump.

**Causes:**
- Incomplete appendectomy (stump >5mm)
- Difficult visualization during initial surgery

**Features:**
- Recurrent RIF pain
- Often misdiagnosed

**Diagnosis:**
- CT scan showing inflamed stump
- Previous appendectomy history

**Treatment:**
- Completion appendectomy

> 📝 **EXAM TIP**: When presented with RIF pain + history of appendectomy, always consider stump appendicitis.

---

## Negative Appendectomy

### Definition
Histologically normal appendix removed for suspected appendicitis.

### Acceptable Rate
- **Historically**: 15-20%
- **With CT**: <5%

### Implications
- Unnecessary surgery
- Hospital costs
- Potential complications
- But still better than missing appendicitis!

> "It is better to remove 10 normal appendices than to miss one case of appendicitis and have the patient die of peritonitis."
`
    },
    {
      id: 'special-situations',
      title: 'Special Situations & Advanced Topics',
      depth: 'superSpecialty',
      icon: '🎓',
      content: `
## Appendiceal Neoplasms

### 1. Carcinoid Tumors
**Most common appendiceal neoplasm** (accounting for 85% of appendiceal tumors)

| Size | Management |
|------|------------|
| <1 cm | Appendectomy sufficient |
| 1-2 cm | Appendectomy if base clear, mesoappendiceal invasion absent |
| >2 cm | Right hemicolectomy |

**Features:**
- Usually incidental finding
- Tip location (75%)
- Excellent prognosis (5-year survival >95% for localized)
- May cause carcinoid syndrome if metastatic (rare)

### 2. Adenocarcinoma
- Rare (0.1-0.2% of appendectomies)
- Treatment: **Right hemicolectomy** (regardless of size)
- Staging and treatment similar to colon cancer
- May present as acute appendicitis

### 3. Mucinous Neoplasms

| Type | Features | Concern |
|------|----------|---------|
| **LAMN** (Low-grade appendiceal mucinous neoplasm) | Mucin production, pushes into wall | Pseudomyxoma peritonei |
| **HAMN** (High-grade) | More aggressive | Peritoneal spread |
| **Mucinous adenocarcinoma** | Invasive | Oncologic resection |

### Pseudomyxoma Peritonei (PMP)
- "Jelly belly" - mucinous ascites
- Usually from ruptured appendiceal mucinous neoplasm
- Treatment: Cytoreductive surgery + HIPEC
- Prognosis varies by grade

---

## Antibiotics-Only Treatment

### Non-operative Management

Recent trials (APPAC, CODA) have evaluated antibiotics-only approach.

**CODA Trial (2020):**
| Outcome | Antibiotics | Surgery |
|---------|-------------|---------|
| Treatment failure at 90 days | 29% | N/A |
| Serious adverse events | Similar | Similar |
| Quality of life | Similar | Similar |

**Current Consensus:**
- May be considered for uncomplicated appendicitis
- Recurrence rate: 25-40% at 1 year
- Not recommended if appendicolith present
- Shared decision-making with patient

> 💎 **Clinical Pearl**: Appendicolith presence predicts failure of conservative management. These patients should have surgery.

---

## Interval Appendectomy

### After Appendicular Mass/Abscess

**Controversy:**
- Traditional: Always perform interval appendectomy at 6-8 weeks
- Recent trend: Selective approach

**Arguments FOR:**
- Prevents recurrence (10-20%)
- Excludes malignancy (2-5% occult tumors)
- Definitive treatment

**Arguments AGAINST:**
- Additional surgery and costs
- Recurrence rate may be acceptable
- Most recurrences manageable

**Current Approach:**
- Routine colonoscopy if age >40 (exclude cecal pathology)
- Interval appendectomy if: recurrence, appendicolith, suspicious features

---

## Natural Orifice Surgery (NOTES)

### Transvaginal/Transgastric Appendectomy
- Experimental
- No visible scars
- Limited adoption

### Single-Incision Laparoscopic Surgery (SILS)
- Single umbilical incision
- Cosmetic advantage
- Technically challenging
- Similar outcomes to conventional laparoscopy

---

## Future Directions

1. **AI-based diagnosis** - Machine learning for CT interpretation
2. **Biomarkers** - Novel markers for early diagnosis
3. **Prophylactic appendectomy** - Role in certain populations?
4. **Microbiome research** - Understanding appendix function

---

## Key Exam Points

### High-Yield Facts

| Topic | Key Point |
|-------|-----------|
| Most common position | Retrocecal (65%) |
| Most common cause | Fecalith (adults), Lymphoid hyperplasia (children) |
| Blood supply | Appendicular artery (end artery) |
| Most common organism | E. coli (aerobe), Bacteroides (anaerobe) |
| Scoring system | Alvarado (MANTRELS) |
| Gold standard imaging | CT scan (94% sensitivity) |
| Gold standard treatment | Laparoscopic appendectomy |
| Perforation timing | After 24-36 hours |
| Mass management | Ochsner-Sherren regimen |
| Abscess management | CT-guided drainage → interval appendectomy |
| Most common appendiceal tumor | Carcinoid |

### Classic Exam Questions

1. **Pain before vomiting** = Surgical abdomen (vs gastroenteritis)
2. **Murphy's sequence**: Pain → Vomiting → Fever
3. **McBurney's point**: 1/3 from ASIS to umbilicus
4. **Rovsing's sign**: LIF pressure → RIF pain
5. **Alvarado ≥7**: Probable appendicitis
6. **Retrocecal appendix**: Psoas sign positive
7. **Pelvic appendix**: Obturator sign positive
8. **CRP component**: NOT in Alvarado score
`
    }
  ],

  // Quick reference sections
  keyPoints: [
    "Most common surgical emergency worldwide",
    "Peak incidence: 10-30 years",
    "Lifetime risk: 7-8%",
    "Perforation risk increases after 24-36 hours",
    "Laparoscopic approach is gold standard",
  ],

  mnemonics: [
    {
      title: "MANTRELS (Alvarado Score)",
      content: `**M**igration of pain to RIF (1)
**A**norexia (1)
**N**ausea/Vomiting (1)
**T**enderness RIF (2)
**R**ebound tenderness (1)
**E**levated temperature (1)
**L**eukocytosis (2)
**S**hift to left (1)

**Total: 10 points**`,
    },
    {
      title: "Murphy's Sequence",
      content: `The order of symptoms in appendicitis:
1. **P**ain (periumbilical)
2. **V**omiting
3. **F**ever
4. **L**ocalization (RIF)

*"Pain, Vomit, Fever, Localize"*`,
    },
    {
      title: "Appendix Positions",
      content: `**R**etrocecal - **R**eally common (65%)
**P**elvic - **P**ossible (31%)
**S**ubcecal - **S**mall chance (2%)

*"RPS - like playing games with the position"*`,
    },
  ],

  clinicalPearls: [
    "Pain BEFORE vomiting = Surgical abdomen",
    "Elderly present atypically - have low threshold for imaging",
    "In pregnancy, appendix shifts upward - RUQ pain in 3rd trimester",
    "Appendicolith on imaging predicts failure of conservative management",
    "Normal WBC does not rule out appendicitis",
    "CT is the gold standard - don't hesitate to order it when in doubt",
  ],

  examTips: [
    "CRP is NOT part of the Alvarado score - common trick question",
    "Retrocecal appendix → Psoas sign positive",
    "Pelvic appendix → Obturator sign positive",
    "Carcinoid <1cm → Appendectomy is sufficient",
    "Carcinoid >2cm → Right hemicolectomy",
  ],
};
