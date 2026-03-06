/**
 * NucleuX Academy - Colorectal Topics
 * 
 * Comprehensive surgical colorectal topics for SGE preparation
 * Sources: Shackelford's Surgery 9th Ed, Maingot's Abdominal Operations 12th Ed
 */

import type { LibraryTopic } from '../../types/library';

export const COLORECTAL_TOPICS: LibraryTopic[] = [
  // =============================================================================
  // COLORECTAL ANATOMY
  // =============================================================================
  {
    id: 'colorectal-anatomy',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-colorectal',
    name: 'Colorectal Anatomy',
    slug: 'colorectal-anatomy',
    description: 'Blood supply, lymphatics, and surgical planes of the colon and rectum',
    content: {
      concept: `# Colorectal Anatomy

## Overview

The large intestine extends from the ileocecal junction to the anus, measuring **~150 cm** in length. Understanding the anatomical relationships, blood supply, and lymphatic drainage is essential for oncologically sound colorectal surgery.

## Anatomical Divisions

### Colon (~130 cm)
| Segment | Length | Location | Characteristics |
|---------|--------|----------|-----------------|
| **Cecum** | 6-8 cm | RIF | Intraperitoneal, appendix attached |
| **Ascending** | 15-20 cm | Right flank | Retroperitoneal |
| **Hepatic flexure** | — | Below liver | Near GB, duodenum |
| **Transverse** | 40-50 cm | Upper abdomen | Intraperitoneal, mobile |
| **Splenic flexure** | — | Left upper | Near spleen, pancreatic tail |
| **Descending** | 25 cm | Left flank | Retroperitoneal |
| **Sigmoid** | 40 cm | Pelvis | Intraperitoneal, variable length |

### Rectum (~15 cm)
| Division | Distance from AV | Peritoneal Coverage |
|----------|------------------|---------------------|
| Upper 1/3 | 10-15 cm | Anterior & lateral |
| Middle 1/3 | 5-10 cm | Anterior only |
| Lower 1/3 | 0-5 cm | Extraperitoneal |

> 💎 **High Yield**: Upper rectum begins at S3 (rectosigmoid junction) where taeniae fuse

## Distinguishing Features

### Colon vs Small Intestine
| Feature | Colon | Small Intestine |
|---------|-------|-----------------|
| Taeniae coli | Present (3 bands) | Absent |
| Haustra | Present | Absent |
| Appendices epiploicae | Present | Absent |
| Diameter | Larger (6-9 cm) | Smaller (2.5-4 cm) |
| Mesentery | Fixed (asc/desc) | Mobile |

### Three Taeniae Coli
1. **Taenia libera** - Anterior (on free surface)
2. **Taenia omentalis** - Posterolateral (omental attachment)
3. **Taenia mesocolica** - Posteromedial (mesocolic attachment)

> 💎 All three taeniae converge at the **base of the appendix** - surgical landmark

## Blood Supply

### Arterial Supply

#### Superior Mesenteric Artery (SMA) - Midgut Derivatives
\`\`\`
SMA
├── Ileocolic Artery → Terminal ileum, cecum, appendix
│   ├── Anterior cecal
│   ├── Posterior cecal
│   ├── Appendicular artery
│   └── Ileal branches
├── Right Colic Artery → Ascending colon (absent in 10-15%)
├── Middle Colic Artery → Transverse colon
│   ├── Right branch
│   └── Left branch
└── Marginal artery of Drummond (arcade)
\`\`\`

#### Inferior Mesenteric Artery (IMA) - Hindgut Derivatives
\`\`\`
IMA (origin: L3 level from aorta)
├── Left Colic Artery → Descending colon
│   ├── Ascending branch → splenic flexure
│   └── Descending branch
├── Sigmoid Arteries (2-4) → Sigmoid colon
└── Superior Rectal Artery → Upper rectum
\`\`\`

#### Middle & Lower Rectum
- **Middle rectal artery** - From internal iliac
- **Inferior rectal artery** - From internal pudendal (branch of internal iliac)

### Marginal Artery (Artery of Drummond)

The marginal artery forms a **continuous anastomotic arcade** along the mesenteric border of the colon:

| Segment | Contribution |
|---------|-------------|
| Ileocolic | → Marginal artery |
| Right colic | → |
| Middle colic | → |
| Left colic | → |
| Sigmoid arteries | → |

#### Watershed Areas (Vulnerable to Ischemia)
1. **Griffith's point** - Splenic flexure (marginal artery may be tenuous)
2. **Sudeck's point** - Rectosigmoid junction (critical point in low ligation)

> ⚠️ **Sudeck's Critical Point**: Between the last sigmoid artery and superior rectal artery. Must preserve superior rectal artery if ligating IMA high.

### Arc of Riolan

- **Collateral anastomosis** between SMA (middle colic) and IMA (left colic)
- Located in mesentery, closer to aorta than marginal artery
- Important in chronic IMA occlusion

### Venous Drainage

Parallels arterial supply:
- **SMV** ← Ileocolic, right colic, middle colic veins
- **IMV** ← Left colic, sigmoid veins, superior rectal vein
- IMV drains to **splenic vein** (not SMV directly)

> 💎 IMV is lateral to IMA, drains into splenic vein behind pancreas

### Middle & Inferior Rectal Veins
- Drain to **internal iliac veins** (systemic, NOT portal)
- Important portal-systemic anastomosis site

## Lymphatic Drainage

### Lymph Node Stations (Follows Arterial Supply)
| Level | Location | Example |
|-------|----------|---------|
| **Epicolic** | On bowel wall | Appendices epiploicae |
| **Paracolic** | Along marginal artery | Inner mesenteric border |
| **Intermediate** | Along named vessels | Along ileocolic, middle colic |
| **Principal** | At vessel origin | SMA/IMA root nodes |

### Minimum Lymph Node Harvest
- **≥12 lymph nodes** for adequate staging (AJCC/CAP recommendation)
- Inadequate harvest = understaging risk

### Rectal Lymphatic Drainage
| Tumor Location | Primary Drainage |
|----------------|------------------|
| Upper rectum | Along superior rectal → IMA |
| Middle rectum | Superior rectal + lateral (internal iliac) |
| Lower rectum | Superior rectal + lateral + inguinal (below dentate) |

## Innervation

### Sympathetic
- Origin: T10-L2 → Superior hypogastric plexus
- Function: Inhibits motility, contracts internal anal sphincter

### Parasympathetic
- **Proximal colon** (to splenic flexure): Vagus nerve
- **Distal colon/rectum**: Pelvic splanchnic nerves (S2-S4)

### Hypogastric Nerves
- From superior hypogastric plexus → inferior hypogastric (pelvic) plexus
- Critical for sexual and bladder function
- **Must preserve during rectal dissection**

> ⚠️ Injury → urinary retention, erectile dysfunction, retrograde ejaculation

## Surgical Planes

### Toldt's Fascia (White Line of Toldt)
- Avascular fusion plane between visceral and parietal peritoneum
- Mobilize colon by incising along this line
- Creates the **retroperitoneal plane** for colonic mobilization

### Total Mesorectal Excision (TME) Plane
- **Mesorectal fascia (visceral)** = "Holy plane" of Heald
- **Presacral fascia (parietal)** = Waldeyer's fascia
- TME = Dissection in avascular areolar tissue BETWEEN these planes

### Denonvilliers' Fascia
- Anterior to rectum, posterior to prostate/vagina
- Dissect anterior TO this fascia (preserve) for benign disease
- Dissect posterior TO this fascia (remove) for anterior rectal tumors

### Important Anatomical Relationships

#### Hepatic Flexure
- Duodenum (2nd part) - posteromedial
- Gallbladder - superior
- Right kidney - posterior

#### Splenic Flexure
- Spleen - lateral (risk of injury)
- Pancreatic tail - medial
- Left kidney - posterior

> ⚠️ **Splenocolic ligament** must be divided to mobilize splenic flexure completely`,
      keyPoints: [
        'Colon ~130 cm; Rectum ~15 cm (upper third peritoneal covering anteriorly and laterally)',
        'SMA supplies midgut (cecum to proximal 2/3 transverse); IMA supplies hindgut',
        'Marginal artery of Drummond - continuous arcade along mesenteric border',
        'Watershed areas: Griffith\'s point (splenic flexure), Sudeck\'s point (rectosigmoid)',
        'IMV drains to splenic vein (not SMV) - important for anatomy questions',
        '≥12 lymph nodes needed for adequate CRC staging',
        'TME plane: between mesorectal fascia (visceral) and presacral fascia (parietal)',
        'Hypogastric nerve injury causes urinary/sexual dysfunction'
      ],
      examPrep: {
        summary: `**Colorectal Anatomy - Quick Review**

📍 **Divisions**:
- Colon: Cecum → Ascending → Transverse → Descending → Sigmoid
- Rectum: 15 cm, upper 1/3 has peritoneal cover

🩸 **Blood Supply**:
- SMA → Ileocolic, R colic, Middle colic (midgut)
- IMA → L colic, Sigmoid, Superior rectal (hindgut)
- Marginal artery connects all

⚠️ **Watershed Areas**:
- Griffith's point = Splenic flexure
- Sudeck's point = Rectosigmoid

🔬 **Lymph Node Harvest**: ≥12 for adequate staging

✂️ **Surgical Planes**:
- Toldt's fascia = Mobilization plane
- TME plane = Between mesorectal and presacral fascia`,
        mnemonics: [
          'IMA origin at L3 = "I aM at L3"',
          'Griffith = "G" for Greater curve of colon (splenic flexure)',
          'Sudeck = "S" for Sigmoid-rectal junction',
          'IMV to Splenic vein = "I Must Visit Spleen"'
        ],
        highYield: [
          'Taeniae converge at appendix base - surgical landmark',
          'Right colic artery absent in 10-15% - ileocolic supplies ascending colon',
          'Lower rectal tumors can spread to inguinal nodes (below dentate line)',
          'Arc of Riolan = collateral between SMA and IMA branches'
        ],
        commonMCQs: [
          'Blood supply to appendix: Appendicular artery (from ileocolic)',
          'Watershed area at splenic flexure: Griffith\'s point',
          'IMV drains into: Splenic vein',
          'Minimum lymph nodes for CRC staging: 12',
          'TME plane is between: Mesorectal fascia and presacral fascia'
        ]
      },
      textbookRefs: [
        { textbook: "Shackelford's Surgery", edition: '9th', chapter: 'Chapter 157', chapterTitle: 'Anatomy of Colon, Rectum, and Anus', pages: '2001-2018' },
        { textbook: "Maingot's Abdominal Operations", edition: '12th', chapter: 'Chapter 30', chapterTitle: 'Colon and Rectum', pages: '686-720' },
        { textbook: "Netter's Surgical Anatomy", edition: '2nd', chapter: 'Chapters 20-25', chapterTitle: 'Colorectal Procedures' }
      ],
      retrievalCards: [
        { id: 'cra-1', question: 'What is the marginal artery of Drummond?', answer: 'A continuous arterial arcade along the mesenteric border of the colon, formed by anastomoses between branches of SMA (ileocolic, right colic, middle colic) and IMA (left colic, sigmoid arteries)', difficulty: 1 },
        { id: 'cra-2', question: 'What are the two watershed areas of the colon and why are they significant?', answer: "1) Griffith's point (splenic flexure) - tenuous marginal artery. 2) Sudeck's point (rectosigmoid junction) - critical in IMA ligation. Both vulnerable to ischemia in low-flow states.", difficulty: 2 },
        { id: 'cra-3', question: 'Where does the inferior mesenteric vein drain?', answer: 'Into the splenic vein (behind the pancreas), NOT directly into the SMV. IMV lies lateral to the IMA.', difficulty: 1 },
        { id: 'cra-4', question: 'What is the TME plane and what defines its boundaries?', answer: 'TME plane is the avascular areolar tissue between the mesorectal fascia (visceral, surrounds mesorectum) and the presacral/parietal fascia (Waldeyer\'s fascia). Dissection in this "holy plane" achieves complete mesorectal excision.', difficulty: 2 },
        { id: 'cra-5', question: "What is Sudeck's critical point and its surgical significance?", answer: "Area between last sigmoid artery and superior rectal artery at rectosigmoid junction. When ligating IMA at origin (high ligation), must ensure adequate collateral via superior rectal artery or risk ischemia.", difficulty: 3 },
        { id: 'cra-6', question: 'What is the minimum lymph node harvest recommended for adequate colorectal cancer staging?', answer: '≥12 lymph nodes (AJCC/CAP recommendation). Inadequate harvest leads to understaging and potentially missing node-positive disease.', difficulty: 1 },
        { id: 'cra-7', question: 'What are the three taeniae coli and where do they converge?', answer: 'Taenia libera (anterior), taenia omentalis (posterolateral), taenia mesocolica (posteromedial). All three converge at the BASE OF THE APPENDIX - important surgical landmark.', difficulty: 2 }
      ],
      cases: []
    },
    prerequisites: [],
    relatedTopics: ['colorectal-cancer', 'colonic-polyps', 'diverticular-disease'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'SGE'],
    estimatedMinutes: 45,
    hasContent: { concept: true, examPrep: true, textbook: true, retrievalCards: true, cases: false, grindeMap: false },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09'
  },

  // =============================================================================
  // COLORECTAL CANCER
  // =============================================================================
  {
    id: 'colorectal-cancer',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-colorectal',
    name: 'Colorectal Cancer',
    slug: 'colorectal-cancer',
    description: 'TNM staging, surgical principles, and adjuvant therapy',
    content: {
      concept: `# Colorectal Cancer

## Epidemiology

- **3rd most common cancer** worldwide
- **2nd leading cause of cancer death** in the West
- Peak incidence: 65-75 years
- Risk increases with age; rare before 40 (unless hereditary)

## Risk Factors

### Modifiable
- Diet: Low fiber, high red/processed meat
- Obesity and sedentary lifestyle
- Smoking and alcohol
- Diabetes mellitus

### Non-Modifiable
- Age >50 years
- Personal history of polyps or CRC
- Inflammatory bowel disease (UC > CD)
- Family history of CRC

### Hereditary Syndromes (5-10% of CRC)
| Syndrome | Gene | Risk | Features |
|----------|------|------|----------|
| **FAP** | APC | 100% by 40 | >100 adenomas, prophylactic colectomy |
| **Lynch (HNPCC)** | MLH1, MSH2, MSH6, PMS2 | 70-80% lifetime | Proximal, MSI-H, extracolonic cancers |
| **Peutz-Jeghers** | STK11 | 39% | Hamartomatous polyps, mucocutaneous pigmentation |
| **Juvenile polyposis** | SMAD4/BMPR1A | 39-68% | >5 juvenile polyps |
| **MYH-associated** | MUTYH | 43-100% | Similar to attenuated FAP |

## Pathogenesis: Adenoma-Carcinoma Sequence

### Chromosomal Instability Pathway (70-80%)
\`\`\`
Normal epithelium
    ↓ (APC mutation)
Early adenoma
    ↓ (KRAS mutation)
Intermediate adenoma
    ↓ (DCC, SMAD4 loss)
Late adenoma
    ↓ (p53 mutation)
Carcinoma
    ↓
Metastatic disease
\`\`\`

### Microsatellite Instability Pathway (15-20%)
- **MMR gene defects** → MSI-High
- Associated with Lynch syndrome (hereditary) or sporadic (MLH1 methylation)
- Better prognosis, but resistant to 5-FU alone

### Serrated Pathway (10-15%)
- **BRAF mutation** + CpG island methylation
- From sessile serrated polyps
- Right-sided, poor differentiation

## Clinical Presentation

### By Location
| Right Colon | Left Colon | Rectum |
|-------------|------------|--------|
| Occult bleeding | Overt bleeding | Hematochezia |
| Iron deficiency anemia | Change in bowel habits | Tenesmus |
| Mass (late) | Obstruction | Incomplete evacuation |
| Weight loss | Colicky pain | Mucus in stool |
| Often advanced at diagnosis | Often diagnosed earlier | Local symptoms early |

### Alarm Symptoms
- Rectal bleeding (especially with change in bowel habits)
- Unexplained iron deficiency anemia
- Persistent change in bowel habits
- Abdominal mass
- Weight loss

## Staging

### TNM Classification (AJCC 8th Edition)

#### T Stage (Primary Tumor)
| Stage | Description |
|-------|-------------|
| Tis | Carcinoma in situ (intramucosal) |
| T1 | Invades submucosa |
| T2 | Invades muscularis propria |
| T3 | Invades through MP into subserosa/pericolorectal tissues |
| T4a | Penetrates visceral peritoneum |
| T4b | Directly invades adjacent organs |

#### N Stage (Lymph Nodes)
| Stage | Description |
|-------|-------------|
| N0 | No regional LN metastasis |
| N1a | 1 regional LN |
| N1b | 2-3 regional LNs |
| N1c | Tumor deposits without LN |
| N2a | 4-6 regional LNs |
| N2b | ≥7 regional LNs |

#### M Stage (Distant Metastasis)
| Stage | Description |
|-------|-------------|
| M0 | No distant metastasis |
| M1a | Single organ metastasis (liver, lung) |
| M1b | Multiple organs |
| M1c | Peritoneal metastasis |

### Stage Grouping & Prognosis
| Stage | TNM | 5-Year Survival |
|-------|-----|-----------------|
| I | T1-2 N0 M0 | 90-95% |
| IIA | T3 N0 M0 | 80-85% |
| IIB | T4a N0 M0 | 70-75% |
| IIC | T4b N0 M0 | 60-65% |
| IIIA | T1-2 N1 M0 | 70-80% |
| IIIB | T3-4a N1, T1-2 N2a M0 | 50-65% |
| IIIC | T4a-b N2, T3-4a N2b M0 | 25-40% |
| IV | Any T, Any N, M1 | 5-15% |

## Preoperative Evaluation

### Essential Workup
| Investigation | Purpose |
|---------------|---------|
| **Colonoscopy + biopsy** | Diagnosis, synchronous lesions (3-5%) |
| **CT chest/abdomen/pelvis** | Staging, metastases |
| **CEA level** | Baseline for surveillance |
| **CBC, LFT** | Anemia, liver function |

### Rectal Cancer Specific
| Investigation | Purpose |
|---------------|---------|
| **MRI pelvis** | T stage, CRM, mesorectal nodes |
| **ERUS** | Early tumors (T1-2) |
| **Rigid proctoscopy** | Distance from anal verge |

### Advanced Disease
- **PET-CT**: If metastatic disease suspected but CT inconclusive
- **Liver MRI**: If hepatic metastases being considered for resection

## Surgical Principles

### Oncological Principles (KEY!)
1. **Proximal and distal margins**: ≥5 cm for colon; ≥1-2 cm for rectum (acceptable)
2. **Lymphadenectomy**: ≥12 nodes for adequate staging
3. **High ligation**: Ligate feeding vessel at origin
4. **En bloc resection**: Include adjacent involved organs
5. **No-touch technique**: Minimize tumor manipulation

### Operations by Tumor Location

| Location | Operation | Vessels Ligated | Nodes |
|----------|-----------|-----------------|-------|
| Cecum/Ascending | Right hemicolectomy | Ileocolic, R colic | Ileocolic, R colic |
| Hepatic flexure | Extended right | + Middle colic | + Intermediate |
| Transverse | Extended right OR left | Middle colic | Middle colic trunk |
| Splenic flexure | Extended left | + L colic | L colic |
| Descending | Left hemicolectomy | L colic (IMA preserved) | L colic |
| Sigmoid | Sigmoid colectomy | IMA or sigmoids | IMA nodes |
| Upper rectum | Anterior resection | IMA | IMA + mesorectal |
| Mid/Low rectum | Low anterior resection | IMA | TME |
| Low rectum/anal | APR | IMA | TME + levator |

### Margin Requirements
| Site | Distal Margin | Notes |
|------|---------------|-------|
| Colon | ≥5 cm | Measured in fresh specimen |
| Rectum | ≥1 cm | Acceptable with TME; 2 cm preferred |
| CRM | ≥1 mm | <1 mm = positive, high recurrence |

### Emergency Presentations

#### Obstruction (10-20%)
- **Right colon**: Right hemicolectomy + primary anastomosis (usually safe)
- **Left colon**: Options include:
  - Hartmann's procedure (resection + end colostomy)
  - Resection + primary anastomosis ± defunctioning ileostomy
  - Self-expanding metal stent (SEMS) as bridge to surgery

#### Perforation
- Resection mandatory
- Hartmann's procedure most common
- May need total colectomy if proximal obstruction

## Neoadjuvant & Adjuvant Therapy

### Colon Cancer

| Stage | Adjuvant Therapy | Regimen |
|-------|------------------|---------|
| Stage I | None | — |
| Stage II (low risk) | None or consider | 5-FU/LV or capecitabine |
| Stage II (high risk)* | Recommended | FOLFOX or CAPOX |
| Stage III | Standard of care | FOLFOX × 6 months OR CAPOX × 3-6 months |

*High-risk Stage II: T4, LVI, PNI, <12 nodes, perforation, obstruction, poorly differentiated

### Rectal Cancer

#### Neoadjuvant (Standard for T3-4 or N+)
| Option | Regimen | When |
|--------|---------|------|
| Long-course CRT | 50.4 Gy + 5-FU/capecitabine × 5-6 weeks | T3-4, N+, threatened CRM |
| Short-course RT | 25 Gy × 5 fractions | Selected cases |
| TNT | Induction chemo → CRT → surgery | Locally advanced |

> 💎 **Total Neoadjuvant Therapy (TNT)**: All systemic chemotherapy given before surgery. Improves pCR rates and compliance.

#### Adjuvant (Post-surgery)
- Generally 4-6 months chemotherapy (FOLFOX/CAPOX)
- Duration depends on pathological response

## Surveillance Post-Resection

### ASCO/NCCN Guidelines
| Test | Frequency | Duration |
|------|-----------|----------|
| Clinical visit | Every 3-6 months × 2 yr, then 6 monthly | 5 years |
| CEA | Every 3-6 months × 2 yr, then 6 monthly | 5 years |
| CT CAP | Every 6-12 months | 5 years |
| Colonoscopy | At 1 year, then every 3-5 years | Lifetime |

### CEA Monitoring
- Rising CEA = investigate for recurrence
- Sensitivity ~80% for detecting recurrence
- Most useful for liver metastases

## Metastatic Disease

### Liver Metastases
- Present in 15-25% at diagnosis
- Resection criteria: adequate FLR, resectable with clear margins, no unresectable extrahepatic disease
- 5-year survival with resection: **40-50%** (vs 5% without)

### Approach
1. **Resectable**: Surgery ± perioperative chemo
2. **Borderline resectable**: Conversion chemotherapy → reassess
3. **Unresectable**: Palliative chemotherapy, consider HAI, ablation

### Peritoneal Metastases
- Poor prognosis
- Selected patients: **CRS + HIPEC** (cytoreductive surgery + hyperthermic intraperitoneal chemotherapy)
- PCI (Peritoneal Cancer Index) guides selection`,
      keyPoints: [
        'CRC is 3rd most common cancer, 2nd leading cause of cancer death',
        'Adenoma-carcinoma sequence: APC → KRAS → DCC/SMAD4 → p53',
        'MSI-H tumors (Lynch or sporadic) have better prognosis',
        'Right-sided cancers present late (anemia); left-sided present early (obstruction)',
        '≥12 lymph nodes required for adequate staging',
        'Stage III requires adjuvant chemotherapy (FOLFOX/CAPOX)',
        'Rectal cancer: neoadjuvant CRT for T3/T4 or N+ disease',
        'Liver metastases resection: 40-50% 5-year survival if resectable'
      ],
      examPrep: {
        summary: `**CRC Staging & Treatment - Quick Review**

🔬 **Adenoma-Carcinoma Sequence**:
APC → KRAS → DCC/SMAD4 → p53

📊 **Stage-Based Treatment**:
- Stage I: Surgery alone
- Stage II: Surgery ± adjuvant (if high-risk)
- Stage III: Surgery + adjuvant FOLFOX × 6mo
- Stage IV: MDT, consider resection if isolated liver mets

🎯 **Surgical Principles**:
- Margins: ≥5 cm colon, ≥1 cm rectum
- Nodes: ≥12 for staging
- High ligation of feeding vessel

📍 **Rectal Cancer**:
- MRI for staging
- Neoadjuvant CRT for T3-4 or N+
- TME is standard`,
        mnemonics: [
          'APPLE for adenoma-carcinoma: APC → (P) KRAS → (P) DCC → (L) p53 → (E)vilCancer',
          'Right = Rust (anemia, occult); Left = Late obstruction',
          'FAP = 100 polyps by age 10, 100% cancer by age 40'
        ],
        highYield: [
          'MSI-H: better prognosis, resistant to 5-FU monotherapy',
          'High-risk Stage II: T4, LVI, PNI, <12 nodes, obstruction, perforation, poorly diff',
          'CRM <1 mm = positive, high local recurrence',
          'CEA most useful for detecting liver metastases'
        ],
        commonMCQs: [
          'First gene mutated in adenoma-carcinoma sequence: APC',
          'Minimum lymph nodes for CRC staging: 12',
          'Best imaging for rectal cancer local staging: MRI pelvis',
          'Adjuvant therapy for Stage III colon cancer: FOLFOX or CAPOX × 6 months',
          'High-risk Stage II factor: T4 tumor'
        ]
      },
      textbookRefs: [
        { textbook: "Shackelford's Surgery", edition: '9th', chapter: 'Chapters 178-188', chapterTitle: 'Colorectal Cancer', pages: '2250-2380' },
        { textbook: "DeVita Cancer", edition: '12th', chapter: 'Chapters 40-41', chapterTitle: 'Colon and Rectal Cancer' },
        { textbook: "Sabiston", edition: '22nd', chapter: 'Chapter 52', chapterTitle: 'Colon and Rectum' }
      ],
      retrievalCards: [
        { id: 'crc-1', question: 'What is the adenoma-carcinoma sequence?', answer: 'Stepwise accumulation of genetic mutations: APC (early adenoma) → KRAS (intermediate) → DCC/SMAD4 (late adenoma) → p53 (carcinoma). This chromosomal instability pathway accounts for 70-80% of CRC.', difficulty: 2 },
        { id: 'crc-2', question: 'What are the high-risk features in Stage II colon cancer that warrant adjuvant chemotherapy?', answer: 'T4 tumor, lymphovascular invasion (LVI), perineural invasion (PNI), <12 lymph nodes examined, obstruction, perforation, poorly differentiated histology', difficulty: 2 },
        { id: 'crc-3', question: 'What is the standard adjuvant chemotherapy for Stage III colon cancer?', answer: 'FOLFOX (5-FU + leucovorin + oxaliplatin) × 6 months OR CAPOX (capecitabine + oxaliplatin) × 3-6 months', difficulty: 1 },
        { id: 'crc-4', question: 'What is the recommended distal margin for rectal cancer?', answer: '≥1 cm distal margin is acceptable with TME (though 2 cm preferred historically). Quality of mesorectal excision (CRM) is more important than distal margin.', difficulty: 2 },
        { id: 'crc-5', question: 'What constitutes a positive circumferential resection margin (CRM)?', answer: 'CRM <1 mm from tumor to the mesorectal fascia. Positive CRM is associated with high local recurrence rates (up to 22% vs 5% for negative CRM).', difficulty: 2 },
        { id: 'crc-6', question: 'What is the 5-year survival after resection of colorectal liver metastases?', answer: '40-50% 5-year survival with complete resection (compared to 5% without resection). Criteria: adequate future liver remnant, R0 resection achievable, no unresectable extrahepatic disease.', difficulty: 2 },
        { id: 'crc-7', question: 'Why are MSI-H colorectal cancers important to identify?', answer: 'MSI-H tumors (15-20% of CRC) have: 1) Better prognosis, 2) May indicate Lynch syndrome, 3) Resistant to 5-FU monotherapy, 4) Respond well to immune checkpoint inhibitors', difficulty: 3 }
      ],
      cases: [
        {
          id: 'crc-case-1',
          title: 'Right-sided Colon Cancer with Anemia',
          presentation: 'A 68-year-old man presents with fatigue and weight loss of 5 kg over 3 months. He has no abdominal pain or change in bowel habits. Examination shows pallor. Hemoglobin is 8.2 g/dL with microcytic hypochromic indices. Fecal occult blood test is positive.',
          question: 'What is the most likely diagnosis and initial investigation?',
          answer: 'Most likely diagnosis is RIGHT-SIDED COLON CANCER presenting with iron deficiency anemia. Initial investigation is COLONOSCOPY with biopsy of any lesion found. Right colon tumors often grow large before causing symptoms because of the wider lumen, and present with occult bleeding causing chronic anemia rather than overt bleeding or obstruction.',
          difficulty: 2,
          tags: ['colorectal cancer', 'anemia', 'diagnosis']
        },
        {
          id: 'crc-case-2',
          title: 'Rectal Cancer Staging',
          presentation: 'A 55-year-old woman undergoes colonoscopy for rectal bleeding, revealing a 4 cm circumferential mass at 8 cm from the anal verge. Biopsy confirms adenocarcinoma. CT chest/abdomen/pelvis shows no distant metastases but pericolic lymph nodes are seen.',
          question: 'What is the best imaging modality for local staging and what treatment approach is indicated?',
          answer: 'MRI PELVIS is the best imaging for local staging of rectal cancer (to assess T stage, mesorectal fascia involvement/CRM, and lymph node status). If MRI shows T3/T4 or N+ disease, NEOADJUVANT CHEMORADIOTHERAPY (long-course 5-FU/capecitabine + 50.4 Gy radiation) is indicated before surgical resection (TME). This downsizes tumor, improves resectability, and reduces local recurrence.',
          difficulty: 3,
          tags: ['rectal cancer', 'MRI', 'neoadjuvant']
        }
      ]
    },
    prerequisites: ['colorectal-anatomy'],
    relatedTopics: ['colonic-polyps', 'fap-lynch', 'rectal-cancer'],
    difficulty: 4,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'SGE'],
    estimatedMinutes: 60,
    hasContent: { concept: true, examPrep: true, textbook: true, retrievalCards: true, cases: true, grindeMap: false },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09'
  },

  // =============================================================================
  // ULCERATIVE COLITIS - SURGERY
  // =============================================================================
  {
    id: 'ulcerative-colitis-surgery',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-colorectal',
    name: 'Ulcerative Colitis - Surgical Management',
    slug: 'ulcerative-colitis-surgery',
    description: 'IPAA, total proctocolectomy, and indications for surgery',
    content: {
      concept: `# Ulcerative Colitis - Surgical Management

## Overview

Ulcerative colitis (UC) is a chronic inflammatory bowel disease limited to the colon and rectum. Unlike Crohn's disease, UC can be **"cured" by total proctocolectomy**.

## Indications for Surgery

### Emergency (Acute)
1. **Toxic megacolon** (transverse colon >6 cm + systemic toxicity)
2. **Perforation**
3. **Massive hemorrhage** unresponsive to resuscitation
4. **Fulminant colitis** unresponsive to IV steroids (72-96 hours)

### Elective
1. **Failure of medical therapy** (steroid dependence/refractory)
2. **Dysplasia** (high-grade) or carcinoma
3. **Growth retardation** in children
4. **Intolerable side effects** of medications

## Surgical Options

### 1. Total Proctocolectomy + Ileal Pouch-Anal Anastomosis (IPAA)

**"The Gold Standard"** for elective UC surgery

#### Procedure
1. Remove entire colon and rectum
2. Construct ileal J-pouch (or S-pouch)
3. Anastomose pouch to dentate line or anorectal junction
4. ± Defunctioning loop ileostomy (stapled low usually; hand-sewn mucosectomy = higher rates)

#### Pouch Configurations
| Type | Shape | Limb Length | Characteristics |
|------|-------|-------------|-----------------|
| **J-pouch** | J-shaped | 15-20 cm | Most common, easiest |
| S-pouch | S-shaped | 15 cm each | Larger capacity |
| W-pouch | W-shaped | 10 cm each | Largest capacity, complex |

> 💎 **J-pouch is standard** - optimal balance of capacity, ease of construction, and evacuation

#### Technical Points
- **Stapled anastomosis**: Faster, lower stricture rate; leaves 1-2 cm rectal cuff
- **Hand-sewn (mucosectomy)**: Complete removal of rectal mucosa; higher incontinence
- **Defunctioning ileostomy**: Usually reversed at 8-12 weeks after contrast pouchogram

#### Outcomes
- **Functional results**: 5-7 bowel movements/day, nocturnal seepage in 30%
- **Quality of life**: Significantly improved from active UC
- **Pouch survival**: >90% at 10 years

### 2. Total Proctocolectomy + End Ileostomy (Brooke Ileostomy)

**When?**
- Poor anal sphincter function
- Very low rectal cancer
- Patient preference
- Failed IPAA

### 3. Subtotal Colectomy + End Ileostomy

**The emergency operation of choice**

#### Advantages
- Quick and safe in sick patient
- Preserves options (IPAA later)
- No pelvic dissection (preserves fertility, autonomic nerves)
- Allows histological confirmation (CD vs UC)

#### Technique
- Remove entire colon, preserving rectum
- Divide bowel at rectosigmoid junction
- Rectal stump: close + leave in pelvis OR bring out as mucous fistula
- Create end ileostomy

> ⚠️ **Always leave rectum in emergency setting** - definitive surgery later when patient recovered

### 4. Total Colectomy + Ileorectal Anastomosis (IRA)

**Rarely used in UC** due to residual rectal disease and cancer risk

## Staged Procedures

### Three-Stage IPAA
| Stage | Procedure | When |
|-------|-----------|------|
| 1st | Subtotal colectomy + end ileostomy | Emergency/sick patient |
| 2nd | Completion proctectomy + IPAA + loop ileostomy | 3-6 months later |
| 3rd | Ileostomy reversal | 8-12 weeks after stage 2 |

### Two-Stage IPAA (Most common elective)
| Stage | Procedure |
|-------|-----------|
| 1st | Total proctocolectomy + IPAA + loop ileostomy |
| 2nd | Ileostomy reversal (8-12 weeks) |

### Single-Stage IPAA
- Total proctocolectomy + IPAA without ileostomy
- Selected patients: low risk, adequate nutrition, no immunosuppression

## Complications of IPAA

### Early
| Complication | Incidence | Management |
|--------------|-----------|------------|
| Anastomotic leak | 5-10% | Drainage, ± revision |
| Pelvic sepsis | 5-7% | IV antibiotics, drainage |
| Small bowel obstruction | 15-25% | Conservative, surgery if complete |
| Pouch ischemia | <5% | May need redo/excision |

### Late
| Complication | Incidence | Management |
|--------------|-----------|------------|
| **Pouchitis** | 30-50% | Metronidazole, ciprofloxacin, probiotics |
| Anastomotic stricture | 5-15% | Dilation |
| Fistula (pouch-vaginal) | 5-10% | Repair, advancement flap |
| Pouch failure | 5-10% | Pouch excision + permanent ileostomy |
| Cuffitis | 10-15% | Topical 5-ASA, steroids |
| Small bowel obstruction | 20-30% (lifetime) | Adhesiolysis if complete |

### Pouchitis
- **Most common complication** of IPAA
- Presents with: increased stool frequency, urgency, bleeding, fever
- Diagnosis: Pouchoscopy + biopsy
- Treatment: Metronidazole or ciprofloxacin × 2 weeks
- Refractory: probiotics (VSL#3), oral budesonide, biologics

> 💎 **Pouchitis is more common in** patients with extraintestinal manifestations (PSC, pyoderma)

## Special Situations

### UC with Dysplasia/Cancer
- **High-grade dysplasia**: Colectomy recommended
- **Low-grade dysplasia**: Close surveillance or colectomy
- **CRC in UC**: IPAA may still be possible if no RT needed; often need permanent ileostomy

### UC and Fertility
- IPAA reduces female fertility by ~50% (tubal adhesions)
- Consider subtotal colectomy as bridge in women desiring pregnancy
- Male fertility preserved if autonomic nerves protected

### UC vs Crohn's - Why it Matters
| Feature | UC | Crohn's |
|---------|-----|---------|
| IPAA suitable | YES | NO (high failure rate) |
| Rectal sparing | Rare | Common |
| Small bowel disease | No | Yes |
| Pouch survival | >90% | <50% |

> ⚠️ **If indeterminate colitis**: Inform patient of higher pouch failure risk if it's actually Crohn's`,
      keyPoints: [
        'UC is "curable" by total proctocolectomy',
        'IPAA (J-pouch) is gold standard for elective UC surgery',
        'Emergency: Subtotal colectomy + end ileostomy (preserves options)',
        'Three-stage approach for sick/emergency patients',
        'Pouchitis is most common IPAA complication (30-50%)',
        'IPAA contraindicated in Crohn\'s disease',
        'IPAA reduces female fertility by ~50%'
      ],
      examPrep: {
        summary: `**UC Surgery - Quick Review**

🚨 **Emergency Indications**:
- Toxic megacolon
- Perforation
- Fulminant colitis (failed IV steroids)
- Massive hemorrhage

✂️ **Operations**:
- **Emergency**: Subtotal colectomy + end ileostomy
- **Elective**: IPAA (J-pouch) is gold standard
- **Poor sphincters**: Total proctocolectomy + Brooke ileostomy

🏥 **Staged Approach**:
- 3-stage: Sick patients
- 2-stage: Standard elective
- 1-stage: Selected fit patients

⚠️ **IPAA Complications**:
- Pouchitis (30-50%) - treat with antibiotics
- Anastomotic leak (5-10%)
- Stricture (5-15%)`,
        mnemonics: [
          'J-pouch = Just right (not too big, not too small)',
          'Emergency UC = Escape with Subtotal (save the IPAA for later)',
          'Pouchitis treatment: Metro + Cipro = "Metro-Cipro Line"'
        ],
        highYield: [
          'Subtotal colectomy is ALWAYS the emergency operation - never do IPAA in acute setting',
          'Stapled anastomosis leaves rectal cuff - risk of cuffitis',
          'PSC patients have higher pouchitis rates',
          'Female fertility reduced 50% after IPAA'
        ],
        commonMCQs: [
          'Emergency surgery for toxic megacolon: Subtotal colectomy + end ileostomy',
          'Most common long-term complication of IPAA: Pouchitis',
          'Treatment of acute pouchitis: Metronidazole or ciprofloxacin',
          'Contraindication to IPAA: Crohn\'s disease',
          'Gold standard elective surgery for UC: IPAA (J-pouch)'
        ]
      },
      textbookRefs: [
        { textbook: "Shackelford's Surgery", edition: '9th', chapter: 'Chapters 174-176', chapterTitle: 'Surgical Management of IBD', pages: '2180-2230' },
        { textbook: "Maingot's Abdominal Operations", edition: '12th', chapter: 'Chapters 33-35', chapterTitle: 'Inflammatory Bowel Disease Surgery', pages: '750-810' }
      ],
      retrievalCards: [
        { id: 'ucs-1', question: 'What is the emergency operation of choice for toxic megacolon or fulminant UC?', answer: 'SUBTOTAL COLECTOMY + END ILEOSTOMY. This removes the diseased colon, is quick and safe in a sick patient, preserves options for future IPAA, and avoids pelvic dissection.', difficulty: 1 },
        { id: 'ucs-2', question: 'What is the gold standard elective surgery for ulcerative colitis?', answer: 'Total proctocolectomy with ILEAL POUCH-ANAL ANASTOMOSIS (IPAA), usually with a J-pouch configuration. Achieves 5-7 bowel movements/day with good quality of life.', difficulty: 1 },
        { id: 'ucs-3', question: 'Why is IPAA contraindicated in Crohn\'s disease?', answer: 'Crohn\'s disease has: 1) High recurrence rate in the pouch, 2) Fistula formation, 3) Pouch failure rate ~50% (vs >90% survival in UC). Crohn\'s is not cured by proctocolectomy.', difficulty: 2 },
        { id: 'ucs-4', question: 'What is pouchitis and how is it managed?', answer: 'Pouchitis is inflammation of the ileal pouch (30-50% of IPAA patients). Presents with increased stool frequency, urgency, bleeding. Diagnosis: pouchoscopy + biopsy. Treatment: Metronidazole or ciprofloxacin × 2 weeks; refractory cases may need probiotics (VSL#3) or biologics.', difficulty: 2 },
        { id: 'ucs-5', question: 'What are the stages in a three-stage IPAA for UC?', answer: '1st: Subtotal colectomy + end ileostomy (emergency), 2nd: Completion proctectomy + IPAA + loop ileostomy (3-6 months later), 3rd: Loop ileostomy reversal (8-12 weeks after stage 2)', difficulty: 2 },
        { id: 'ucs-6', question: 'How does IPAA affect female fertility?', answer: 'IPAA reduces female fertility by approximately 50% due to pelvic adhesions affecting the fallopian tubes. Consider subtotal colectomy as a bridge procedure in young women desiring pregnancy.', difficulty: 3 }
      ],
      cases: [
        {
          id: 'ucs-case-1',
          title: 'Toxic Megacolon',
          presentation: 'A 32-year-old man with known ulcerative colitis presents with 5 days of bloody diarrhea, abdominal distension, fever (39°C), tachycardia (120/min), and diffuse abdominal tenderness. He has been on oral prednisolone. AXR shows transverse colon diameter of 7.5 cm.',
          question: 'What is the diagnosis and management?',
          answer: 'Diagnosis: TOXIC MEGACOLON (colon >6 cm with systemic toxicity). Management: 1) Resuscitation, IV steroids (hydrocortisone 100mg QID), bowel rest, antibiotics, 2) Urgent surgical consultation, 3) If no improvement in 24-72 hours or deterioration → SUBTOTAL COLECTOMY + END ILEOSTOMY. Do NOT do IPAA in acute setting.',
          difficulty: 3,
          tags: ['toxic megacolon', 'emergency surgery', 'UC']
        }
      ]
    },
    prerequisites: ['colorectal-anatomy'],
    relatedTopics: ['colorectal-cancer', 'diverticular-disease'],
    difficulty: 4,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'SGE'],
    estimatedMinutes: 45,
    hasContent: { concept: true, examPrep: true, textbook: true, retrievalCards: true, cases: true, grindeMap: false },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09'
  },

  // =============================================================================
  // DIVERTICULAR DISEASE
  // =============================================================================
  {
    id: 'diverticular-disease',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-colorectal',
    name: 'Diverticular Disease',
    slug: 'diverticular-disease',
    description: 'Diverticulitis, Hinchey classification, and surgical management',
    content: {
      concept: `# Diverticular Disease

## Definitions

| Term | Definition |
|------|------------|
| **Diverticulum** | Outpouching of colonic wall |
| **Diverticulosis** | Presence of diverticula (asymptomatic) |
| **Diverticular disease** | Symptomatic diverticula |
| **Diverticulitis** | Inflammation/infection of diverticula |

## Types of Diverticula

| Type | Layers | Location | Etiology |
|------|--------|----------|----------|
| **True** | All wall layers | Cecum, solitary | Congenital |
| **False (Pseudo)** | Mucosa + submucosa only | Sigmoid (most common) | Acquired, high pressure |

> 💎 **Colonic diverticula are FALSE (acquired) diverticula** - only mucosa/submucosa herniate through muscular wall

## Pathophysiology

### Location
- **Western**: 95% in sigmoid (high pressure zone)
- **Asian**: Right colon more common (different pathophysiology)

### Risk Factors
- Age >40 (prevalence increases with age)
- Low fiber diet
- Obesity
- Sedentary lifestyle
- Connective tissue disorders (Marfan, Ehlers-Danlos)
- Immunosuppression (steroids, transplant)

### Anatomical Points
- Diverticula occur at **weak points** where vasa recta penetrate muscularis
- Located between mesenteric and antimesenteric taeniae
- NOT on antimesenteric border (unlike Meckel's)

## Clinical Spectrum

### Diverticulosis
- Asymptomatic in 80%
- Found incidentally on colonoscopy/CT
- May cause painless lower GI bleeding

### Symptomatic Uncomplicated Diverticular Disease (SUDD)
- Chronic LLQ pain
- Bloating, irregular bowel habits
- No acute inflammation

### Acute Diverticulitis
- LLQ pain (70-93%)
- Fever, leukocytosis
- Change in bowel habits
- ± Urinary symptoms (bladder irritation)

## Classification

### Hinchey Classification (for Complicated Diverticulitis)

| Stage | Description | Treatment |
|-------|-------------|-----------|
| **I** | Pericolic/mesenteric abscess | Antibiotics ± percutaneous drainage |
| **II** | Pelvic or distant abscess | Percutaneous drainage + antibiotics |
| **III** | Purulent peritonitis | Emergency surgery |
| **IV** | Fecal peritonitis | Emergency surgery |

> 💎 **Hinchey III/IV require emergency surgery**

### Modified Hinchey (CT-based)
- Ia: Confined pericolic inflammation
- Ib: Pericolic abscess
- II: Pelvic, distant, or multiple abscesses
- III: Purulent peritonitis
- IV: Fecal peritonitis

## Diagnosis

### CT Abdomen/Pelvis (Gold Standard)
**Findings:**
- Pericolic fat stranding
- Bowel wall thickening (>4 mm)
- Diverticula
- ± Abscess, free air, fistula

### Laboratory
- Leukocytosis
- Elevated CRP
- Urinalysis (rule out UTI, assess for colovesical fistula)

### Colonoscopy
- **Contraindicated in acute diverticulitis** (perforation risk)
- Perform 6-8 weeks after resolution to rule out malignancy

## Management

### Uncomplicated Diverticulitis

#### Outpatient (Mild)
- Clear liquid diet → advance as tolerated
- Antibiotics: controversial, not always needed
  - If used: Ciprofloxacin + Metronidazole OR Augmentin × 7-10 days
- Follow-up colonoscopy in 6-8 weeks

> 💎 **Recent evidence**: Uncomplicated diverticulitis can be managed WITHOUT antibiotics in selected patients

#### Inpatient (Moderate)
- Bowel rest
- IV fluids
- IV antibiotics
- CT to assess for complications

### Complicated Diverticulitis

#### Hinchey I-II (Abscess)
| Abscess Size | Management |
|--------------|------------|
| <3-4 cm | IV antibiotics, observation |
| ≥4 cm | Percutaneous drainage + IV antibiotics |

- **Success rate**: 70-90% with drainage
- Follow-up CT to confirm resolution

#### Hinchey III-IV (Peritonitis)

**Emergency Surgery Required**

| Procedure | Description | When |
|-----------|-------------|------|
| **Hartmann's procedure** | Sigmoid resection + end colostomy + rectal stump | Unstable, severe contamination |
| **Resection + primary anastomosis** | Resection + anastomosis ± diverting loop ileostomy | Stable, minimal contamination |
| **Laparoscopic lavage** | Peritoneal washout, no resection | Hinchey III only, controversial |

> 💎 **Hartmann's procedure** is traditional but has high non-reversal rate (30-50%)

### Surgical Indications (Elective)

**Absolute:**
- Fistula (colovesical, colovaginal)
- Stricture with obstruction
- Inability to rule out cancer

**Relative (individualized):**
- Recurrent attacks (2+ episodes)
- Immunocompromised patients (lower threshold)
- Persistent symptoms after resolution
- Complicated first episode (Hinchey II)

> 💎 Current guidelines: Decisions based on **severity**, not number of episodes

### Elective Surgery
- **Sigmoid colectomy** (laparoscopic preferred)
- Divide at rectosigmoid junction (proximal rectum)
- Remove all sigmoid diverticula
- Primary anastomosis (usually without ileostomy)

## Complications

### Fistula
| Type | Frequency | Symptoms | Diagnosis |
|------|-----------|----------|-----------|
| **Colovesical** | Most common | Pneumaturia, fecaluria, recurrent UTI | CT, cystoscopy |
| **Colovaginal** | 2nd common | Feculent vaginal discharge | CT, exam |
| **Coloenteric** | Rare | Diarrhea | CT |
| **Colocutaneous** | Rare | Fecal discharge from skin | Clinical |

> 💎 **Colovesical fistula**: More common in men; in women, uterus is protective

### Obstruction
- Usually partial (phlegmon/stricture)
- Exclude cancer with colonoscopy after resolution
- Resection if malignancy cannot be ruled out

### Hemorrhage
- Lower GI bleeding (painless, massive)
- Usually right-sided diverticula (counterintuitive)
- Management: Resuscitation → colonoscopy → angiography → surgery
- 80% stop spontaneously

### Stricture
- Chronic inflammation → fibrosis
- May mimic carcinoma
- Resection indicated

## Special Populations

### Immunocompromised
- Higher rates of perforation
- Higher mortality
- Lower threshold for surgery
- May present with minimal symptoms

### Young Patients (<50)
- Previously thought to be more aggressive
- Recent data: Not necessarily worse
- Individualize management

### Right-sided Diverticulitis (Asian)
- Often single, true diverticulum
- Can mimic appendicitis
- May be managed conservatively or with appendectomy + diverticulectomy`,
      keyPoints: [
        'Colonic diverticula are FALSE (acquired) - mucosa/submucosa only',
        'Sigmoid colon most common location in Western patients',
        'Hinchey classification guides management of complicated disease',
        'Hinchey III/IV (peritonitis) require emergency surgery',
        'Hartmann\'s procedure: sigmoid resection + end colostomy + rectal stump closure',
        'Abscess ≥4 cm: percutaneous drainage + antibiotics',
        'Colonoscopy 6-8 weeks after acute episode to rule out cancer',
        'Colovesical fistula most common fistula type'
      ],
      examPrep: {
        summary: `**Diverticular Disease - Quick Review**

📍 **Location**: Sigmoid (95% Western)

🏥 **Hinchey Classification**:
- I: Pericolic abscess → Abx ± drain
- II: Pelvic/distant abscess → Drain + Abx
- III: Purulent peritonitis → Surgery
- IV: Fecal peritonitis → Surgery

✂️ **Surgery Options**:
- Hartmann's: Unstable/contaminated
- Resection + anastomosis: Stable

⚠️ **Complications**:
- Fistula (colovesical MC)
- Obstruction/Stricture
- Hemorrhage
- Perforation`,
        mnemonics: [
          'Hinchey: "1 small, 2 big, 3 pus, 4 poop" (abscess small, abscess big, purulent peritonitis, fecal peritonitis)',
          'FALSE diverticula = Forget All Layers (mucosa + submucosa only)',
          'Pneumaturia = "Pee-umaturia" (air in urine) = colovesical fistula'
        ],
        highYield: [
          'Diverticula occur where vasa recta penetrate (weak points)',
          'Recent evidence supports no antibiotics for uncomplicated diverticulitis',
          'Hartmann\'s reversal rate only 50-70%',
          'Right-sided diverticular bleeding is more common (despite left-sided disease)'
        ],
        commonMCQs: [
          'Most common location of colonic diverticula: Sigmoid colon',
          'Hinchey stage requiring emergency surgery: III and IV',
          'Most common diverticular fistula: Colovesical',
          'Pathognomonic symptom of colovesical fistula: Pneumaturia',
          'When to do colonoscopy after acute diverticulitis: 6-8 weeks after resolution'
        ]
      },
      textbookRefs: [
        { textbook: "Maingot's Abdominal Operations", edition: '12th', chapter: 'Chapter 32', chapterTitle: 'Diverticular Disease', pages: '722-750' },
        { textbook: "Shackelford's Surgery", edition: '9th', chapter: 'Chapter 170', chapterTitle: 'Diverticular Disease of the Colon' },
        { textbook: 'Fischer\'s Mastery of Surgery', edition: '7th', chapter: 'Chapter 149', chapterTitle: 'Diverticular Disease' }
      ],
      retrievalCards: [
        { id: 'div-1', question: 'What is the Hinchey classification?', answer: 'Classification of complicated diverticulitis: Stage I = pericolic/mesenteric abscess, Stage II = pelvic or distant abscess, Stage III = purulent peritonitis, Stage IV = fecal peritonitis. Stages III-IV require emergency surgery.', difficulty: 2 },
        { id: 'div-2', question: 'What is the most common type of fistula in diverticular disease and its pathognomonic symptom?', answer: 'COLOVESICAL FISTULA is most common. Pathognomonic symptoms: pneumaturia (air in urine) and fecaluria (feces in urine). More common in males as uterus is protective in females.', difficulty: 2 },
        { id: 'div-3', question: 'What is Hartmann\'s procedure?', answer: 'Sigmoid resection with END COLOSTOMY and closure of rectal stump. Used in emergency diverticulitis (Hinchey III/IV) when patient is unstable or there is severe contamination. Reversal rate is only 50-70%.', difficulty: 1 },
        { id: 'div-4', question: 'When should colonoscopy be performed after acute diverticulitis?', answer: '6-8 WEEKS after resolution of acute episode. Purpose: rule out underlying colorectal cancer (presents similarly). Colonoscopy is contraindicated in acute diverticulitis due to perforation risk.', difficulty: 1 },
        { id: 'div-5', question: 'How are abscesses managed in complicated diverticulitis?', answer: 'Abscess <3-4 cm: IV antibiotics alone. Abscess ≥4 cm: PERCUTANEOUS DRAINAGE + IV antibiotics. Success rate 70-90%. Follow-up CT to confirm resolution.', difficulty: 2 },
        { id: 'div-6', question: 'Why do colonic diverticula occur at specific locations?', answer: 'Diverticula form at WEAK POINTS where vasa recta penetrate the muscular wall (between mesenteric and antimesenteric taeniae). High intraluminal pressure pushes mucosa/submucosa through these points.', difficulty: 2 }
      ],
      cases: [
        {
          id: 'div-case-1',
          title: 'Complicated Diverticulitis with Abscess',
          presentation: 'A 58-year-old woman presents with 4 days of LLQ pain, fever (38.5°C), and anorexia. She has no peritoneal signs. CT shows sigmoid diverticulitis with a 5 cm pelvic abscess.',
          question: 'What is the Hinchey stage and optimal management?',
          answer: 'This is HINCHEY II (pelvic abscess). Management: CT-GUIDED PERCUTANEOUS DRAINAGE + IV antibiotics. Success rate 70-90%. After resolution, perform colonoscopy at 6-8 weeks to rule out cancer. Consider elective sigmoid colectomy after recovery to prevent recurrence.',
          difficulty: 2,
          tags: ['diverticulitis', 'abscess', 'Hinchey']
        }
      ]
    },
    prerequisites: ['colorectal-anatomy'],
    relatedTopics: ['colorectal-cancer', 'lower-gi-bleeding'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'SGE'],
    estimatedMinutes: 40,
    hasContent: { concept: true, examPrep: true, textbook: true, retrievalCards: true, cases: true, grindeMap: false },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09'
  },

  // =============================================================================
  // HEMORRHOIDS
  // =============================================================================
  {
    id: 'hemorrhoids',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-colorectal',
    name: 'Hemorrhoids',
    slug: 'hemorrhoids',
    description: 'Classification, banding, and hemorrhoidectomy',
    content: {
      concept: `# Hemorrhoids

## Definition

Hemorrhoids are **symptomatic anal cushions** - normal vascular structures that become pathological when enlarged, inflamed, or prolapsed.

## Anatomy

### Anal Cushions
- Three main cushions: **Left lateral, Right anterior, Right posterior**
- Position corresponds to 3, 7, and 11 o'clock (lithotomy position)
- Composed of: arteriovenous channels, smooth muscle, connective tissue

> 💎 **Mnemonic**: "3, 7, 11 - hemorrhoid heaven" (positions of main hemorrhoids)

### Dentate (Pectinate) Line
- Junction between upper 2/3 (columnar epithelium) and lower 1/3 (squamous epithelium)
- Divides internal from external hemorrhoids
- Above: Visceral innervation (painless)
- Below: Somatic innervation (painful)

## Classification

### Internal Hemorrhoids (Above Dentate Line)
| Grade | Description | Prolapse | Treatment |
|-------|-------------|----------|-----------|
| **I** | Bleeding only, no prolapse | None | Conservative, RBL |
| **II** | Prolapse with straining, spontaneous reduction | Reduces spontaneously | RBL, sclerotherapy |
| **III** | Prolapse requires manual reduction | Manual reduction | RBL, hemorrhoidectomy |
| **IV** | Prolapsed, irreducible | Cannot be reduced | Hemorrhoidectomy |

### External Hemorrhoids (Below Dentate Line)
- Covered by squamous epithelium
- Painful when thrombosed
- Treatment: Conservative or excision if thrombosed

## Clinical Features

### Symptoms
| Type | Symptoms |
|------|----------|
| **Internal** | Painless bright red bleeding (on paper/in toilet), prolapse, mucus discharge, pruritus |
| **External** | Pain (if thrombosed), swelling, perianal lump |

> 💎 **Key**: Internal hemorrhoids are PAINLESS (above dentate line, visceral innervation)

### Thrombosed External Hemorrhoid
- Acute onset perianal pain
- Blue/purple tender lump
- Most painful in first 48-72 hours
- Spontaneous resolution in 7-10 days if untreated

## Diagnosis

### Physical Examination
1. **Inspection**: Prolapsed tissue, skin tags, thrombosis
2. **Digital rectal exam**: Assess sphincter tone, exclude other pathology
3. **Anoscopy**: Best to visualize internal hemorrhoids
4. **Proctoscopy**: Assess rectal mucosa

### When to Scope Further
- Age >40 with new symptoms
- Change in bowel habits
- Family history of CRC
- Anemia or weight loss
- Rectal bleeding not typical of hemorrhoids

## Treatment

### Conservative Management (All Grades, First Line)
- High-fiber diet (25-30 g/day)
- Adequate hydration
- Avoid straining
- Sitz baths
- Topical agents (hydrocortisone, local anesthetics)

### Office Procedures (Grade I-III)

#### Rubber Band Ligation (RBL)
- **Most effective office procedure**
- Band placed at base of internal hemorrhoid (above dentate line)
- Tissue necroses and sloughs in 5-7 days
- Success rate: 70-80%
- Can treat one or multiple hemorrhoids per session

> ⚠️ **Complications**: Pain (banded too close to dentate), bleeding, sepsis (rare but serious)

#### Sclerotherapy
- Injection of sclerosant (phenol in oil, sodium tetradecyl sulfate)
- For Grade I-II hemorrhoids
- Less effective than RBL
- Lower complication rate

#### Infrared Coagulation
- Coagulates hemorrhoidal tissue
- For Grade I-II hemorrhoids
- Multiple sessions often needed
- Low complication rate

### Surgical Treatment (Grade III-IV, Failed Office Treatment)

#### Excisional Hemorrhoidectomy

**Milligan-Morgan (Open)**
- Three primary hemorrhoids excised
- Wounds left open (V-shaped)
- Most common worldwide
- More postoperative pain, longer healing

**Ferguson (Closed)**
- Wounds closed with absorbable sutures
- Less pain, faster healing
- Preferred in USA

> 💎 **Preserve mucosal bridges** between excision sites to prevent stenosis

#### Stapled Hemorrhoidopexy (PPH - Procedure for Prolapse and Hemorrhoids)
- Stapler excises circumferential ring of mucosa/submucosa above hemorrhoids
- Lifts and fixes hemorrhoidal cushions
- Indicated for Grade III-IV circumferential internal hemorrhoids
- Less pain than excisional, faster recovery
- Higher recurrence rate, risk of chronic pain

#### Transanal Hemorrhoidal Dearterialization (THD)
- Doppler-guided ligation of hemorrhoidal arteries
- ± Mucopexy (plication of prolapsing tissue)
- Less painful, organ-preserving
- Good for Grade II-III

### Thrombosed External Hemorrhoid

| Timing | Management |
|--------|------------|
| <72 hours | Excision under local anesthesia (immediate relief) |
| >72 hours | Conservative (resolving); excise if severe pain persists |

> 💎 **Excision, not incision** - incision leads to clot re-accumulation

## Special Situations

### Hemorrhoids in Pregnancy
- Very common (30-40%)
- Usually resolve postpartum
- Conservative management preferred
- RBL contraindicated in pregnancy
- Surgery only for severe/refractory cases postpartum

### Hemorrhoids in IBD
- Conservative management
- Surgical treatment relatively contraindicated (poor healing)

### Hemorrhoids in Portal Hypertension
- Anorectal varices, not true hemorrhoids
- Do NOT band or operate (massive bleeding)
- Treat underlying portal hypertension

### Post-Hemorrhoidectomy Complications
| Complication | Incidence | Management |
|--------------|-----------|------------|
| Pain | Common | Analgesics, sitz baths |
| Urinary retention | 10-15% | Catheterization |
| Bleeding | 1-5% | Observation, rarely reoperation |
| Infection/Sepsis | Rare (<1%) | IV antibiotics, debridement |
| Anal stenosis | 1-3% | Dilation, anoplasty |
| Incontinence | Rare | If extensive sphincter damage |`,
      keyPoints: [
        'Hemorrhoids are symptomatic anal cushions at 3, 7, 11 o\'clock positions',
        'Internal hemorrhoids (above dentate) are painless; external (below) are painful',
        'Grading I-IV based on degree of prolapse',
        'RBL is most effective office procedure for Grade I-III',
        'Excisional hemorrhoidectomy (Milligan-Morgan/Ferguson) for Grade III-IV',
        'Thrombosed external hemorrhoid: excise within 72 hours for best relief',
        'Stapled hemorrhoidopexy: less pain but higher recurrence'
      ],
      examPrep: {
        summary: `**Hemorrhoids - Quick Review**

📍 **Position**: 3, 7, 11 o'clock (lithotomy)

📊 **Grading (Internal)**:
- I: Bleeding only
- II: Prolapse, spontaneous reduction
- III: Prolapse, manual reduction
- IV: Prolapse, irreducible

💊 **Treatment by Grade**:
- I-II: Conservative, RBL, sclerotherapy
- III-IV: RBL, Hemorrhoidectomy

✂️ **Surgery**:
- Milligan-Morgan (open)
- Ferguson (closed)
- Stapled (PPH) - less pain, more recurrence

⚠️ **Thrombosed External**: Excise within 72 hours`,
        mnemonics: [
          '"3, 7, 11 - hemorrhoid heaven" (positions)',
          'Grade by the clock: I=just bleed, II=go and come, III=help me, IV=stuck forever',
          'RBL = "Really Best Ligation" (most effective office procedure)'
        ],
        highYield: [
          'Internal hemorrhoids are PAINLESS (visceral innervation)',
          'Excision NOT incision for thrombosed hemorrhoid',
          'Preserve mucosal bridges to prevent stenosis',
          'Anorectal varices in portal HTN - do NOT band'
        ],
        commonMCQs: [
          'Most effective office procedure for hemorrhoids: Rubber band ligation',
          'Position of primary hemorrhoids: 3, 7, 11 o\'clock',
          'Grade II hemorrhoid: Prolapse with spontaneous reduction',
          'Treatment of thrombosed external hemorrhoid <72 hours: Excision',
          'Complication of not preserving mucosal bridges: Anal stenosis'
        ]
      },
      textbookRefs: [
        { textbook: "Shackelford's Surgery", edition: '9th', chapter: 'Chapter 171', chapterTitle: 'Hemorrhoidal Disease' },
        { textbook: "Netter's Surgical Anatomy", edition: '2nd', chapter: 'Chapter 26', chapterTitle: 'Hemorrhoidectomy' }
      ],
      retrievalCards: [
        { id: 'hem-1', question: 'What are the positions of the three primary hemorrhoidal cushions?', answer: '3, 7, and 11 o\'clock in lithotomy position (Left lateral, Right anterior, Right posterior)', difficulty: 1 },
        { id: 'hem-2', question: 'What is the grading system for internal hemorrhoids?', answer: 'Grade I: Bleeding only, no prolapse. Grade II: Prolapse with straining, spontaneous reduction. Grade III: Prolapse requiring manual reduction. Grade IV: Prolapsed, irreducible.', difficulty: 1 },
        { id: 'hem-3', question: 'Why are internal hemorrhoids painless while external hemorrhoids are painful?', answer: 'Internal hemorrhoids are above the dentate line - visceral innervation (autonomic). External hemorrhoids are below the dentate line - somatic innervation (inferior rectal nerve). Somatic nerves carry pain sensation.', difficulty: 2 },
        { id: 'hem-4', question: 'What is the optimal management of a thrombosed external hemorrhoid presenting within 72 hours?', answer: 'EXCISION (not incision) under local anesthesia. Provides immediate pain relief. After 72 hours, pain is usually improving and conservative management is preferred unless symptoms are severe.', difficulty: 2 },
        { id: 'hem-5', question: 'What complication occurs if mucosal bridges are not preserved during hemorrhoidectomy?', answer: 'ANAL STENOSIS. Mucosal bridges must be preserved between excision sites to prevent circumferential scarring and stenosis.', difficulty: 2 },
        { id: 'hem-6', question: 'Why should anorectal varices in portal hypertension not be treated like hemorrhoids?', answer: 'Anorectal varices are dilated portosystemic collaterals, NOT true hemorrhoids. Rubber band ligation or surgery can cause massive, life-threatening hemorrhage. Treat the underlying portal hypertension instead.', difficulty: 3 }
      ],
      cases: []
    },
    prerequisites: ['colorectal-anatomy'],
    relatedTopics: ['anal-fissure', 'anorectal-abscess-fistula'],
    difficulty: 2,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'SGE'],
    estimatedMinutes: 35,
    hasContent: { concept: true, examPrep: true, textbook: true, retrievalCards: true, cases: false, grindeMap: false },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09'
  },

  // =============================================================================
  // ANAL FISSURE
  // =============================================================================
  {
    id: 'anal-fissure',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-colorectal',
    name: 'Anal Fissure',
    slug: 'anal-fissure',
    description: 'Medical and surgical management of anal fissures',
    content: {
      concept: `# Anal Fissure

## Definition

An anal fissure is a **linear tear in the anoderm** (squamous epithelium of the anal canal), distal to the dentate line.

## Pathophysiology

### Vicious Cycle
\`\`\`
Trauma (hard stool, diarrhea)
    ↓
Tear in anoderm
    ↓
Pain → Internal sphincter spasm
    ↓
Reduced blood flow (posterior midline is watershed)
    ↓
Impaired healing
    ↓
Chronic fissure
    ↓
More spasm → More pain → Fear of defecation
\`\`\`

### Why Posterior Midline?
- **90% occur at 6 o'clock** (posterior midline)
- Posterior midline has poorest blood supply (watershed area)
- Elliptical shape of anal canal creates most shear stress posteriorly

> 💎 **Anterior fissures**: More common in women (10-15%), related to obstetric trauma

## Classification

| Type | Duration | Features |
|------|----------|----------|
| **Acute** | <6 weeks | Fresh tear, red base, no secondary features |
| **Chronic** | >6 weeks | Sentinel pile, hypertrophied anal papilla, fibrotic base, exposed internal sphincter |

### Secondary Features of Chronic Fissure (Triad)
1. **Sentinel pile (tag)** - External skin tag at distal end
2. **Hypertrophied anal papilla** - At proximal end (above dentate)
3. **Exposed internal sphincter fibers** - In base of fissure

## Clinical Features

### Symptoms
- **Severe pain with defecation** - Tearing/cutting pain
- **Bright red rectal bleeding** - On paper, separate from stool
- **Sphincter spasm** - Prolongs pain after defecation
- **Constipation** - Fear of defecation

### Examination
- Gently part buttocks
- Visible tear (usually posterior midline)
- ± Sentinel tag, anal papilla
- DRE often too painful (defer or do with anesthesia)

> ⚠️ **Off-midline fissure**: Consider secondary causes (Crohn's, TB, HIV, syphilis, cancer)

## Differential Diagnosis

### Primary vs Secondary Fissure
| Feature | Primary | Secondary |
|---------|---------|-----------|
| Location | Posterior (90%) or anterior midline | Off-midline, multiple, or atypical |
| Cause | Trauma, constipation | Crohn's, TB, HIV, syphilis, leukemia, cancer |
| Treatment | Standard | Treat underlying cause |

## Treatment

### Conservative Management (First Line - All Patients)

#### Lifestyle Modifications
- High-fiber diet (25-30 g/day)
- Adequate hydration
- Stool softeners
- Avoid straining
- Sitz baths (warm water, 10-15 min, 2-3x daily)

> 💎 **50-60% of acute fissures heal with conservative measures alone**

### Medical Therapy (Chemical Sphincterotomy)

#### Topical Nitrates
- **GTN 0.2-0.4%** ointment BD × 6-8 weeks
- Mechanism: NO → smooth muscle relaxation → reduced sphincter pressure
- Healing rate: 50-70%
- Side effect: **Headache** (20-30%, dose-limiting)

#### Topical Calcium Channel Blockers
- **Diltiazem 2%** ointment BD × 6-8 weeks
- Mechanism: Calcium channel blockade → smooth muscle relaxation
- Healing rate: 65-75%
- Fewer headaches than GTN

#### Botulinum Toxin Injection
- Inject 20-100 units into internal sphincter
- Mechanism: Blocks acetylcholine release → temporary paralysis
- Healing rate: 60-80%
- Duration: 3-6 months
- Risk: Temporary incontinence (5-10%)

> 💎 **Diltiazem often preferred** over GTN due to fewer side effects

### Surgical Treatment

#### Lateral Internal Sphincterotomy (LIS)
- **Gold standard surgical treatment**
- Healing rate: **95%+**
- Divide internal sphincter at lateral position
- Can be open or closed technique

##### Technique
1. Identify intersphincteric groove laterally
2. Divide internal sphincter up to dentate line
3. Preserve external sphincter
4. ± Fissurectomy and sentinel tag excision

##### Risks
| Complication | Incidence |
|--------------|-----------|
| Incontinence (minor - flatus/soiling) | 5-15% |
| Incontinence (major - solid stool) | <1% |
| Recurrence | 1-5% |

> ⚠️ **Tailored sphincterotomy**: Shorter division (to apex of fissure, not dentate line) may reduce incontinence risk with similar healing rates

#### Fissurectomy + Advancement Flap
- Alternative to LIS (sphincter-sparing)
- Excise chronic fissure + advance healthy anoderm
- Consider for women, those with prior sphincter injury, or incontinence risk

### Treatment Algorithm
\`\`\`
Acute Fissure
    ↓
Conservative management (6-8 weeks)
    ↓
Healed → Maintain fiber/hydration
    ↓
Not healed or Chronic Fissure
    ↓
Topical diltiazem or GTN (6-8 weeks)
    ↓
Healed → Continue PRN
    ↓
Not healed
    ↓
Botox OR Lateral Internal Sphincterotomy
    ↓
LIS = definitive if medical therapy fails
\`\`\`

## Special Populations

### Crohn's Disease
- Fissures often multiple, off-midline, painless
- Treat underlying Crohn's first
- LIS relatively contraindicated (poor healing, incontinence)
- Consider advancement flap if surgery needed

### Women with Obstetric Trauma
- Higher baseline risk of incontinence
- Prefer conservative/medical management
- If surgery needed, consider fissurectomy + advancement flap

### HIV/Immunocompromised
- Rule out opportunistic infections
- May have multiple, atypical fissures
- Medical management preferred
- Healing may be delayed`,
      keyPoints: [
        'Anal fissure is a tear in anoderm, 90% posterior midline',
        'Posterior midline has poorest blood supply (watershed)',
        'Chronic fissure triad: sentinel pile, hypertrophied papilla, exposed sphincter',
        'Off-midline fissure = consider secondary causes (Crohn\'s, TB, HIV)',
        'Conservative treatment heals 50-60% of acute fissures',
        'Topical diltiazem preferred over GTN (fewer headaches)',
        'Lateral internal sphincterotomy is gold standard surgery (95% healing)'
      ],
      examPrep: {
        summary: `**Anal Fissure - Quick Review**

📍 **Location**: 90% posterior midline (watershed)

🕒 **Classification**:
- Acute: <6 weeks, fresh tear
- Chronic: >6 weeks + sentinel pile + papilla

💊 **Medical Treatment**:
- GTN 0.2% or Diltiazem 2% × 6-8 weeks
- Botox if medical therapy fails

✂️ **Surgery**:
- Lateral Internal Sphincterotomy (LIS)
- 95%+ healing rate

⚠️ **Red Flags** (consider secondary):
- Off-midline location
- Multiple fissures
- Painless fissure`,
        mnemonics: [
          '"6 o\'clock fissure" = posterior midline (most common)',
          'Chronic fissure triad: "SSE" = Sentinel pile, Sphincter exposed, (papilla) Enlarged',
          'GTN = Give Terrible headache to Nobody (use diltiazem instead)'
        ],
        highYield: [
          'Posterior midline is watershed area for blood supply',
          'Anterior fissures more common in women (obstetric-related)',
          'Off-midline fissure = ALWAYS think secondary cause',
          'LIS risk: minor incontinence 5-15%, major <1%'
        ],
        commonMCQs: [
          'Most common location of anal fissure: Posterior midline',
          'Gold standard surgical treatment: Lateral internal sphincterotomy',
          'Side effect of topical GTN: Headache',
          'Chronic fissure feature: Sentinel tag (pile)',
          'Off-midline fissure suggests: Secondary cause (Crohn\'s, TB, HIV)'
        ]
      },
      textbookRefs: [
        { textbook: "Shackelford's Surgery", edition: '9th', chapter: 'Chapter 171', chapterTitle: 'Anorectal Disease' },
        { textbook: "Bailey & Love", edition: '28th', chapter: 'Chapter 79', chapterTitle: 'Anal Fissure' }
      ],
      retrievalCards: [
        { id: 'fis-1', question: 'Why do 90% of anal fissures occur at the posterior midline?', answer: 'The posterior midline has the poorest blood supply (watershed area) and experiences the greatest shear stress during defecation due to the elliptical shape of the anal canal, leading to poor healing.', difficulty: 2 },
        { id: 'fis-2', question: 'What are the three features of a chronic anal fissure?', answer: '1) Sentinel pile (skin tag) at distal end, 2) Hypertrophied anal papilla at proximal end, 3) Exposed internal sphincter fibers in the base of the fissure', difficulty: 1 },
        { id: 'fis-3', question: 'What should you suspect if an anal fissure is located off the midline?', answer: 'Secondary cause such as Crohn\'s disease, tuberculosis, HIV, syphilis, or anal cancer. Primary fissures are almost always at posterior (90%) or anterior midline.', difficulty: 2 },
        { id: 'fis-4', question: 'What is lateral internal sphincterotomy and what is its healing rate?', answer: 'LIS is the gold standard surgical treatment for chronic anal fissure. The internal sphincter is divided at the lateral position (not at the fissure site) up to the dentate line. Healing rate is >95%. Risk of minor incontinence is 5-15%.', difficulty: 2 },
        { id: 'fis-5', question: 'Why is topical diltiazem often preferred over GTN for anal fissure?', answer: 'Both have similar healing rates (60-70%), but diltiazem causes significantly fewer headaches. GTN causes headache in 20-30% of patients, which is often dose-limiting.', difficulty: 2 }
      ],
      cases: []
    },
    prerequisites: ['colorectal-anatomy'],
    relatedTopics: ['hemorrhoids', 'anorectal-abscess-fistula'],
    difficulty: 2,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'SGE'],
    estimatedMinutes: 30,
    hasContent: { concept: true, examPrep: true, textbook: true, retrievalCards: true, cases: false, grindeMap: false },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09'
  },

  // =============================================================================
  // FISTULA-IN-ANO
  // =============================================================================
  {
    id: 'anorectal-abscess-fistula',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-colorectal',
    name: 'Anorectal Abscess & Fistula-in-Ano',
    slug: 'anorectal-abscess-fistula',
    description: 'Parks classification, abscess drainage, and fistula surgery',
    content: {
      concept: `# Anorectal Abscess & Fistula-in-Ano

## Overview

Anorectal abscess and fistula-in-ano are part of the same disease spectrum:
- **Abscess** = Acute phase
- **Fistula** = Chronic phase (in ~30-50% of abscesses)

## Cryptoglandular Theory

The predominant etiology (90% of cases):

\`\`\`
Anal glands (at dentate line, in intersphincteric space)
    ↓
Obstruction/Infection of gland
    ↓
Abscess in intersphincteric space
    ↓
Spread to various spaces
    ↓
Spontaneous or surgical drainage
    ↓
Persistent communication (fistula) in 30-50%
\`\`\`

> 💎 **Anal glands** open at the dentate line and extend into the intersphincteric space - this is why infections START in this space

## Anorectal Abscess

### Classification by Space Involved

| Type | Location | Frequency | Presentation |
|------|----------|-----------|--------------|
| **Perianal** | Subcutaneous, at anal verge | 60% | Painful perianal swelling |
| **Ischiorectal** | Ischiorectal fossa | 20% | Buttock pain, larger swelling |
| **Intersphincteric** | Between internal/external sphincters | 5% | Rectal pain, DRE tender |
| **Supralevator** | Above levator ani | 5% | Deep pelvic/rectal pain |
| **Horseshoe** | Bilateral ischiorectal via deep post-anal space | Rare | Bilateral buttock pain |

### Clinical Features
- **Pain**: Constant, throbbing, worse with sitting/defecation
- **Swelling**: Fluctuant mass (perianal/ischiorectal)
- **Fever**: Variable
- **Discharge**: If spontaneously draining

### Diagnosis
- Usually clinical
- **DRE**: Tender, fluctuant mass
- **CT/MRI**: For deep abscesses (supralevator, unclear anatomy)
- **EUA (examination under anesthesia)**: When clinical exam inadequate

### Treatment

#### Principle: **"The sun should never set on an anorectal abscess"**

- **Incision and drainage** is the treatment - do not delay for imaging
- Antibiotics alone are insufficient
- Antibiotics adjunct for: cellulitis, immunocompromised, systemic illness, prosthetic devices

| Abscess Type | Drainage Approach |
|--------------|-------------------|
| Perianal | Cruciate or elliptical incision, close to anal verge |
| Ischiorectal | Incision over fluctuant area, lateral to anus |
| Intersphincteric | Internal sphincterotomy (drain into rectum) |
| Supralevator | Depends on origin - transrectal if from above, perianal if from below |
| Horseshoe | Posterior midline + counter-drainage bilaterally |

> ⚠️ **Supralevator abscess**: Critical to determine origin - draining the wrong way creates a suprasphincteric fistula

## Fistula-in-Ano

### Definition
An abnormal epithelialized tract connecting the anal canal (internal opening) with the perianal skin (external opening).

### Goodsall's Rule

Predicts location of internal opening based on external opening:

| External Opening | Internal Opening |
|------------------|------------------|
| **Anterior** to transverse anal line | Radial (straight) to nearest crypt |
| **Posterior** to transverse anal line | Curves to posterior midline (6 o'clock) |

\`\`\`
      12 o'clock
          |
    ------+------ (Transverse line)
          |
       6 o'clock
       
External opening POSTERIOR → Internal opening at 6 o'clock (curved)
External opening ANTERIOR → Internal opening radially opposite (straight)
\`\`\`

> 💎 **Exception**: Long anterior fistulas (>3 cm from anal verge) may curve posteriorly

### Parks Classification

Based on relationship to sphincters:

| Type | Path | Frequency | Treatment |
|------|------|-----------|-----------|
| **Intersphincteric** | Through internal sphincter, between sphincters, to skin | 70% | Fistulotomy |
| **Trans-sphincteric** | Through both sphincters, through ischiorectal fossa | 25% | Low: fistulotomy; High: seton/LIFT/flap |
| **Suprasphincteric** | Up intersphincteric, over puborectalis, down through ischiorectal | 5% | Seton/LIFT/advancement flap |
| **Extrasphincteric** | Outside sphincters entirely (usually iatrogenic or Crohn's) | 1% | Depends on cause |

### Investigations
- **MRI pelvis**: Gold standard for complex fistulas (accuracy >90%)
- **Endoanal ultrasound**: Good for sphincter involvement
- **Fistulography**: Rarely used now
- **EUA**: Therapeutic and diagnostic

### Treatment Principles

#### Goals
1. Eradicate sepsis
2. Close fistula tract
3. **Preserve continence** (critical!)

#### Simple Fistulas (Low trans-sphincteric, Intersphincteric)

**Fistulotomy**
- Lay open the tract
- Allows healing by secondary intention
- >90% success for simple fistulas
- Only if <30% sphincter involved

**Fistulectomy**
- Excise entire tract (core out)
- Larger wound, higher incontinence risk
- Mainly for recurrent/complex cases, histology needed

#### Complex Fistulas (High trans-sphincteric, Suprasphincteric, Recurrent, Crohn's)

**Seton**
- Thread (suture/rubber band) through fistula tract
- Types:
  - **Loose/draining seton**: Maintains drainage, controls sepsis
  - **Cutting seton**: Gradually cuts through sphincter (high incontinence)
- Can be left long-term or staged with other procedures

**LIFT Procedure** (Ligation of Intersphincteric Fistula Tract)
- Dissect and ligate tract in intersphincteric space
- Sphincter-preserving
- Success rate: 60-80%

**Advancement Flap**
- Close internal opening with rectal mucosal/muscular flap
- Sphincter-preserving
- Success rate: 50-80%

**VAAFT** (Video-Assisted Anal Fistula Treatment)
- Fistuloscopy to visualize and ablate tract
- Close internal opening
- Sphincter-preserving

**Fistula Plug**
- Bioprosthetic plug inserted into tract
- Variable success (30-60%)

**Stem Cells/Darvadstrocel**
- For Crohn's perianal fistulas
- Local injection of adipose-derived stem cells

### Complex Fistula Management Algorithm
\`\`\`
Complex Fistula
    ↓
MRI to define anatomy
    ↓
EUA + Draining seton (control sepsis)
    ↓
Wait 6-12 weeks for inflammation to settle
    ↓
Definitive procedure:
├── LIFT (if tract well-defined)
├── Advancement flap (if good tissue)
├── VAAFT (if available)
└── Staged fistulotomy (if cutting seton accepted)
\`\`\`

## Special Situations

### Crohn's Perianal Fistula
- Common (25-50% of Crohn's patients)
- Often complex, multiple tracts
- **Medical therapy first**: Antibiotics, immunomodulators, biologics (infliximab/adalimumab)
- Surgery: Seton drainage, LIFT, advancement flap
- Avoid cutting setons and fistulotomy (poor healing)
- Proctectomy for severe, refractory cases

### HIV/AIDS
- Higher incidence of anorectal sepsis
- May have atypical presentations
- Manage similarly but watch for poor healing

### Necrotizing Fasciitis (Fournier's Gangrene)
- Life-threatening emergency
- Wide debridement + IV antibiotics + intensive care
- May need fecal diversion (colostomy)`,
      keyPoints: [
        'Abscess is acute phase; fistula is chronic phase (30-50% develop fistula)',
        'Anal glands in intersphincteric space - where infections start',
        'Perianal abscess is most common (60%)',
        '"Sun should never set on anorectal abscess" - drain early',
        'Goodsall\'s rule: anterior = straight, posterior = curved to 6 o\'clock',
        'Parks classification: Intersphincteric (70%), Trans-sphincteric (25%)',
        'Fistulotomy only if <30% sphincter involved',
        'Complex fistulas: MRI → Seton drainage → Definitive surgery (LIFT/flap)'
      ],
      examPrep: {
        summary: `**Anorectal Abscess & Fistula - Quick Review**

🦠 **Abscess Types** (by frequency):
- Perianal (60%) > Ischiorectal (20%) > Intersphincteric (5%) > Supralevator (5%)

🎯 **Goodsall's Rule**:
- Anterior external opening → Straight to internal opening
- Posterior external opening → Curves to 6 o'clock

📊 **Parks Classification**:
- Intersphincteric (70%)
- Trans-sphincteric (25%)
- Suprasphincteric (5%)
- Extrasphincteric (1%)

✂️ **Treatment**:
- Simple: Fistulotomy
- Complex: Seton → LIFT/Advancement flap`,
        mnemonics: [
          'Goodsall: "Anterior = Aim (straight), Posterior = Posterior (curves to 6 o\'clock)"',
          'Parks classification: "I TeaSS" = Intersphincteric, Trans-sphincteric, Suprasphincteric, (extra)Sphincteric',
          '"Sun never sets" = Emergency drainage for abscess'
        ],
        highYield: [
          'Supralevator abscess: determine origin before draining (wrong route = iatrogenic fistula)',
          'MRI is gold standard for complex fistula (>90% accuracy)',
          'Crohn\'s fistula: medical therapy first (biologics), avoid cutting procedures',
          'LIFT = Ligation of Intersphincteric Fistula Tract (sphincter-sparing)'
        ],
        commonMCQs: [
          'Most common type of perianal abscess: Perianal (60%)',
          'Most common type of anal fistula: Intersphincteric (70%)',
          'Goodsall\'s rule for posterior external opening: Curved tract to posterior midline',
          'Gold standard imaging for complex fistula: MRI pelvis',
          'Treatment of choice for simple low fistula: Fistulotomy'
        ]
      },
      textbookRefs: [
        { textbook: "Shackelford's Surgery", edition: '9th', chapter: 'Chapter 172', chapterTitle: 'Perianal Abscess and Fistula-in-Ano' },
        { textbook: "Netter's Surgical Anatomy", edition: '2nd', chapter: 'Chapter 27', chapterTitle: 'Anal Fistula Surgery' }
      ],
      retrievalCards: [
        { id: 'fist-1', question: 'What is Goodsall\'s rule?', answer: 'Rule predicting internal opening location: If external opening is ANTERIOR to the transverse anal line, the tract runs straight (radially) to the nearest crypt. If POSTERIOR, the tract curves to the posterior midline (6 o\'clock). Exception: Long anterior fistulas (>3cm) may curve posteriorly.', difficulty: 2 },
        { id: 'fist-2', question: 'What is the Parks classification of anal fistulas?', answer: 'Based on relation to sphincters: 1) INTERSPHINCTERIC (70%) - between sphincters, 2) TRANS-SPHINCTERIC (25%) - through both sphincters, 3) SUPRASPHINCTERIC (5%) - over puborectalis, 4) EXTRASPHINCTERIC (1%) - outside sphincters entirely', difficulty: 2 },
        { id: 'fist-3', question: 'Why must the origin of a supralevator abscess be determined before drainage?', answer: 'A supralevator abscess can originate from: 1) Below (from intersphincteric abscess extending upward) - drain through rectum, or 2) Above (from pelvic pathology) - drain through perianal route. Draining the wrong way creates a suprasphincteric fistula.', difficulty: 3 },
        { id: 'fist-4', question: 'What is the LIFT procedure?', answer: 'Ligation of Intersphincteric Fistula Tract - a sphincter-preserving procedure where the fistula tract is identified and ligated in the intersphincteric space. Success rate 60-80%. Good for trans-sphincteric fistulas.', difficulty: 2 },
        { id: 'fist-5', question: 'How should Crohn\'s perianal fistula be managed?', answer: 'Medical therapy FIRST: antibiotics, immunomodulators, biologics (infliximab/adalimumab). Surgery if needed: draining seton, LIFT, or advancement flap. AVOID cutting setons and fistulotomy (poor healing in Crohn\'s). Proctectomy for severe refractory cases.', difficulty: 3 },
        { id: 'fist-6', question: 'When can fistulotomy be safely performed for anal fistula?', answer: 'Fistulotomy is safe when <30% of sphincter complex is involved (typically intersphincteric and low trans-sphincteric fistulas). Higher sphincter involvement risks incontinence.', difficulty: 2 }
      ],
      cases: [
        {
          id: 'fist-case-1',
          title: 'Perianal Abscess',
          presentation: 'A 35-year-old man presents with 3 days of severe perianal pain, unable to sit. Examination reveals a tender, fluctuant 4 cm swelling at the anal verge. He is febrile (38.2°C).',
          question: 'What is the diagnosis and treatment?',
          answer: 'Diagnosis: PERIANAL ABSCESS. Treatment: INCISION AND DRAINAGE under local or general anesthesia. Make cruciate or elliptical incision close to anal verge to minimize future fistula tract length. Pack loosely. Antibiotics are NOT required unless cellulitis, immunocompromised, or systemic sepsis. Warn patient: 30-50% risk of developing fistula-in-ano.',
          difficulty: 2,
          tags: ['abscess', 'emergency', 'drainage']
        }
      ]
    },
    prerequisites: ['colorectal-anatomy'],
    relatedTopics: ['hemorrhoids', 'anal-fissure'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'SGE'],
    estimatedMinutes: 45,
    hasContent: { concept: true, examPrep: true, textbook: true, retrievalCards: true, cases: true, grindeMap: false },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09'
  },

  // =============================================================================
  // RECTAL PROLAPSE
  // =============================================================================
  {
    id: 'rectal-prolapse',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-colorectal',
    name: 'Rectal Prolapse',
    slug: 'rectal-prolapse',
    description: 'Classification and abdominal/perineal surgical approaches',
    content: {
      concept: `# Rectal Prolapse

## Definition

Rectal prolapse is the protrusion of rectal wall through the anus. It encompasses a spectrum from mucosal prolapse to full-thickness (procidentia).

## Classification

| Type | Description | Layers Involved |
|------|-------------|-----------------|
| **Mucosal prolapse** | Only mucosa prolapses | Mucosa only |
| **Full-thickness (Procidentia)** | All layers of rectal wall | Mucosa + muscle + serosa |
| **Internal (Occult)** | Intussusception that doesn't exit anus | Full thickness, internal |

### External vs Internal
- **External**: Visible prolapse outside anus
- **Internal (Occult intussusception)**: Rectal wall folds inward but doesn't protrude through anus; associated with obstructed defecation

## Distinguishing Features

| Feature | Mucosal Prolapse | Full-Thickness |
|---------|------------------|----------------|
| Folds | Radial | Concentric (circular) |
| Length | Usually <5 cm | Often >5 cm |
| Lumen | Central | Present, anterior |
| Palpation | Thin | Thick (double layer) |
| Sulcus | No sulcus between wall and anal canal | Deep sulcus present |

> 💎 **Concentric rings = Full thickness prolapse** (KEY exam point)

## Epidemiology

- Bimodal distribution: Elderly women (most common) and children
- Female:Male ratio = 6:1 (adults)
- Risk factors:
  - Chronic constipation/straining
  - Multiparity, vaginal delivery
  - Pelvic floor weakness
  - Neurological conditions
  - Prior pelvic surgery
  - Connective tissue disorders

## Pathophysiology

### Anatomical Defects
1. **Deep pouch of Douglas** (cul-de-sac)
2. **Loose attachment of rectum to sacrum**
3. **Weak pelvic floor muscles**
4. **Redundant sigmoid colon**
5. **Weak anal sphincters**

### The Sliding Hernia Theory
- Prolapse is essentially a **sliding hernia** through the levator hiatus
- Often associated with rectocele, cystocele, uterine prolapse

## Clinical Features

### Symptoms
- **Protrusion** during defecation (may need manual reduction)
- **Mucus discharge** and soiling
- **Bleeding** (mucosal trauma)
- **Incontinence** (30-70%) - due to sphincter stretch
- **Constipation/Obstructed defecation** (especially internal prolapse)
- **Tenesmus**

### Examination
1. **Inspection at rest**: May appear normal
2. **Straining/Valsalva**: Ask patient to bear down - prolapse emerges
3. **Character of folds**: Radial vs concentric
4. **Digital exam**: Assess sphincter tone (often weak)
5. **Commode examination**: If not seen on table, examine sitting on commode

### Complications
- **Incarceration** - Cannot reduce prolapse
- **Strangulation** - Vascular compromise (emergency)
- **Ulceration** (solitary rectal ulcer syndrome)
- **Bleeding**

## Investigations

| Test | Purpose |
|------|---------|
| **Defecography** | Visualize prolapse, enterocele, rectocele |
| **MR defecography** | Dynamic pelvic floor imaging |
| **Colonoscopy** | Rule out polyps, cancer, other pathology |
| **Anorectal manometry** | Assess sphincter function |
| **Pudendal nerve latency** | If significant incontinence |

## Treatment

### Conservative
- Address constipation (fiber, stool softeners)
- Pelvic floor exercises (limited efficacy in prolapse)
- Biofeedback
- **Mainly for frail/elderly not fit for surgery**

### Surgical Approaches

#### Abdominal Procedures (Preferred for fit patients)
- **Lower recurrence** (0-5%)
- **Better functional outcomes**
- Higher morbidity than perineal

| Procedure | Description | Notes |
|-----------|-------------|-------|
| **Suture Rectopexy** | Mobilize rectum, suture to sacrum | Simple, no mesh |
| **Mesh Rectopexy** | Posterior mesh fixed to sacrum and rectum | Low recurrence |
| **Ventral Rectopexy** | Mesh on anterior rectal wall to sacral promontory | Laparoscopic, avoids posterior dissection, nerve-sparing |
| **Resection Rectopexy** | Sigmoid resection + rectopexy | For redundant sigmoid, constipation |

> 💎 **Laparoscopic Ventral Mesh Rectopexy (LVMR)** is increasingly preferred - avoids posterior dissection (nerve-sparing) and treats associated enterocele

#### Perineal Procedures (For high-risk patients)
- **Lower morbidity**
- **Higher recurrence** (10-30%)
- Can be done under regional/local anesthesia

| Procedure | Description | Notes |
|-----------|-------------|-------|
| **Altemeier (Perineal proctosigmoidectomy)** | Full-thickness resection from perineum | High recurrence, but good for frail |
| **Delorme** | Mucosal sleeve resection + plication of muscle | For shorter prolapse, mucosal prolapse |
| **Thiersch (wire/suture)** | Encircling suture around anus | Rarely used, high complications |

### Treatment Algorithm
\`\`\`
Rectal Prolapse
    ↓
Fit for surgery?
    ↓
YES → Abdominal approach (laparoscopic preferred)
    ├── Constipation dominant → Resection rectopexy
    ├── Standard → Ventral mesh rectopexy
    └── Frail but can tolerate lap → Suture rectopexy
    
NO (high risk) → Perineal approach
    ├── Full-thickness prolapse → Altemeier
    └── Mucosal/short prolapse → Delorme
\`\`\`

### Specific Procedure Details

#### Ventral Mesh Rectopexy (Laparoscopic)
1. Mobilize anterior rectal wall off vagina/prostate
2. Place mesh on anterior rectum
3. Fix mesh to sacral promontory
4. Peritonalize mesh
- **Advantages**: Avoids posterior dissection, preserves autonomic nerves, treats enterocele
- **Recurrence**: <5%

#### Altemeier Procedure (Perineal Proctosigmoidectomy)
1. Make full-thickness circumferential incision at dentate line
2. Deliver redundant rectosigmoid through anus
3. Resect prolapsed segment
4. Colo-anal anastomosis
5. ± Levatoroplasty
- **Advantages**: No abdominal incision, done under regional anesthesia
- **Recurrence**: 10-15%

#### Delorme Procedure
1. Circumferential mucosal incision at dentate line
2. Strip mucosa off muscular layer
3. Plicate muscle layer (accordion)
4. Anastomose mucosa
- **Best for**: Short (<3-4 cm) prolapse, mucosal prolapse
- **Recurrence**: 15-20%

## Special Populations

### Children
- Usually <3 years old
- Often associated with chronic constipation, diarrhea, cystic fibrosis
- **Treatment**: Conservative first (treat underlying cause)
- 90% resolve by age 6 with conservative measures
- Surgery rarely needed

### Incarcerated/Strangulated Prolapse
- **Emergency**
- Reduce with gentle pressure, osmotic agents (sugar, salt) to reduce edema
- If viable after reduction → urgent surgery
- If gangrenous → perineal proctosigmoidectomy (Altemeier)`,
      keyPoints: [
        'Full-thickness prolapse has CONCENTRIC (circular) folds; mucosal has radial folds',
        'Bimodal: Elderly women (most common) and children',
        'Abdominal procedures have lower recurrence (0-5%) vs perineal (10-30%)',
        'Laparoscopic ventral mesh rectopexy: nerve-sparing, treats enterocele',
        'Altemeier (perineal proctosigmoidectomy): for high-risk/frail patients',
        'Children: conservative treatment first (90% resolve by age 6)',
        'Incarcerated prolapse: reduce with sugar/salt, then surgery'
      ],
      examPrep: {
        summary: `**Rectal Prolapse - Quick Review**

🔄 **Types**:
- Mucosal: Radial folds, <5 cm
- Full-thickness: Concentric folds, >5 cm

✂️ **Surgical Options**:

**Abdominal** (fit patients, low recurrence):
- Ventral mesh rectopexy (LVMR)
- Resection rectopexy (if constipation)

**Perineal** (high-risk, higher recurrence):
- Altemeier (full-thickness resection)
- Delorme (mucosal sleeve)

👶 **Children**: Conservative first (90% resolve)`,
        mnemonics: [
          'Concentric = Complete (full-thickness); Radial = mucosal only',
          'LVMR = "Lap Ventral Mesh Rectopexy" (gold standard for fit patients)',
          'Altemeier = "All the way" (full-thickness perineal resection)'
        ],
        highYield: [
          'Concentric rings = pathognomonic for full-thickness prolapse',
          'Abdominal approach: 0-5% recurrence vs Perineal: 10-30%',
          'Ventral rectopexy avoids posterior dissection (nerve-sparing)',
          'Sugar/salt reduces edema in incarcerated prolapse'
        ],
        commonMCQs: [
          'Fold pattern in full-thickness rectal prolapse: Concentric (circular)',
          'Best procedure for fit patient with rectal prolapse: Laparoscopic ventral mesh rectopexy',
          'Perineal procedure for high-risk patient: Altemeier procedure',
          'Management of rectal prolapse in children: Conservative (90% resolve by age 6)',
          'Emergency treatment for incarcerated prolapse: Reduction with osmotic agents, then surgery'
        ]
      },
      textbookRefs: [
        { textbook: "Shackelford's Surgery", edition: '9th', chapter: 'Chapter 165', chapterTitle: 'Rectal Prolapse' },
        { textbook: 'Bailey & Love', edition: '28th', chapter: 'Chapter 79', chapterTitle: 'Rectal Prolapse' }
      ],
      retrievalCards: [
        { id: 'rp-1', question: 'How do you distinguish full-thickness rectal prolapse from mucosal prolapse?', answer: 'Full-thickness has CONCENTRIC (circular) folds, is usually >5 cm, has a palpable double layer, and a sulcus between prolapse and anal canal. Mucosal prolapse has RADIAL folds, is usually <5 cm, and is thin.', difficulty: 1 },
        { id: 'rp-2', question: 'What is the preferred surgical approach for rectal prolapse in a fit patient?', answer: 'ABDOMINAL APPROACH (laparoscopic preferred) - either ventral mesh rectopexy or resection rectopexy. Lower recurrence rate (0-5%) compared to perineal procedures (10-30%).', difficulty: 2 },
        { id: 'rp-3', question: 'What is laparoscopic ventral mesh rectopexy (LVMR) and its advantages?', answer: 'LVMR involves mobilizing the anterior rectum, placing mesh on the anterior rectal wall, and fixing it to the sacral promontory. Advantages: avoids posterior dissection (nerve-sparing, less constipation), treats associated enterocele, low recurrence (<5%).', difficulty: 2 },
        { id: 'rp-4', question: 'What is the Altemeier procedure?', answer: 'Perineal proctosigmoidectomy: Full-thickness circumferential incision at dentate line, delivery and resection of redundant rectosigmoid through perineum, colo-anal anastomosis. Used for high-risk/frail patients who cannot tolerate abdominal surgery. Recurrence: 10-15%.', difficulty: 2 },
        { id: 'rp-5', question: 'How is rectal prolapse in children managed?', answer: 'CONSERVATIVE management first: treat underlying cause (constipation, diarrhea, cystic fibrosis), stool softeners, toilet training. 90% resolve spontaneously by age 6. Surgery rarely needed.', difficulty: 2 },
        { id: 'rp-6', question: 'How do you manage an incarcerated rectal prolapse?', answer: 'Apply gentle sustained pressure with osmotic agents (granulated sugar, salt) to reduce edema and facilitate reduction. Once reduced, urgent surgical repair is indicated. If gangrenous and irreducible, perform perineal proctosigmoidectomy (Altemeier).', difficulty: 3 }
      ],
      cases: []
    },
    prerequisites: ['colorectal-anatomy'],
    relatedTopics: ['hemorrhoids', 'diverticular-disease'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'SGE'],
    estimatedMinutes: 35,
    hasContent: { concept: true, examPrep: true, textbook: true, retrievalCards: true, cases: false, grindeMap: false },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09'
  },

  // =============================================================================
  // INTESTINAL STOMAS
  // =============================================================================
  {
    id: 'intestinal-stomas',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-colorectal',
    name: 'Colostomy & Ileostomy',
    slug: 'intestinal-stomas',
    description: 'Types, indications, construction, and complications of intestinal stomas',
    content: {
      concept: `# Colostomy & Ileostomy

## Definitions

| Term | Definition |
|------|------------|
| **Stoma** | Surgically created opening of hollow viscus to skin |
| **Colostomy** | Stoma from colon |
| **Ileostomy** | Stoma from ileum |
| **Enterostomy** | Generic term for intestinal stoma |
| **Mucous fistula** | Distal end brought to skin (non-functioning) |

## Classification

### By Duration
| Type | Duration | Examples |
|------|----------|----------|
| **Temporary** | Planned reversal | Defunctioning loop ileostomy |
| **Permanent** | No reversal intended | End colostomy after APR |

### By Construction
| Type | Description | Common Uses |
|------|-------------|-------------|
| **End** | Divided bowel brought out | Hartmann's, APR, proctocolectomy |
| **Loop** | Loop of bowel brought out, opened | Defunctioning in emergencies |
| **Double-barrel** | Both ends brought out separately | Transverse colostomy |

## Ileostomy

### Types

#### End Ileostomy
- Terminal ileum brought out as stoma
- After proctocolectomy, some subtotal colectomies
- **Brooke ileostomy**: Everted, spout-like (2-3 cm protrusion)

#### Loop Ileostomy
- Loop of ileum brought through abdominal wall
- Supporting rod/bridge underneath (removed in 5-10 days)
- **Most common defunctioning stoma**
- Used to protect distal anastomosis (IPAA, low anterior resection)

### Characteristics
| Feature | Ileostomy |
|---------|-----------|
| Output | 500-1500 mL/day (liquid to semi-formed) |
| Effluent | Bile-stained, corrosive to skin |
| Location | Right lower quadrant |
| Spout | 2-3 cm protrusion (Brooke) essential |
| Skin protection | CRITICAL (corrosive effluent) |

> 💎 **Ileostomy MUST have a spout** to direct effluent into bag and protect skin

### Indications
- Proctocolectomy for UC, FAP
- Protection of low anastomosis
- Small bowel obstruction/perforation
- Crohn's disease (temporary or permanent)

## Colostomy

### Types by Location

| Type | Location | Output | Indications |
|------|----------|--------|-------------|
| **Transverse** | Upper abdomen, transverse colon | Liquid to semi-formed | Diversion above distal pathology |
| **Descending/Sigmoid** | Left lower quadrant | Formed | Most common; after APR, Hartmann's |
| **Cecostomy** | Right lower quadrant, cecum | Liquid | Decompression, rarely used |

### Characteristics
| Feature | Colostomy |
|---------|-----------|
| Output | Variable (100-500 mL/day for sigmoid) |
| Effluent | Formed stool (sigmoid), liquid (transverse) |
| Location | Depends on type |
| Spout | Flush with skin (no spout needed) |
| Skin issues | Less than ileostomy |

### End vs Loop Colostomy

| Feature | End Colostomy | Loop Colostomy |
|---------|---------------|----------------|
| Construction | Single barrel | Two openings (proximal functioning, distal non-functioning) |
| Common use | Hartmann's, APR | Emergency diversion |
| Reversal | More difficult (Hartmann's reversal) | Easier |

## Stoma Siting (Preoperative Marking)

### Principles
1. **Through rectus muscle** (prevents parastomal hernia)
2. **Away from scars, skin folds, umbilicus, bony prominences**
3. **Patient should see the site** (able to manage)
4. **Below belt line** but accessible
5. **Test with appliance** in sitting, standing, lying positions

### Typical Locations
- **Ileostomy**: Right lower quadrant (through rectus)
- **Sigmoid colostomy**: Left lower quadrant (through rectus)

> 💎 **Enterostomal therapist** should mark site preoperatively when possible

## Surgical Technique

### End Ileostomy (Brooke)
1. Create circular skin incision
2. Divide subcutaneous fat to fascia
3. Cruciate incision in anterior rectus sheath
4. Split rectus muscle (don't cut)
5. Incise posterior sheath and peritoneum
6. Deliver terminal ileum through defect (admits 2 fingers)
7. Evert ileum to create 2-3 cm spout
8. Suture to skin with interrupted sutures

### Loop Ileostomy
1. Same skin and fascial preparation
2. Deliver loop of ileum with mesentery
3. Pass supporting rod beneath loop
4. Open bowel (usually transverse) on anti-mesenteric border
5. Mature with sutures to skin
6. Remove rod at 5-10 days

## Complications

### Early (<30 days)

| Complication | Description | Management |
|--------------|-------------|------------|
| **High output** | >1500 mL/day (ileostomy) | Loperamide, octreotide, fluid replacement |
| **Retraction** | Stoma recedes below skin | Re-fashion if severe |
| **Ischemia/Necrosis** | Dusky/black stoma | Observe if superficial; revision if deep |
| **Mucocutaneous separation** | Stoma separates from skin | Local wound care, re-suture if needed |
| **Peristomal skin irritation** | Excoriation from effluent | Proper fitting, skin barriers |

### Late (>30 days)

| Complication | Description | Management |
|--------------|-------------|------------|
| **Parastomal hernia** | Most common late complication | Observation, mesh repair, relocation |
| **Prolapse** | Bowel protrudes excessively | Observation, revision |
| **Stenosis** | Narrowing of stoma | Dilation, revision |
| **Retraction** | Stoma recedes | Revision |
| **Fistula** | Track from stoma to skin | Surgical correction |
| **Varices** | In portal hypertension | Treat portal HTN |

### High-Output Stoma
- Defined as **>1500 mL/day** for ileostomy
- Causes: Proximal small bowel stoma, early postop, infection, short bowel
- Consequences: Dehydration, electrolyte imbalance, renal impairment

**Management:**
1. Fluid and electrolyte replacement (oral and IV)
2. Loperamide (start 4mg TDS, increase up to 16mg/day)
3. Codeine phosphate
4. Octreotide (if refractory)
5. PPI (reduces gastric secretion)
6. Dietary modification

## Stoma Reversal

### Timing
- **Loop ileostomy**: Usually 8-12 weeks after index surgery
- **Hartmann's reversal**: 3-6 months (more complex)

### Prerequisites
- Underlying disease resolved/healed
- Anastomosis intact (contrast study if needed)
- Good nutritional status
- No contraindications to surgery

### Loop Ileostomy Reversal
- Can be done through local peristomal incision
- Mobilize stoma, resect stapled edges, re-anastomose
- Lower morbidity than Hartmann's reversal

### Hartmann's Reversal
- Requires laparotomy/laparoscopy
- Mobilize stoma, find rectal stump, re-anastomose
- Significant morbidity (10-20% complications)
- **30-50% never get reversed** (comorbidities, patient preference)

## Special Considerations

### Stoma in Emergency Surgery
- May not have optimal siting
- Higher complication rates
- Consider loop vs end based on situation

### Stoma in Obese Patients
- Higher parastomal hernia risk
- May need longer stoma length
- Careful siting essential

### Stoma in Crohn's Disease
- Higher complication rates
- May need multiple surgeries
- Consider temporary vs permanent carefully`,
      keyPoints: [
        'Ileostomy: 2-3 cm spout essential (Brooke), liquid output, corrosive effluent',
        'Colostomy: flush with skin, formed output (sigmoid), less skin issues',
        'Stoma through rectus muscle prevents parastomal hernia',
        'Loop ileostomy: most common defunctioning stoma',
        'High-output ileostomy: >1500 mL/day, treat with loperamide + fluids',
        'Parastomal hernia: most common late complication',
        'Hartmann\'s reversal: 30-50% never reversed'
      ],
      examPrep: {
        summary: `**Intestinal Stomas - Quick Review**

📍 **Location**:
- Ileostomy: Right lower quadrant
- Sigmoid colostomy: Left lower quadrant

🔄 **Construction**:
- End: Divided bowel (permanent or reversible)
- Loop: Supporting rod, 2 openings (defunctioning)

📊 **Ileostomy vs Colostomy**:
| | Ileostomy | Colostomy |
|--|-----------|-----------|
| Spout | 2-3 cm (essential) | Flush |
| Output | Liquid, 500-1500 mL | Formed, 100-500 mL |
| Skin | More issues | Less issues |

⚠️ **Complications**:
- Early: High output, necrosis, retraction
- Late: Parastomal hernia (most common)`,
        mnemonics: [
          'Ileostomy = "I Love Spouts" (2-3 cm spout essential)',
          'HIGH output = >1500 mL/day = Highly Important to treat',
          'THROUGH rectus = prevents hernia (Through = protect)'
        ],
        highYield: [
          'Ileostomy spout protects skin from corrosive effluent',
          'Loop ileostomy easier to reverse than Hartmann\'s',
          'Preoperative marking by ET nurse reduces complications',
          'Parastomal hernia most common late complication'
        ],
        commonMCQs: [
          'Most important feature of Brooke ileostomy: 2-3 cm spout',
          'Most common late stoma complication: Parastomal hernia',
          'Stoma should be placed through: Rectus abdominis muscle',
          'High-output ileostomy defined as: >1500 mL/day',
          'Most common defunctioning stoma: Loop ileostomy'
        ]
      },
      textbookRefs: [
        { textbook: "Shackelford's Surgery", edition: '9th', chapter: 'Chapter 173', chapterTitle: 'Intestinal Stomas' },
        { textbook: "Maingot's Abdominal Operations", edition: '12th', chapter: 'Chapter 36', chapterTitle: 'Intestinal Stomas' }
      ],
      retrievalCards: [
        { id: 'sto-1', question: 'Why must an ileostomy have a 2-3 cm spout?', answer: 'Ileostomy effluent contains proteolytic enzymes; spout prevents skin contact and excoriation' }
      ],
      cases: []
    },
    prerequisites: ['intestinal-anatomy'],
    relatedTopics: [],
    difficulty: 3,
    highYield: true,
    examTags: ['SGE'],
    estimatedMinutes: 30,
    hasContent: {
      concept: true,
      examPrep: true,
      textbook: true,
      retrievalCards: true,
      cases: false,
      grindeMap: false
    },
    createdAt: '2025-02-09',
    updatedAt: '2025-02-09'
  }
];
