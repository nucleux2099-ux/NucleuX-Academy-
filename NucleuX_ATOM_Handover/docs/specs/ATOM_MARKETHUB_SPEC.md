# ATOM MarketHub — Plugin Marketplace Specification

> **Layer 5 of 5** | Part of the [ATOM v2 Backend Architecture](../ATOM_V2_BACKEND.md)
> Inspired by [OpenClaw's ClawHub](https://openclaw.ai/) — a community marketplace for AI agent skills, with lessons learned from their supply chain security incidents.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Plugin SDK](#2-plugin-sdk)
3. [Publishing Workflow](#3-publishing-workflow)
4. [Database Schema](#4-database-schema)
5. [Discovery & Recommendations](#5-discovery--recommendations)
6. [Revenue Model](#6-revenue-model)
7. [Security](#7-security)
8. [API Endpoints](#8-api-endpoints)
9. [Creator Dashboard](#9-creator-dashboard)
10. [Cross-References](#10-cross-references)

---

## 1. Overview

MarketHub transforms NucleuX Academy from a **product** into a **platform**. Instead of building every ATOM capability in-house, MarketHub enables:

1. **First-party plugins** — NucleuX team builds the core 10 plugins (Assessor, Challenger, etc.)
2. **Third-party plugins** — Medical educators, subject experts, and developers create specialized plugins
3. **Community plugins** — Open contributions reviewed and published
4. **Premium plugins** — Paid plugins with revenue sharing (70% creator / 30% NucleuX)

### Vision

A medical student preparing for NEET-PG installs the "NEET-PG Mastery Coach" plugin ($5/month). A surgery professor publishes the "Surgical Anatomy Interactive" plugin (free). An ed-tech developer creates a "Spaced Repetition Optimizer" plugin and earns revenue from 10,000 students using it.

---

## 2. Plugin SDK

### Core Interface

```typescript
interface ATOMPlugin {
  // Identity
  id: string;                         // "nucleux.assessor.v1" or "creator.plugin-name.v1"
  name: string;                       // "Assessor"
  description: string;                // "Scores MCQ responses and evaluates clinical reasoning"
  version: string;                    // semver: "1.0.0"
  author: string;                     // "NucleuX Team" or creator name
  category: PluginCategory;

  // Configuration
  defaultRooms: RoomId[];             // rooms where this activates by default
  requiredCoreAgents: CoreAgentId[];  // core agents this plugin depends on
  permissions: PluginPermission[];    // what the plugin can access

  // System Prompt Fragment (injected when active)
  systemPrompt: string;

  // Capabilities
  skills: PluginSkill[];

  // Execution (for plugins with custom logic beyond prompt injection)
  execute?(context: PluginContext): Promise<PluginResult>;

  // Lifecycle hooks
  onInstall?(userId: string): Promise<void>;
  onUninstall?(userId: string): Promise<void>;
  onActivate?(room: RoomId): void;
  onDeactivate?(room: RoomId): void;

  // Configuration schema (what users can customize)
  configSchema?: JSONSchema;
}

type PluginCategory =
  | 'evaluation'       // grading, scoring, assessment
  | 'generation'       // question generation, content creation
  | 'analytics'        // data interpretation, insights
  | 'clinical'         // clinical reasoning, DDx, management
  | 'exam'             // exam strategy, pattern recognition
  | 'notes'            // note-taking, flashcard creation
  | 'discussion'       // debate moderation, fact-checking
  | 'wellbeing'        // habit tracking, burnout prevention
  | 'curriculum'       // CBME mapping, competency tracking
  | 'subject'          // subject-specific deep expertise
  | 'community';       // third-party community plugins

type CoreAgentId = 'scribe' | 'retriever' | 'critic' | 'memorist' | 'router';

type PluginPermission =
  | 'read_memory'      // read student's memories
  | 'write_memory'     // create new memories
  | 'read_analytics'   // read study session data
  | 'read_progress'    // read topic progress data
  | 'read_mcq_history' // read MCQ attempt history
  | 'ui_actions';      // trigger client-side UI actions
```

### Skill & Context Interfaces

```typescript
interface PluginSkill {
  name: string;                 // "grade_mcq", "generate_flashcard"
  description: string;
  inputSchema: JSONSchema;      // what data this skill needs
  outputSchema: JSONSchema;     // what it returns
}

interface PluginContext {
  room: RoomId;
  userMessage: string;
  conversationHistory: ATOMMessage[];
  retrievedChunks: ContentChunk[];
  userMemory: MemoryEntry[];
  studentProfile: StudentProfile;
  topicContext?: ATOMPageContext;
  pluginConfig: Record<string, unknown>;  // user-specific config
}

interface PluginResult {
  contextInjection?: string;        // text injected into ATOM's context
  directResponse?: string;          // bypass ATOM generation (rare)
  memoryWrites?: MemoryCandidate[]; // new memories to persist
  uiActions?: UIAction[];           // client-side actions
}

interface UIAction {
  type: 'navigate' | 'open_panel' | 'show_card' | 'show_notification' | 'download';
  payload: Record<string, unknown>;
}
```

---

## 3. Publishing Workflow

```
┌───────────┐     ┌──────────────┐     ┌────────────────┐     ┌────────────┐
│  Create    │────▶│  Test Locally │────▶│  Submit for    │────▶│  Published │
│  Plugin    │     │  (Sandbox)   │     │  Review        │     │  on Hub    │
└───────────┘     └──────────────┘     └────────────────┘     └────────────┘
                                              │
                                    ┌─────────┴─────────┐
                                    │  Automated Checks  │
                                    │  + Manual Review   │
                                    └───────────────────┘
```

### Step 1: Create Plugin

Creator writes a `SKILL.md` file with YAML frontmatter + natural language instructions:

```markdown
---
id: myname.neet-mastery-coach.v1
name: NEET-PG Mastery Coach
version: 1.0.0
author: Dr. Example
category: exam
defaultRooms: [training, arena]
requiredCoreAgents: [scribe, retriever, memorist]
permissions: [read_memory, read_mcq_history]
price: 500  # cents/month ($5)
---

## Plugin: NEET-PG Mastery Coach

Specialized exam coaching for NEET-PG preparation.

### Behaviors
- Analyze PYQ patterns specific to NEET-PG (last 10 years)
- Identify high-yield topics by frequency analysis
- Create exam-day strategy: time allocation per subject
- Track weak areas against NEET-PG weightage
- Generate NEET-specific practice sets with recent pattern questions
- Elimination technique training with timed practice
```

### Step 2: Test Locally (Sandbox)

```typescript
// Creator testing API
// POST /api/atom/plugins/test
{
  skillContent: "...",           // SKILL.md content
  testMessages: [
    { role: "user", content: "Give me a NEET-PG strategy for Surgery" }
  ],
  room: "training"
}
// Returns: ATOM response with plugin active
```

### Step 3: Submit for Review

```typescript
// POST /api/atom/plugins/publish
{
  skillContent: "...",
  metadata: {
    name: "NEET-PG Mastery Coach",
    description: "...",
    category: "exam",
    price: 500,
    screenshots: ["url1", "url2"],
    changelog: "Initial release",
  }
}
```

### Step 4: Review Process

**Automated checks:**
- YAML frontmatter validation
- Required fields present (id, name, version, author, category, defaultRooms)
- System prompt length < 2,000 tokens
- No prompt injection patterns detected (see Security section)
- No prohibited content (medical misinformation markers)

**Manual review (for premium plugins):**
- NucleuX team reviews prompt quality
- Tests with sample conversations
- Checks for medical accuracy claims
- Approves or requests changes

### Step 5: Published

Plugin appears in MarketHub with name, description, author, category, default rooms, required permissions, screenshots, price, and install button.

---

## 4. Database Schema

### `atom_plugins` Table (Extended)

```sql
CREATE TABLE atom_plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,            -- markdown, shown on detail page
  version TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id),
  author_name TEXT NOT NULL,
  category TEXT NOT NULL,
  default_rooms TEXT[] NOT NULL,
  required_core_agents TEXT[] DEFAULT '{}',
  permissions TEXT[] DEFAULT '{}',
  system_prompt TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]',
  config_schema JSONB DEFAULT '{}',
  is_core BOOLEAN DEFAULT FALSE,
  is_free BOOLEAN DEFAULT TRUE,
  price_cents INTEGER DEFAULT 0,
  install_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  screenshots TEXT[] DEFAULT '{}',
  changelog JSONB DEFAULT '[]',     -- [{version, date, changes}]
  is_published BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  is_deprecated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plugins_category ON atom_plugins(category);
CREATE INDEX idx_plugins_published ON atom_plugins(is_published, is_approved);
CREATE INDEX idx_plugins_popular ON atom_plugins(install_count DESC);
CREATE INDEX idx_plugins_rating ON atom_plugins(rating DESC);
```

### `plugin_analytics` Table

```sql
CREATE TABLE plugin_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plugin_id TEXT REFERENCES atom_plugins(plugin_id),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  room TEXT NOT NULL,
  invocation_count INTEGER DEFAULT 0,
  last_invoked_at TIMESTAMPTZ,
  period_start DATE NOT NULL,       -- daily aggregation
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(plugin_id, user_id, period_start)
);

CREATE INDEX idx_plugin_analytics ON plugin_analytics(plugin_id, period_start);
```

### RLS Policies

```sql
-- Plugins: published visible to all, authors manage own
ALTER TABLE atom_plugins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published plugins visible" ON atom_plugins
  FOR SELECT USING (
    (is_published = TRUE AND is_approved = TRUE)
    OR author_id = auth.uid()
  );

CREATE POLICY "Authors manage plugins" ON atom_plugins
  FOR INSERT WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors update plugins" ON atom_plugins
  FOR UPDATE USING (author_id = auth.uid());

-- Analytics: users see own usage, creators see aggregate
ALTER TABLE plugin_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own analytics" ON plugin_analytics
  FOR SELECT USING (user_id = auth.uid());
```

---

## 5. Discovery & Recommendations

### Browse

- **By category:** 11 categories (evaluation, generation, analytics, clinical, exam, notes, discussion, wellbeing, curriculum, subject, community)
- **By rating:** Top rated (≥4.0 stars with ≥10 reviews)
- **By popularity:** Most installed
- **By room:** "Best plugins for Training Centre"

### Search

```typescript
// GET /api/atom/plugins?q=neet&category=exam&sort=popular
interface PluginSearchParams {
  q?: string;              // search name + description
  category?: PluginCategory;
  room?: RoomId;
  isFree?: boolean;
  sort?: 'popular' | 'rating' | 'newest';
  limit?: number;
  offset?: number;
}
```

### Personalized Recommendations

```
"Recommended for you" algorithm:
1. Look at user's most-used rooms
2. Find popular plugins for those rooms that user hasn't installed
3. Factor in user's weak areas (recommend plugins that address them)
4. Factor in exam target (recommend exam-specific plugins)
5. Sort by relevance score
```

---

## 6. Revenue Model

### Pricing Tiers

| Tier | Price | Examples |
|------|-------|---------|
| **Free** | $0 | Core 10 plugins, community contributions |
| **Standard** | $1-5/month | Subject-specific plugins, exam strategy |
| **Premium** | $5-15/month | Advanced analytics, specialized coaching |
| **Bundle** | $10-30/month | Plugin packs (e.g., "NEET-PG Complete") |

### Revenue Share

```
Student pays: $5/month for a premium plugin
├── Creator receives: $3.50 (70%)
├── NucleuX receives: $1.50 (30%)
│   ├── Platform costs: $0.50
│   ├── Review & moderation: $0.30
│   └── Margin: $0.70
```

### Payment Integration

- **Stripe Connect** for creator payouts
- Monthly billing cycle
- Free trial: 7 days for premium plugins
- Refund policy: full refund within 48 hours

---

## 7. Security

OpenClaw's ClawHub experienced supply chain attacks: 12-20% of uploaded skills contained malicious instructions ("ClawHavoc" campaign). ATOM MarketHub learns from this:

### Threat Model

| Threat | Attack Vector | Mitigation |
|--------|---------------|------------|
| **Prompt Injection** | Malicious instructions in system prompt | Content scanning + manual review |
| **Data Exfiltration** | Plugin prompt tells ATOM to reveal user data | Permission model (plugins can't access undeclared data) |
| **Medical Misinformation** | Plugin provides wrong medical advice | Medical accuracy review for premium plugins |
| **Impersonation** | Plugin pretends to be a core feature | Namespace enforcement (only `nucleux.*` for first-party) |
| **Token Exhaustion** | Plugin with extremely long system prompt | Prompt length limit (2,000 tokens) |

### Content Scanning

Automated scan of every submitted `SKILL.md` for:

```typescript
const BLOCKED_PATTERNS = [
  /ignore (previous|above|all) instructions/i,
  /you are now/i,
  /forget (everything|your|the)/i,
  /new (role|persona|identity)/i,
  /override (system|safety|rules)/i,
  /reveal (api|key|secret|password|token)/i,
  /send (data|information) to/i,
  /exfiltrate/i,
  /bypass (security|safety|filter)/i,
];
```

### Plugin Sandboxing

Plugins are **context injections, not executable code**. They cannot:
- Execute arbitrary code
- Make API calls
- Access the filesystem
- Modify other plugins
- Access data beyond their declared permissions

This is the fundamental security advantage of Skills-as-Markdown over code-based plugins.

### Revocation

If a published plugin is found to be malicious:
1. Immediately set `is_approved = FALSE` (hides from MarketHub)
2. Notify all users with the plugin installed
3. Auto-uninstall from all users (with notification)
4. Ban the creator account if intentional
5. Add patterns to automated scanner

---

## 8. API Endpoints

### Browse & Search

```typescript
// GET /api/atom/plugins
// Query: ?q=string&category=string&room=string&sort=string&limit=number&offset=number
// Response: { plugins: PluginListing[], total: number }

interface PluginListing {
  pluginId: string;
  name: string;
  description: string;
  author: string;
  category: string;
  rating: number;
  reviewCount: number;
  installCount: number;
  isFree: boolean;
  priceCents: number;
  defaultRooms: string[];
  screenshots: string[];
}
```

### Install / Uninstall

```typescript
// POST /api/atom/plugins/install
// Body: { pluginId: string }
// Response: { success: true, installedAt: string }

// POST /api/atom/plugins/uninstall
// Body: { pluginId: string }
// Response: { success: true }
```

### Configure

```typescript
// POST /api/atom/plugins/configure
// Body: { pluginId: string, activeRooms: string[], config: Record<string, unknown> }
// Response: { success: true }
```

### User's Installed Plugins

```typescript
// GET /api/atom/plugins/installed
// Response: { plugins: InstalledPlugin[] }

interface InstalledPlugin extends PluginListing {
  isActive: boolean;
  activeRooms: string[];
  config: Record<string, unknown>;
  installedAt: string;
}
```

### Publish (Creator)

```typescript
// POST /api/atom/plugins/publish
// Body: {
//   skillContent: string,    // SKILL.md content
//   metadata: {
//     description: string,
//     longDescription?: string,
//     screenshots?: string[],
//     price?: number,
//     changelog?: string,
//   }
// }
// Response: { pluginId: string, status: 'pending_review' | 'published' }
```

### Reviews

```typescript
// POST /api/atom/plugins/[pluginId]/reviews
// Body: { rating: 1-5, reviewText: string }

// GET /api/atom/plugins/[pluginId]/reviews
// Response: { reviews: Review[], averageRating: number }
```

---

## 9. Creator Dashboard

Available at `/atom/markethub/creator` for users who have published plugins.

### Features

| Feature | Description |
|---------|-------------|
| **My Plugins** | List of published/draft plugins |
| **Analytics** | Install count, active users, invocations per day |
| **Revenue** | Monthly earnings, payout history, pending balance |
| **Reviews** | All reviews with ability to respond |
| **Versions** | Version history, publish new versions |
| **Settings** | Update description, screenshots, pricing |

---

## 10. Cross-References

- **Agent specifications** → [ATOM_AGENTS_SPEC.md](./ATOM_AGENTS_SPEC.md)
- **Plugin SDK types** → [ATOM_AGENTS_SPEC.md — Skills-as-Markdown](./ATOM_AGENTS_SPEC.md)
- **Gateway plugin execution** → [ATOM_GATEWAY_SPEC.md](./ATOM_GATEWAY_SPEC.md)
- **MarketHub UI** → [ATOM_FRONTEND_SPEC.md](./ATOM_FRONTEND_SPEC.md)
- **Database schema overview** → [ATOM_V2_BACKEND.md](../ATOM_V2_BACKEND.md)

---

*ATOM MarketHub Spec · NucleuX Academy · Last updated: 2026-02-22*
