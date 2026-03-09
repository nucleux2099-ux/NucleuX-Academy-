# ATOM RAG Pipeline — Retrieval-Augmented Generation Specification

> **Layer 2 of 5** | Part of the [ATOM v2 Backend Architecture](../ATOM_V2_BACKEND.md)
> Replaces v1's keyword-based file scanning with hybrid vector + full-text search, semantic chunking, and cross-encoder reranking.

---

## Overview

ATOM v1 retrieves content by scanning filenames and the first 2KB of each file for keyword matches. This produces low-quality, often irrelevant context. The v2 RAG pipeline transforms the entire `/content/` curriculum into semantically searchable chunks with vector embeddings, then applies a 5-stage retrieval process:

```
Student Message
    │
    ▼
┌─────────────────┐
│  1. SCRIBE       │  Intent detection + query expansion + medical synonyms
└────────┬────────┘
         ▼
┌─────────────────┐
│  2. RETRIEVER    │  Parallel: pgvector cosine + Supabase FTS → 20 candidates
└────────┬────────┘
         ▼
┌─────────────────┐
│  3. CRITIC       │  Cohere cross-encoder reranking → top 5
└────────┬────────┘
         ▼
┌─────────────────┐
│  4. ASSEMBLER    │  Token budget allocation → final context string
└────────┬────────┘
         ▼
┌─────────────────┐
│  5. GENERATOR    │  Claude Sonnet with full context → SSE stream
└─────────────────┘
```

---

## Stage 1: Chunking Pipeline (Offline)

The chunking pipeline runs **offline** (admin-triggered, not per-request). It processes all curriculum content into semantically meaningful chunks stored in `content_chunks`.

### Input

All files under `/content/` organized as:

```
content/
├── surgery/
│   ├── esophagus/
│   │   ├── gerd-hiatal-hernia/
│   │   │   ├── explorer.md
│   │   │   ├── exam-prep.md
│   │   │   ├── textbook.md
│   │   │   ├── retrieval-cards.json
│   │   │   └── cases/
│   │   │       └── gerd-case-1.md
│   │   └── ...
│   └── ...
├── anatomy/
├── physiology/
└── ... (25 subjects)
```

### Chunking Rules

| Content Type | File Pattern | Strategy | Chunk Size | Overlap | Special Rules |
|---|---|---|---|---|---|
| Explorer | `explorer.md` | Header-aware split | 512 tokens | 64 tokens | Split at `##` boundaries, never mid-paragraph |
| Exam Prep | `exam-prep.md` | Header-aware split | 512 tokens | 64 tokens | Keep mnemonics whole (detect by pattern: all-caps or bullet lists under "Mnemonic" header) |
| Textbook | `textbook.md` | Header-aware split | 512 tokens | 64 tokens | Preserve page references, extract chapter numbers |
| Retrieval Cards | `retrieval-cards.json` | One chunk per Q&A pair | Variable | None | Each `{ question, answer }` = 1 chunk |
| Case Scenarios | `cases/*.md` | One chunk per case | Variable | None | Entire case file = 1 chunk (typically 300-800 tokens) |
| Tables | Any `.md` with tables | Keep table whole | Variable | None | Never split rows. If table > 512 tokens, it's its own chunk |
| Mnemonics | Detected by pattern | One chunk per mnemonic | Variable | None | Pattern: header containing "Mnemonic" + following content |
| NMC Codes | `cbme/*.md` | One chunk per competency code | Variable | None | Format: `AN1.1`, `SU5.3`, etc. Each code + description = 1 chunk |

### Chunking Algorithm

