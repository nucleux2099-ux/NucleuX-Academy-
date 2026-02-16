# NucleuX Academy — Content Gap Audit

**Date:** 2026-02-16  
**Auditor:** Narasimha (automated)  
**Method:** Direct file inspection of `~/nucleux-academy/content/`

---

## 1. Content Inventory by Subject

| Subject | _meta files | _index files | Stubs (≤5 lines) | With Content (>5 lines) | NEET-PG Priority |
|---------|------------|-------------|-------------------|------------------------|-----------------|
| **Medicine** | 281 | 14 | 2 | 279 | ⭐ HIGH |
| **Surgery** | 173 | 18 | 89 | 84 | ⭐ HIGH |
| **Anatomy** | 161 | 6 | 0 | 161 | Medium |
| **OB-GYN** | 95 | 12 | 0 | 95 | ⭐ HIGH |
| **Pathology** | 87 | 9 | 0 | 87 | ⭐ HIGH |
| **Physiology** | 86 | 10 | 0 | 86 | Medium |
| **Pediatrics** | 79 | 9 | 0 | 79 | ⭐ HIGH |
| **Biochemistry** | 53 | 8 | 0 | 53 | Low |
| **Microbiology** | 28 | 10 | 0 | 28 | Medium |
| **Pharmacology** | 27 | 9 | 0 | 27 | ⭐ HIGH |
| **Orthopedics** | 24 | 7 | 0 | 24 | Medium |
| **Community Med** | 20 | 6 | 0 | 20 | Medium |
| **Psychiatry** | 19 | 5 | 0 | 19 | Low |
| **Dermatology** | 18 | 4 | 0 | 18 | Low |
| **Forensic Med** | 13 | 7 | 0 | 13 | Medium |
| **Anesthesia** | 10 | 4 | 0 | 10 | Low |
| **Ophthalmology** | 9 | 5 | 0 | 9 | Medium |
| **Prev. Medicine** | 8 | 4 | 0 | 8 | Low |
| **Radiology** | 6 | 3 | 0 | 6 | Low |
| **Dentistry** | 5 | 1 | 0 | 5 | — |
| **ENT** | 4 | 4 | 0 | 4 | Medium |

**Totals:** 1,206 topic _meta files | 1,362 total YAML files (including _index files)

---

## 2. YAML Structure — Three Observed Patterns

### Pattern A: NMC-Enriched (Anatomy, Pharmacology, Physiology, etc.)
```yaml
topic_id: stomach-anatomy
name: Stomach Anatomy
description: Stomach Anatomy — NMC curriculum topic
high_yield: true
nmc_codes:
  - code: AN18.6
    domain: KH
    core: false
    phase: Phase 1
```
- Auto-generated from NMC/CBME competency mapping
- Contains: topic_id, name, description, high_yield flag, nmc_codes with domain/core/phase
- **No teaching content, no MCQs, no learning objectives**

### Pattern B: Surgery Rich (manually authored)
```yaml
topic_id: thyroid-examination
system: 02-head-neck
name: "Thyroid Examination"
nmc_competency: "SU22.1, SU22.2"
sources:
  primary:
    bailey: "Ch 50, pp 805-840"
tags: [clinical-skills, examination, high-yield, neet-pg]
learning_objectives: [...]
estimated_time:
  explorer: 15min
  exam_prep: 20min
prerequisites: [...]
related_topics: [...]
```
- Rich metadata: sources, tags, learning objectives, time estimates, prerequisites
- **Still no actual teaching content or MCQs in the YAML itself**

### Pattern C: Surgery Enriched (with prerequisite/relationship details)
```yaml
title: "Cholecystitis"
slug: cholecystitis
depth: "UG"
highYield: true
nmc_codes: ["SU28.12", "IM5.8"]
enrichment:
  nmcCodes: [{code, text, domain}]
  prerequisite_details: [{slug, reason}]
  related_details: [{slug, reason, relationship}]
```

### Pattern D: Stubs (89 surgery topics)
```yaml
title: Damage Control Surgery
slug: damage-control-surgery
depth: SS
```

---

## 3. Content Depth Analysis

| Content Type | Count | Notes |
|-------------|-------|-------|
| Topics with explorer content | **0** | Explorer mode exists in UI but no content in YAML |
| Topics with exam-prep content | **0** | No exam-prep text in any YAML file |
| Topics with MCQs (in YAML) | **0** | MCQs are NOT stored in content YAML files |
| MCQs in seed file | **5** | `src/lib/data/seed/mcqs.v1.json` — 5 topics × 1 MCQ each |
| Files with teaching text | **~0** | All _meta files are metadata-only (no prose/explanations) |

### MCQ Inventory (Total: 5 questions)
| Topic | MCQs |
|-------|------|
| medicine/pancreas/acute-pancreatitis | 1 |
| medicine/gastroenterology/upper-gi-bleed-variceal | 1 |
| medicine/hepatobiliary/acute-cholangitis | 1 |
| surgery/intestine/intestinal-obstruction | 1 |
| medicine/critical-care/shock-sepsis-first-hour | 1 |

---

## 4. NEET-PG Priority Subject Assessment

| Priority Subject | Topics | Content Quality | Gap Severity |
|-----------------|--------|----------------|-------------|
| **Pathology** | 87 | Metadata only (NMC codes) | 🔴 CRITICAL — No teaching content |
| **Pharmacology** | 27 | Metadata only (NMC codes) | 🔴 CRITICAL — Very few topics + no content |
| **Medicine** | 281 | Metadata only (NMC codes) | 🟡 HIGH — Good topic coverage, no content |
| **Surgery** | 173 (84 enriched, 89 stubs) | Mixed — some enriched with sources/prereqs | 🟡 HIGH — Best metadata but still no teaching content |
| **OB-GYN** | 95 | Metadata only | 🟡 HIGH — Good coverage, no content |
| **Pediatrics** | 79 | Metadata only | 🟡 HIGH — Good coverage, no content |

