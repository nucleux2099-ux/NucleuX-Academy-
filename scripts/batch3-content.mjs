#!/usr/bin/env node
// Batch 3 — Content file generator for all 103 topics needing explorer.md + exam-prep.md
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';
const B = '/Users/adityachandrabhatla/nucleux-academy/content/medicine';

// Content data: keyed by "subspec/slug"
// Each entry: { explorer: string, exam: string }
// explorer = full markdown content (150-300 lines)
// exam = full markdown content (50-100 lines)

function w(sub, slug, explorer, exam) {
  const dir = join(B, sub, slug);
  const ep = join(dir, 'explorer.md');
  const xp = join(dir, 'exam-prep.md');
  if (!existsSync(ep)) { writeFileSync(ep, explorer); console.log(`✓ explorer: ${sub}/${slug}`); }
  if (!existsSync(xp)) { writeFileSync(xp, exam); console.log(`✓ exam-prep: ${sub}/${slug}`); }
}

// ========== GASTROENTEROLOGY ==========

w('gastroenterology','acute-liver-failure',
`# Acute Liver Failure — Explorer

## Overview

Acute liver failure (ALF) is the rapid deterioration of liver function in a patient **without pre-existing liver disease**, characterized by coagulopathy (INR ≥1.5) and hepatic encephalopathy within 26 weeks of symptom onset. It is a medical emergency with high mortality without liver transplantation.

## Key Points

- **Definition**: Coagulopathy (INR ≥1.5) + encephalopathy + no prior liver disease + illness <26 weeks
- **Most common cause (West)**: Paracetamol overdose
- **Most common cause (India)**: Hepatitis E (especially in pregnancy), anti-TB drugs
- **Leading cause of death**: Cerebral edema
- **Antidote for paracetamol**: N-acetylcysteine (NAC)
- **Transplant criteria**: King's College Criteria

## Definition and Classification

### O'Grady Classification
| Type | Onset (Jaundice → Encephalopathy) | Common Causes | Prognosis |
|------|-----------------------------------|---------------|-----------|
| Hyperacute | <7 days | Paracetamol, Hepatitis A | Best (spontaneous recovery possible) |
| Acute | 7–21 days | Hepatitis B, drugs | Intermediate |
| Subacute | 21 days – 26 weeks | Drug reactions, seronegative | Worst |

## Etiology and Pathophysiology

### Common Causes
- **Drugs**: Paracetamol (#1 West), anti-TB drugs (INH, Rifampicin — #1 India), anticonvulsants
- **Viral**: Hepatitis B (acute/reactivation), Hepatitis E (pregnancy), Hepatitis A (children)
- **Autoimmune hepatitis**: Can present as ALF
- **Wilson disease**: Acute presentation with hemolysis + liver failure (Coombs-negative hemolytic anemia)
- **Vascular**: Budd-Chiari syndrome, ischemic hepatitis
- **Pregnancy**: Acute fatty liver of pregnancy, HELLP syndrome
- **Other**: Amanita phalloides (mushroom), heat stroke, malignant infiltration

### Pathophysiology
1. Massive hepatocyte necrosis → loss of synthetic and metabolic function
2. Impaired ammonia clearance → cerebral edema (astrocyte swelling — osmotic)
3. Reduced clotting factor synthesis → coagulopathy
4. Loss of detoxification → accumulation of toxins
5. Impaired gluconeogenesis → hypoglycemia
6. Reduced lactate clearance → lactic acidosis
7. Vasodilatation → hemodynamic instability

## Clinical Features

### Presentation
- **Jaundice** (progressive, deep)
- **Coagulopathy** (easy bruising, bleeding)
- **Hepatic encephalopathy** — West Haven Grading:
  - Grade I: Altered sleep, mild confusion
  - Grade II: Lethargy, moderate confusion, asterixis
  - Grade III: Somnolence, incoherent, marked confusion
  - Grade IV: Coma
- **Shrinking liver** on examination (due to massive necrosis)
- **Right upper quadrant tenderness**
- **Fetor hepaticus**
- **Ascites** (subacute presentation)

### Associated Features
- Hypoglycemia (monitor 2-hourly)
- Hemodynamic instability (hypotension, tachycardia)
- Renal failure (hepatorenal syndrome or direct paracetamol toxicity)
- Infection/sepsis (loss of immune function)
- Multi-organ failure

## Diagnosis

### Laboratory
- **LFT**: Markedly elevated AST/ALT (often >1000 in paracetamol, viral), elevated bilirubin
- **Coagulation**: INR ≥1.5 (defining criterion), Factor V level (prognostic)
- **Ammonia**: Elevated arterial ammonia
- **Glucose**: Hypoglycemia common
- **Lactate**: Elevated (poor clearance + tissue hypoperfusion)
- **Renal**: Creatinine elevated in hepatorenal syndrome

### Etiological Workup
- Paracetamol level, toxicology screen
- Viral markers: HAV IgM, HBsAg, HBV DNA, HEV IgM
- Autoimmune: ANA, anti-SMA, IgG levels
- Wilson: Ceruloplasmin, 24h urine copper, slit-lamp (KF rings)
- Imaging: USG abdomen (liver size, hepatic veins — Budd-Chiari), Doppler

### King's College Criteria (Transplant Listing)

**Paracetamol ALF:**
- pH <7.3 (after resuscitation) **OR**
- All three: INR >6.5 + Creatinine >3.4 mg/dL + Grade III/IV encephalopathy

**Non-Paracetamol ALF:**
- INR >6.5 **OR**
- Any 3 of: Age <10 or >40, Etiology (seronegative/drug), Jaundice-encephalopathy interval >7 days, INR >3.5, Bilirubin >17.5 mg/dL

## Management

### General Principles
1. **ICU admission** (preferably liver transplant center)
2. **Airway protection** (intubate if Grade III/IV encephalopathy)
3. **Hemodynamic support** (fluids, vasopressors — norepinephrine preferred)
4. **Cerebral edema management**: Head elevation 30°, mannitol (0.5–1 g/kg), hypertonic saline (target Na 145–155), avoid hyperthermia
5. **Coagulopathy**: FFP/vitamin K only if active bleeding or procedure (don't correct prophylactically — lose prognostic marker)
6. **Hypoglycemia**: Continuous 10% dextrose infusion, monitor 2-hourly
7. **Infection**: Low threshold for antibiotics, surveillance cultures
8. **N-acetylcysteine**: Beneficial in both paracetamol and non-paracetamol ALF
9. **Renal replacement therapy** if oliguric AKI / severe acidosis / hyperammonemia
10. **Liver transplantation**: Definitive treatment for irreversible ALF

### Specific Treatments
- **Paracetamol**: NAC (IV 300mg/kg over 21h or oral 72h protocol)
- **Autoimmune**: Steroids (controversial in ALF setting)
- **Wilson**: D-penicillamine, plasmapheresis, urgent transplant
- **Herpes simplex**: IV Acyclovir
- **Amanita**: Silibinin, penicillin G, NAC

## Complications and Prognosis

### Complications
- Cerebral edema → brain herniation (leading cause of death)
- Coagulopathy → hemorrhage
- Infections/sepsis (50% develop bacterial, 30% fungal)
- Multi-organ failure
- Pancreatitis
- Aplastic anemia (post-hepatitis)

### Prognosis
- Without transplant: 40–80% mortality (varies by etiology)
- With transplant: 65–80% 1-year survival
- Best spontaneous recovery: hyperacute (paracetamol, HAV)
- Worst prognosis: subacute, seronegative, Wilson disease

## References

- Harrison's Principles of Internal Medicine, 21st Edition
- AASLD Position Paper on Acute Liver Failure
- King's College Hospital criteria (O'Grady et al.)
`,
`# Acute Liver Failure — Exam Prep

## Quick Summary

ALF = coagulopathy (INR ≥1.5) + encephalopathy + no prior liver disease + <26 weeks. Causes: paracetamol (#1 West), Hepatitis E/anti-TB drugs (#1 India). Leading cause of death: cerebral edema. Treatment: NAC + ICU management + liver transplant if King's criteria met.

## High Yield Points ★

★ Hyperacute ALF (<7 days) has the BEST prognosis (often paracetamol, HAV)
★ Subacute ALF (>21 days) has the WORST prognosis
★ NAC is beneficial for BOTH paracetamol and non-paracetamol ALF
★ Don't correct INR prophylactically — you lose your prognostic marker
★ King's College Criteria pH <7.3 alone = list for transplant (paracetamol)
★ Wilson disease ALF: Coombs-negative hemolytic anemia + very high bilirubin + low ALP (ALP:bilirubin ratio <4)
★ Hepatitis E in pregnancy — high mortality (20% in 3rd trimester)
★ Factor V level — best single prognostic marker (Factor VII has shortest half-life)
★ Cerebral edema management: Mannitol, Hypertonic saline, Head elevation, Avoid fever

## Mnemonics

**King's College (Non-paracetamol) — "JABIT":**
- J: Jaundice-encephalopathy interval >7 days
- A: Age <10 or >40
- B: Bilirubin >17.5 mg/dL
- I: INR >3.5
- T: Toxicology (seronegative hepatitis, idiosyncratic drug reaction)
*(Any 3 of 5 OR INR >6.5 alone)*

**West Haven Encephalopathy Grading: "SLAC":**
- Stage 1: Sleep disturbance
- Stage 2: Lethargy, Asterixis
- Stage 3: Arousable Confusion (somnolent)
- Stage 4: Coma

## Common MCQ Topics

1. Most common cause of ALF in West → **Paracetamol**
2. Most common cause of ALF in India → **HEV (pregnancy), anti-TB drugs**
3. Leading cause of death in ALF → **Cerebral edema**
4. Paracetamol antidote → **N-acetylcysteine**
5. Toxic metabolite in paracetamol → **NAPQI**
6. King's College pH criterion (paracetamol) → **<7.3**
7. Best prognosis subtype → **Hyperacute**
8. Wilson disease ALF clue → **Coombs-negative hemolysis + low ALP**
9. Grade of encephalopathy requiring intubation → **Grade III–IV**
10. Transplant eligibility scoring → **King's College Criteria**

## Differential Diagnosis

| Condition | Differentiating Features |
|-----------|------------------------|
| Acute-on-chronic liver failure | Pre-existing chronic liver disease |
| Decompensated cirrhosis | Stigmata of CLD, known history |
| Acute viral hepatitis (without failure) | No encephalopathy, INR normal |
| HELLP syndrome | Pregnancy, hemolysis, elevated LFT, low platelets |
| Ischemic hepatitis | Shock/hypotension preceding, AST/ALT >10,000, rapid recovery |
| Budd-Chiari | Hepatic vein thrombosis on Doppler, ascites prominent |
`);