```typescript
interface ChunkInput {
  filePath: string;         // "content/surgery/esophagus/gerd-hiatal-hernia/explorer.md"
  content: string;          // raw file content
  metadata: {
    subject: string;        // "surgery"
    subspecialty: string;   // "esophagus"
    topic: string;          // "gerd-hiatal-hernia"
    topicSlug: string;      // "surgery/esophagus/gerd-hiatal-hernia"
    viewMode: string;       // "explorer", "exam-prep", "textbook", etc.
  };
}

interface ContentChunk {
  id: string;               // UUID
  topicSlug: string;
  subject: string;
  subspecialty: string;
  sourceFile: string;       // "explorer.md"
  viewMode: string;
  chunkIndex: number;       // position within file
  content: string;          // the actual text
  tokenCount: number;
  metadata: {
    headings: string[];     // heading hierarchy ["## Pathophysiology", "### Mechanism"]
    nmcCodes?: string[];    // ["AN1.1", "PH3.5"]
    highYield?: boolean;    // detected from markers
    difficulty?: 'basic' | 'intermediate' | 'advanced';
    textbookRef?: string;   // "Robbins Ch. 3, p. 45-48"
    tables?: boolean;       // contains a table
  };
}
```

### Header-Aware Splitting

```typescript
function splitByHeaders(markdown: string, maxTokens: number = 512, overlap: number = 64): string[] {
  const chunks: string[] = [];
  const sections = markdown.split(/(?=^#{1,3} )/m);  // split at h1, h2, h3

  let currentChunk = '';
  let currentTokens = 0;

  for (const section of sections) {
    const sectionTokens = estimateTokens(section);

    if (currentTokens + sectionTokens <= maxTokens) {
      currentChunk += section;
      currentTokens += sectionTokens;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      // Start new chunk with overlap from previous
      const overlapText = getLastNTokens(currentChunk, overlap);
      currentChunk = overlapText + section;
      currentTokens = estimateTokens(currentChunk);
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

function estimateTokens(text: string): number {
  // Approximate: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}
```

### Admin Trigger

```typescript
// POST /api/atom/embed
// Headers: { Authorization: "Bearer ${ATOM_EMBED_SECRET}" }
// Body: { subject?: string, force?: boolean }
//
// If subject provided → re-chunk only that subject
// If force = true → delete existing chunks and re-create
// Otherwise → only process files modified since last embed
```

---

## Stage 2: Embedding Pipeline

### Model

**BGE-small-en-v1.5** (BAAI) — a 33M parameter bi-encoder that produces 384-dimensional embeddings.

| Property | Value |
|----------|-------|
| Model | `BAAI/bge-small-en-v1.5` |
| Dimensions | 384 |
| Max Input | 512 tokens |
| License | MIT |
| Size | ~33M parameters |
| Runtime | ONNX via Supabase Edge Function |
| API Cost | $0 (self-hosted) |

### Supabase Edge Function

