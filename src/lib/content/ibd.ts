/**
 * Inflammatory Bowel Disease - Full Medical Content
 * 
 * Comprehensive content covering:
 * - Ulcerative Colitis & Crohn's Disease
 * - Pathophysiology, Clinical Features, Diagnosis, Management
 * - Depth-stratified for MBBS/PG/Super Specialty
 * 
 * Sources: Sleisenger 11th Ed, Harrison's 22nd Ed
 */

export const IBD_CONTENT = {
  id: 'med-gi-ibd',
  name: 'Inflammatory Bowel Disease',
  
  concepts: [
    {
      id: 'overview',
      title: 'Overview & Epidemiology',
      depth: 'mbbs',
      icon: '📊',
      content: `
## Definition

Inflammatory Bowel Disease (IBD) comprises **two major chronic idiopathic inflammatory conditions** of the GI tract:

1. **Ulcerative Colitis (UC)** - Confined to colon, mucosal inflammation
2. **Crohn's Disease (CD)** - Can affect any part of GI tract, transmural inflammation

> 📚 **Source:** Sleisenger 11th Ed, Ch.116: Ulcerative Colitis; Ch.117: Crohn's Disease

---

## Epidemiology

### Incidence & Prevalence

| Parameter | Ulcerative Colitis | Crohn's Disease |
|-----------|-------------------|-----------------|
| **Incidence** | 10-20/100,000/year | 5-10/100,000/year |
| **Prevalence** | 150-250/100,000 | 100-200/100,000 |
| **Age of onset** | Bimodal: 15-30 & 50-70 | Peak: 15-30 years |
| **Gender** | M = F | Slightly more in females |

### Geographic Distribution

\`\`\`
High incidence:
  - North America
  - Northern Europe
  - UK, Australia

Rising incidence:
  - Asia (India, China, Japan)
  - South America
  - Eastern Europe
\`\`\`

> 💎 **Clinical Pearl**: IBD follows a "North-South gradient" - higher incidence in northern latitudes

---

## Risk Factors

### Genetic Factors

| Gene | Condition | Function |
|------|-----------|----------|
| **NOD2/CARD15** | Crohn's disease | Bacterial sensing, autophagy |
| **IL23R** | Both | Th17 pathway |
| **ATG16L1** | Crohn's disease | Autophagy |
| **HLA-DRB1*0103** | Ulcerative colitis | Immune regulation |

> 📝 **Exam Tip**: NOD2 mutations are the strongest genetic risk factor for Crohn's disease (3x risk with one allele, 20-40x with two)

### Environmental Factors

| Factor | UC | CD |
|--------|----|----|
| **Smoking** | Protective | Harmful (2x risk) |
| **Appendectomy** | Protective | No effect |
| **NSAIDs** | May flare | May flare |
| **Antibiotics (childhood)** | ↑ Risk | ↑ Risk |
| **Diet (Western)** | ↑ Risk | ↑ Risk |

> 💎 **High Yield**: Smoking is PROTECTIVE in UC but HARMFUL in Crohn's - a classic exam question!

---

## Pathogenic Concepts

\`\`\`
Genetic Susceptibility
        +
Environmental Triggers (diet, microbiome, smoking)
        +
Dysregulated Immune Response
        ↓
Chronic Intestinal Inflammation
\`\`\`

### The "Hygiene Hypothesis"
- Decreased exposure to infections in childhood
- Inadequate immune system "training"
- Increased autoimmune/inflammatory diseases

### Microbiome Dysbiosis
- Reduced diversity (especially Firmicutes)
- Decreased Faecalibacterium prausnitzii
- Increased Enterobacteriaceae
- Altered short-chain fatty acid production
`
    },
    {
      id: 'pathophysiology',
      title: 'Pathophysiology',
      depth: 'mbbs',
      icon: '🔬',
      content: `
## Immunological Basis

### Normal Mucosal Immunity

The gut maintains a balance between:
- **Tolerance** to commensal bacteria and food antigens
- **Defense** against pathogens

### IBD Pathogenesis

\`\`\`
Barrier Dysfunction
        ↓
Bacterial Translocation
        ↓
Pattern Recognition (NOD2, TLRs)
        ↓
Antigen Presentation (Dendritic Cells)
        ↓
T-cell Activation (Th1/Th17 in CD, Th2/NKT in UC)
        ↓
Cytokine Release (TNF-α, IL-12, IL-23, IL-6)
        ↓
Tissue Damage & Chronic Inflammation
\`\`\`

---

## Ulcerative Colitis - Pathology

### Macroscopic Features

| Feature | Description |
|---------|-------------|
| **Distribution** | Starts rectum, extends proximally (continuous) |
| **Involvement** | Mucosa and submucosa only |
| **Extent** | Proctitis → Left-sided → Pancolitis |
| **Appearance** | Erythematous, friable, bleeding, ulcers |
| **Pseudopolyps** | Regenerating mucosa between ulcers |

### Microscopic Features

| Feature | Description |
|---------|-------------|
| **Crypt abscesses** | Neutrophils in crypt lumens |
| **Crypt distortion** | Branching, shortening, dropout |
| **Goblet cell depletion** | Loss of mucus production |
| **Basal plasmacytosis** | Plasma cells at crypt base |
| **Lamina propria inflammation** | Lymphocytes, plasma cells |

> 💎 **Clinical Pearl**: Crypt abscesses and crypt distortion are hallmarks of UC

### Backwash Ileitis
- Inflammation of terminal ileum in pancolitis
- Mild, superficial
- Does NOT indicate Crohn's

---

## Crohn's Disease - Pathology

### Macroscopic Features

| Feature | Description |
|---------|-------------|
| **Distribution** | Any GI tract (mouth to anus), skip lesions |
| **Involvement** | Transmural (full thickness) |
| **Common sites** | Terminal ileum (most common), ileocecal, colon |
| **Appearance** | Cobblestone mucosa, deep ulcers |
| **Fat wrapping** | Creeping fat over serosa |
| **Strictures** | Fibrostenotic segments |

### Microscopic Features

| Feature | Description |
|---------|-------------|
| **Non-caseating granulomas** | Present in 30-50% (pathognomonic) |
| **Transmural inflammation** | Lymphoid aggregates through wall |
| **Aphthous ulcers** | Early lesion |
| **Fissures** | Deep knife-like ulcers |
| **Neural hyperplasia** | Nerve fiber proliferation |

> 📝 **Exam Tip**: Non-caseating granulomas are pathognomonic but present in only 30-50% of Crohn's cases

---

## Key Differences: UC vs Crohn's

| Feature | Ulcerative Colitis | Crohn's Disease |
|---------|-------------------|-----------------|
| **Location** | Colon only | Mouth to anus |
| **Distribution** | Continuous | Skip lesions |
| **Rectum** | Always involved | Often spared |
| **Ileum** | Backwash only | Common |
| **Depth** | Mucosal | Transmural |
| **Granulomas** | Absent | Present (30-50%) |
| **Fistulas** | Rare | Common |
| **Strictures** | Rare | Common |
| **Crypt abscesses** | Common | Less common |
| **Fat wrapping** | Absent | Present |
| **Cobblestoning** | Absent | Present |

> 💎 **Memory Aid**: **UC = Uniform & Continuous** (starts rectum, goes up continuously). **CD = Can go anywhere, Discontinuous** (skip lesions)
`
    },
    {
      id: 'clinical-features',
      title: 'Clinical Features',
      depth: 'mbbs',
      icon: '🩺',
      content: `
## Ulcerative Colitis - Presentation

### Cardinal Symptoms

\`\`\`
BLOODY DIARRHEA (hallmark)
        +
Urgency & Tenesmus
        +
Abdominal Pain (crampy, relieved by defecation)
\`\`\`

### Symptom Pattern by Extent

| Extent | Bowel Movements | Blood | Systemic Symptoms |
|--------|-----------------|-------|-------------------|
| **Proctitis** | Normal/constipation | On stool surface | Minimal |
| **Left-sided** | 4-6/day | Mixed with stool | Mild |
| **Pancolitis** | >6/day, nocturnal | Throughout | Fever, weight loss |

### Disease Activity (Truelove-Witts Criteria)

| Parameter | Mild | Moderate | Severe |
|-----------|------|----------|--------|
| **Bowel movements/day** | <4 | 4-6 | >6 |
| **Blood in stool** | Small | Moderate | Severe |
| **Temperature** | Normal | <37.8°C | >37.8°C |
| **Pulse** | Normal | <90/min | >90/min |
| **Hemoglobin** | Normal | >10.5 g/dL | <10.5 g/dL |
| **ESR** | <20 | 20-30 | >30 |

> 📝 **Exam Tip**: Truelove-Witts criteria - know this for determining disease severity!

---

## Crohn's Disease - Presentation

### Classic Triad

\`\`\`
1. Abdominal Pain (RLQ, colicky)
        +
2. Diarrhea (usually non-bloody)
        +
3. Weight Loss
\`\`\`

### Presentation by Location

| Location | Symptoms |
|----------|----------|
| **Ileocolic** | RLQ pain, diarrhea, mass |
| **Ileal** | Pain, obstruction, malabsorption |
| **Colonic** | Bloody diarrhea (mimics UC) |
| **Gastroduodenal** | Dyspepsia, vomiting, obstruction |
| **Perianal** | Fistulas, abscesses, fissures |

### Disease Phenotypes (Montreal Classification)

**Age at Diagnosis:**
- A1: <16 years
- A2: 17-40 years
- A3: >40 years

**Location:**
- L1: Ileal
- L2: Colonic
- L3: Ileocolonic
- L4: Upper GI (modifier)

**Behavior:**
- B1: Non-stricturing, non-penetrating (inflammatory)
- B2: Stricturing
- B3: Penetrating (fistulizing)
- p: Perianal disease (modifier)

> 💎 **Clinical Pearl**: Disease behavior progresses over time - 80% of Crohn's patients develop complications (strictures/fistulas) within 20 years

---

## Extraintestinal Manifestations

### Overview

| Manifestation | UC | CD | Activity-Related |
|--------------|----|----|------------------|
| **Peripheral arthritis** | ++ | ++ | Yes |
| **Axial arthritis (AS)** | + | ++ | No |
| **Erythema nodosum** | ++ | ++ | Yes |
| **Pyoderma gangrenosum** | ++ | + | No |
| **Episcleritis** | + | + | Yes |
| **Uveitis** | + | ++ | No |
| **Primary sclerosing cholangitis** | +++ | + | No |
| **Thromboembolic disease** | ++ | ++ | Partially |
| **Osteoporosis** | + | ++ | No |

> 📝 **Exam Tip**: PSC is STRONGLY associated with UC (70% of PSC patients have UC)

### Mnemonic: Extraintestinal Manifestations

**"A PIE SACK"**
- **A**rthritis (peripheral & axial)
- **P**yoderma gangrenosum
- **I**ritis/uveitis
- **E**rythema nodosum
- **S**clerosing cholangitis (PSC)
- **A**phthous ulcers
- **C**lubbing
- **K**idney stones (oxalate)

---

## Complications

### Ulcerative Colitis Complications

| Complication | Features |
|--------------|----------|
| **Toxic megacolon** | Transverse colon >6cm, systemic toxicity |
| **Perforation** | Often with toxic megacolon |
| **Massive hemorrhage** | Rare but severe |
| **Stricture** | Suspicious for malignancy |
| **Colorectal cancer** | Increased after 8-10 years |

### Crohn's Disease Complications

| Complication | Features |
|--------------|----------|
| **Strictures** | Fibrostenotic, causes obstruction |
| **Fistulas** | Enterocutaneous, enteroenteric, perianal |
| **Abscesses** | Intra-abdominal, perianal |
| **Perforation** | Free perforation less common |
| **Malnutrition** | Fat, B12, bile salt malabsorption |
| **Cancer** | Increased in Crohn's colitis |
`
    },
    {
      id: 'diagnosis',
      title: 'Diagnosis',
      depth: 'mbbs',
      icon: '🔍',
      content: `
## Diagnostic Approach

> There is NO single diagnostic test for IBD. Diagnosis requires integration of clinical, endoscopic, histological, and radiological findings.

---

## Laboratory Investigations

### Inflammatory Markers

| Test | Finding | Notes |
|------|---------|-------|
| **CRP** | Elevated | More in CD than UC |
| **ESR** | Elevated | Non-specific |
| **Fecal calprotectin** | Elevated (>200 μg/g) | Correlates with activity |
| **Fecal lactoferrin** | Elevated | Marker of neutrophils |

> 💎 **Clinical Pearl**: Fecal calprotectin is excellent for distinguishing IBD from IBS and monitoring disease activity

### Blood Tests

| Test | Purpose |
|------|---------|
| **CBC** | Anemia (iron, B12), thrombocytosis |
| **LFTs** | PSC screening, drug monitoring |
| **Albumin** | Nutritional status, disease activity |
| **Iron studies** | Iron deficiency common |
| **B12, Folate** | Malabsorption in CD |
| **Vitamin D** | Often low, osteoporosis risk |

### Serological Markers

| Marker | UC | CD | Sensitivity/Specificity |
|--------|----|----|------------------------|
| **pANCA** | 60-70% | 10-20% | Moderate |
| **ASCA** | 10-15% | 60-70% | Moderate |

> 📝 **Exam Tip**: pANCA+/ASCA- suggests UC; pANCA-/ASCA+ suggests CD. But these are NOT diagnostic!

---

## Endoscopy

### Colonoscopy with Ileoscopy

**GOLD STANDARD for diagnosis**

#### Ulcerative Colitis Findings

\`\`\`
- Continuous inflammation starting from rectum
- Loss of vascular pattern
- Erythema, edema, friability
- Spontaneous bleeding
- Pseudopolyps
- Ulceration in severe cases
- Clear demarcation between inflamed and normal mucosa
\`\`\`

#### Crohn's Disease Findings

\`\`\`
- Skip lesions (normal between inflamed areas)
- Aphthous ulcers (early)
- Deep linear/serpiginous ulcers
- Cobblestone mucosa
- Strictures
- Fistula openings
- Ileal involvement
\`\`\`

### Biopsy Protocol

- **Multiple biopsies** from different sites (at least 2 per site)
- **Label separately** (location matters!)
- Include **normal-appearing** mucosa

---

## Imaging

### CT Enterography / MR Enterography

**Best for small bowel assessment in Crohn's**

| Finding | Significance |
|---------|--------------|
| Mural thickening (>3mm) | Active inflammation |
| Mural hyperenhancement | Active disease |
| Mural stratification | "Target sign" - edema |
| Strictures | Inflammatory vs fibrotic |
| Fistulas | Penetrating disease |
| Mesenteric changes | "Comb sign," fat proliferation |
| Abscess | Penetrating complication |

> 💎 **Clinical Pearl**: MR enterography is preferred over CT in young patients (no radiation) - IBD patients require repeated imaging

### Capsule Endoscopy

- For suspected small bowel Crohn's
- Contraindicated if stricture present
- Patency capsule first if stricture concern

### EUS / MRI Pelvis

- For perianal Crohn's disease
- Fistula mapping
- Abscess detection

---

## Histopathology

### Ulcerative Colitis

| Feature | Description |
|---------|-------------|
| **Crypt architecture distortion** | Branching, shortening |
| **Crypt abscesses** | Neutrophils in crypt lumen |
| **Goblet cell depletion** | Mucin loss |
| **Basal plasmacytosis** | Plasma cells at crypt base |
| **Surface epithelial damage** | Erosions, ulcers |
| **Limited to mucosa** | Submucosa usually spared |

### Crohn's Disease

| Feature | Description |
|---------|-------------|
| **Non-caseating granulomas** | Pathognomonic (30-50%) |
| **Transmural inflammation** | Through all layers |
| **Focal/patchy inflammation** | Skip areas |
| **Aphthoid ulcers** | Over lymphoid aggregates |
| **Fissuring ulcers** | Deep, knife-like |
| **Neural hyperplasia** | Thickened nerve fibers |

---

## Differential Diagnosis

### Infectious Mimics

| Organism | Features |
|----------|----------|
| **C. difficile** | Recent antibiotics, pseudomembranes |
| **CMV** | Immunocompromised, owl-eye inclusions |
| **Tuberculosis** | Ileocecal, caseating granulomas |
| **Yersinia** | Ileitis, mimics Crohn's |
| **Amebiasis** | Travel history, flask ulcers |

### Other Conditions

- Ischemic colitis (elderly, watershed areas)
- Radiation colitis (history)
- NSAID-induced enteropathy
- Diverticulitis
- Colorectal cancer
`
    },
    {
      id: 'management',
      title: 'Management',
      depth: 'mbbs',
      icon: '💊',
      content: `
## Treatment Principles

### Goals of Therapy

\`\`\`
1. Induce Remission (control acute flare)
2. Maintain Remission (prevent relapse)
3. Mucosal Healing (deep remission)
4. Prevent Complications
5. Improve Quality of Life
\`\`\`

### Treatment Strategy

**Step-Up Approach:**
- Start with less potent, safer drugs
- Escalate if inadequate response
- Traditional approach

**Top-Down Approach:**
- Early use of biologics in high-risk patients
- May modify disease course
- Increasingly favored

---

## Drug Classes

### 1. 5-Aminosalicylates (5-ASA)

| Drug | Formulation | Release Site |
|------|-------------|--------------|
| **Mesalamine** | Asacol | Terminal ileum, colon |
| **Mesalamine** | Pentasa | Throughout GI |
| **Mesalamine** | Lialda | Colon |
| **Sulfasalazine** | Oral | Colon (azo-bond) |

**Mechanism:** Anti-inflammatory via PPAR-γ, NF-κB inhibition

**Indication:**
- First-line for **mild-moderate UC**
- Limited role in Crohn's disease

**Side effects:** Headache, nausea, rash, nephrotoxicity (rare)

> 💎 **Clinical Pearl**: Sulfasalazine is useful if patient also has arthritis (anti-inflammatory effect)

---

### 2. Corticosteroids

| Drug | Route | Use |
|------|-------|-----|
| **Prednisone** | Oral | Moderate-severe flares |
| **Methylprednisolone** | IV | Severe/fulminant disease |
| **Budesonide** | Oral (Entocort) | Ileal/right-sided CD |
| **Budesonide MMX** | Oral | Mild-moderate UC |
| **Hydrocortisone** | Enema/foam | Distal UC |

**Use:** Induction of remission ONLY (not maintenance!)

> ⚠️ **Warning**: Steroids should NOT be used for maintenance - serious long-term side effects

**Side effects:** 
- Acute: Insomnia, mood changes, glucose intolerance
- Chronic: Osteoporosis, adrenal suppression, infections

---

### 3. Immunomodulators

| Drug | Class | Mechanism |
|------|-------|-----------|
| **Azathioprine** | Thiopurine | Purine synthesis inhibition |
| **6-Mercaptopurine** | Thiopurine | Purine synthesis inhibition |
| **Methotrexate** | Antifolate | Folate antagonism |

**Indication:** Steroid-sparing, maintenance of remission

**Monitoring:**
- TPMT genotype before thiopurines
- CBC, LFTs regularly
- Thiopurine metabolites (6-TGN, 6-MMP)

**Side effects:**
- Thiopurines: Myelosuppression, hepatotoxicity, pancreatitis, lymphoma risk
- Methotrexate: Hepatotoxicity, pneumonitis, teratogenic

> 📝 **Exam Tip**: Check TPMT before starting thiopurines - low activity = high toxicity risk

---

### 4. Biologics

| Drug | Target | Indication |
|------|--------|------------|
| **Infliximab** | TNF-α | Moderate-severe UC & CD |
| **Adalimumab** | TNF-α | Moderate-severe UC & CD |
| **Certolizumab** | TNF-α | CD only |
| **Golimumab** | TNF-α | UC only |
| **Vedolizumab** | α4β7 integrin | Moderate-severe UC & CD |
| **Ustekinumab** | IL-12/23 | Moderate-severe CD & UC |

**Pre-biologic Screening:**
- TB (latent TB reactivation risk)
- Hepatitis B (reactivation risk)
- Vaccinations (live vaccines contraindicated)

> 💎 **Clinical Pearl**: Vedolizumab is "gut-selective" (α4β7 only in gut) - safer profile, preferred if infection concerns

---

### 5. Small Molecules

| Drug | Target | Indication |
|------|--------|------------|
| **Tofacitinib** | JAK1/3 | Moderate-severe UC |
| **Upadacitinib** | JAK1 | Moderate-severe UC & CD |
| **Ozanimod** | S1P receptor | Moderate-severe UC |

**Advantages:** Oral, no immunogenicity
**Risks:** Infections, VTE, malignancy concerns

---

## Treatment by Severity

### Ulcerative Colitis

| Severity | Treatment |
|----------|-----------|
| **Mild** | Oral + topical 5-ASA |
| **Moderate** | 5-ASA ± steroids |
| **Severe** | IV steroids → rescue (cyclosporine/infliximab) |
| **Fulminant** | IV steroids + surgical consultation |

### Crohn's Disease

| Severity | Treatment |
|----------|-----------|
| **Mild** | Budesonide or no treatment |
| **Moderate** | Steroids → immunomodulators |
| **Severe** | IV steroids, biologics |
| **Perianal** | Antibiotics, biologics, surgery |
| **Stricturing** | Endoscopic/surgical |

---

## Surgical Management

### Ulcerative Colitis

**Indications:**
- Fulminant colitis/toxic megacolon
- Perforation
- Massive hemorrhage
- Refractory disease
- Dysplasia/cancer

**Procedure:** Total proctocolectomy with ileal pouch-anal anastomosis (IPAA) = CURATIVE

### Crohn's Disease

**Indications:**
- Strictures causing obstruction
- Fistulas (complex)
- Abscesses
- Perforation
- Refractory disease

**Principles:**
- Bowel-sparing surgery
- Stricturoplasty when possible
- NOT curative - recurrence common

> ⚠️ **Warning**: Surgery is NOT curative in Crohn's - 50% recurrence at 5 years
`
    },
    {
      id: 'surveillance',
      title: 'Surveillance & Prognosis',
      depth: 'pg',
      icon: '👁️',
      content: `
## Cancer Surveillance

### Colorectal Cancer Risk in IBD

| Factor | Risk |
|--------|------|
| **Duration** | Increases after 8-10 years |
| **Extent** | Pancolitis > left-sided > proctitis |
| **PSC** | 4-5x higher risk |
| **Family history CRC** | 2x risk |
| **Severity** | More inflammation = higher risk |

### Surveillance Protocol

\`\`\`
Start surveillance:
  - Pancolitis: 8 years after diagnosis
  - Left-sided: 15 years after diagnosis
  - PSC: At diagnosis (annual)

Frequency:
  - No dysplasia: Every 1-3 years
  - Previous dysplasia: Annual
  - PSC: Annual
\`\`\`

### Chromoendoscopy

- **Recommended** for surveillance
- Dye-spray (methylene blue, indigo carmine)
- Targeted biopsies of suspicious lesions
- Random biopsies no longer recommended

### Dysplasia Management

| Finding | Management |
|---------|------------|
| **Invisible dysplasia** | Confirm, repeat surveillance |
| **Visible LGD** | Endoscopic resection if feasible |
| **Invisible multifocal LGD** | Consider colectomy |
| **HGD** | Colectomy recommended |

---

## Pregnancy & IBD

### Preconception Counseling

- **Plan pregnancy** in remission (best outcomes)
- Most medications safe in pregnancy
- Methotrexate CONTRAINDICATED (stop 3-6 months before)
- Optimize nutrition

### Medication Safety

| Drug | Safety | Notes |
|------|--------|-------|
| **5-ASA** | Safe | Continue |
| **Steroids** | Safe | Avoid 1st trimester if possible |
| **Thiopurines** | Safe | Continue, benefits > risks |
| **Anti-TNF** | Safe | Continue to 3rd trimester |
| **Vedolizumab** | Likely safe | Limited data |
| **Methotrexate** | CONTRAINDICATED | Teratogenic |
| **Tofacitinib** | Avoid | Teratogenic in animals |

> 💎 **Clinical Pearl**: Active disease is MORE harmful to pregnancy than most IBD medications. Keep patient in remission!

### Delivery & Breastfeeding

- Vaginal delivery preferred (unless perianal disease)
- Cesarean for active perianal Crohn's
- Most medications compatible with breastfeeding

---

## Monitoring on Therapy

### Routine Monitoring

| Medication | Monitoring |
|------------|------------|
| **5-ASA** | Creatinine annually |
| **Thiopurines** | CBC, LFTs every 1-3 months |
| **Methotrexate** | CBC, LFTs, creatinine monthly then every 1-3 months |
| **Anti-TNF** | Drug levels, anti-drug antibodies PRN |
| **JAK inhibitors** | CBC, lipids, LFTs |

### Therapeutic Drug Monitoring (TDM)

**Indications:**
- Primary non-response
- Secondary loss of response
- Before stopping therapy

| Drug | Target Trough |
|------|---------------|
| **Infliximab** | ≥5 μg/mL |
| **Adalimumab** | ≥7.5 μg/mL |

---

## Prognosis

### Ulcerative Colitis

- **Mortality**: Similar to general population
- **Colectomy risk**: 10-15% overall, 30% for pancolitis
- **Quality of life**: Generally good in remission

### Crohn's Disease

- **Surgery**: 70-80% need surgery in lifetime
- **Recurrence**: 50% endoscopic recurrence at 1 year post-op
- **Disability**: Significant in ~15%
- **Mortality**: Slightly increased
`
    },
    {
      id: 'advanced-topics',
      title: 'Advanced Topics',
      depth: 'superSpecialty',
      icon: '🎓',
      content: `
## Therapeutic Drug Monitoring (TDM)

### Proactive vs Reactive TDM

| Approach | Description | Evidence |
|----------|-------------|----------|
| **Reactive** | Check levels when losing response | Standard practice |
| **Proactive** | Routine monitoring to optimize | Emerging evidence |

### Interpreting Anti-TNF Levels

\`\`\`
Subtherapeutic levels + No antibodies:
  → Dose escalation or interval shortening

Subtherapeutic levels + High antibodies:
  → Switch within class or out of class

Therapeutic levels + No response:
  → Switch out of class (mechanistic failure)
\`\`\`

---

## Treat-to-Target Strategy

### Evolution of Treatment Goals

\`\`\`
1. Clinical remission (symptoms)
        ↓
2. Biomarker remission (CRP, fecal calprotectin)
        ↓
3. Endoscopic remission (mucosal healing)
        ↓
4. Histologic remission (microscopic healing)
        ↓
5. Transmural healing (imaging in CD)
\`\`\`

### STRIDE-II Recommendations

**Targets:**
- Clinical response (short-term)
- Normalization of CRP/fecal calprotectin
- Endoscopic healing
- No steroids
- No disability

---

## Pouchitis

### Definition
Inflammation of the ileal pouch after IPAA

### Incidence
- 50% develop at least one episode
- 10-15% develop chronic pouchitis

### Classification

| Type | Features |
|------|----------|
| **Acute** | <4 weeks, responds to antibiotics |
| **Chronic** | >4 weeks, antibiotic-dependent/refractory |
| **Crohn's of pouch** | Fistulas, strictures, granulomas |

### Treatment

| Severity | Treatment |
|----------|-----------|
| **Acute** | Ciprofloxacin or metronidazole x 2 weeks |
| **Recurrent** | Rotating antibiotics, probiotics (VSL#3) |
| **Refractory** | Budesonide, biologics |
| **Crohn's of pouch** | Biologics, may need pouch excision |

---

## Special Situations

### Acute Severe UC (ASUC)

**Definition:** Truelove-Witts severe criteria

**Management:**

\`\`\`
Day 0:
  - Admit, IV steroids (methylprednisolone 60mg/day)
  - Stool cultures, C. diff, CMV
  - Plain AXR, surgical consult
  - VTE prophylaxis

Day 3:
  - Assess response (Oxford criteria)
  - If incomplete: Consider rescue therapy

Day 5-7:
  - If no response: Cyclosporine or Infliximab
  - Or: Surgery (colectomy)
\`\`\`

### Oxford Criteria (Day 3)

Stool frequency >8/day OR CRP >45 mg/L + stool frequency 3-8/day
→ 85% will need colectomy

---

## Emerging Therapies

### Pipeline Drugs

| Drug | Target | Status |
|------|--------|--------|
| **Risankizumab** | IL-23 | Approved CD, Phase 3 UC |
| **Mirikizumab** | IL-23 | Approved UC |
| **Etrasimod** | S1P | Approved UC |
| **Guselkumab** | IL-23 | Phase 3 |
| **Brazikumab** | IL-23 | Phase 2/3 |

### Novel Approaches

- Combination biologics
- Fecal microbiota transplant (FMT)
- Stem cell therapy
- Personalized medicine (biomarkers)
- Dietary interventions (EEN, CD exclusion diet)

---

## Key Exam Points Summary

| Topic | Key Point |
|-------|-----------|
| **NOD2** | Strongest genetic risk for CD (20-40x with 2 alleles) |
| **Smoking** | Protective in UC, harmful in CD |
| **Granulomas** | Pathognomonic for CD but only in 30-50% |
| **Fecal calprotectin** | Best non-invasive marker |
| **5-ASA** | First-line for UC, not for CD |
| **Steroids** | Induction only, never maintenance |
| **TPMT** | Test before thiopurines |
| **Anti-TNF** | Most experience, check TB first |
| **Vedolizumab** | Gut-selective, safer profile |
| **Surgery UC** | Curative (proctocolectomy) |
| **Surgery CD** | NOT curative, bowel-sparing |
| **Surveillance** | Start at 8 years for pancolitis |
| **PSC** | Strongly associated with UC |
`
    }
  ],

  keyPoints: [
    "IBD = UC (colon, continuous, mucosal) + CD (anywhere, skip, transmural)",
    "Smoking: protective in UC, harmful in Crohn's",
    "NOD2/CARD15 is the strongest genetic risk factor for Crohn's",
    "Fecal calprotectin is the best non-invasive marker for inflammation",
    "Steroids for induction only, NEVER for maintenance",
    "Surgery is curative in UC (proctocolectomy) but NOT in Crohn's",
    "Cancer surveillance starts 8 years after diagnosis in pancolitis",
  ],

  mnemonics: [
    {
      title: "UC vs CD: Remember the Patterns",
      content: `**UC = Uniform & Continuous**
- Starts at rectum, goes UP
- Uniform involvement (no skip)
- Confined to Colon only

**CD = Can go anywhere, Discontinuous**
- Mouth to anus (Can go anywhere)
- Discontinuous (skip lesions)
- Deep (transmural)`,
    },
    {
      title: "Extraintestinal Manifestations: A PIE SACK",
      content: `**A** - Arthritis (peripheral & axial)
**P** - Pyoderma gangrenosum
**I** - Iritis / Uveitis
**E** - Erythema nodosum
**S** - Sclerosing cholangitis (PSC)
**A** - Aphthous ulcers
**C** - Clubbing
**K** - Kidney stones (oxalate)`,
    },
    {
      title: "Truelove-Witts Criteria: 6-6-6",
      content: `Severe UC = **The Rule of 6s**
- >**6** stools/day
- AND one systemic feature:
  - Temp >37.8°C
  - Pulse >90
  - Hb <10.5
  - ESR >30`,
    },
    {
      title: "Anti-TNF Drugs: The 'MABs'",
      content: `**I**nfliximab - IV infusion, chimeric
**A**dalimumab - SC, fully human
**C**ertolizumab - Crohn's only, pegylated
**G**olimumab - UC only

*"I ACt with Guts"*`,
    },
  ],

  clinicalPearls: [
    "Smoking cessation is therapeutic in Crohn's - counsel every patient!",
    "If CRP is elevated but patient feels well, endoscopy often shows active disease",
    "PSC progresses independently of IBD activity - colectomy doesn't help PSC",
    "Thiopurine metabolite monitoring can optimize therapy and reduce toxicity",
    "Active disease is more harmful to pregnancy than most IBD medications",
    "Vedolizumab is preferred if patient has prior infections or malignancy concerns",
    "Always rule out C. diff and CMV before escalating therapy in a flare",
  ],

  examTips: [
    "Granulomas are pathognomonic for CD but present in only 30-50% - absence doesn't exclude CD",
    "pANCA positive suggests UC; ASCA positive suggests CD (but neither is diagnostic)",
    "Check TPMT genotype BEFORE starting azathioprine/6-MP",
    "Methotrexate works in Crohn's but NOT proven in UC maintenance",
    "Infliximab trough should be ≥5 μg/mL for optimal response",
    "Cancer surveillance with chromoendoscopy is now standard of care",
    "Acute severe UC: assess response at Day 3 - if failing, consider rescue or surgery",
  ],
};