w('gastroenterology','alcoholic-liver-disease',
`# Alcoholic Liver Disease — Explorer

## Overview

Alcoholic liver disease (ALD) encompasses a spectrum of liver injury from chronic alcohol use: steatosis → alcoholic hepatitis → cirrhosis. It is one of the most common causes of cirrhosis worldwide. Risk increases with >40g/day (men) or >20g/day (women) for >10 years, though individual susceptibility varies.

## Key Points

- **AST:ALT ratio >2:1** is characteristic (unlike most other liver diseases where ALT > AST)
- **GGT** is the most sensitive marker for alcohol use
- **Mallory-Denk bodies** on histology
- **Maddrey Discriminant Function ≥32** = severe alcoholic hepatitis → consider steroids
- **Steatosis is reversible** with abstinence
- **Cornerstone of treatment**: Abstinence

## Definition and Classification

| Stage | Features | Reversibility |
|-------|----------|---------------|
| Steatosis (fatty liver) | Fat droplets in >5% hepatocytes | Fully reversible with abstinence |
| Alcoholic hepatitis | Hepatocyte ballooning, Mallory-Denk bodies, neutrophilic infiltrate | Partially reversible |
| Alcoholic cirrhosis | Fibrosis, regenerative nodules (initially micronodular) | Irreversible (but function may improve with abstinence) |

## Etiology and Pathophysiology

### Risk Factors
- Quantity and duration of alcohol use
- Female sex (lower ADH, higher body fat)
- Obesity and metabolic syndrome (synergistic)
- Hepatitis C coinfection (accelerates fibrosis)
- Genetic factors: ADH/ALDH polymorphisms, PNPLA3 gene
- Malnutrition (especially protein deficiency)

### Pathophysiology
1. **Ethanol metabolism**: ADH pathway (cytoplasm) and CYP2E1 (microsomal, inducible by chronic alcohol)
2. **Acetaldehyde** (toxic intermediate) → forms protein adducts → immune activation
3. **CYP2E1 induction** → reactive oxygen species (ROS) → oxidative stress, lipid peroxidation
4. **Kupffer cell activation** → TNF-α, IL-6 → inflammation, hepatocyte apoptosis
5. **Stellate cell activation** → collagen deposition → fibrosis
6. **Endotoxin translocation**: Alcohol increases gut permeability → LPS → Kupffer cell activation
7. **Lipogenesis**: Alcohol promotes SREBP-1c, inhibits AMPK → fat accumulation

## Clinical Features

### Steatosis
- Often asymptomatic
- Mild hepatomegaly
- May have RUQ discomfort

### Alcoholic Hepatitis
- Rapid onset jaundice, fever
- Tender hepatomegaly
- Ascites
- Leukocytosis (may mimic sepsis)
- Encephalopathy (severe cases)
- Malnutrition signs

### Cirrhosis Features
- Jaundice, spider angiomata, palmar erythema
- Parotid enlargement, Dupuytren contracture
- Gynecomastia, testicular atrophy
- Caput medusae, ascites, splenomegaly
- Hepatic encephalopathy

## Diagnosis

### Laboratory
- **AST:ALT ratio >2:1** (classic — alcohol upregulates AST release, impairs ALT pyridoxal phosphate cofactor)
- **GGT markedly elevated** (most sensitive marker)
- **MCV >100** (macrocytosis from direct alcohol toxicity + folate deficiency)
- **Elevated bilirubin, INR** (synthetic failure)
- **Hypoalbuminemia**
- **Leukocytosis** (in alcoholic hepatitis)

### Scoring Systems
- **Maddrey Discriminant Function (MDF)**: 4.6 × (patient PT - control PT) + serum bilirubin (mg/dL)
  - **MDF ≥32** = severe alcoholic hepatitis → consider corticosteroids
- **MELD score**: Used for transplant listing and prognosis
- **Lille score**: Assessed at day 7 of steroid therapy — if >0.45, stop steroids (non-responder)

### Histology (Liver Biopsy)
- **Steatosis**: Macrovesicular fat in zone 3 (centrilobular)
- **Alcoholic hepatitis**: Hepatocyte ballooning, **Mallory-Denk bodies** (damaged cytokeratins), neutrophilic infiltrate ("satellitosis"), megamitochondria
- **Cirrhosis**: Micronodular fibrosis initially

## Management

### Abstinence (Cornerstone)
- Brief interventions, motivational interviewing
- Pharmacotherapy: Naltrexone, Acamprosate, Disulfiram
- AA/support groups

### Nutritional Support
- High-protein diet (1.2–1.5 g/kg/day) — protein restriction only in Grade III/IV encephalopathy
- Thiamine supplementation (prevent Wernicke's)
- Folate, B12, multivitamins

### Alcoholic Hepatitis (Severe: MDF ≥32)
- **Prednisolone 40mg/day × 28 days** (then taper)
  - Assess response with **Lille score at day 7**
  - Lille >0.45 → stop steroids (non-responder)
- **Pentoxifylline** (400mg TID × 28 days) — alternative if contraindication to steroids
- Rule out infection before starting steroids
- **NAC may be adjunctive** to steroids

### Cirrhosis Management
- Standard cirrhosis management (see liver-cirrhosis)
- Liver transplant: traditionally requires 6 months abstinence
  - Increasingly, early transplant for severe alcoholic hepatitis non-responders

## Complications and Prognosis

### Complications
- All complications of cirrhosis (varices, ascites, HCC, etc.)
- Wernicke-Korsakoff syndrome (thiamine deficiency)
- Alcoholic cardiomyopathy
- Pancreatitis
- Peripheral neuropathy
- Zieve syndrome (hemolytic anemia + jaundice + hyperlipidemia)

### Prognosis
- Steatosis: excellent with abstinence (complete reversal)
- Alcoholic hepatitis: MDF <32 = 10% 30-day mortality; MDF ≥32 = 30-50% 30-day mortality
- Cirrhosis: 5-year survival 60% if abstinent, 30% if continued drinking

## References

- Harrison's Principles of Internal Medicine, 21st Edition
- EASL Clinical Practice Guidelines on ALD
- ACG Clinical Guidelines on Alcoholic Liver Disease
`,
`# Alcoholic Liver Disease — Exam Prep

## Quick Summary

ALD spectrum: steatosis → alcoholic hepatitis → cirrhosis. AST:ALT >2:1. MDF ≥32 = severe alcoholic hepatitis → Prednisolone × 28 days (assess Lille score day 7). Abstinence is cornerstone. Mallory-Denk bodies on biopsy. GGT most sensitive marker.

## High Yield Points ★

★ AST:ALT ratio >2:1 (ALT needs pyridoxal phosphate — depleted in alcoholics)
★ GGT is the most sensitive marker of alcohol use
★ Maddrey DF = 4.6 × (PT - control PT) + Bilirubin; ≥32 = severe
★ Steatosis is FULLY reversible with abstinence
★ Mallory-Denk bodies = damaged intermediate filaments (cytokeratins 8 & 18)
★ Neutrophilic infiltrate (NOT lymphocytic) distinguishes alcoholic hepatitis
★ Prednisolone (NOT predniSONE) — liver converts predniSONE to predniSOLONE (impaired in liver disease)
★ Lille score >0.45 at day 7 → STOP steroids (non-responder, increase infection risk)
★ Macrocytosis (MCV >100) — direct alcohol toxicity + folate deficiency

## Mnemonics

**AST > ALT in ALD**: "Scotch ALTers the liver — AST Stays on Top" (ratio >2:1)

**MDF Formula**: "4.6 × PT difference + Bili" — threshold ≥32 for steroids

**Alcoholic hepatitis biopsy "MBN"**: Mallory-Denk Bodies, Ballooning degeneration, Neutrophilic infiltrate

## Common MCQ Topics

1. AST:ALT ratio in ALD → **>2:1**
2. Characteristic histological finding → **Mallory-Denk bodies**
3. MDF threshold for steroids → **≥32**
4. Most sensitive lab marker → **GGT**
5. Reversible stage → **Steatosis**
6. Assessment of steroid response → **Lille score at day 7**
7. Zieve syndrome triad → **Hemolytic anemia + jaundice + hyperlipidemia**
8. Type of cirrhosis → **Micronodular (initially)**
9. Protein recommendation → **High protein (1.2-1.5 g/kg/day)**
10. Pentoxifylline mechanism → **Phosphodiesterase inhibitor (reduces TNF-α)**

## Differential Diagnosis

| Condition | Key Differentiator |
|-----------|-------------------|
| NASH | No/minimal alcohol use, metabolic syndrome, ALT > AST |
| Viral hepatitis | Viral markers positive, ALT >> AST |
| Drug-induced liver injury | Temporal drug exposure, RUCAM score |
| Autoimmune hepatitis | ANA/SMA positive, elevated IgG, female predominance |
| Wilson disease | Young age, KF rings, low ceruloplasmin |
| Hemochromatosis | Elevated ferritin/transferrin saturation, HFE gene |
`);