```typescript
// supabase/functions/embed/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { env, pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

env.useBrowserCache = false;
env.allowLocalModels = false;

let embedder: any = null;

async function getEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5');
  }
  return embedder;
}

serve(async (req: Request) => {
  const { texts } = await req.json();  // string[]

  const model = await getEmbedder();
  const results = await model(texts, {
    pooling: 'cls',
    normalize: true,
  });

  const embeddings = texts.map((_: string, i: number) =>
    Array.from(results[i].data) as number[]
  );

  return new Response(JSON.stringify({ embeddings }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

### Batch Embedding Process

```typescript
async function embedChunks(chunks: ContentChunk[]): Promise<void> {
  const BATCH_SIZE = 100;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const texts = batch.map(c => c.content);

    // Call Edge Function
    const response = await fetch(`${SUPABASE_URL}/functions/v1/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ texts }),
    });

    const { embeddings } = await response.json();

    // Upsert chunks with embeddings
    for (let j = 0; j < batch.length; j++) {
      await supabase.from('content_chunks').upsert({
        id: batch[j].id,
        topic_slug: batch[j].topicSlug,
        subject: batch[j].subject,
        subspecialty: batch[j].subspecialty,
        source_file: batch[j].sourceFile,
        view_mode: batch[j].viewMode,
        chunk_index: batch[j].chunkIndex,
        content: batch[j].content,
        embedding: embeddings[j],
        metadata: batch[j].metadata,
        token_count: batch[j].tokenCount,
      }, { onConflict: 'id' });
    }

    console.log(`Embedded batch ${i / BATCH_SIZE + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}`);
  }
}
```

### Re-Embedding Triggers

| Trigger | Scope | Method |
|---------|-------|--------|
| Content file modified | Only changed file's chunks | File hash comparison |
| Manual admin trigger | Specified subject or all | `POST /api/atom/embed` |
| Content deploy (CI/CD) | All changed files | Post-deploy hook |
| Model upgrade | All chunks | `POST /api/atom/embed?force=true` |

### Fallback

If embedding fails for a chunk (e.g., Edge Function timeout), the chunk is still stored with `embedding = NULL`. It will be:
- Searchable via FTS (full-text search) only
- Flagged for retry on next embed run
- Never returned by vector search (NULL embeddings excluded)

---

## Stage 3: Hybrid Search (Retriever Agent)

Two parallel search paths that are merged and deduplicated.

### Path A: Vector Search (Semantic)

```sql
-- pgvector cosine similarity search
SELECT
  id,
  topic_slug,
  source_file,
  content,
  metadata,
  1 - (embedding <=> $1::vector) AS similarity_score
FROM content_chunks
WHERE
  embedding IS NOT NULL
  AND ($2::text IS NULL OR subject = $2)
  AND ($3::text IS NULL OR subspecialty = $3)
ORDER BY embedding <=> $1::vector
LIMIT 15;
```

- `$1` = query embedding (from Edge Function)
- `$2` = optional subject filter
- `$3` = optional subspecialty filter
- Returns top 15 by cosine similarity

### Path B: Full-Text Search (Keyword)

```sql
-- Supabase FTS with ts_rank
SELECT
  id,
  topic_slug,
  source_file,
  content,
  metadata,
  ts_rank_cd(fts, query) AS fts_score
FROM content_chunks,
  to_tsquery('english', $1) AS query
WHERE fts @@ query
  AND ($2::text IS NULL OR subject = $2)
ORDER BY fts_score DESC
LIMIT 10;
```

- `$1` = keywords joined with `&` (AND) or `|` (OR)
- Returns top 10 by ts_rank_cd

### Merge Algorithm

```typescript
interface SearchResult {
  chunkId: string;
  topicSlug: string;
  sourceFile: string;
  content: string;
  metadata: ChunkMetadata;
  vectorScore?: number;   // 0.0 - 1.0 (cosine similarity)
  ftsScore?: number;      // ts_rank_cd score
  combinedScore: number;  // weighted combination
}

function mergeResults(
  vectorResults: SearchResult[],
  ftsResults: SearchResult[]
): SearchResult[] {
  const merged = new Map<string, SearchResult>();

  // Add vector results
  for (const result of vectorResults) {
    merged.set(result.chunkId, {
      ...result,
      combinedScore: result.vectorScore! * 0.7,  // 70% weight for semantic
    });
  }

  // Merge FTS results
  for (const result of ftsResults) {
    const existing = merged.get(result.chunkId);
    if (existing) {
      // Boost score if found in both searches
      existing.combinedScore += result.ftsScore! * 0.3 + 0.1;  // bonus for dual-match
    } else {
      merged.set(result.chunkId, {
        ...result,
        combinedScore: result.ftsScore! * 0.3,  // 30% weight for keyword
      });
    }
  }

  // Sort by combined score, cap at 20
  return Array.from(merged.values())
    .sort((a, b) => b.combinedScore - a.combinedScore)
    .slice(0, 20);
}
```

### Performance Indexes

```sql
-- HNSW index for fast vector search (already in migration 009)
CREATE INDEX idx_chunks_embedding ON content_chunks
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- GIN index for full-text search (already in migration 009)
CREATE INDEX idx_chunks_fts ON content_chunks USING gin(fts);

-- Composite indexes for filtered searches
CREATE INDEX idx_chunks_subject ON content_chunks(subject, subspecialty);
CREATE INDEX idx_chunks_topic ON content_chunks(topic_slug);
```

---

## Stage 4: Reranking (Critic Agent)

The Critic takes 20 candidate chunks and uses Cohere's cross-encoder to produce a much more accurate relevance ranking.

### Why Reranking

Bi-encoders (like BGE-small) encode query and document independently — fast but less accurate. Cross-encoders (like Cohere Rerank) encode query + document together — slower but significantly more accurate for relevance.

### Cohere API Call

```typescript
interface RerankRequest {
  model: 'rerank-english-v3.0';
  query: string;
  documents: string[];
  top_n: number;
  return_documents: boolean;
}

interface RerankResult {
  index: number;
  relevance_score: number;  // 0.0 - 1.0
}

async function rerankChunks(
  query: string,
  chunks: SearchResult[]
): Promise<SearchResult[]> {
  const response = await fetch('https://api.cohere.ai/v1/rerank', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'rerank-english-v3.0',
      query,
      documents: chunks.map(c => c.content),
      top_n: 5,
      return_documents: false,
    }),
  });

  const { results } = await response.json() as { results: RerankResult[] };

  // Filter by noise threshold and map back to chunks
  return results
    .filter(r => r.relevance_score >= 0.3)
    .map(r => ({
      ...chunks[r.index],
      rerankScore: r.relevance_score,
    }));
}
```

### Fallback (Cohere Unavailable)

If Cohere API fails (timeout, rate limit, API key issue):
1. Log error
2. Send `agent_status` SSE event: `{ agent: "critic", status: "error" }`
3. Fall back to using `combinedScore` from hybrid search merge
4. Return top 5 by combinedScore instead

### Cost

| Volume | Monthly Cost |
|--------|-------------|
| 1,000 searches/month | $1 |
| 10,000 searches/month | $10 |
| 100,000 searches/month | $100 |

At typical student usage (20-50 ATOM interactions/day × 100 students), expect 60K-150K searches/month = $60-$150/month.

---

## Stage 5: Query Expansion (Scribe Agent)

Before retrieval begins, the Scribe agent expands the raw student message into a richer search query.

### Intent Classification

```typescript
type Intent = 'learn' | 'practice' | 'review' | 'plan' | 'discuss' | 'generate';

// Scribe uses a lightweight Claude call to classify intent:
const scribePrompt = `
Classify the student's intent into one of these categories:
- learn: wants to understand a concept
- practice: wants to solve questions or cases
- review: wants to revisit/summarize known material
- plan: wants study planning or recommendations
- discuss: wants debate or discussion about a topic
- generate: wants content created (flashcards, notes, summaries)

Also:
1. Extract medical keywords from the message
2. Expand abbreviations (MI → myocardial infarction)
3. Add synonyms for key terms
4. Determine if retrieval is needed (plan/discuss may not need it)

Student message: "${userMessage}"
Room: ${room}

Respond as JSON:
{
  "intent": "learn",
  "keywords": ["myocardial infarction", "coronary"],
  "expandedQuery": "pathophysiology of myocardial infarction acute coronary syndrome",
  "needsRetrieval": true,
  "subjectHint": "medicine",
  "topicHint": "cardiology"
}
`;
```

### Medical Synonym Map (Extensible)

The v1 hardcoded synonym map (~40 terms) is replaced with a JSON configuration file:

```typescript
// src/lib/atom/synonyms.json (extensible by admin)
{
  "appendicitis": ["appendix", "appendiceal", "rlq", "mcburney", "rovsing", "psoas sign"],
  "myocardial infarction": ["mi", "heart attack", "stemi", "nstemi", "acs", "coronary"],
  "diabetes mellitus": ["dm", "diabetes", "hyperglycemia", "insulin resistance", "hba1c"],
  "hypertension": ["htn", "high blood pressure", "elevated bp", "antihypertensive"],
  "pneumonia": ["lung infection", "cap", "hap", "vap", "consolidation", "air bronchogram"],
  // ... extensible to 500+ terms
}
```

### Skip-Retrieval Detection

Some intents don't need RAG at all:

| Intent | Needs RAG | Example |
|--------|-----------|---------|
| `learn` | Yes | "Explain GERD pathophysiology" |
| `practice` | Yes | "Give me an MCQ on appendicitis" |
| `review` | Yes | "Summarize what we covered on diabetes" |
| `plan` | No (uses memory + analytics) | "What should I study today?" |
| `discuss` | Sometimes | "What's better — open vs laparoscopic cholecystectomy?" |
| `generate` | Sometimes | "Create flashcards for cranial nerves" |

When `needsRetrieval = false`, the pipeline skips Retriever + Critic and goes directly to context assembly with memory and page context only.

---

## Context Assembly

The Assembler takes all retrieved/generated context and fits it within the token budget.

### Token Budget Allocation

```typescript
const TOKEN_BUDGET = {
  systemPrompts: 3_000,       // base + room + plugins
  memory: 2_000,              // from Memorist
  retrievedChunks: 10_000,    // from Critic (5 chunks × ~2K each)
  pageContext: 500,            // current topic, view mode, etc.
  conversationHistory: 30_000, // previous messages
  generation: 5_000,          // max_tokens for Claude response
  // Total: ~50,500 tokens
};
```

### Truncation Strategy (When Over Budget)

Priority order (last to be truncated):

1. **Base + Room prompts** — Never truncated
2. **Active weak areas** (from memory) — Never truncated (critical for personalization)
3. **Top 3 retrieved chunks** — Reduce from 5 to 3 if needed
4. **Other memories** — Reduce from 5 to 2 relevant memories
5. **Plugin prompts** — Drop lowest-priority plugins
6. **Page context** — Drop optional metadata fields
7. **Conversation history** — Summarize older messages (compaction)

### Conversation Compaction

When conversation history exceeds its token budget:

```typescript
async function compactHistory(
  messages: ATOMMessage[],
  budgetTokens: number
): Promise<ATOMMessage[]> {
  const totalTokens = messages.reduce((sum, m) => sum + estimateTokens(m.content as string), 0);

  if (totalTokens <= budgetTokens) return messages;

  // Keep last 10 messages verbatim
  const recent = messages.slice(-10);
  const older = messages.slice(0, -10);

  // Summarize older messages using Claude
  const summary = await summarizeConversation(older);

  return [
    { role: 'assistant', content: `[Conversation summary: ${summary}]` },
    ...recent,
  ];
}
```

---

## Performance Optimization

### Embedding Cache

```typescript
// Don't re-embed unchanged chunks
// Track via content hash (SHA-256 of chunk content)
interface ChunkCache {
  contentHash: string;
  embeddingGeneratedAt: Date;
}

// On re-embed: compare hash → skip if unchanged
```

### Search Result Cache (Short-TTL)

```typescript
// Cache search results for identical queries (10-second TTL)
// Useful when student sends follow-up message within same topic
const searchCache = new Map<string, { results: SearchResult[]; expiresAt: number }>();

function getCachedSearch(queryHash: string): SearchResult[] | null {
  const cached = searchCache.get(queryHash);
  if (cached && cached.expiresAt > Date.now()) return cached.results;
  return null;
}
```

### Estimated Latencies

| Step | Latency | Parallelizable |
|------|---------|----------------|
| Scribe (intent + expansion) | 200-500ms | No (first step) |
| Embed query | 50-100ms | — |
| Vector search | 20-50ms | Yes (parallel with FTS) |
| FTS search | 10-30ms | Yes (parallel with vector) |
| Merge results | <5ms | — |
| Cohere rerank | 200-400ms | No (needs candidates) |
| Context assembly | <10ms | — |
| Claude first token | 200-500ms | — |
| **Total to first token** | **~700-1600ms** | |

---

## Database Schema (Reference)

See [ATOM_V2_BACKEND.md — Migration 009](../ATOM_V2_BACKEND.md#migration-009-vector-search-009_vector_searchsql) for the full `content_chunks` table schema.

Key columns:
- `embedding vector(384)` — BGE-small output
- `fts tsvector` — auto-generated from content
- `metadata JSONB` — heading hierarchy, NMC codes, high-yield flags

---

## Cross-References

- **Gateway orchestration** → [ATOM_GATEWAY_SPEC.md](./ATOM_GATEWAY_SPEC.md)
- **Memory retrieval** → [ATOM_MEMORY_SPEC.md](./ATOM_MEMORY_SPEC.md)
- **Scribe + Retriever + Critic agent details** → [ATOM_AGENTS_SPEC.md](./ATOM_AGENTS_SPEC.md)
- **Content directory structure** → [CODEBASE_GUIDE.md](../CODEBASE_GUIDE.md)
- **Current v1 search implementation** → `src/app/api/chat/route.ts`
