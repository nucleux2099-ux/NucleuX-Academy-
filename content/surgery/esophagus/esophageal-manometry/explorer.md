---
title: "Esophageal Manometry"
aliases: ["HRM", "High Resolution Manometry", "Chicago Classification"]
created: 2025-01-08
updated: 2025-01-09
topic: "Esophagus"
system: "Alimentary Tract"
source_book: "Shackelford"
source_chapters: [2]
blumgart_chapters: []
priority: "high"
study_phase: "shoot"
mastery_level: 0
last_reviewed: 2025-01-09
next_review: 2025-01-12
retrieval_score: 0
has_grinde_map: true
has_retrieval_cards: true
has_case_scenario: false
concept_tier: 2
linked_concepts:
  prerequisite: ["Esophageal Anatomy", "LES Physiology"]
  related: []
  leads_to: ["Achalasia Cardia", "Esophageal Motility Disorders"]
  procedures: ["Heller Myotomy Technique", "POEM Procedure", "Fundoplication"]
clinical_relevance:
  presentations: ["dysphagia", "chest pain", "pre-operative evaluation"]
  procedures: ["pre-fundoplication workup", "achalasia diagnosis"]
tags:
  - concept
  - esophagus
  - diagnostics
  - manometry
  - motility
  - tier-2
---

# Esophageal Manometry & Chicago Classification

> **Source**: Shackelford Ch 2 - *Esophageal Motility: Techniques Used for the Diagnosis of Esophageal Motility Disorders*
> **Topic System**: [[Esophagus Index]]
> **Phase**: Shoot
> **Tier**: 2 (Diagnostic)

---

## Core Concepts

> [!summary] One-liner
> High-resolution manometry (HRM) is the gold standard for diagnosing esophageal motility disorders, measuring LES relaxation (IRP) and peristaltic function, classified using the Chicago Classification v4.0 hierarchical algorithm.

---

## Indications for Manometry

### Primary Indications

| Indication | Rationale |
|------------|-----------|
| **Dysphagia with normal EGD** | Rule out motility disorder |
| **Pre-fundoplication** | Ensure adequate peristalsis |
| **Suspected achalasia** | Gold standard diagnosis |
| **Refractory GERD** | Assess LES function |
| **Non-cardiac chest pain** | Spastic disorders |
| **Post-operative dysphagia** | Assess surgical result |

### When NOT to Do Manometry

