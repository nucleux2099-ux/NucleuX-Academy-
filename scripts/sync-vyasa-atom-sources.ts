#!/usr/bin/env tsx
import 'dotenv/config';

import { createClient } from '@supabase/supabase-js';
import { syncVyasaAtomSources } from '../src/lib/atom/vyasa-source-sync';

async function main() {
  const dryRun = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const supabase =
    supabaseUrl && serviceRoleKey
      ? createClient(supabaseUrl, serviceRoleKey)
      : dryRun
        ? ({} as Parameters<typeof syncVyasaAtomSources>[0])
        : null;

  if (!supabase) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  const report = await syncVyasaAtomSources(supabase, {
    vyasaLibraryPath: process.env.VYASA_ATOM_LIBRARY_PATH,
    dryRun,
  });

  const c = report.counts;
  console.log('[atom:sources:sync-vyasa] done');
  console.log(`[atom:sources:sync-vyasa] root=${report.libraryRoot ?? 'unavailable'} discovered=${c.discovered} imported=${c.imported} published=${c.published} selectable=${c.selectable} skipped=${c.skipped} skipped_unmapped=${c.skippedUnmapped}`);
  if (Object.keys(report.skippedByReason).length > 0) {
    console.log(`[atom:sources:sync-vyasa] skip_buckets=${JSON.stringify(report.skippedByReason)}`);
  }
  if (!report.ok) {
    console.log('[atom:sources:sync-vyasa] fallback mode: Vyasa library not found; no rows imported.');
  }
}

main().catch((error) => {
  console.error('[atom:sources:sync-vyasa] failed', error);
  process.exit(1);
});
