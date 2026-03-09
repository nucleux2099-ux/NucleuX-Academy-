import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

const ROUTES = [
  'src/app/api/atom/session/[sessionId]/message/route.ts',
  'src/app/api/atom/session/[sessionId]/continue/route.ts',
  'src/app/api/atom/heartbeat/run/route.ts',
  'src/app/api/atom/profile/route.ts',
  'src/app/api/atom/session/[sessionId]/artifacts/[artifactId]/download/route.ts',
];

test('touched routes include telemetry logger usage', async () => {
  for (const route of ROUTES) {
    const content = await fs.readFile(path.join(ROOT, route), 'utf8');
    assert.match(content, /createAtomTelemetryLogger/);
    assert.match(content, /telemetry\.log/);
  }
});