- Active esophagitis (wait for healing)
- Esophageal obstruction (can't pass catheter)
- Recent surgery on esophagus
- Severe coagulopathy

---

## High-Resolution Manometry (HRM)

### Equipment

```
    HRM CATHETER DESIGN
    ═══════════════════

    ┌────────────────────────────────────┐
    │                                    │
    │   36 circumferential sensors       │
    │   spaced 1 cm apart                │
    │                                    │
    │   ┌─●─●─●─●─●─●─●─●─●─●─●─●─┐      │
    │   │                         │      │
    │   │    Pressure-sensing     │      │
    │   │    segments             │      │
    │   │                         │      │
    │   └─────────────────────────┘      │
    │                                    │
    │   Spans: Pharynx → Stomach         │
    │   (entire esophagus + both         │
    │    sphincters captured)            │
    │                                    │
    └────────────────────────────────────┘
```

### Procedure

1. **Patient preparation**: NPO 6 hours, stop prokinetics/PPIs
2. **Catheter insertion**: Transnasal, positioned with tip in stomach
3. **Baseline recording**: 30 seconds at rest (LES pressure)
4. **Swallows**: 10 wet swallows (5 mL water), 30 seconds apart
5. **Analysis**: Software generates topographic plots

### HRM Display (Esophageal Pressure Topography)

```
    HRM TOPOGRAPHIC PLOT
    ═══════════════════

    Color scale: Blue (low) → Red (high pressure)

    Pharynx ─────────────────────────────
    UES     ████████████████████████████  ← High pressure (relaxes with swallow)
            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    Esoph   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  ← Peristaltic wave
    body    ░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░░     (sweeps down)
            ░░░░░░░░░░▒▒▒▒▒▒▒▒▒▒▒▒▒░░░░░
    LES     ████████████████████████████  ← High pressure baseline
            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← Relaxes (window)
    Stomach ░░░░░░░░░░░░░░░░░░░░░░░░░░░░

            ←─────── Time ───────→
```

---

## Key HRM Metrics

### LES Metrics

| Metric | Definition | Normal | Abnormal |
|--------|------------|--------|----------|
| **Basal LES pressure** | Resting pressure above gastric | 10-30 mmHg | <10 (GERD), >45 (hypertensive) |
| **IRP (Integrated Relaxation Pressure)** | Mean of lowest 4 seconds in relaxation window | **<15 mmHg** | **>15 mmHg** (impaired relaxation) |
| **LES length** | Total sphincter length | 3-4 cm | <2 cm (defective) |

> [!tip] IRP is Key
> **IRP >15 mmHg** = Impaired LES relaxation = Think **achalasia** or EGJ outflow obstruction

### Peristaltic Metrics

| Metric | Definition | Normal |
|--------|------------|--------|
| **DCI (Distal Contractile Integral)** | Vigor of contraction (amplitude × duration × length) | 450-8000 mmHg·cm·s |
| **DL (Distal Latency)** | Time from UES relaxation to contraction front | >4.5 seconds |
| **Peristaltic breaks** | Gaps in contraction wave | <5 cm |

| DCI Value | Interpretation |
|-----------|----------------|
| <100 | Failed/absent contraction |
| 100-450 | Weak contraction |
| 450-8000 | Normal |
| >8000 | Hypercontractile (jackhammer) |

---

## Chicago Classification v4.0

### Hierarchical Algorithm

```
    CHICAGO CLASSIFICATION v4.0 ALGORITHM
    ══════════════════════════════════════

    Step 1: Assess IRP (LES relaxation)
            │
            ├── IRP >15 mmHg ────────────► DISORDERS OF EGJ OUTFLOW
            │                              │
            │                              ├── + 100% failed peristalsis
            │                              │   └── ACHALASIA (I, II, III)
            │                              │
            │                              └── + Some preserved peristalsis
            │                                  └── EGJ OUTFLOW OBSTRUCTION
            │
            └── IRP ≤15 mmHg ────────────► Step 2: Assess Peristalsis
                                           │
                    ┌──────────────────────┴────────────────────┐
                    ▼                                           ▼
            100% failed peristalsis                    Some peristalsis
                    │                                           │
                    ▼                                           ▼
            ABSENT CONTRACTILITY                    Step 3: Assess vigor
                                                            │
                                    ┌───────────────────────┴─────────────────────┐
                                    ▼                                             ▼
                            >70% ineffective                              ≤70% ineffective
                                    │                                             │
                                    ▼                                             ▼
                            INEFFECTIVE                                   Step 4: Check DL
                            ESOPHAGEAL MOTILITY                                   │
                                                                    ┌─────────────┴─────────────┐
                                                                    ▼                           ▼
                                                            DL <4.5s (>20%)           DL normal
                                                                    │                           │
                                                                    ▼                           ▼
                                                            DISTAL ESOPHAGEAL            NORMAL or
                                                            SPASM                        HYPERCONTRACTILE
```

### Major Disorders of Peristalsis

#### 1. Achalasia (IRP >15 + 100% Failed)

| Subtype | Definition | Prevalence | Prognosis |
|---------|------------|------------|-----------|
| **Type I** | No esophageal pressurization | 20-40% | Good |
| **Type II** | Panesophageal pressurization ≥20% swallows | 50-70% | **Best** |
| **Type III** | ≥20% premature (spastic) contractions (DL <4.5s) | 10-15% | **Worst** |

#### 2. EGJ Outflow Obstruction (EGJOO)

- IRP >15 mmHg
- Some preserved peristalsis (not 100% failed)
- **Must exclude mechanical obstruction** (EUS, CT)
- May be early achalasia, opioid effect, or idiopathic

#### 3. Absent Contractility

- IRP normal (≤15 mmHg)
- 100% failed peristalsis
- **Common in scleroderma** (also has low LES pressure)

#### 4. Distal Esophageal Spasm (DES)

- IRP normal
- >20% premature contractions (DL <4.5s)
- DCI >450 (not failed)

#### 5. Hypercontractile Esophagus (Jackhammer)

- IRP normal
- >20% swallows with DCI >8000 mmHg·cm·s
- Extreme contractile vigor

---

## Pattern Recognition

### Achalasia Types on HRM

```
    ACHALASIA TYPE I              ACHALASIA TYPE II            ACHALASIA TYPE III
    (Absent contractility)        (Panesophageal pressure)     (Spastic)

    ░░░░░░░░░░░░░░░░░░░          ████████████████████          ~~~~≈≈≈≈~~~~
    ░░░░░░░░░░░░░░░░░░░          ████████████████████          ≈≈≈≈~~~~≈≈≈≈
    ░░░░░░░░░░░░░░░░░░░          ████████████████████          ~~~~≈≈≈≈~~~~
    ████████████████████          ████████████████████          ████████████████████
    ████████████████████          ████████████████████          ████████████████████
    (No relaxation)               (No relaxation)               (No relaxation)

    Features:                     Features:                     Features:
    • IRP >15                     • IRP >15                     • IRP >15
    • 100% failed                 • 100% failed                 • 100% failed
    • No pressurization           • Uniform pressure ≥20%       • DL <4.5s ≥20%
    • Quiet esophageal body       • Compression pattern         • Spastic waves
```

### Other Patterns

```
    ABSENT CONTRACTILITY         DISTAL ESOPHAGEAL SPASM       JACKHAMMER
    (Scleroderma pattern)        (DES)                         (Hypercontractile)

    ░░░░░░░░░░░░░░░░░░░          ~~~~≈≈≈≈≈≈≈≈≈≈≈≈              ████████████████
    ░░░░░░░░░░░░░░░░░░░          ≈≈≈≈~~~~≈≈≈≈≈≈≈≈              ████████████████
    ░░░░░░░░░░░░░░░░░░░          ~~~~≈≈≈≈≈≈≈≈≈≈≈≈              ████████████████
    ░░░░░░░░░░░░░░░░░░░          ░░░░░░░░░░░░░░░░░░░            ░░░░░░░░░░░░░░░░
    (LES relaxes normally)       (LES relaxes normally)        (LES relaxes normally)

    Features:                    Features:                     Features:
    • IRP ≤15 (normal)           • IRP ≤15 (normal)            • IRP ≤15 (normal)
    • 100% failed                • >20% premature (DL<4.5s)    • >20% with DCI >8000
    • LES often low              • Normal DCI                  • Extreme vigor
    • Scleroderma, CREST         • Chest pain common           • Chest pain, dysphagia
```

---

## Pre-operative Manometry

### Before Anti-Reflux Surgery

| Finding | Implication |
|---------|-------------|
| **Normal peristalsis** | Standard fundoplication (Nissen 360° okay) |
| **Ineffective motility (>70% ineffective)** | Consider partial wrap (Toupet/Dor) |
| **Absent contractility** | Partial wrap mandatory; caution with surgery |
| **Achalasia** | Do NOT perform fundoplication alone; needs myotomy |
| **EGJOO** | Evaluate further; may be early achalasia |

---

## Adjunctive Tests

### Timed Barium Esophagram (TBE)

- Patient drinks barium, measured at 1, 2, 5 minutes
- Assesses **esophageal emptying**
- Used for achalasia follow-up after treatment

### EndoFLIP (Functional Lumen Imaging Probe)

- Measures **GEJ distensibility**
- Distensibility Index (DI) = CSA / pressure
- DI <2.8 mm²/mmHg = impaired relaxation
- Used intraoperatively to assess myotomy adequacy

---

## Connections

### Links to Other Concepts

- **Prerequisite**: [[Esophageal Anatomy]], [[LES Physiology]]
- **Leads to diagnosis of**: [[03 Spaces/🔬 Active Projects/Learning Modules/Learning System/Study Library/02 - Concept Notes/Esophagus/Achalasia Cardia]], [[GERD]], [[Esophageal Motility Disorders]]
- **Informs surgery**: [[Heller Myotomy Technique]], [[Fundoplication]], [[POEM Procedure]]

---

## Quick Recall Questions

1. Q: What IRP value indicates impaired LES relaxation?
   A: IRP >15 mmHg

2. Q: What distinguishes Achalasia Type II from Type I?
   A: Type II has panesophageal pressurization in ≥20% of swallows; Type I has no pressurization

3. Q: What is the DCI cutoff for a failed contraction?
   A: DCI <100 mmHg·cm·s = failed; 100-450 = weak; 450-8000 = normal; >8000 = hypercontractile

4. Q: Why is manometry important before fundoplication?
   A: To ensure adequate peristalsis (weak peristalsis needs partial wrap) and to exclude achalasia (which needs myotomy, not fundoplication)

---

## References

- Shackelford Ch 2: *Esophageal Motility: Techniques Used for the Diagnosis of Esophageal Motility Disorders*
- Chicago Classification v4.0 (Yadlapati R et al., Neurogastroenterol Motil 2021)

---

*VPReFRE Checklist:*
- [x] **V**isual: HRM patterns illustrated
- [x] **P**rocessed: In own words
- [x] **Re**lational: Connected to clinical disorders
- [x] **R**eflective: Practical applications
- [x] **E**fficient: Algorithm-focused
