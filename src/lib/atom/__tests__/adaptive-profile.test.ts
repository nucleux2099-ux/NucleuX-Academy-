import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { getAdaptiveProfile, updateAdaptiveProfile } from '@/lib/atom/adaptive-profile';

function createFakeSupabase() {
  const table = new Map<string, Record<string, unknown>>();

  return {
    from: () => ({
      select: () => ({
        eq: (field: string, value: string) => ({
          maybeSingle: async () => {
            if (field !== 'scope_key') return { data: null };
            return { data: table.get(value) ?? null };
          },
        }),
      }),
      upsert: async (payload: Record<string, unknown>) => {
        table.set(String(payload.scope_key), payload);
        return { data: payload };
      },
    }),
  };
}

test('adaptive profile read/write is scope-specific', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'atom-profile-'));
  process.env.ATOM_USER_WORKSPACES_ROOT = root;

  const supabase = createFakeSupabase();

  const beforeA = await getAdaptiveProfile(supabase as never, 'chan:telegram:peer:a');
  assert.equal(beforeA.response_style, 'balanced');

  await updateAdaptiveProfile(supabase as never, 'chan:telegram:peer:a', {
    response_style: 'concise',
    weak_topics: ['cardiology'],
  });

  const afterA = await getAdaptiveProfile(supabase as never, 'chan:telegram:peer:a');
  const afterB = await getAdaptiveProfile(supabase as never, 'chan:telegram:peer:b');

  assert.equal(afterA.response_style, 'concise');
  assert.deepEqual(afterA.weak_topics, ['cardiology']);
  assert.equal(afterB.response_style, 'balanced');
});