w('gastroenterology','chronic-pancreatitis-medical',
`# Chronic Pancreatitis — Explorer

## Overview

Chronic pancreatitis (CP) is a progressive inflammatory disease causing irreversible structural damage to the pancreas with fibrosis, calcification, ductal distortion, and loss of exocrine and endocrine function. Alcohol is the most common cause (70-80% in adults). It significantly reduces quality of life primarily due to chronic pain.

## Key Points

- **Most common cause**: Alcohol (adults), Idiopathic/Genetic (children)
- **Pathognomonic finding**: Pancreatic calcifications on CT/X-ray
- **Classic triad**: Steatorrhea + Diabetes + Pancreatic calcifications (late disease)
- **Pain** is the dominant symptom — worse after meals, relieved by leaning forward
- **Exocrine insufficiency** → steatorrhea when >90% function lost
- **Fecal elastase-1** <200 μg/g = exocrine insufficiency
- **Classification**: TIGAR-O (etiologic)

## Definition and Classification

### TIGAR-O Etiologic Classification
| Category | Examples |
|----------|---------|
| **T**oxic-metabolic | Alcohol, tobacco, hypercalcemia, hypertriglyceridemia, CKD |
| **I**diopathic | Early-onset, Late-onset, Tropical pancreatitis |
| **G**enetic | PRSS1 (hereditary), CFTR, SPINK1, CTRC |
| **A**utoimmune | Type 1 (IgG4-related), Type 2 (GEL — granulocytic epithelial lesion) |
| **R**ecurrent severe acute | Post-necrotic, recurrent acute pancreatitis |
| **O**bstructive | Pancreas divisum, sphincter of Oddi dysfunction, tumors |

### Cambridge Classification (Morphologic Severity)
- Normal → Equivocal → Mild → Moderate → Marked (based on ductal changes)

## Etiology and Pathophysiology

### SAPE Hypothesis (Sentinel Acute Pancreatitis Event)
1. Initial acute pancreatitis event → necrosis-inflammation
2. Ongoing insult (alcohol, smoking) → recurrent injury
3. Stellate cell activation → fibrosis
4. Progressive duct obstruction → calcification
5. Parenchymal loss → exocrine and endocrine insufficiency

### Tropical Pancreatitis (Indian Subcontinent)
- Young patients (10-30 years)
- Non-alcoholic
- Large intraductal calculi ("pancreatic stones")
- Higher risk of pancreatic cancer
- Possibly related to cassava consumption/malnutrition (debated)

## Clinical Features

- **Pain**: Epigastric, radiating to back, worse postprandially, relieved by sitting up and leaning forward
- **Steatorrhea**: Bulky, oily, foul-smelling stools (when >90% exocrine function lost)
- **Weight loss**: From malabsorption and reduced intake (fear of eating)
- **Diabetes mellitus** (Type 3c): Endocrine insufficiency — both insulin and glucagon deficiency
- **Fat-soluble vitamin deficiency** (A, D, E, K)
- **B12 malabsorption** (pancreatic enzymes needed to release B12 from R-protein)
- **Narcotic addiction**: Due to chronic pain management

## Diagnosis

### Imaging
- **CT abdomen**: Calcifications (pathognomonic), ductal dilatation, parenchymal atrophy
- **MRCP/Secretin-MRCP**: Ductal anatomy, side-branch changes
- **EUS**: Most sensitive for early changes
- **X-ray abdomen**: Calcifications in pancreatic area

### Functional Tests
- **Fecal elastase-1**: <200 μg/g = exocrine insufficiency (simple, reliable)
- **72-hour fecal fat**: >7g/day = steatorrhea
- **Secretin stimulation test**: Gold standard for exocrine function (rarely done)
- **HbA1c/fasting glucose**: Screen for diabetes

### Differentiate from Pancreatic Cancer
- CT/MRI with contrast, EUS-FNA, CA 19-9 (elevated in cancer)
- Chronic pancreatitis has 2-5% lifetime risk of pancreatic cancer

## Management

### Pain Management (Stepwise)
1. Lifestyle: Abstinence from alcohol and tobacco
2. Analgesics: Paracetamol → NSAIDs → Tramadol → weak opioids
3. Pancreatic enzyme replacement (may reduce pain by feedback inhibition of CCK)
4. Antioxidant therapy (limited evidence)
5. Endoscopic therapy: ESWL for stones, stenting for strictures
6. Celiac plexus block (temporary relief)
7. Surgery: Lateral pancreaticojejunostomy (Puestow/Partington-Rochelle) for dilated duct (>7mm), Frey procedure (local resection + drainage), pancreaticoduodenectomy (Whipple) for head mass

### Exocrine Insufficiency
- **Pancreatic enzyme replacement therapy (PERT)**: Lipase 40,000-50,000 units per meal, 25,000 per snack
- Take with meals (beginning and during)
- **PPI co-therapy** (to prevent acid inactivation of enzymes)
- Low-fat diet (controversial — ensure adequate nutrition)
- Fat-soluble vitamin supplementation (A, D, E, K)

### Endocrine Insufficiency
- Insulin therapy for diabetes (Type 3c)
- Caution: also have glucagon deficiency → prone to hypoglycemia
- Avoid aggressive blood sugar targets

## Complications and Prognosis

### Complications
- Pseudocyst (most common), pseudoaneurysm
- Bile duct stricture → obstructive jaundice
- Duodenal obstruction
- Splenic vein thrombosis → left-sided portal hypertension → gastric varices
- Pancreatic cancer (2-5% risk)
- Narcotic dependence

### Prognosis
- 10-year survival: ~70% (20-year: ~45%)
- Mortality mainly from cancer, complications of diabetes, and other alcohol-related diseases
- Abstinence slows but does not stop progression

## References

- Harrison's Principles of Internal Medicine, 21st Edition
- APA Practice Guidelines on Chronic Pancreatitis
- ACG Clinical Guidelines on Chronic Pancreatitis
`,
`# Chronic Pancreatitis — Exam Prep

## Quick Summary

Chronic irreversible pancreatic damage. Alcohol is #1 cause. Pathognomonic: pancreatic calcifications. Classic triad: pain + steatorrhea + diabetes (late). TIGAR-O classification. Treatment: abstinence, pain management (stepwise), PERT for malabsorption, surgery for dilated duct.

## High Yield Points ★

★ Pancreatic calcifications on CT/X-ray = pathognomonic for chronic pancreatitis
★ Fecal elastase-1 <200 μg/g confirms exocrine insufficiency
★ Steatorrhea appears when >90% exocrine function is lost
★ Type 3c diabetes: both insulin AND glucagon deficient → hypoglycemia-prone
★ Tropical pancreatitis: young, non-alcoholic, large ductal stones (Indian subcontinent)
★ Puestow/Frey procedure for dilated pancreatic duct (>7mm)
★ Splenic vein thrombosis → isolated gastric varices (left-sided portal hypertension)
★ PERT dose: 40,000-50,000 lipase units per meal + PPI

## Mnemonics

**TIGAR-O**: Toxic, Idiopathic, Genetic, Autoimmune, Recurrent acute, Obstructive

**Pain relief posture**: "Pancreatic prayer position" — sitting, leaning forward

**Type 3c diabetes**: "No insulin, No glucagon = No safety net" (hypoglycemia risk)

## Common MCQ Topics

1. Most common cause → **Alcohol**
2. Pathognomonic imaging → **Pancreatic calcifications**
3. Exocrine insufficiency test → **Fecal elastase-1**
4. Surgery for dilated duct → **Lateral pancreaticojejunostomy (Puestow)**
5. Type of diabetes → **Type 3c (pancreatogenic)**
6. Genetic causes → **PRSS1, CFTR, SPINK1**
7. Steatorrhea threshold → **>90% exocrine function loss**
8. Most common complication → **Pseudocyst**
9. Cancer risk → **2-5%**

## Differential Diagnosis

| Condition | Differentiator |
|-----------|---------------|
| Pancreatic cancer | Weight loss prominent, painless jaundice, CA 19-9 elevated |
| Peptic ulcer disease | Relationship to meals different, responds to PPI |
| Mesenteric ischemia | Postprandial pain, "food fear," vascular risk factors |
| IBS | No calcifications, normal imaging, no malabsorption |
| Gastroparesis | Nausea/vomiting dominant, gastric emptying study delayed |
`);

