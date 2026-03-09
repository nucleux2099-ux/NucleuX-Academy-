import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runScopedHeartbeat, isWithinActiveHours, isCadenceDue } from '@/lib/atom/heartbeat-service';

test('heartbeat scope isolation reads only scoped files', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'atom-hb-'));
  process.env.ATOM_USER_WORKSPACES_ROOT = root;

  const scopeA = 'chan:telegram:peer:alice';
  const scopeB = 'chan:telegram:peer:bob';

  await fs.mkdir(path.join(root, scopeA), { recursive: true });
  await fs.mkdir(path.join(root, scopeB), { recursive: true });
  await fs.writeFile(path.join(root, scopeA, 'HEARTBEAT.md'), '# A', 'utf8');
  await fs.writeFile(path.join(root, scopeB, 'HEARTBEAT.md'), '# B', 'utf8');

  const result = await runScopedHeartbeat({
    scopeKey: scopeA,
    config: { cadenceMinutes: 1 },
    evaluateAction: async () => ({ action: false, summary: 'none' }),
  });

  assert.equal(result.status, 'HEARTBEAT_OK');
  assert.deepEqual(result.readFiles, ['HEARTBEAT.md']);
});

test('heartbeat active-hours and cadence logic', async () => {
  assert.equal(isWithinActiveHours(new Date('2026-01-01T10:00:00Z'), { startHour: 9, endHour: 18 }), true);
  assert.equal(isWithinActiveHours(new Date('2026-01-01T22:00:00Z'), { startHour: 9, endHour: 18 }), false);

  const now = new Date('2026-01-01T10:30:00Z');
  assert.equal(isCadenceDue(now, undefined, 30), true);
  assert.equal(isCadenceDue(now, '2026-01-01T10:10:00Z', 30), false);
  assert.equal(isCadenceDue(now, '2026-01-01T09:40:00Z', 30), true);
});
