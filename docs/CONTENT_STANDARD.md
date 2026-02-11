# NucleuX Academy Content Standard (v1)

**Purpose:** Make `/content/` the *single source of truth* for Library topics and their multi-mode content.

This standard enables:
- Adding topics without code changes/redeploy
- Consistent loader + validation
- Predictable paths for Explorer / Exam Prep / Textbook / Quiz / Cases / Roadmap

---

## 1. Directory Layout

### 1.1 Subject → Subspecialty

```
content/
  <subject>/
    <subspecialty>/
      _index.yaml
      <topic-slug>/
        _meta.yaml
        explorer.md
        exam-prep.md            (optional)
        textbook.md             (optional)
        retrieval-cards.json    (optional)
        cases.yaml              (optional)
        roadmap.md              (optional)
```

Examples:
- `content/medicine/nephrology/_index.yaml`
- `content/medicine/nephrology/acute-kidney-injury/explorer.md`

> Notes
> - Topic folder name should be the canonical `topic.slug`.
> - Prefer kebab-case slugs.

---

## 2. Subspecialty Index (`_index.yaml`)

### Required fields
```yaml
id: nephrology              # subspecialty id (slug)
title: "Nephrology"         # display title
subject: medicine

# ordering of topics in UI
categories:
  - id: core
    title: "Core"
    topics:
      - acute-kidney-injury
      - chronic-kidney-disease
```

### Optional fields
- `description`, `icon`, `order`, `tags`, `sources`, `exam_relevance`, `status`

### Allowed legacy formats (to be migrated)
- `topics: ["Acute Kidney Injury", ...]` (titles) is legacy; migrate to slugs.

---

## 3. Topic Metadata (`_meta.yaml`)

### Required
```yaml
topic_id: acute-kidney-injury
name: "Acute Kidney Injury"
description: "KDIGO staging, prerenal vs intrinsic vs postrenal"

high_yield: true

difficulty: 3                # 1-5
estimated_minutes: 20

exam_tags: [NEET_PG, INICET]

prerequisites: []
related_topics: []
```

### Optional
- `nmc_competency`
- `sources` (free-form map/list)
- `tags`

---

## 4. Content Files

### `explorer.md` (required)
- Full concept markdown (Explorer mode)

### `exam-prep.md` (optional)
- Quick revision markdown (Exam Prep mode)

### `textbook.md` (optional)
- Comprehensive notes markdown OR this can be served from `/api/library/content` if separate.

### `retrieval-cards.json` (optional)
```json
[
  { "question": "...", "answer": "...", "difficulty": 3, "tags": ["..." ] }
]
```

### `cases.yaml` (optional)
Structured cases (preferred), mapped to `LibraryTopic.content.cases`.

---

## 5. Validation Rules (must pass)

1. Every subspecialty folder must contain `_index.yaml`.
2. Every listed topic slug in `_index.yaml` must exist as a topic folder.
3. Every topic folder must have `_meta.yaml` and `explorer.md`.
4. Slugs must be unique within a subspecialty.
5. Retrieval cards must be valid JSON array of `{question, answer}`.

---

## 6. Migration Strategy

1. Loader supports both formats (flat `*.md` files and topic folders).
2. Migrate subspecialties gradually:
   - nephrology (small)
   - esophagus
   - then others
3. Once a subspecialty is fully migrated, remove legacy TS topic definitions.

---

*Version: v1 — 2026-02-11*