// I need to generate 100+ more topics. Let me create a function for efficient content generation
// and continue with all remaining topics.

// Helper for consistent explorer format
function mkExplorer(title, sections) {
  return `# ${title} — Explorer

## Overview

${sections.overview}

## Key Points

${sections.keyPoints}

## Definition and Classification

${sections.classification}

## Etiology and Pathophysiology

${sections.etiology}

## Clinical Features

${sections.clinical}

## Diagnosis

${sections.diagnosis}

## Management

${sections.management}

## Complications and Prognosis

${sections.complications}

## References

- Harrison's Principles of Internal Medicine, 21st Edition
- Davidson's Principles and Practice of Medicine, 24th Edition
- NMC Competency-Based Medical Education Curriculum
`;
}

function mkExam(title, sections) {
  return `# ${title} — Exam Prep

## Quick Summary

${sections.summary}

## High Yield Points ★

${sections.highYield}

## Mnemonics

${sections.mnemonics}

## Common MCQ Topics

${sections.mcq}

## Differential Diagnosis

${sections.ddx}
`;
}

// REMAINING GASTRO TOPICS

w('gastroenterology','drug-induced-liver-injury',
mkExplorer('Drug-Induced Liver Injury', {
  overview: 'Drug-induced liver injury (DILI) is liver damage caused by medications, herbal products, or supplements. It is the most common cause of acute liver failure in Western countries. Paracetamol causes intrinsic (dose-dependent) DILI; most other drugs cause idiosyncratic (unpredictable) DILI. Common culprits in India: anti-TB drugs (Isoniazid, Rifampicin, Pyrazinamide).',
  keyPoints: `- **Most common cause of ALF** in the West (paracetamol)
- **Two types**: Intrinsic (dose-dependent) vs Idiosyncratic (unpredictable)
- **R ratio** = (ALT/ULN) ÷ (ALP/ULN) — classifies pattern
- **Hy's Law**: ALT >3× ULN + Bilirubin >2× ULN + no other cause → >10% mortality
- **RUCAM score**: Causality assessment tool
- **Most important step**: STOP the offending drug`,
  classification: `### By Pattern (R Ratio)
| Pattern | R Ratio | Examples |
|---------|---------|---------|
| Hepatocellular | >5 | INH, Paracetamol, NSAIDs, Statins |
| Cholestatic | <2 | Amoxicillin-Clavulanate, Erythromycin, OCPs |
| Mixed | 2-5 | Phenytoin, Sulfonamides |

### By Mechanism
- **Intrinsic**: Dose-dependent, predictable, reproducible (Paracetamol, Aspirin, Methotrexate)
- **Idiosyncratic**: Dose-independent, unpredictable, variable latency
  - Metabolic idiosyncrasy (INH — slow acetylators)
  - Immunoallergic (fever, rash, eosinophilia — Phenytoin, Sulfonamides)`,
  etiology: `### Paracetamol Toxicity
- Normal: 90% conjugation (glucuronidation/sulfation), 5% via CYP2E1 → NAPQI → detoxified by glutathione
- Overdose: Conjugation saturated → excess NAPQI → glutathione depletion (>70%) → NAPQI binds hepatocyte proteins → **centrilobular necrosis (zone 3)**
- Risk factors: Chronic alcohol (CYP2E1 induction), fasting/malnutrition (low glutathione), enzyme inducers

### Anti-TB Drug Hepatotoxicity
- INH: metabolized to hepatotoxic metabolites; slow acetylators at higher risk
- Rifampicin: enzyme inducer, cholestatic, potentiates INH toxicity
- Pyrazinamide: dose-dependent hepatotoxicity
- Combination therapy increases risk synergistically

### Other Common Drugs
- Amoxicillin-Clavulanate (most common cause of idiosyncratic DILI in many countries)
- Methotrexate (cumulative dose-related fibrosis)
- Statins (usually mild, self-limiting)
- Anti-epileptics: Valproate (microvesicular steatosis), Carbamazepine, Phenytoin`,
  clinical: `### Presentation Varies by Pattern
- **Hepatocellular**: Jaundice, nausea, fatigue, markedly elevated ALT/AST, may progress to ALF
- **Cholestatic**: Pruritus, jaundice, pale stools, elevated ALP/GGT, may persist months after drug withdrawal
- **Immunoallergic**: Fever, rash, eosinophilia, lymphadenopathy ("DRESS syndrome") 1-6 weeks after starting drug

### Latency Period
- Days: Paracetamol (intrinsic)
- 1-6 weeks: Immunoallergic (Phenytoin, Allopurinol)
- 1-6 months: Metabolic idiosyncrasy (INH, Amoxicillin-Clavulanate)
- Months-years: Methotrexate (chronic)`,
  diagnosis: `### RUCAM Score (Roussel Uclaf Causality Assessment)
- Evaluates: temporal relationship, course after cessation, risk factors, concomitant drugs, exclusion of other causes, response to re-exposure
- Score: >8 highly probable, 6-8 probable, 3-5 possible, 1-2 unlikely, ≤0 excluded

### Workup
- LFT pattern (calculate R ratio)
- Temporal relationship between drug and injury
- Rule out viral hepatitis (HAV, HBV, HCV, HEV)
- Autoimmune markers (ANA, SMA, IgG)
- Imaging (USG — rule out biliary obstruction)
- Drug levels when available (paracetamol)
- Liver biopsy: rarely needed, may show specific patterns

### Hy's Law
- ALT >3× ULN + Total Bilirubin >2× ULN + no other cause = **>10% risk of fatal outcome**
- Used in drug development as safety signal`,
  management: `### General Principles
1. **STOP the suspected drug** (most important intervention)
2. Supportive care
3. Monitor LFT until normalization
4. Causality assessment (RUCAM)

### Specific Treatments
- **Paracetamol**: N-acetylcysteine (glutathione precursor)
- **Cholestatic DILI**: Ursodeoxycholic acid (may help), cholestyramine for pruritus
- **Valproate**: L-carnitine supplementation
- **Drug-induced autoimmune hepatitis**: Corticosteroids
- **ALF**: Liver transplant if meets criteria

### Anti-TB Drug Rechallenge Protocol
- Stop all hepatotoxic drugs, wait until LFT normalizes
- Rechallenge one at a time: Rifampicin first (3-7 days) → INH (3-7 days) → Pyrazinamide (if needed)
- Monitor LFT at each step; if LFT re-elevates → that drug is the culprit`,
  complications: `### Complications
- Acute liver failure (10% mortality with Hy's Law)
- Chronic DILI (persists >6 months after drug withdrawal, especially cholestatic)
- Vanishing bile duct syndrome (chronic cholestatic DILI)
- Drug-induced autoimmune hepatitis
- Death without transplant in severe cases

### Prognosis
- Most patients recover after drug withdrawal
- Hepatocellular pattern with jaundice: higher mortality (Hy's Law)
- Cholestatic pattern: lower mortality but may take months to resolve
- Chronic DILI develops in ~5-10%`
}),
mkExam('Drug-Induced Liver Injury', {
  summary: 'Liver damage from drugs/herbs/supplements. Two types: intrinsic (paracetamol — dose-dependent) and idiosyncratic (most drugs — unpredictable). R ratio classifies pattern (hepatocellular >5, cholestatic <2, mixed 2-5). Hy\'s Law predicts >10% mortality. Most important step: STOP the drug.',
  highYield: `★ R ratio = (ALT/ULN) ÷ (ALP/ULN): >5 hepatocellular, <2 cholestatic, 2-5 mixed
★ Hy's Law: ALT >3× + Bilirubin >2× + no other cause = >10% fatal outcome
★ Paracetamol toxicity = Zone 3 (centrilobular) necrosis (highest CYP2E1)
★ Anti-TB rechallenge order: Rifampicin first → INH → Pyrazinamide
★ Amoxicillin-Clavulanate = most common cause of idiosyncratic DILI
★ INH toxicity: slow acetylators at higher risk
★ RUCAM score: >8 = highly probable causality
★ DRESS syndrome: Drug Rash, Eosinophilia, Systemic Symptoms (fever, liver, lymph nodes)`,
  mnemonics: `**R ratio**: "R for Ratio" = (ALT/ULN) ÷ (ALP/ULN). >5 = "Hepatocellular Hurts more", <2 = "Cholestasis is Calmer"

**Hy's Law**: "3-2-die" = ALT >3×, Bili >2×, mortality >10%

**Anti-TB rechallenge**: "RIP" order — Rifampicin, INH, Pyrazinamide (one at a time)`,
  mcq: `1. Most common cause of ALF in West → **Paracetamol**
2. Paracetamol toxic metabolite → **NAPQI**
3. Zone of paracetamol necrosis → **Zone 3 (centrilobular)**
4. RUCAM score used for → **Causality assessment**
5. Hy's Law mortality risk → **>10%**
6. INH risk factor → **Slow acetylators**
7. Most important treatment step → **Stop offending drug**
8. Anti-TB rechallenge first drug → **Rifampicin**`,
  ddx: `| Condition | Differentiator |
|-----------|---------------|
| Viral hepatitis | Viral markers positive |
| Autoimmune hepatitis | ANA/SMA+, elevated IgG, chronic |
| Alcoholic hepatitis | AST:ALT >2:1, alcohol history |
| Ischemic hepatitis | Shock/hypotension history, very high ALT, rapid recovery |
| Biliary obstruction | Dilated ducts on imaging |
| Wilson disease | Young age, low ceruloplasmin, KF rings |`
}));

