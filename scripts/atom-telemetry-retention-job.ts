#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';
import { getRetentionStatus, pruneRawTelemetry } from '@/lib/atom/telemetry-rollups';

function arg(name: string, fallback?: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] ?? fallback;
}

async function main() {
  const retentionDays = Number(arg('retention-days', process.env.ATOM_TELEMETRY_RETENTION_DAYS ?? '30'));
  const enforce = process.argv.includes('--enforce');
  const scopeKey = arg('scope-key');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const status = await getRetentionStatus({ supabase, retentionDays, scopeKey });
  const prune = await pruneRawTelemetry({ supabase, retentionDays, dryRun: !enforce, scopeKey });

  console.log(JSON.stringify({
    kind: 'atom.telemetry.retention.job.v1',
    mode: enforce ? 'enforce' : 'dry-run',
    scopeKey: scopeKey ?? 'all',
    status,
    prune,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
