# NucleuX Academy - Coding Conventions

## Language and Framework

- **TypeScript** with `strict: true` mode
- **Next.js 16** App Router (not Pages Router)
- **React 19** with Server Components as default
- **ES2017** target (for `async/await` support in all environments)

---

## File Naming

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `AtomWidget.tsx`, `LearningProgress.tsx` |
| Client components | PascalCase with `Client` suffix | `LibraryClient.tsx`, `ClassroomClient.tsx` |
| Pages | `page.tsx` (Next.js convention) | `src/app/(app)/desk/page.tsx` |
| Layouts | `layout.tsx` | `src/app/(app)/layout.tsx` |
| API routes | `route.ts` | `src/app/api/chat/route.ts` |
| Type files | `types.ts` | `src/lib/backstage/types.ts` |
| Store files | `store.ts` | `src/lib/decks/store.ts` |
| Server action files | `actions.ts` | `src/lib/backstage/actions.ts` |
| Utility files | camelCase | `utils.ts`, `mindmap-engine.ts` |
| URL slugs / directories | kebab-case | `exam-centre`, `community-medicine` |
| Constants | UPPER_SNAKE_CASE | `SUBJECTS`, `TOPIC_REGISTRY`, `CONTENT_BASE` |
| Environment variables | UPPER_SNAKE_CASE | `ANTHROPIC_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL` |

---

## Component Patterns

### Server + Client Split Pattern
Most feature pages use a split approach:

```typescript
// page.tsx (Server Component - data fetching)
export default async function LibraryPage() {
  const subjects = await getSubjects();
  return <LibraryClient subjects={subjects} />;
}

// LibraryClient.tsx (Client Component - interactivity)
"use client";
export default function LibraryClient({ subjects }: { subjects: Subject[] }) {
  const [search, setSearch] = useState("");
  // ... interactive logic
}
```

### "use client" Directive
Client components always have `"use client"` as the first line. Server Components (default) never have this directive.

### Component Structure
Components generally follow this order:
1. `"use client"` directive (if client component)
2. Imports
3. Types/interfaces
4. Helper functions
5. Component function
6. Export

---

## Styling

### Tailwind CSS v4
- Configured via PostCSS plugin (`@tailwindcss/postcss`)
- No `tailwind.config.js` - CSS-first configuration
- Entry point: `src/app/globals.css`

### Color Palette (Dark Theme)
| Token | Hex | Usage |
|---|---|---|
| Base background | `#0F172A` | Root `<html>` background |
| Card background | `#2D3E50` | Header, sidebar |
| Secondary card | `#3A4D5F` | Input backgrounds |
| Borders | `rgba(232,224,213,0.08)` | Subtle borders |
| Primary text | `#E8E0D5` | Warm off-white |
| Secondary text | `#A0B0BC` | Muted text |
| Accent (teal) | `#5BB3B3` | Primary brand color, active states |
| Accent (gold) | `#C9A86C` | Special badges, Community room |
| Error/logout | `#E57373` | Destructive actions |

### Room Colors
Each room has a signature color used in sidebar and room-specific UI:
| Room | Color | Hex |
|---|---|---|
| Backstage | Amber | `#F59E0B` |
| My Desk | Teal | `#5BB3B3` |
| Library | Sage | `#7BA69E` |
| Classroom | Sky | `#6BA8C9` |
| Training Centre | Indigo | `#6366F1` |
| CBME | Pink | `#E879F9` |
| Common Room | Gold | `#C9A86C` |
| Arena | Bright Gold | `#D4AF37` |

### Class Merge Utility
Always use `cn()` for conditional Tailwind classes:
```typescript
import { cn } from "@/lib/utils";

<div className={cn("base-classes", isActive && "active-classes")} />
```

### shadcn/ui Configuration
- Style: `new-york`
- Base color: `neutral`
- CSS variables: enabled
- Icon library: `lucide`
- Aliases: `@/components/ui`, `@/lib/utils`

---

## State Management

### Context Hierarchy
```
AuthProvider (Supabase session)
  └── UserProvider (localStorage profile)
        └── AnalyticsProvider (dual storage analytics)
              └── Page components
```

### localStorage Store Pattern
Feature modules use a consistent pattern:

```typescript
// store.ts
const STORAGE_KEY = "nucleux.{feature}.v1";

interface FeatureState {
  version: 1;
  items: Item[];
}

function load(): FeatureState { /* read from localStorage */ }
function save(state: FeatureState): void { /* write to localStorage */ }
function addItem(item: Item): void { /* load, mutate, save */ }
```

