/**
 * Peptic Ulcer Disease - Full Medical Content
 * 
 * Comprehensive content covering:
 * - H. pylori and NSAID-related ulcers
 * - Diagnosis and medical management
 * - Surgical treatment for complications
 */

export const PEPTIC_ULCER_DISEASE_CONTENT = {
  id: 'surg-gi-peptic-ulcer',
  name: 'Peptic Ulcer Disease',
  
  concepts: [
    {
      id: 'anatomy-physiology',
      title: 'Gastric Anatomy & Acid Secretion',
      depth: 'mbbs',
      icon: '🫀',
      content: `
## Gastric Anatomy

### Regions of the Stomach

| Region | Cell Types | Secretions |
|--------|------------|------------|
| **Cardia** | Mucous cells | Mucus |
| **Fundus/Body** | Parietal, Chief, ECL | HCl, pepsinogen, histamine |
| **Antrum/Pylorus** | G cells, D cells | Gastrin, somatostatin |

### Blood Supply

| Artery | Source | Region |
|--------|--------|--------|
| **Left gastric** | Celiac trunk | Lesser curve (upper) |
| **Right gastric** | Hepatic proper | Lesser curve (lower) |
| **Left gastroepiploic** | Splenic | Greater curve (upper) |
| **Right gastroepiploic** | Gastroduodenal | Greater curve (lower) |
| **Short gastrics** | Splenic | Fundus |

> 💎 **Surgical Pearl**: Gastroduodenal artery lies behind D1 - bleeding duodenal ulcers erode into it

---

## Physiology of Acid Secretion

### Parietal Cell Activation

\`\`\`
THREE stimulants of acid secretion:

1. ACETYLCHOLINE (Vagus nerve)
      ↓ M3 receptor
      ↓ Ca²⁺/IP3 pathway
      ↓
2. GASTRIN (G cells)
      ↓ CCK-B receptor
      ↓ Ca²⁺ pathway
      ↓
3. HISTAMINE (ECL cells)
      ↓ H2 receptor
      ↓ cAMP pathway
      ↓
═══════════════════════════════
      H⁺/K⁺-ATPase (Proton Pump)
      ↓
      HCl secretion
\`\`\`

### Phases of Acid Secretion

| Phase | Stimulus | Contribution |
|-------|----------|--------------|
| **Cephalic** | Sight, smell, thought of food | 30% |
| **Gastric** | Distension, peptides | 60% |
| **Intestinal** | Amino acids in duodenum | 10% |

### Protective Mechanisms

**Mucosal defense "bicarbonate-mucus barrier":**
- Mucus layer (500 μm)
- Bicarbonate secretion
- Rapid epithelial turnover
- Mucosal blood flow
- Prostaglandins (PGE2)

> 📝 **EXAM TIP**: NSAIDs inhibit COX → reduced prostaglandins → impaired mucosal defense
`
    },
    {
      id: 'etiology',
      title: 'Etiology & Pathophysiology',
      depth: 'mbbs',
      icon: '🔬',
      content: `
## Definition

**Peptic Ulcer Disease (PUD)** is a breach in the mucosa extending through the muscularis mucosae, caused by acid-pepsin digestion.

---

## Major Causes

### 1. Helicobacter pylori (60-70%)

**Microbiological features:**
- Gram-negative, spiral, microaerophilic
- Urease-positive (produces ammonia for survival)
- Lives in gastric mucus layer

**Pathogenesis:**

\`\`\`
H. pylori colonization
        ↓
Urease → NH3 + CO2 (neutralizes acid locally)
        ↓
Inflammatory cytokines (IL-8)
        ↓
Chronic active gastritis
        ↓
↓ Somatostatin → ↑ Gastrin → Acid hypersecretion
        ↓
DUODENAL ULCER

OR

Atrophic gastritis → ↓ Acid
        ↓
Intestinal metaplasia → GASTRIC ULCER/CANCER
\`\`\`

**Virulence factors:**

| Factor | Function |
|--------|----------|
| **CagA** | Cytotoxin, ↑ IL-8, ↑ cancer risk |
| **VacA** | Vacuolating toxin, epithelial damage |
| **Urease** | Ammonia production, survival |
| **Flagella** | Motility in mucus |
| **Adhesins** | Attachment to epithelium |

> 💎 **Clinical Pearl**: CagA+ strains have higher risk of ulcers and gastric cancer

---

### 2. NSAIDs (20-25%)

**Mechanism:**
\`\`\`
NSAIDs
    ↓
COX-1 inhibition (constitutive)
    ↓
↓ Prostaglandins (PGE2, PGI2)
    ↓
↓ Mucus/bicarbonate secretion
↓ Mucosal blood flow
↓ Epithelial regeneration
    ↓
ULCERATION
\`\`\`

**Risk factors for NSAID-induced ulcers:**

| Factor | Relative Risk |
|--------|--------------|
| Age >65 | 4x |
| Prior ulcer history | 4x |
| Concurrent steroids | 5x |
| Concurrent anticoagulants | 3x |
| High-dose NSAIDs | 2-3x |
| H. pylori co-infection | 3x |

### 3. Other Causes (5-10%)

| Cause | Features |
|-------|----------|
| **Zollinger-Ellison** | Gastrinoma, multiple ulcers, jejunal |
| **Stress ulcers** | ICU patients, Curling's, Cushing's |
| **Hyperparathyroidism** | Hypercalcemia → ↑ acid |
| **Crohn's disease** | Duodenal involvement |
| **CMV/HSV** | Immunocompromised |
| **Idiopathic** | H. pylori-negative, NSAID-negative |

---

## Duodenal vs Gastric Ulcers

| Feature | Duodenal Ulcer | Gastric Ulcer |
|---------|----------------|---------------|
| **Age** | 30-50 years | 50-70 years |
| **H. pylori** | 95% | 70% |
| **Acid secretion** | Increased | Normal/decreased |
| **Location** | D1 (anterior/posterior) | Lesser curve (type I) |
| **Pain pattern** | Hunger pain, night pain, relieved by food | Worse with food |
| **Malignancy risk** | Rare | 2-3% (biopsy needed) |
| **Recurrence** | Common if H. pylori not treated | Less common |

> 📝 **EXAM TIP**: "DU = H. pylori = acid hypersecretion; GU = less acid, biopsy for cancer"
`
    },
    {
      id: 'clinical-features',
      title: 'Clinical Presentation',
      depth: 'mbbs',
      icon: '🩺',
      content: `
## Classic Presentation

### Epigastric Pain

**Duodenal Ulcer:**
- Burning/gnawing pain
- 1-3 hours after meals
- Relieved by food/antacids
- "Hunger pain" - wakes patient at 2-3 AM
- Periodic exacerbations

**Gastric Ulcer:**
- Pain precipitated by food
- May have food avoidance → weight loss
- Less predictable pattern

> 💎 **Clinical Pearl**: "DU - food relieves; GU - food aggravates"

---

## Associated Symptoms

| Symptom | Significance |
|---------|--------------|
| **Nausea/Vomiting** | Gastric outlet obstruction if persistent |
| **Early satiety** | GU near pylorus |
| **Weight loss** | GU (food avoidance), malignancy |
| **Bloating** | Dysmotility, obstruction |
| **Heartburn** | Associated GERD |

---

## Physical Examination

### Uncomplicated Ulcer
- Epigastric tenderness
- Usually minimal findings

### Complicated Ulcer

| Sign | Suggests |
|------|----------|
| **Succussion splash** | Gastric outlet obstruction |
| **Pallor, tachycardia** | Bleeding |
| **Abdominal rigidity** | Perforation |
| **Distension** | Obstruction, ileus |

---

## Alarm Features

> ⚠️ **Warrant urgent endoscopy:**

| Feature | Concern |
|---------|---------|
| GI bleeding (hematemesis, melena) | Active ulcer bleeding |
| Progressive dysphagia | Stricture, malignancy |
| Persistent vomiting | Outlet obstruction |
| Unintentional weight loss | Malignancy |
| Age >55 with new symptoms | Higher cancer risk |
| Palpable mass | Advanced malignancy |
| Anemia | Chronic blood loss |

---

## Natural History

### Untreated PUD
- 50-90% recurrence at 1 year
- Complications: 20-25%
- Mortality from complications: 5-10%

### With Treatment
- Healing: 95% at 8 weeks
- Recurrence with H. pylori eradication: <5%

---

## Special Presentations

### Silent Ulcers
- Common in elderly, diabetics
- NSAID users (prostaglandin-mediated pain suppression)
- Present with complications (bleeding, perforation)

### Stress Ulcers (Curling's & Cushing's)

| Type | Setting | Features |
|------|---------|----------|
| **Curling's** | Severe burns | Multiple, superficial |
| **Cushing's** | Head injury | Deep, posterior, high perforation risk |

> 📝 **EXAM TIP**: Cushing's ulcer = CNS injury = vagal stimulation = deep, posterior ulcer
`
    },
    {
      id: 'diagnosis',
      title: 'Diagnosis',
      depth: 'mbbs',
      icon: '🔍',
      content: `
## Diagnostic Approach

### Indications for Endoscopy

**Immediate:**
- Alarm features
- Age >55 with new dyspepsia
- Treatment failure

**Elective:**
- Confirm diagnosis
- Rule out malignancy (biopsy GU)
- H. pylori testing

---

## Upper GI Endoscopy (EGD)

### Gold Standard Investigation

**Ulcer Characteristics:**

| Feature | Benign | Malignant |
|---------|--------|-----------|
| **Base** | Clean, smooth | Necrotic, irregular |
| **Edges** | Smooth, punched-out | Raised, rolled |
| **Surrounding mucosa** | Normal | Nodular, distorted |
| **Shape** | Round/oval | Irregular |
| **Location** | Lesser curve, antrum | Greater curve (suspicious) |

> ⚠️ **Critical**: ALL gastric ulcers need **multiple biopsies** (minimum 6-8 from edges and base)

### Forrest Classification (Bleeding Ulcers)

| Class | Description | Rebleeding Risk |
|-------|-------------|-----------------|
| **Ia** | Spurting hemorrhage | 90% |
| **Ib** | Oozing hemorrhage | 50% |
| **IIa** | Visible vessel | 50% |
| **IIb** | Adherent clot | 30% |
| **IIc** | Flat pigmented spot | 10% |
| **III** | Clean base | 5% |

> 📝 **EXAM TIP**: Forrest Ia, Ib, IIa need endoscopic therapy; IIb controversial; IIc, III = no intervention

---

## H. pylori Testing

### Invasive Tests (Require EGD)

| Test | Sensitivity | Specificity | Notes |
|------|-------------|-------------|-------|
| **Rapid urease (CLO)** | 95% | 98% | Fast (1 hour), cheap |
| **Histology** | 95% | 99% | Gold standard, shows gastritis |
| **Culture** | 80% | 100% | For antibiotic sensitivity |
| **PCR** | >95% | >95% | Detects resistance genes |

### Non-invasive Tests

| Test | Sensitivity | Specificity | Notes |
|------|-------------|-------------|-------|
| **Urea breath test (UBT)** | 95% | 95% | Best non-invasive, confirms eradication |
| **Stool antigen** | 95% | 95% | Good for diagnosis and eradication |
| **Serology (IgG)** | 90% | 85% | Cannot confirm eradication, stays positive |

### Testing Considerations

\`\`\`
Before H. pylori testing:
  - Stop PPI: 2 weeks
  - Stop antibiotics: 4 weeks
  - Stop bismuth: 4 weeks

False negatives occur if these rules not followed!
\`\`\`

---

## Other Investigations

### Gastrin Level

**Indications:**
- Multiple ulcers
- Ulcers in unusual locations (jejunum)
- Recurrent ulcers after surgery
- Associated with diarrhea
- Family history of MEN-1

**Zollinger-Ellison criteria:**
- Fasting gastrin >1000 pg/mL = diagnostic
- Fasting gastrin 100-1000 pg/mL = do secretin test

### Secretin Stimulation Test

| Response | Interpretation |
|----------|----------------|
| Gastrin ↑ >200 pg/mL | Gastrinoma (ZES) |
| No change/decrease | Other causes of hypergastrinemia |

---

## Imaging

### CT Scan
- Indicated for suspected complications
- Perforation: Free air, inflammatory changes
- Obstruction: Dilated stomach
- ZES: Pancreatic/duodenal mass

### Barium Studies
- Largely replaced by EGD
- May show ulcer crater, deformity
- Cannot biopsy
`
    },
    {
      id: 'medical-management',
      title: 'Medical Management',
      depth: 'mbbs',
      icon: '💊',
      content: `
## Treatment Goals

1. Relieve symptoms
2. Heal ulcer
3. Eradicate H. pylori
4. Prevent recurrence
5. Treat/prevent complications

---

## H. pylori Eradication

### First-Line Regimens

#### Bismuth Quadruple Therapy (Preferred)

| Drug | Dose | Duration |
|------|------|----------|
| PPI | Twice daily | 14 days |
| Bismuth subsalicylate | 525 mg QID | 14 days |
| Metronidazole | 500 mg TID | 14 days |
| Tetracycline | 500 mg QID | 14 days |

#### Concomitant Therapy (Alternative)

| Drug | Dose | Duration |
|------|------|----------|
| PPI | Twice daily | 14 days |
| Amoxicillin | 1g BID | 14 days |
| Clarithromycin | 500 mg BID | 14 days |
| Metronidazole | 500 mg BID | 14 days |

> 💎 **Clinical Pearl**: Triple therapy (PPI + clarithromycin + amoxicillin) no longer first-line due to resistance

### Second-Line (Rescue Therapy)

If first-line fails:
- Use different antibiotics
- Levofloxacin-based: PPI + Amoxicillin + Levofloxacin (14 days)
- Rifabutin-based if multiple failures

### Confirmation of Eradication

- **Test 4 weeks after completing treatment**
- **Stop PPI 2 weeks before testing**
- Preferred: UBT or stool antigen
- If EGD done: Histology + urease test

---

## Antisecretory Therapy

### Proton Pump Inhibitors

| Drug | Healing Dose | Duration |
|------|--------------|----------|
| Omeprazole | 20-40 mg OD | DU: 4 weeks; GU: 8 weeks |
| Esomeprazole | 40 mg OD | |
| Pantoprazole | 40 mg OD | |
| Rabeprazole | 20 mg OD | |
| Lansoprazole | 30 mg OD | |

**Healing rates:**
- Duodenal ulcer: 90-95% at 4 weeks
- Gastric ulcer: 85-90% at 8 weeks

### H2 Receptor Antagonists

- Less effective than PPIs
- Famotidine 40 mg at bedtime
- Role: Nocturnal acid control, maintenance

---

## NSAID-Related Ulcers

### Management

\`\`\`
1. Stop NSAID if possible
        ↓
2. Test and treat H. pylori
        ↓
3. PPI therapy (8 weeks)
        ↓
4. If NSAID must continue:
   - Use lowest effective dose
   - Add PPI prophylaxis
   - Consider COX-2 selective + PPI
\`\`\`

### Prevention in High-Risk Patients

| Strategy | Indication |
|----------|------------|
| **PPI co-therapy** | Any NSAID use in high-risk |
| **Misoprostol** | Alternative (prostaglandin analog) |
| **COX-2 selective** | Lower GI risk, but CV risk |
| **H. pylori eradication** | If positive, before NSAID use |

> ⚠️ **Warning**: COX-2 inhibitors + aspirin = lose GI benefit; still need PPI

---

## Follow-up

### Duodenal Ulcer
- No routine follow-up EGD if H. pylori treated
- Confirm eradication (UBT/stool antigen)

### Gastric Ulcer
- **Repeat EGD at 8-12 weeks**
- Confirm healing and re-biopsy if not healed
- Non-healing GU = malignancy until proven otherwise

> 📝 **EXAM TIP**: Always re-scope gastric ulcers to confirm healing and rule out cancer
`
    },
    {
      id: 'complications',
      title: 'Complications',
      depth: 'pg',
      icon: '⚠️',
      content: `
## Major Complications

The **4 Ps of PUD Complications:**
1. **P**erforation
2. **P**enetration
3. **P**yloric stenosis (Obstruction)
4. **P**ainful bleeding (Hemorrhage)

---

## 1. Bleeding (Most Common - 15-20%)

### Clinical Features
- Hematemesis (coffee-ground or fresh)
- Melena (tarry stools)
- Hypovolemic shock

### Risk Factors for Rebleeding
- Hemodynamic instability at presentation
- Large ulcer (>2 cm)
- Posterior DU (gastroduodenal artery)
- Visible vessel on endoscopy
- Initial hemoglobin <10 g/dL

### Management

\`\`\`
ABC Resuscitation
        ↓
Blood transfusion (target Hb 7-8 g/dL, 9 for CAD)
        ↓
IV PPI (80 mg bolus → 8 mg/hr infusion × 72h)
        ↓
Urgent EGD (<24 hours, <12h if unstable)
        ↓
Endoscopic hemostasis:
  - Injection (epinephrine)
  - Thermal (APC, heater probe)
  - Mechanical (clips, band ligation)
  - Combination therapy best
        ↓
Continue PPI, H. pylori eradication
\`\`\`

### Rockall Score (Risk Stratification)

| Factor | Score |
|--------|-------|
| Age <60 | 0 |
| Age 60-79 | 1 |
| Age ≥80 | 2 |
| Shock (SBP <100, HR >100) | 2 |
| Comorbidities | 2-3 |
| Diagnosis (Mallory-Weiss = 0, malignancy = 2) | 0-2 |
| Endoscopic stigmata | 0-2 |

**Score ≤2**: Low risk, early discharge
**Score ≥8**: High mortality

### Surgical Indications

- Failed endoscopic hemostasis (2 attempts)
- Hemodynamic instability despite resuscitation
- Transfusion >6 units in 24 hours
- Recurrent bleeding after successful endoscopy

**Surgical options:**
- DU: Oversewing + vagotomy/pyloroplasty
- GU: Oversewing ± wedge resection (biopsy)

---

## 2. Perforation (5-10%)

### Clinical Features
- Sudden, severe epigastric pain
- Board-like rigidity
- Absent bowel sounds
- Shoulder tip pain (diaphragmatic irritation)

### Diagnosis

| Investigation | Finding |
|---------------|---------|
| **Erect CXR** | Free air under diaphragm (80%) |
| **CT scan** | Free air, fluid, ulcer location (95%) |
| **Left lateral decubitus** | If CXR negative |

> 📝 **EXAM TIP**: 20% of perforations don't show free air on CXR - use CT

### Management

\`\`\`
Resuscitation (IV fluids, NPO, NGT, antibiotics)
        ↓
Emergency surgery (<6 hours if possible)
        ↓
Options:
  1. Laparoscopic omental patch (Graham patch) - preferred
  2. Open repair if unstable/extensive contamination
  3. Taylor's conservative (only if sealed perforation, elderly, high risk)
        ↓
Postoperative:
  - IV PPI
  - H. pylori eradication
  - Stop NSAIDs
\`\`\`

### Taylor's Method (Conservative)

**Criteria:**
- Sealed perforation (no generalized peritonitis)
- Improving clinically
- Contrast study shows no leak

**Protocol:**
- NGT, IV fluids, IV antibiotics
- Serial examinations
- Contrast study at 48-72 hours

> ⚠️ Used only in selected high-risk patients

---

## 3. Gastric Outlet Obstruction (2-5%)

### Causes
- Acute inflammation/edema (reversible)
- Chronic scarring (irreversible)
- Malignancy (must exclude)

### Clinical Features
- Projectile, non-bilious vomiting
- Vomiting of undigested food eaten hours earlier
- Succession splash
- Visible gastric peristalsis
- Weight loss, dehydration

### Metabolic Derangement

\`\`\`
Vomiting HCl
        ↓
Loss of H⁺, Cl⁻, K⁺
        ↓
Hypochloremic, Hypokalemic Metabolic ALKALOSIS
        ↓
"Paradoxical aciduria" (kidney retains H⁺ to save K⁺)
\`\`\`

### Management

\`\`\`
1. Correction of dehydration and electrolytes
   - Normal saline with KCl
   - Correct alkalosis before surgery

2. Gastric decompression (NGT)

3. EGD to rule out malignancy + biopsy

4. Trial of medical therapy (PPI + dilation)
   - If edema predominant

5. Surgery if medical therapy fails:
   - Gastrojejunostomy (bypass)
   - Antrectomy + vagotomy
   - Pyloroplasty + vagotomy
\`\`\`

---

## 4. Penetration

### Definition
Ulcer erodes into adjacent organ without free perforation

### Sites
| Location | Ulcer Type | Consequences |
|----------|------------|--------------|
| **Pancreas** | Posterior DU | Pancreatitis, back pain |
| **Liver** | GU/DU | Abscess |
| **Biliary tree** | DU | Cholangitis |
| **Colon** | GU | Gastrocolic fistula |

### Features
- Change in pain pattern (constant, radiates to back)
- Elevated amylase/lipase
- No longer responds to antacids

### Management
- High-dose PPI
- Surgery if no response
`
    },
    {
      id: 'surgical-management',
      title: 'Surgical Management',
      depth: 'pg',
      icon: '🔪',
      content: `
## Historical Context

Before H. pylori discovery and PPIs, surgery was common for PUD.

**Now surgery is reserved for:**
- Complications (perforation, bleeding, obstruction)
- Refractory disease
- Zollinger-Ellison syndrome

---

## Surgical Principles

### Goals
1. Remove acid stimulus
2. Reduce acid secretion
3. Drain stomach (if vagotomy done)
4. Ensure cancer exclusion (for GU)

---

## Types of Vagotomy

### 1. Truncal Vagotomy (TV)

**Technique**: Divide both vagal trunks at esophageal hiatus

**Effects:**
- ↓ Acid by 50%
- Gastric stasis (needs drainage)
- Diarrhea (bile salt malabsorption)

**Must add drainage procedure:**
- Pyloroplasty (Heineke-Mikulicz)
- Gastrojejunostomy

### 2. Selective Vagotomy

Divides gastric branches only (preserves hepatic, celiac)
- Still needs drainage
- Less diarrhea

### 3. Highly Selective Vagotomy (Parietal Cell Vagotomy)

**Also called**: Proximal gastric vagotomy

**Technique**: Divide only parietal cell branches; preserve "crow's foot" (nerves of Latarjet to antrum)

**Advantages:**
- No drainage needed (preserves antropyloric function)
- Lowest side effects
- Preserves gastric emptying

**Disadvantages:**
- Higher recurrence rate (10-15%)
- Technically demanding

---

## Gastric Resection

### Antrectomy

Removes gastric antrum (source of gastrin)

**Reconstruction options:**

| Type | Description |
|------|-------------|
| **Billroth I** | Gastroduodenostomy (end-to-end) |
| **Billroth II** | Gastrojejunostomy (end-to-side) |
| **Roux-en-Y** | Gastrojejunostomy with jejunojejunostomy |

### Subtotal Gastrectomy

Removes 70-80% of stomach (for GU, malignancy concern)

---

## Procedure Selection

### For Duodenal Ulcer

| Indication | Procedure |
|------------|-----------|
| **Perforation** | Omental patch ± definitive (if stable) |
| **Bleeding** | Oversewing + TV + pyloroplasty |
| **Obstruction** | TV + antrectomy or gastrojejunostomy |
| **Refractory** | HSV or TV + antrectomy |

### For Gastric Ulcer

| Type (Johnson) | Location | Procedure |
|----------------|----------|-----------|
| **I** | Lesser curve | Distal gastrectomy (Billroth I) |
| **II** | Body + DU | Vagotomy + antrectomy |
| **III** | Prepyloric | Vagotomy + antrectomy |
| **IV** | Proximal/cardia | Subtotal gastrectomy |
| **V** | Anywhere (NSAID) | Medical + wedge if surgery needed |

> 📝 **EXAM TIP**: Type I GU = low acid, no vagotomy; Type II/III = high acid, add vagotomy

---

## Post-gastrectomy Syndromes

### Early Complications

| Complication | Features |
|--------------|----------|
| **Anastomotic leak** | Fever, peritonitis, drain output |
| **Bleeding** | From staple line/anastomosis |
| **Delayed gastric emptying** | Nausea, vomiting |
| **Afferent loop syndrome** | Bilious vomiting, pain relieved by vomiting |

### Late Complications

| Syndrome | Mechanism | Management |
|----------|-----------|------------|
| **Dumping (early)** | Rapid gastric emptying → osmotic shift | Small, frequent, dry meals |
| **Dumping (late)** | Reactive hypoglycemia | Avoid simple sugars |
| **Alkaline reflux gastritis** | Bile reflux to remnant | Roux-en-Y conversion |
| **Afferent loop** | Obstruction of afferent limb | Revision surgery |
| **Nutritional deficiencies** | B12, iron, calcium | Supplementation |
| **Marginal ulcer** | At anastomosis | PPI, H. pylori treatment |
| **Gastric remnant cancer** | 15-20 years post-surgery | Surveillance |

> 💎 **Clinical Pearl**: Early dumping = 15-30 min after meals; Late dumping = 1-3 hours after meals
`
    },
    {
      id: 'special-situations',
      title: 'Special Situations',
      depth: 'superSpecialty',
      icon: '🎓',
      content: `
## Zollinger-Ellison Syndrome

### Pathophysiology
- Gastrinoma (usually in "gastrinoma triangle")
- Gastrin hypersecretion → massive acid
- 60-90% malignant
- 25% associated with MEN-1

### Gastrinoma Triangle

\`\`\`
           Cystic duct / CBD junction
                    ╱ ╲
                   ╱   ╲
                  ╱     ╲
    2nd/3rd part ─────── Neck/body
    of duodenum          of pancreas
\`\`\`

### Clinical Features
- Multiple/refractory peptic ulcers
- Ulcers in unusual locations (jejunum)
- Diarrhea (acid inactivates lipase)
- Abdominal pain
- GERD symptoms

### Diagnosis

| Test | Criteria |
|------|----------|
| Fasting gastrin | >1000 pg/mL (diagnostic if pH <2) |
| Secretin test | Gastrin rise >200 pg/mL = positive |
| Chromogranin A | Elevated (neuroendocrine marker) |
| Localization | EUS, CT, octreotide scan, 68Ga-DOTATATE PET |

### Management

\`\`\`
1. Control acid secretion:
   - High-dose PPI (40-120 mg/day)
   - Lifelong therapy

2. Tumor localization:
   - CT/MRI for liver metastases
   - EUS for pancreatic lesions
   - SRS/DOTATATE PET

3. Surgical resection if localized:
   - Duodenal tumors: Resection
   - Pancreatic: Enucleation or resection
   - Lymph node dissection

4. If metastatic:
   - Somatostatin analogs
   - Chemotherapy
   - Liver-directed therapy
\`\`\`

> 📝 **EXAM TIP**: Screen all ZES patients for MEN-1 (hyperparathyroidism, pituitary tumors)

---

## Stress Ulcer Prophylaxis

### Indications (High-risk ICU patients)

| Risk Factor | Prophylaxis Indicated |
|-------------|----------------------|
| Mechanical ventilation >48h | Yes |
| Coagulopathy | Yes |
| Traumatic brain injury | Yes |
| Severe burns (>35% TBSA) | Yes |
| Sepsis | Yes |
| History of GI bleeding | Yes |
| Multiple risk factors | Yes |

### Prophylaxis Options

| Agent | Dose |
|-------|------|
| **PPI** | IV pantoprazole 40 mg daily |
| **H2RA** | IV famotidine 20 mg q12h |
| **Sucralfate** | 1g q6h via NGT |

> 💎 **Clinical Pearl**: PPIs slightly more effective but may increase C. diff and pneumonia risk

---

## Refractory/Recurrent Ulcers

### Causes to Investigate

\`\`\`
1. H. pylori not eradicated (most common)
   - Confirm eradication with UBT

2. Persistent NSAID use
   - Including "hidden" NSAIDs, low-dose aspirin

3. Zollinger-Ellison syndrome
   - Check fasting gastrin

4. Non-compliance with PPI

5. Giant ulcer (>2 cm) - needs longer treatment

6. Malignancy (GU especially)

7. Other causes:
   - Crohn's disease
   - CMV in immunocompromised
   - Ischemia
\`\`\`

---

## Giant Gastric Ulcer

### Definition
Gastric ulcer >3 cm

### Concerns
- Higher malignancy rate (10-30%)
- Longer healing time
- Higher complication rate
- Need for aggressive biopsy

### Management
- Multiple biopsies (8-12)
- High-dose PPI × 12 weeks
- Repeat EGD with biopsies
- Surgery if:
  - Not healed at 12 weeks
  - Malignancy proven
  - Complications

---

## Key Exam Summary

| Topic | Key Point |
|-------|-----------|
| DU:GU ratio | 4:1 (DU more common) |
| H. pylori in DU | 95% |
| Pain pattern DU | Hunger pain, food relieves |
| Pain pattern GU | Food aggravates |
| Always biopsy | Gastric ulcers (cancer risk) |
| Main NSAID mechanism | COX-1 inhibition → ↓ PGE2 |
| First-line H. pylori | Bismuth quadruple × 14 days |
| Bleeding posterior DU | Gastroduodenal artery |
| GOO metabolic defect | Hypochloremic hypokalemic alkalosis |
| Cushing's ulcer | Head injury, deep posterior ulcer |
| HSV advantage | No drainage needed |
| ZES gastrin level | >1000 pg/mL diagnostic |
`
    }
  ],

  keyPoints: [
    "H. pylori causes 95% of DU and 70% of GU",
    "NSAIDs inhibit COX-1 → reduced prostaglandins → impaired defense",
    "DU pain relieved by food; GU pain worsened by food",
    "ALL gastric ulcers require biopsy to rule out malignancy",
    "Bismuth quadruple therapy × 14 days is first-line for H. pylori",
    "Confirm H. pylori eradication 4 weeks after treatment",
    "Perforation = free air on CXR (80%) or CT (95%)",
    "Bleeding posterior DU erodes into gastroduodenal artery",
  ],

  mnemonics: [
    {
      title: "Acid Secretion Stimulants",
      content: `**"GAH!"** - what you say when you have too much acid

- **G**astrin (G cells)
- **A**cetylcholine (vagus)
- **H**istamine (ECL cells)

All three converge on the proton pump!`,
    },
    {
      title: "PUD Complications (4 Ps)",
      content: `**P**erforation - sudden severe pain, rigidity
**P**enetration - back pain, pancreatitis
**P**yloric stenosis - vomiting, succussion splash
**P**ainful bleeding - hematemesis, melena

*"PUD makes you P everywhere"*`,
    },
    {
      title: "GOO Metabolic Abnormality",
      content: `**H**ypochloremic
**H**ypokalemic
Metabolic **A**lkalosis

"**HHA!** - you can't help but exclaim when you vomit that much HCl"

+ Paradoxical aciduria (kidney saves K+ by excreting H+)`,
    },
    {
      title: "Johnson Classification of GU",
      content: `**Type 1**: Lesser curve (most common, low acid)
**Type 2**: Body + DU (high acid)
**Type 3**: Prepyloric (high acid)
**Type 4**: High/cardia (low acid)
**Type 5**: Anywhere (NSAID)

*"1 and 4 are low acid, 2 and 3 are high acid"*`,
    },
  ],

  clinicalPearls: [
    "Stop PPI 2 weeks before H. pylori testing to avoid false negatives",
    "Triple therapy is no longer first-line due to clarithromycin resistance",
    "20% of perforations don't show free air on CXR - use CT if clinical suspicion",
    "Cushing's ulcers (head injury) are deep and posterior - high perforation risk",
    "Always correct electrolytes before surgery in GOO patients",
    "Re-scope all gastric ulcers at 8-12 weeks to confirm healing",
  ],

  examTips: [
    "DU = food relieves pain; GU = food aggravates pain",
    "H. pylori eradication test: UBT or stool antigen (not serology)",
    "Forrest Ia/Ib/IIa = endoscopic therapy; IIc/III = no intervention",
    "GOO = hypochloremic hypokalemic metabolic ALKALOSIS",
    "ZES: Fasting gastrin >1000 pg/mL with pH <2 is diagnostic",
    "HSV (parietal cell vagotomy) = no drainage procedure needed",
    "Type I and IV GU = low acid, no vagotomy needed",
  ],
};
