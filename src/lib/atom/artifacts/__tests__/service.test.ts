import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createAtomArtifactService, NoopAtomArtifactService, SupabaseAtomArtifactService } from '@/lib/atom/artifacts/service';

test('artifact service factory returns noop when Phase C flag disabled', () => {
  process.env.ATOM_PHASE_C_ARTIFACTS_ENABLED = 'false';
  const svc = createAtomArtifactService({} as never);
  assert.equal(svc instanceof NoopAtomArtifactService, true);
});

test('artifact service factory returns supabase service when Phase C flag enabled', () => {
  process.env.ATOM_PHASE_C_ARTIFACTS_ENABLED = 'true';
  const svc = createAtomArtifactService({} as never);
  assert.equal(svc instanceof SupabaseAtomArtifactService, true);
});

test('noop service persists required id/createdAt defaults', async () => {
  const svc = new NoopAtomArtifactService();
  const artifact = await svc.persistArtifact({
    scopeKey: 'chan:web:peer:self',
    taskId: 'task-1',
    sessionId: 'sess-1',
    artifact: {
      id: '',
      kind: 'text',
      mime: 'text/plain',
      title: 'sample',
      content: 'hello',
    },
  });

  assert.equal(typeof artifact.id, 'string');
  assert.equal(artifact.id.length > 0, true);
  assert.equal(typeof artifact.createdAt, 'string');
});

test('supabase artifact service sanitizes scope, session, and artifact path segments when persisting workspace copies', async () => {
  const upserts: Array<Record<string, unknown>> = [];
  const supabase = {
    from(table: string) {
      assert.equal(table, 'atom_task_artifacts_v1');
      return {
        upsert: async (payload: Record<string, unknown>) => {
          upserts.push(payload);
          return { error: null };
        },
      };
    },
  } as never;

  const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'atom-artifacts-'));
  const service = new SupabaseAtomArtifactService(supabase, {
    workspaceRoot,
    inlineMaxBytes: 8,
    writeWorkspaceCopy: true,
  });

  try {
    const artifact = await service.persistArtifact({
      scopeKey: '../../Scope Root',
      sessionId: ' ../Session:Alpha? ',
      artifact: {
        id: ' ../artifact#1 ',
        kind: 'text',
        mime: 'text/plain',
        title: 'Artifact',
        content: 'deterministic artifact body',
      },
    });

    assert.equal(artifact.id, ' ../artifact#1 ');
    assert.equal(upserts.length, 1);
    assert.equal(
      upserts[0]?.blob_path,
      path.join('.._.._scope_root', '..-Session-Alpha', '..-artifact-1.txt'),
    );

    const persistedPath = path.join(
      workspaceRoot,
      '.._.._scope_root',
      '..-Session-Alpha',
      '..-artifact-1.txt',
    );
    const persistedContent = await fs.readFile(persistedPath, 'utf8');
    assert.equal(persistedContent, 'deterministic artifact body');
  } finally {
    await fs.rm(workspaceRoot, { recursive: true, force: true });
  }
});