---

## 5. Curriculum Coverage Map

### Well-Covered (by topic count, not content):
- ✅ **Medicine** (281 topics) — Excellent breadth
- ✅ **Surgery** (173 topics) — Good breadth, best metadata quality
- ✅ **Anatomy** (161 topics) — Complete NMC mapping
- ✅ **OB-GYN** (95 topics) — Solid coverage
- ✅ **Pathology** (87 topics) — Good breadth
- ✅ **Physiology** (86 topics) — Good breadth

### Major Gaps (by topic count):
- ❌ **Pharmacology** — Only 27 topics (should be 80-100+ for NEET-PG)
- ❌ **ENT** — Only 4 topics (should be 25-30)
- ❌ **Ophthalmology** — Only 9 topics (should be 25-30)
- ❌ **Radiology** — Only 6 topics
- ❌ **Dentistry** — Only 5 topics

### Critical Reality Check:
> **Every single topic across all 1,206 files is metadata-only.** There is ZERO teaching content, ZERO explorer content, ZERO exam-prep content in the YAML files. The app has a topic skeleton (NMC competency mapping) but no flesh (actual learning material).

---

## 6. TOP 5 Gaps to Fill for MVP

### Gap 1: 🔴 No Teaching Content Anywhere
**Impact:** CRITICAL  
**What:** All 1,206 topic files contain only metadata (NMC codes, names, tags). No explanations, no teaching text, no clinical pearls.  
**Fix:** Define a content schema (explorer_content, exam_prep_content fields) and start populating high-yield topics. Start with Surgery hepatobiliary (already has rich metadata) as a template.

### Gap 2: 🔴 Only 5 MCQs Total
**Impact:** CRITICAL  
**What:** The entire platform has 5 MCQs in a seed JSON file. For NEET-PG prep, you need 5,000-10,000+.  
**Fix:** Build MCQ generation pipeline. Priority: Pathology (highest NEET-PG weight), Pharmacology, Medicine. Target 10 MCQs per high-yield topic = ~500 MCQs for top 50 topics.

### Gap 3: 🔴 Pharmacology Has Only 27 Topics  
**Impact:** HIGH (Pharmacology = ~15% of NEET-PG)  
**What:** Only 27 topics mapped vs. ~100+ needed. Missing: CNS drugs, CVS drugs, antimicrobials (most), chemotherapy, autonomic pharmacology depth.  
**Fix:** Complete NMC competency mapping for Pharmacology. Use CBME Phase-2 competencies JSON already in `content/cbme/`.

### Gap 4: 🟡 Surgery: 89 Stub Topics (51% are empty shells)
**Impact:** HIGH  
**What:** 89 of 173 surgery topics are 3-line stubs with just title/slug/depth. No NMC codes, no sources, no prerequisites.  
**Fix:** Enrich stubs using the same pipeline that created the cholecystitis-style enrichment. The enriched surgery topics are the best content in the entire app — extend this to all 89 stubs.

### Gap 5: 🟡 ENT + Ophthalmology Severely Under-represented
**Impact:** MEDIUM (Combined ~8-10% of NEET-PG)  
**What:** ENT has 4 topics, Ophthalmology has 9. These are quick-win subjects with well-defined, finite topic lists.  
**Fix:** Add ~25 topics each from NMC competency codes (EN1-EN4, OP1-OP9 series).

---

## 7. Recommended MVP Content Priority

```
Phase 1 (Week 1-2): Content Schema + First 50 Topics
├── Define YAML content schema (explorer, exam_prep, mcqs fields)
├── Populate 10 Surgery hepatobiliary topics (already enriched)
├── Populate 10 Pathology high-yield topics
├── Populate 10 Medicine high-yield topics  
├── Generate 200 MCQs (top 20 topics × 10 each)
└── Pharmacology topic expansion (27 → 60 topics)

Phase 2 (Week 3-4): Scale to 200 Topics
├── Populate remaining NEET-PG priority topics
├── ENT expansion (4 → 25 topics)
├── Ophthalmology expansion (9 → 25 topics)
├── MCQ count to 1,000
└── Enrich 89 surgery stubs

Phase 3 (Month 2): Full Coverage
├── All high-yield topics have teaching content
├── MCQ count to 3,000+
├── Explorer + Exam-prep modes populated
└── Cross-subject integration (anatomy ↔ surgery ↔ pathology)
```

---

## 8. Summary Statistics

| Metric | Value |
|--------|-------|
| Total YAML files | 1,362 |
| Total topic files (_meta) | 1,206 |
| Subjects covered | 21 |
| Topics with teaching content | **0** |
| Topics with explorer content | **0** |
| Topics with exam-prep content | **0** |
| Total MCQs | **5** |
| Surgery stubs (empty shells) | 89 |
| Inconsistent YAML schemas | 3+ patterns |
| CBME competency JSONs available | ✅ (in content/cbme/) |

### Bottom Line
> **NucleuX Academy has an excellent topic skeleton mapped to NMC/CBME competencies, but zero actual learning content.** The metadata infrastructure (1,206 topics, NMC codes, prerequisites, relationships) is solid — especially for Surgery where enrichment has been done. The critical blocker for MVP is populating teaching content and MCQs. Start with the 50 highest-yield NEET-PG topics across Pathology, Pharmacology, Medicine, and Surgery.