w('gastroenterology','gerd-medical',
mkExplorer('GERD (Gastroesophageal Reflux Disease)', {
  overview: 'GERD is a chronic condition where gastric contents reflux into the esophagus causing troublesome symptoms and/or mucosal damage. It affects 10-20% of the Western population and is the most common esophageal disorder. The Montreal Definition (2006) classifies it into esophageal and extra-esophageal syndromes.',
  keyPoints: `- **Most common esophageal disorder**
- **Primary mechanism**: Transient lower esophageal sphincter relaxation (TLESR)
- **Gold standard for acid reflux**: 24-hour pH monitoring
- **Most feared complication**: Barrett esophagus → esophageal adenocarcinoma
- **First-line treatment**: PPI therapy (8 weeks)
- **70% patients**: Non-erosive reflux disease (NERD)`,
  classification: `### Montreal Classification
- **Esophageal syndromes**: Typical reflux syndrome, reflux chest pain, erosive esophagitis, Barrett esophagus, stricture, adenocarcinoma
- **Extra-esophageal syndromes**: Reflux cough, reflux laryngitis, reflux asthma, dental erosions

### LA Classification of Esophagitis
| Grade | Description |
|-------|------------|
| A | Mucosal break(s) <5mm, not extending between folds |
| B | Mucosal break(s) >5mm, not extending between folds |
| C | Mucosal breaks extending between folds, <75% circumference |
| D | Mucosal breaks >75% circumference |

### NERD vs Erosive
- **NERD (70%)**: Symptoms present, no erosions on endoscopy
- **Erosive esophagitis (30%)**: Visible mucosal breaks`,
  etiology: `### Pathophysiology
1. **Transient LES relaxation (TLESR)** — most important mechanism (60-70% of reflux episodes)
2. **Reduced LES pressure** — scleroderma, medications (CCBs, nitrates, theophylline)
3. **Hiatal hernia** — disrupts GE junction, impairs LES function, creates acid pocket
4. **Impaired esophageal clearance** — reduced peristalsis, saliva
5. **Delayed gastric emptying** — gastroparesis, obesity
6. **Acid pocket** — postprandial acid layer above gastric contents (near GE junction)

### Risk Factors
- Obesity (increased intra-abdominal pressure)
- Pregnancy
- Hiatal hernia
- Smoking (reduces LES pressure)
- Medications: CCBs, nitrates, anticholinergics, benzodiazepines
- Dietary: caffeine, chocolate, alcohol, fatty/spicy food, citrus
- Connective tissue disorders (scleroderma)`,
  clinical: `### Typical Symptoms
- **Heartburn**: Retrosternal burning sensation, worse postprandially, supine, bending
- **Regurgitation**: Effortless return of gastric contents to pharynx
- **Dysphagia**: Suggests complication (stricture, ring, cancer)

### Atypical/Extra-esophageal
- **Chronic cough** (especially nocturnal)
- **Hoarseness/laryngitis** (posterior laryngitis)
- **Asthma** (worsening nocturnal)
- **Non-cardiac chest pain**
- **Dental erosions** (lingual surface of teeth)
- **Globus sensation**

### Alarm Features (Need Endoscopy)
- Dysphagia, odynophagia
- Weight loss, anorexia
- GI bleeding/anemia
- New onset >50 years
- Persistent vomiting
- Family history of GI cancer`,
  diagnosis: `### Initial Approach
- **Typical symptoms + PPI response** = presumptive diagnosis (no investigation needed)
- **Endoscopy**: For alarm features, refractory symptoms, screening high-risk Barrett's

### Investigations
- **Upper GI endoscopy**: Assess esophagitis (LA classification), Barrett's, stricture, rule out cancer
- **24-hour pH monitoring**: Gold standard for acid reflux quantification (DeMeester score >14.7 = abnormal)
- **pH-impedance monitoring**: Detects acid AND non-acid reflux (best overall test)
- **High-resolution manometry**: Before surgery (rule out achalasia, assess peristalsis)
- **Barium swallow**: Hiatal hernia (not routinely needed)

### Barrett Esophagus
- **Intestinal metaplasia** (columnar epithelium with goblet cells replacing squamous)
- **Salmon-colored mucosa** extending above GE junction on endoscopy
- **Dysplasia grading**: No dysplasia → Low-grade → High-grade → Adenocarcinoma
- **Screening**: Consider in chronic GERD with risk factors (male, >50, obesity, white, smoking)
- **Surveillance**: No dysplasia every 3-5 years, LGD every 6-12 months, HGD → treat (ablation)`,
  management: `### Lifestyle Modifications
- Weight loss (if overweight/obese)
- Head of bed elevation (6-8 inches)
- Avoid eating 2-3 hours before bedtime
- Avoid triggers: fatty foods, chocolate, caffeine, alcohol, citrus, spicy food
- Smoking cessation
- Avoid tight clothing

### Pharmacotherapy
- **PPIs (first-line)**: Omeprazole, Pantoprazole, Esomeprazole, Rabeprazole
  - Standard dose × 8 weeks for initial therapy
  - Step-down to lowest effective dose for maintenance
  - Best taken 30-60 min before meals
- **H2 receptor blockers**: Ranitidine/Famotidine — for mild/breakthrough symptoms, on-demand
- **Antacids/Alginates**: Symptomatic relief, rapid onset, short duration
- **Prokinetics**: Domperidone, Mosapride (adjunctive)
- **Baclofen**: Reduces TLESR (refractory cases)

### Surgical/Endoscopic
- **Laparoscopic Nissen fundoplication**: 360° wrap, for refractory GERD, large hiatal hernia, patient preference
- **LINX device**: Magnetic sphincter augmentation
- **Endoscopic therapy**: Stretta (radiofrequency), TIF (transoral incisionless fundoplication)
- **Barrett's treatment**: Radiofrequency ablation (RFA) for dysplasia, endoscopic mucosal resection (EMR)`,
  complications: `### Complications
- **Erosive esophagitis** (30% of GERD)
- **Barrett esophagus** → **Esophageal adenocarcinoma** (0.5% per year progression)
- **Peptic stricture** (dysphagia, need dilation)
- **Schatzki ring** (distal esophageal mucosal ring)
- **Esophageal ulceration**
- **Aspiration pneumonia**
- **Laryngeal/dental complications**

### Prognosis
- Chronic relapsing condition
- 80% respond to PPI therapy
- Barrett's risk of adenocarcinoma: ~0.5% per year (without dysplasia)
- Post-fundoplication: 90% symptom improvement, 10-15% may develop dysphagia/gas-bloat`
}),
mkExam('GERD (Gastroesophageal Reflux Disease)', {
  summary: 'Chronic reflux of gastric contents causing symptoms/mucosal damage. Primary mechanism: TLESR. 70% have NERD (no erosions). Gold standard: 24h pH monitoring. Treatment: lifestyle + PPI × 8 weeks. Major complication: Barrett esophagus (intestinal metaplasia → adenocarcinoma).',
  highYield: `★ TLESR is the primary mechanism (not low LES pressure)
★ 24-hour pH monitoring is the gold standard for acid reflux diagnosis
★ LA Classification: A (<5mm) → D (>75% circumference)
★ Barrett's = intestinal metaplasia with GOBLET CELLS (columnar replacing squamous)
★ Barrett's cancer risk = ~0.5% per year
★ PPI therapy best taken 30-60 min BEFORE meals (need acid for activation)
★ Nissen fundoplication = 360° wrap (MUST rule out achalasia first with manometry)
★ Scleroderma GERD: low LES pressure + poor peristalsis (worst GERD)
★ NERD patients may have functional heartburn → poor PPI response`,
  mnemonics: `**Alarm features "DAWNO"**: Dysphagia, Anemia, Weight loss, New onset >50, Odynophagia

**Barrett's**: "SIM-ply dangerous" — Specialized Intestinal Metaplasia (goblet cells)

**GERD triggers "CCCCAS"**: Caffeine, Chocolate, Citrus, Cigarettes, Alcohol, Spicy food`,
  mcq: `1. Gold standard for acid reflux → **24-hour pH monitoring**
2. Primary mechanism → **TLESR**
3. Barrett's histology → **Intestinal metaplasia with goblet cells**
4. LA Grade D → **>75% circumference erosion**
5. First-line treatment → **PPI therapy**
6. Premalignant complication → **Barrett esophagus**
7. Before fundoplication → **High-resolution manometry (rule out achalasia)**
8. DeMeester score threshold → **>14.7**
9. Barrett's surveillance (no dysplasia) → **Every 3-5 years**
10. Barrett's treatment for dysplasia → **Radiofrequency ablation (RFA)**`,
  ddx: `| Condition | Differentiator |
|-----------|---------------|
| Eosinophilic esophagitis | Young male, dysphagia, atopy, rings/furrows on endoscopy, eosinophils >15/HPF |
| Achalasia | Dysphagia solids AND liquids, bird-beak on barium, absent peristalsis |
| Esophageal cancer | Progressive dysphagia, weight loss, mass on endoscopy |
| Cardiac chest pain | Exertional, ECG changes, troponin elevation |
| Functional heartburn | Normal pH study, no response to PPI, Rome IV criteria |
| Peptic ulcer disease | Epigastric pain, meal-related, H. pylori |`
}));

