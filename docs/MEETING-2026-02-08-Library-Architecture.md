# NucleuX Academy - Library Architecture Meeting
**Date:** 2026-02-08
**Participants:** Sarath, Narasimha

---

## Decisions Made

### 1. Library Structure: Subject-Based Rooms ✅
```
📚 Library
├── 🔪 Surgery (GI, HPB, Colorectal...)
├── 🩺 Medicine (Gastro, Cardio...)
├── 🩻 Anatomy
├── 🧬 Pathology
├── 💊 Pharmacology
└── 📊 Biostatistics
```

### 2. Dynamic User Views
- **Explorer Mode** — Browse topics, build foundations
- **Exam Prep Mode** — High-yield, quick revision
- **Textbook Mode** — Chapter-wise deep study
- **Quiz Mode** — Retrieval cards, active recall
- **Cases Mode** — Clinical application
- **Roadmap Mode** — Guided "what's next"

### 3. ATOM as Librarian
- Study companion that knows the whole library
- Suggests next topics based on user profile
- Adjusts complexity based on level (UG/PG/practicing)
- Aware of exam targets and timelines
- Pulls content dynamically based on user needs

### 4. Same Topic, Multiple Formats
Each topic should have:
- Concept note (full)
- Exam prep summary (high-yield)
- Textbook references
- Retrieval cards
- Case scenarios
- GRINDE maps (visual)

---

## Action Items

### PRIORITY: Content Consolidation (Vishwakarma)
**Task:** Consolidate and organize the entire content library
- Source: Aditya's vault (Study Library + Source Library)
- Enhance metadata for each file
- Ensure consistent structure for search
- Tag with: subject, subspecialty, difficulty, exam relevance

### Build Phases
1. **Phase 1:** Structure + Import (Esophagus pilot)
2. **Phase 2:** View modes UI
3. **Phase 3:** ATOM Librarian integration
4. **Phase 4:** User personalization

---

## Technical Notes

### Content Structure
```typescript
interface Topic {
  id: string;
  title: string;
  subject: string;
  subspecialty: string;
  content: {
    concept: string;
    examPrep: string;
    textbookRefs: ChapterRef[];
    retrievalCards: Card[];
    cases: Case[];
  };
  prerequisites: string[];
  relatedTopics: string[];
  difficulty: 1-5;
  highYield: boolean;
  examTags: string[];
}
```

### User Profile
```typescript
interface UserProfile {
  level: 'ug' | 'pg' | 'resident' | 'practitioner';
  examTarget?: string;
  examDate?: Date;
  topicsCompleted: string[];
  weakAreas: string[];
  preferredMode: string;
}
```

---

## Reminder
- [ ] Follow up on library consolidation progress
- [ ] Review Vishwakarma's consolidated output
- [ ] Decide on database schema for content

