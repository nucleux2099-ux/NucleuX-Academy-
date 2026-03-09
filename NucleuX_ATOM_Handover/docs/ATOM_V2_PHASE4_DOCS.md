# ATOM v2: Phase 4 Documentation

This document outlines the components implemented during Phase 4 (Persistent Memory) of the ATOM v2 backend migration. The goal of this phase was to allow ATOM to remember user preferences, goals, topic mastery, and weak areas persistently across different sessions.

## Components Built

1. **Database Schema (`010_atom_memory.sql`)**
   - **`atom_conversations`**: Stores the raw transcript of sessions so they can be parsed asynchronously without slowing down real-time generation.
   - **`atom_user_memory`**: Stores individual nuggets of memory (e.g. `weak_area`, `topic_mastery`). Contains a `vector(384)` column for semantic lookups and a `relevance_score` to allow for forgetting curves over time.
   - **`apply_memory_decay()` RPC**: A database function that reduces the relevance of memories based on their type (e.g., topic mastery decays slowly, while a specific weak area might decay quickly if not reinforced).

2. **The Memorist Agent (`src/lib/atom/agents/memorist.ts`)**
   - **Pre-Read**: Before the LLM begins generating a response, the Memorist fetches global memories (like career goals) and semantically searches for relevant past observations based on the current query. These are injected into the system prompt.
   - **Post-Write**: A "fire and forget" background function that runs after a stream is completed. It takes the last few messages, sends them to a smaller, faster model (`claude-3-5-haiku`) to extract any structural learning insights. If an insight is found, it generates an embedding and saves it to `atom_user_memory`.

3. **Memory Decay Cron Job (`supabase/functions/decay-memory/index.ts`)**
   - An isolated Edge Function designed to be triggered daily via `pg_cron` or Supabase Edge Function scheduling.
   - It executes the `apply_memory_decay()` and `cleanup_proactive_insights()` RPCs to archive expired data and enforce retention policies.

## Integration

The Memorist was woven into `src/app/api/chat/route.ts`:

1. **Pre-Read Payload Injection**: Sits right before the system prompt generation. If `preReadMemories()` returns context, it appends it softly to the prompt.
2. **Post-Write Background Execution**: Once `client.messages.stream()` initiates, a detached Promise executes `extractAndStoreMemory()` securely in the background, ensuring no latency hit to the end user.
