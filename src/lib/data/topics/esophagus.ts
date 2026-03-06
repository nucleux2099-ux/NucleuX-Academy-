/**
 * NucleuX Academy - Esophagus Topics
 * 
 * Imported from Aditya's Study Library vault
 * Source: ~/Library/Mobile Documents/iCloud~md~obsidian/Documents/Aditya's Zettelkasten/
 *         03 Spaces/🎓 Learning/Active System/Study Library/02 - Concept Notes/Esophagus/
 */

import type { LibraryTopic } from '../../types/library';

export const ESOPHAGUS_TOPICS: LibraryTopic[] = [
  // =============================================================================
  // FOUNDATION CONCEPTS
  // =============================================================================
  {
    id: 'esophagus-anatomy',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-esophagus',
    name: 'Esophageal Anatomy',
    slug: 'esophageal-anatomy',
    description: 'Wall layers, blood supply, innervation, and clinical correlations',
    content: {
      concept: `# Esophageal Anatomy

## Overview

The esophagus is a muscular tube approximately **25 cm long** extending from the cricopharyngeus to the cardia of the stomach.

## Key Anatomical Points

### Length & Landmarks
| Landmark | Distance from Incisors |
|----------|----------------------|
| Cricopharyngeus | 15 cm |
| Aortic arch | 23 cm |
| Left bronchus | 27 cm |
| Diaphragmatic hiatus | 38 cm |
| GE junction | 40 cm |

### Wall Layers (INSIDE → OUT)
1. **Mucosa** - Stratified squamous epithelium
2. **Submucosa** - Contains Meissner's plexus
3. **Muscularis propria**
   - Inner circular
   - Outer longitudinal
   - Myenteric (Auerbach's) plexus between layers
4. **Adventitia** - No serosa! (important for surgery)

> 💎 **High Yield**: The esophagus has NO SEROSA — this means:
> - Poor suture holding
> - Rapid spread of infections/tumors
> - Higher anastomotic leak rates

### Muscle Composition
- **Upper 1/3**: Skeletal muscle
- **Middle 1/3**: Mixed
- **Lower 1/3**: Smooth muscle

### Blood Supply
| Segment | Arterial Supply |
|---------|----------------|
| Cervical | Inferior thyroid artery |
| Thoracic | Aortic esophageal branches, bronchial arteries |
| Abdominal | Left gastric, inferior phrenic arteries |

### Venous Drainage
- Submucosal plexus → portal system (left gastric) + systemic (azygos)
- Site of portosystemic anastomosis → esophageal varices

### Lymphatic Drainage
- Skip lesions possible (submucosal lymphatic spread)
- Upper: Cervical nodes
- Middle: Mediastinal nodes
- Lower: Celiac nodes

### Innervation
- **Parasympathetic**: Vagus nerve
- **Sympathetic**: Sympathetic chain
- **Intrinsic**: Myenteric (Auerbach's) and Submucosal (Meissner's) plexuses`,
      keyPoints: [
        'Esophagus is 25 cm long, from cricopharyngeus to cardia',
        'NO SEROSA - affects surgical technique and tumor spread',
        'Upper 1/3 skeletal, middle mixed, lower 1/3 smooth muscle',
        'Submucosal plexus creates portosystemic anastomosis',
        'Myenteric plexus controls peristalsis and LES function'
      ],
      examPrep: {
        summary: `**Esophageal Anatomy - Quick Review**

📏 **Length**: 25 cm (15-40 cm from incisors)

🧱 **Layers**: Mucosa → Submucosa → Muscularis → Adventitia (NO SEROSA!)

💪 **Muscle**: Upper 1/3 skeletal, Middle mixed, Lower 1/3 smooth

🩸 **Blood**: Inferior thyroid → Aortic branches → Left gastric

⚡ **Nerve**: Vagus + Myenteric plexus (Auerbach's)`,
        mnemonics: [
          'SPAM for wall layers: Submucosa, Propria (muscularis), Adventitia, Mucosa (reverse order)',
          '15-23-27-38-40: Cricopharyngeus, Arch, Bronchus, Hiatus, GEJ from incisors'
        ],
        highYield: [
          'No serosa = poor suture holding = leak risk',
          'Submucosal lymphatics allow skip metastases',
          'Left recurrent laryngeal nerve at risk in cervical esophagus'
        ],
        commonMCQs: [
          'Distance of GE junction from incisors: 40 cm',
          'Esophageal muscle in lower 1/3: Smooth muscle',
          'Plexus between muscle layers: Myenteric (Auerbach\'s)'
        ]
      },
      textbookRefs: [
        {
          textbook: 'Shackelford\'s Surgery',
          edition: '9th',
          chapter: 'Chapter 1',
          chapterTitle: 'Anatomy of the Esophagus',
          pages: '1-15'
        },
        {
          textbook: 'Gray\'s Surgical Anatomy',
          edition: '1st',
          chapter: 'Thorax',
          chapterTitle: 'Esophagus'
        }
      ],
      retrievalCards: [
        {
          id: 'ea-1',
          question: 'What is the length of the esophagus?',
          answer: '25 cm (approximately)',
          difficulty: 1
        },
        {
          id: 'ea-2',
          question: 'Why is the esophagus prone to anastomotic leaks?',
          answer: 'No serosa - poor suture holding and tissue strength',
          difficulty: 2
        },
        {
          id: 'ea-3',
          question: 'What type of muscle is in the lower 1/3 of the esophagus?',
          answer: 'Smooth muscle',
          difficulty: 1
        },
        {
          id: 'ea-4',
          question: 'Which plexus is located between the circular and longitudinal muscle layers?',
          answer: 'Myenteric plexus (Auerbach\'s plexus)',
          difficulty: 2
        },
        {
          id: 'ea-5',
          question: 'At what distance from incisors is the GE junction located?',
          answer: '40 cm',
          difficulty: 1
        }
      ],
      cases: [
        {
          id: 'ea-case-1',
          title: 'Post-operative Esophageal Leak',
          presentation: 'A 65-year-old male is post-op day 3 after esophagectomy. He develops fever, tachycardia, and left-sided chest pain. Chest X-ray shows pleural effusion.',
          questions: [
            {
              question: 'What is the most likely diagnosis?',
              answer: 'Anastomotic leak (esophageal leak) - common due to absence of serosa'
            },
            {
              question: 'Why is the esophagus particularly prone to anastomotic leaks?',
              answer: 'The esophagus lacks a serosa, leading to poor suture holding and tissue integrity'
            }
          ],
          keyLearning: [
            'Esophagus has no serosa - higher leak rates than other GI anastomoses',
            'Leaks typically present POD 3-7 with fever, tachycardia, chest pain',
            'Left pleural effusion common due to thoracic location'
          ],
          difficulty: 3
        }
      ]
    },
    prerequisites: [],
    relatedTopics: ['les-physiology', 'esophageal-manometry'],
    difficulty: 2,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'MRCS'],
    estimatedMinutes: 30,
    hasContent: {
      concept: true,
      examPrep: true,
      textbook: true,
      retrievalCards: true,
      cases: true,
      grindeMap: false
    },
    createdAt: '2025-01-07',
    updatedAt: '2025-02-08'
  },

  // =============================================================================
  // ACHALASIA
  // =============================================================================
  {
    id: 'achalasia-cardia',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-esophagus',
    name: 'Achalasia Cardia',
    slug: 'achalasia-cardia',
    description: 'Primary esophageal motility disorder with incomplete LES relaxation and absent peristalsis',
    content: {
      concept: `# Achalasia Cardia: Pathogenesis & Management

## Definition

> Achalasia is a primary esophageal motility disorder characterized by **incomplete LES relaxation** and **absent peristalsis** in the esophageal body, caused by degeneration of inhibitory ganglion cells in the myenteric plexus.

## Pathophysiology

### The Core Problem
\`\`\`
Normal LES Control:
  Excitatory neurons (ACh, Substance P) → Contract
  Inhibitory neurons (NO, VIP) → Relax
  
In Achalasia:
  Loss of inhibitory neurons → 
  Unopposed excitation → 
  LES FAILS TO RELAX
\`\`\`

### Cellular Pathology
- **Loss of inhibitory neurons** in myenteric plexus
- Neurotransmitters affected: Nitric Oxide (NO), VIP
- Remaining excitatory neurons (ACh) → unopposed contraction
- Progressive dilation of esophageal body over time

## Clinical Presentation

### Cardinal Features
1. **Dysphagia** to BOTH solids AND liquids from onset (equal)
2. **Regurgitation** of undigested food
3. **Chest pain** (early disease)
4. **Weight loss** (late disease)

### Red Flags for Pseudoachalasia
- Age > 55 years
- Rapid symptom onset (< 6 months)
- Significant weight loss
- Difficulty passing scope through GEJ

## Diagnosis

### Gold Standard: High-Resolution Manometry (HRM)
| Finding | Description |
|---------|-------------|
| Incomplete LES relaxation | IRP > 15 mmHg |
| Absent peristalsis | 100% failed swallows OR spasm |
| Elevated LES pressure | Often > 45 mmHg |

### Chicago Classification v4.0
| Type | Pattern | Prognosis |
|------|---------|-----------|
| **Type I** | No pressurization | Moderate response |
| **Type II** | Panesophageal pressurization | BEST response (>90%) |
| **Type III** | Spastic contractions | WORST response |

### Imaging
- **Barium swallow**: Bird's beak appearance
- **EGD**: Rule out pseudoachalasia (malignancy)
- **CT**: Exclude mediastinal mass

## Treatment

### Goal
> Disrupt the LES (cannot restore peristalsis)

### Options
| Treatment | Mechanism | Durability |
|-----------|-----------|------------|
| **Pneumatic dilation** | Tear muscle fibers | 70-90% at 5 years |
| **Heller myotomy** | Divide muscle surgically | 85-95% at 10 years |
| **POEM** | Endoscopic myotomy | 90% at 2 years |
| **Botox** | Block ACh release | 6-12 months (palliative) |

### Treatment Selection
\`\`\`
Type I → Any surgical approach works
Type II → Best outcomes with any intervention
Type III → POEM preferred (longer myotomy possible)

Young patient → Heller myotomy (most durable)
Elderly/poor surgical risk → Pneumatic dilation
Failed surgery → POEM
\`\`\`

## Complications
- Aspiration pneumonia
- Esophageal squamous cell carcinoma (0.5-1%/year after 15-20 years)
- Megaesophagus (sigmoid esophagus)`,
      keyPoints: [
        'Loss of inhibitory neurons (NO, VIP) → unopposed LES contraction',
        'Dysphagia to BOTH solids AND liquids equally from onset',
        'HRM is gold standard; shows incomplete LES relaxation + absent peristalsis',
        'Chicago Type II has best treatment response (>90%)',
        'Goal is to disrupt LES - cannot restore peristalsis'
      ],
      examPrep: {
        summary: `**Achalasia - Quick Review**

🔬 **Pathology**: Loss of inhibitory neurons (NO, VIP) in myenteric plexus

🤒 **Presentation**: Dysphagia SOLIDS + LIQUIDS, regurgitation, chest pain

📊 **Diagnosis**: HRM (IRP >15 mmHg, absent peristalsis) + Bird's beak on barium

📋 **Chicago Types**:
- Type I: No pressurization
- Type II: Panesophageal (BEST response)
- Type III: Spastic (WORST response)

💊 **Treatment**: PD, Heller myotomy, POEM (disrupt LES - can't restore peristalsis)`,
        mnemonics: [
          'ACHALASIA: Absent Contractions, High Acidity Leads to Aperistalsis, Sphincter Issues, Aspiration',
          'Type II = Type "Too good" (best outcomes)'
        ],
        highYield: [
          'Dysphagia to solids AND liquids equally from onset (vs cancer: solids first)',
          'Type II achalasia has best treatment outcomes',
          'POEM preferred for Type III (longer myotomy possible)'
        ],
        commonMCQs: [
          'Most common type of achalasia: Type II',
          'Best prognosis: Type II',
          'Gold standard diagnosis: High-resolution manometry',
          'Barium finding: Bird\'s beak appearance'
        ]
      },
      textbookRefs: [
        {
          textbook: 'Shackelford\'s Surgery',
          edition: '9th',
          chapter: 'Chapter 19',
          chapterTitle: 'Achalasia',
          pages: '250-275'
        },
        {
          textbook: 'Shackelford\'s Surgery',
          edition: '9th',
          chapter: 'Chapter 2',
          chapterTitle: 'Esophageal Motility Diagnosis'
        }
      ],
      retrievalCards: [
        {
          id: 'ach-1',
          question: 'What is the pathophysiological basis of achalasia?',
          answer: 'Loss of inhibitory neurons (NO, VIP) in myenteric plexus → unopposed LES contraction',
          difficulty: 2
        },
        {
          id: 'ach-2',
          question: 'How does dysphagia in achalasia differ from esophageal cancer?',
          answer: 'Achalasia: Solids AND liquids equally from onset. Cancer: Solids first, then liquids (progressive)',
          difficulty: 3
        },
        {
          id: 'ach-3',
          question: 'Which Chicago classification type has the best treatment response?',
          answer: 'Type II (panesophageal pressurization) - >90% response rate',
          difficulty: 2
        },
        {
          id: 'ach-4',
          question: 'What is the gold standard for diagnosing achalasia?',
          answer: 'High-resolution manometry (HRM)',
          difficulty: 1
        },
        {
          id: 'ach-5',
          question: 'What is the classic barium swallow finding in achalasia?',
          answer: 'Bird\'s beak appearance (smooth tapering at GEJ)',
          difficulty: 1
        },
        {
          id: 'ach-6',
          question: 'Why is POEM preferred for Type III achalasia?',
          answer: 'Allows longer myotomy to address spastic contractions in the esophageal body',
          difficulty: 4
        },
        {
          id: 'ach-7',
          question: 'What is the long-term cancer risk in untreated achalasia?',
          answer: '0.5-1% annual risk of squamous cell carcinoma after 15-20 years',
          difficulty: 3
        }
      ],
      cases: [
        {
          id: 'ach-case-1',
          title: 'New Diagnosis Achalasia',
          presentation: 'A 35-year-old woman presents with 2-year history of dysphagia to solids and liquids, regurgitation of undigested food, and 5 kg weight loss. She reports food "sticking" in her chest and occasional nocturnal coughing.',
          questions: [
            {
              question: 'What is the most likely diagnosis?',
              answer: 'Achalasia cardia - dysphagia to both solids AND liquids from onset with regurgitation is classic'
            },
            {
              question: 'What investigation would you order first?',
              answer: 'Upper GI endoscopy to rule out mechanical obstruction/malignancy, then HRM for confirmation'
            },
            {
              question: 'HRM shows IRP 22 mmHg with panesophageal pressurization. What is the Chicago classification?',
              answer: 'Type II achalasia (incomplete relaxation + panesophageal pressurization)'
            },
            {
              question: 'What treatment would you recommend?',
              answer: 'Type II has excellent response to all interventions. For a young patient, Heller myotomy offers best long-term durability (85-95% at 10 years)'
            }
          ],
          keyLearning: [
            'Dysphagia to solids AND liquids equally from onset = think achalasia',
            'Always scope to rule out pseudoachalasia (malignancy)',
            'Type II has best prognosis with any treatment modality',
            'Young patients benefit from Heller myotomy (most durable)'
          ],
          difficulty: 3
        }
      ]
    },
    prerequisites: ['esophagus-anatomy', 'les-physiology', 'esophageal-manometry'],
    relatedTopics: ['heller-myotomy', 'poem-procedure', 'esophageal-motility-disorders'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'MRCS', 'DNB'],
    estimatedMinutes: 45,
    hasContent: {
      concept: true,
      examPrep: true,
      textbook: true,
      retrievalCards: true,
      cases: true,
      grindeMap: true
    },
    createdAt: '2025-01-07',
    updatedAt: '2025-02-08'
  },

  // =============================================================================
  // GERD
  // =============================================================================
  {
    id: 'gerd',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-esophagus',
    name: 'GERD - Gastroesophageal Reflux Disease',
    slug: 'gerd',
    description: 'Pathophysiology, diagnosis, and management of gastroesophageal reflux',
    content: {
      concept: `# GERD - Gastroesophageal Reflux Disease

## Definition

> GERD results from excessive esophageal acid exposure (>4% time pH <4) primarily due to transient LES relaxations (TLESRs).

## Anti-Reflux Barrier

### Four Components
1. **Intrinsic LES** - Tonically contracted smooth muscle (10-30 mmHg)
2. **Crural diaphragm** - External sphincter, augments LES during inspiration
3. **Intra-abdominal esophagus** - 1-2 cm below diaphragm (positive pressure)
4. **Angle of His** - Acute cardioesophageal angle (mucosal flap valve)

### When the Barrier Fails
\`\`\`
Primary Mechanism: Transient LES Relaxations (TLESRs)
  - Account for 70-80% of reflux episodes
  - Triggered by gastric distension
  - NOT the same as low resting LES pressure

Secondary Factors:
  - Hiatal hernia (disrupts crural diaphragm)
  - Low LES pressure (<10 mmHg)
  - Impaired esophageal clearance
  - Delayed gastric emptying
\`\`\`

## Clinical Presentation

### Typical Symptoms
- **Heartburn** - Retrosternal burning, worse postprandial/supine
- **Regurgitation** - Effortless return of gastric contents

### Atypical/Extraesophageal
- Chronic cough
- Laryngitis/hoarseness
- Asthma exacerbation
- Dental erosions
- Non-cardiac chest pain

## Diagnosis

### Clinical Diagnosis
- Typical symptoms + PPI response = Presumptive GERD

### Objective Testing
| Test | Indication |
|------|------------|
| **EGD** | Alarm symptoms, refractory GERD, preoperative |
| **pH monitoring** | Refractory GERD, atypical symptoms, pre-fundoplication |
| **Manometry** | Pre-fundoplication (rule out motility disorder) |

### DeMeester Score
- pH <4 for >4% of time = Abnormal
- DeMeester score >14.72 = Pathological reflux

## Treatment

### Medical Management (Step-Up)
1. **Lifestyle**: Weight loss, elevate HOB, avoid trigger foods, no eating before bed
2. **Antacids/H2 blockers**: Mild symptoms
3. **PPIs**: Standard dose x 8 weeks → if refractory, double dose

### Surgical Indications
- Refractory to medical therapy
- Patient preference (avoid lifelong PPIs)
- Large hiatal hernia
- Severe erosive esophagitis/Barrett's

### Fundoplication Options
| Type | Wrap | Best For |
|------|------|----------|
| **Nissen** | 360° (complete) | Normal motility |
| **Toupet** | 270° (posterior partial) | Weak motility |
| **Dor** | 180° (anterior partial) | Post-Heller myotomy |`,
      keyPoints: [
        'TLESRs cause 70-80% of reflux episodes (not low LES pressure)',
        'Four components of anti-reflux barrier: LES, crural diaphragm, intra-abdominal esophagus, angle of His',
        'DeMeester score >14.72 = pathological reflux',
        'Pre-fundoplication workup: EGD + pH monitoring + manometry',
        'Nissen (360°) for normal motility, Toupet (270°) for weak motility'
      ],
      examPrep: {
        summary: `**GERD - Quick Review**

🔒 **Barrier**: LES + Crural diaphragm + Intra-abdominal esophagus + Angle of His

⚡ **Main mechanism**: TLESRs (70-80%), NOT low LES pressure

📊 **Diagnosis**: pH <4 for >4% time; DeMeester >14.72

💊 **Medical**: Lifestyle → H2 blockers → PPIs

🔪 **Surgery**: Nissen 360° (normal motility), Toupet 270° (weak motility)`,
        mnemonics: [
          'GERD barrier = LCIA: LES, Crural diaphragm, Intra-abdominal esophagus, Angle of His',
          '4% and 4: pH <4 for >4% of time is abnormal'
        ],
        highYield: [
          'TLESRs, not low LES pressure, cause most reflux',
          'Manometry before fundoplication to rule out motility disorder',
          'Nissen (360°) can worsen dysphagia in weak motility'
        ],
        commonMCQs: [
          'Main mechanism of GERD: Transient LES relaxations',
          'DeMeester score cutoff: >14.72',
          'Fundoplication for weak motility: Toupet (270° posterior)'
        ]
      },
      textbookRefs: [
        {
          textbook: 'Shackelford\'s Surgery',
          edition: '9th',
          chapter: 'Chapters 7-10',
          chapterTitle: 'GERD and Antireflux Procedures'
        }
      ],
      retrievalCards: [
        {
          id: 'gerd-1',
          question: 'What is the main mechanism causing GERD?',
          answer: 'Transient LES relaxations (TLESRs) - account for 70-80% of reflux episodes',
          difficulty: 2
        },
        {
          id: 'gerd-2',
          question: 'What are the 4 components of the anti-reflux barrier?',
          answer: '1) Intrinsic LES, 2) Crural diaphragm, 3) Intra-abdominal esophagus, 4) Angle of His',
          difficulty: 2
        },
        {
          id: 'gerd-3',
          question: 'What DeMeester score indicates pathological reflux?',
          answer: '>14.72',
          difficulty: 2
        },
        {
          id: 'gerd-4',
          question: 'Which fundoplication is preferred for patients with weak esophageal motility?',
          answer: 'Toupet (270° posterior partial) - less dysphagia risk than Nissen',
          difficulty: 3
        },
        {
          id: 'gerd-5',
          question: 'What workup is required before fundoplication?',
          answer: 'EGD (anatomy) + pH monitoring (confirm reflux) + Manometry (rule out motility disorder)',
          difficulty: 3
        }
      ],
      cases: [
        {
          id: 'gerd-case-1',
          title: 'Refractory GERD',
          presentation: 'A 45-year-old obese male with 5-year history of heartburn and regurgitation. Despite omeprazole 40mg BID, he has persistent symptoms. EGD shows Los Angeles Grade C esophagitis and a 3cm hiatal hernia.',
          questions: [
            {
              question: 'What additional testing is needed before considering surgery?',
              answer: 'pH monitoring (off PPI) to confirm pathological reflux, and manometry to assess esophageal motility'
            },
            {
              question: 'Manometry shows normal peristalsis with 85% effective swallows. What fundoplication would you recommend?',
              answer: 'Nissen fundoplication (360°) - appropriate for normal motility. Also repair the hiatal hernia.'
            }
          ],
          keyLearning: [
            'Objective testing (pH + manometry) needed before fundoplication',
            'Hiatal hernia disrupts crural diaphragm contribution to barrier',
            'Normal motility = Nissen (360°) appropriate'
          ],
          difficulty: 3
        }
      ]
    },
    prerequisites: ['esophagus-anatomy', 'les-physiology'],
    relatedTopics: ['fundoplication', 'hiatal-hernia', 'barretts-esophagus'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'MRCS'],
    estimatedMinutes: 40,
    hasContent: {
      concept: true,
      examPrep: true,
      textbook: true,
      retrievalCards: true,
      cases: true,
      grindeMap: true
    },
    createdAt: '2025-01-08',
    updatedAt: '2025-02-08'
  },

  // Additional placeholder topics (to be expanded)
  {
    id: 'les-physiology',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-esophagus',
    name: 'LES Physiology',
    slug: 'les-physiology',
    description: 'Lower esophageal sphincter function, neural control, and TLESRs',
    content: {
      concept: '# LES Physiology\n\nContent pending import from vault...',
      keyPoints: ['Dual sphincter: intrinsic LES + crural diaphragm', 'TLESRs are the main cause of reflux', 'Resting pressure 10-30 mmHg'],
      textbookRefs: [{ textbook: 'Shackelford', chapter: 'Ch 1, 7' }],
      retrievalCards: [],
      cases: []
    },
    prerequisites: ['esophagus-anatomy'],
    relatedTopics: ['gerd', 'achalasia-cardia'],
    difficulty: 2,
    highYield: true,
    examTags: ['NEET_PG'],
    estimatedMinutes: 20,
    hasContent: { concept: true, examPrep: false, textbook: true, retrievalCards: false, cases: false, grindeMap: false },
    createdAt: '2025-01-07',
    updatedAt: '2025-02-08'
  },
  {
    id: 'esophageal-manometry',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-esophagus',
    name: 'Esophageal Manometry',
    slug: 'esophageal-manometry',
    description: 'High-resolution manometry technique and Chicago Classification',
    content: {
      concept: '# Esophageal Manometry\n\nContent pending import from vault...',
      keyPoints: ['HRM is gold standard for motility assessment', 'Chicago Classification v4.0 for diagnosis', 'IRP >15 mmHg = incomplete LES relaxation'],
      textbookRefs: [{ textbook: 'Shackelford', chapter: 'Ch 2' }],
      retrievalCards: [],
      cases: []
    },
    prerequisites: ['esophagus-anatomy', 'les-physiology'],
    relatedTopics: ['achalasia-cardia', 'esophageal-motility-disorders'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'MRCS'],
    estimatedMinutes: 30,
    hasContent: { concept: true, examPrep: false, textbook: true, retrievalCards: false, cases: false, grindeMap: false },
    createdAt: '2025-01-07',
    updatedAt: '2025-02-08'
  },
  {
    id: 'heller-myotomy',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-esophagus',
    name: 'Heller Myotomy',
    slug: 'heller-myotomy',
    description: 'Surgical technique for achalasia treatment',
    content: {
      concept: '# Heller Myotomy\n\nContent pending import from vault...',
      keyPoints: ['Laparoscopic approach preferred', 'Myotomy extends 6cm on esophagus, 2cm on stomach', 'Partial fundoplication added to prevent reflux'],
      textbookRefs: [{ textbook: 'Shackelford', chapter: 'Ch 20' }],
      retrievalCards: [],
      cases: []
    },
    prerequisites: ['achalasia-cardia'],
    relatedTopics: ['poem-procedure', 'fundoplication'],
    difficulty: 4,
    highYield: true,
    examTags: ['NEET_PG', 'MRCS', 'DNB'],
    estimatedMinutes: 35,
    hasContent: { concept: true, examPrep: false, textbook: true, retrievalCards: false, cases: false, grindeMap: false },
    createdAt: '2025-01-08',
    updatedAt: '2025-02-08'
  },
  {
    id: 'poem-procedure',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-esophagus',
    name: 'POEM Procedure',
    slug: 'poem-procedure',
    description: 'Peroral Endoscopic Myotomy for achalasia',
    content: {
      concept: '# POEM Procedure\n\nContent pending import from vault...',
      keyPoints: ['Endoscopic alternative to Heller myotomy', 'Preferred for Type III achalasia (longer myotomy)', 'Higher reflux rates than Heller + fundoplication'],
      textbookRefs: [{ textbook: 'Shackelford', chapter: 'Ch 21' }],
      retrievalCards: [],
      cases: []
    },
    prerequisites: ['achalasia-cardia', 'esophageal-manometry'],
    relatedTopics: ['heller-myotomy'],
    difficulty: 4,
    highYield: true,
    examTags: ['NEET_PG'],
    estimatedMinutes: 30,
    hasContent: { concept: true, examPrep: false, textbook: true, retrievalCards: false, cases: false, grindeMap: false },
    createdAt: '2025-01-08',
    updatedAt: '2025-02-08'
  },
  {
    id: 'fundoplication',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-esophagus',
    name: 'Fundoplication',
    slug: 'fundoplication',
    description: 'Antireflux procedures: Nissen, Toupet, and Dor',
    content: {
      concept: '# Fundoplication\n\nContent pending import from vault...',
      keyPoints: ['Nissen: 360° for normal motility', 'Toupet: 270° posterior for weak motility', 'Dor: 180° anterior after Heller myotomy'],
      textbookRefs: [{ textbook: 'Shackelford', chapter: 'Ch 10' }],
      retrievalCards: [],
      cases: []
    },
    prerequisites: ['gerd', 'esophagus-anatomy'],
    relatedTopics: ['hiatal-hernia'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE', 'MRCS'],
    estimatedMinutes: 35,
    hasContent: { concept: true, examPrep: false, textbook: true, retrievalCards: false, cases: false, grindeMap: false },
    createdAt: '2025-01-08',
    updatedAt: '2025-02-08'
  },
  {
    id: 'zenker-diverticulum',
    subjectId: 'surgery',
    subspecialtyId: 'surgery-esophagus',
    name: 'Zenker Diverticulum',
    slug: 'zenker-diverticulum',
    description: 'Pharyngoesophageal pulsion diverticulum',
    content: {
      concept: '# Zenker Diverticulum\n\nContent pending import from vault...',
      keyPoints: ['Pulsion diverticulum through Killian dehiscence', 'Elderly patients with dysphagia, regurgitation, halitosis', 'Treatment: cricopharyngeal myotomy + diverticulectomy'],
      textbookRefs: [{ textbook: 'Shackelford', chapter: 'Ch 18' }],
      retrievalCards: [],
      cases: []
    },
    prerequisites: ['esophagus-anatomy'],
    relatedTopics: ['esophageal-motility-disorders'],
    difficulty: 3,
    highYield: true,
    examTags: ['NEET_PG', 'USMLE'],
    estimatedMinutes: 25,
    hasContent: { concept: true, examPrep: false, textbook: true, retrievalCards: false, cases: false, grindeMap: false },
    createdAt: '2025-01-08',
    updatedAt: '2025-02-08'
  },
];

export function getEsophagusTopics(): LibraryTopic[] {
  return ESOPHAGUS_TOPICS;
}

export function getTopicBySlug(slug: string): LibraryTopic | undefined {
  return ESOPHAGUS_TOPICS.find(t => t.slug === slug);
}

export function getTopicById(id: string): LibraryTopic | undefined {
  return ESOPHAGUS_TOPICS.find(t => t.id === id);
}
