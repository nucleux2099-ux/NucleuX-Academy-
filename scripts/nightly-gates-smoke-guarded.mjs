#!/usr/bin/env node
import dotenv from 'dotenv';
import { spawnSync } from 'node:child_process';

dotenv.config({ path: '.env.local' });

function run(cmd, args) {
  const result = spawnSync(cmd, args, {
    stdio: 'inherit',
    env: process.env,
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('npm', ['run', '-s', 'test:atom:nightly-gates']);

const hasCreds = Boolean(process.env.E2E_EMAIL && process.env.E2E_PASSWORD);
if (!hasCreds) {
  console.log('Skipping credentialed smoke: E2E_EMAIL/E2E_PASSWORD not present in .env.local or environment.');
  process.exit(0);
}

const authProbe = spawnSync('npm', ['run', '-s', 'test:auth:probe'], {
  stdio: 'inherit',
  env: process.env,
  shell: process.platform === 'win32',
});

if (authProbe.status !== 0) {
  console.error('Credentialed smoke aborted: auth probe failed (likely invalid or stale E2E credentials).');
  process.exit(authProbe.status ?? 1);
}

run('npm', ['run', '-s', 'test:smoke']);