### No External State Libraries
The project does not use Redux, Zustand (except for a few edge cases), React Query, or SWR. State management is:
- React Context for global state
- localStorage for persistence
- Custom `useQuery<T>()` hook for API data fetching

---

## API Route Patterns

### Standard Auth Check
```typescript
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // ... logic using user.id
}
```

### Response Format
```typescript
// Success
return NextResponse.json({ data: result });
return NextResponse.json({ data: result }, { status: 200 });

// Error
return NextResponse.json({ error: "Message" }, { status: 400 });
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
return NextResponse.json({ error: "Not found" }, { status: 404 });
```

### Internal Route Chaining
Some routes call other routes internally:
```typescript
// Forward cookies for auth propagation
await fetch(`${request.url.replace(currentPath, '/api/streaks')}`, {
  method: 'POST',
  headers: { cookie: request.headers.get('cookie') || '' },
});
```

---

## Import Conventions

### Order
1. React/Next.js imports
2. Third-party library imports
3. Internal component imports (`@/components/`)
4. Internal lib imports (`@/lib/`)
5. Type imports

### Alias Usage
Always use `@/` alias instead of relative paths:
```typescript
// Good
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

// Bad
import { Button } from "../../components/ui/button";
```

---

## TypeScript Conventions

### Type Definitions Location
- Global types: `src/lib/types/` (content.ts, library.ts, user.ts, simulator.ts, progress.ts)
- Module types: `src/lib/{module}/types.ts` (backstage, decks, mindmap, etc.)
- CBME types: `src/lib/data/cbme-types.ts`

### Type vs Interface
The project primarily uses `interface` for object shapes and `type` for unions/aliases:
```typescript
interface UserProfile { ... }
type ViewMode = "explorer" | "examPrep" | "textbook" | "quiz" | "cases" | "roadmap";
type CBMEYear = 1 | 2 | 3 | 4;
```

### No Generated Supabase Types
The codebase does **not** use auto-generated Supabase types. Database queries use implicit typing:
```typescript
const { data } = await supabase.from('profiles').select('*');
// data is typed as `any[]` - no compile-time schema validation
```

---

## Content Conventions

### Markdown
- Uses `react-markdown` with `remark-gfm` (GitHub-flavored) and `rehype-highlight` (syntax highlighting)
- Custom `MedicalMarkdown` component wraps markdown rendering with medical-specific formatting
- Rehype-raw enabled for inline HTML in markdown

### YAML Metadata
- Topic metadata in `_meta.yaml` files
- Subspecialty index in `_index.yaml` files
- NMC codes follow format: `{SUBJECT_PREFIX}{NUMBER}.{SUBNUMBER}` (e.g., "AN1.1", "SU4.3")

---

## Database Conventions

### Row Level Security (RLS)
Every user-data table has RLS enabled. Common patterns:
```sql
-- Users can only see/modify their own data
CREATE POLICY "users_own_data" ON table_name
  FOR ALL USING (auth.uid() = user_id);

-- Public content is readable by anyone
CREATE POLICY "public_read" ON content_table
  FOR SELECT USING (is_published = true);
```

### Naming
- Table names: `snake_case`, plural (`study_sessions`, `mcq_attempts`)
- Column names: `snake_case`
- Foreign keys: `{entity}_id` (e.g., `user_id`, `atom_id`, `mcq_id`)
- Timestamps: `created_at`, `updated_at`, `completed_at`, `started_at`
- Booleans: `is_` prefix (`is_correct`, `is_published`, `is_premium`)

### Composite Unique Keys
Used for de-duplication:
- `(user_id, atom_id)` on `user_atom_progress`
- `(user_id, date)` on `daily_stats` and `habit_logs`
- `(user_id, pathway_id)` on `user_pathways`
- `(user_id, lecture_id)` on `user_lecture_progress`

---

## Git and Build

### Build Pipeline
```
validate-cbme-links.ts → next build
```
CBME link validation is mandatory before build. Broken library paths fail the build.

### ESLint
- Extends `next/core-web-vitals` and `next/typescript`
- Ignores: `.next/`, `out/`, `build/`, content generation scripts

### No Pre-commit Hooks
The project does not have configured pre-commit hooks (no Husky, lint-staged, etc.).
