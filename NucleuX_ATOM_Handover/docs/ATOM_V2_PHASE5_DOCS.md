# ATOM v2: Phase 5 Documentation

This document outlines the components implemented during Phase 5 (Plugin Ecosystem) of the ATOM v2 backend migration. The goal of this phase was to build out the "Skills-as-Markdown" infrastructure, allowing the AI's capabilities to be extended dynamically without hardcoding new logic into the main routing pipeline.

## Components Built

1. **Database Schema (`011_atom_markethub.sql`)**
   - **`atom_plugins`**: Acts as the central registry for both first-party (Core) and community-driven plugins. Instead of raw code, plugins define their logic as Markdown system prompts.
   - **`user_plugins`**: Tracks individual user installations, allowing users to enable/disable plugins globally or per-room.
   - **`plugin_analytics` & `plugin_reviews`**: Tables required to build a fully-fledged community marketplace (MarketHub) in the future.

2. **The Router Agent (`src/lib/atom/agents/router.ts`)**
   - **`getActivePlugins(userId, room)`**: Interrogates the database to find which plugins the user has turned on, mapping them against the specific room they are currently in (e.g., the Challenger shouldn't load in the CBME room, but should load in the Arena).
   - **`buildPluginContext(plugins)`**: Concatenates the "Skills-as-Markdown" instructions from all active plugins into a unified system prompt block.

3. **Skills Directory (`skills/plugins/`)**
   - **`assessor/SKILL.md`**: A first-party skill that turns ATOM into a Socratic quizmaster, forcing the student to arrive at the answer themselves.
   - **`challenger/SKILL.md`**: A first-party skill that generates complex, 2nd-order clinical vignettes to test clinical reasoning.

## Integration

The Router was woven into `src/app/api/chat/route.ts`:

1. **Dynamic Injection**: Just before the system prompt is finalized, the Router pulls down the user's active skills.
2. **Context Assembly**: The skills are appended to the system prompt. Because Claude 3.5 Sonnet handles long contexts extraordinarily well, we can dynamically load multiple skills without degrading core performance.
