# CBME (Competency-Based Medical Education) - NMC Curriculum

This directory contains the complete **Competency-Based Medical Education (CBME)** curriculum as defined by the **National Medical Commission (NMC), India** for MBBS undergraduates.

## 📋 Overview

The CBME curriculum represents a paradigm shift from traditional time-based learning to **competency-based outcomes**. It ensures that every medical graduate achieves specific competencies required to practice medicine effectively.

### Key Features
- **4,559 Total Competencies** across all subjects and phases
- **Evidence-based** curriculum design
- **Integrated** learning approach
- **Assessment-driven** progression
- **Patient-centered** care focus

## 🏗️ Structure

### Phase-wise Distribution

```
📁 CBME Curriculum Structure
├── 🔬 Phase-1 (Pre-clinical) - 1,052 competencies
│   ├── Anatomy (654 competencies)
│   ├── Physiology (207 competencies)
│   └── Biochemistry (191 competencies)
│
├── 🧬 Phase-2 (Para-clinical) - 1,162 competencies
│   ├── Pathology (411 competencies)
│   ├── Forensic Medicine (269 competencies)
│   ├── Community Medicine (187 competencies)
│   ├── Microbiology (152 competencies)
│   └── Pharmacology (143 competencies)
│
├── 🩺 Phase-3A (Clinical Part 1) - 448 competencies
│   ├── Psychiatry (169 competencies)
│   ├── ENT (79 competencies)
│   ├── Orthopedics (76 competencies)
│   ├── Ophthalmology (73 competencies)
│   ├── Dermatology (36 competencies)
│   └── Radiodiagnosis (15 competencies)
│
└── 🏥 Phase-3B (Clinical Part 2 + Internship) - 1,897 competencies
    ├── Medicine (893 competencies)
    ├── Pediatrics (657 competencies)
    ├── Surgery (189 competencies)
    └── OBG (158 competencies)
```

## 🎯 Competency Framework

Each competency is classified using the **Miller's Pyramid** model:

### Competency Types
- **K (Knowledge)** - Knows/Knows How
- **S (Skill)** - Shows How/Does
- **A (Attitude)** - Professional behavior
- **C (Communication)** - Patient interaction

### Learning Levels
- **Must Know** - Essential for safe practice
- **Should Know** - Important for effective practice  
- **Nice to Know** - Desirable for comprehensive practice

### Domains
- **Cognitive** - Knowledge and understanding
- **Psychomotor** - Skills and procedures
- **Affective** - Attitudes and values

## 📁 Directory Structure

```
cbme/
├── README.md                    # This overview document
├── index.json                   # Complete competency database
├── summary_stats.json           # Phase and subject statistics
├── arena_format.json            # Gaming/Arena ready format
│
├── Phase-1/                     # Pre-clinical subjects
│   ├── Anatomy/
│   │   ├── competencies.json    # 654 anatomy competencies
│   │   └── competencies.md      # Human-readable format
│   ├── Physiology/
│   │   ├── competencies.json    # 207 physiology competencies  
│   │   └── competencies.md
│   └── Biochemistry/
│       ├── competencies.json    # 191 biochemistry competencies
│       └── competencies.md
│
├── Phase-2/                     # Para-clinical subjects
│   ├── Pathology/
│   ├── Pharmacology/
│   ├── Microbiology/
│   ├── Forensic-Medicine/
│   └── Community-Medicine/
│
├── Phase-3A/                    # Clinical (Part 1)
│   ├── ENT/
│   ├── Ophthalmology/
│   ├── Orthopedics/
│   ├── Dermatology/
│   ├── Psychiatry/
│   └── Radiodiagnosis/
│
└── Phase-3B/                    # Clinical (Part 2 + Internship)
    ├── Medicine/
    ├── Surgery/
    ├── OBG/
    └── Pediatrics/
```

## 🎮 NucleuX Academy Integration

This CBME database powers the **NucleuX Academy Arena** - a gamified learning platform where students:

- **Level up** by mastering competencies
- **Unlock achievements** for completing subject modules
- **Track progress** across all MBBS phases
- **Compete** with peers in competency challenges
- **Earn badges** for different competency types (K/S/A/C)

## 🔍 Sample Competency

```json
{
  "code": "AN1.1",
  "subject": "Anatomy", 
  "phase": "Phase-1",
  "description": "Demonstrate normal anatomical position, various planes, relation...",
  "type": "K",
  "level": "Must Know",
  "domain": "Cognitive",
  "core": true,
  "integration": ["Surgery", "Radiology"]
}
```

## 📊 Statistics Summary

| Phase | Subjects | Competencies | Focus Area |
|-------|----------|-------------|------------|
| Phase-1 | 3 | 1,052 | Basic Sciences |
| Phase-2 | 5 | 1,162 | Para-clinical |
| Phase-3A | 6 | 448 | Clinical Specialties |
| Phase-3B | 4 | 1,897 | Major Clinical Subjects |
| **Total** | **18** | **4,559** | **Complete MBBS** |

## 📚 Source Documents

This database was extracted from official NMC publications:
- **UG Curriculum Volume I** - Foundation and Phase-1
- **UG Curriculum Volume II** - Phase-2 and early Phase-3
- **UG Curriculum Volume III** - Phase-3B and Internship
- **Competency Assessment Module** - Evaluation framework
- **AETCOM Module** - Attitude, Ethics & Communication

## 🚀 Usage for Medical Students

### For Individual Study
1. Browse competencies by phase/subject
2. Track mastery using the JSON format
3. Focus on "Must Know" competencies first
4. Integrate learning across subjects

### For Educational Institutions
1. Map curriculum to competencies
2. Design assessments based on competency codes
3. Track student progress systematically
4. Ensure comprehensive coverage

### For the Arena Platform
1. Import competency data for gamification
2. Create challenges and quests
3. Design progression paths
4. Enable peer learning and competition

---

**Generated:** February 8, 2026  
**Source:** National Medical Commission (NMC), India  
**Total Competencies:** 4,559  
**Format Version:** 1.0  

*For the latest updates, visit: https://www.nmc.org.in/information-desk/for-colleges/ug-curriculum/*