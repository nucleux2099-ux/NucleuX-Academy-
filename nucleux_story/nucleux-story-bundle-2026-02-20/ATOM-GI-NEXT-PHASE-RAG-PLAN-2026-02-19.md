# ATOM GI — Next Phase Implementation Plan (RAG Enablement)

Date: 2026-02-19
Owner: Narasimha (with Sarath as clinical lead)
Status: Planned (queued for execution)

## Goal
Equip ATOM GI with a true textbook-backed retrieval layer so ATOM can pull grounded GI knowledge at task time (teaching, quiz explanation, case reasoning, roadmap guidance).

---

## Phase 1 — Content Backbone Completion (Priority GI-15)
Target topics (15):
- acute-cholecystitis
- cholangitis
- obstructive-jaundice
- choledocholithiasis
- gallbladder-cancer
- portal-hypertension
- liver-abscess
- liver-metastases
- hepatocellular-carcinoma
- acute-pancreatitis
- chronic-pancreatitis
- pancreatic-cancer
- upper-gi-bleed-variceal-bleed
- intestinal-obstruction
- perforation-peritonitis

Required file pack per topic:
- explorer.md
- exam-prep.md
- textbook.md
- roadmap.md
- _meta.yaml

Current baseline audit:
- Found topics: 13/15
- Complete file-pack: 2/15
- Missing topic folders: upper-gi-bleed-variceal-bleed, perforation-peritonitis

Audit file: `/Users/adityachandrabhatla/clawd/memory/atom-gi-gap-audit-2026-02-19.json`

---

## Phase 2 — Source Library Foundation (Completed now)
Problem observed:
- ATOM-GI source architecture existed, but textbook payload in ATOM-GI buckets was effectively empty.

Action completed:
- Created textbook source layer in ATOM-GI using symlink mode (no duplication), with 7 canonical textbook links:
  - Bailey and Love
  - Shackelford
  - Blumgart
  - Schwartz
  - Sleisenger & Fordtran
  - Schiff’s Diseases of the Liver
  - Vincent’s Critical Care

Index files created:
- `/Volumes/Aditya's Ideaverse/03 Spaces/Sarath's Learning System/Source Library/ATOM-GI/00_ADMIN/TEXTBOOK_SOURCE_LIBRARY_INDEX.md`
- `/Volumes/Aditya's Ideaverse/03 Spaces/Sarath's Learning System/Source Library/ATOM-GI/00_ADMIN/TEXTBOOK_SOURCE_LIBRARY_INDEX.json`

---

## Phase 3 — ATOM-Level Retrieval/RAG Pipeline
### 3.1 Retrieval corpus build
- Build chapter/chunk index per linked textbook
- Normalize citations and section metadata
- Generate retrieval units with source attribution (book/chapter/section/path)

### 3.2 Query orchestration
At ATOM query-time, apply:
1. User profile routing (surgical-first vs medical-first)
2. Topic + level intent detection (UG/PG/SS)
3. Hybrid retrieval (semantic + lexical fallback)
4. Top-k rerank with citation confidence

### 3.3 Response contract
Every ATOM answer for GI tasks should include:
- concise answer
- reasoning path
- source citations
- optional next-step retrieval prompts

---

## Phase 4 — Quality Gates
For each GI topic before marked “RAG-ready”:
- has required topic file-pack
- has textbook citations in `textbook.md`
- has cross-subject links (>=2)
- has ATOM Socratic prompts (>=5)
- has at least one retrieval test passing

Operational checks:
- citation hit-rate
- hallucination guard (no uncited claims in textbook mode)
- latency budget for user-facing ATOM responses

---

## Phase 5 — Rollout
1. Pilot on hepatobiliary + pancreas priority topics
2. Expand to all surgical GI core topics
3. Extend to medical GI crossover
4. Promote to default ATOM GI retrieval policy once quality threshold met

---

## Deliverables (Queued)
- GI priority content completion pack
- retrieval index builder + manifest
- ATOM GI retrieval policy v2
- RAG readiness dashboard/checklist
- citation QA report

