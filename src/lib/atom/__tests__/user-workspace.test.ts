import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { ensureAtomUserWorkspaceBootstrap } from '@/lib/atom/user-workspace';

test('workspace bootstrap creates required files on first run and is idempotent', async () => {
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'atom-userspaces-'));
  process.env.ATOM_USER_WORKSPACES_ROOT = tmpRoot;
  process.env.ATOM_ENABLE_BOOTSTRAP_FILE = 'true';

  const first = await ensureAtomUserWorkspaceBootstrap({
    scopeKey: 'chan:web:peer:test-user',
    userId: 'test-user',
    roomId: 'atom',
  });

  const firstCreated = first.files.filter((f) => f.created);
  assert.equal(firstCreated.length, 7);

  const second = await ensureAtomUserWorkspaceBootstrap({
    scopeKey: 'chan:web:peer:test-user',
    userId: 'test-user',
    roomId: 'atom',
  });

  assert.equal(second.files.filter((f) => f.created).length, 0);

  const required = ['AGENTS.md', 'SOUL.md', 'TOOLS.md', 'USER.md', 'IDENTITY.md', 'HEARTBEAT.md', 'BOOTSTRAP.md'];
  for (const file of required) {
    const fullPath = path.join(first.root, file);
    const stat = await fs.stat(fullPath);
    assert.equal(stat.isFile(), true);
  }
});
