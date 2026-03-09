# NucleuX Academy - Library Structure

> **Created:** 2026-02-09
> **Based on:** ATOM's Atomic Principle
> **Purpose:** Comprehensive concept structure for all subjects

---

## Core Philosophy (from ATOM)

1. **Atomic Principle:** Complex topics decompose into simpler fundamental concepts
2. **Connections Matter:** Understanding emerges from relationships, not isolated facts
3. **Rebuild from Fundamentals:** True mastery means reconstructing knowledge from first principles

---

## Content Structure per Topic

Each topic should have:

```
topic-name/
├── concept.md          # Core atomic concept
├── exam-prep.md        # High-yield summary, mnemonics, MCQ points
├── textbook.md         # Comprehensive notes (for SS residents)
├── retrieval-cards.json # Spaced repetition flashcards
├── clinical-cases/     # Case-based learning
└── connections.md      # Links to related concepts
```

### Concept Note Template

```markdown
# [Topic Name]

> 📚 **Sources:** [Textbook, Chapter, Pages]
> **Level:** UG | PG | SS

## 1. Core Concept (The Atom)
[One paragraph that captures the essence]

## 2. Key Points
- Point 1
- Point 2
- Point 3

## 3. Detailed Content
[Structured content with tables, diagrams descriptions]

## 4. Clinical Relevance
[Why this matters in practice]

## 5. Connections
- Related to: [[Topic A]], [[Topic B]]
- Prerequisite for: [[Topic C]]

## 6. High-Yield for Exams
[MCQ-focused points]

## 7. Retrieval Questions
1. Q1?
2. Q2?
3. Q3?
```

---

## Subject Structure

### 1. Surgery 🔪
**Color:** #EF4444 | **Topics:** 156

| Subspecialty | Topics | Priority | Status |
|--------------|--------|----------|--------|
| **General Principles** | Wound healing, Shock, Fluids, Burns, Transfusion | Critical | 🟡 Partial |
| **Esophagus** | Anatomy, GERD, Achalasia, Cancer, Motility | High | ✅ Complete |
| **Stomach & Duodenum** | PUD, Gastric cancer, Bariatric, GI bleeding | Critical | 🟡 Partial |
| **Hepatobiliary** | Cholelithiasis, Cholecystitis, Cholangitis, Liver tumors | Critical | ✅ Complete |
| **Pancreas** | Acute pancreatitis, Chronic pancreatitis, Cancer | Critical | 🟡 Partial |
| **Small Intestine** | Obstruction, Appendicitis, Crohn's, Mesenteric ischemia | Critical | 🟡 Partial |
| **Colorectal** | CRC, IBD surgery, Diverticular disease | Critical | 🟡 Partial |
| **Anorectal** | Hemorrhoids, Fissure, Fistula, Abscess | High | 🔴 Pending |
| **Hernia** | Inguinal, Femoral, Ventral, Incisional | Critical | ✅ Complete |
| **Breast** | Cancer, Benign disease, Screening | Critical | 🔴 Pending |
| **Thyroid/Parathyroid** | Goiter, Cancer, Hyperparathyroidism | High | 🔴 Pending |
| **Vascular** | Varicose veins, DVT, Arterial disease | High | 🟡 Partial |
| **Trauma** | ATLS, Solid organ injury, Damage control | Critical | 🔴 Pending |
| **Spleen** | Trauma, Splenectomy, OPSI | High | ✅ Complete |

---

### 2. Medicine 💊
**Color:** #3B82F6 | **Topics:** 203

| Subspecialty | Topics | Priority |
|--------------|--------|----------|
| **Cardiology** | IHD, Heart failure, Arrhythmias, Valvular | Critical |
| **Pulmonology** | COPD, Asthma, Pneumonia, ILD, TB | Critical |
| **Gastroenterology** | Liver disease, IBD, Peptic ulcer, Pancreatitis | Critical |
| **Nephrology** | AKI, CKD, Glomerulonephritis, Dialysis | Critical |
| **Endocrinology** | Diabetes, Thyroid, Adrenal, Pituitary | Critical |
| **Hematology** | Anemia, Leukemia, Lymphoma, Bleeding | Critical |
| **Rheumatology** | RA, SLE, Vasculitis, Spondyloarthropathy | High |
| **Neurology** | Stroke, Epilepsy, Headache, Movement disorders | Critical |
| **Infectious Disease** | HIV, Tropical infections, Sepsis | Critical |
| **Critical Care** | Shock, ARDS, Ventilation, Sepsis management | Critical |

---

