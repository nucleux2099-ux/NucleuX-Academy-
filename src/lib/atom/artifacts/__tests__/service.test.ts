import test from 'node:test';
import assert from 'node:assert/strict';
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
