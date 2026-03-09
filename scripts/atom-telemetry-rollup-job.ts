#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';
import { materializeRollupsForScopes, type RollupGranularity } from '@/lib/atom/telemetry-rollups';

function arg(name: string, fallback?: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  return process.argv[idx + 1] ?? fallback;
}

async function main() {
  const granularity = (arg('granularity', 'hour') ?? 'hour') as RollupGranularity;
  if (granularity !== 'hour' && granularity !== 'day') throw new Error('granularity must be hour|day');

  const windowHours = Number(arg('window-hours', granularity === 'hour' ? '2' : '26'));
  const scopeArg = arg('scope-key');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  let scopeKeys: string[] = [];

  if (scopeArg) {
    scopeKeys = [scopeArg];
  } else {
    const { data, error } = await supabase
      .from('atom_telemetry_events')
      .select('scope_key')
      .gte('created_at', new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString());
    if (error) throw new Error(error.message);
    scopeKeys = [...new Set((data ?? []).map((r) => String(r.scope_key)).filter(Boolean))];
  }

  const to = new Date().toISOString();
  const from = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();
  const result = await materializeRollupsForScopes({ supabase, scopeKeys, from, to, granularity });

  console.log(JSON.stringify({ kind: 'atom.telemetry.rollup.job.v1', granularity, from, to, scopes: scopeKeys.length, result }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