### 3. Pediatrics 👶
**Color:** #10B981 | **Topics:** 142

| Subspecialty | Topics | Priority |
|--------------|--------|----------|
| **Neonatology** | Prematurity, RDS, NEC, Jaundice, Sepsis | Critical |
| **Growth & Development** | Milestones, Failure to thrive, Short stature | Critical |
| **Nutrition** | Malnutrition, Vitamins, Feeding problems | Critical |
| **Infectious Disease** | Vaccine-preventable, Diarrhea, URTI, Meningitis | Critical |
| **Respiratory** | Pneumonia, Bronchiolitis, Asthma, Croup | Critical |
| **Cardiac** | CHD, Rheumatic fever, Kawasaki | High |
| **GI** | Diarrhea, Constipation, Hepatitis | High |
| **Nephrology** | UTI, Nephrotic, Nephritis, VUR | High |
| **Neurology** | Seizures, Febrile convulsions, CP | High |
| **Hematology-Oncology** | Anemia, Thalassemia, Leukemia | High |

---

### 4. OB-GYN 🤰
**Color:** #EC4899 | **Topics:** 128

| Subspecialty | Topics | Priority |
|--------------|--------|----------|
| **Obstetrics - Normal** | Antenatal care, Labor, Delivery | Critical |
| **Obstetrics - High Risk** | PIH, GDM, APH, PPH, Preterm | Critical |
| **Gynecology - Benign** | Fibroids, Endometriosis, PCOS, PID | Critical |
| **Gynecology - Malignant** | Cervical, Endometrial, Ovarian cancer | Critical |
| **Infertility** | Causes, Workup, ART | High |
| **Contraception** | Methods, Counseling | High |
| **Menstrual Disorders** | AUB, Amenorrhea, Dysmenorrhea | High |

---

### 5. Orthopedics 🦴
**Color:** #F59E0B | **Topics:** 98

| Subspecialty | Topics | Priority |
|--------------|--------|----------|
| **Trauma** | Fracture principles, Common fractures | Critical |
| **Spine** | Back pain, Disc disease, Deformities | Critical |
| **Joints** | Arthritis, Replacement, Sports injuries | High |
| **Pediatric Ortho** | DDH, Clubfoot, Bone tumors | High |
| **Hand** | Injuries, Infections, Nerve compression | Medium |
| **Bone Diseases** | Osteoporosis, Metabolic, Infections | High |

---

### 6. Anatomy 🫀
**Color:** #6366F1 | **Topics:** 186

| Subspecialty | Topics | Priority |
|--------------|--------|----------|
| **Head & Neck** | Skull, Cranial nerves, Neck triangles | Critical |
| **Thorax** | Heart, Lungs, Mediastinum | Critical |
| **Abdomen** | GI tract, Liver, Retroperitoneum | Critical |
| **Pelvis & Perineum** | Pelvic organs, Pelvic floor | Critical |
| **Upper Limb** | Brachial plexus, Muscles, Joints | High |
| **Lower Limb** | Lumbar plexus, Muscles, Joints | High |
| **Neuroanatomy** | Brain, Spinal cord, Pathways | Critical |
| **Embryology** | Development by system | High |
| **Histology** | Tissue types by system | Medium |

---

### 7. Physiology ⚡
**Color:** #8B5CF6 | **Topics:** 145

| Subspecialty | Topics | Priority |
|--------------|--------|----------|
| **General** | Cell physiology, Membrane transport | Critical |
| **Nerve & Muscle** | Action potential, Neuromuscular junction | Critical |
| **CVS** | Cardiac cycle, BP regulation, ECG | Critical |
| **Respiratory** | Mechanics, Gas exchange, Control | Critical |
| **Renal** | GFR, Tubular function, Acid-base | Critical |
| **GI** | Motility, Secretion, Absorption | Critical |
| **Endocrine** | Hypothalamic-pituitary, Hormones | Critical |
| **Reproductive** | Male & Female physiology | High |
| **Special Senses** | Vision, Hearing, Taste, Smell | High |

---

### 8. Biochemistry 🧬
**Color:** #14B8A6 | **Topics:** 112

| Subspecialty | Topics | Priority |
|--------------|--------|----------|
| **Biomolecules** | Proteins, Carbs, Lipids, Nucleic acids | Critical |
| **Enzymes** | Kinetics, Regulation, Clinical enzymology | Critical |
| **Metabolism - Carbs** | Glycolysis, TCA, Gluconeogenesis | Critical |
| **Metabolism - Lipids** | β-oxidation, Ketogenesis, Cholesterol | Critical |
| **Metabolism - Amino Acids** | Urea cycle, Special amino acids | Critical |
| **Molecular Biology** | DNA, RNA, Protein synthesis, Regulation | Critical |
| **Nutrition** | Vitamins, Minerals, Malnutrition | High |
| **Clinical Biochemistry** | IEM, Diabetes biochemistry | High |

