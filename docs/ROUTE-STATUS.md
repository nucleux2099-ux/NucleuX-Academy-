# Route Status (Data-Backed vs Mock)

This document helps humans and LLMs quickly understand which routes are production-integrated versus mostly UI scaffolds with static/mock data.

## Data-Backed / Runtime-Integrated
- `/onboarding`: writes profile and preferences to Supabase
- `/desk`: consumes `/api/profile`, `/api/study-plan`, `/api/analytics`, and lifecycle recommendations/graph metrics via `/api/learning/read-model/topics`, `/api/learning/overview`, and method-efficacy telemetry via `/api/learning/read-model/efficacy`
- `/analytics`: consumes `/api/analytics`
- `/profile`: consumes `/api/profile` + `/api/analytics`
- `/settings`: consumes and patches `/api/profile`
- `/chat`: streams `/api/chat`
- `/library/[subject]/[subspecialty]/[topic]`: loads content through loader + `/api/library/content`
- `/library/[subject]/[subspecialty]/[topic]`: includes Learning Method rail with canonical stage-state read model (`/api/learning/read-model/topics`), rubric-gated stage completion (VPReFRE/GRINDE), lifecycle actions (`/api/learning/topics`), and checkpoint writes (`/api/learning/checkpoints`)
- `/classroom/live-ai`: uses `/api/speech/stt` and `/api/speech/tts`
- `auth callback`: `/auth/callback` exchanges Supabase OAuth code and redirects to onboarding/app
- `/api/learning/*`: lifecycle persistence scaffold for PreStudy/Aim/Shoot/Skin, canonical read-model endpoint (`/api/learning/read-model/topics`), rubric-scored checkpoint flow, desk overview aggregation (`/api/learning/overview`), and method-efficacy analytics read model (`/api/learning/read-model/efficacy`)

## Mixed (partially integrated)
- `/mcqs`: UI is mostly static, but event telemetry is sent via `/api/analytics`
- `/classroom` and subroutes: some views are static UX shells; selected tools call APIs
- `/backstage`: includes rich UI with largely static data presentation in current snapshot
- `/exam-centre` and subroutes: now partially data-backed via `/api/exam-centre/overview`, `/api/exam-centre/catalog`, `/api/exam-centre/pyq`, `/api/exam-centre/simulator`, `/api/exam-centre/practical`, exam analytics read model `/api/exam-centre/read-model/analytics`, and result snapshots (`/api/exam-centre/read-model/simulator`, `/api/exam-centre/read-model/flow`, `/api/exam-centre/read-model/osce`); `pyq`, `mcq`, `simulator`, `flow`, and `osce` pages write attempts/session lifecycle through `/api/exam-centre/sessions*`, while most clinical content remains template-driven
- Learning-method UI stores (`src/lib/prestudy/*`, `src/lib/aim/*`, `src/lib/shoot/*`, `src/lib/skin/*`, `src/lib/mindmap/*`) are localStorage-first with debounced write-through sync to `/api/learning/*`, stage-run/checkpoint linkage, and topic-load hydration from cloud state

## Mostly Static/Marketing/Informational
- Marketing pages (`/`, `/landing`, `/campus`, `/rooms`, `/about`, `/pricing`, `/faq`, `/contact`, `/atom`)
- Legal/info pages (`/privacy`, `/terms`, `/offline`)

## Practical Guidance
When debugging behavior, first determine route class:
1. If data-backed, inspect API handlers and Supabase tables/RLS.
2. If mixed/static, inspect page-local constants and component state first.
3. Avoid assuming UX widgets imply backend persistence.

## How To Re-Validate This Status
- Inspect route files under `src/app` for:
  - `useProfile/useAnalytics/useStudyPlan` hooks
  - direct `fetch('/api/...')` calls
  - static arrays/constants driving the page
