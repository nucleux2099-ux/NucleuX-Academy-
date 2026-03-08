#!/usr/bin/env tsx
import path from 'node:path';
import 'dotenv/config';

import { inspectVyasaSyncCandidates } from '../src/lib/atom/vyasa-source-sync';

async function main() {
  const inputPath = process.argv[2] ?? process.env.VYASA_ATOM_LIBRARY_PATH ?? '/Users/adityachandrabhatla/clawd-vyasa/handoff/atom-source-v2';
  const root = path.resolve(inputPath);

  const result = await inspectVyasaSyncCandidates(root);
  if (!result.path) {
    console.error(`[validate-vyasa-sync-candidates] sync_candidates.json not found under: ${root}`);
    process.exit(1);
  }

  const discovered = result.entries.length;
  const published = result.entries.filter((row) => row.published === true).length;
  const indexedReady = result.entries.filter((row) => row.indexedReady === true).length;
  const qcPresent = result.entries.filter((row) => row.qcPassed !== null || typeof row.qcScore === 'number').length;

  console.log('[validate-vyasa-sync-candidates] ok');
  console.log(`[validate-vyasa-sync-candidates] file=${result.path}`);
  console.log(`[validate-vyasa-sync-candidates] discovered=${discovered} published_flagged=${published} indexed_ready_flagged=${indexedReady} qc_signal_present=${qcPresent}`);
}

main().catch((error) => {
  console.error('[validate-vyasa-sync-candidates] failed', error);
  process.exit(1);
});