---

### 9. Pathology 🔬
**Color:** #F97316 | **Topics:** 178

| Subspecialty | Topics | Priority |
|--------------|--------|----------|
| **General Pathology** | Cell injury, Inflammation, Healing, Neoplasia | Critical |
| **Hematopathology** | Anemias, Leukemias, Lymphomas | Critical |
| **CVS Pathology** | IHD, Cardiomyopathy, Vasculitis | Critical |
| **Respiratory Pathology** | Pneumonia, COPD, Lung cancer | Critical |
| **GI Pathology** | IBD, Liver disease, GI tumors | Critical |
| **Renal Pathology** | Glomerular, Tubular, Tumors | Critical |
| **Endocrine Pathology** | Thyroid, Adrenal, Diabetes | High |
| **Neuropathology** | CNS infections, Tumors, Demyelination | High |
| **Systemic Pathology** | Remaining organs | Medium |

---

### 10. Pharmacology 💉
**Color:** #06B6D4 | **Topics:** 134

| Subspecialty | Topics | Priority |
|--------------|--------|----------|
| **General Pharmacology** | PK/PD, Drug interactions, ADRs | Critical |
| **ANS Pharmacology** | Cholinergic, Adrenergic | Critical |
| **CVS Drugs** | Antihypertensives, Antiarrhythmics, Antianginals | Critical |
| **Antimicrobials** | Antibiotics, Antifungals, Antivirals | Critical |
| **CNS Drugs** | Sedatives, Antiepileptics, Antipsychotics | Critical |
| **Analgesics** | NSAIDs, Opioids | Critical |
| **Endocrine Drugs** | Diabetes, Thyroid, Steroids | Critical |
| **Chemotherapy** | Anticancer drugs | High |
| **GI Drugs** | PPIs, Antiemetics, Laxatives | High |
| **Respiratory Drugs** | Bronchodilators, Steroids | High |

---

### 11. Microbiology 🦠
**Color:** #84CC16 | **Topics:** 156

| Subspecialty | Topics | Priority |
|--------------|--------|----------|
| **General Microbiology** | Sterilization, Culture, Staining | Critical |
| **Bacteriology - Gram +** | Staph, Strep, Enterococcus, Clostridia | Critical |
| **Bacteriology - Gram -** | Enterobacteriaceae, Pseudomonas, Vibrio | Critical |
| **Mycobacteriology** | TB, Leprosy, NTM | Critical |
| **Virology** | Respiratory, GI, Hepatitis, HIV, Herpes | Critical |
| **Parasitology** | Protozoa, Helminths | Critical |
| **Mycology** | Superficial, Systemic fungi | High |
| **Immunology** | Innate, Adaptive, Hypersensitivity | Critical |
| **Applied Micro** | Hospital infection, Vaccines | High |

---

### 12. Forensic Medicine ⚖️
**Color:** #64748B | **Topics:** 67

| Subspecialty | Topics | Priority |
|--------------|--------|----------|
| **Thanatology** | Death, PM changes, Time of death | Critical |
| **Traumatology** | Wounds, Injuries, Weapons | Critical |
| **Toxicology** | Poisons, Drugs of abuse | Critical |
| **Sexual Offenses** | Examination, Evidence | Critical |
| **Medical Jurisprudence** | Consent, Negligence, Ethics | Critical |
| **Identification** | Methods, DNA | High |

---

## Priority Legend

| Status | Meaning |
|--------|---------|
| ✅ Complete | All content available |
| 🟡 Partial | Some topics done |
| 🔴 Pending | Content needed |

## Content Priority

| Priority | Definition |
|----------|------------|
| **Critical** | Must have for NEET-PG/INICET |
| **High** | Important but less frequently tested |
| **Medium** | Good to have, supplementary |

---

## Next Steps

1. **Surgery:** Complete remaining subspecialties (Breast, Thyroid, Trauma, Anorectal)
2. **Medicine:** Create GI Medicine content (coordinate with ATOM-MGE)
3. **Preclinical:** Prioritize Anatomy, Physiology, Biochemistry core topics
4. **Paraclinical:** Pathology and Pharmacology integrated with clinical subjects

---

*Structure maintained by Narasimha | Based on ATOM's Atomic Principle*
