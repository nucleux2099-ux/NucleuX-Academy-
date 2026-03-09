import fs from 'node:fs/promises';
import path from 'node:path';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getAtomWorkspaceRoot } from '@/lib/atom/user-workspace';

export type ResponseStyle = 'concise' | 'balanced' | 'detailed' | 'socratic';
export type DifficultyPreference = 'easy' | 'medium' | 'hard' | 'adaptive';
export type PacePreference = 'slow' | 'normal' | 'fast';
export type FormatPreference = 'bullet' | 'narrative' | 'qa' | 'mixed';

export type AdaptiveLearnerProfile = {
  scopeKey: string;
  response_style: ResponseStyle;
  difficulty_preference: DifficultyPreference;
  weak_topics: string[];
  pace: PacePreference;
  format_preference: FormatPreference;
  updatedAt: string;
  version: number;
};

export type AdaptiveProfilePatch = Partial<
  Omit<AdaptiveLearnerProfile, 'scopeKey' | 'updatedAt' | 'version'>
>;

export type AdaptiveProfileEvent = {
  type: 'explicit_feedback' | 'difficulty_feedback' | 'topic_signal' | 'format_request';
  value?: string;
  topic?: string;
  helpful?: boolean;
};

const DEFAULT_PROFILE: Omit<AdaptiveLearnerProfile, 'scopeKey' | 'updatedAt'> = {
  response_style: 'balanced',
  difficulty_preference: 'adaptive',
  weak_topics: [],
  pace: 'normal',
  format_preference: 'mixed',
  version: 1,
};

function normalizeTopics(topics?: string[]): string[] {
  if (!topics) return [];
  const out = new Set<string>();
  for (const topic of topics) {
    if (typeof topic !== 'string') continue;
    const cleaned = topic.trim().toLowerCase().slice(0, 64);
    if (!cleaned) continue;
    out.add(cleaned);
  }
  return [...out].slice(0, 20);
}

function normalizeProfile(scopeKey: string, input?: Partial<AdaptiveLearnerProfile> | null): AdaptiveLearnerProfile {
  return {
    scopeKey,
    response_style: input?.response_style ?? DEFAULT_PROFILE.response_style,
    difficulty_preference: input?.difficulty_preference ?? DEFAULT_PROFILE.difficulty_preference,
    weak_topics: normalizeTopics(input?.weak_topics),
    pace: input?.pace ?? DEFAULT_PROFILE.pace,
    format_preference: input?.format_preference ?? DEFAULT_PROFILE.format_preference,
    updatedAt: input?.updatedAt ?? new Date().toISOString(),
    version: Math.max(1, input?.version ?? DEFAULT_PROFILE.version),
  };
}

function profileMirrorPath(scopeKey: string) {
  return path.join(getAtomWorkspaceRoot(scopeKey), 'memory', 'adaptive-profile.json');
}

async function writeMirror(profile: AdaptiveLearnerProfile) {
  const filePath = profileMirrorPath(profile.scopeKey);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(profile, null, 2)}\n`, 'utf8');
}

export async function getAdaptiveProfile(
  supabase: SupabaseClient,
  scopeKey: string,
): Promise<AdaptiveLearnerProfile> {
  const { data } = await (supabase as unknown as {
    from: (table: string) => {
      select: (columns: string) => { eq: (field: string, value: string) => { maybeSingle: () => Promise<{ data: Record<string, unknown> | null }> } };
    };
  })
    .from('atom_scope_profiles')
    .select('scope_key,response_style,difficulty_preference,weak_topics,pace,format_preference,updated_at,version')
    .eq('scope_key', scopeKey)
    .maybeSingle();

  const profile = normalizeProfile(scopeKey, {
    scopeKey,
    response_style: typeof data?.response_style === 'string' ? (data.response_style as ResponseStyle) : undefined,
    difficulty_preference:
      typeof data?.difficulty_preference === 'string' ? (data.difficulty_preference as DifficultyPreference) : undefined,
    weak_topics: Array.isArray(data?.weak_topics) ? (data?.weak_topics as string[]) : [],
    pace: typeof data?.pace === 'string' ? (data.pace as PacePreference) : undefined,
    format_preference: typeof data?.format_preference === 'string' ? (data.format_preference as FormatPreference) : undefined,
    updatedAt: typeof data?.updated_at === 'string' ? data.updated_at : undefined,
    version: typeof data?.version === 'number' ? data.version : undefined,
  });

  await writeMirror(profile);
  return profile;
}

export async function updateAdaptiveProfile(
  supabase: SupabaseClient,
  scopeKey: string,
  patch: AdaptiveProfilePatch,
): Promise<AdaptiveLearnerProfile> {
  const current = await getAdaptiveProfile(supabase, scopeKey);
  const next = normalizeProfile(scopeKey, {
    ...current,
    ...patch,
    weak_topics: patch.weak_topics ? normalizeTopics(patch.weak_topics) : current.weak_topics,
    updatedAt: new Date().toISOString(),
    version: (current.version ?? 1) + 1,
  });

  await (supabase as unknown as {
    from: (table: string) => { upsert: (payload: Record<string, unknown>, options: { onConflict: string }) => Promise<unknown> };
  })
    .from('atom_scope_profiles')
    .upsert(
      {
        scope_key: scopeKey,
        response_style: next.response_style,
        difficulty_preference: next.difficulty_preference,
        weak_topics: next.weak_topics,
        pace: next.pace,
        format_preference: next.format_preference,
        updated_at: next.updatedAt,
        version: next.version,
      },
      { onConflict: 'scope_key' },
    );

  await writeMirror(next);
  return next;
}

export function patchFromEvent(event: AdaptiveProfileEvent, current: AdaptiveLearnerProfile): AdaptiveProfilePatch {
  if (event.type === 'difficulty_feedback') {
    if (event.value === 'harder') return { difficulty_preference: 'hard' };
    if (event.value === 'easier') return { difficulty_preference: 'easy' };
  }

  if (event.type === 'format_request') {
    if (event.value === 'bullet') return { format_preference: 'bullet' };
    if (event.value === 'qa') return { format_preference: 'qa' };
    if (event.value === 'narrative') return { format_preference: 'narrative' };
  }

  if (event.type === 'topic_signal' && event.topic) {
    return { weak_topics: normalizeTopics([...current.weak_topics, event.topic]) };
  }

  if (event.type === 'explicit_feedback' && event.helpful === false) {
    return { response_style: current.response_style === 'detailed' ? 'balanced' : 'detailed' };
  }

  return {};
}
