import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { appendAtomMemory, ensureAtomMemoryStructure } from '@/lib/atom/memory-store';
import { formatMemoryContextForPrompt, retrieveScopedMemoryContext } from '@/lib/atom/memory-retrieval';

test('memory structure + retrieval is scope-local with source metadata', async () => {
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'atom-memory-'));
  process.env.ATOM_USER_WORKSPACES_ROOT = tmpRoot;

  await ensureAtomMemoryStructure('chan:telegram:peer:alpha');
  await appendAtomMemory({ scopeKey: 'chan:telegram:peer:alpha', section: 'User', content: 'User likes spaced repetition and anatomy mnemonics' });

  await ensureAtomMemoryStructure('chan:telegram:peer:beta');
  await appendAtomMemory({ scopeKey: 'chan:telegram:peer:beta', section: 'User', content: 'User prefers pediatrics case drills only' });

  const alpha = await retrieveScopedMemoryContext({ scopeKey: 'chan:telegram:peer:alpha', query: 'anatomy mnemonic' });
  const beta = await retrieveScopedMemoryContext({ scopeKey: 'chan:telegram:peer:beta', query: 'anatomy mnemonic' });

  assert.equal(alpha.length > 0, true);
  assert.equal(alpha.some((s) => s.text.toLowerCase().includes('anatomy')), true);
  assert.equal(beta.some((s) => s.text.toLowerCase().includes('anatomy')), false);
  assert.equal(typeof alpha[0].startLine, 'number');
  assert.equal(typeof alpha[0].sourceFile, 'string');

  const prompt = formatMemoryContextForPrompt(alpha, 500);
  assert.match(prompt, /\[memory\//i);
});
