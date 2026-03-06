# Content System

## Purpose
NucleuX Academy serves medical learning content from the local filesystem (`/content`) and maps that content into Library view modes (`explorer`, `examPrep`, `textbook`, `quiz`, `cases`, `roadmap`).

Core loader:
- `src/lib/content/loader.ts`

Core type model:
- `src/lib/types/library.ts`

## Content Directory Model

### Primary layout
```text
content/
  <subject>/
    <subspecialty>/
      _index.yaml
      <topic-slug>/
        _meta.yaml
        explorer.md
        exam-prep.md            # optional
        textbook.md             # optional
        retrieval-cards.json    # optional
        cases.md / case files   # optional
        roadmap.md / roadmap.*  # optional
```

### Reality in this repo
The repository currently contains mixed formats:
- modern topic-folder bundles
- flat markdown topic files
- legacy subject/subspecialty structures from earlier content pipelines

The loader supports this mixed state through fallback logic.

## Metadata Files

### Subspecialty index: `_index.yaml`
Used to list and classify topics in a subspecialty.

### Topic metadata: `_meta.yaml`
Used for:
- `topic_id`, `slug`, `name`, `description`
- `high_yield`, `difficulty`, `estimated_minutes`
- `prerequisites`, `related_topics`, `exam_tags`
- `nmc_codes`

## View Mode Mapping
From `src/lib/types/library.ts` and topic client behavior:
- `explorer` -> `concept` content (`explorer.md`)
- `examPrep` -> high-yield blocks (`exam-prep.md`) or generated fallback
- `textbook` -> raw chapter/topic markdown (`textbook.md` or API-resolved content)
- `quiz` -> retrieval cards (`retrieval-cards.json`)
- `cases` -> case scenarios
- `roadmap` -> roadmap/grinde map data

Availability flags are exposed as `LibraryTopic.hasContent` and drive UI indicators.

## Resolution and Fallback Strategy

### Loader path resolution (`src/lib/content/loader.ts`)
1. Direct `<subject>/<subspecialty>` match
2. Mapping-based lookup via `SUBSPECIALTY_CONTENT_MAP`
3. Numbered-prefix folder match (`NN-<slug>` style)

### Topic source fallback
1. Filesystem topic content
2. Legacy TypeScript topic registry (`src/lib/data/topics/index.ts`)
3. Empty state if nothing exists

### API-level file resolver
`/api/library/content` (`src/app/api/library/content/route.ts`) supports:
- subject-aware rich content fetch
- legacy surgery-only route shape
- old `system/topic/mode` style

## Mapping Registry
`src/lib/data/content-mapping.ts` defines:
- `SUBJECT_CONTENT_MAP`
- `SUBSPECIALTY_CONTENT_MAP`
- `TOPIC_CONTENT_MAP`

Use it when filesystem naming differs from URL slug conventions.

## Authoring Workflow
1. Choose canonical path: `content/<subject>/<subspecialty>/<topic-slug>/`
2. Add `_meta.yaml` and `explorer.md` first.
3. Add optional mode files (`exam-prep.md`, `textbook.md`, `retrieval-cards.json`, cases/roadmap assets).
4. Update subspecialty `_index.yaml` to include new topic slug.
5. If slugs do not align with folder names, update `src/lib/data/content-mapping.ts`.
6. Validate with:
```bash
npm run content:validate
npm run validate:cbme
```

## Quality and Validation
- `scripts/validate-content.ts`: structural checks for content folders and files.
- `scripts/validate-cbme-links.ts`: verifies curriculum links and mapping coherence.

## Known Gaps
- `content/README.md` contains historical status and is not fully aligned with current content volume.
- Some subjects still rely on partial or legacy topic representations.
