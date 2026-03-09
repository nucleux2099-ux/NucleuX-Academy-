# ATOM Memory System — Specification

> **Layer 3 of 5** | Part of the [ATOM v2 Backend Architecture](../ATOM_V2_BACKEND.md)
> Inspired by [OpenClaw's memory architecture](https://openclaw.ai/) — human-readable persistent memory with hybrid vector + keyword search.

---

## Overview

Memory is what transforms ATOM from a stateless chatbot into a **thinking partner**. Without memory, every conversation starts from zero. With memory, ATOM:

- Remembers what the student is weak at and adjusts teaching accordingly
- Knows which topics have been mastered and skips unnecessary review
- Recalls learning preferences (mnemonics vs diagrams, morning vs night)
- Tracks exam goals and adjusts recommendations over time
- Detects confidence miscalibration (overconfidence, underconfidence)

OpenClaw stores memory as flat Markdown/YAML files — human-readable and `git diff`-able. ATOM adapts this for Supabase: structured rows with vector embeddings for semantic retrieval, managed by the **Memorist** core agent.

---

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     ATOM Memory System                         │
│                                                                │
│  ┌──────────────────────┐    ┌──────────────────────────────┐ │
│  │   SHORT-TERM MEMORY   │    │     LONG-TERM MEMORY          │ │
│  │   (Session Scope)     │    │     (Persistent — Supabase)   │ │
│  │                       │    │                               │ │
│  │ • Messages in current │    │ • atom_user_memory table      │ │
│  │   conversation        │    │ • Vector embeddings for       │ │
│  │ • Current room + topic│    │   semantic retrieval          │ │
│  │ • Active plugin states│    │ • 7 memory types              │ │
│  │ • Agent intermediate  │    │ • Relevance decay over time   │ │
│  │   results             │    │ • Cross-room accessible       │ │
│  │                       │    │ • User-editable               │ │
│  │ Lives in: SessionState│    │ Lives in: Supabase PostgreSQL │ │
│  │ Lifetime: Conversation│    │ Lifetime: Until archived      │ │
│  └──────────────────────┘    └──────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │   CONVERSATION ARCHIVE                                    │ │
│  │   (atom_conversations table)                              │ │
│  │                                                           │ │
│  │ • Full message history per conversation                   │ │
│  │ • Room + topic context                                    │ │
│  │ • Resumable (conversationId in URL)                       │ │
│  │ • Searchable by title (auto-generated summary)            │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

---

## Memory Types (7 Types)

### 1. `topic_mastery`

| Property | Value |
|----------|-------|
| **Description** | Student has demonstrated understanding of a topic |
| **Example** | "Student has mastered GERD pathophysiology — correctly answered 8/10 questions and explained lower esophageal sphincter mechanism unprompted" |
| **Written When** | After successful quiz performance (>80% accuracy), after clear explanation without hints, after Teaching Centre mastery |
| **Read When** | Library (skip basics, go deeper), Training Centre (increase difficulty), Desk (exclude from study plan) |
| **Decay** | Slow — score × 0.99 daily (~69 days to halve). Mastery should be durable. |
| **Rooms** | Library, Training Centre, Desk, CBME |

### 2. `weak_area`

| Property | Value |
|----------|-------|
| **Description** | Student repeatedly struggles with a concept |
| **Example** | "Consistently confuses Type 1 vs Type 2 diabetes pathology — mixed up autoimmune destruction and insulin resistance in 3 separate conversations" |
| **Written When** | After 2+ wrong answers on same topic, after confusion detected in explanation, after confidence miscalibration |
| **Read When** | ALL rooms — weak areas are always loaded to personalize every interaction |
| **Decay** | Normal — score × 0.97 daily (~23 days). Recent struggles matter most. |
| **Priority** | HIGH — weak areas are always included in memory context, never truncated |
| **Rooms** | All rooms |

### 3. `preference`

| Property | Value |
|----------|-------|
| **Description** | Student's stated or observed learning preferences |
| **Example** | "Prefers mnemonics over diagrams for Pharmacology. Likes analogy-based explanations. Responds well to clinical case framing." |
| **Written When** | After explicit statement ("I prefer..."), after observed engagement pattern (more follow-up questions on analogy-based answers) |
| **Read When** | Library (adapt explanation style), Classroom (match teaching approach), Training Centre (frame questions accordingly) |
| **Decay** | Very slow — score × 0.995 daily (~138 days). Preferences are stable. |
| **Rooms** | Library, Classroom, Training Centre |

### 4. `insight`

| Property | Value |
|----------|-------|
| **Description** | ATOM's observation about the student's learning patterns |
| **Example** | "Student's confidence in Cardiology (self-rated 80%) exceeds actual accuracy (55%). Dunning-Kruger territory — needs calibration exercises." |
| **Written When** | After confidence vs accuracy mismatch detected, after Bloom's level analysis, after unusual performance patterns |
| **Read When** | Backstage (primary data source), Desk (study plan adjustments), Arena (competition strategy) |
| **Decay** | Normal — score × 0.97 daily |
| **Rooms** | Backstage, Desk, Arena |

### 5. `goal`

| Property | Value |
|----------|-------|
| **Description** | Student's exam targets, timeline, and ambitions |
| **Example** | "Target: NEET-PG 2027, aiming for Radiology seat. Estimated rank needed: <5000. Current trajectory suggests 8000-12000 based on test scores." |
| **Written When** | From onboarding profile, from explicit statement, from exam countdown page updates |
| **Read When** | Desk (plan orientation), Arena (motivation framing), Training Centre (exam-specific tips), CBME (curriculum prioritization) |
| **Decay** | Very slow — score × 0.995 daily. Goals persist until exam date passes. |
| **Priority** | HIGH — goals always included in memory context |
| **Rooms** | Desk, Arena, Training Centre, CBME |

### 6. `study_pattern`

| Property | Value |
|----------|-------|
| **Description** | Observed study behavior patterns |
| **Example** | "Most productive between 9-11 PM. Averages 45 min sessions with 5 min breaks. Studies Surgery most on Tuesdays. MCQ accuracy drops after 60 minutes." |
| **Written When** | After analytics pattern detected (study_sessions data analysis), after streak milestones |
| **Read When** | Desk (schedule optimization), Backstage (metacognition), Arena (stamina insights) |
| **Decay** | Normal — score × 0.97 daily. Recent patterns override older ones. |
| **Rooms** | Desk, Backstage |

### 7. `clinical_connection`

| Property | Value |
|----------|-------|
| **Description** | A meaningful learning moment where abstract knowledge clicked through clinical application |
| **Example** | "Understood acid-base balance through ABG interpretation case in Emergency — the Henderson-Hasselbalch equation finally made sense when applied to a real patient with metabolic acidosis" |
| **Written When** | After a breakthrough explanation, after successful clinical case navigation, after student explicitly says "now I get it" |
| **Read When** | Library (reference as anchor for new learning), Training Centre (build on existing clinical intuition) |
| **Decay** | Slow — score × 0.99 daily. Good learning moments should be durable. |
| **Rooms** | Library, Training Centre |

---

## Memorist Agent Protocol

The Memorist is one of ATOM's 5 core agents. It executes twice per request:

### Pre-Generation Read

Before Claude generates a response, the Memorist retrieves relevant memories:

```typescript
async function memoristRead(
  userId: string,
  room: RoomId,
  query: string
): Promise<MemoryContext> {
  // Step 1: Always include — weak areas and goals (never truncated)
  const criticalMemories = await supabase
    .from('atom_user_memory')
    .select('*')
    .eq('user_id', userId)
    .in('memory_type', ['weak_area', 'goal'])
    .gte('relevance_score', 0.1)
    .order('relevance_score', { ascending: false })
    .limit(5);

  // Step 2: Recent memories for this room (last 7 days)
  const recentMemories = await supabase
    .from('atom_user_memory')
    .select('*')
    .eq('user_id', userId)
    .eq('source_room', room)
    .gte('created_at', sevenDaysAgo())
    .gte('relevance_score', 0.1)
    .order('created_at', { ascending: false })
    .limit(5);

  // Step 3: Semantic search — find memories relevant to current query
  const queryEmbedding = await embedText(query);
  const semanticMemories = await supabase.rpc('search_memories', {
    p_user_id: userId,
    p_embedding: queryEmbedding,
    p_limit: 5,
    p_min_score: 0.3,
  });

  // Step 4: Deduplicate and assemble within 2,000 token budget
  return assembleMemoryContext(criticalMemories, recentMemories, semanticMemories);
}
```

### Semantic Memory Search (RPC Function)

```sql
CREATE OR REPLACE FUNCTION search_memories(
  p_user_id UUID,
  p_embedding vector(384),
  p_limit INTEGER DEFAULT 5,
  p_min_score FLOAT DEFAULT 0.3
)
RETURNS TABLE (
  id UUID,
  memory_type TEXT,
  content TEXT,
  relevance_score FLOAT,
  similarity FLOAT,
  source_room TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.memory_type,
    m.content,
    m.relevance_score,
    1 - (m.embedding <=> p_embedding) AS similarity,
    m.source_room,
    m.created_at
  FROM atom_user_memory m
  WHERE
    m.user_id = p_user_id
    AND m.embedding IS NOT NULL
    AND m.relevance_score >= 0.1
    AND 1 - (m.embedding <=> p_embedding) >= p_min_score
  ORDER BY similarity DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Post-Generation Write

After Claude completes its response, the Memorist extracts new observations:

```typescript
async function memoristWrite(
  userId: string,
  room: RoomId,
  conversation: ATOMMessage[],
  existingMemories: MemoryEntry[]
): Promise<void> {
  // Use Claude to extract memory-worthy observations
  const extractionPrompt = `
You are the Memorist — ATOM's memory agent. Analyze this conversation and extract
observations worth remembering about this student.

## Rules
- Only extract genuinely new information (not already in existing memories)
- Each memory must be a single, specific observation
- Use natural language — these are notes about a student, not database entries
- Classify each as: topic_mastery, weak_area, preference, insight, goal, study_pattern, or clinical_connection
- If nothing new was learned, return empty array

## Existing memories (don't duplicate these):
${existingMemories.map(m => `- [${m.memory_type}] ${m.content}`).join('\n')}

## Conversation (room: ${room}):
${conversation.map(m => `${m.role}: ${m.content}`).join('\n')}

Respond as JSON array:
[
  { "type": "weak_area", "content": "Struggles with acid-base interpretation..." },
  { "type": "topic_mastery", "content": "Demonstrated solid understanding of..." }
]
`;

  const newMemories = await extractMemories(extractionPrompt);

  // Deduplicate: semantic similarity check against existing memories
  const deduplicated = await deduplicateMemories(newMemories, existingMemories);

  // Embed and store each new memory
  for (const memory of deduplicated) {
    const embedding = await embedText(memory.content);
    await supabase.from('atom_user_memory').insert({
      user_id: userId,
      memory_type: memory.type,
      content: memory.content,
      embedding,
      relevance_score: 1.0,
      source_room: room,
      topic_slug: currentTopicSlug ?? null,
    });
  }
}
```

### Deduplication

Before storing a new memory, check if a semantically similar one already exists:

```typescript
async function deduplicateMemories(
  newMemories: MemoryCandidate[],
  existing: MemoryEntry[]
): Promise<MemoryCandidate[]> {
  const result: MemoryCandidate[] = [];

  for (const candidate of newMemories) {
    const candidateEmbedding = await embedText(candidate.content);

    // Check cosine similarity against existing memories of same type
    const similar = existing.filter(e => {
      if (e.memory_type !== candidate.type) return false;
      if (!e.embedding) return false;
      const similarity = cosineSimilarity(candidateEmbedding, e.embedding);
      return similarity > 0.85;  // threshold: 85% similar = duplicate
    });

    if (similar.length === 0) {
      result.push(candidate);
    } else {
      // If duplicate found but new info adds detail, update existing instead
      // (future enhancement)
    }
  }

  return result;
}
```

---

## Memory Decay

Memories decay over time to ensure relevance. Recent observations matter more than old ones.

### Decay Formula

```
relevance_score(t+1) = relevance_score(t) × decay_rate
```

| Memory Type | Decay Rate | Half-Life | Rationale |
|---|---|---|---|
| `topic_mastery` | 0.99/day | ~69 days | Mastery is durable but can fade |
| `weak_area` | 0.97/day | ~23 days | Recent struggles are most relevant |
| `preference` | 0.995/day | ~138 days | Preferences are very stable |
| `insight` | 0.97/day | ~23 days | Insights need refreshing |
| `goal` | 0.995/day | ~138 days | Goals persist until exam date |
| `study_pattern` | 0.97/day | ~23 days | Patterns change frequently |
| `clinical_connection` | 0.99/day | ~69 days | Good learning moments are durable |

### Refresh on Access

When ATOM references a memory in a response, that memory's relevance resets to 1.0:

```typescript
async function refreshMemory(memoryId: string): Promise<void> {
  await supabase
    .from('atom_user_memory')
    .update({ relevance_score: 1.0 })
    .eq('id', memoryId);
}
```

### Daily Decay Cron (Supabase Edge Function)

```sql
-- Run daily at 3 AM UTC
UPDATE atom_user_memory
SET relevance_score = relevance_score * CASE memory_type
  WHEN 'topic_mastery' THEN 0.99
  WHEN 'weak_area' THEN 0.97
  WHEN 'preference' THEN 0.995
  WHEN 'insight' THEN 0.97
  WHEN 'goal' THEN 0.995
  WHEN 'study_pattern' THEN 0.97
  WHEN 'clinical_connection' THEN 0.99
  ELSE 0.97
END
WHERE relevance_score >= 0.1;

-- Archive memories that have decayed below threshold
UPDATE atom_user_memory
SET relevance_score = 0, expires_at = NOW()
WHERE relevance_score < 0.1 AND relevance_score > 0;
```

---

## Conversation Compaction

Inspired by OpenClaw's session compaction — when a conversation gets very long, summarize older parts to save context tokens.

### When to Compact

- Conversation exceeds 30,000 tokens (history budget)
- Triggered during context assembly phase

### Compaction Process

1. Keep the **last 10 messages** verbatim (most relevant context)
2. Summarize older messages into a concise summary using Claude
3. **Before summarizing**: extract any memory-worthy observations (Memorist write)
4. Replace older messages with: `[Conversation summary: ...]`
5. Store the full original conversation in `atom_conversations.messages` (archival)

### Compaction Prompt

```
Summarize this conversation between ATOM and a medical student in 200 words or less.
Focus on: topics discussed, key questions asked, answers given, any learning breakthroughs or struggles.
Do NOT include greetings, pleasantries, or meta-conversation.

Conversation:
{older_messages}
```

---

## Privacy & User Control

### What Users Can Do

| Action | Where | Implementation |
|--------|-------|----------------|
| View all memories | `/settings/atom-memory` | Paginated list with filters |
| Search memories | Same page | Semantic search via embedding |
| Filter by type | Same page | Dropdown: all types or specific |
| Filter by room | Same page | Dropdown: all rooms or specific |
| Delete a memory | Click delete on card | Hard delete from `atom_user_memory` |
| Edit a memory | Click edit on card | Update content, re-embed |
| Pause memory | Toggle in settings | Set `user_preferences.atom_memory_enabled = false` |
| Resume memory | Toggle in settings | Set back to `true` |
| Export memories | Download button | JSON export of all memories |
| Clear all memories | Danger button in settings | Hard delete all with confirmation |

### RLS Policies

```sql
-- Users can only see/modify their own memories
ALTER TABLE atom_user_memory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their memories" ON atom_user_memory
  FOR ALL USING (auth.uid() = user_id);

-- Same for conversations
ALTER TABLE atom_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their conversations" ON atom_conversations
  FOR ALL USING (auth.uid() = user_id);
```

### Data Retention

| Data | Retention | Auto-Action |
|------|-----------|-------------|
| Active memories (score ≥ 0.1) | Indefinite | Decayed daily |
| Archived memories (score < 0.1) | 1 year | Auto-deleted after 1 year |
| Conversations | 6 months | Archived, then deleted at 1 year |
| Proactive insights | 30 days | Auto-deleted |

---

## Memory Context Assembly

How the Memorist formats memories for injection into ATOM's system prompt:

```typescript
function formatMemoryContext(memories: MemoryEntry[]): string {
  const grouped = groupBy(memories, 'memory_type');

  const parts: string[] = [];

  if (grouped.goal?.length) {
    parts.push('### Goals\n' + grouped.goal.map(m => `- ${m.content}`).join('\n'));
  }
  if (grouped.weak_area?.length) {
    parts.push('### Known Weak Areas (prioritize these)\n' + grouped.weak_area.map(m => `- ${m.content}`).join('\n'));
  }
  if (grouped.topic_mastery?.length) {
    parts.push('### Mastered Topics\n' + grouped.topic_mastery.map(m => `- ${m.content}`).join('\n'));
  }
  if (grouped.preference?.length) {
    parts.push('### Learning Preferences\n' + grouped.preference.map(m => `- ${m.content}`).join('\n'));
  }
  if (grouped.insight?.length) {
    parts.push('### Observations\n' + grouped.insight.map(m => `- ${m.content}`).join('\n'));
  }
  if (grouped.study_pattern?.length) {
    parts.push('### Study Patterns\n' + grouped.study_pattern.map(m => `- ${m.content}`).join('\n'));
  }
  if (grouped.clinical_connection?.length) {
    parts.push('### Learning Anchors\n' + grouped.clinical_connection.map(m => `- ${m.content}`).join('\n'));
  }

  return parts.join('\n\n');
}
```

---

## Database Schema (Reference)

See [ATOM_V2_BACKEND.md — Migration 010](../ATOM_V2_BACKEND.md#migration-010-atom-memory-010_atom_memorysql) for the full SQL.

Key tables:
- `atom_user_memory` — persistent student knowledge state with vector embeddings
- `atom_conversations` — conversation history archive

---

## Cross-References

- **Gateway orchestration (Memorist invocation)** → [ATOM_GATEWAY_SPEC.md](./ATOM_GATEWAY_SPEC.md)
- **RAG pipeline (shared embedding + search)** → [ATOM_RAG_PIPELINE_SPEC.md](./ATOM_RAG_PIPELINE_SPEC.md)
- **Memorist agent details** → [ATOM_AGENTS_SPEC.md](./ATOM_AGENTS_SPEC.md)
- **Memory UI** → [ATOM_FRONTEND_SPEC.md](./ATOM_FRONTEND_SPEC.md#memory-ui)
- **Proactive insights (heartbeat)** → [ATOM_GATEWAY_SPEC.md](./ATOM_GATEWAY_SPEC.md#heartbeat--proactivity)
