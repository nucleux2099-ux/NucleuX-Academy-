import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { deriveAtomThreadIdForScope, deriveAtomUserScopeKey } from '../src/lib/atom/user-scope';

type AtomSessionRow = {
  id: string;
  user_id: string;
  room_id: string;
  thread_id: string;
  updated_at: string;
};

const shouldApply = process.argv.includes('--apply');

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await supabase
    .from('atom_sessions')
    .select('id,user_id,room_id,thread_id,updated_at')
    .order('updated_at', { ascending: false })
    .limit(5000);

  if (error) throw error;

  const rows = (data ?? []) as AtomSessionRow[];
  const legacy = rows.filter((row) => !String(row.thread_id).startsWith('scope:'));

  const remapPlan = legacy.map((row) => {
    const scopeKey = deriveAtomUserScopeKey({ userId: row.user_id, channel: 'web', peerId: row.user_id });
    const canonicalThreadId = deriveAtomThreadIdForScope(scopeKey);
    return {
      sessionId: row.id,
      userId: row.user_id,
      roomId: row.room_id,
      legacyThreadId: row.thread_id,
      canonicalThreadId,
      updatedAt: row.updated_at,
    };
  });

  const report = {
    generatedAt: new Date().toISOString(),
    totalRows: rows.length,
    legacyRows: legacy.length,
    plannedRemaps: remapPlan.length,
    applyMode: shouldApply,
    remaps: remapPlan,
  };

  await fs.mkdir(path.join(process.cwd(), 'reports'), { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(process.cwd(), 'reports', `atom-scope-migration-audit-${stamp}.json`);
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');

  let applied = 0;
  if (shouldApply) {
    for (const item of remapPlan) {
      const { error: updateError } = await supabase
        .from('atom_sessions')
        .update({ thread_id: item.canonicalThreadId })
        .eq('id', item.sessionId)
        .eq('thread_id', item.legacyThreadId);
      if (!updateError) applied += 1;
    }
  }

  console.log(JSON.stringify({ ...report, reportPath, applied }, null, 2));
}

run().catch((error) => {
  console.error('[atom-scope-migration-audit] failed', error);
  process.exit(1);
});
