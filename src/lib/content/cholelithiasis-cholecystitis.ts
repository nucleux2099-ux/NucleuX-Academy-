/**
 * Cholelithiasis & Cholecystitis - Full Medical Content
 * 
 * Comprehensive content covering:
 * - Gallstone types and pathogenesis
 * - Acute and chronic cholecystitis
 * - Biliary complications and surgery
 */

export const CHOLELITHIASIS_CHOLECYSTITIS_CONTENT = {
  id: 'surg-gi-cholelithiasis',
  name: 'Cholelithiasis & Cholecystitis',
  
  concepts: [
    {
      id: 'anatomy',
      title: 'Biliary Anatomy',
      depth: 'mbbs',
      icon: '🫀',
      content: `
## Gallbladder Anatomy

### Location
- Lies in **gallbladder fossa** on undersurface of liver
- Between right and left hepatic lobes (segment IV/V junction)
- Projects beyond liver edge at **9th costal cartilage** (fundus)

### Parts

| Part | Location | Features |
|------|----------|----------|
| **Fundus** | Projects beyond liver | Palpable when distended |
| **Body** | Main portion | In contact with duodenum, colon |
| **Infundibulum** | Hartmann's pouch | Common site for stone impaction |
| **Neck** | Narrows to cystic duct | S-shaped, spiral valves |

---

## Biliary Ductal System

### Cystic Duct
- **Length**: 3-4 cm
- **Valves of Heister**: Spiral valves
- Joins common hepatic duct at variable angle

### Common Bile Duct (CBD)

| Segment | Length | Location |
|---------|--------|----------|
| **Supraduodenal** | 2-3 cm | In hepatoduodenal ligament |
| **Retroduodenal** | 2-3 cm | Behind D1 duodenum |
| **Pancreatic** | 3-4 cm | Within pancreatic head |
| **Intramural** | 1-2 cm | Within duodenal wall |

**Total length**: 8-12 cm
**Normal diameter**: <6 mm (increases with age)

### Ampulla of Vater
- Junction of CBD and main pancreatic duct
- Opens at major duodenal papilla
- Sphincter of Oddi controls flow

---

## Calot's Triangle

**Boundaries:**
- **Medial**: Common hepatic duct
- **Inferior**: Cystic duct
- **Superior**: Inferior surface of liver (segment V)

**Contents:**
- Cystic artery (from right hepatic)
- Cystic lymph node (Lund's node)
- Connective tissue and fat

> 💎 **Surgical Pearl**: Safe cholecystectomy requires achieving the "Critical View of Safety" - clear visualization of only cystic duct and artery entering the gallbladder

---

## Blood Supply

### Cystic Artery
- Usually from **right hepatic artery** (70%)
- Variations common (from left hepatic, GDA, SMA)
- Passes through Calot's triangle
- May have accessory cystic arteries

### Venous Drainage
- Small veins directly into liver bed
- Cystic vein to portal vein (variable)

---

## Bile Physiology

### Bile Production
- **500-1000 mL/day** from hepatocytes
- Concentrated 5-10× in gallbladder
- Stored capacity: 30-50 mL

### Bile Composition

| Component | Percentage |
|-----------|------------|
| Water | 97% |
| Bile salts | 0.7% |
| Phospholipids | 0.5% |
| Cholesterol | 0.1% |
| Bilirubin | 0.04% |

### Gallbladder Function
- Concentration (water/electrolyte absorption)
- Storage between meals
- Contraction with CCK release (fatty meal)

> 📝 **EXAM TIP**: CCK released from duodenum causes gallbladder contraction and sphincter of Oddi relaxation
`
    },
    {
      id: 'pathogenesis',
      title: 'Gallstone Pathogenesis',
      depth: 'mbbs',
      icon: '🔬',
      content: `
## Types of Gallstones

### 1. Cholesterol Stones (75-80%)

**Composition**: >50% cholesterol

**Colors/Appearance:**
- Yellow, yellow-green
- Round or oval
- Often solitary, large
- Faceted if multiple

**Pathogenesis:**

\`\`\`
Supersaturation of bile with cholesterol
(↑ cholesterol or ↓ bile salts)
        ↓
Nucleation (calcium, mucin promote)
        ↓
Crystal formation
        ↓
Stone growth
        ↓
Gallbladder hypomotility (stasis)
\`\`\`

### 2. Pigment Stones (20-25%)

#### Black Pigment Stones
| Feature | Details |
|---------|---------|
| Composition | Calcium bilirubinate, calcium |
| Associated with | Hemolysis, cirrhosis |
| Location | Gallbladder only |
| Appearance | Black, hard, spiculated |
| Radiopaque | Yes (50%) |

#### Brown Pigment Stones
| Feature | Details |
|---------|---------|
| Composition | Calcium bilirubinate, cholesterol, bacteria |
| Associated with | Biliary infection, parasites |
| Location | Bile ducts (common in Orient) |
| Appearance | Brown, soft, earthy |
| Radiopaque | No |

---

## Risk Factors - "The 4 Fs" and Beyond

### Classic 4 Fs
- **F**emale (2-3× risk)
- **F**orty (age >40)
- **F**at (obesity, metabolic syndrome)
- **F**ertile (multiparity, pregnancy)

### Additional Risk Factors

| Factor | Mechanism |
|--------|-----------|
| **Family history** | Genetic predisposition |
| **Rapid weight loss** | Increased cholesterol mobilization |
| **TPN** | Gallbladder stasis |
| **Cirrhosis** | Pigment stones |
| **Hemolytic disease** | Pigment stones |
| **Crohn's disease** | Bile salt malabsorption |
| **Ceftriaxone** | Biliary sludge |
| **Octreotide** | Gallbladder hypomotility |
| **Diabetes** | Autonomic neuropathy, stasis |

---

## Biliary Sludge

**Definition**: Thick, mucous material with crystals

**Composition:**
- Cholesterol monohydrate crystals
- Calcium bilirubinate granules
- Mucin glycoprotein

**Risk factors:**
- Fasting/TPN
- Pregnancy
- Rapid weight loss
- Critical illness

**Natural history:**
- 50% resolves
- 25% persists
- 25% forms stones

> 💎 **Clinical Pearl**: Biliary sludge can cause biliary colic and acute cholecystitis even without visible stones
`
    },
    {
      id: 'clinical-syndromes',
      title: 'Clinical Syndromes',
      depth: 'mbbs',
      icon: '🩺',
      content: `
## Spectrum of Gallstone Disease

\`\`\`
Asymptomatic gallstones (80%)
        ↓
Biliary colic (symptomatic)
        ↓
Acute cholecystitis
        ↓
Complications:
  - Choledocholithiasis
  - Cholangitis
  - Gallstone pancreatitis
  - Gallbladder perforation
  - Cholecystoenteric fistula
  - Gallstone ileus
\`\`\`

---

## Biliary Colic

### Pathophysiology
- Stone transiently obstructs cystic duct
- Gallbladder contracts against obstruction
- No inflammation (differentiates from cholecystitis)

### Clinical Features

| Feature | Description |
|---------|-------------|
| **Pain** | RUQ or epigastric, severe, constant |
| **Duration** | 30 min to 6 hours (usually <6h) |
| **Radiation** | Right scapula, shoulder |
| **Timing** | Often postprandial (fatty meal) |
| **Nausea/Vomiting** | Common |
| **Fever** | Absent |

> 📝 **EXAM TIP**: "Biliary colic" is a misnomer - the pain is constant, not colicky

### Physical Examination
- RUQ tenderness
- No peritoneal signs
- No Murphy's sign (or mild)

### Investigations
- Labs: Usually normal (may have mild LFT elevation)
- US: Gallstones, no GB wall thickening

---

## Acute Cholecystitis

### Pathophysiology

\`\`\`
Cystic duct obstruction (persistent)
        ↓
Gallbladder distension
        ↓
Mucosal ischemia (wall tension)
        ↓
Inflammation (initially sterile)
        ↓
Secondary bacterial infection (50%)
        ↓
Complications if untreated
\`\`\`

### Clinical Features

| Feature | Description |
|---------|-------------|
| **Pain** | RUQ, persistent (>6 hours) |
| **Fever** | Present (38-39°C) |
| **Murphy's sign** | Positive (inspiratory arrest with RUQ palpation) |
| **Nausea/Vomiting** | Common |
| **Previous episodes** | Often history of biliary colic |

### Murphy's Sign
> Patient takes deep breath while examiner applies pressure to RUQ. Positive when patient catches breath due to pain as inflamed GB contacts examiner's hand.

---

## Tokyo Guidelines Severity (TG18)

### Grade I (Mild)
- No organ dysfunction
- Mild local inflammation

### Grade II (Moderate)
Any of:
- WBC >18,000/mm³
- Palpable RUQ mass
- Symptoms >72 hours
- Marked local inflammation

### Grade III (Severe)
Organ dysfunction in any of:
- Cardiovascular (hypotension)
- Neurological (altered consciousness)
- Respiratory (PaO2/FiO2 <300)
- Renal (oliguria, Cr >2)
- Hepatic (PT-INR >1.5)
- Hematological (platelets <100,000)

---

## Chronic Cholecystitis

### Pathology
- Recurrent episodes of inflammation
- Fibrosis, thickened wall
- Rokitansky-Aschoff sinuses (outpouchings)
- May have "porcelain" (calcified) gallbladder

### Clinical Features
- Recurrent biliary colic
- Vague dyspepsia, bloating
- Fatty food intolerance
- May be asymptomatic between episodes

> ⚠️ **Porcelain gallbladder**: Calcified wall, associated with gallbladder cancer risk → cholecystectomy recommended
`
    },
    {
      id: 'diagnosis',
      title: 'Diagnosis',
      depth: 'mbbs',
      icon: '🔍',
      content: `
## Laboratory Investigations

### In Biliary Colic
- Usually normal
- Mild transient LFT elevation possible

### In Acute Cholecystitis

| Test | Typical Findings |
|------|------------------|
| **WBC** | 10,000-15,000 (may be higher if severe) |
| **CRP** | Elevated |
| **LFTs** | Mildly elevated (AST, ALT, ALP) |
| **Bilirubin** | Normal or mildly elevated |
| **Amylase/Lipase** | Normal (elevated suggests pancreatitis) |

> 📝 **EXAM TIP**: Markedly elevated bilirubin (>4 mg/dL) or LFTs suggest CBD stone (choledocholithiasis)

---

## Imaging

### 1. Ultrasound (First-line)

**Sensitivity/Specificity**: 95%/98% for stones

| Finding | Significance |
|---------|--------------|
| **Stones** | Echogenic focus with posterior acoustic shadow |
| **Wall thickening** | >4 mm (acute cholecystitis) |
| **Pericholecystic fluid** | Acute cholecystitis |
| **Sonographic Murphy's** | Tenderness with probe pressure |
| **CBD dilation** | >6 mm (suggests CBD stone) |
| **Sludge** | Echogenic material without shadowing |

### 2. HIDA Scan (Cholescintigraphy)

**Principle**: Tc-99m labeled IDA excreted in bile

**Indications:**
- Confirm acute cholecystitis when US inconclusive
- Assess GB function (ejection fraction)

**Interpretation:**
| Finding | Diagnosis |
|---------|-----------|
| GB visualized | Cystic duct patent (not cholecystitis) |
| GB not visualized at 4h | Cystic duct obstruction = acute cholecystitis |

**Sensitivity**: 95-97%
**Specificity**: 90%

### 3. CT Scan

**Indications:**
- Complications (perforation, abscess)
- Unclear diagnosis
- Evaluate for malignancy

**Findings in cholecystitis:**
- Wall thickening, enhancement
- Pericholecystic fat stranding
- Stones (may not be visible if cholesterol)

### 4. MRCP

**Indications:**
- Suspected CBD stones
- Define biliary anatomy
- Evaluate biliary obstruction

**Advantages:**
- Non-invasive
- Excellent ductal visualization
- Avoids ERCP complications

---

## Diagnostic Criteria (Tokyo Guidelines)

### Acute Cholecystitis (TG18)

**Definite diagnosis requires:**

**A. Local signs:**
- Murphy's sign
- RUQ mass/pain/tenderness

**B. Systemic signs:**
- Fever
- Elevated CRP
- Elevated WBC

**C. Imaging:**
- Findings characteristic of acute cholecystitis

**Suspected**: A + B
**Definite**: A + B + C
`
    },
    {
      id: 'management',
      title: 'Management',
      depth: 'mbbs',
      icon: '💊',
      content: `
## Asymptomatic Gallstones

### Generally NO treatment needed

**Exceptions (prophylactic cholecystectomy):**
- Porcelain gallbladder (cancer risk)
- Large stones (>3 cm) - cancer risk
- Gallbladder polyp >1 cm
- Sickle cell disease
- Before bariatric surgery
- Immunosuppression (transplant patients)

---

## Biliary Colic

### Conservative Management
- NPO during acute episode
- Analgesics (NSAIDs, opioids)
- Anti-emetics

### Definitive Treatment
- **Elective laparoscopic cholecystectomy**
- Schedule within weeks to months

---

## Acute Cholecystitis

### Initial Management

\`\`\`
NPO + IV fluids
        ↓
IV antibiotics (cephalosporin + metronidazole)
        ↓
Pain control
        ↓
Assess severity (Tokyo Guidelines)
        ↓
Plan surgery based on grade
\`\`\`

### Antibiotic Regimens

| Severity | Regimen |
|----------|---------|
| Mild-Moderate | Cefazolin + Metronidazole |
| Severe | Piperacillin-Tazobactam or Carbapenem |

### Timing of Cholecystectomy

| Grade | Timing |
|-------|--------|
| **I (Mild)** | Early (<72 hours from onset) |
| **II (Moderate)** | Early if <72h; consider delayed if >72h |
| **III (Severe)** | Urgent drainage first, delayed surgery |

> 💎 **Clinical Pearl**: Early cholecystectomy (<72 hours) is now standard - reduces length of stay, complications, and readmissions

### If Not Surgical Candidate

**Percutaneous cholecystostomy:**
- CT-guided transhepatic drain
- Temporizing measure
- For high-risk, Grade III patients
- Interval cholecystectomy later

---

## Laparoscopic Cholecystectomy

### Gold Standard Technique

**Steps:**
1. Establish pneumoperitoneum
2. 4 ports (umbilical, epigastric, 2 subcostal)
3. Retract fundus cephalad
4. Dissect Calot's triangle
5. **Achieve Critical View of Safety**
6. Clip and divide cystic duct and artery
7. Dissect GB from liver bed
8. Extract in bag

### Critical View of Safety (CVS)

**Three criteria:**
1. Calot's triangle cleared of fat/fibrous tissue
2. Lower third of GB separated from liver bed
3. Only 2 structures (cystic duct, cystic artery) entering GB

> ⚠️ **If CVS cannot be achieved → convert to open or bailout procedure**

### Conversion to Open

**Indications:**
- Unclear anatomy
- Uncontrolled bleeding
- CBD injury
- Dense adhesions
- Suspected malignancy

**Conversion rate**: 5% (higher in acute cholecystitis)

---

## Intraoperative Cholangiography (IOC)

**Routine vs Selective:**
- **Selective approach** is common
- May identify CBD stones (5-15% with cholecystitis)
- Confirms anatomy

**Indications for IOC:**
- Dilated CBD on preop imaging
- Elevated LFTs
- History of jaundice/pancreatitis
- Unclear anatomy
`
    },
    {
      id: 'complications',
      title: 'Complications of Gallstones',
      depth: 'pg',
      icon: '⚠️',
      content: `
## Choledocholithiasis (CBD Stones)

### Types
- **Primary**: Form in CBD (brown pigment)
- **Secondary**: Migrate from gallbladder (cholesterol)

### Clinical Features
- Biliary colic
- Jaundice (fluctuating, painless)
- Cholangitis (if infected)
- Pancreatitis (if at ampulla)

### Charcot's Triad (Cholangitis)
1. **Fever with rigors**
2. **Jaundice**
3. **RUQ pain**

### Reynolds' Pentad (Suppurative Cholangitis)
- Charcot's triad PLUS:
4. **Altered mental status**
5. **Hypotension/shock**

> 📝 **EXAM TIP**: Reynolds' pentad = severe cholangitis = emergency biliary drainage

### Management

\`\`\`
Suspected CBD stone
        ↓
Confirm with MRCP or EUS
        ↓
ERCP with sphincterotomy + stone extraction
        ↓
Laparoscopic cholecystectomy (same admission or within 2 weeks)
\`\`\`

---

## Acute Cholangitis

### Tokyo Guidelines Severity

| Grade | Criteria |
|-------|----------|
| **I (Mild)** | Responds to antibiotics, no organ dysfunction |
| **II (Moderate)** | No organ dysfunction but poor response |
| **III (Severe)** | Organ dysfunction (shock, confusion, AKI, coagulopathy) |

### Management

| Grade | Treatment |
|-------|-----------|
| **I** | Antibiotics, elective ERCP |
| **II** | Antibiotics, early ERCP (24-48h) |
| **III** | Antibiotics, urgent biliary drainage (<24h) |

---

## Gallstone Pancreatitis

### Mechanism
- Stone impacts at ampulla
- Reflux of bile into pancreatic duct
- Obstruction and enzyme activation

### Management

| Scenario | Approach |
|----------|----------|
| **Mild pancreatitis** | Cholecystectomy during same admission |
| **Severe pancreatitis** | Delayed cholecystectomy (6-8 weeks) |
| **With cholangitis** | Urgent ERCP (<24h) |
| **Persistent CBD stone** | ERCP before/during cholecystectomy |

---

## Complicated Cholecystitis

### Gangrenous Cholecystitis
- Gallbladder wall necrosis
- High risk of perforation
- Emergency surgery needed

### Emphysematous Cholecystitis
- Gas in GB wall (gas-forming organisms)
- Seen in diabetics, elderly
- High mortality - emergency surgery

### Gallbladder Perforation

| Type | Location | Presentation |
|------|----------|--------------|
| **I** | Free perforation | Peritonitis |
| **II** | Pericholec