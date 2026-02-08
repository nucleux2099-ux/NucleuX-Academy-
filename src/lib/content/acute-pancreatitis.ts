/**
 * Acute Pancreatitis - Full Medical Content
 * 
 * Comprehensive content covering:
 * - Etiology and pathophysiology
 * - Severity assessment and management
 * - Complications and interventions
 */

export const ACUTE_PANCREATITIS_CONTENT = {
  id: 'surg-gi-acute-pancreatitis',
  name: 'Acute Pancreatitis',
  
  concepts: [
    {
      id: 'anatomy',
      title: 'Pancreatic Anatomy',
      depth: 'mbbs',
      icon: '🫀',
      content: `
## Gross Anatomy

### Location
- **Retroperitoneal** (except tail)
- Extends from duodenal C-loop to splenic hilum
- Lies at **L1-L2 vertebral level**

### Parts of the Pancreas

| Part | Relations | Notes |
|------|-----------|-------|
| **Head** | Within C-loop of duodenum | Uncinate process hooks behind SMV |
| **Neck** | Over portal vein/SMV | Thinnest part |
| **Body** | Anterior to aorta, L1 | Forms stomach bed |
| **Tail** | In splenorenal ligament | Only intraperitoneal part |

### Ductal Anatomy

\`\`\`
Main Pancreatic Duct (Wirsung)
  └─→ Opens at Major papilla (Ampulla of Vater)
      (with CBD)

Accessory Duct (Santorini)
  └─→ Opens at Minor papilla
      (2 cm proximal to major)
\`\`\`

**Pancreas divisum**: Failure of fusion of dorsal and ventral ducts
- Present in 5-10% of population
- May predispose to pancreatitis

---

## Blood Supply

### Arterial

| Region | Arteries |
|--------|----------|
| **Head** | Superior & Inferior pancreaticoduodenal (from GDA & SMA) |
| **Body/Tail** | Splenic artery branches |

### Venous
- Drains into **splenic vein** and **SMV**
- Forms part of portal vein

---

## Exocrine Function

### Pancreatic Juice
- **Volume**: 1-2 L/day
- **pH**: 7.5-8.8 (alkaline)
- **Composition**: Water, bicarbonate, enzymes

### Digestive Enzymes

| Enzyme | Substrate | Secreted as |
|--------|-----------|-------------|
| **Trypsin** | Proteins | Trypsinogen |
| **Chymotrypsin** | Proteins | Chymotrypsinogen |
| **Lipase** | Fats | Active form |
| **Amylase** | Starch | Active form |
| **Phospholipase A2** | Phospholipids | Proenzyme |

> 💎 **Key Point**: Lipase and amylase are secreted in **active form**; proteases are secreted as **zymogens** (inactive)

### Activation Cascade

\`\`\`
Enterokinase (from duodenum)
        ↓
Trypsinogen → TRYPSIN
        ↓
Trypsin activates all other zymogens
\`\`\`

> 📝 **EXAM TIP**: Enterokinase is the key to the activation cascade - protects pancreas from autodigestion
`
    },
    {
      id: 'etiology',
      title: 'Etiology',
      depth: 'mbbs',
      icon: '🔬',
      content: `
## Definition

**Acute pancreatitis** is an acute inflammatory process of the pancreas with variable involvement of regional tissues and remote organ systems.

---

## Causes - "I GET SMASHED"

| Letter | Cause | Frequency |
|--------|-------|-----------|
| **I** | Idiopathic | 10-15% |
| **G** | Gallstones | **35-40%** |
| **E** | Ethanol (Alcohol) | **35-40%** |
| **T** | Trauma | 1-2% |
| **S** | Steroids | Rare |
| **M** | Mumps/Malignancy | Rare |
| **A** | Autoimmune | 2-5% |
| **S** | Scorpion sting | Regional |
| **H** | Hyperlipidemia/Hypercalcemia/Hypothermia | 5% |
| **E** | ERCP | 2-5% |
| **D** | Drugs | 2-5% |

> 💎 **Key Point**: **Gallstones + Alcohol = 70-80%** of all acute pancreatitis cases

---

## Gallstone Pancreatitis

### Mechanism

\`\`\`
Stone migrates from GB
        ↓
Impacts at Ampulla of Vater
        ↓
Obstruction of pancreatic duct
        ↓
Bile reflux into pancreatic duct
        ↓
Enzyme activation + autodigestion
\`\`\`

**Risk factors for gallstone pancreatitis:**
- Multiple small stones (<5 mm)
- Wide cystic duct
- Common channel anatomy

### Prediction
**Gallstone pancreatitis indicators:**
- Female
- Age >50
- ALT >150 IU/L (3x upper limit)
- Dilated CBD on imaging
- Visible stone

---

## Alcoholic Pancreatitis

### Mechanism

\`\`\`
Chronic alcohol use (usually >5 years)
        ↓
↑ Enzyme synthesis + ↑ Zymogen sensitivity
↓ Trypsin inhibitor
        ↓
Protein plugs in small ducts
        ↓
Ductal obstruction + enzyme activation
        ↓
Acute on chronic injury
\`\`\`

> 📝 **EXAM TIP**: Alcoholic pancreatitis usually requires years of heavy use; first episode may indicate underlying chronic pancreatitis

---

## Drug-Induced Pancreatitis

### High-Risk Drugs (Definite Association)

| Drug Class | Examples |
|------------|----------|
| **Immunosuppressants** | Azathioprine, 6-MP |
| **Antiretrovirals** | Didanosine |
| **Antiepileptics** | Valproic acid |
| **Antibiotics** | Metronidazole, tetracycline |
| **Diuretics** | Furosemide, thiazides |
| **Others** | L-asparaginase |

---

## Hypertriglyceridemia

- **Threshold**: TG >1000 mg/dL
- **Mechanism**: Free fatty acid toxicity to acinar cells
- **Treatment**: Plasmapheresis if severe; insulin infusion

---

## Hypercalcemia

- **Mechanism**: Calcium activates trypsinogen
- **Causes**: Hyperparathyroidism (most common)
- **Clue**: Recurrent pancreatitis + kidney stones

---

## Autoimmune Pancreatitis

### Type 1 (IgG4-related)
- Elevated IgG4
- Systemic disease
- "Sausage-shaped" pancreas
- Responds to steroids

### Type 2
- Granulocytic epithelial lesions
- Associated with IBD
- No IgG4 elevation

---

## Post-ERCP Pancreatitis

- **Incidence**: 2-10%
- **Risk factors**: 
  - Sphincter of Oddi dysfunction
  - Difficult cannulation
  - Pancreatic duct injection
- **Prevention**: Rectal indomethacin, pancreatic stent
`
    },
    {
      id: 'pathophysiology',
      title: 'Pathophysiology',
      depth: 'mbbs',
      icon: '🔬',
      content: `
## Pathogenesis

### Central Event: Premature Enzyme Activation

\`\`\`
Triggering event (stone, alcohol, etc.)
        ↓
Trypsinogen → TRYPSIN (within acinar cells)
        ↓
Trypsin activates other zymogens:
  - Phospholipase A2 → Cell membrane damage
  - Elastase → Vascular damage, bleeding
  - Lipase → Fat necrosis
        ↓
Autodigestion of pancreas
        ↓
Release of inflammatory mediators
  (IL-1, IL-6, TNF-α, PAF)
        ↓
SIRS → MODS
\`\`\`

---

## Types of Acute Pancreatitis

### 1. Interstitial Edematous Pancreatitis (80-85%)

**Features:**
- Diffuse enlargement of pancreas
- Inflammatory edema
- **No necrosis**
- Usually mild, self-limiting
- Resolves in 1-2 weeks

### 2. Necrotizing Pancreatitis (15-20%)

**Features:**
- Pancreatic parenchymal necrosis
- Peripancreatic fat necrosis
- **High morbidity/mortality**
- May become infected

---

## Systemic Inflammatory Response

\`\`\`
Local pancreatic injury
        ↓
Cytokine release (IL-1, IL-6, TNF-α)
        ↓
Systemic Inflammatory Response Syndrome (SIRS)
        ↓
Organ dysfunction:
  - Lungs: ARDS
  - Kidneys: AKI
  - Heart: Shock
  - Liver: Hepatic dysfunction
        ↓
Multi-Organ Dysfunction Syndrome (MODS)
\`\`\`

---

## Fat Necrosis

### Mechanism
\`\`\`
Lipase released
        ↓
Digests peripancreatic fat
        ↓
Free fatty acids released
        ↓
Bind to calcium → Saponification
        ↓
HYPOCALCEMIA (Cullen's/Grey Turner's signs)
\`\`\`

> 💎 **Clinical Pearl**: Hypocalcemia in pancreatitis = worse prognosis (indicates extensive fat necrosis)

---

## Phases of Severe Acute Pancreatitis

| Phase | Timing | Pathology | Focus |
|-------|--------|-----------|-------|
| **Early** | Week 1-2 | SIRS, organ failure | Supportive care, ICU |
| **Late** | Week 2-4+ | Local complications, infection | Intervention if infected necrosis |

> 📝 **EXAM TIP**: Early deaths = organ failure from SIRS; Late deaths = infected necrosis and sepsis
`
    },
    {
      id: 'clinical-features',
      title: 'Clinical Presentation',
      depth: 'mbbs',
      icon: '🩺',
      content: `
## Classic Presentation

### Pain
- **Severe, constant** epigastric pain
- Radiates to **back** (50%)
- "Boring" in character
- Worse supine, better **leaning forward**
- Sudden onset (may suggest gallstone etiology)

### Associated Symptoms
- Nausea and vomiting (90%)
- Anorexia
- Abdominal distension

---

## Physical Examination

### Vital Signs
| Finding | Significance |
|---------|--------------|
| Fever | Inflammatory response, infection |
| Tachycardia | Hypovolemia, pain, SIRS |
| Hypotension | Severe disease, third-spacing |
| Tachypnea | ARDS, pleural effusion |

### Abdominal Signs

| Sign | Features |
|------|----------|
| **Tenderness** | Epigastric, diffuse if severe |
| **Guarding** | Variable, may be minimal (retroperitoneal) |
| **Distension** | Ileus |
| **Decreased bowel sounds** | Ileus |

### Special Signs

| Sign | Description | Significance |
|------|-------------|--------------|
| **Cullen's sign** | Periumbilical ecchymosis | Retroperitoneal hemorrhage |
| **Grey Turner's sign** | Flank ecchymosis | Retroperitoneal hemorrhage |
| **Fox's sign** | Inguinal ecchymosis | Retroperitoneal hemorrhage |

> 💎 **Clinical Pearl**: Cullen's and Grey Turner's signs appear 24-48 hours after onset and indicate severe disease (1% of cases)

---

## Spectrum of Severity

### Mild Acute Pancreatitis (80%)
- No organ failure
- No local complications
- Resolves in 3-5 days

### Moderately Severe (10-15%)
- Transient organ failure (<48 hours)
- Local complications
- May require extended hospitalization

### Severe Acute Pancreatitis (5-10%)
- Persistent organ failure (>48 hours)
- Local and systemic complications
- High mortality (15-30%)

---

## Organ Failure Definitions (Modified Marshall Score)

| System | Score 2 (Organ Failure) |
|--------|------------------------|
| **Respiratory** | PaO2/FiO2 <300 or supplemental O2 needed |
| **Renal** | Creatinine ≥1.9 mg/dL |
| **Cardiovascular** | SBP <90 despite fluid resuscitation |

> 📝 **EXAM TIP**: Organ failure persisting >48 hours = severe pancreatitis = high mortality
`
    },
    {
      id: 'diagnosis-severity',
      title: 'Diagnosis & Severity Assessment',
      depth: 'mbbs',
      icon: '🔍',
      content: `
## Diagnostic Criteria (Revised Atlanta 2012)

**Requires 2 of 3 criteria:**

1. **Abdominal pain** characteristic of pancreatitis
2. **Serum lipase or amylase** ≥3× upper limit of normal
3. **Imaging findings** characteristic of pancreatitis

---

## Laboratory Investigations

### Diagnostic

| Test | Characteristics |
|------|-----------------|
| **Lipase** | More specific, stays elevated longer (8-14 days) |
| **Amylase** | Rises early, falls faster (3-5 days) |

**Lipase is preferred** - more sensitive and specific

### Other Labs

| Test | Purpose/Finding |
|------|-----------------|
| **CBC** | Leukocytosis (>10,000), hemoconcentration |
| **BMP** | BUN ↑ (dehydration), Creatinine (AKI), Glucose ↑ |
| **LFTs** | ALT >150 suggests gallstone etiology |
| **Calcium** | ↓ indicates severity |
| **LDH** | Elevated in severe disease |
| **Triglycerides** | If >1000, likely etiology |
| **ABG** | Hypoxemia indicates respiratory failure |

> 💎 **Clinical Pearl**: ALT >150 IU/L has 95% PPV for gallstone pancreatitis

---

## Imaging

### CT Scan (Contrast-Enhanced)

**Not needed for diagnosis** but useful for:
- Uncertain diagnosis
- Failing to improve at 48-72 hours
- Assessing severity and complications

**Timing**: Best at 72-96 hours (necrosis takes time to demarcate)

**CT Severity Index (CTSI)**

| Parameter | Points |
|-----------|--------|
| **Pancreas:** | |
| Normal | 0 |
| Focal/diffuse enlargement | 1 |
| Peripancreatic inflammation | 2 |
| Single fluid collection | 3 |
| ≥2 collections or gas | 4 |
| **Necrosis:** | |
| None | 0 |
| <33% | 2 |
| 33-50% | 4 |
| >50% | 6 |

**CTSI Score:** 0-3 = Mild; 4-6 = Moderate; 7-10 = Severe

### Ultrasound
- **First-line for gallstone detection**
- May show dilated CBD
- Limited for pancreas visualization

### MRCP
- For ductal anatomy
- CBD stones if US inconclusive
- Avoid ERCP complications

---

## Severity Scoring Systems

### APACHE II (Admission)
- 12 physiologic variables
- Score ≥8 = severe pancreatitis
- Complex, used mainly in ICU

### Ranson's Criteria

**At Admission:**
| Criterion | Value |
|-----------|-------|
| Age | >55 years |
| WBC | >16,000/mm³ |
| Glucose | >200 mg/dL |
| LDH | >350 IU/L |
| AST | >250 IU/L |

**At 48 Hours:**
| Criterion | Value |
|-----------|-------|
| Hematocrit drop | >10% |
| BUN rise | >5 mg/dL |
| Calcium | <8 mg/dL |
| PaO2 | <60 mmHg |
| Base deficit | >4 mEq/L |
| Fluid sequestration | >6 L |

> 📝 **EXAM TIP**: Ranson's ≥3 = severe; ≥6 = high mortality (>40%)

### BISAP Score (Simpler, at 24 hours)

| Component | Points |
|-----------|--------|
| **B**UN >25 mg/dL | 1 |
| **I**mpaired mental status | 1 |
| **S**IRS criteria (≥2 met) | 1 |
| **A**ge >60 years | 1 |
| **P**leural effusion | 1 |

**Score ≥3** = 10× mortality risk

### SIRS Criteria

Presence of ≥2 of:
- Temperature >38°C or <36°C
- Heart rate >90/min
- Respiratory rate >20/min or PaCO2 <32 mmHg
- WBC >12,000 or <4,000 or >10% bands

> 💎 **Clinical Pearl**: Persistent SIRS at 48 hours predicts organ failure and mortality
`
    },
    {
      id: 'management',
      title: 'Management',
      depth: 'mbbs',
      icon: '💊',
      content: `
## Principles of Treatment

> **Acute pancreatitis is primarily managed supportively.**

Key goals:
1. Aggressive fluid resuscitation
2. Pain control
3. Nutritional support
4. Treat underlying cause
5. Monitor for and manage complications

---

## Initial Management

### 1. Fluid Resuscitation (CRITICAL)

\`\`\`
FIRST 12-24 HOURS:
  - Crystalloid (LR preferred) 
  - Rate: 5-10 mL/kg/hour initially
  - Goal: Urine output >0.5 mL/kg/hour
         BUN decrease
         Hematocrit normalize
\`\`\`

**Why aggressive fluids?**
- Third-spacing causes massive fluid loss
- Hypovolemia worsens pancreatic necrosis
- Early resuscitation reduces complications

> ⚠️ **Caution**: Avoid over-resuscitation → pulmonary edema, abdominal compartment syndrome

### 2. Pain Management

| Agent | Notes |
|-------|-------|
| **IV opioids** | Hydromorphone, fentanyl preferred |
| **Morphine** | Acceptable (sphincter spasm concern unproven) |
| **PCA** | For moderate-severe pain |
| **Avoid NSAIDs** | Risk of AKI in hypovolemia |

### 3. NPO and Gastric Rest

- **NPO initially** (until pain resolves, ileus improves)
- NG tube only if vomiting or ileus

### 4. ICU Admission Criteria

- Organ failure (any)
- APACHE II ≥8
- Ranson's ≥3
- BISAP ≥3
- Hemodynamic instability

---

## Nutritional Support

### Timing
- **Early enteral nutrition** (within 24-72 hours) reduces complications
- Oral diet when: Pain resolved, tolerating liquids

### Route

| Route | Indication |
|-------|------------|
| **Oral** | Mild pancreatitis, low-fat diet |
| **Nasogastric** | Equally effective as NJ, easier |
| **Nasojejunal** | Severe ileus, gastric intolerance |
| **TPN** | ONLY if enteral fails (last resort) |

> 💎 **Clinical Pearl**: Enteral nutrition maintains gut barrier, reduces bacterial translocation, and lowers infection risk

---

## Management of Gallstone Pancreatitis

### Urgent ERCP (<24 hours)

**Indications:**
- Acute cholangitis
- Persistent biliary obstruction (rising bilirubin)
- Visible impacted stone

> 📝 **EXAM TIP**: Routine ERCP NOT indicated for all gallstone pancreatitis

### Cholecystectomy Timing

| Scenario | Timing |
|----------|--------|
| **Mild gallstone pancreatitis** | Same admission (before discharge) |
| **Severe/necrotizing** | After recovery (6-8 weeks) |
| **With CBD stones** | ERCP + cholecystectomy |

> ⚠️ **Important**: Delaying cholecystectomy → 25-30% recurrence within 6 weeks

---

## Alcoholic Pancreatitis

- Stop alcohol (counseling, support)
- Thiamine supplementation
- Address nutritional deficiencies
- Screen for chronic pancreatitis

---

## Prophylactic Antibiotics

> **NOT routinely recommended**

**Rationale:**
- No proven benefit in sterile necrosis
- Increases fungal infection risk
- Select resistant organisms

**Consider only if:**
- Documented infected necrosis
- Proven infection elsewhere
`
    },
    {
      id: 'complications',
      title: 'Local Complications',
      depth: 'pg',
      icon: '⚠️',
      content: `
## Classification (Revised Atlanta)

### Based on Content

| Type | Content | Wall | Timing |
|------|---------|------|--------|
| **APFC** (Acute Peripancreatic Fluid Collection) | Fluid only | No wall | <4 weeks |
| **Pseudocyst** | Fluid only | Defined wall | ≥4 weeks |
| **ANC** (Acute Necrotic Collection) | Necrosis ± fluid | No wall | <4 weeks |
| **WON** (Walled-Off Necrosis) | Necrosis ± fluid | Defined wall | ≥4 weeks |

---

## Acute Peripancreatic Fluid Collections (APFC)

- **Timing**: <4 weeks from onset
- **Features**: Homogeneous fluid, no wall
- **Natural history**: Most resolve spontaneously
- **Management**: Observation only

---

## Pancreatic Pseudocyst

### Features
- Develops ≥4 weeks after pancreatitis
- Well-defined fibrous wall
- Contains fluid (no solid debris)
- Amylase-rich fluid

### Clinical Presentation
- May be asymptomatic
- Abdominal pain, early satiety
- Palpable mass (large cysts)
- Complications (see below)

### Indications for Intervention

| Indication | Notes |
|------------|-------|
| **Symptomatic** | Pain, obstruction |
| **Enlarging** | >6 cm and growing |
| **Complicated** | Infection, bleeding, rupture |
| **Duration** | >6 weeks with symptoms |

### Treatment Options

| Method | Approach |
|--------|----------|
| **Endoscopic drainage** | Transgastric or transduodenal (EUS-guided) |
| **Percutaneous drainage** | CT-guided, external drain |
| **Surgical** | Cystogastrostomy, cystojejunostomy |

> 💎 **Clinical Pearl**: Wait 6 weeks for wall maturation before drainage (mature wall needed for surgical anastomosis)

---

## Necrotizing Pancreatitis

### Natural History

\`\`\`
Week 1: Inflammation, SIRS
        ↓
Week 2-3: Necrosis demarcates
        ↓
Week 4+: WON forms (if doesn't resolve)
        ↓
Sterile WON → May resolve or persist
Infected WON → Requires intervention
\`\`\`

### Infected Necrosis

**How to suspect:**
- Clinical deterioration at week 2-4
- New fever, leukocytosis
- Gas bubbles in necrosis on CT

**Confirmation:**
- CT-guided fine needle aspiration
- Gram stain and culture

### Management of Infected Necrosis

\`\`\`
Diagnosis confirmed
        ↓
IV antibiotics (carbapenems, quinolones)
        ↓
Delay intervention if possible (4 weeks for walling off)
        ↓
Step-up approach:
  1. Percutaneous/endoscopic drainage
  2. If fails: Video-assisted retroperitoneal debridement (VARD)
  3. If fails: Open necrosectomy (last resort)
\`\`\`

> 📝 **EXAM TIP**: "Step-up approach" = drainage first, surgery as last resort; better outcomes than early surgery

---

## Other Local Complications

### Splenic Vein Thrombosis
- Occurs in 10-20% of severe cases
- Leads to left-sided portal hypertension
- Gastric varices, splenomegaly
- Treatment: Splenectomy if symptomatic varices

### Pseudoaneurysm
- Splenic, gastroduodenal, or other arteries
- Risk of massive bleeding
- Diagnosis: CT angiography
- Treatment: Angiographic embolization

### Gastric/Duodenal Obstruction
- From inflammatory mass or pseudocyst
- May require drainage or bypass

### Biliary Obstruction
- CBD compression
- Jaundice, cholangitis
- May need stenting or surgery

### Pancreatic Fistula
- Internal (to pleura, peritoneum)
- External (to skin, usually post-intervention)
- Amylase-rich fluid
- Management: Somatostatin analogs, ERCP + stent
`
    },
    {
      id: 'special-topics',
      title: 'Advanced Topics',
      depth: 'superSpecialty',
      icon: '🎓',
      content: `
## Abdominal Compartment Syndrome

### Pathophysiology

\`\`\`
Massive fluid resuscitation
        ↓
Third-spacing into retroperitoneum and bowel
        ↓
Intra-abdominal pressure ↑
        ↓
IAH (>12 mmHg) → ACS (>20 mmHg + organ dysfunction)
\`\`\`

### Grading

| Grade | IAP (mmHg) |
|-------|------------|
| I | 12-15 |
| II | 16-20 |
| III | 21-25 |
| IV | >25 |

### Management

| IAP | Action |
|-----|--------|
| 12-15 | Optimize resuscitation, NG decompression |
| 16-20 | Consider paracentesis, restrict fluids |
| >20 + organ failure | Decompressive laparotomy |

---

## Endoscopic Approaches

### EUS-Guided Drainage of PFC/WON

**Technique:**
1. EUS identifies collection
2. Transmural puncture (transgastric/transduodenal)
3. Place LAMS (lumen-apposing metal stent)
4. Endoscopic necrosectomy if needed

**Advantages over surgery:**
- Less invasive
- Faster recovery
- Comparable success rates

### Direct Endoscopic Necrosectomy (DEN)

- Through LAMS or mature fistula
- Multiple sessions often needed
- Removes solid necrotic debris

---

## Chronic Pancreatitis vs. Recurrent Acute

| Feature | Recurrent Acute | Chronic |
|---------|-----------------|---------|
| Baseline pancreas | Normal between attacks | Structural changes |
| Function | Preserved | Declining |
| Calcifications | Absent | Present |
| Pain pattern | Episodic | Constant or recurrent |

---

## Idiopathic Pancreatitis Workup

After excluding gallstones, alcohol:

\`\`\`
1. Repeat transabdominal US
2. EUS (for microlithiasis, tumors)
3. MRCP (for anatomic variants, strictures)
4. Consider genetic testing (PRSS1, SPINK1, CFTR)
5. IgG4 for autoimmune pancreatitis
6. Triglycerides (if not checked)
7. Calcium/PTH (if not checked)
\`\`\`

---

## Necrosectomy Techniques

### Open Necrosectomy
- Reserved for failed minimally invasive approaches
- High morbidity (34%), mortality (25%)
- May require multiple operations
- Open abdomen management

### Video-Assisted Retroperitoneal Debridement (VARD)
- Through flank approach
- Uses prior drain tract
- Less morbidity than open

### Transgastric Necrosectomy
- Through EUS-created fistula
- Multiple sessions
- Effective for WON

---

## Key Exam Summary

| Topic | Key Point |
|-------|-----------|
| Top 2 causes | Gallstones + Alcohol (70-80%) |
| Diagnostic criteria | 2 of 3: Pain, Lipase ≥3× ULN, Imaging |
| Lipase vs Amylase | Lipase preferred (more specific, longer) |
| ALT >150 | 95% PPV for gallstone pancreatitis |
| Cullen's/Grey Turner's | Retroperitoneal hemorrhage, severe |
| Ranson ≥3 | Severe pancreatitis |
| Fluid resuscitation | 5-10 mL/kg/hr initially, LR preferred |
| Pseudocyst wall | Needs 6 weeks to mature |
| Infected necrosis | Gas on CT, FNA confirms |
| Step-up approach | Drainage → VARD → Open (if fails) |
| Cholecystectomy | Same admission for mild; delayed for severe |
| Prophylactic antibiotics | NOT recommended |
| Enteral nutrition | Early (24-72h), reduces infections |
`
    }
  ],

  keyPoints: [
    "Gallstones + Alcohol = 70-80% of acute pancreatitis",
    "Diagnosis: 2 of 3 - characteristic pain, lipase ≥3× ULN, imaging findings",
    "Lipase is preferred over amylase (more specific, stays elevated longer)",
    "ALT >150 IU/L has 95% PPV for gallstone etiology",
    "Aggressive fluid resuscitation (LR, 5-10 mL/kg/hr) is cornerstone of treatment",
    "Early enteral nutrition (24-72 hours) improves outcomes",
    "Prophylactic antibiotics are NOT recommended",
    "Infected necrosis: Step-up approach (drainage first, surgery last)",
  ],

  mnemonics: [
    {
      title: "Causes - I GET SMASHED",
      content: `**I**diopathic
**G**allstones (35-40%)
**E**thanol/Alcohol (35-40%)
**T**rauma
**S**teroids
**M**umps/Malignancy
**A**utoimmune
**S**corpion sting
**H**yperlipidemia/Hypercalcemia/Hypothermia
**E**RCP
**D**rugs`,
    },
    {
      title: "Ranson's Criteria at Admission",
      content: `**GA LAW**

**G**lucose >200 mg/dL
**A**ge >55 years
**L**DH >350 IU/L
**A**ST >250 IU/L
**W**BC >16,000/mm³

*At admission, remember the GA LAW*`,
    },
    {
      title: "Ranson's at 48 Hours",
      content: `**C-HOBBS**

**C**alcium <8 mg/dL
**H**ematocrit drop >10%
**O**xygen (PaO2) <60 mmHg
**B**UN rise >5 mg/dL
**B**ase deficit >4 mEq/L
**S**equestration (fluid) >6 L`,
    },
    {
      title: "BISAP Score",
      content: `**B**UN >25 mg/dL
**I**mpaired mental status
**S**IRS (≥2 criteria)
**A**ge >60 years
**P**leural effusion

*Score ≥3 = high risk*`,
    },
  ],

  clinicalPearls: [
    "CT scan is best performed at 72-96 hours (necrosis takes time to demarcate)",
    "Cullen's and Grey Turner's signs appear late (24-48 hours) and indicate severe disease",
    "Hypocalcemia indicates extensive fat necrosis - marker of severity",
    "Wait 6 weeks for pseudocyst wall to mature before drainage",
    "Gas bubbles in necrotic collection on CT = infected necrosis",
    "Don't delay cholecystectomy in mild gallstone pancreatitis - 25-30% recur within 6 weeks",
  ],

  examTips: [
    "Lipase >3× ULN is diagnostic; no need for CT if classic presentation",
    "ALT >150 = gallstone pancreatitis (not amylase level)",
    "Ranson's score ≥3 = severe; ≥6 = mortality >40%",
    "Persistent SIRS at 48 hours predicts organ failure",
    "Early deaths = SIRS/organ failure; Late deaths = infected necrosis",
    "APFC (<4 weeks, no wall) vs Pseudocyst (≥4 weeks, defined wall)",
    "Prophylactic antibiotics: NOT recommended (no benefit, increases resistance)",
    "Step-up approach for infected necrosis: drain first, surgery last",
  ],
};