// Continue with remaining GI topics more efficiently...
// I'll batch the rest in one go

const remainingContent = [
// GI Motility
['gastroenterology','gi-motility-disorders','GI Motility Disorders',
{overview:'GI motility disorders encompass conditions with abnormal gastrointestinal movement: achalasia, gastroparesis, intestinal pseudo-obstruction, and irritable bowel syndrome (IBS). Achalasia involves loss of inhibitory neurons in Auerbach plexus → failed LES relaxation + aperistalsis of esophageal body.',
keyPoints:`- **Achalasia gold standard**: High-resolution manometry
- **Bird-beak sign**: Barium swallow in achalasia
- **Dysphagia for solids AND liquids**: Hallmark of motility disorder (vs mechanical = solids first)
- **Gastroparesis**: Most commonly diabetic; gold standard = gastric emptying scintigraphy
- **IBS**: Rome IV criteria, diagnosis of exclusion, no structural pathology
- **Best treatment for achalasia**: Heller myotomy (laparoscopic) or POEM`,
classification:`### Achalasia (Chicago Classification v4.0)
| Type | Features | Treatment Response |
|------|----------|-------------------|
| Type I | Classic — absent peristalsis, minimal pressurization | Moderate |
| Type II | Absent peristalsis with panesophageal pressurization | **Best response** |
| Type III | Spastic — premature contractions (spasm) | Poorest |

### IBS (Rome IV)
- Recurrent abdominal pain ≥1 day/week for ≥3 months
- Associated with ≥2 of: defecation, change in frequency, change in form
- Subtypes: IBS-C (constipation), IBS-D (diarrhea), IBS-M (mixed), IBS-U (unclassified)`,
etiology:`### Achalasia
- Loss of inhibitory neurons (NO/VIP-producing) in myenteric (Auerbach) plexus
- Cause unknown in most (primary/idiopathic)
- Secondary: Chagas disease (Trypanosoma cruzi — South America), malignancy (pseudoachalasia)
- Results in: failed LES relaxation + absent peristalsis of esophageal body

### Gastroparesis
- **Diabetic** (most common — vagal neuropathy)
- Post-surgical (vagotomy)
- Idiopathic (post-viral)
- Medications (opioids, anticholinergics, GLP-1 agonists)

### IBS
- Visceral hypersensitivity (lowered pain threshold)
- Altered gut-brain axis (serotonin dysregulation)
- Gut microbiome dysbiosis
- Post-infectious (PI-IBS — after gastroenteritis)
- Psychological factors (anxiety, depression)`,
clinical:`### Achalasia
- **Progressive dysphagia** for solids AND liquids (key feature)
- Regurgitation of undigested food (bland, non-bilious)
- Weight loss
- Chest pain (especially Type III)
- Nocturnal cough (aspiration)
- Halitosis

### Gastroparesis
- Nausea and vomiting (food eaten hours earlier)
- Early satiety, postprandial fullness
- Bloating, abdominal distension
- Weight loss
- Poor glycemic control (diabetics)
- Bezoar formation

### IBS
- Crampy abdominal pain (relieved by defecation)
- Bloating and distension
- Altered bowel habits (diarrhea/constipation/alternating)
- Mucus in stools
- Symptoms worse with stress
- NO nocturnal symptoms, NO weight loss, NO blood in stool (red flags for organic disease)`,
diagnosis:`### Achalasia
- **Barium swallow**: Bird-beak appearance (tapered distal esophagus), dilated proximal esophagus
- **High-resolution manometry** (gold standard): Elevated IRP (integrated relaxation pressure), absent peristalsis
- **Endoscopy**: Rule out pseudoachalasia (GE junction cancer mimicking achalasia), resistance at GEJ with "popping" into stomach

### Gastroparesis
- **Gastric emptying scintigraphy** (gold standard): >10% retention at 4 hours = delayed
- Upper endoscopy: rule out obstruction, may show food retention
- SmartPill (wireless motility capsule)

### IBS
- Rome IV criteria (clinical diagnosis)
- Exclude organic disease: CBC, CRP, celiac serology (anti-tTG), fecal calprotectin, colonoscopy if red flags
- No specific diagnostic test for IBS`,
management:`### Achalasia
1. **Pneumatic (balloon) dilation** — effective, risk of perforation (2-5%)
2. **Laparoscopic Heller myotomy** + partial fundoplication (Dor/Toupet) — gold standard surgical
3. **POEM** (peroral endoscopic myotomy) — newer, effective, risk of GERD
4. **Botulinum toxin injection** — temporary (3-6 months), for poor surgical candidates
5. **Medical**: Nitrates, CCBs (limited efficacy, bridge to definitive therapy)

### Gastroparesis
- **Dietary**: Small, frequent, low-fat, low-fiber meals; liquid calories if severe
- **Prokinetics**: Metoclopramide (dopamine antagonist — black box: tardive dyskinesia), Domperidone, Erythromycin (motilin agonist — tachyphylaxis)
- **Antiemetics**: Ondansetron
- **Gastric electrical stimulation** (pacemaker) for refractory
- **Optimize glycemic control** in diabetics

### IBS
- **Diet**: Low FODMAP diet (evidence-based), fiber supplementation (IBS-C)
- **Antispasmodics**: Hyoscine, Mebeverine, Dicyclomine
- **IBS-D**: Loperamide, Rifaximin (antibiotic — reduces SIBO), Eluxadoline
- **IBS-C**: Linaclotide, Lubiprostone, Prucalopride
- **Neuromodulators**: TCAs (IBS-D — amitriptyline), SSRIs (IBS-C)
- **Psychological**: CBT, hypnotherapy (evidence-based)`,
complications:`### Achalasia Complications
- Megaesophagus (sigmoid esophagus)
- Aspiration pneumonia
- Squamous cell carcinoma of esophagus (long-standing — stasis → chronic irritation)
- Malnutrition/weight loss

### Gastroparesis Complications
- Bezoar formation (undigested food mass)
- Malnutrition
- Poor glycemic control → worsening neuropathy (vicious cycle)
- Dehydration from persistent vomiting

### IBS Prognosis
- Chronic relapsing condition, no structural complications
- Does NOT increase risk of cancer or IBD
- Significant impact on quality of life`},
{summary:'Motility disorders include achalasia (LES relaxation failure), gastroparesis (delayed gastric emptying), and IBS (functional). Achalasia: bird-beak on barium, manometry is gold standard, Heller myotomy is definitive. Gastroparesis: diabetic most common, gastric emptying scintigraphy. IBS: Rome IV, low FODMAP diet.',
highYield:`★ Achalasia: dysphagia for solids AND liquids simultaneously
★ Bird-beak sign on barium swallow = achalasia
★ Achalasia Type II has the BEST response to treatment
★ High-resolution manometry = gold standard for achalasia
★ Gastroparesis gold standard = gastric emptying scintigraphy (>10% at 4h)
★ Chagas disease (T. cruzi) causes secondary achalasia (megaesophagus + megacolon)
★ IBS: NO red flags (weight loss, bleeding, nocturnal symptoms, anemia)
★ POEM: risk of post-procedure GERD (no fundoplication added)`,
mnemonics:`**Achalasia "BIRD"**: Bird-beak sign, Incomplete LES relaxation, Regurgitation of undigested food, Dysphagia for solids AND liquids

**IBS Red Flags "WANNA scope"**: Weight loss, Anemia, Nocturnal symptoms, New onset >50, Age >50

**Gastroparesis drugs**: "MDE" — Metoclopramide, Domperidone, Erythromycin (motilin agonist)`,
mcq:`1. Achalasia gold standard → **High-resolution manometry**
2. Bird-beak sign → **Achalasia (barium swallow)**
3. Best treatment response → **Achalasia Type II**
4. Most common cause of gastroparesis → **Diabetes**
5. IBS criteria → **Rome IV**
6. Long-standing achalasia cancer risk → **Squamous cell carcinoma**
7. Low FODMAP diet evidence for → **IBS**
8. POEM complication → **GERD**`,
ddx:`| Condition | Differentiator |
|-----------|---------------|
| Esophageal cancer | Progressive dysphagia solids → liquids, weight loss |
| GERD | Heartburn, responds to PPI, normal peristalsis |
| Eosinophilic esophagitis | Young atopic male, intermittent dysphagia |
| Diffuse esophageal spasm | "Corkscrew esophagus" on barium, chest pain |
| Peptic stricture | Dysphagia for solids only, GERD history |`}],

// Hepatitis B
['gastroenterology','hepatitis-b','Hepatitis B',
{overview:'Hepatitis B virus (HBV) is a partially double-stranded DNA virus (Hepadnaviridae family) causing acute and chronic liver disease. Transmission: blood, sexual, vertical (mother-to-child). Chronicity: 90% in neonates, 25-50% in children <5, <5% in immunocompetent adults. ~250 million chronic carriers globally.',
keyPoints:`- **Only DNA hepatitis virus**
- **Chronicity**: 90% neonates, <5% adults
- **cccDNA** persists in hepatocytes (difficult to eradicate)
- **HBsAg**: Active infection marker
- **Anti-HBs**: Immunity (vaccine or recovered)
- **Window period**: Only Anti-HBc IgM positive
- **First-line treatment**: Tenofovir or Entecavir
- **HCC risk**: Even WITHOUT cirrhosis (HBV integrates into host DNA)`,
classification:`### Serologic Phases of Chronic HBV
| Phase | HBeAg | HBV DNA | ALT | Old Name |
|-------|-------|---------|-----|----------|
| Immune tolerant | + | Very high (>10⁷) | Normal | Chronic HBV infection, HBeAg+ |
| Immune active (HBeAg+) | + | High (>20,000) | Elevated | Chronic HBV hepatitis, HBeAg+ |
| Inactive carrier | − | Low (<2,000) | Normal | Chronic HBV infection, HBeAg− |
| Reactivation (HBeAg−) | − | Moderate-high | Elevated | Chronic HBV hepatitis, HBeAg− |

### Serology Interpretation
| HBsAg | Anti-HBs | Anti-HBc | HBeAg | Interpretation |
|-------|----------|----------|-------|---------------|
| + | − | IgM | + | Acute infection |
| + | − | IgG | +/− | Chronic infection |
| − | + | IgG | − | Recovered (immune) |
| − | + | − | − | Vaccinated |
| − | − | IgM | − | Window period |
| − | − | IgG | − | Isolated Anti-HBc (many causes) |`,
etiology:`### Virology
- **Hepadnaviridae family**, partially double-stranded DNA
- **cccDNA** (covalently closed circular DNA): persists in hepatocyte nucleus → reservoir for viral replication → extremely difficult to eliminate → basis for "functional cure" vs "sterilizing cure"
- **Genotypes A-H**: A/D common in India, B/C in East Asia

### Pathophysiology
- HBV is NOT directly cytopathic — liver damage is **immune-mediated**
- CD8+ cytotoxic T cells recognize viral peptides on hepatocyte surface → cell killing
- Neonatal immune tolerance → high chronicity rate
- HBV DNA integration into host genome → insertional mutagenesis → **HCC risk even without cirrhosis**

### Transmission
- **Vertical** (most important globally — perinatal)
- **Horizontal** in childhood (endemic areas)
- **Sexual** (most common in low-prevalence settings)
- **Parenteral** (needle sharing, transfusion, healthcare)`,
clinical:`### Acute Hepatitis B
- **Incubation**: 6 weeks to 6 months
- **Prodrome**: Fatigue, nausea, arthralgias, serum sickness-like illness (immune complex)
- **Icteric phase**: Jaundice, dark urine, pale stools, hepatomegaly, RUQ tenderness
- **Recovery**: Weeks to months; 95% adults clear virus

### Chronic Hepatitis B
- Often **asymptomatic** for years
- Hepatomegaly
- Progression to cirrhosis → signs of chronic liver disease
- May present as acute flare (immune clearance phase)

### Extrahepatic Manifestations
- **Polyarteritis nodosa** (PAN) — classic association
- **Membranous nephropathy** (children), MPGN
- **Serum sickness-like illness** (acute phase)
- **Aplastic anemia** (rare)`,
diagnosis:`### Serology (See classification table above)
- **HBsAg**: First marker to appear, confirms active infection
- **Anti-HBs**: Immunity (titer >10 mIU/mL = protective)
- **Anti-HBc IgM**: Acute infection (high titer) — also positive during severe flares
- **Anti-HBc IgG**: Past or ongoing infection (persists for life)
- **HBeAg**: High replication state
- **Anti-HBe**: Lower replication, seroconversion
- **HBV DNA**: Viral load (quantitative PCR) — most important for treatment decisions

### Additional Workup
- LFT (ALT — correlates with immune activity)
- AFP + USG every 6 months (HCC screening — even without cirrhosis)
- Fibroscan / FibroTest (fibrosis assessment)
- Liver biopsy (rarely needed now with non-invasive methods)
- HBV genotype (may guide interferon therapy)`,
management:`### Who to Treat
- All with significant fibrosis (≥F2) or cirrhosis
- Immune active phase (elevated ALT + high HBV DNA)
- Family history of HCC
- Extrahepatic manifestations
- Pregnant women with high viral load (prevent MTCT)
- Before immunosuppression (prevent reactivation)

### First-Line Drugs
- **Tenofovir (TDF or TAF)**: High barrier to resistance, effective against all genotypes
  - TDF: monitor renal function, bone density
  - TAF: better renal/bone profile
- **Entecavir**: High barrier to resistance, well-tolerated
  - Not preferred if prior lamivudine resistance
- Treatment is usually **long-term/indefinite** (can stop if HBsAg loss achieved)

### Pegylated Interferon-α
- **Finite therapy** (48 weeks)
- Advantages: no resistance, finite duration, higher HBsAg loss rate
- Disadvantages: side effects (flu-like, depression, cytopenias), injections, contraindicated in decompensated cirrhosis

### Prevention
- **HBV vaccine**: Recombinant HBsAg, 3 doses (0, 1, 6 months)
  - Universal infant vaccination (India: at birth, 6w, 10w, 14w via pentavalent)
- **HBIG**: Post-exposure prophylaxis (needle stick, neonatal from HBsAg+ mother)
- **PMTCT**: Tenofovir for high viral load mothers + HBIG + vaccine to neonate at birth`,
complications:`### Complications
- Chronic hepatitis → Cirrhosis (15-40% over lifetime)
- **Hepatocellular carcinoma** (HCC) — can occur even without cirrhosis (HBV DNA integration)
- Fulminant hepatitis (rare, <1% of acute cases)
- Hepatic decompensation
- Reactivation (immunosuppression, chemo, rituximab — screen all before)

### HBV Reactivation
- Risk with: rituximab, high-dose steroids, TNF inhibitors, bone marrow transplant
- Screen HBsAg and Anti-HBc before all immunosuppression
- Prophylaxis: Entecavir or Tenofovir if HBsAg+ or Anti-HBc+ with high-risk therapy

### Prognosis
- Spontaneous HBsAg loss (functional cure): ~0.5-1% per year
- With treatment: >90% achieve viral suppression, HBsAg loss rare (~3-5% in 5 years)
- HCC surveillance is lifelong (even after viral suppression)`},
{summary:'HBV: DNA virus, Hepadnaviridae. 90% chronic in neonates, <5% adults. Serology: HBsAg (infection), Anti-HBs (immunity), HBeAg (high replication). Treatment: Tenofovir/Entecavir (indefinite). Prevention: vaccine + HBIG. HCC risk even without cirrhosis.',
highYield:`★ Only DNA hepatitis virus (all others RNA)
★ 90% neonates chronify vs <5% adults (immune tolerance)
★ cccDNA persists in nucleus — cannot be eliminated → "functional cure" (HBsAg loss) vs "sterilizing cure"
★ HBV can cause HCC WITHOUT cirrhosis (DNA integration → insertional mutagenesis)
★ Window period: HBsAg negative, Anti-HBs negative, only Anti-HBc IgM positive
★ PAN (Polyarteritis nodosa) — classic extrahepatic association
★ Tenofovir/Entecavir: high barrier to resistance, first-line
★ Screen HBsAg + Anti-HBc before ALL immunosuppression (reactivation risk)`,
mnemonics:`**Serology**: "Surface = Sick, anti-Surface = Safe, Core = Contact history"

**Window period**: "Surface gone, Safety not yet = only Core IgM in the Window"

**HBV complications**: "HBV = HCC Before Variceal bleeding" (HCC even without cirrhosis)

**Vaccine schedule**: "0-1-6" months (3 doses)`,
mcq:`1. Only DNA hepatitis virus → **HBV**
2. Window period marker → **Anti-HBc IgM only**
3. Vaccine antigen → **Recombinant HBsAg**
4. Infectivity marker → **HBeAg**
5. Chronicity in neonates → **90%**
6. First-line treatment → **Tenofovir or Entecavir**
7. HCC screening → **AFP + USG every 6 months**
8. Classic extrahepatic → **Polyarteritis nodosa (PAN)**
9. Rituximab risk → **HBV reactivation**
10. cccDNA location → **Hepatocyte nucleus**`,
ddx:`| Condition | Differentiator |
|-----------|---------------|
| Hepatitis C | RNA virus, Anti-HCV+, higher chronicity in adults |
| Hepatitis A/E | Acute only (no chronicity in immunocompetent), IgM markers |
| Autoimmune hepatitis | ANA/SMA+, elevated IgG, young women |
| Drug-induced hepatitis | Temporal drug relationship |
| Wilson disease | Young, KF rings, low ceruloplasmin |`}],

// Hepatitis C
['gastroenterology','hepatitis-c','Hepatitis C',
{overview:'Hepatitis C virus (HCV) is a single-stranded RNA virus (Flaviviridae) with 6 major genotypes. Unlike HBV, HCV chronifies in 55-85% of infected adults. It was the leading cause of liver transplantation before the DAA era. Direct-acting antivirals (DAAs) now achieve >95% cure (SVR) rates in 8-12 weeks.',
keyPoints:`- **RNA virus** (Flaviviridae), 6 major genotypes
- **Chronicity**: 55-85% in adults (much higher than HBV in adults)
- **No vaccine available**
- **Screening**: Anti-HCV antibody; Confirmatory: HCV RNA (PCR)
- **DAAs**: >95% cure rate (SVR12 = undetectable RNA 12 weeks post-treatment)
- **Classic extrahepatic**: Cryoglobulinemia (Type II), Porphyria cutanea tarda
- **Genotype 3**: Most common in India`,
classification:`### Genotypes
- Genotype 1: Most common globally (USA, Europe) — historically hardest to treat (now pan-genotypic DAAs)
- Genotype 3: Most common in India, South Asia — associated with steatosis
- Genotype 2: Japan, best response historically

### Disease Stage
- Acute HCV (<6 months): Usually asymptomatic, 15-45% spontaneous clearance
- Chronic HCV (>6 months): 55-85% chronify → progressive fibrosis → cirrhosis (20-30% over 20-30 years)
- Fibrosis staging: METAVIR F0-F4 (F4 = cirrhosis)`,
etiology:`### Virology
- ssRNA virus, Flaviviridae family
- RNA-dependent RNA polymerase (error-prone) → high mutation rate → quasispecies → immune evasion → chronicity
- Does NOT integrate into host DNA (unlike HBV) — HCC requires cirrhosis first
- Genotypes 1-6 with multiple subtypes

### Transmission
- **Parenteral** (most efficient): injection drug use (#1 in developed countries), unsafe blood transfusion, needle-stick
- **Sexual**: Low but present risk (higher in MSM, HIV co-infection)
- **Vertical**: 4-8% (higher with HIV co-infection)
- **No transmission**: Casual contact, breastfeeding, food/water

### Pathophysiology
- Both direct cytopathic effects AND immune-mediated injury
- Chronic inflammation → stellate cell activation → fibrosis → cirrhosis
- Genotype 3: direct steatotic effect (viral steatosis)
- Extrahepatic: immune complex disease (cryoglobulinemia), B-cell lymphoproliferation`,
clinical:`### Acute HCV
- **80% asymptomatic** — often diagnosed incidentally
- If symptomatic: fatigue, nausea, jaundice, dark urine (milder than HAV/HBV)
- Fulminant hepatitis: very rare

### Chronic HCV
- **Fatigue** (most common symptom)
- Often asymptomatic until cirrhosis develops
- Arthralgias, myalgias
- Signs of chronic liver disease/cirrhosis in advanced stages

### Extrahepatic Manifestations (Very Important!)
- **Mixed Cryoglobulinemia (Type II)**: Palpable purpura, arthralgias, glomerulonephritis (MPGN), peripheral neuropathy
- **Porphyria cutanea tarda** (PCT): Photosensitivity, blistering on sun-exposed skin
- **Lichen planus**: Oral and cutaneous
- **Non-Hodgkin lymphoma** (B-cell — marginal zone)
- **Insulin resistance / Type 2 diabetes**
- **Sicca syndrome**
- **Membranoproliferative GN**`,
diagnosis:`### Screening
- **Anti-HCV antibody** (ELISA): Positive = exposure (current or past)
  - Does not distinguish active from resolved infection
  - Remains positive even after cure

### Confirmatory
- **HCV RNA (PCR)**: Confirms active infection, quantitative (viral load)
  - Undetectable RNA + Anti-HCV positive = resolved/cured infection
  - Detectable RNA = active infection (treat)

### Pre-Treatment Assessment
- **HCV Genotype**: Guides regimen choice and duration (less important with pan-genotypic DAAs)
- **Fibrosis assessment**: Fibroscan, APRI score, FIB-4 index (identify cirrhosis — affects treatment duration and monitoring)
- **LFT, CBC, Creatinine**
- **HBV co-infection screening** (DAAs can reactivate HBV)
- **HIV testing**
- **Liver biopsy**: Rarely needed now`,
management:`### Direct-Acting Antivirals (DAAs)
DAAs target three viral proteins:
- **NS3/4A protease** inhibitors: Glecaprevir, Grazoprevir (-previr)
- **NS5A** inhibitors: Velpatasvir, Pibrentasvir, Ledipasvir (-asvir)
- **NS5B polymerase** (nucleotide) inhibitor: Sofosbuvir (-buvir)

### Recommended Regimens (Pan-genotypic)
| Regimen | Duration | Notes |
|---------|----------|-------|
| **Sofosbuvir + Velpatasvir** | 12 weeks | Pan-genotypic, simple, well-tolerated |
| **Glecaprevir + Pibrentasvir** | 8 weeks (non-cirrhotic) | Pan-genotypic, shortest duration |
| **Sofosbuvir + Daclatasvir** | 12 weeks | Widely available in India |

### Treatment Goals
- **SVR12**: Sustained Virologic Response = undetectable HCV RNA 12 weeks after completing treatment = **CURE**
- SVR rates >95% across all genotypes with modern DAAs
- After SVR: continue HCC screening if cirrhotic

### Special Populations
- Decompensated cirrhosis: Sofosbuvir-based (avoid protease inhibitors)
- CKD: Glecaprevir/Pibrentasvir (renally safe)
- HBV co-infection: Monitor/treat HBV during and after DAA (reactivation risk)`,
complications:`### Complications
- Cirrhosis (20-30% over 20-30 years of chronic infection)
- Hepatocellular carcinoma (1-4% per year in cirrhotics)
- Cryoglobulinemic vasculitis (organ-threatening)
- Non-Hodgkin lymphoma (B-cell)
- Renal: MPGN, membranous nephropathy

### Post-SVR (Cured Patients)
- If cirrhotic: continue HCC surveillance indefinitely (risk persists but reduced)
- If non-cirrhotic: no further monitoring needed (cured)
- Extrahepatic manifestations often improve/resolve after SVR
- Can be reinfected (SVR provides no immunity)

### Prognosis
- With DAA treatment: >95% cure rate
- Without treatment: 20-30% develop cirrhosis over 20-30 years
- HCC risk in cirrhosis: 1-4% per year
- SVR reduces but does not eliminate HCC risk in cirrhotics`},
{summary:'HCV: RNA Flavivirus, 6 genotypes (GT3 common in India). Chronicity 55-85%. Screen: anti-HCV; confirm: HCV RNA. DAAs cure >95% (SVR12). No vaccine. Classic extra-hepatic: cryoglobulinemia, PCT, lichen planus, NHL.',
highYield:`★ Most common chronic viral hepatitis worldwide
★ Chronicity rate 55-85% in adults (much higher than HBV adults)
★ NO vaccine available for HCV
★ Anti-HCV antibody remains positive even after cure (use HCV RNA to confirm active infection)
★ SVR12 = cure (undetectable RNA 12 weeks post-treatment)
★ DAAs >95% cure rate in 8-12 weeks
★ Cryoglobulinemia (Type II mixed) — classic association
★ HBV can reactivate during HCV DAA treatment — screen all patients
★ Continue HCC screening post-SVR if cirrhotic`,
mnemonics:`**HCV extrahepatic "CLAMP"**: Cryoglobulinemia, Lichen planus, Arthralgia, MPGN, PCT (Porphyria cutanea tarda)

**DAA suffixes**: "-previr" (protease), "-asvir" (NS5A), "-buvir" (polymerase)

**SVR = cure**: "Sustained = Safe, Virus = Vanquished, Response = Recovery"`,
mcq:`1. Screening test → **Anti-HCV antibody (ELISA)**
2. Confirmatory test → **HCV RNA (PCR)**
3. Chronicity rate → **55-85%**
4. SVR12 definition → **Undetectable RNA 12 weeks post-treatment**
5. Classic extrahepatic → **Type II mixed cryoglobulinemia**
6. HCV genotype in India → **Genotype 3**
7. Pan-genotypic regimen → **Sofosbuvir + Velpatasvir (12 weeks)**
8. Shortest regimen → **Glecaprevir/Pibrentasvir (8 weeks)**
9. Does HCV have vaccine? → **No**
10. Post-SVR cirrhotic → **Continue HCC screening**`,
ddx:`| Condition | Differentiator |
|-----------|---------------|
| Hepatitis B | DNA virus, HBsAg+, vaccine available |
| Autoimmune hepatitis | ANA/SMA+, elevated IgG |
| NASH | Metabolic syndrome, no viral markers |
| Alcoholic hepatitis | AST:ALT >2:1, drinking history |
| Drug-induced hepatitis | Temporal drug exposure |`}],
];

// Process remaining with helper format
for (const [sub, slug, title, expContent, examContent] of remainingContent) {
  w(sub, slug, mkExplorer(title, expContent), mkExam(title, examContent));
}

console.log('\n=== Phase 1 complete (GI detailed) ===');
console.log('Continuing with remaining subspecialties...');
